import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  _id?: string;

  // User who owns the project
  userId?: string;

  name: string;
  roomImage?: string;
  wall?: string;
  colour?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl =
    'http://localhost:5000/api/projects';

  constructor(
    private http: HttpClient
  ) {}


  // ========================================
  // GET JWT TOKEN
  // ========================================

  private getHeaders(): HttpHeaders {

    const token =
      sessionStorage.getItem('token') ||
      localStorage.getItem('token');

    return new HttpHeaders({

      'Content-Type': 'application/json',

      'Authorization':
        `Bearer ${token || ''}`

    });
  }


  // ========================================
  // GET USER'S PROJECTS
  // ========================================

  getProjects(): Observable<Project[]> {

    return this.http.get<Project[]>(
      this.apiUrl,
      {
        headers: this.getHeaders()
      }
    );
  }


  // ========================================
  // ADD PROJECT
  // ========================================

  addProject(
    project: Project
  ): Observable<Project> {

    console.log(
      'POSTING PROJECT:',
      project
    );

    return this.http.post<Project>(
      this.apiUrl,
      project,
      {
        headers: this.getHeaders()
      }
    );
  }


  // ========================================
  // DELETE PROJECT
  // ========================================

  deleteProject(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getHeaders()
      }
    );
  }
}