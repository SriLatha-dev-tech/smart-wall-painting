import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ProjectService } from '../services/project.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-colour-preview',
  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl: './colour-preview.html',
  styleUrl: './colour-preview.scss'
})
export class ColourPreview implements AfterViewInit {

  @ViewChild('previewCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  private roomImage = new Image();

  selectedColor = '#87CEEB';

  selectedColorName = 'Ocean Breeze Blue';

  paintOpacity = 0.55;

  // Before / After
  previewMode: 'before' | 'after' = 'after';

  // Design
  selectedDesign = 'solid';

  designs = [
    {
      name: 'Solid Colour',
      type: 'solid'
    },
    {
      name: 'Vertical Stripes',
      type: 'stripes'
    },
    {
      name: 'Dots',
      type: 'dots'
    },
    {
      name: 'Grid',
      type: 'grid'
    }
  ];

  colors = [
    {
      name: 'Ocean Breeze Blue',
      code: '#87CEEB'
    },
    {
      name: 'Soft White',
      code: '#F5F5F5'
    },
    {
      name: 'Warm Beige',
      code: '#D8C3A5'
    },
    {
      name: 'Mint Green',
      code: '#98D8C8'
    },
    {
      name: 'Rose Pink',
      code: '#E8A0A8'
    },
    {
      name: 'Lavender',
      code: '#B8A9C9'
    },
    {
      name: 'Light Grey',
      code: '#BDBDBD'
    },
    {
      name: 'Terracotta',
      code: '#C96F4A'
    }
  ];

  constructor(
    private router: Router,
    private projectService: ProjectService
  ) {}

  // ==========================================
  // INITIALIZE
  // ==========================================

  ngAfterViewInit(): void {

    this.ctx =
      this.canvas.nativeElement.getContext('2d')!;

    this.canvas.nativeElement.width = 800;
    this.canvas.nativeElement.height = 500;

    const imageData =
      sessionStorage.getItem('roomImage');

    if (imageData) {

      this.roomImage.onload = () => {
        this.drawPreview();
      };

      this.roomImage.src = imageData;

    } else {

      this.showEmptyCanvas();
    }
  }

  // ==========================================
  // BEFORE / AFTER
  // ==========================================

  showBefore(): void {

    this.previewMode = 'before';

    this.drawPreview();
  }

  showAfter(): void {

    this.previewMode = 'after';

    this.drawPreview();
  }

  // ==========================================
  // SELECT COLOUR
  // ==========================================

  selectColor(
    color: string,
    name: string
  ): void {

    this.selectedColor = color;

    this.selectedColorName = name;

    this.previewMode = 'after';

    this.drawPreview();
  }

  // ==========================================
  // SELECT DESIGN
  // ==========================================

  selectDesign(type: string): void {

    this.selectedDesign = type;

    this.previewMode = 'after';

    this.drawPreview();
  }

  // ==========================================
  // OPACITY
  // ==========================================

  changeOpacity(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.paintOpacity =
      Number(input.value) / 100;

    this.previewMode = 'after';

    this.drawPreview();
  }

  // ==========================================
  // MAIN PREVIEW
  // ==========================================

  private drawPreview(): void {

    if (
      !this.ctx ||
      !this.roomImage.complete
    ) {
      return;
    }

    const canvas =
      this.canvas.nativeElement;

    // Clear canvas

    this.ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Draw original room

    this.ctx.drawImage(
      this.roomImage,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Before mode

    if (this.previewMode === 'before') {
      return;
    }

    // Get wall points

    const wallPointsString =
      sessionStorage.getItem('wallPoints');

    if (!wallPointsString) {
      return;
    }

    let points: {
      x: number;
      y: number;
    }[];

    try {

      points =
        JSON.parse(wallPointsString);

    } catch (error) {

      console.error(
        'Invalid wall points:',
        error
      );

      return;
    }

    if (
      !points ||
      points.length < 3
    ) {
      return;
    }

    // Create wall clipping area

    this.ctx.save();

    this.ctx.beginPath();

    this.ctx.moveTo(
      points[0].x,
      points[0].y
    );

    for (
      let i = 1;
      i < points.length;
      i++
    ) {

      this.ctx.lineTo(
        points[i].x,
        points[i].y
      );
    }

    this.ctx.closePath();

    this.ctx.clip();

    // Apply selected design

    this.applyDesign();

    this.ctx.restore();

    // Draw wall border

    this.ctx.beginPath();

    this.ctx.moveTo(
      points[0].x,
      points[0].y
    );

    for (
      let i = 1;
      i < points.length;
      i++
    ) {

      this.ctx.lineTo(
        points[i].x,
        points[i].y
      );
    }

    this.ctx.closePath();

    this.ctx.strokeStyle =
      '#1976d2';

    this.ctx.lineWidth = 2;

    this.ctx.stroke();
  }

  // ==========================================
  // APPLY DESIGN
  // ==========================================

  private applyDesign(): void {

    const canvas =
      this.canvas.nativeElement;

    // Solid colour

    if (
      this.selectedDesign === 'solid'
    ) {

      this.ctx.fillStyle =
        this.selectedColor;

      this.ctx.globalAlpha =
        this.paintOpacity;

      this.ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      this.ctx.globalAlpha = 1;

      return;
    }

    // ========================================
    // STRIPES
    // ========================================

    if (
      this.selectedDesign === 'stripes'
    ) {

      this.ctx.globalAlpha =
        this.paintOpacity;

      this.ctx.fillStyle =
        this.selectedColor;

      for (
        let x = 0;
        x < canvas.width;
        x += 50
      ) {

        this.ctx.fillRect(
          x,
          0,
          25,
          canvas.height
        );
      }

      this.ctx.globalAlpha = 1;

      return;
    }

    // ========================================
    // DOTS
    // ========================================

    if (
      this.selectedDesign === 'dots'
    ) {

      this.ctx.globalAlpha =
        this.paintOpacity;

      this.ctx.fillStyle =
        this.selectedColor;

      for (
        let x = 20;
        x < canvas.width;
        x += 45
      ) {

        for (
          let y = 20;
          y < canvas.height;
          y += 45
        ) {

          this.ctx.beginPath();

          this.ctx.arc(
            x,
            y,
            10,
            0,
            Math.PI * 2
          );

          this.ctx.fill();
        }
      }

      this.ctx.globalAlpha = 1;

      return;
    }

    // ========================================
    // GRID
    // ========================================

    if (
      this.selectedDesign === 'grid'
    ) {

      this.ctx.globalAlpha =
        this.paintOpacity;

      this.ctx.strokeStyle =
        this.selectedColor;

      this.ctx.lineWidth = 3;

      // Vertical lines

      for (
        let x = 0;
        x < canvas.width;
        x += 50
      ) {

        this.ctx.beginPath();

        this.ctx.moveTo(
          x,
          0
        );

        this.ctx.lineTo(
          x,
          canvas.height
        );

        this.ctx.stroke();
      }

      // Horizontal lines

      for (
        let y = 0;
        y < canvas.height;
        y += 50
      ) {

        this.ctx.beginPath();

        this.ctx.moveTo(
          0,
          y
        );

        this.ctx.lineTo(
          canvas.width,
          y
        );

        this.ctx.stroke();
      }

      this.ctx.globalAlpha = 1;
    }
  }

  // ==========================================
  // EMPTY CANVAS
  // ==========================================

  private showEmptyCanvas(): void {

    this.ctx.fillStyle =
      '#eeeeee';

    this.ctx.fillRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );

    this.ctx.fillStyle =
      '#777';

    this.ctx.font =
      '24px Arial';

    this.ctx.textAlign =
      'center';

    this.ctx.fillText(
      'No room image found',
      400,
      250
    );
  }

  // ==========================================
  // SAVE DESIGN
  // ==========================================

  saveDesign(): void {

    this.previewMode = 'after';

    this.drawPreview();

    const wallPoints =
      sessionStorage.getItem('wallPoints') || '';

    const originalImage =
      sessionStorage.getItem('roomImage');

    if (!originalImage) {

      alert(
        'No room image found. Please upload a room image first.'
      );

      return;
    }

    if (!this.canvas) {

      alert(
        'Preview image is not ready yet.'
      );

      return;
    }

    const savedImage =
      this.canvas.nativeElement.toDataURL(
        'image/png'
      );

    const project = {

      name:
        this.selectedColorName +
        ' - ' +
        this.selectedDesign,

      roomImage:
        savedImage,

      wall:
        wallPoints,

      colour:
        this.selectedColor
    };

    console.log(
      'Saving design:',
      project
    );

    this.projectService
      .addProject(project)
      .subscribe({

        next: (response) => {

          console.log(
            'Project saved successfully:',
            response
          );

          alert(
            'Design saved successfully!'
          );

          this.router.navigate([
            '/saved-designs'
          ]);
        },

        error: (error) => {

          console.error(
            'SAVE ERROR:',
            error
          );

          alert(
            'Save failed. Status: ' +
            error.status
          );
        }
      });
  }

  // ==========================================
  // GO BACK
  // ==========================================

  goBack(): void {

    this.router.navigate([
      '/wall-selection'
    ]);
  }
}