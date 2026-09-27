import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import {
  ProjectService,
  Project
} from '../services/project.service';

@Component({
  selector: 'app-saved-designs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './saved-designs.html',
  styleUrl: './saved-designs.scss'
})
export class SavedDesigns implements OnInit {

  savedDesigns: Project[] = [];

  constructor(
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {

    this.projectService
      .getProjects()
      .subscribe({

        next: (projects: Project[]) => {

          console.log(
            'Projects from backend:',
            projects
          );

          this.savedDesigns = projects;

          console.log(
            'savedDesigns after assignment:',
            this.savedDesigns
          );

          console.log(
            'savedDesigns length:',
            this.savedDesigns.length
          );

        },

        error: (error) => {

          console.error(
            'Error loading projects:',
            error
          );

        }

      });

  }

  deleteDesign(id: string): void {

    if (!id) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this design?'
    );

    if (!confirmed) {
      return;
    }

    this.projectService
      .deleteProject(id)
      .subscribe({

        next: () => {

          alert(
            'Design deleted successfully.'
          );

          this.loadProjects();

        },

        error: (error) => {

          console.error(
            'Error deleting project:',
            error
          );

          alert(
            'Failed to delete design.'
          );

        }

      });

  }

  openColourPreview(): void {

    this.router.navigate([
      '/colour-preview'
    ]);

  }

  goToDashboard(): void {

    this.router.navigate([
      '/dashboard'
    ]);

  }

}