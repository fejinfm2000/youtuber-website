import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="auth-page">
      <div class="glass-card auth-card">
        
        <div class="auth-header">
          <a routerLink="/" class="auth-logo">
            <span class="logo-icon">🧭</span>
            <span class="logo-text">Pirai Adhi</span>
          </a>
          <h2>Welcome Back</h2>
          <p>Sign in to manage content, claim perks, or enter creator studio.</p>
        </div>

        <!-- Quick Demo Creator Login CTA -->
        <div class="demo-login-box">
          <div class="demo-info">
            <strong>⚡ Creator / Admin Demo</strong>
            <p>One-click instant login to access the full Creator Dashboard & CRUD tools.</p>
          </div>
          <button class="btn btn-primary" (click)="loginAsCreator()" id="demo-creator-login-btn">
            Login as Creator (Admin) →
          </button>
        </div>

        <div class="auth-divider">
          <span>OR WITH EMAIL</span>
        </div>

        <form (submit)="onLogin($event)" class="auth-form">
          <div class="form-group">
            <label for="login-email">Email Address</label>
            <input 
              type="email" 
              id="login-email" 
              class="input" 
              [(ngModel)]="email" 
              name="email" 
              placeholder="piraiadhi@explorer.com" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="login-password">Password</label>
            <input 
              type="password" 
              id="login-password" 
              class="input" 
              [(ngModel)]="password" 
              name="password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" class="btn btn-secondary" id="login-submit-btn">
            Sign In with Email
          </button>
        </form>

        <div class="auth-footer">
          <span>Don't have an account?</span>
          <a routerLink="/register">Create free member account</a>
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

    .demo-login-box {
      background: var(--accent-softer);
      border: 1px solid var(--accent);
      border-radius: var(--radius-md);
      padding: var(--space-lg);
      margin-bottom: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);

      .demo-info {
        strong { color: var(--accent); font-size: 0.95rem; display: block; margin-bottom: 2px; }
        p { font-size: 0.82rem; color: var(--text-secondary); margin: 0; }
      }
    }

    .auth-divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: var(--space-lg) 0;
      color: var(--text-muted);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;

      &::before, &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid var(--border);
      }

      span { padding: 0 var(--space-md); }
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
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  loginAsCreator(): void {
    this.authService.loginAsCreator();
  }

  onLogin(e: Event): void {
    e.preventDefault();
    this.authService.login(this.email, this.password);
  }
}
