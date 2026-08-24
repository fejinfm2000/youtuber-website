import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsApiService } from '../../../core/data/sheetdb/products-api.service';

@Component({
  selector: 'app-affiliate-redirect',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="redirect-page">
      <div class="glass-card redirect-card">
        <div class="spinner"></div>
        <h2>Redirecting to Partner Store...</h2>
        <p *ngIf="productName()">Taking you to <strong>{{ productName() }}</strong></p>
        <p class="sub">If you are not redirected automatically within 3 seconds:</p>
        <a [href]="targetUrl()" class="btn btn-primary btn-sm" *ngIf="targetUrl()">
          Click here to continue ↗
        </a>
      </div>
    </div>
  `,
  styles: [`
    .redirect-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
    }

    .redirect-card {
      padding: var(--space-3xl);
      text-align: center;
      max-width: 500px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-md);

      h2 { font-size: 1.4rem; }
      p { color: var(--text-secondary); margin: 0; }
      .sub { font-size: 0.85rem; color: var(--text-muted); }
    }

    .spinner {
      width: 44px;
      height: 44px;
      border: 3px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class AffiliateRedirectComponent implements OnInit {
  productName = signal('');
  targetUrl = signal('');

  constructor(
    private route: ActivatedRoute,
    private productsApi: ProductsApiService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.productsApi.getBySlug(slug).subscribe(p => {
        if (p) {
          this.productName.set(p.name);
          const dest = p.affiliateUrl || p.amazonUrl || p.officialUrl || '/products';
          this.targetUrl.set(dest);
          setTimeout(() => {
            window.location.href = dest;
          }, 1200);
        } else {
          window.location.href = '/products';
        }
      });
    }
  }
}
