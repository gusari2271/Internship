import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  id: number;
  title: string;
  category?: string;
  location?: string;
  year?: number;
  thumbnailUrl?: string | null;
  description?: string;
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
  private apiUrl = 'http://localhost:3000'; // Default NestJS endpoint

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${id}`);
  }

  submitContact(data: ContactSubmission): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, data);
  }
}
