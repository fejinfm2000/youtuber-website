import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found-page">
      <div class="glass-card not-found-card">
        <span class="error-code gradient-text">404</span>
        <h1>Page Not Found</h1>
        <p>The tutorial, gear recommendation, or page you are looking for has moved or does not exist.</p>
        <div class="actions">
          <a routerLink="/" class="btn btn-primary">Return to Homepage</a>
          <a routerLink="/videos" class="btn btn-secondary">Explore Videos</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
    }

    .not-found-card {
      padding: var(--space-3xl);
      text-align: center;
      max-width: 550px;

      .error-code {
        font-size: 5rem;
        font-weight: 900;
        line-height: 1;
        display: block;
        margin-bottom: var(--space-md);
      }

      h1 { font-size: 2rem; margin-bottom: var(--space-sm); }
      p { color: var(--text-secondary); margin-bottom: var(--space-xl); }
      .actions { display: flex; justify-content: center; gap: var(--space-md); }
    }
  `]
})
export class NotFoundComponent {}
