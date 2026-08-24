import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="auth-page">
      <div class="glass-card auth-card">
        
        <div class="auth-header">
          <a routerLink="/" class="auth-logo">
            <span class="logo-icon">◈</span>
            <span class="logo-text">CreatorHub</span>
          </a>
          <h2>Join the Creator Community</h2>
          <p>Get member discounts, community chat access, and curated digests.</p>
        </div>

        <form (submit)="onRegister($event)" class="auth-form">
          <div class="form-group">
            <label for="reg-name">Your Name</label>
            <input 
              type="text" 
              id="reg-name" 
              class="input" 
              [(ngModel)]="name" 
              name="name" 
              placeholder="e.g. David Miller" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="reg-email">Email Address</label>
            <input 
              type="email" 
              id="reg-email" 
              class="input" 
              [(ngModel)]="email" 
              name="email" 
              placeholder="david@example.com" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="reg-password">Create Password</label>
            <input 
              type="password" 
              id="reg-password" 
              class="input" 
              [(ngModel)]="password" 
              name="password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" class="btn btn-primary" id="register-submit-btn">
            Create Member Account →
          </button>
        </form>

        <div class="auth-footer">
          <span>Already have an account?</span>
          <a routerLink="/login">Sign In</a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
      background: radial-gradient(circle at 50% 30%, var(--surface-solid) 0%, var(--bg-primary) 80%);
    }

    .auth-card {
      padding: var(--space-2xl);
      max-width: 480px;
      width: 100%;
    }

    .auth-header {
      text-align: center;
      margin-bottom: var(--space-xl);

      .auth-logo {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 1.2rem;
        font-weight: 800;
        color: var(--text-primary);
        text-decoration: none;
        margin-bottom: var(--space-md);
        .logo-icon { color: var(--accent); }
      }

      h2 { font-size: 1.6rem; margin-bottom: 4px; }
      p { font-size: 0.88rem; color: var(--text-secondary); }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .auth-footer {
      display: flex;
      justify-content: center;
      gap: 6px;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: var(--space-xl);
      border-top: 1px solid var(--border);
      padding-top: var(--space-md);

      a { color: var(--accent); font-weight: 600; }
    }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  onRegister(e: Event): void {
    e.preventDefault();
    this.authService.register(this.name, this.email, this.password);
  }
}
