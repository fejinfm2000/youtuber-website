import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'SUPER_ADMIN' | 'CREATOR' | 'EDITOR' | 'MODERATOR' | 'ANALYST' | 'USER';
  emailVerified: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<AuthUser | null>(this.getStoredUser());

  constructor(private router: Router) {}

  loginAsCreator(): void {
    const creatorUser: AuthUser = {
      uid: 'creator-admin-1',
      email: 'piraiadhi@explorer.com',
      displayName: 'Pirai Adhi (Admin)',
      role: 'CREATOR',
      emailVerified: true,
    };
    this.setUser(creatorUser);
    this.router.navigate(['/admin/dashboard']);
  }

  login(email: string, pass: string): boolean {
    if (email && pass) {
      const user: AuthUser = {
        uid: 'user-' + Date.now(),
        email,
        displayName: email.split('@')[0],
        role: email.includes('admin') ? 'CREATOR' : 'USER',
        emailVerified: true,
      };
      this.setUser(user);
      if (user.role === 'CREATOR') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/']);
      }
      return true;
    }
    return false;
  }

  register(name: string, email: string, pass: string): boolean {
    if (name && email && pass) {
      const user: AuthUser = {
        uid: 'user-' + Date.now(),
        email,
        displayName: name,
        role: 'USER',
        emailVerified: true,
      };
      this.setUser(user);
      this.router.navigate(['/']);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('creatorhub_user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    const u = this.currentUser();
    return u !== null && (u.role === 'CREATOR' || u.role === 'SUPER_ADMIN' || u.role === 'EDITOR');
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  private setUser(user: AuthUser): void {
    localStorage.setItem('creatorhub_user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private getStoredUser(): AuthUser | null {
    const data = localStorage.getItem('creatorhub_user');
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    return null;
  }
}
