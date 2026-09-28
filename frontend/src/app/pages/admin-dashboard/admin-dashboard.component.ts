import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  ProjectService,
  Project,
  ProjectImage,
} from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import {
  AdminService,
  AdminUser,
  AuditLogItem,
} from '../../services/admin.service';
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
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  private projectService = inject(ProjectService);
  public authService = inject(AuthService);
  private adminService = inject(AdminService);
  private router = inject(Router);

  // Tab State
  activeTab = signal<'projects' | 'admins' | 'logs'>('projects');

  // User Profile & Roles
  currentUser = this.authService.currentUser;
  isSuperAdmin = this.authService.isSuperAdmin;
  mustChangePassword = this.authService.mustChangePassword;

  // Forced Password Change Modal State
  forcedNewPassword = '';
  forcedConfirmPassword = '';
  showForcedNew = signal(false);
  showForcedConfirm = signal(false);
  forcedPasswordLoading = signal(false);
  forcedPasswordError = signal<string | null>(null);

  // Projects State
  projects = signal<Project[]>([]);
  id: number | null = null;
  title = '';
  category = '';
  location = '';
  year: number | null = null;
  description = '';
  selectedPaneIndex = signal<number | null>(null);
  newFiles: NewFilePreview[] = [];
  existingImages: ProjectImage[] = [];
  coverTarget: { type: 'existing' | 'new'; indexOrId: number } = {
    type: 'new',
    indexOrId: 0,
  };
  isEditing = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Pane Picker Modal State (for edit/reassign flow)
  showPanePickerModal = signal(false);
  /** Maps cubeIndex → { projectId, title } for all currently-assigned panes */
  paneStatusMap: Map<number, { projectId: number; title: string }> = new Map();

  // Admin Management State
  admins = signal<AdminUser[]>([]);
  isLoadingAdmins = signal(false);
  adminActionMessage = signal<string | null>(null);
  showInviteModal = signal(false);
  inviteEmail = '';
  inviteName = '';
  inviteRole: 'admin' | 'superadmin' = 'admin';
  inviteLoading = signal(false);
  inviteError = signal<string | null>(null);
  inviteSuccess = signal<string | null>(null);

  // Audit Logs State
  auditLogs = signal<AuditLogItem[]>([]);
  isLoadingLogs = signal(false);
  logsTotal = signal(0);
  logsPage = signal(1);

  ngOnInit() {
    this.loadProjects();
    this.authService.fetchMe().subscribe({
      next: () => {
        if (this.isSuperAdmin()) {
          this.loadAdmins();
        }
      },
    });
  }

  setTab(tab: 'projects' | 'admins' | 'logs') {
    this.activeTab.set(tab);
    this.errorMessage.set(null);
    this.adminActionMessage.set(null);

    if (tab === 'admins' && this.isSuperAdmin()) {
      this.loadAdmins();
    } else if (tab === 'logs' && this.isSuperAdmin()) {
      this.loadAuditLogs();
    }
  }

  // --- Forced Password Change ---
  onSubmitForcedPassword() {
    if (!this.forcedNewPassword || this.forcedNewPassword.length < 8) {
      this.forcedPasswordError.set(
        'Password must be at least 8 characters long.',
      );
      return;
    }
    if (this.forcedNewPassword !== this.forcedConfirmPassword) {
      this.forcedPasswordError.set('Passwords do not match.');
      return;
    }

    this.forcedPasswordLoading.set(true);
    this.forcedPasswordError.set(null);

    this.authService.changePassword(this.forcedNewPassword).subscribe({
      next: () => {
        this.forcedPasswordLoading.set(false);
        this.forcedNewPassword = '';
        this.forcedConfirmPassword = '';
      },
      error: (err) => {
        this.forcedPasswordLoading.set(false);
        this.forcedPasswordError.set(
          err.error?.message || 'Failed to update password.',
        );
      },
    });
  }

  // --- Admin Management Methods ---
  loadAdmins() {
    this.isLoadingAdmins.set(true);
    this.adminService.getAdmins().subscribe({
      next: (data) => {
        this.admins.set(data);
        this.isLoadingAdmins.set(false);
      },
      error: (err) => {
        this.isLoadingAdmins.set(false);
        console.error(err);
      },
    });
  }

  openInviteModal() {
    this.showInviteModal.set(true);
    this.inviteEmail = '';
    this.inviteName = '';
    this.inviteRole = 'admin';
    this.inviteError.set(null);
    this.inviteSuccess.set(null);
  }

  closeInviteModal() {
    this.showInviteModal.set(false);
  }

  submitInvite() {
    if (!this.inviteEmail || !this.inviteEmail.trim()) {
      this.inviteError.set('Email address is required.');
      return;
    }

    this.inviteLoading.set(true);
    this.inviteError.set(null);
    this.inviteSuccess.set(null);

    this.adminService
      .inviteAdmin({
        email: this.inviteEmail.trim(),
        name: this.inviteName.trim() || undefined,
        role: this.inviteRole,
      })
      .subscribe({
        next: (res) => {
          this.inviteLoading.set(false);
          this.inviteSuccess.set(
            res.message || 'Invitation sent successfully.',
          );
          this.loadAdmins();
          setTimeout(() => {
            this.closeInviteModal();
          }, 2000);
        },
        error: (err) => {
          this.inviteLoading.set(false);
          this.inviteError.set(
            err.error?.message || 'Failed to send invitation.',
          );
        },
      });
  }

  deactivateAdmin(admin: AdminUser) {
    if (admin.id === this.currentUser()?.id) {
      alert('You cannot deactivate your own account.');
      return;
    }

    const confirmDeactivate = confirm(
      `Are you sure you want to deactivate ${admin.email}? They will immediately lose access.`,
    );
    if (!confirmDeactivate) return;

    this.adminService.deactivateAdmin(admin.id).subscribe({
      next: (res) => {
        this.adminActionMessage.set(res.message);
        setTimeout(() => this.adminActionMessage.set(null), 3500);
        this.loadAdmins();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to deactivate administrator.');
      },
    });
  }

  reactivateAdmin(admin: AdminUser) {
    this.adminService.reactivateAdmin(admin.id).subscribe({
      next: (res) => {
        this.adminActionMessage.set(res.message);
        setTimeout(() => this.adminActionMessage.set(null), 3500);
        this.loadAdmins();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to reactivate administrator.');
      },
    });
  }

  deleteAdmin(admin: AdminUser) {
    if (admin.id === this.currentUser()?.id) {
      alert('You cannot delete your own account.');
      return;
    }

    const confirmDelete = confirm(
      `PERMANENT ACTION: Are you sure you want to completely remove ${admin.email}? This cannot be undone.`,
    );
    if (!confirmDelete) return;

    this.adminService.deleteAdmin(admin.id).subscribe({
      next: (res) => {
        this.adminActionMessage.set(res.message);
        setTimeout(() => this.adminActionMessage.set(null), 3500);
        this.loadAdmins();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to delete administrator.');
      },
    });
  }

  // --- Audit Logs Methods ---
  loadAuditLogs() {
    this.isLoadingLogs.set(true);
    this.adminService.getAuditLogs(100, this.logsPage()).subscribe({
      next: (res) => {
        this.auditLogs.set(res.logs);
        this.logsTotal.set(res.total);
        this.isLoadingLogs.set(false);
      },
      error: (err) => {
        this.isLoadingLogs.set(false);
        console.error(err);
      },
    });
  }

  // --- Project CRUD Methods ---
  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects.set(data);
      },
      error: (err) => {
        console.error('Failed to load projects', err);
        this.errorMessage.set('Failed to load projects from server.');
      },
    });
  }

  loadProjectIntoForm(
    project: Project | null,
    paneIndex: number | null = null,
  ) {
    if (project) {
      this.isEditing.set(true);
      this.id = project.id;
      this.title = project.title || '';
      this.category = project.category || '';
      this.location = project.location || '';
      this.year = project.year || null;
      this.description = project.description || '';
      this.selectedPaneIndex.set(
        project.cubeIndex !== undefined && project.cubeIndex !== null
          ? project.cubeIndex
          : paneIndex,
      );

      this.newFiles = [];
      if (project.images && project.images.length > 0) {
        this.existingImages = project.images.map((img) => ({
          ...img,
          isCover:
            !!project.thumbnailUrl && img.imageUrl === project.thumbnailUrl,
        }));
        const coverImg = this.existingImages.find((img) => img.isCover);
        if (coverImg) {
          this.coverTarget = { type: 'existing', indexOrId: coverImg.id };
        } else {
          this.coverTarget = {
            type: 'existing',
            indexOrId: this.existingImages[0].id,
          };
          this.existingImages[0].isCover = true;
        }
      } else {
        this.existingImages = [];
        this.coverTarget = { type: 'new', indexOrId: 0 };
      }
    } else {
      this.isEditing.set(false);
      this.id = null;
      this.title = '';
      this.category = '';
      this.location = '';
      this.year = null;
      this.description = '';
      this.newFiles = [];
      this.existingImages = [];
      this.coverTarget = { type: 'new', indexOrId: 0 };
      this.selectedPaneIndex.set(paneIndex);
    }
  }

  onPaneSelected(index: number) {
    const existing = this.projects().find((p) => p.cubeIndex === index);
    this.loadProjectIntoForm(existing || null, index);
  }

  clearPaneSelection() {
    this.selectedPaneIndex.set(null);
  }

  /** Opens the pane picker modal while keeping the edit form visible */
  openPanePickerForEdit() {
    // Load pane status data first, then show modal
    this.projectService.getPaneStatus().subscribe({
      next: (statusList) => {
        this.paneStatusMap.clear();
        statusList.forEach((s) => {
          this.paneStatusMap.set(s.cubeIndex, {
            projectId: s.projectId,
            title: s.title,
          });
        });
        this.showPanePickerModal.set(true);
      },
      error: () => {
        // Fall back to opening modal with cached projects data
        this.paneStatusMap.clear();
        this.projects().forEach((p) => {
          if (p.cubeIndex !== null && p.cubeIndex !== undefined) {
            this.paneStatusMap.set(p.cubeIndex, {
              projectId: p.id,
              title: p.title,
            });
          }
        });
        this.showPanePickerModal.set(true);
      },
    });
  }

  closePanePickerModal() {
    this.showPanePickerModal.set(false);
  }

  /** Called when admin clicks a pane inside the picker modal */
  onPaneSelectedFromModal(index: number) {
    const currentProjectId = this.id;
    const occupant = this.paneStatusMap.get(index);

    // If pane is occupied by another project (not the one being edited)
    if (occupant && occupant.projectId !== currentProjectId) {
      const confirmed = confirm(
        `Pane #${index} is currently linked to "${occupant.title}".

Assigning this pane to "${this.title || 'this project'}" will unlink "${occupant.title}" from Pane #${index}, leaving it unassigned.

Continue?`,
      );
      if (!confirmed) return;
    }

    this.selectedPaneIndex.set(index);
    this.showPanePickerModal.set(false);
  }

  editProject(project: Project) {
    this.loadProjectIntoForm(project, project.cubeIndex ?? null);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  resetForm() {
    this.loadProjectIntoForm(null, null);
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const previewUrl = URL.createObjectURL(file);
      this.newFiles.push({
        file,
        previewUrl,
        isCover: this.existingImages.length === 0 && this.newFiles.length === 0,
      });
    }

    if (
      this.existingImages.length === 0 &&
      this.newFiles.length > 0 &&
      this.coverTarget.type !== 'new'
    ) {
      this.coverTarget = { type: 'new', indexOrId: 0 };
      this.newFiles[0].isCover = true;
    }
  }

  removeNewFile(index: number) {
    this.newFiles.splice(index, 1);
    if (
      this.coverTarget.type === 'new' &&
      this.coverTarget.indexOrId === index
    ) {
      if (this.newFiles.length > 0) {
        this.setCover('new', 0);
      } else if (this.existingImages.length > 0) {
        this.setCover('existing', this.existingImages[0].id);
      }
    }
  }

  removeExistingImage(id: number) {
    this.existingImages = this.existingImages.filter((img) => img.id !== id);
    if (
      this.coverTarget.type === 'existing' &&
      this.coverTarget.indexOrId === id
    ) {
      if (this.existingImages.length > 0) {
        this.setCover('existing', this.existingImages[0].id);
      } else if (this.newFiles.length > 0) {
        this.setCover('new', 0);
      }
    }
  }

  setCover(type: 'existing' | 'new', indexOrId: number) {
    this.coverTarget = { type, indexOrId };
    this.existingImages.forEach((img) => {
      img.isCover = type === 'existing' && img.id === indexOrId;
    });
    this.newFiles.forEach((f, idx) => {
      f.isCover = type === 'new' && idx === indexOrId;
    });
  }

  deleteProject(id: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.loadProjects();
          if (this.id === id) {
            this.resetForm();
          }
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Failed to delete project.');
        },
      });
    }
  }

  onSubmit() {
    if (!this.title) {
      this.errorMessage.set('Project title is required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    if (this.category) formData.append('category', this.category);
    if (this.location) formData.append('location', this.location);
    if (this.year) formData.append('year', this.year.toString());
    if (this.description) formData.append('description', this.description);

    if (this.selectedPaneIndex() !== null) {
      formData.append('cubeIndex', this.selectedPaneIndex()!.toString());
    }

    this.newFiles.forEach((filePreview) => {
      formData.append('images', filePreview.file);
    });

    if (
      this.coverTarget.type === 'existing' &&
      this.coverTarget.indexOrId > 0
    ) {
      formData.append(
        'coverImageIdOrIndex',
        this.coverTarget.indexOrId.toString(),
      );
    } else if (this.coverTarget.type === 'new') {
      formData.append('coverIndex', this.coverTarget.indexOrId.toString());
      formData.append('coverImageIdOrIndex', this.coverTarget.indexOrId.toString());
    }

    if (this.isEditing()) {
      const validKeepIds = this.existingImages
        .filter((img) => img && typeof img.id === 'number' && img.id > 0)
        .map((img) => img.id);
      formData.append('keepImageIds', validKeepIds.join(','));
    }

    this.errorMessage.set(null);

    const request$ =
      this.isEditing() && this.id
        ? this.projectService.updateProject(this.id, formData)
        : this.projectService.createProject(formData);

    request$.subscribe({
      next: () => {
        this.successMessage.set(
          this.isEditing()
            ? 'Project updated successfully.'
            : 'Project created successfully.',
        );
        setTimeout(() => this.successMessage.set(null), 3000);
        this.resetForm();
        this.loadProjects();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(
          err.error?.message || 'Error occurred while saving project.',
        );
      },
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: () => {
        this.router.navigate(['']);
      },
    });
  }

  logoutAllDevices() {
    if (
      confirm(
        'Are you sure you want to sign out from all devices? All active sessions will be terminated.',
      )
    ) {
      this.authService.logoutAll().subscribe({
        next: () => {
          this.router.navigate(['/admin/login']);
        },
        error: () => {
          this.router.navigate(['/admin/login']);
        },
      });
    }
  }
}
