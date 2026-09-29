import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  isLoading = false;

  constructor(private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      alert('enter your email and password');
      return;
    }

    this.isLoading = true;

    // Simulate authentication process
    setTimeout(() => {
      console.log('Successfully logged in with:', this.email);
      sessionStorage.setItem('isLoggedIn', 'true');
      this.isLoading = false;
      
      // Navigate to dashboard
      this.router.navigate(['/dashboard']);
    }, 1000);
  }
}


