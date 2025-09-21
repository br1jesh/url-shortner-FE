import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,  
   imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';




  private apiUrl = 'http://localhost:8001/api/v1/url-shortner/user/login'; 

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const payload = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: (response) => {
        console.log('Login success:', response);

        localStorage.setItem('authToken', response.token);

       this.router.navigate(['/home']);   
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Invalid credentials';
      }
    });
  }
}
