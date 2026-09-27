
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(): void {

    // Validate email
    if (!this.email.trim()) {
      alert('Please enter your email.');
      return;
    }

    // Validate password
    if (!this.password) {
      alert('Please enter your password.');
      return;
    }

    const loginData = {
      email: this.email.trim(),
      password: this.password
    };

    this.http.post<any>(
      'http://localhost:5000/api/auth/login',
      loginData
    ).subscribe({

      next: (response) => {

        console.log('Login response:', response);

        // Make sure backend sent JWT
        if (!response || !response.token) {
          alert('Login failed: JWT token was not received.');
          return;
        }

        // Clear old login data
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Store JWT token
        localStorage.setItem('token', response.token);

        // Store user details
        if (response.user) {
          localStorage.setItem(
            'user',
            JSON.stringify(response.user)
          );
        }

        // Verify storage
        const savedToken = localStorage.getItem('token');

        if (!savedToken) {
          alert('Login successful, but token could not be stored.');
          return;
        }

        console.log('JWT stored successfully.');
        console.log('Token:', savedToken);

        // Go to dashboard
        this.router.navigate(['/dashboard']);

      },

      error: (error) => {

        console.error('Login error:', error);

        if (error.status === 401) {

          alert('Invalid email or password.');

        } else if (error.status === 0) {

          alert(
            'Cannot connect to backend. Make sure the server is running on port 5000.'
          );

        } else {

          alert(
            error.error?.message ||
            'Login failed. Please try again.'
          );

        }
      }
    });
  }
}



