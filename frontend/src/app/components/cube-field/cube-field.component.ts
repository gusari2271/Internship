import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild, HostListener, inject, Signal, signal, WritableSignal } from '@angular/core';
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
  initialY: number;
  speed: number;
  phase: number;
  project?: Project;
  baseScale: THREE.Vector3;
  baseRotation: THREE.Euler;
}

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
            { id: 1, title: 'Untitled Project I', category: 'Residential', location: 'Tokyo, Japan', year: 2024 },
            { id: 2, title: 'Untitled Project II', category: 'Cultural', location: 'Copenhagen, Denmark', year: 2025 },
            { id: 3, title: 'Untitled Project III', category: 'Commercial', location: 'Jakarta, Indonesia', year: 2026 },
            { id: 4, title: 'Untitled Project IV', category: 'Residential', location: 'Berlin, Germany', year: 2023 },
            { id: 5, title: 'Untitled Project V', category: 'Institutional', location: 'Melbourne, Australia', year: 2027 }
          ];
          this.isLoading.set(false);
          this.buildCubeField();
        }
      })
    );
  }

  ngAfterViewInit() {
    this.initThree();
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
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.35,
        transmission: 0,
        ior: 1.5,
        side: THREE.DoubleSide
      });

      edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0x8fc4ab,
        emissive: 0x8fc4ab,
        emissiveIntensity: 0.15,
        transparent: true,
        opacity: 0.7,
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
    } else {
      faceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.98,
        roughness: 0.04,
        metalness: 0.0,
        thickness: 0.05,
        ior: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });

      edgeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8fc4ab,
        roughness: 0.15,
        metalness: 0.1,
        transmission: 0.2,
        ior: 1.5,
        transparent: true,
        opacity: 0.75,
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
    });
    this.cubes = [];

    // Clear previously disposed materials/textures if rebuilding to avoid leak
    this.materialsToDispose.forEach(m => m.dispose());
    this.materialsToDispose.clear();
    this.texturesToDispose.forEach(t => t.dispose());
    this.texturesToDispose.clear();

    // Total cubes in the field (limited to max 40 objects)
    const totalCubes = 40;
    const isLowEnd = this.isDynamicLowEnd || this.checkIsLowEnd(totalCubes);
    
    // Let's pre-generate random index positions for projects, ensuring spread
    const projectCount = this.projects.length;
    const projectIndices = new Set<number>();
    while (projectIndices.size < projectCount) {
      const idx = Math.floor(Math.random() * totalCubes);
      projectIndices.add(idx);
    }
    const projectIndicesArr = Array.from(projectIndices);

    // Grid bounds & dimensions
    const spacing = 5; // space between grid columns
    const slots: {x: number, y: number, z: number}[] = [];

    for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 2; y++) {
        for (let z = -2; z <= 2; z++) {
          slots.push({ x: x * spacing, y: y * spacing, z: z * spacing });
        }
      }
    }

    // Shuffle slots
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }

    for (let i = 0; i < totalCubes; i++) {
      if (i >= slots.length) break;

      const slot = slots[i];
      
      // Jitter positions slightly to make it "broken/messy"
      const jitterX = (Math.random() - 0.5) * 3;
      const jitterY = (Math.random() - 0.5) * 2;
      const jitterZ = (Math.random() - 0.5) * 3;

      const x = slot.x + jitterX;
      const y = slot.y + jitterY;
      const z = slot.z + jitterZ;

      // Random sizes (BoxGeometry) - Glass sheets/panes
      const scaleX = 1.5 + Math.random() * 1.5;
      const scaleY = 1.5 + Math.random() * 1.5;
      // depth (ketebalan): SANGAT TIPIS, sekitar 3-5% dari width/height
      const thickness = ((scaleX + scaleY) / 2) * (0.03 + Math.random() * 0.02);
      const geometry = this.createGlassPaneGeometry(scaleX, scaleY, thickness);

      // Check if this cube holds project data
      const projectIndex = projectIndicesArr.indexOf(i);
      const isProjectCube = projectIndex !== -1;
      const project = isProjectCube ? this.projects[projectIndex] : undefined;

      const materials = this.createGlassPaneMaterials(isLowEnd);

      if (project && project.thumbnailUrl) {
        // Terapkan texture gambar HANYA pada satu sisi konsisten (Front face: indeks 4)
        const projectFaceMat = this.createProjectFaceMaterial(project.thumbnailUrl);
        materials[4] = projectFaceMat;
      }

      const mesh = new THREE.Mesh(geometry, materials);
      mesh.position.set(x, y, z);

      // Randomize rotation across all 3 axes independently with full range
      const rx = Math.random() * Math.PI * 2;
      const ry = Math.random() * Math.PI * 2;
      const rz = Math.random() * Math.PI * 2;
      mesh.rotation.set(rx, ry, rz);

      // Save custom user data for raycasting and store base rotation
      mesh.userData = {
        project: project,
        isProjectCube: isProjectCube,
        baseRotation: { x: rx, y: ry, z: rz }
      };

      // Create wireframe edges geometry (outline tipis)
      const edges = new THREE.EdgesGeometry(geometry);
      // Rim light / highlight tipis di sepanjang tepi lempengan: putih terang, opacity rendah
      const lineColor = 0xffffff;
      const lineOpacity = isProjectCube ? 0.6 : 0.3;
      const lineMaterial = new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: lineOpacity,
        linewidth: 1
      });
      this.materialsToDispose.add(lineMaterial);

      const line = new THREE.LineSegments(edges, lineMaterial);
      mesh.add(line); // Add as child so it moves/rotates/scales with the parent mesh

      this.scene.add(mesh);

      // Save references for animation and interaction
      this.cubes.push({
        mesh: mesh,
        line: line,
        initialY: y,
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        project: project,
        baseScale: new THREE.Vector3(1, 1, 1),
        baseRotation: new THREE.Euler(rx, ry, rz)
      });
    }
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
    this.cubes.forEach(cube => {
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

      // Smoothly interpolate scale for hover highlights
      let targetScale = 1.0;
      if (this.hoveredCube && this.hoveredCube.mesh === cube.mesh) {
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
    if (!this.camera || !this.scene) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Get all meshes in the scene
    const meshes = this.cubes.map(c => c.mesh);
    const intersects = this.raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      // Find the first intersected cube that represents a project
      const firstIntersect = intersects.find(intersect => intersect.object.userData['isProjectCube']);
      
      if (firstIntersect) {
        const intersectedMesh = firstIntersect.object as THREE.Mesh;
        const cubeObj = this.cubes.find(c => c.mesh === intersectedMesh);

        if (cubeObj && cubeObj.project) {
          if (this.hoveredCube !== cubeObj) {
            // Restore previous hovered line color
            if (this.hoveredCube) {
              const prevLineMat = this.hoveredCube.line.material as THREE.LineBasicMaterial;
              prevLineMat.color.setHex(0xffffff);
              prevLineMat.opacity = 0.6;
            }

            // Set new hovered cube
            this.hoveredCube = cubeObj;
            this.hoveredProject.set(cubeObj.project);

            // Highlight line color (bright glow)
            const lineMat = cubeObj.line.material as THREE.LineBasicMaterial;
            lineMat.color.setHex(0x00f3ff); // Cyan glow
            lineMat.opacity = 1.0;
            
            // Set cursor
            document.body.style.cursor = 'pointer';
          }
          return;
        }
      }
    }

    // No project cube intersected
    if (this.hoveredCube) {
      const lineMat = this.hoveredCube.line.material as THREE.LineBasicMaterial;
      lineMat.color.setHex(0xffffff);
      lineMat.opacity = 0.6;
      this.hoveredCube = null;
      this.hoveredProject.set(null);
      document.body.style.cursor = 'default';
    }
  }

  onCanvasClick() {
    // If hovering on a project, navigate to detail page
    if (this.hoveredCube && this.hoveredCube.project) {
      document.body.style.cursor = 'default';
      this.router.navigate(['/projects', this.hoveredCube.project.id]);
    }
  }
}
