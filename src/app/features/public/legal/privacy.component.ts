import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="legal-page section">
      <div class="container">
        <div class="glass-card legal-card">
          <h1>Privacy Policy</h1>
          <p class="updated">Last updated: August 2026</p>

          <section>
            <h2>1. Information We Collect</h2>
            <p>We only collect information necessary to provide member features such as newsletter subscription, business enquiry handling, and public community chat.</p>
          </section>

          <section>
            <h2>2. How We Use Information</h2>
            <p>Your email is used solely for the communication channels you explicitly opt into. We never sell or distribute your personal data to third parties.</p>
          </section>

          <section>
            <h2>3. Analytics & Cookies</h2>
            <p>We use lightweight, privacy-focused analytics to track high-level visitor metrics (e.g. video watch counts, outbound affiliate clicks) to improve content quality.</p>
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
export class PrivacyComponent {}
