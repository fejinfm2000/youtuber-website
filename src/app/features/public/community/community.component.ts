import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../../core/services/seo.service';

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  role: 'CREATOR' | 'MEMBER';
  content: string;
  likes: number;
  replies: number;
  timestamp: string;
  pinned?: boolean;
}

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- Community Hero -->
    <section class="community-hero">
      <div class="container">
        <div class="community-hero-content">
          <div class="badge badge-accent animate-fade-in">
            <span class="badge-dot-live"></span>
            COMMUNITY HUB
          </div>
          <h1 class="animate-fade-in-up">
            Join the <span class="gradient-text">Creator Community</span>
          </h1>
          <p class="hero-desc animate-fade-in-up">
            Connect with fellow builders, get early access to content, unlock member discounts, and chat directly with the creator.
          </p>
          <div class="hero-cta animate-fade-in-up">
            <a routerLink="/register" class="btn btn-primary btn-lg" id="community-join-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              Join Free (Create Account)
            </a>
            <a routerLink="/login" class="btn btn-secondary btn-lg" id="community-login-btn">Sign In</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Member Perks -->
    <section class="section perks-section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Member Perks</h2>
            <p class="section-subtitle">What you unlock when you join the community</p>
          </div>
        </div>

        <div class="perks-grid">
          @for (perk of perks; track perk.icon) {
            <div class="glass-card perk-card">
              <div class="perk-icon">{{ perk.icon }}</div>
              <h3>{{ perk.title }}</h3>
              <p>{{ perk.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Community Feed Preview -->
    <section class="section feed-section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Community Feed</h2>
            <p class="section-subtitle">Recent posts from the creator and members</p>
          </div>
        </div>

        <div class="feed-layout">
          <!-- Posts -->
          <div class="posts-col">
            @for (post of posts(); track post.id) {
              <div class="glass-card post-card" [class.pinned]="post.pinned">
                @if (post.pinned) {
                  <div class="pinned-tag">📌 Pinned</div>
                }
                <div class="post-header">
                  <div class="post-avatar" [class.creator]="post.role === 'CREATOR'">
                    {{ post.avatar }}
                  </div>
                  <div class="post-meta">
                    <strong>{{ post.author }}</strong>
                    @if (post.role === 'CREATOR') {
                      <span class="creator-badge">Creator</span>
                    }
                    <span class="post-time">{{ post.timestamp }}</span>
                  </div>
                </div>
                <p class="post-content">{{ post.content }}</p>
                <div class="post-actions">
                  <button class="post-action-btn" id="like-post-{{ post.id }}">
                    ♥ {{ post.likes }}
                  </button>
                  <button class="post-action-btn" id="reply-post-{{ post.id }}">
                    💬 {{ post.replies }} replies
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Sidebar -->
          <div class="sidebar-col">
            <!-- Stats Card -->
            <div class="glass-card sidebar-card">
              <h3>Community Stats</h3>
              <div class="stat-row">
                <span class="stat-label">Members</span>
                <span class="stat-val">2,847</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Posts this week</span>
                <span class="stat-val">124</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Active now</span>
                <span class="stat-val online">🟢 38</span>
              </div>
            </div>

            <!-- Join CTA -->
            <div class="glass-card join-cta-card">
              <div class="join-icon">🚀</div>
              <h3>Ready to join?</h3>
              <p>Create a free account to post, chat live with the creator, and get exclusive member discounts on gear recommendations.</p>
              <a routerLink="/register" class="btn btn-primary" id="sidebar-join-btn" style="width: 100%; margin-top: 8px;">
                Create Free Account
              </a>
            </div>

            <!-- Rules Card -->
            <div class="glass-card sidebar-card rules-card">
              <h3>Community Rules</h3>
              <ol class="rules-list">
                @for (rule of rules; track rule) {
                  <li>{{ rule }}</li>
                }
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .community-hero {
      padding: var(--space-3xl) 0 var(--space-2xl);
      background: radial-gradient(ellipse at 50% 0%, rgba(245,164,0,0.08) 0%, transparent 70%);
      border-bottom: 1px solid var(--border);
      text-align: center;
    }

    .community-hero-content {
      max-width: 700px;
      margin: 0 auto;

      .badge-dot-live {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: var(--success);
        border-radius: 50%;
        animation: pulse 2s infinite;
        margin-right: 4px;
      }

      h1 { margin: var(--space-md) 0; }
      .hero-desc { font-size: 1.05rem; color: var(--text-secondary); margin-bottom: var(--space-xl); }
    }

    .hero-cta {
      display: flex;
      gap: var(--space-md);
      justify-content: center;
      flex-wrap: wrap;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.4); }
    }

    /* Perks */
    .perks-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-lg);

      @media (max-width: 768px) { grid-template-columns: 1fr; }
      @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
    }

    .perk-card {
      padding: var(--space-xl);
      text-align: center;

      .perk-icon {
        font-size: 2.5rem;
        margin-bottom: var(--space-md);
      }
      h3 { font-size: 1.1rem; margin-bottom: 8px; }
      p { font-size: 0.88rem; color: var(--text-secondary); margin: 0; }
    }

    /* Feed Layout */
    .feed-section { background: var(--bg-secondary); }

    .feed-layout {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: var(--space-xl);
      align-items: start;

      @media (max-width: 1024px) { grid-template-columns: 1fr; }
    }

    .posts-col {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .post-card {
      padding: var(--space-xl);

      &.pinned {
        border-color: var(--accent);
        background: var(--accent-softer);
      }
    }

    .pinned-tag {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: var(--space-md);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .post-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-md);
    }

    .post-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--surface-solid);
      border: 2px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      flex-shrink: 0;

      &.creator {
        border-color: var(--accent);
        background: var(--accent-soft);
      }
    }

    .post-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;

      strong { font-size: 0.95rem; color: var(--text-primary); }
      .post-time { font-size: 0.75rem; color: var(--text-muted); }
    }

    .creator-badge {
      display: inline-block;
      background: var(--accent-soft);
      color: var(--accent);
      font-size: 0.65rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      width: fit-content;
    }

    .post-content {
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--text-primary);
      margin-bottom: var(--space-md);
    }

    .post-actions {
      display: flex;
      gap: var(--space-md);
    }

    .post-action-btn {
      background: transparent;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 6px 14px;
      font-size: 0.82rem;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--accent);
        color: var(--accent);
        background: var(--accent-softer);
      }
    }

    /* Sidebar */
    .sidebar-col {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .sidebar-card {
      padding: var(--space-lg);

      h3 { font-size: 1rem; font-weight: 700; margin-bottom: var(--space-md); }
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
      font-size: 0.88rem;

      &:last-child { border-bottom: none; }

      .stat-label { color: var(--text-secondary); }
      .stat-val { font-weight: 700; color: var(--text-primary); }
      .stat-val.online { color: var(--success); }
    }

    .join-cta-card {
      padding: var(--space-xl);
      text-align: center;
      background: var(--accent-softer);
      border-color: var(--accent);

      .join-icon { font-size: 2rem; margin-bottom: var(--space-md); }
      h3 { margin-bottom: 8px; }
      p { font-size: 0.85rem; color: var(--text-secondary); }
    }

    .rules-card {
      .rules-list {
        list-style: none;
        padding: 0;
        margin: 0;
        counter-reset: rules;

        li {
          counter-increment: rules;
          display: flex;
          gap: 10px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          padding: 6px 0;
          border-bottom: 1px solid var(--border);

          &:last-child { border-bottom: none; }

          &::before {
            content: counter(rules);
            background: var(--accent-soft);
            color: var(--accent);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: 800;
            flex-shrink: 0;
            margin-top: 1px;
          }
        }
      }
    }
  `]
})
export class CommunityComponent implements OnInit {
  posts = signal<CommunityPost[]>([
    {
      id: '1',
      author: 'Pirai Adhi',
      avatar: '🍲',
      role: 'CREATOR',
      content: '🔥 Just published our Dindigul Thalappakatti Mutton Biriyani video! We revealed the exact proportion of whole spices and how to get that perfect wood-fire dum flavor at home. Go watch it and drop your secret biriyani tips in the comments!',
      likes: 124,
      replies: 38,
      timestamp: '2 hours ago',
      pinned: true,
    },
    {
      id: '2',
      author: 'Karthik Raja',
      avatar: '🍛',
      role: 'MEMBER',
      content: 'Tried the pre-seasoned cast iron kadai recommendation from your gear list — made village mutton chukka yesterday and the flavor was out of this world! Thanks for the genuine suggestion, Adhi bro!',
      likes: 56,
      replies: 9,
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      author: 'Aravind S',
      avatar: '🧭',
      role: 'MEMBER',
      content: 'Planning a solo food tour across Chettinad & Madurai next month. Which hidden messes would you recommend for authentic nattu kozhi and bun parotta?',
      likes: 31,
      replies: 16,
      timestamp: '1 day ago',
    },
    {
      id: '4',
      author: 'Pirai Adhi',
      avatar: '🍲',
      role: 'CREATOR',
      content: '📊 Community Poll: Where should our next multi-day street food trail be? Reply with: 1) Coastal Seafood Trail (Rameshwaram / Tuticorin) 2) Street Food Night Crawl in Bangalore 3) Kerala Malabar Biriyani & Tea Trail',
      likes: 218,
      replies: 94,
      timestamp: '2 days ago',
    },
  ]);

  perks = [
    {
      icon: '💬',
      title: 'Explorer Community Chat',
      desc: 'Chat in real-time with Pirai Adhi and food lovers during live premieres, travel updates, and Q&As.',
    },
    {
      icon: '🏷️',
      title: 'Member Discounts',
      desc: 'Unlock exclusive creator discounts on recommended vlogging gear, cast iron cookware, and travel accessories.',
    },
    {
      icon: '🚀',
      title: 'Early Video Access',
      desc: 'Get first look at new street food episodes, secret food spot maps, and travel itineraries before they go public.',
    },
    {
      icon: '📬',
      title: 'Explorer Gazette',
      desc: 'Weekly newsletter with curated local food spots, authentic family recipes, and travel tips.',
    },
    {
      icon: '📍',
      title: 'Secret Food Maps',
      desc: 'Access verified GPS coordinates and timing guides for the best hidden street food stalls.',
    },
    {
      icon: '🗳️',
      title: 'Vote on Next Destination',
      desc: 'Directly influence where Pirai Adhi travels and what regional dishes we explore next.',
    },
  ];

  rules = [
    'Be respectful, welcoming, and constructive',
    'No spam or unauthorized business promotions',
    'Stay on-topic: food exploration, street food, travel, recipes & vlogging gear',
    'Share genuine, honest reviews and local recommendations',
    'Support local vendors, street artisans, and heritage eateries',
  ];

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Explorer Community — Pirai Adhi',
      description: 'Join the Pirai Adhi Explorer Community. Share food discoveries, unlock member discounts, and chat with fellow food & travel lovers.',
    });
  }
}
