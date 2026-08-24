import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsApiService } from '../../../../core/data/sheetdb/products-api.service';
import { VideosApiService } from '../../../../core/data/sheetdb/videos-api.service';
import { SeoService } from '../../../../core/services/seo.service';
import { Product } from '../../../../core/models/product.model';
import { Video } from '../../../../core/models/video.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="product-detail-page" *ngIf="product() as p">
      
      <!-- Top Breadcrumb -->
      <div class="container breadcrumb-container">
        <div class="breadcrumb-row">
          <a routerLink="/products" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
            Back to Recommendations
          </a>
          <span class="breadcrumb-separator">/</span>
          <span class="category-chip">{{ p.category }}</span>
        </div>
      </div>

      <!-- Main Product Showcase Section -->
      <section class="section product-showcase-section">
        <div class="container showcase-grid">
          
          <!-- Left: Product Image & Gallery -->
          <div class="product-visual-col">
            <div class="glass-card main-img-card">
              <img [src]="p.image" [alt]="p.name" class="main-prod-img" />
              <span class="product-type-badge">{{ p.type }}</span>
            </div>
          </div>

          <!-- Right: Product Information & Purchasing CTAs -->
          <div class="product-info-col">
            <div class="glass-card info-card">
              
              <div class="brand-rating-row">
                <span class="brand-pill">{{ p.brand || p.category }}</span>
                <span class="rating-badge" *ngIf="p.rating">★ {{ p.rating }} / 5.0</span>
              </div>

              <h1 class="product-name">{{ p.name }}</h1>
              
              <p class="product-short-desc">{{ p.shortDescription }}</p>

              <!-- Price Row -->
              <div class="price-display-row">
                <div class="price-val" *ngIf="p.price && p.price > 0">
                  {{ p.currency === 'USD' ? '$' : '₹' }}{{ p.price | number }}
                </div>
                <div class="price-free" *ngIf="!p.price || p.price === 0">
                  Free / Open Tier Available
                </div>
              </div>

              <!-- Member Exclusive Discount Box -->
              <div class="member-discount-box" *ngIf="p.memberDiscountEligible">
                <div class="discount-header">
                  <span class="badge badge-accent">🎁 MEMBER EXCLUSIVE PERK</span>
                  <span class="discount-percent">{{ p.memberDiscountPercent }}% OFF</span>
                </div>
                <p class="discount-info">
                  Members get {{ p.memberDiscountPercent }}% off when ordering directly from the partner website.
                </p>
                <div class="promo-code-box">
                  <code>CREATOR{{ p.memberDiscountPercent || 10 }}</code>
                  <button class="btn btn-secondary btn-sm" (click)="copyCode('CREATOR10')">
                    {{ codeCopied() ? 'Copied! ✓' : 'Copy Code' }}
                  </button>
                </div>
              </div>

              <!-- Purchase Links Buttons -->
              <div class="buy-options-section">
                <h4 class="buy-section-title">Where to Buy / Download:</h4>
                <div class="buy-buttons-grid">
                  <a *ngIf="p.officialUrl" [href]="p.officialUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    Official Website ↗
                  </a>
                  <a *ngIf="p.amazonUrl" [href]="p.amazonUrl" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                    View on Amazon ↗
                  </a>
                  <a *ngIf="p.affiliateUrl" [href]="p.affiliateUrl" target="_blank" rel="noopener noreferrer" class="btn btn-accent-outline">
                    Special Partner Link ↗
                  </a>
                </div>
                <span class="affiliate-note">
                  Buying through these links supports the creator at no additional cost to you.
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      <!-- Creator's Review & In-Depth Opinion -->
      <section class="section review-section">
        <div class="container detail-content-layout">
          
          <div class="main-column">
            
            <!-- Creator Verdict Box -->
            <div class="glass-card creator-verdict-box" *ngIf="p.creatorNote">
              <div class="verdict-header">
                <span class="creator-avatar">🎙️</span>
                <div>
                  <h3>Creator's In-Depth Verdict</h3>
                  <span class="verdict-sub">Personal experience & real-world testing</span>
                </div>
              </div>
              <p class="verdict-text">“{{ p.creatorNote }}”</p>
            </div>

            <!-- Full Description -->
            <div class="glass-card product-details-card">
              <h3 class="card-heading">Product Overview</h3>
              <div class="full-desc-text">
                {{ p.description }}
              </div>
            </div>

          </div>

          <!-- Sidebar: Related Videos -->
          <aside class="sidebar-column">
            <div class="glass-card sidebar-card">
              <h3 class="sidebar-title">Featured in Videos</h3>
              <p class="sidebar-sub">Watch how this gear performs in action.</p>

              <div class="related-videos-list">
                <div class="related-video-item" *ngFor="let vid of relatedVideos()">
                  <img [src]="vid.thumbnail" [alt]="vid.title" class="rel-thumb" />
                  <div class="rel-details">
                    <h5 class="rel-title">
                      <a [routerLink]="['/videos', vid.slug]">{{ vid.title }}</a>
                    </h5>
                    <span class="rel-meta">{{ vid.publishedAt | date:'mediumDate' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </section>

    </div>
  `,
  styles: [`
    .breadcrumb-container {
      padding-top: var(--space-xl);
    }

    .breadcrumb-row {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: 0.85rem;

      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: var(--text-secondary);
        &:hover { color: var(--accent); }
      }
      .breadcrumb-separator { color: var(--text-muted); }
      .category-chip { color: var(--accent); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; }
    }

    .showcase-grid {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: var(--space-2xl);

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .main-img-card {
      position: relative;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;

      .main-prod-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .product-type-badge {
        position: absolute;
        top: 16px;
        left: 16px;
        background: var(--surface-solid);
        border: 1px solid var(--border);
        padding: 4px 12px;
        border-radius: var(--radius-xs);
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--text-secondary);
      }
    }

    .info-card {
      padding: var(--space-2xl);
    }

    .brand-rating-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-sm);

      .brand-pill {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .rating-badge {
        font-size: 0.85rem;
        color: var(--accent);
        font-weight: 700;
      }
    }

    .product-name {
      font-size: clamp(1.8rem, 3.5vw, 2.6rem);
      font-weight: 900;
      margin-bottom: var(--space-sm);
      line-height: 1.2;
    }

    .product-short-desc {
      font-size: 1.05rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: var(--space-lg);
    }

    .price-display-row {
      margin-bottom: var(--space-xl);

      .price-val {
        font-size: 2rem;
        font-weight: 900;
        color: var(--text-primary);
      }
      .price-free {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--success);
      }
    }

    .member-discount-box {
      background: var(--accent-softer);
      border: 1px solid var(--accent);
      border-radius: var(--radius-md);
      padding: var(--space-lg);
      margin-bottom: var(--space-xl);

      .discount-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-sm);
      }
      .discount-percent {
        font-size: 1rem;
        font-weight: 800;
        color: var(--accent);
      }
      .discount-info {
        font-size: 0.88rem;
        color: var(--text-secondary);
        margin-bottom: var(--space-md);
      }
    }

    .promo-code-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--surface-solid);
      border: 1px dashed var(--accent);
      border-radius: var(--radius-sm);
      padding: 8px 12px;

      code {
        font-family: monospace;
        font-size: 1.1rem;
        font-weight: 800;
        color: var(--accent);
        letter-spacing: 0.1em;
      }
    }

    .buy-options-section {
      border-top: 1px solid var(--border);
      padding-top: var(--space-lg);

      .buy-section-title {
        font-size: 0.9rem;
        margin-bottom: var(--space-md);
      }
    }

    .buy-buttons-grid {
      display: flex;
      gap: var(--space-sm);
      flex-wrap: wrap;
      margin-bottom: var(--space-sm);
    }

    .affiliate-note {
      font-size: 0.75rem;
      color: var(--text-muted);
      display: block;
    }

    /* Detail Layout */
    .detail-content-layout {
      display: grid;
      grid-template-columns: 1.8fr 1fr;
      gap: var(--space-xl);

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .main-column, .sidebar-column {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .creator-verdict-box {
      padding: var(--space-xl);
      border-left: 4px solid var(--accent);

      .verdict-header {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        margin-bottom: var(--space-md);

        .creator-avatar { font-size: 1.8rem; }
        h3 { font-size: 1.15rem; margin-bottom: 2px; }
        .verdict-sub { font-size: 0.8rem; color: var(--text-muted); }
      }

      .verdict-text {
        font-size: 1rem;
        font-style: italic;
        color: var(--text-primary);
        line-height: 1.7;
        margin: 0;
      }
    }

    .product-details-card {
      padding: var(--space-xl);

      .card-heading {
        font-size: 1.2rem;
        margin-bottom: var(--space-md);
      }

      .full-desc-text {
        font-size: 0.95rem;
        color: var(--text-secondary);
        line-height: 1.8;
      }
    }

    .sidebar-card {
      padding: var(--space-xl);
    }

    .sidebar-title { font-size: 1.1rem; margin-bottom: 4px; }
    .sidebar-sub { font-size: 0.82rem; color: var(--text-muted); margin-bottom: var(--space-lg); }

    .related-videos-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .related-video-item {
      display: flex;
      gap: var(--space-md);
      align-items: center;

      .rel-thumb {
        width: 100px;
        aspect-ratio: 16 / 9;
        object-fit: cover;
        border-radius: var(--radius-xs);
        flex-shrink: 0;
      }

      .rel-title {
        font-size: 0.88rem;
        line-height: 1.3;
        margin-bottom: 2px;
        a { color: var(--text-primary); &:hover { color: var(--accent); } }
      }

      .rel-meta { font-size: 0.75rem; color: var(--text-muted); }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  relatedVideos = signal<Video[]>([]);
  codeCopied = signal(false);

  constructor(
    private route: ActivatedRoute,
    private productsApi: ProductsApiService,
    private videosApi: VideosApiService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProduct(slug);
      }
    });

    this.videosApi.getPopular(3).subscribe(vids => {
      this.relatedVideos.set(vids);
    });
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code);
    this.codeCopied.set(true);
    setTimeout(() => this.codeCopied.set(false), 2500);
  }

  private loadProduct(slug: string): void {
    this.productsApi.getBySlug(slug).subscribe(p => {
      if (p) {
        this.product.set(p);
        this.seo.setPage({
          title: `${p.name} Review & Recommendations`,
          description: p.shortDescription || p.description,
          image: p.image,
        });
      }
    });
  }
}
