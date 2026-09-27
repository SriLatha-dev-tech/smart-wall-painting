import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import { Router, RouterModule } from '@angular/router';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-wall-selection',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './wall-selection.html',
  styleUrl: './wall-selection.scss'
})
export class WallSelection implements AfterViewInit {

  @ViewChild('wallCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  private roomImage = new Image();

  private points: Point[] = [];

  private polygonFinished = false;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {

    this.ctx =
      this.canvas.nativeElement.getContext('2d')!;

    this.canvas.nativeElement.width = 800;
    this.canvas.nativeElement.height = 500;

    const imageData =
      sessionStorage.getItem('roomImage');

    if (imageData) {

      this.roomImage.onload = () => {
        this.drawCanvas();
      };

      this.roomImage.src = imageData;

    } else {

      this.showEmptyCanvas();
    }
  }

  // Main canvas redraw function
  private drawCanvas(): void {

    this.ctx.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );

    if (this.roomImage.src) {

      this.ctx.drawImage(
        this.roomImage,
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );
    }

    this.drawPolygon();
  }

  // Show message if image is missing
  private showEmptyCanvas(): void {

    this.ctx.fillStyle = '#eeeeee';

    this.ctx.fillRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );

    this.ctx.fillStyle = '#777';

    this.ctx.font = '24px Arial';

    this.ctx.textAlign = 'center';

    this.ctx.fillText(
      'No room image found',
      400,
      250
    );
  }

  // Add polygon point
  addPoint(event: MouseEvent): void {

    if (this.polygonFinished) {

      alert(
        'The wall selection is already finished. Clear it to select again.'
      );

      return;
    }

    const rect =
      this.canvas.nativeElement.getBoundingClientRect();

    const scaleX =
      this.canvas.nativeElement.width / rect.width;

    const scaleY =
      this.canvas.nativeElement.height / rect.height;

    const x =
      (event.clientX - rect.left) * scaleX;

    const y =
      (event.clientY - rect.top) * scaleY;

    this.points.push({
      x,
      y
    });

    this.drawCanvas();
  }

  // Draw polygon and selection points
  private drawPolygon(): void {

    if (this.points.length === 0) {
      return;
    }

    this.ctx.beginPath();

    this.ctx.moveTo(
      this.points[0].x,
      this.points[0].y
    );

    for (
      let i = 1;
      i < this.points.length;
      i++
    ) {

      this.ctx.lineTo(
        this.points[i].x,
        this.points[i].y
      );
    }

    // Close polygon only after Finish Selection
    if (this.polygonFinished) {

      this.ctx.closePath();

      // Selected wall highlight
      this.ctx.fillStyle =
        'rgba(25, 118, 210, 0.30)';

      this.ctx.fill();
    }

    this.ctx.strokeStyle = '#1976d2';

    this.ctx.lineWidth = 3;

    this.ctx.stroke();

    // Draw all selected points
    for (const point of this.points) {

      this.ctx.beginPath();

      this.ctx.arc(
        point.x,
        point.y,
        6,
        0,
        Math.PI * 2
      );

      this.ctx.fillStyle = '#1976d2';

      this.ctx.fill();

      this.ctx.strokeStyle = '#ffffff';

      this.ctx.lineWidth = 2;

      this.ctx.stroke();
    }
  }

  // Finish polygon
  finishPolygon(): void {

    if (this.points.length < 3) {

      alert(
        'Please select at least 3 points around the wall.'
      );

      return;
    }

    this.polygonFinished = true;

    this.drawCanvas();
  }

  // Undo last selected point
  undoLastPoint(): void {

    if (this.polygonFinished) {

      alert(
        'Clear the selection first to edit the wall.'
      );

      return;
    }

    if (this.points.length > 0) {

      this.points.pop();

      this.drawCanvas();
    }
  }

  // Clear wall selection
  clearSelection(): void {

    this.points = [];

    this.polygonFinished = false;

    this.drawCanvas();
  }

  // Continue to colour preview
  continueToColour(): void {

    if (this.points.length < 3) {

      alert(
        'Please select a wall area first.'
      );

      return;
    }

    if (!this.polygonFinished) {

      alert(
        'Please click Finish Selection before continuing.'
      );

      return;
    }

    sessionStorage.setItem(
      'wallPoints',
      JSON.stringify(this.points)
    );

    this.router.navigate([
      '/colour-preview'
    ]);
  }
}