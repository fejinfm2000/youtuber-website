import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-affiliate-disclosure',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="legal-page section">
      <div class="container">
        <div class="glass-card legal-card">
          <h1>Affiliate Disclosure</h1>
          <p class="updated">Transparency Policy — August 2026</p>

          <section>
            <h2>Honesty First</h2>
            <p>Some of the outbound links on this website (such as to Amazon, specific SaaS platforms, or partner gear sites) are affiliate links. This means that if you click on the link and purchase the item, the creator may receive an affiliate commission at no additional cost to you.</p>
          </section>

          <section>
            <h2>Unbiased Recommendations</h2>
            <p>Every product, microphone, camera, SaaS tool, and laptop featured on this site has been purchased or thoroughly tested by the creator. We never recommend a tool solely because of an affiliate relationship.</p>
          </section>

          <section>
            <h2>Sponsorship Transparency</h2>
            <p>When a video or article is sponsored, it is clearly designated with a sponsor spotlight banner so our audience is always informed.</p>
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
export class AffiliateDisclosureComponent {}
