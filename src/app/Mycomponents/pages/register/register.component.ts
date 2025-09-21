import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  phoneNo: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  private apiUrl = 'http://localhost:8001/api/v1/url-shortner/user/register-user'; 

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    const payload = {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNo: this.phoneNo,
      credential: {
        email: this.email,
        password: this.password
      }
    };

    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: (response) => {
        console.log('User registered:', response);
        this.successMessage = 'User registered successfully! Redirecting to login...';
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage = error.error?.message || 'Failed to register user';
        this.successMessage = '';
      }
    });
  }
}
