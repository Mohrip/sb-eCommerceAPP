import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, SignupRequest, UserInfoResponse, MessageResponse } from '../models/auth.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:5000/api/auth';

  private currentUser = signal<UserInfoResponse | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.roles?.includes('ROLE_ADMIN') ?? false);
  readonly isSeller = computed(() => this.currentUser()?.roles?.includes('ROLE_SELLER') ?? false);

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }

  signin(request: LoginRequest): Observable<UserInfoResponse> {
    return this.http.post<UserInfoResponse>(`${this.API}/signin`, request, { withCredentials: true }).pipe(
      tap(user => {
        this.currentUser.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  signup(request: SignupRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.API}/signup`, request);
  }

  getUser(): Observable<UserInfoResponse> {
    return this.http.get<UserInfoResponse>(`${this.API}/user`, { withCredentials: true });
  }

  getUsername(): Observable<string> {
    return this.http.get(`${this.API}/username`, { withCredentials: true, responseType: 'text' });
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    const user = this.currentUser();
    if (!user?.jwtToken) return null;
    // jwtToken may contain cookie string like "jwtCookieName=xxx; Path=/api; ..."
    const token = user.jwtToken;
    if (token.includes('=')) {
      const parts = token.split(';')[0];
      return parts.split('=').slice(1).join('=');
    }
    return token;
  }
}
