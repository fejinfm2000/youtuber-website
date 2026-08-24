import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CreatorApiService } from '../../../core/data/sheetdb/creator-api.service';
import { SeoService } from '../../../core/services/seo.service';
import { Creator, SocialLink } from '../../../core/models/creator.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="about-page" *ngIf="creator() as c">
      
      <!-- About Hero -->
      <section class="about-hero-section">
        <div class="container about-hero-grid">
          
          <div class="about-bio-col">
            <span class="badge badge-accent">THE CREATOR STORY</span>
            <h1 class="about-title">Hi, I'm {{ c.name }}</h1>
            <p class="about-lead">
              {{ c.bio }}
            </p>

            <div class="about-metrics-row">
              <div class="stat-box glass-card">
                <span class="stat-number">{{ c.subscriberCount }}</span>
                <span class="stat-label">Subscribers</span>
              </div>
              <div class="stat-box glass-card">
                <span class="stat-number">{{ c.videoCount }}</span>
                <span class="stat-label">Videos Published</span>
              </div>
              <div class="stat-box glass-card">
                <span class="stat-number">4+ Yrs</span>
                <span class="stat-label">Exploring & Vlogging</span>
              </div>
            </div>

            <div class="about-cta-row">
              <a [href]="c.youtubeUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                Subscribe on YouTube ↗
              </a>
              <a routerLink="/contact" class="btn btn-secondary">
                Collaborate / Brand Enquiries
              </a>
            </div>
          </div>

          <div class="about-photo-col">
            <div class="photo-frame-card glass-card">
              <img [src]="c.profileImage" [alt]="c.name" class="creator-profile-photo" />
              <div class="photo-caption">
                <strong>{{ c.displayName }}</strong>
                <span>{{ c.location }}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Mission & Content Pillars -->
      <section class="section pillars-section">
        <div class="container">
          <div class="section-header">
            <div>
              <h2 class="section-title">What I Explore & Share</h2>
              <p class="section-subtitle">Authentic tastes, local street food culture, traditional recipes, and travel diaries.</p>
            </div>
          </div>

          <div class="grid-3">
            
            <div class="glass-card pillar-card">
              <div class="pillar-icon">🍲</div>
              <h3 class="pillar-title">Street Food & Local Tastes</h3>
              <p class="pillar-desc">
                From 24-hour midnight night bazaars to hidden street stalls, hunting down authentic culinary delicacies and local food legends.
              </p>
            </div>

            <div class="glass-card pillar-card">
              <div class="pillar-icon">🗺️</div>
              <h3 class="pillar-title">Travel & Cultural Trails</h3>
              <p class="pillar-desc">
                Venturing into ancient temple towns, waterfall treks, heritage villages, and capturing the vibrant pulse of local traditions.
              </p>
            </div>

            <div class="glass-card pillar-card">
              <div class="pillar-icon">🎥</div>
              <h3 class="pillar-title">Vlogging Gear & Outdoor Cooking</h3>
              <p class="pillar-desc">
                Hands-on reviews of solo creator gear, microphones, portable cameras, and traditional wood-fire cooking masterclasses.
              </p>
            </div>

          </div>
        </div>
      </section>

      <!-- Social Channels -->
      <section class="section socials-section">
        <div class="container">
          <div class="glass-card socials-box">
            <h2>Find Me Across the Web</h2>
            <p>I share quick tips, open-source repos, and behind-the-scenes updates.</p>

            <div class="social-cards-grid">
              <a *ngFor="let link of socialLinks()" [href]="link.url" target="_blank" rel="noopener noreferrer" class="social-platform-card glass-card">
                <span class="platform-name">{{ link.label }}</span>
                <span class="platform-arrow">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .about-hero-section {
      padding: var(--space-3xl) 0 var(--space-xl);
      background: radial-gradient(circle at 70% 30%, var(--surface-solid) 0%, transparent 65%);
    }

    .about-hero-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: var(--space-2xl);
      align-items: center;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .about-title {
      font-size: clamp(2.2rem, 4.5vw, 3.6rem);
      font-weight: 900;
      margin: var(--space-sm) 0 var(--space-md);
    }

    .about-lead {
      font-size: 1.15rem;
      color: var(--text-secondary);
      line-height: 1.7;
      margin-bottom: var(--space-xl);
    }

    .about-metrics-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-md);
      margin-bottom: var(--space-xl);

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .stat-box {
      padding: var(--space-lg);
      text-align: center;

      .stat-number {
        font-size: 1.8rem;
        font-weight: 900;
        color: var(--accent);
        display: block;
        margin-bottom: 2px;
      }
      .stat-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--text-muted);
        letter-spacing: 0.05em;
      }
    }

    .about-cta-row {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;
    }

    .photo-frame-card {
      padding: var(--space-md);
      overflow: hidden;

      .creator-profile-photo {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: var(--radius-md);
        margin-bottom: var(--space-md);
      }

      .photo-caption {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 var(--space-xs);

        strong { font-size: 1rem; color: var(--text-primary); }
        span { font-size: 0.8rem; color: var(--text-muted); }
      }
    }

    .pillar-card {
      padding: var(--space-2xl);

      .pillar-icon {
        font-size: 2.2rem;
        margin-bottom: var(--space-md);
      }

      .pillar-title {
        font-size: 1.25rem;
        margin-bottom: var(--space-sm);
      }

      .pillar-desc {
        font-size: 0.92rem;
        color: var(--text-secondary);
        line-height: 1.6;
      }
    }

    .socials-box {
      padding: var(--space-2xl);
      text-align: center;

      h2 { font-size: 1.8rem; margin-bottom: var(--space-xs); }
      p { color: var(--text-secondary); margin-bottom: var(--space-xl); }
    }

    .social-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--space-md);
    }

    .social-platform-card {
      padding: var(--space-lg);
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-decoration: none;
      transition: all var(--transition-fast);

      .platform-name { font-weight: 700; color: var(--text-primary); }
      .platform-arrow { color: var(--accent); font-weight: 700; }

      &:hover {
        border-color: var(--accent);
        transform: translateY(-2px);
      }
    }
  `]
})
export class AboutComponent implements OnInit {
  creator = signal<Creator | null>(null);
  socialLinks = signal<SocialLink[]>([]);

  constructor(private creatorApi: CreatorApiService, private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setPage({
      title: 'About Pirai Adhi & The Explorer Story',
      description: 'Learn more about Pirai Adhi - The Explorer, culinary expeditions, travel chronicles, and creator gear.',
    });

    this.creatorApi.getCreator().subscribe(c => this.creator.set(c));
    this.creatorApi.getSocialLinks().subscribe(links => this.socialLinks.set(links));
  }
}
