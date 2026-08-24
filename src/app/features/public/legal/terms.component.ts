import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="legal-page section">
      <div class="container">
        <div class="glass-card legal-card">
          <h1>Terms of Service</h1>
          <p class="updated">Last updated: August 2026</p>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.</p>
          </section>

          <section>
            <h2>2. Community Conduct</h2>
            <p>Users participating in community chat and discussions agree to maintain respectful, civil dialogue. Harassment, spam, or promotional abuse will result in immediate moderation and ban.</p>
          </section>

          <section>
            <h2>3. Intellectual Property</h2>
            <p>All video content, tutorials, articles, graphics, and branding are the property of Alex Creator unless otherwise stated.</p>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .legal-card {
      padding: var(--space-3xl);
      max-width: 860px;
      margin: 0 auto;

      h1 { font-size: 2.4rem; margin-bottom: 6px; }
      .updated { color: var(--text-muted); font-size: 0.85rem; margin-bottom: var(--space-2xl); }
      section { margin-bottom: var(--space-xl); }
      h2 { font-size: 1.3rem; margin-bottom: var(--space-xs); }
      p { color: var(--text-secondary); line-height: 1.7; }
    }
  `]
})
export class TermsComponent {}
