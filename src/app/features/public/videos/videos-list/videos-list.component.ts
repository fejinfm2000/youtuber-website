import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideosApiService } from '../../../../core/data/sheetdb/videos-api.service';
import { SeoService } from '../../../../core/services/seo.service';
import { Video, VideoCategory } from '../../../../core/models/video.model';

@Component({
  selector: 'app-videos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="videos-page">
      <!-- Header Banner -->
      <section class="page-header-section">
        <div class="container">
          <span class="badge badge-accent">EXPLORER VAULT</span>
          <h1 class="page-title">Videos & Food Trails</h1>
          <p class="page-subtitle">
            Explore authentic street food discoveries, secret regional recipes, and travel vlogs across India with Pirai Adhi.
          </p>

          <!-- Search & Filter Controls -->
          <div class="filter-controls-card glass-card">
            <div class="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input 
                type="text" 
                class="filter-search-input" 
                placeholder="Search food trails, recipes, places, or vlog gear..." 
                [(ngModel)]="searchQuery"
                id="videos-search-input"
              />
              <button class="clear-btn" *ngIf="searchQuery" (click)="searchQuery = ''">✕</button>
            </div>

            <!-- Category Pills -->
            <div class="category-pills">
              <button 
                class="chip" 
                [class.active]="selectedCategory() === 'ALL'"
                (click)="setCategory('ALL')"
                id="cat-all-btn">
                All Categories ({{ videos().length }})
              </button>
              <button 
                *ngFor="let cat of categories()"
                class="chip" 
                [class.active]="selectedCategory() === cat.name"
                (click)="setCategory(cat.name)"
                [id]="'cat-' + cat.slug + '-btn'">
                {{ cat.name }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Video Grid -->
      <section class="section">
        <div class="container">
          
          <!-- Results Count -->
          <div class="results-header" *ngIf="filteredVideos().length > 0">
            <span class="results-count">Showing {{ filteredVideos().length }} video{{ filteredVideos().length === 1 ? '' : 's' }}</span>
          </div>

          <!-- Video Cards Grid -->
          <div class="grid-3" *ngIf="filteredVideos().length > 0">
            <div class="glass-card video-card" *ngFor="let video of filteredVideos()">
              <div class="video-thumb-wrap">
                <img [src]="video.thumbnail" [alt]="video.title" class="video-img" />
                <a [routerLink]="['/videos', video.slug]" class="play-btn" aria-label="Watch video">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </a>
                <span class="duration" *ngIf="video.duration">{{ video.duration }}</span>
              </div>
              <div class="video-card-body">
                <div class="cat-badge">{{ video.category }}</div>
                <h3 class="video-title">
                  <a [routerLink]="['/videos', video.slug]">{{ video.title }}</a>
                </h3>
                <p class="video-desc">{{ video.shortDescription || video.description }}</p>
                <div class="video-footer">
                  <span>{{ video.publishedAt | date:'mediumDate' }}</span>
                  <span *ngIf="video.viewCount">• {{ video.viewCount | number }} views</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state glass-card" *ngIf="filteredVideos().length === 0">
            <div class="empty-icon">🔍</div>
            <h3>No Videos Found</h3>
            <p>No results matching "{{ searchQuery }}" in {{ selectedCategory() }}.</p>
            <button class="btn btn-secondary btn-sm" (click)="resetFilters()">Reset All Filters</button>
          </div>

        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-header-section {
      padding: var(--space-3xl) 0 var(--space-md);
      background: radial-gradient(circle at 50% 0%, var(--surface-solid) 0%, transparent 70%);
    }

    .page-title {
      font-size: clamp(2rem, 4vw, 3.2rem);
      font-weight: 900;
      margin: var(--space-sm) 0 var(--space-sm);
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
      max-width: 650px;
      margin-bottom: var(--space-xl);
    }

    .filter-controls-card {
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      background: var(--surface-solid);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 0 var(--space-md);

      svg { color: var(--text-muted); }
    }

    .filter-search-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 14px 0;
      font-size: 0.95rem;
      color: var(--text-primary);
      outline: none;
      &::placeholder { color: var(--text-muted); }
    }

    .clear-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 1rem;
      &:hover { color: var(--text-primary); }
    }

    .category-pills {
      display: flex;
      gap: var(--space-sm);
      flex-wrap: wrap;
    }

    .results-header {
      margin-bottom: var(--space-lg);
      .results-count {
        font-size: 0.85rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .video-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .video-thumb-wrap {
      position: relative;
      aspect-ratio: 16 / 9;
      overflow: hidden;

      .video-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform var(--transition-slow);
      }

      &:hover .video-img {
        transform: scale(1.05);
      }
    }

    .play-btn {
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

      &:hover, .video-thumb-wrap:hover & {
        opacity: 1;
      }
    }

    .duration {
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

    .video-card-body {
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .cat-badge {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }

    .video-title {
      font-size: 1.05rem;
      line-height: 1.35;
      margin-bottom: 8px;
      a { color: var(--text-primary); &:hover { color: var(--accent); } }
    }

    .video-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: var(--space-md);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .video-footer {
      margin-top: auto;
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    .empty-state {
      padding: var(--space-3xl);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-md);

      .empty-icon { font-size: 2.8rem; }
      h3 { font-size: 1.4rem; }
      p { color: var(--text-secondary); max-width: 400px; }
    }
  `]
})
export class VideosListComponent implements OnInit {
  videos = signal<Video[]>([]);
  categories = signal<VideoCategory[]>([]);
  selectedCategory = signal<string>('ALL');
  searchQuery = '';

  filteredVideos = computed(() => {
    let list = this.videos();
    const cat = this.selectedCategory();
    const query = this.searchQuery.trim().toLowerCase();

    if (cat !== 'ALL') {
      list = list.filter(v => v.category === cat);
    }

    if (query) {
      list = list.filter(v => 
        v.title.toLowerCase().includes(query) || 
        v.description.toLowerCase().includes(query) ||
        (v.tags && v.tags.some(t => t.toLowerCase().includes(query)))
      );
    }

    return list;
  });

  constructor(private videosApi: VideosApiService, private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Videos & Food Exploration Vlogs — Pirai Adhi',
      description: 'Watch street food trails, village recipes, biriyani masterclasses, and travel vlogs with Pirai Adhi - The Explorer.',
    });

    this.videosApi.getAll().subscribe(vids => this.videos.set(vids));
    this.videosApi.getCategories().subscribe(cats => this.categories.set(cats));
  }

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  resetFilters(): void {
    this.selectedCategory.set('ALL');
    this.searchQuery = '';
  }
}
