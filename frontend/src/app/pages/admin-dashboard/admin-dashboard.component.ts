import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService, Project, ProjectImage } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { CubeFieldComponent } from '../../components/cube-field/cube-field.component';

export interface NewFilePreview {
  file: File;
  previewUrl: string;
  isCover: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CubeFieldComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  private router = inject(Router);

  projects = signal<Project[]>([]);
  
  id: number | null = null;
  title = '';
  category = '';
  location = '';
  year: number | null = null;
  description = '';
  
  selectedPaneIndex = signal<number | null>(null);

  // Multi-image state
  newFiles: NewFilePreview[] = [];
  existingImages: ProjectImage[] = [];
  coverTarget: { type: 'existing' | 'new'; indexOrId: number } = { type: 'new', indexOrId: 0 };

  isEditing = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects.set(data);
      },
      error: (err) => {
        console.error('Failed to load projects', err);
        this.errorMessage.set('Failed to load projects from server.');
      }
    });
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.newFiles.push({
            file,
            previewUrl: e.target.result,
            isCover: this.newFiles.length === 0 && this.existingImages.length === 0,
          });
          if (this.newFiles.length === 1 && this.existingImages.length === 0) {
            this.coverTarget = { type: 'new', indexOrId: 0 };
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeNewFile(index: number) {
    this.newFiles.splice(index, 1);
    if (this.coverTarget.type === 'new' && this.coverTarget.indexOrId === index) {
      if (this.existingImages.length > 0) {
        this.setCover('existing', this.existingImages[0].id);
      } else if (this.newFiles.length > 0) {
        this.setCover('new', 0);
      }
    }
  }

  removeExistingImage(image: ProjectImage) {
    if (!this.id) return;
    if (confirm('Delete this photo from gallery?')) {
      this.projectService.deleteProjectImage(this.id, image.id).subscribe({
        next: (updatedProject) => {
          this.existingImages = updatedProject.images || [];
          this.loadProjects();
          this.successMessage.set('Photo deleted successfully.');
          setTimeout(() => this.successMessage.set(null), 3000);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Failed to delete image.');
        }
      });
    }
  }

  setCover(type: 'existing' | 'new', indexOrId: number) {
    this.coverTarget = { type, indexOrId };
    
    this.existingImages.forEach(img => {
      img.isCover = type === 'existing' && img.id === indexOrId;
    });

    this.newFiles.forEach((filePreview, idx) => {
      filePreview.isCover = type === 'new' && idx === indexOrId;
    });
  }

  onPaneSelected(index: number) {
    this.selectedPaneIndex.set(index);
    this.successMessage.set(`Selected 3D Glass Pane Index: ${index}`);
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  resetForm() {
    this.id = null;
    this.title = '';
    this.category = '';
    this.location = '';
    this.year = null;
    this.description = '';
    this.newFiles = [];
    this.existingImages = [];
    this.coverTarget = { type: 'new', indexOrId: 0 };
    this.selectedPaneIndex.set(null);
    this.isEditing.set(false);
    this.errorMessage.set(null);
    
    const fileInput = document.getElementById('images') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  editProject(project: Project) {
    this.id = project.id;
    this.title = project.title;
    this.category = project.category || '';
    this.location = project.location || '';
    this.year = project.year || null;
    this.description = project.description || '';
    this.selectedPaneIndex.set(project.cubeIndex !== undefined && project.cubeIndex !== null ? project.cubeIndex : null);
    
    this.existingImages = project.images ? [...project.images] : [];
    this.newFiles = [];
    
    const coverImage = this.existingImages.find(img => img.isCover) || this.existingImages[0];
    if (coverImage) {
      this.coverTarget = { type: 'existing', indexOrId: coverImage.id };
    } else {
      this.coverTarget = { type: 'new', indexOrId: 0 };
    }

    this.isEditing.set(true);
    this.errorMessage.set(null);
    
    const fileInput = document.getElementById('images') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  deleteProject(id: number) {
    if (confirm('Are you sure you want to delete this project and ALL attached photos?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.successMessage.set('Project and all associated images deleted.');
          setTimeout(() => this.successMessage.set(null), 3000);
          this.loadProjects();
          if (this.id === id) {
            this.resetForm();
          }
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Failed to delete project.');
        }
      });
    }
  }

  onSubmit() {
    if (!this.title) {
      this.errorMessage.set('Project Title is required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('category', this.category);
    formData.append('location', this.location);
    if (this.year) formData.append('year', this.year.toString());
    formData.append('description', this.description);
    
    if (this.selectedPaneIndex() !== null) {
      formData.append('cubeIndex', this.selectedPaneIndex()!.toString());
    }

    // Append all selected files
    this.newFiles.forEach((filePreview) => {
      formData.append('images', filePreview.file);
    });

    if (this.coverTarget.type === 'existing') {
      formData.append('coverImageIdOrIndex', this.coverTarget.indexOrId.toString());
    } else {
      formData.append('coverIndex', this.coverTarget.indexOrId.toString());
    }

    if (this.isEditing() && this.existingImages.length > 0) {
      const keepIds = this.existingImages.map(img => img.id).join(',');
      formData.append('keepImageIds', keepIds);
    }

    this.errorMessage.set(null);

    const request$ = this.isEditing() && this.id
      ? this.projectService.updateProject(this.id, formData)
      : this.projectService.createProject(formData);

    request$.subscribe({
      next: () => {
        this.successMessage.set(this.isEditing() ? 'Project updated successfully.' : 'Project created successfully.');
        setTimeout(() => this.successMessage.set(null), 3000);
        this.resetForm();
        this.loadProjects();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(err.error?.message || 'Error occurred while saving project.');
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
