import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  ProjectService,
  Project,
  ProjectImage,
} from '../../services/project.service';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  public lang = inject(LanguageService);
  private subscription = new Subscription();

  project = signal<Project | null>(null);
  isLoading = signal(true);
  errorMsg = signal<string | null>(null);

  // Lightbox state
  lightboxOpen = signal(false);
  lightboxIndex = signal(0);

  // Computed list of images for gallery
  galleryImages = computed(() => {
    const proj = this.project();
    if (!proj) return [];
    if (proj.images && proj.images.length > 0) {
      return proj.images.map((img) => img.imageUrl);
    }
    if (proj.thumbnailUrl) {
      return [
        proj.thumbnailUrl ||
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
        'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800',
        'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800',
      ];
    }
    return [];
  });
  mainImage = computed(() => {
    const images = this.galleryImages();
    return images.length > 0 ? images[0] : null;
  });

  subImages = computed(() => {
    const images = this.galleryImages();
    // Mengambil foto mulai dari indeks ke-1 sampai indeks ke-3 (maksimal 2 foto)
    return images.slice(1, 3);
  });

  ngOnInit() {
    this.subscription.add(
      this.route.paramMap.subscribe((params) => {
        const idStr = params.get('id');
        if (idStr) {
          this.loadProject(Number(idStr));
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openLightbox(index: number) {
    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
  }

  nextLightboxImage() {
    const images = this.galleryImages();
    if (images.length === 0) return;
    this.lightboxIndex.set((this.lightboxIndex() + 1) % images.length);
  }

  prevLightboxImage() {
    const images = this.galleryImages();
    if (images.length === 0) return;
    this.lightboxIndex.set(
      (this.lightboxIndex() - 1 + images.length) % images.length,
    );
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (!this.lightboxOpen()) return;

    if (event.key === 'Escape') {
      this.closeLightbox();
    } else if (event.key === 'ArrowRight') {
      this.nextLightboxImage();
    } else if (event.key === 'ArrowLeft') {
      this.prevLightboxImage();
    }
  }

  private loadProject(id: number) {
    this.isLoading.set(true);
    this.errorMsg.set(null);

    this.projectService.getProject(id).subscribe({
      next: (data) => {
        this.project.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load project details', err);
        const offlineFallbacks: Record<number, Project> = {
          1: {
            id: 1,
            title: 'Untitled Project I',
            category: 'Residential',
            location: 'Tokyo, Japan',
            year: 2024,
            description:
              'A study in minimalist concrete structure and light well integration. This residential pavilion explores the intersection of monolithic walls and fluid spatial boundaries, utilizing raw textures and shadows as primary aesthetic drivers.',
          },
          2: {
            id: 2,
            title: 'Untitled Project II',
            category: 'Cultural',
            location: 'Copenhagen, Denmark',
            year: 2025,
            description:
              'An open-air pavilion designed to blend into the surrounding coastal landscape. The project features a floating timber grid structure that filters sunlight to create a dynamic play of patterns on the stone floor below.',
          },
          3: {
            id: 3,
            title: 'Untitled Project III',
            category: 'Commercial',
            location: 'Jakarta, Indonesia',
            year: 2026,
            description:
              'A research on biophilic workspaces in dense tropical urban settings. By carving out a series of vertical micro-courtyards, the building facilitates natural cross-ventilation and brings localized flora to every work desk.',
          },
          4: {
            id: 4,
            title: 'Untitled Project IV',
            category: 'Residential',
            location: 'Berlin, Germany',
            year: 2023,
            description:
              'Renovation and extension of an industrial brick warehouse. The new volume rests like a light glass lantern above the existing brick plinth, bridging historical weight with contemporary transparency.',
          },
          5: {
            id: 5,
            title: 'Untitled Project V',
            category: 'Institutional',
            location: 'Melbourne, Australia',
            year: 2027,
            description:
              'A community library concept designed as a series of timber reading rooms gathered around a central light-filled atrium. The structural grid is left exposed to showcase local sustainable engineering.',
          },
        };

        const fallback = offlineFallbacks[id];
        if (fallback) {
          this.project.set(fallback);
        } else {
          this.errorMsg.set('Project coordinates not found.');
        }
        this.isLoading.set(false);
      },
    });
  }
}
