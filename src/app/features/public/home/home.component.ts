import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideosApiService } from '../../../core/data/sheetdb/videos-api.service';
import { ProductsApiService } from '../../../core/data/sheetdb/products-api.service';
import { CreatorApiService } from '../../../core/data/sheetdb/creator-api.service';
import { SeoService } from '../../../core/services/seo.service';
import { Video } from '../../../core/models/video.model';
import { Product } from '../../../core/models/product.model';
import { Creator, CreatorSettings } from '../../../core/models/creator.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background" style="background-image: url('assets/hero-bg.jpg');">
        <div class="hero-overlay"></div>
      </div>
      
      <div class="container hero-content">
        <div class="hero-badge animate-fade-in">
          <span class="badge-dot"></span>
          <span>CREATOR • DEVELOPER • TECH ENTHUSIAST</span>
        </div>

        <h1 class="hero-title animate-fade-in-up">
          Building & Exploring the Future of <span class="gradient-text">AI & Software</span>
        </h1>

        <p class="hero-description animate-fade-in-up" *ngIf="creator() as c">
          Hi, I'm {{ c.name }}. Join <span class="highlight">{{ c.subscriberCount }}</span> curious builders discovering high-impact tech tutorials, curated tool recommendations, and modern engineering workflows.
        </p>

        <div class="hero-actions animate-fade-in-up">
          <a routerLink="/videos" class="btn btn-primary btn-lg" id="hero-watch-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Watch Latest Videos
          </a>
          <a routerLink="/products" class="btn btn-secondary btn-lg" id="hero-gear-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            My Recommended Gear & Tools
          </a>
        </div>

        <!-- Metric Badges -->
        <div class="hero-stats" *ngIf="creator() as c">
          <div class="stat-pill">
            <span class="stat-num">{{ c.subscriberCount }}</span>
            <span class="stat-text">YouTube Subscribers</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-pill">
            <span class="stat-num">{{ c.videoCount }}</span>
            <span class="stat-text">Curated Videos</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-pill">
            <span class="stat-num">100% Free</span>
            <span class="stat-text">Knowledge Hub</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Asymmetric Highlights Grid -->
    <section class="section">
      <div class="container">
        <div class="highlights-grid">
          
          <!-- Latest Video (Featured Big Card) -->
          <div class="glass-card highlight-video-card" *ngIf="latestVideo() as video">
            <div class="card-tag-row">
              <span class="badge badge-accent">LATEST RELEASE</span>
              <span class="video-meta-tag">{{ video.category }}</span>
            </div>
            
            <div class="video-media-preview">
              <img [src]="video.thumbnail" [alt]="video.title" class="video-img" />
              <a [routerLink]="['/videos', video.slug]" class="play-overlay-btn" aria-label="Watch video">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </a>
              <span class="duration-badge" *ngIf="video.duration">{{ video.duration }}</span>
            </div>

            <div class="highlight-info">
              <h3 class="highlight-title">
                <a [routerLink]="['/videos', video.slug]">{{ video.title }}</a>
              </h3>
              <p class="highlight-desc">{{ video.description }}</p>
              <div class="highlight-footer">
                <span class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ video.publishedAt | date:'mediumDate' }}
                </span>
                <span class="meta-item" *ngIf="video.viewCount">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  {{ video.viewCount | number }} views
                </span>
                <a [routerLink]="['/videos', video.slug]" class="btn btn-sm btn-primary">Watch Now</a>
              </div>
            </div>
          </div>

          <!-- Featured Product / Top Recommendation -->
          <div class="glass-card highlight-product-card" *ngIf="featuredProduct() as prod">
            <div class="card-tag-row">
              <span class="badge badge-success">⭐ CREATOR'S TOP CHOICE</span>
              <span class="member-chip" *ngIf="prod.memberDiscountEligible">
                {{ prod.memberDiscountPercent }}% OFF FOR MEMBERS
              </span>
            </div>

            <div class="product-visual">
              <img [src]="prod.image" [alt]="prod.name" class="product-cover-img" />
              <div class="product-price-tag" *ngIf="prod.price">
                <span class="currency">₹</span>{{ prod.price | number }}
              </div>
            </div>

            <div class="product-highlight-body">
              <h3 class="product-title">
                <a [routerLink]="['/products', prod.slug]">{{ prod.name }}</a>
              </h3>
              <p class="product-quote">“{{ prod.creatorNote || prod.shortDescription }}”</p>
              
              <div class="product-actions-row">
                <a [routerLink]="['/products', prod.slug]" class="btn btn-secondary btn-sm">Read Review</a>
                <a [href]="prod.affiliateUrl || prod.amazonUrl || prod.officialUrl || '#'" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                  Buy / View Deal
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Popular Videos Showcase -->
    <section class="section popular-section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Popular Tutorials & Reviews</h2>
            <p class="section-subtitle">Deep dives that have helped hundreds of thousands of developers.</p>
          </div>
          <a routerLink="/videos" class="btn btn-ghost btn-sm" id="view-all-videos-btn">
            Explore All Videos →
          </a>
        </div>

        <div class="grid-3">
          <div class="glass-card video-card" *ngFor="let video of popularVideos()">
            <div class="video-thumbnail-wrap">
              <img [src]="video.thumbnail" [alt]="video.title" class="card-thumb" />
              <a [routerLink]="['/videos', video.slug]" class="card-play-btn" aria-label="Play">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </a>
              <span class="video-duration" *ngIf="video.duration">{{ video.duration }}</span>
            </div>
            <div class="video-card-content">
              <div class="card-category">{{ video.category }}</div>
              <h3 class="card-title">
                <a [routerLink]="['/videos', video.slug]">{{ video.title }}</a>
              </h3>
              <p class="card-description">{{ video.shortDescription || video.description }}</p>
              <div class="card-meta">
                <span>{{ video.publishedAt | date:'mediumDate' }}</span>
                <span>•</span>
                <span>{{ video.viewCount | number }} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Curated Gear & Recommendations Banner -->
    <section class="section gear-section">
      <div class="container">
        <div class="gear-banner glass-card">
          <div class="gear-banner-content">
            <span class="badge badge-accent">CREATOR SETUP</span>
            <h2 class="gear-banner-title">Tools, Hardware & Software I Use Daily</h2>
            <p class="gear-banner-desc">
              Every camera, microphone, monitor, SaaS tool and AI assistant I rely on to produce content and write code.
            </p>
            <div class="gear-pills">
              <span class="chip active">🎙️ Audio Gear</span>
              <span class="chip active">📷 Cameras & Lenses</span>
              <span class="chip active">💻 MacBook & Hardware</span>
              <span class="chip active">⚡ AI Dev Tools</span>
            </div>
            <div class="gear-banner-actions">
              <a routerLink="/products" class="btn btn-primary" id="explore-gear-btn">
                Browse All Recommendations
              </a>
              <a routerLink="/about" class="btn btn-ghost">
                About My Workspace
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Community & Newsletter CTA Section -->
    <section class="section community-newsletter-section">
      <div class="container grid-2">
        
        <!-- Community Card -->
        <div class="glass-card community-box">
          <div class="community-header">
            <div class="icon-avatar">💬</div>
            <div>
              <h3 class="community-title">Live Creator Community</h3>
              <p class="community-sub">Connect with fellow developers and talk tech in real-time.</p>
            </div>
          </div>
          <div class="community-preview-feed">
            <div class="chat-preview-item">
              <div class="user-bubble-name">Rahul <span class="badge badge-surface">Member</span></div>
              <p>That AI SaaS architecture tutorial saved me 2 weeks of trial and error! 🚀</p>
            </div>
            <div class="chat-preview-item">
              <div class="user-bubble-name">Priya <span class="badge badge-surface">Member</span></div>
              <p>Is the Sony ZV-E10 still worth it in 2026 for beginner streamers?</p>
            </div>
          </div>
          <div class="community-footer-cta">
            <a routerLink="/login" class="btn btn-accent-outline btn-sm">Join Community Chat</a>
          </div>
        </div>

        <!-- Newsletter Subscription Box -->
        <div class="glass-card newsletter-box">
          <div class="newsletter-icon-wrap">📬</div>
          <h3 class="newsletter-title">Subscribe to the Creator Digest</h3>
          <p class="newsletter-desc">
            Get exclusive tutorials, discount promo codes, and early access to video breakdowns directly in your inbox. No spam, ever.
          </p>
          <form class="newsletter-form-row" (submit)="subscribeNewsletter($event)">
            <input 
              type="email" 
              class="input" 
              placeholder="Enter your email address" 
              [(ngModel)]="newsletterEmail" 
              name="newsletterEmail"
              required 
              id="home-newsletter-input"
            />
            <button type="submit" class="btn btn-primary" id="home-newsletter-submit">
              {{ subscribed() ? 'Subscribed! 🎉' : 'Subscribe' }}
            </button>
          </form>
          <span class="newsletter-sub-note" *ngIf="subscribed()">
            Thanks for joining! Check your inbox for confirmation.
          </span>
        </div>

      </div>
    </section>
  `,
  styles: [`
    /* Hero */
    .hero-section {
      position: relative;
      min-height: 85vh;
      display: flex;
      align-items: center;
      padding: var(--space-3xl) 0;
      overflow: hidden;
    }

    .hero-background {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      filter: brightness(0.65);
      z-index: 1;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 60% 30%, transparent 0%, var(--bg-primary) 85%),
                  linear-gradient(to bottom, transparent 60%, var(--bg-primary) 100%);
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 920px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 6px 16px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--accent);
      margin-bottom: var(--space-lg);
      backdrop-filter: blur(12px);

      .badge-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 10px var(--accent);
      }
    }

    .hero-title {
      font-size: clamp(2.4rem, 5.5vw, 4.2rem);
      line-height: 1.1;
      font-weight: 900;
      margin-bottom: var(--space-md);
      letter-spacing: -0.03em;
    }

    .hero-description {
      font-size: clamp(1.05rem, 2vw, 1.3rem);
      color: var(--text-secondary);
      line-height: 1.7;
      margin-bottom: var(--space-xl);
      max-width: 720px;

      .highlight {
        color: var(--text-primary);
        font-weight: 700;
      }
    }

    .hero-actions {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;
      margin-bottom: var(--space-2xl);
    }

    .hero-stats {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-full);
      padding: 12px 28px;
      width: fit-content;
      backdrop-filter: blur(16px);

      @media (max-width: 640px) {
        flex-direction: column;
        border-radius: var(--radius-lg);
        width: 100%;
        align-items: flex-start;
      }
    }

    .stat-pill {
      display: flex;
      flex-direction: column;

      .stat-num {
        font-size: 1.2rem;
        font-weight: 800;
        color: var(--text-primary);
      }
      .stat-text {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .stat-divider {
      width: 1px;
      height: 32px;
      background: var(--border);
      @media (max-width: 640px) { display: none; }
    }

    /* Asymmetric Highlights Grid */
    .highlights-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: var(--space-xl);

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .highlight-video-card, .highlight-product-card {
      padding: var(--space-xl);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .card-tag-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .video-meta-tag, .member-chip {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .member-chip {
      color: var(--accent);
      background: var(--accent-softer);
      padding: 2px 8px;
      border-radius: var(--radius-xs);
    }

    .video-media-preview {
      position: relative;
      border-radius: var(--radius-md);
      overflow: hidden;
      aspect-ratio: 16 / 9;
      margin-bottom: var(--space-lg);

      .video-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform var(--transition-slow);
      }

      &:hover .video-img {
        transform: scale(1.03);
      }
    }

    .play-overlay-btn {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.35);
      color: #000;
      transition: background var(--transition-fast);

      svg {
        background: var(--accent);
        padding: 12px;
        border-radius: 50%;
        width: 54px;
        height: 54px;
        box-shadow: var(--shadow-accent);
        transition: transform var(--transition-fast);
      }

      &:hover svg {
        transform: scale(1.1);
      }
    }

    .duration-badge {
      position: absolute;
      bottom: 12px;
      right: 12px;
      background: rgba(0,0,0,0.85);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: var(--radius-xs);
    }

    .highlight-title {
      font-size: 1.4rem;
      margin-bottom: var(--space-xs);
      a { color: var(--text-primary); &:hover { color: var(--accent); } }
    }

    .highlight-desc {
      font-size: 0.92rem;
      color: var(--text-secondary);
      margin-bottom: var(--space-lg);
      line-height: 1.6;
    }

    .highlight-footer {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      flex-wrap: wrap;

      .meta-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .btn { margin-left: auto; }
    }

    /* Product Highlight */
    .product-visual {
      position: relative;
      border-radius: var(--radius-md);
      overflow: hidden;
      aspect-ratio: 4 / 3;
      margin-bottom: var(--space-md);

      .product-cover-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .product-price-tag {
        position: absolute;
        bottom: 12px;
        left: 12px;
        background: var(--surface-solid);
        border: 1px solid var(--border);
        padding: 6px 14px;
        border-radius: var(--radius-full);
        font-weight: 800;
        font-size: 1.1rem;
        color: var(--accent);
      }
    }

    .product-title {
      font-size: 1.25rem;
      margin-bottom: var(--space-xs);
      a { color: var(--text-primary); &:hover { color: var(--accent); } }
    }

    .product-quote {
      font-size: 0.88rem;
      font-style: italic;
      color: var(--text-secondary);
      margin-bottom: var(--space-lg);
    }

    .product-actions-row {
      display: flex;
      gap: var(--space-sm);
      margin-top: auto;
    }

    /* Video Card Grid */
    .video-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .video-thumbnail-wrap {
      position: relative;
      aspect-ratio: 16 / 9;
      overflow: hidden;

      .card-thumb {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform var(--transition-slow);
      }

      &:hover .card-thumb {
        transform: scale(1.05);
      }
    }

    .card-play-btn {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.3);
      opacity: 0;
      transition: opacity var(--transition-fast);

      svg {
        background: var(--accent);
        color: #000;
        padding: 8px;
        border-radius: 50%;
        width: 42px;
        height: 42px;
      }

      &:hover, .video-thumbnail-wrap:hover & {
        opacity: 1;
      }
    }

    .video-duration {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(0,0,0,0.85);
      color: #fff;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .video-card-content {
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .card-category {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 6px;
    }

    .card-title {
      font-size: 1.05rem;
      line-height: 1.35;
      margin-bottom: 8px;
      a { color: var(--text-primary); &:hover { color: var(--accent); } }
    }

    .card-description {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: var(--space-md);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-meta {
      margin-top: auto;
      display: flex;
      gap: 6px;
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    /* Gear Banner */
    .gear-banner {
      padding: var(--space-2xl);
      background: linear-gradient(135deg, var(--surface) 0%, var(--surface-solid) 100%);
      border: 1px solid var(--border-strong);
    }

    .gear-banner-title {
      font-size: clamp(1.6rem, 3vw, 2.4rem);
      margin: var(--space-sm) 0 var(--space-md);
    }

    .gear-banner-desc {
      font-size: 1.05rem;
      color: var(--text-secondary);
      max-width: 680px;
      margin-bottom: var(--space-lg);
    }

    .gear-pills {
      display: flex;
      gap: var(--space-sm);
      flex-wrap: wrap;
      margin-bottom: var(--space-xl);
    }

    .gear-banner-actions {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;
    }

    /* Community & Newsletter */
    .community-box, .newsletter-box {
      padding: var(--space-2xl);
    }

    .community-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);

      .icon-avatar {
        font-size: 2rem;
        background: var(--accent-softer);
        padding: 12px;
        border-radius: var(--radius-md);
      }
    }

    .community-title, .newsletter-title {
      font-size: 1.3rem;
      margin-bottom: 4px;
    }

    .community-sub, .newsletter-desc {
      font-size: 0.88rem;
      color: var(--text-secondary);
    }

    .community-preview-feed {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .chat-preview-item {
      background: var(--surface-solid);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 12px 16px;

      .user-bubble-name {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      p { font-size: 0.88rem; color: var(--text-secondary); margin: 0; }
    }

    .newsletter-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .newsletter-icon-wrap {
      font-size: 2.4rem;
      margin-bottom: var(--space-sm);
    }

    .newsletter-desc {
      margin-bottom: var(--space-lg);
    }

    .newsletter-form-row {
      display: flex;
      gap: var(--space-sm);

      .input { flex: 1; }

      @media (max-width: 480px) {
        flex-direction: column;
      }
    }

    .newsletter-sub-note {
      font-size: 0.8rem;
      color: var(--success);
      margin-top: var(--space-sm);
    }
  `]
})
export class HomeComponent implements OnInit {
  creator = signal<Creator | null>(null);
  settings = signal<CreatorSettings | null>(null);
  latestVideo = signal<Video | null>(null);
  popularVideos = signal<Video[]>([]);
  featuredProduct = signal<Product | null>(null);

  newsletterEmail = '';
  subscribed = signal(false);

  constructor(
    private creatorApi: CreatorApiService,
    private videosApi: VideosApiService,
    private productsApi: ProductsApiService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.setDefault();

    this.creatorApi.getCreator().subscribe(c => this.creator.set(c));
    this.creatorApi.getSettings().subscribe(s => this.settings.set(s));
    
    this.videosApi.getLatest(1).subscribe(vids => {
      if (vids.length > 0) this.latestVideo.set(vids[0]);
    });

    this.videosApi.getPopular(3).subscribe(vids => this.popularVideos.set(vids));

    this.productsApi.getFeatured().subscribe(prods => {
      if (prods.length > 0) this.featuredProduct.set(prods[0]);
    });
  }

  subscribeNewsletter(e: Event): void {
    e.preventDefault();
    if (this.newsletterEmail.trim()) {
      this.subscribed.set(true);
      this.newsletterEmail = '';
    }
  }
}
