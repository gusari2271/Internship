import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild, HostListener, inject, Signal, signal, WritableSignal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ProjectService, Project } from '../../services/project.service';
import { Subscription } from 'rxjs';

interface FloatingCube {
  mesh: THREE.Mesh;
  line: THREE.LineSegments;
  hitboxMesh: THREE.Mesh;
  initialY: number;
  speed: number;
  phase: number;
  project?: Project;
  baseScale: THREE.Vector3;
  baseRotation: THREE.Euler;
}

function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface PaneLayoutSeed {
  paneIndex: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { width: number; height: number; depth: number };
  speed: number;
  phase: number;
}

export function generatePaneLayoutConfig(count = 40): PaneLayoutSeed[] {
  const rng = mulberry32(1337);
  const config: PaneLayoutSeed[] = [];
  const spacing = 5;
  const cols = 5;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols) % cols;
    const layer = Math.floor(i / (cols * cols));

    const x = (col - 2) * spacing + (rng() - 0.5) * 2.5;
    const y = (row - 2) * spacing + (rng() - 0.5) * 2.5;
    const z = (layer - 1) * spacing + (rng() - 0.5) * 4;

    const width = 1.5 + rng() * 1.5;
    const height = 1.5 + rng() * 1.5;
    const depth = ((width + height) / 2) * (0.03 + rng() * 0.02);

    const rx = rng() * Math.PI * 2;
    const ry = rng() * Math.PI * 2;
    const rz = rng() * Math.PI * 2;

    const speed = 0.4 + rng() * 0.6;
    const phase = rng() * Math.PI * 2;

    config.push({
      paneIndex: i,
      position: { x, y, z },
      rotation: { x: rx, y: ry, z: rz },
      scale: { width, height, depth },
      speed,
      phase,
    });
  }

  return config;
}

export const PANE_LAYOUT_CONFIG = generatePaneLayoutConfig(40);

@Component({
  selector: 'app-cube-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cube-field.component.html',
  styleUrls: ['./cube-field.component.scss']
})
export class CubeFieldComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private projectService = inject(ProjectService);
  private router = inject(Router);
  private subscription = new Subscription();

  // Input & Output properties
  @Input() selectionMode = false;
  @Input() selectedIndex: number | null = null;
  @Output() indexSelect = new EventEmitter<number>();

  // Signals for state
  hoveredProject: WritableSignal<Project | null> = signal(null);
  tooltipX = signal(0);
  tooltipY = signal(0);
  isLoading = signal(true);

  // Three.js instances
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animationFrameId?: number;

  // Track created materials and textures for cleanup
  private materialsToDispose = new Set<THREE.Material>();
  private texturesToDispose = new Set<THREE.Texture>();

  // Dynamic FPS Fallback properties
  private fpsFrames = 0;
  private fpsStartTime = 0;
  private isDynamicLowEnd = false;
  private hasAttemptedFallback = false;

  // Interactivity
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private cubes: FloatingCube[] = [];
  private hoveredCube: FloatingCube | null = null;
  private projects: Project[] = [];

  ngOnInit() {
    // Fetch projects from backend
    this.subscription.add(
      this.projectService.getProjects().subscribe({
        next: (data) => {
          this.projects = data;
          this.isLoading.set(false);
          this.buildCubeField();
        },
        error: (err) => {
          console.error('Failed to load projects from backend, using offline fallback', err);
          // Fallback placeholders if backend is down or not seeded yet
          this.projects = [
            { id: 1, title: 'Untitled Project I', category: 'Residential', location: 'Tokyo, Japan', year: 2024, cubeIndex: 5 },
            { id: 2, title: 'Untitled Project II', category: 'Cultural', location: 'Copenhagen, Denmark', year: 2025, cubeIndex: 12 },
            { id: 3, title: 'Untitled Project III', category: 'Commercial', location: 'Jakarta, Indonesia', year: 2026, cubeIndex: 20 },
            { id: 4, title: 'Untitled Project IV', category: 'Residential', location: 'Berlin, Germany', year: 2023, cubeIndex: 28 },
            { id: 5, title: 'Untitled Project V', category: 'Institutional', location: 'Melbourne, Australia', year: 2027, cubeIndex: 35 }
          ];
          this.isLoading.set(false);
          this.buildCubeField();
        }
      })
    );
  }

  ngAfterViewInit() {
    this.initThree();
    this.onWindowResize();
    this.animate();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Clean up Three.js resources
    this.cubes.forEach(c => {
      c.mesh.geometry.dispose();
      c.line.geometry.dispose();
      c.hitboxMesh.geometry.dispose();
    });

    this.materialsToDispose.forEach(m => m.dispose());
    this.materialsToDispose.clear();

    this.texturesToDispose.forEach(t => t.dispose());
    this.texturesToDispose.clear();

    if (this.controls) {
      this.controls.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initThree() {
    const container = this.canvasContainer.nativeElement;
    const canvas = this.canvasRef.nativeElement;

    // Create Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    // Create Camera - Perspective projection with slight isometric/bird's-eye feel
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    
    // Position camera for an isometric/bird's-eye angle
    this.camera.position.set(15, 12, 20);
    this.camera.lookAt(0, 0, 0);

    // Create Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // Add environment map using RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    const roomEnv = new RoomEnvironment();
    this.scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // OrbitControls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.1; // Limit panning below ground slightly
    this.controls.minDistance = 5;
    this.controls.maxDistance = 50;

    // Add subtle lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // Two directional lights from opposite corners to create glare/highlights on the edges
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(15, 25, 15);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight2.position.set(-15, -25, -15);
    this.scene.add(dirLight2);
  }

  private createGlassPaneGeometry(width: number, height: number, thickness: number): THREE.BoxGeometry {
    return new THREE.BoxGeometry(width, height, thickness);
  }

  private createGlassPaneMaterials(isLowEnd: boolean): THREE.Material[] {
    const materials: THREE.Material[] = [];
    let faceMaterial: THREE.Material;
    let edgeMaterial: THREE.Material;

    if (isLowEnd) {
      faceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe0e6e6,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.45,
        transmission: 0,
        ior: 1.5,
        side: THREE.DoubleSide
      });

      edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a7c74,
        emissive: 0x4a7c74,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.85,
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
    } else {
      faceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xebf2f2,
        transmission: 0.85,
        roughness: 0.08,
        metalness: 0.05,
        thickness: 0.1,
        ior: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });

      edgeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x3d6b63,
        roughness: 0.15,
        metalness: 0.1,
        transmission: 0.2,
        ior: 1.5,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });
    }

    this.materialsToDispose.add(faceMaterial);
    this.materialsToDispose.add(edgeMaterial);

    // BoxGeometry order: Right, Left, Top, Bottom, Front, Back
    materials.push(edgeMaterial); // Right (0)
    materials.push(edgeMaterial); // Left (1)
    materials.push(edgeMaterial); // Top (2)
    materials.push(edgeMaterial); // Bottom (3)
    materials.push(faceMaterial); // Front (4)
    materials.push(faceMaterial); // Back (5)

    return materials;
  }

  private createProjectFaceMaterial(imageUrl: string): THREE.Material {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(imageUrl);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.texturesToDispose.add(texture);

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      roughness: 0.2,
      metalness: 0.1
    });
    this.materialsToDispose.add(material);
    return material;
  }

  private checkIsLowEnd(totalCubes: number): boolean {
    if (totalCubes > 50) {
      console.log('Low-end mode enabled: total cubes count > 50.');
      return true;
    }
    if (typeof window !== 'undefined' && window.navigator) {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const lowConcurrency = (navigator.hardwareConcurrency || 4) <= 4;
      if (isMobile || lowConcurrency) {
        console.log(`Low-end mode enabled: mobile device or low hardware concurrency detected.`);
        return true;
      }
    }
    return false;
  }

  private buildCubeField() {
    if (!this.scene) return;

    // Clear existing cubes if any
    this.cubes.forEach(c => {
      this.scene.remove(c.mesh);
      c.mesh.geometry.dispose();
      c.line.geometry.dispose();
      c.hitboxMesh.geometry.dispose();
    });
    this.cubes = [];

    // Clear previously disposed materials/textures if rebuilding to avoid leak
    this.materialsToDispose.forEach(m => m.dispose());
    this.materialsToDispose.clear();
    this.texturesToDispose.forEach(t => t.dispose());
    this.texturesToDispose.clear();

    const totalCubes = PANE_LAYOUT_CONFIG.length;
    const isLowEnd = this.selectionMode || this.isDynamicLowEnd || this.checkIsLowEnd(totalCubes);

    const projectMap = new Map<number, Project>();
    this.projects.forEach(project => {
      if (project.cubeIndex !== undefined && project.cubeIndex !== null) {
        projectMap.set(project.cubeIndex, project);
      }
    });

    PANE_LAYOUT_CONFIG.forEach((seed) => {
      const { paneIndex, position, rotation, scale, speed, phase } = seed;
      const geometry = this.createGlassPaneGeometry(scale.width, scale.height, scale.depth);

      const project = projectMap.get(paneIndex);
      const isProjectCube = !!project;

      const materials = this.createGlassPaneMaterials(isLowEnd);

      if (project && project.thumbnailUrl) {
        const projectFaceMat = this.createProjectFaceMaterial(project.thumbnailUrl);
        materials[4] = projectFaceMat;
      }

      const mesh = new THREE.Mesh(geometry, materials);
      mesh.position.set(position.x, position.y, position.z);
      mesh.rotation.set(rotation.x, rotation.y, rotation.z);

      mesh.userData = {
        project: project,
        isProjectCube: isProjectCube,
        paneIndex: paneIndex,
        baseRotation: { x: rotation.x, y: rotation.y, z: rotation.z }
      };

      // Create enlarged invisible hitbox geometry for seamless raycasting from any angle
      // Added +30% width/height and deep thickness (0.5 minimum) so it's easily clicked edge-on or angled
      const hitboxW = scale.width * 1.3;
      const hitboxH = scale.height * 1.3;
      const hitboxD = Math.max(scale.depth * 3.5, 0.5);
      const hitboxGeometry = new THREE.BoxGeometry(hitboxW, hitboxH, hitboxD);

      const hitboxMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      this.materialsToDispose.add(hitboxMaterial);

      const hitboxMesh = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
      hitboxMesh.userData = {
        project: project,
        isProjectCube: isProjectCube,
        paneIndex: paneIndex
      };
      // Attach hitbox directly as a child of mesh so it follows position/rotation/scaling automatically
      mesh.add(hitboxMesh);

      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x334444,
        transparent: true,
        opacity: isProjectCube ? 0.9 : 0.5,
        linewidth: 1
      });
      this.materialsToDispose.add(lineMaterial);

      const line = new THREE.LineSegments(edges, lineMaterial);
      mesh.add(line);

      this.scene.add(mesh);

      this.cubes.push({
        mesh: mesh,
        line: line,
        hitboxMesh: hitboxMesh,
        initialY: position.y,
        speed: speed,
        phase: phase,
        project: project,
        baseScale: new THREE.Vector3(1, 1, 1),
        baseRotation: new THREE.Euler(rotation.x, rotation.y, rotation.z)
      });
    });
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const time = Date.now() * 0.001;

    // Measure FPS for dynamic low-end fallback
    if (!this.hasAttemptedFallback) {
      this.fpsFrames++;
      const now = performance.now();
      if (this.fpsStartTime === 0) {
        this.fpsStartTime = now;
      } else {
        const elapsed = now - this.fpsStartTime;
        if (elapsed >= 2000) { // check every 2 seconds
          const fps = (this.fpsFrames * 1000) / elapsed;
          console.log(`Current FPS: ${fps.toFixed(1)}`);
          if (fps < 30) {
            console.warn('FPS dropped below 30. Activating dynamic low-end fallback...');
            this.isDynamicLowEnd = true;
            this.hasAttemptedFallback = true;
            this.buildCubeField();
          } else {
            // Reset for next period
            this.fpsFrames = 0;
            this.fpsStartTime = now;
          }
        }
      }
    }

    // Subtle idle animation: cubes move up and down slowly (floating effect) and wobble around base rotation
    this.cubes.forEach((cube, index) => {
      // Y-axis float
      cube.mesh.position.y = cube.initialY + Math.sin(time * cube.speed + cube.phase) * 0.4;
      
      // Subtle wobble offset around the base random rotation
      const wobbleX = Math.sin(time * (cube.speed * 0.5) + cube.phase) * 0.02;
      const wobbleY = Math.cos(time * (cube.speed * 0.5) + cube.phase) * 0.02;
      const wobbleZ = Math.sin(time * (cube.speed * 0.3) + cube.phase) * 0.015;

      cube.mesh.rotation.set(
        cube.baseRotation.x + wobbleX,
        cube.baseRotation.y + wobbleY,
        cube.baseRotation.z + wobbleZ
      );

      // Highlight selected pane in selection mode
      const lineMat = cube.line.material as THREE.LineBasicMaterial;
      if (this.selectionMode && this.selectedIndex === index) {
        lineMat.color.setHex(0xffd700); // Gold outline for selected pane
        lineMat.opacity = 1.0;
      } else if (this.hoveredCube === cube) {
        lineMat.color.setHex(0x00f3ff); // Cyan hover
        lineMat.opacity = 1.0;
      } else {
        const isProject = cube.mesh.userData['isProjectCube'];
        lineMat.color.setHex(0x334444);
        lineMat.opacity = isProject ? 0.9 : 0.5;
      }

      // Smoothly interpolate scale for hover highlights
      let targetScale = 1.0;
      if (this.hoveredCube === cube || (this.selectionMode && this.selectedIndex === index)) {
        targetScale = 1.15;
      }
      
      cube.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    if (this.controls) {
      this.controls.update();
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  @HostListener('window:resize')
  onWindowResize() {
    if (!this.canvasContainer || !this.renderer || !this.camera) return;

    const width = this.canvasContainer.nativeElement.clientWidth;
    const height = this.canvasContainer.nativeElement.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  onMouseMove(event: MouseEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    
    // Normalized mouse coords for Three.js raycasting
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Track page mouse coordinates for CSS tooltip
    this.tooltipX.set(event.clientX + 15);
    this.tooltipY.set(event.clientY + 15);

    this.checkIntersections();
  }

  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const rect = this.renderer.domElement.getBoundingClientRect();
      
      this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      this.tooltipX.set(touch.clientX + 15);
      this.tooltipY.set(touch.clientY + 15);

      this.checkIntersections();
    }
  }

  private checkIntersections() {
    if (!this.camera || !this.scene || this.cubes.length === 0) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    // Raycast targeting all hitbox meshes for effortless multi-angle hit detection
    const hitboxes = this.cubes.map(c => c.hitboxMesh);
    const intersects = this.raycaster.intersectObjects(hitboxes);

    if (intersects.length > 0) {
      const firstIntersect = intersects[0];
      const intersectedHitbox = firstIntersect.object as THREE.Mesh;
      const cubeObj = this.cubes.find(c => c.hitboxMesh === intersectedHitbox || c.mesh === intersectedHitbox);

      if (cubeObj) {
        const isProject = !!cubeObj.project;
        
        if (this.selectionMode || isProject) {
          if (this.hoveredCube !== cubeObj) {
            this.hoveredCube = cubeObj;
            if (cubeObj.project) {
              this.hoveredProject.set(cubeObj.project);
            } else {
              this.hoveredProject.set(null);
            }

            const lineMat = cubeObj.line.material as THREE.LineBasicMaterial;
            lineMat.color.setHex(0x00f3ff);
            lineMat.opacity = 1.0;

            document.body.style.cursor = 'pointer';
          }
          return;
        }
      }
    }

    if (this.hoveredCube) {
      this.hoveredCube = null;
      this.hoveredProject.set(null);
      document.body.style.cursor = 'default';
    }
  }

  onCanvasClick() {
    if (this.selectionMode) {
      if (this.hoveredCube) {
        const cubeIndex = this.cubes.findIndex(c => c === this.hoveredCube);
        if (cubeIndex !== -1) {
          this.indexSelect.emit(cubeIndex);
        }
      }
    } else {
      // If hovering on a project, navigate to detail page
      if (this.hoveredCube && this.hoveredCube.project) {
        document.body.style.cursor = 'default';
        this.router.navigate(['/projects', this.hoveredCube.project.id]);
      }
    }
  }
}
