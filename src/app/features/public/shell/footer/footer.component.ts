import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CreatorApiService } from '@data/sheetdb/creator-api.service';
import { SocialLink } from '@models/creator.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="site-footer">
      <div class="container footer-inner">
        <!-- Brand col -->
        <div class="footer-brand">
          <a routerLink="/" class="footer-logo">
            <span class="logo-icon">🧭</span>
            <span class="logo-text">Pirai Adhi</span>
          </a>
          <p class="footer-tagline">Exploring authentic tastes, vibrant street foods, and travel journeys across India.</p>
          <div class="social-links">
            <a *ngFor="let link of socialLinks"
               [href]="link.url"
               target="_blank"
               rel="noopener noreferrer"
               [attr.aria-label]="link.label"
               class="social-icon">
              <span [innerHTML]="getSocialIcon(link.platform)"></span>
            </a>
          </div>
        </div>

        <!-- Nav cols -->
        <div class="footer-nav-cols">
          <div class="footer-nav-col">
            <h4 class="footer-nav-title">Content</h4>
            <nav>
              <a routerLink="/videos" class="footer-nav-link">Videos</a>
              <a routerLink="/products" class="footer-nav-link">Gear & Essentials</a>
              <a routerLink="/community" class="footer-nav-link">Community</a>
              <a routerLink="/about" class="footer-nav-link">About</a>
            </nav>
          </div>

          <div class="footer-nav-col">
            <h4 class="footer-nav-title">Connect</h4>
            <nav>
              <a routerLink="/contact" class="footer-nav-link">Collaborate / Contact</a>
              <a routerLink="/search" class="footer-nav-link">Search</a>
            </nav>
          </div>

          <div class="footer-nav-col">
            <h4 class="footer-nav-title">Legal</h4>
            <nav>
              <a routerLink="/privacy" class="footer-nav-link">Privacy Policy</a>
              <a routerLink="/terms" class="footer-nav-link">Terms of Service</a>
              <a routerLink="/affiliate-disclosure" class="footer-nav-link">Affiliate Disclosure</a>
            </nav>
          </div>
        </div>

        <!-- Newsletter mini -->
        <div class="footer-newsletter">
          <h4 class="footer-nav-title">Stay Updated</h4>
          <p class="footer-newsletter-sub">New food trails, secret spots & travel vlogs in your inbox.</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Your email address" class="input newsletter-input" id="footer-newsletter-email">
            <button class="btn btn-primary btn-sm" id="footer-newsletter-btn">Subscribe</button>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <p class="copyright">© {{ year }} Pirai Adhi - The Explorer. All rights reserved.</p>
          <p class="footer-disclaimer">
            Some links may be affiliate links. I only recommend gear and cookware I personally use.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: var(--bg-secondary);
      border-top: 1px solid var(--border);
      margin-top: var(--space-3xl);
    }

    .footer-inner {
      display: grid;
      grid-template-columns: 1.3fr 2fr 1.3fr;
      gap: var(--space-2xl);
      padding: var(--space-2xl) 0 var(--space-xl);
      align-items: start;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr 1fr;
        gap: var(--space-xl);
      }

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: var(--space-xl);
        padding: var(--space-xl) 0 var(--space-lg);
      }
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      margin-bottom: var(--space-sm);
      .logo-icon { font-size: 1.4rem; color: var(--accent); }
      .logo-text { font-size: 1.1rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em; }
    }

    .footer-tagline {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: var(--space-md);
      line-height: 1.6;
    }

    .social-links {
      display: flex;
      gap: var(--space-sm);
      flex-wrap: wrap;
    }

    .social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: var(--radius-xs);
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      transition: all var(--transition-fast);
      text-decoration: none;

      &:hover {
        background: var(--accent-soft);
        border-color: var(--accent);
        color: var(--accent);
        transform: translateY(-2px);
      }

      svg { width: 16px; height: 16px; }
    }

    .footer-nav-cols {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-lg);

      @media (max-width: 1024px) {
        grid-column: 1 / -1;
        border-top: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        padding: var(--space-lg) 0;
      }

      @media (max-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-md);
      }

      @media (max-width: 420px) {
        grid-template-columns: 1fr;
      }
    }

    .footer-nav-col {
      display: flex;
      flex-direction: column;
    }

    .footer-nav-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: var(--space-md);
    }

    .footer-nav-link {
      font-size: 0.875rem;
      color: var(--text-secondary);
      text-decoration: none;
      padding: 5px 0;
      transition: color var(--transition-fast);
      display: block;
      &:hover { color: var(--accent); }
    }

    .footer-newsletter {
      display: flex;
      flex-direction: column;
    }

    .footer-newsletter-sub {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: var(--space-md);
      line-height: 1.5;
    }

    .newsletter-form {
      display: flex;
      gap: var(--space-sm);
      flex-direction: column;
    }

    .newsletter-input {
      font-size: 0.875rem;
      padding: 10px 14px;
    }

    .footer-bottom {
      border-top: 1px solid var(--border);
      padding: var(--space-md) 0;
    }

    .footer-bottom-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-md);
      flex-wrap: wrap;

      @media (max-width: 640px) {
        flex-direction: column;
        text-align: center;
        gap: var(--space-xs);
      }
    }

    .copyright, .footer-disclaimer {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin: 0;
    }
  `]
})
export class FooterComponent implements OnInit {
  socialLinks: SocialLink[] = [];
  year = new Date().getFullYear();

  constructor(private creatorApi: CreatorApiService) {}

  ngOnInit(): void {
    this.creatorApi.getSocialLinks().subscribe((links: any) => this.socialLinks = links);
  }

  getSocialIcon(platform: string): string {
    const icons: Record<string, string> = {
      YouTube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>`,
      Instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
      X: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      LinkedIn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
      GitHub: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
      Discord: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.112 18.103.13 18.117a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>`,
    };
    return icons[platform] || `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>`;
  }
}
