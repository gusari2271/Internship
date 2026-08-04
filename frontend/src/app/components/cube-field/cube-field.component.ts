import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild, HostListener, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
      if (Array.isArray(c.mesh.material)) {
        c.mesh.material.forEach(m => m.dispose());
      } else {
        c.mesh.material.dispose();
      }
      c.line.geometry.dispose();
      if (Array.isArray(c.line.material)) {
        c.line.material.forEach(m => m.dispose());
      } else {
        c.line.material.dispose();
      }
    });

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
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // OrbitControls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.1; // Limit panning below ground slightly
    this.controls.minDistance = 5;
    this.controls.maxDistance = 50;

    // Add subtle lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(10, 20, 10);
    this.scene.add(dirLight);
  }

  private buildCubeField() {
    if (!this.scene) return;

    // Clear existing cubes if any
    this.cubes.forEach(c => {
      this.scene.remove(c.mesh);
    });
    this.cubes = [];

    // Total cubes in the field
    const totalCubes = 55;
    
    // Let's pre-generate random index positions for projects, ensuring spread
    const projectCount = this.projects.length;
    const projectIndices = new Set<number>();
    while (projectIndices.size < projectCount) {
      const idx = Math.floor(Math.random() * totalCubes);
      projectIndices.add(idx);
    }
    const projectIndicesArr = Array.from(projectIndices);

    // Grid bounds & dimensions
    // We want a loose, broken grid look.
    // Let's create virtual grid slots and randomly select which ones to populate
    const gridDim = 5; // 5x5x5 virtual grid
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

    const loader = new THREE.TextureLoader();

    // Create the cubes
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

      // Random sizes (BoxGeometry)
      const scaleX = 1 + Math.random() * 1.5;
      const scaleY = 1 + Math.random() * 1.5;
      const scaleZ = 1 + Math.random() * 1.5;
      const geometry = new THREE.BoxGeometry(scaleX, scaleY, scaleZ);

      // Check if this cube holds project data
      const projectIndex = projectIndicesArr.indexOf(i);
      const isProjectCube = projectIndex !== -1;
      const project = isProjectCube ? this.projects[projectIndex] : undefined;

      // Create materials
      // We want transparent solid faces (so raycasting works beautifully) and visible wireframe lines.
      // If it is a project cube, and it has a thumbnailUrl, we load it on the top face (material index 2).
      const materials: THREE.Material[] = [];
      let topFaceMaterial: THREE.MeshBasicMaterial;

      if (project && project.thumbnailUrl) {
        // Top face has a solid texture, other faces are transparent
        const texture = loader.load(project.thumbnailUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        topFaceMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide
        });
      } else {
        // Top face is transparent as well (or has a very subtle light gray tint for project cubes)
        topFaceMaterial = new THREE.MeshBasicMaterial({
          color: project ? 0xf5f5f5 : 0xffffff,
          transparent: true,
          opacity: project ? 0.05 : 0.01 // very slightly visible to give depth
        });
      }

      // Default transparent materials for the other faces
      const transMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: project ? 0.03 : 0.01
      });

      // Materials array: order is: right, left, top, bottom, front, back
      materials.push(transMaterial); // Right
      materials.push(transMaterial); // Left
      materials.push(topFaceMaterial); // Top (texture face)
      materials.push(transMaterial); // Bottom
      materials.push(transMaterial); // Front
      materials.push(transMaterial); // Back

      const mesh = new THREE.Mesh(geometry, materials);
      mesh.position.set(x, y, z);

      // Slight random initial rotation
      mesh.rotation.x = Math.random() * Math.PI * 0.15;
      mesh.rotation.y = Math.random() * Math.PI * 0.15;
      mesh.rotation.z = Math.random() * Math.PI * 0.15;

      // Save custom user data for raycasting
      mesh.userData = {
        project: project,
        isProjectCube: isProjectCube
      };

      // Create wireframe edges geometry
      const edges = new THREE.EdgesGeometry(geometry);
      // Project cubes have slightly darker lines by default, normal ones are very faint
      const lineColor = isProjectCube ? 0x999999 : 0xdddddd;
      const lineMaterial = new THREE.LineBasicMaterial({
        color: lineColor,
        linewidth: 1 // note: WebGL ignores linewidth > 1 on most systems, but it sets the styling intent
      });
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
        baseScale: new THREE.Vector3(1, 1, 1)
      });
    }
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const time = Date.now() * 0.001;

    // Subtle idle animation: cubes move up and down slowly (floating effect) and rotate slightly
    this.cubes.forEach(cube => {
      // Y-axis float
      cube.mesh.position.y = cube.mesh.position.y = cube.initialY + Math.sin(time * cube.speed + cube.phase) * 0.4;
      
      // Slight continuous slow rotation
      cube.mesh.rotation.y += 0.0003;
      cube.mesh.rotation.x += 0.0001;

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
              prevLineMat.color.setHex(0x999999);
            }

            // Set new hovered cube
            this.hoveredCube = cubeObj;
            this.hoveredProject.set(cubeObj.project);

            // Highlight line color (black)
            const lineMat = cubeObj.line.material as THREE.LineBasicMaterial;
            lineMat.color.setHex(0x000000);
            
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
      lineMat.color.setHex(0x999999);
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
