import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(): void {

    console.log('REGISTER BUTTON CLICKED');

    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate name
    if (!this.name || !this.name.trim()) {
      this.errorMessage = 'Please enter your name.';
      return;
    }

    // Validate email
    if (!this.email || !this.email.trim()) {
      this.errorMessage = 'Please enter your email.';
      return;
    }

    // Validate password
    if (!this.password) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    // Validate confirm password
    if (!this.confirmPassword) {
      this.errorMessage = 'Please confirm your password.';
      return;
    }

    // Check password match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    // Password length validation
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    // Registration object
    const user = {
      name: this.name.trim(),
      email: this.email.trim().toLowerCase(),
      password: this.password
    };

    console.log('Sending registration request:', {
      name: user.name,
      email: user.email
    });

    this.isLoading = true;

    this.http.post<any>(
      'http://localhost:5000/api/auth/register',
      user
    ).subscribe({

      next: (response) => {

        console.log('Registration successful:', response);

        this.isLoading = false;

        this.successMessage =
          response?.message ||
          'Registration successful! Redirecting to login...';

        // Clear form
        this.name = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';

        // Go to login after successful registration
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },

      error: (error) => {

        console.error('Registration error:', error);
        console.error('Status:', error.status);
        console.error('Server response:', error.error);

        this.isLoading = false;

        // Duplicate email
        if (
          error.status === 400 &&
          error.error?.message === 'User already exists'
        ) {
          this.errorMessage =
            'This email is already registered. Please login instead.';
          return;
        }

        // Other backend errors
        this.errorMessage =
          error.error?.message ||
          error.error?.error ||
          'Registration failed. Please try again.';
      }
    });
  }
}

