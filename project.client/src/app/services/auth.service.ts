import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7076/api'; // URL de votre API
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { Username: username, PasswordHash: password })
      .pipe(map(response => {
        if (response && response.token) {
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
        }
        return response;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  signup(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, userData);
  }

  getUserRole(): Observable<string> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.role) {
      return new BehaviorSubject<string>(currentUser.role).asObservable();
    } else {
      // Fetch user role from API if not available locally
      return this.http.get<string>(`${this.apiUrl}/auth/role`);
    }
  }
}
