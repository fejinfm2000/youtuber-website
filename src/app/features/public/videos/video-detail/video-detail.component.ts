import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideosApiService } from '../../../../core/data/sheetdb/videos-api.service';
import { ProductsApiService } from '../../../../core/data/sheetdb/products-api.service';
import { SeoService } from '../../../../core/services/seo.service';
import { Video } from '../../../../core/models/video.model';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-video-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="video-detail-page" *ngIf="video() as v">
      
      <!-- Video Player Theater Section -->
      <section class="player-section">
        <div class="container">
          
          <div class="breadcrumb-row">
            <a routerLink="/videos" class="back-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
              Back to all videos
            </a>
            <span class="breadcrumb-separator">/</span>
            <span class="category-chip">{{ v.category }}</span>
          </div>

          <!-- Responsive 16:9 YouTube Embed -->
          <div class="theater-embed-wrap glass-card">
            <iframe
              [src]="embedUrl()"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              class="youtube-iframe">
            </iframe>
          </div>

          <!-- Video Header / Meta -->
          <div class="video-headline-card glass-card">
            <h1 class="video-title">{{ v.title }}</h1>
            
            <div class="video-meta-bar">
              <div class="meta-left">
                <span class="meta-pill">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Published {{ v.publishedAt | date:'longDate' }}
                </span>
                <span class="meta-pill" *ngIf="v.viewCount">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  {{ v.viewCount | number }} views
                </span>
              </div>
              <div class="meta-right">
                <a [href]="v.youtubeUrl" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" id="watch-on-youtube-btn">
                  Watch on YouTube ↗
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Video Content & Related Products Grid -->
      <section class="section">
        <div class="container detail-content-layout">
          
          <!-- Left Main Column (Description & Timestamps) -->
          <div class="main-column">
            
            <!-- Sponsor Banner if exists -->
            <div class="glass-card sponsor-banner">
              <span class="badge badge-accent">SPONSOR SPOTLIGHT</span>
              <div class="sponsor-body">
                <div>
                  <h4>Build faster with modern tools</h4>
                  <p>Get 20% off your subscription with code <strong>CREATOR20</strong>.</p>
                </div>
                <a routerLink="/products" class="btn btn-primary btn-sm">Explore Deal</a>
              </div>
            </div>

            <!-- Description Card -->
            <div class="glass-card description-card">
              <h3 class="section-heading">About this video</h3>
              <div class="video-description-text">
                {{ v.description }}
              </div>

              <!-- Tags -->
              <div class="tags-row" *ngIf="v.tags && v.tags.length > 0">
                <span class="tag-label">Tags:</span>
                <span class="chip" *ngFor="let tag of v.tags">#{{ tag }}</span>
              </div>
            </div>

          </div>

          <!-- Right Sidebar (Featured Gear & Related Content) -->
          <aside class="sidebar-column">
            
            <!-- Mentioned Gear & Products -->
            <div class="glass-card sidebar-card">
              <h3 class="sidebar-title">Gear Used in this Video</h3>
              <p class="sidebar-sub">Creator's recommended setup for this episode.</p>

              <div class="mentioned-products-list">
                <div class="product-mini-item" *ngFor="let prod of relatedProducts()">
                  <img [src]="prod.image" [alt]="prod.name" class="product-mini-thumb" />
                  <div class="product-mini-details">
                    <h5 class="product-mini-name">
                      <a [routerLink]="['/products', prod.slug]">{{ prod.name }}</a>
                    </h5>
                    <span class="product-mini-price" *ngIf="prod.price">₹{{ prod.price | number }}</span>
                    <a [routerLink]="['/products', prod.slug]" class="mini-view-link">View Details →</a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Related Videos -->
            <div class="glass-card sidebar-card">
              <h3 class="sidebar-title">More Videos You Might Like</h3>
              
              <div class="related-videos-list">
                <div class="related-video-item" *ngFor="let rel of relatedVideos()">
                  <img [src]="rel.thumbnail" [alt]="rel.title" class="rel-thumb" />
                  <div class="rel-details">
                    <h5 class="rel-title">
                      <a [routerLink]="['/videos', rel.slug]">{{ rel.title }}</a>
                    </h5>
                    <span class="rel-meta">{{ rel.publishedAt | date:'mediumDate' }}</span>
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
    .player-section {
      padding-top: var(--space-xl);
    }

    .breadcrumb-row {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
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

    .theater-embed-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      margin-bottom: var(--space-lg);
      padding: 0;
      border: 1px solid var(--border-strong);
    }

    .youtube-iframe {
      width: 100%;
      height: 100%;
      display: block;
    }

    .video-headline-card {
      padding: var(--space-xl);
      margin-bottom: var(--space-xl);
    }

    .video-title {
      font-size: clamp(1.5rem, 3vw, 2.2rem);
      font-weight: 800;
      margin-bottom: var(--space-md);
      line-height: 1.25;
    }

    .video-meta-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-md);
      border-top: 1px solid var(--border);
      padding-top: var(--space-md);
    }

    .meta-left {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;

      .meta-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.85rem;
        color: var(--text-secondary);
      }
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

    .sponsor-banner {
      padding: var(--space-lg);
      border-left: 4px solid var(--accent);

      .sponsor-body {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-md);
        margin-top: var(--space-sm);
        flex-wrap: wrap;

        h4 { font-size: 1.05rem; margin-bottom: 2px; }
        p { font-size: 0.88rem; color: var(--text-secondary); margin: 0; }
      }
    }

    .description-card {
      padding: var(--space-xl);

      .section-heading {
        font-size: 1.2rem;
        margin-bottom: var(--space-md);
      }
    }

    .video-description-text {
      font-size: 0.95rem;
      color: var(--text-secondary);
      line-height: 1.8;
      white-space: pre-line;
      margin-bottom: var(--space-xl);
    }

    .tags-row {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      flex-wrap: wrap;
      border-top: 1px solid var(--border);
      padding-top: var(--space-md);

      .tag-label {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 600;
      }
    }

    .sidebar-card {
      padding: var(--space-xl);
    }

    .sidebar-title {
      font-size: 1.1rem;
      margin-bottom: 4px;
    }

    .sidebar-sub {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-bottom: var(--space-lg);
    }

    .mentioned-products-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .product-mini-item {
      display: flex;
      gap: var(--space-md);
      align-items: center;
      background: var(--surface-solid);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px;
      transition: border-color var(--transition-fast);

      &:hover { border-color: var(--accent); }

      .product-mini-thumb {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: var(--radius-xs);
        flex-shrink: 0;
      }
    }

    .product-mini-details {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .product-mini-name {
        font-size: 0.88rem;
        a { color: var(--text-primary); &:hover { color: var(--accent); } }
      }
      .product-mini-price { font-size: 0.8rem; font-weight: 700; color: var(--accent); }
      .mini-view-link { font-size: 0.75rem; color: var(--text-muted); &:hover { color: var(--accent); } }
    }

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
export class VideoDetailComponent implements OnInit {
  video = signal<Video | null>(null);
  embedUrl = signal<SafeResourceUrl>('');
  relatedProducts = signal<Product[]>([]);
  relatedVideos = signal<Video[]>([]);

  constructor(
    private route: ActivatedRoute,
    private videosApi: VideosApiService,
    private productsApi: ProductsApiService,
    private sanitizer: DomSanitizer,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadVideo(slug);
      }
    });

    this.productsApi.getAll().subscribe(prods => {
      this.relatedProducts.set(prods.slice(0, 3));
    });

    this.videosApi.getPopular(4).subscribe(vids => {
      this.relatedVideos.set(vids);
    });
  }

  private loadVideo(slug: string): void {
    this.videosApi.getBySlug(slug).subscribe(v => {
      if (v) {
        this.video.set(v);
        const url = `https://www.youtube-nocookie.com/embed/${v.youtubeVideoId}?autoplay=0&rel=0`;
        this.embedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
        
        this.seo.setPage({
          title: v.title,
          description: v.shortDescription || v.description,
          image: v.thumbnail,
        });
      }
    });
  }
}
