import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId?: string;   // Could be string/number depending on backend
  email?: string;
  role?: string;     // 👈 added role field
  isActive?: boolean;
  exp?: number;
  iat?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:5000/api/urlshortener';  

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userIdSubject = new BehaviorSubject<string | null>(this.getUserIdFromToken());
  private emailSubject = new BehaviorSubject<string | null>(this.getEmailFromToken());
  private roleSubject = new BehaviorSubject<string | null>(this.getRoleFromToken());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userId$ = this.userIdSubject.asObservable();
  email$ = this.emailSubject.asObservable();
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  /** Login */
  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            localStorage.setItem('token', response.token);

            const decoded = jwtDecode<DecodedToken>(response.token);

            if (decoded.userId) {
              localStorage.setItem('userId', decoded.userId.toString());
              this.userIdSubject.next(decoded.userId);
            }

            if (decoded.email) {
              localStorage.setItem('email', decoded.email);
              this.emailSubject.next(decoded.email);
            }

            if (decoded.role) {
              localStorage.setItem('role', decoded.role);
              this.roleSubject.next(decoded.role);
            }

            this.isLoggedInSubject.next(true);
          }
        })
      );
  }

  /** Register */
  register(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password });
  }

  /** Get user email */
  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  /** Get user role */
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  /** Check if logged in */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /** Logout */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('role');

    this.isLoggedInSubject.next(false);
    this.userIdSubject.next(null);
    this.emailSubject.next(null);
    this.roleSubject.next(null);

    this.router.navigate(['/login']);
  }

  /** Internal: has token */
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  /** Extract User ID from JWT */
  private getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.userId ?? null;
    } catch {
      return null;
    }
  }

  /** Extract Email from JWT */
  private getEmailFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.email ?? null;
    } catch {
      return null;
    }
  }

  /** Extract Role from JWT */
  private getRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.role ?? null;
    } catch {
      return null;
    }
  }
}
