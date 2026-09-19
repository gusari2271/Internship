import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000';

  private getAuthHeaders() {
    const token = localStorage.getItem('admin_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${id}`);
  }

  createProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, formData, this.getAuthHeaders());
  }

  updateProject(id: number, formData: FormData): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects/${id}`, formData, this.getAuthHeaders());
  }

  deleteProjectImage(projectId: number, imageId: number): Observable<Project> {
    return this.http.delete<Project>(`${this.apiUrl}/projects/${projectId}/images/${imageId}`, this.getAuthHeaders());
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${id}`, this.getAuthHeaders());
  }

  getPaneStatus(): Observable<{ cubeIndex: number; projectId: number; title: string }[]> {
    return this.http.get<{ cubeIndex: number; projectId: number; title: string }[]>(
      `${this.apiUrl}/projects/pane-status`,
    );
  }

  submitContact(data: ContactSubmission): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, data);
  }
}
