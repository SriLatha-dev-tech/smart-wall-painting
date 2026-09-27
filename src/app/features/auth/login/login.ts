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

  constructor(private router: Router) {}

  login() {
    // Basic validation check
    if (!this.email || !this.password) {
      alert('Please fill in both email and password.');
      return;
    }

    // Here you can add your backend authentication logic
    // For now, it redirects to the dashboard successfully
    console.log('Logging in with:', this.email);
    
    // Set a dummy auth state if needed (e.g., sessionStorage)
    sessionStorage.setItem('isLoggedIn', 'true');

    // Navigate to dashboard
    this.router.navigate(['/dashboard']);
  }
}
