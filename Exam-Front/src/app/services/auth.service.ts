import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorService } from './error.service';
import { AuthResponse, LoginRequest, RegisterRequest, Role, TokenRefreshResponse, JwtPayload } from '../models/auth.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$: Observable<AuthResponse | null> = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:8085/api/auth';
  private refreshTokenTimeout?: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorService: ErrorService
  ) {
    this.initializeAuthFromStorage();
  }

  private initializeAuthFromStorage() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser) as AuthResponse;
      this.currentUserSubject.next(user);
      this.startRefreshTokenTimer(user.accessToken);
    }
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest)
      .pipe(
        catchError(error => this.errorService.handleError(error)),
        map(response => {
          // Registration successful - if auto login is enabled, handle the response
          return response;
        })
      );
  }

  login(username: string, password: string): Observable<AuthResponse> {
    const loginRequest: LoginRequest = { username, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        catchError(error => this.errorService.handleError(error)),
        map(user => {
          // Store user details and JWT token in local storage
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.startRefreshTokenTimer(user.accessToken);
          return user;
        })
      );
  }

  logout(): void {
    // If you have refresh token endpoint, call it to invalidate the token on the server
    if (this.currentUserValue?.refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken: this.currentUserValue.refreshToken })
        .pipe(catchError(() => throwError(() => new Error('Logout failed'))))
        .subscribe();
    }
    
    // Clear local storage and state
    localStorage.removeItem('currentUser');
    this.stopRefreshTokenTimer();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<TokenRefreshResponse> {
    const refreshToken = this.currentUserValue?.refreshToken;
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<TokenRefreshResponse>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        map(response => {
          const currentUser = this.currentUserValue;
          if (currentUser) {
            // Update the current user with new tokens
            const updatedUser = {
              ...currentUser,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken
            };
            
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            this.currentUserSubject.next(updatedUser);
            this.startRefreshTokenTimer(response.accessToken);
          }
          return response;
        }),
        catchError(error => {
          // If refresh token is invalid, log the user out
          this.logout();
          return this.errorService.handleError(error);
        })
      );
  }

  private startRefreshTokenTimer(token: string): void {
    // Decode the JWT to get the expiration time
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const expires = new Date(decoded.exp * 1000);
      
      // Set a timeout to refresh the token 1 minute before expiry
      const timeout = expires.getTime() - Date.now() - (60 * 1000);
      
      this.stopRefreshTokenTimer();
      this.refreshTokenTimeout = setTimeout(() => {
        this.refreshToken().subscribe();
      }, Math.max(0, timeout));
    } catch (err) {
      console.error('Failed to decode JWT token', err);
    }
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  getToken(): string | null {
    return this.currentUserValue?.accessToken || null;
  }

  get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserValue?.accessToken;
  }

  hasRole(role: Role | string): boolean {
    return this.currentUserValue?.roles.includes(role) || false;
  }

  hasAnyRole(roles: (Role | string)[]): boolean {
    return this.currentUserValue?.roles.some(role => roles.includes(role)) || false;
  }
}
