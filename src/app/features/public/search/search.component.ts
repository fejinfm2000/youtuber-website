import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideosApiService } from '../../../core/data/sheetdb/videos-api.service';
import { ProductsApiService } from '../../../core/data/sheetdb/products-api.service';
import { SeoService } from '../../../core/services/seo.service';
import { Video } from '../../../core/models/video.model';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="search-page">
      <section class="section">
        <div class="container">
          
          <div class="search-hero-card glass-card">
            <span class="badge badge-accent">EXPLORER SEARCH</span>
            <h1 class="search-title">Search Videos, Food Trails & Gear</h1>
            
            <div class="search-bar-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input 
                type="text" 
                class="main-search-input" 
                placeholder="Search biriyani recipes, night markets, travel trails, cameras, mics..." 
                [(ngModel)]="query" 
                id="global-search-input"
              />
              <button class="clear-btn" *ngIf="query" (click)="query = ''">✕</button>
            </div>
          </div>

          <!-- Matching Videos Section -->
          <div class="results-block" *ngIf="matchedVideos().length > 0">
            <h3 class="block-title">
              <span>Videos & Food Trails ({{ matchedVideos().length }})</span>
              <a routerLink="/videos" class="see-all-link">View all videos →</a>
            </h3>

            <div class="grid-3">
              <div class="glass-card result-video-card" *ngFor="let vid of matchedVideos()">
                <img [src]="vid.thumbnail" [alt]="vid.title" class="result-thumb" />
                <div class="result-body">
                  <span class="result-cat">{{ vid.category }}</span>
                  <h4 class="result-name">
                    <a [routerLink]="['/videos', vid.slug]">{{ vid.title }}</a>
                  </h4>
                  <p class="result-desc">{{ vid.shortDescription || vid.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Matching Products Section -->
          <div class="results-block" *ngIf="matchedProducts().length > 0">
            <h3 class="block-title">
              <span>Gear & Products ({{ matchedProducts().length }})</span>
              <a routerLink="/products" class="see-all-link">View all gear →</a>
            </h3>

            <div class="grid-3">
              <div class="glass-card result-product-card" *ngFor="let prod of matchedProducts()">
                <img [src]="prod.image" [alt]="prod.name" class="result-prod-img" />
                <div class="result-body">
                  <span class="result-cat">{{ prod.brand || prod.category }}</span>
                  <h4 class="result-name">
                    <a [routerLink]="['/products', prod.slug]">{{ prod.name }}</a>
                  </h4>
                  <span class="result-price" *ngIf="prod.price">₹{{ prod.price | number }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results State -->
          <div class="glass-card no-results-card" *ngIf="query && matchedVideos().length === 0 && matchedProducts().length === 0">
            <div class="icon">🔍</div>
            <h3>No matches found for "{{ query }}"</h3>
            <p>Try searching for broader keywords like "camera", "AI", "microphone", or "software".</p>
          </div>

        </div>
      </section>
    </div>
  `,
  styles: [`
    .search-hero-card {
      padding: var(--space-2xl);
      text-align: center;
      margin-bottom: var(--space-3xl);
    }

    .search-title {
      font-size: clamp(1.8rem, 3.5vw, 2.8rem);
      margin: var(--space-sm) 0 var(--space-xl);
    }

    .search-bar-wrap {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      background: var(--surface-solid);
      border: 1px solid var(--border);
      border-radius: var(--radius-full);
      padding: 6px var(--space-xl);
      max-width: 720px;
      margin: 0 auto;

      svg { color: var(--accent); }
    }

    .main-search-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 14px 0;
      font-size: 1.05rem;
      color: var(--text-primary);
      outline: none;
      &::placeholder { color: var(--text-muted); }
    }

    .clear-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 1.1rem;
      &:hover { color: var(--text-primary); }
    }

    .results-block {
      margin-bottom: var(--space-3xl);
    }

    .block-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.3rem;
      margin-bottom: var(--space-lg);
      border-bottom: 1px solid var(--border);
      padding-bottom: var(--space-sm);

      .see-all-link { font-size: 0.85rem; color: var(--accent); }
    }

    .result-video-card, .result-product-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .result-thumb, .result-prod-img {
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
    }

    .result-prod-img {
      aspect-ratio: 4 / 3;
    }

    .result-body {
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .result-cat {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .result-name {
      font-size: 1.05rem;
      margin-bottom: 6px;
      a { color: var(--text-primary); &:hover { color: var(--accent); } }
    }

    .result-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .result-price {
      margin-top: auto;
      font-weight: 800;
      color: var(--text-primary);
    }

    .no-results-card {
      padding: var(--space-3xl);
      text-align: center;
      .icon { font-size: 2.8rem; margin-bottom: var(--space-md); }
      h3 { margin-bottom: var(--space-xs); }
      p { color: var(--text-secondary); }
    }
  `]
})
export class SearchComponent implements OnInit {
  query = '';
  allVideos = signal<Video[]>([]);
  allProducts = signal<Product[]>([]);

  matchedVideos = computed(() => {
    const q = this.query.trim().toLowerCase();
    if (!q) return [];
    return this.allVideos().filter(v => 
      v.title.toLowerCase().includes(q) || 
      v.description.toLowerCase().includes(q) ||
      (v.tags && v.tags.some(t => t.toLowerCase().includes(q)))
    );
  });

  matchedProducts = computed(() => {
    const q = this.query.trim().toLowerCase();
    if (!q) return [];
    return this.allProducts().filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q))
    );
  });

  constructor(
    private route: ActivatedRoute,
    private videosApi: VideosApiService,
    private productsApi: ProductsApiService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Search Food Trails & Gear — Pirai Adhi',
      description: 'Search across all street food videos, recipes, travel trails, and gear on Pirai Adhi - The Explorer.',
    });

    this.videosApi.getAll().subscribe(v => this.allVideos.set(v));
    this.productsApi.getAll().subscribe(p => this.allProducts.set(p));

    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.query = params['q'];
      }
    });
  }
}
