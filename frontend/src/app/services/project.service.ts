import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FALLBACK_PROJECTS } from '../data/projects-data';

export interface ProjectImage {
  id: number;
  imageUrl: string;
  order: number;
  isCover: boolean;
}

export interface Project {
  id: number;
  title: string;
  category?: string | null;
  location?: string | null;
  year?: number | null;
  thumbnailUrl?: string | null;
  description?: string | null;
  cubeIndex?: number | null;
  images?: ProjectImage[];
}

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : '';

  private normalizeUrl(url?: string | null): string | undefined | null {
    if (!url) return url;
    return url.replace(/^https?:\/\/[^\/]+\/uploads\//, '/uploads/');
  }

  private normalizeProject(project: Project): Project {
    return {
      ...project,
      thumbnailUrl: this.normalizeUrl(project.thumbnailUrl),
      images: project.images?.map(img => ({
        ...img,
        imageUrl: this.normalizeUrl(img.imageUrl) || img.imageUrl
      }))
    };
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('admin_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  getProjects(): Observable<Project[]> {
    const url = this.apiUrl ? `${this.apiUrl}/projects` : '/projects';
    return this.http.get<Project[]>(url).pipe(
      map(projects => projects.map(p => this.normalizeProject(p))),
      catchError((err) => {
        console.warn('Backend unavailable, using static fallback projects:', err);
        return of(FALLBACK_PROJECTS.map(p => this.normalizeProject(p)));
      })
    );
  }

  getProject(id: number): Observable<Project> {
    const url = this.apiUrl ? `${this.apiUrl}/projects/${id}` : `/projects/${id}`;
    return this.http.get<Project>(url).pipe(
      map(project => this.normalizeProject(project)),
      catchError((err) => {
        console.warn(`Backend unavailable for project ${id}, using static fallback:`, err);
        const found = FALLBACK_PROJECTS.find(p => p.id === id);
        if (found) {
          return of(this.normalizeProject(found));
        }
        return throwError(() => err);
      })
    );
  }

  createProject(formData: FormData): Observable<Project> {
    const url = this.apiUrl ? `${this.apiUrl}/projects` : '/projects';
    return this.http.post<Project>(url, formData, this.getAuthHeaders()).pipe(
      map(p => this.normalizeProject(p))
    );
  }

  updateProject(id: number, formData: FormData): Observable<Project> {
    const url = this.apiUrl ? `${this.apiUrl}/projects/${id}` : `/projects/${id}`;
    return this.http.put<Project>(url, formData, this.getAuthHeaders()).pipe(
      map(p => this.normalizeProject(p))
    );
  }

  deleteProjectImage(projectId: number, imageId: number): Observable<Project> {
    const url = this.apiUrl ? `${this.apiUrl}/projects/${projectId}/images/${imageId}` : `/projects/${projectId}/images/${imageId}`;
    return this.http.delete<Project>(url, this.getAuthHeaders()).pipe(
      map(p => this.normalizeProject(p))
    );
  }

  deleteProject(id: number): Observable<any> {
    const url = this.apiUrl ? `${this.apiUrl}/projects/${id}` : `/projects/${id}`;
    return this.http.delete(url, this.getAuthHeaders());
  }

  getPaneStatus(): Observable<{ cubeIndex: number; projectId: number; title: string }[]> {
    const url = this.apiUrl ? `${this.apiUrl}/projects/pane-status` : '/projects/pane-status';
    return this.http.get<{ cubeIndex: number; projectId: number; title: string }[]>(url).pipe(
      catchError(() => {
        const status = FALLBACK_PROJECTS
          .filter(p => p.cubeIndex !== null && p.cubeIndex !== undefined)
          .map(p => ({
            cubeIndex: p.cubeIndex as number,
            projectId: p.id,
            title: p.title
          }));
        return of(status);
      })
    );
  }

  submitContact(data: ContactSubmission): Observable<any> {
    const url = this.apiUrl ? `${this.apiUrl}/contact` : '/contact';
    return this.http.post(url, data);
  }
}
