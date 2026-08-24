import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideosApiService } from '@data/sheetdb/videos-api.service';
import { Video, VideoCategory } from '@models/video.model';

@Component({
  selector: 'app-admin-video-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="admin-form-page">
      
      <div class="form-header-row">
        <div>
          <a routerLink="/admin/videos" class="back-link">← Back to Videos List</a>
          <h2 class="form-title">{{ isEdit() ? 'Edit Video' : 'Add New Video' }}</h2>
          <p class="form-subtitle">Paste a YouTube link to automatically extract video ID and thumbnail.</p>
        </div>
      </div>

      <div class="form-layout-grid">
        
        <!-- Left: Main Form Fields -->
        <div class="glass-card main-form-card">
          <form (submit)="saveVideo($event)" class="crud-form">
            
            <!-- YouTube URL Input (Special validation) -->
            <div class="form-group">
              <label for="video-url">
                <strong>YouTube URL or Video ID *</strong>
                <span class="helper-text">(e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or youtu.be/...)</span>
              </label>
              <input 
                type="text" 
                id="video-url" 
                class="input" 
                [(ngModel)]="formData.youtubeUrl" 
                (ngModelChange)="onUrlChange($event)"
                name="youtubeUrl" 
                placeholder="https://www.youtube.com/watch?v=..." 
                required 
              />
              <span class="extracted-pill" *ngIf="formData.youtubeVideoId">
                ✓ Extracted ID: <code>{{ formData.youtubeVideoId }}</code>
              </span>
            </div>

            <!-- Title & Slug -->
            <div class="grid-2">
              <div class="form-group">
                <label for="video-title">Video Title *</label>
                <input 
                  type="text" 
                  id="video-title" 
                  class="input" 
                  [(ngModel)]="formData.title" 
                  (ngModelChange)="onTitleChange($event)"
                  name="title" 
                  placeholder="How I Built an AI SaaS" 
                  required 
                />
              </div>

              <div class="form-group">
                <label for="video-slug">URL Slug *</label>
                <input 
                  type="text" 
                  id="video-slug" 
                  class="input" 
                  [(ngModel)]="formData.slug" 
                  name="slug" 
                  placeholder="how-i-built-an-ai-saas" 
                  required 
                />
              </div>
            </div>

            <!-- Category & Duration -->
            <div class="grid-2">
              <div class="form-group">
                <label for="video-category">Category *</label>
                <select id="video-category" class="input" [(ngModel)]="formData.category" name="category">
                  <option *ngFor="let cat of categories()" [value]="cat.name">{{ cat.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="video-duration">Duration</label>
                <input 
                  type="text" 
                  id="video-duration" 
                  class="input" 
                  [(ngModel)]="formData.duration" 
                  name="duration" 
                  placeholder="e.g. 24:15" 
                />
              </div>
            </div>

            <!-- Short Description -->
            <div class="form-group">
              <label for="video-short-desc">Short Summary (for preview cards)</label>
              <input 
                type="text" 
                id="video-short-desc" 
                class="input" 
                [(ngModel)]="formData.shortDescription" 
                name="shortDescription" 
                placeholder="One sentence overview..." 
              />
            </div>

            <!-- Full Description -->
            <div class="form-group">
              <label for="video-desc">Detailed Description *</label>
              <textarea 
                id="video-desc" 
                class="input desc-area" 
                [(ngModel)]="formData.description" 
                name="description" 
                placeholder="Include timestamps, key takeaways, and tool summaries..." 
                required
              ></textarea>
            </div>

            <!-- Status & Featured -->
            <div class="grid-2">
              <div class="form-group">
                <label for="video-status">Publication Status</label>
                <select id="video-status" class="input" [(ngModel)]="formData.status" name="status">
                  <option value="PUBLISHED">Published (Live on Website)</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="formData.featured" name="featured" />
                  <span>Feature on Homepage Hero Section</span>
                </label>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="form-action-row">
              <button type="submit" class="btn btn-primary btn-lg" id="save-video-submit-btn">
                {{ isEdit() ? 'Update Video' : 'Publish Video Link' }}
              </button>
              <a routerLink="/admin/videos" class="btn btn-ghost">Cancel</a>
            </div>

          </form>
        </div>

        <!-- Right: Live Thumbnail Preview Sidebar -->
        <div class="glass-card preview-sidebar-card">
          <h3>Thumbnail Preview</h3>
          <p class="preview-sub">Automatically synced from YouTube CDN.</p>
          
          <div class="preview-frame">
            <img 
              [src]="formData.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600'" 
              alt="Thumbnail preview" 
              class="preview-img" 
            />
            <span class="preview-duration" *ngIf="formData.duration">{{ formData.duration }}</span>
          </div>

          <div class="preview-meta-block">
            <strong>{{ formData.title || 'Untitled Video' }}</strong>
            <span class="cat">{{ formData.category }}</span>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .admin-form-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .form-header-row {
      .back-link {
        font-size: 0.85rem;
        color: var(--accent);
        display: inline-block;
        margin-bottom: var(--space-xs);
      }
      .form-title { font-size: 1.8rem; font-weight: 800; margin-bottom: 2px; }
      .form-subtitle { font-size: 0.88rem; color: var(--text-secondary); margin: 0; }
    }

    .form-layout-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: var(--space-xl);

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .main-form-card, .preview-sidebar-card {
      padding: var(--space-2xl);
    }

    .crud-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .helper-text {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: normal;
      margin-left: 6px;
    }

    .extracted-pill {
      font-size: 0.78rem;
      color: var(--success);
      margin-top: 4px;
      code { color: var(--accent); font-weight: 700; }
    }

    .desc-area {
      min-height: 150px;
    }

    .checkbox-group {
      justify-content: center;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      color: var(--text-primary);
    }

    .form-action-row {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      border-top: 1px solid var(--border);
      padding-top: var(--space-lg);
    }

    .preview-sidebar-card {
      height: fit-content;
      h3 { font-size: 1.15rem; margin-bottom: 2px; }
      .preview-sub { font-size: 0.82rem; color: var(--text-muted); margin-bottom: var(--space-lg); }
    }

    .preview-frame {
      position: relative;
      aspect-ratio: 16 / 9;
      border-radius: var(--radius-sm);
      overflow: hidden;
      margin-bottom: var(--space-md);
      border: 1px solid var(--border);

      .preview-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .preview-duration {
        position: absolute;
        bottom: 8px;
        right: 8px;
        background: rgba(0,0,0,0.85);
        color: #fff;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
      }
    }

    .preview-meta-block {
      display: flex;
      flex-direction: column;
      gap: 2px;

      strong { font-size: 0.95rem; color: var(--text-primary); }
      .cat { font-size: 0.75rem; color: var(--accent); text-transform: uppercase; font-weight: 700; }
    }
  `]
})
export class AdminVideoFormComponent implements OnInit {
  isEdit = signal(false);
  categories = signal<VideoCategory[]>([]);

  formData: Video = {
    id: '',
    youtubeUrl: '',
    youtubeVideoId: '',
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    thumbnail: '',
    category: 'AI & Machine Learning',
    publishedAt: new Date().toISOString().split('T')[0],
    duration: '',
    viewCount: 0,
    featured: false,
    status: 'PUBLISHED',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videosApi: VideosApiService
  ) {}

  ngOnInit(): void {
    this.videosApi.getCategories().subscribe((cats: any) => this.categories.set(cats));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.videosApi.getAll().subscribe((vids: any) => {
        const found = vids.find((v: any) => v.id === id);
        if (found) {
          this.formData = { ...found };
        }
      });
    }
  }

  onUrlChange(url: string): void {
    const videoId = this.extractYouTubeId(url);
    if (videoId) {
      this.formData.youtubeVideoId = videoId;
      this.formData.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }

  onTitleChange(title: string): void {
    if (!this.isEdit() && title) {
      this.formData.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
  }

  saveVideo(e: Event): void {
    e.preventDefault();
    if (!this.formData.youtubeVideoId) {
      this.formData.youtubeVideoId = this.extractYouTubeId(this.formData.youtubeUrl) || 'dQw4w9WgXcQ';
    }
    if (!this.formData.thumbnail) {
      this.formData.thumbnail = `https://img.youtube.com/vi/${this.formData.youtubeVideoId}/maxresdefault.jpg`;
    }

    this.router.navigate(['/admin/videos']);
  }

  private extractYouTubeId(url: string): string | null {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
  }
}
