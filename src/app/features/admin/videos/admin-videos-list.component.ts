import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideosApiService } from '@data/sheetdb/videos-api.service';
import { Video } from '@models/video.model';

@Component({
  selector: 'app-admin-videos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="admin-videos-page">
      
      <!-- Top Action Bar -->
      <div class="action-bar-row">
        <div>
          <h2>Video Management</h2>
          <p>Create, update, and manage YouTube video showcase links.</p>
        </div>
        <a routerLink="/admin/videos/new" class="btn btn-primary" id="add-new-video-btn">
          + Add New Video
        </a>
      </div>

      <!-- Filter Controls Card -->
      <div class="glass-card table-control-card">
        <div class="search-input-wrap">
          <input 
            type="text" 
            class="input" 
            placeholder="Search by title, tag, or slug..." 
            [(ngModel)]="searchQuery" 
            id="admin-video-search-input"
          />
        </div>

        <div class="table-stats-pill">
          Total: <strong>{{ videos().length }}</strong> videos
        </div>
      </div>

      <!-- Videos Table -->
      <div class="glass-card table-container-card">
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Video Preview</th>
                <th>Title & Slug</th>
                <th>Category</th>
                <th>Views</th>
                <th>Status</th>
                <th>Featured</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let vid of filteredVideos()">
                
                <!-- Thumb Preview -->
                <td>
                  <img [src]="vid.thumbnail" [alt]="vid.title" class="video-table-thumb" />
                </td>

                <!-- Title & Slug -->
                <td>
                  <div class="video-info-cell">
                    <strong class="video-row-title">{{ vid.title }}</strong>
                    <code class="slug-pill">/videos/{{ vid.slug }}</code>
                  </div>
                </td>

                <!-- Category -->
                <td>
                  <span class="badge badge-surface">{{ vid.category }}</span>
                </td>

                <!-- Views -->
                <td>
                  <span>{{ (vid.viewCount || 0) | number }}</span>
                </td>

                <!-- Status -->
                <td>
                  <span class="badge" [class.badge-success]="vid.status === 'PUBLISHED'" [class.badge-surface]="vid.status !== 'PUBLISHED'">
                    {{ vid.status }}
                  </span>
                </td>

                <!-- Featured -->
                <td>
                  <span class="featured-indicator" *ngIf="vid.featured">★ Yes</span>
                  <span class="text-muted" *ngIf="!vid.featured">—</span>
                </td>

                <!-- Actions -->
                <td class="text-right">
                  <div class="table-action-btns">
                    <a [routerLink]="['/videos', vid.slug]" target="_blank" class="btn btn-ghost btn-sm" title="Preview Public Page">
                      👁️
                    </a>
                    <a [routerLink]="['/admin/videos', vid.id, 'edit']" class="btn btn-secondary btn-sm">
                      Edit
                    </a>
                    <button class="btn btn-ghost btn-sm delete-btn" (click)="deleteVideo(vid.slug)" title="Archive Video">
                      🗑️
                    </button>
                  </div>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .admin-videos-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
      min-width: 0;
    }

    .action-bar-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: var(--space-md);

      h2 { font-size: 1.5rem; margin-bottom: 2px; }
      p { color: var(--text-secondary); margin: 0; font-size: 0.85rem; }
    }

    .table-control-card {
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-md);
      flex-wrap: wrap;

      .search-input-wrap {
        flex: 1;
        max-width: 360px;
        min-width: 200px;
      }
    }

    .table-stats-pill {
      font-size: 0.82rem;
      color: var(--text-secondary);
    }

    .table-container-card {
      padding: var(--space-lg);
      min-width: 0;
    }

    .table-responsive {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      min-width: 600px;

      th {
        font-size: 0.72rem;
        text-transform: uppercase;
        color: var(--text-muted);
        letter-spacing: 0.05em;
        padding: 8px 10px;
        border-bottom: 1px solid var(--border);
      }

      td {
        padding: 10px;
        border-bottom: 1px solid var(--border);
        font-size: 0.85rem;
        vertical-align: middle;
      }

      tbody tr:hover {
        background: var(--surface-hover);
      }
    }

    .video-table-thumb {
      width: 60px;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      border-radius: var(--radius-xs);
      flex-shrink: 0;
    }

    .video-info-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
      max-width: 260px;

      .video-row-title {
        color: var(--text-primary);
        font-size: 0.88rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .slug-pill {
        font-size: 0.72rem;
        color: var(--text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .featured-indicator {
      color: var(--accent);
      font-weight: 700;
      font-size: 0.82rem;
    }

    .text-right {
      text-align: right;
    }

    .table-action-btns {
      display: inline-flex;
      gap: 4px;
      justify-content: flex-end;
    }

    .delete-btn {
      color: var(--error);
      &:hover { background: rgba(255, 79, 79, 0.12); }
    }
  `]
})
export class AdminVideosListComponent implements OnInit {
  videos = signal<Video[]>([]);
  searchQuery = '';

  filteredVideos = computed(() => {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.videos();
    return this.videos().filter(v => 
      v.title.toLowerCase().includes(q) || 
      v.slug.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q)
    );
  });

  constructor(private videosApi: VideosApiService) {}

  ngOnInit(): void {
    this.loadVideos();
  }

  loadVideos(): void {
    this.videosApi.getAll().subscribe((vids: any) => this.videos.set(vids));
  }

  deleteVideo(slug: string): void {
    if (confirm('Are you sure you want to archive this video?')) {
      this.videos.set(this.videos().filter(v => v.slug !== slug));
    }
  }
}
