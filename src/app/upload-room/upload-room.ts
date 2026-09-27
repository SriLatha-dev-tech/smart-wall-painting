import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-upload-room',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './upload-room.html',
  styleUrl: './upload-room.scss'
})
export class UploadRoom {

  imagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      alert('Please select a JPG, JPEG or PNG image.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      this.imagePreview = reader.result;

      sessionStorage.setItem(
        'roomImage',
        reader.result as string
      );

    };

    reader.readAsDataURL(file);
  }
}