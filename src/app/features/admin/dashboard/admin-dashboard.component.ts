import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideosApiService } from '@data/sheetdb/videos-api.service';
import { ProductsApiService } from '@data/sheetdb/products-api.service';
import { Video } from '@models/video.model';
import { Product } from '@models/product.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-page">
      
      <!-- Welcome & Quick Action Header -->
      <div class="dashboard-header-row">
        <div>
          <h1 class="dash-title">Creator Hub Overview</h1>
          <p class="dash-sub">Live channel performance, affiliate monetization, and community activity.</p>
        </div>
        <div class="quick-actions-row">
          <a routerLink="/admin/videos/new" class="btn btn-primary btn-sm" id="dash-add-video-btn">
            + New Video
          </a>
          <a routerLink="/admin/products/new" class="btn btn-secondary btn-sm" id="dash-add-product-btn">
            + New Product
          </a>
        </div>
      </div>

      <!-- KPI Stats Grid -->
      <div class="kpi-grid">
        
        <div class="glass-card kpi-card">
          <div class="kpi-icon-wrap">🌐</div>
          <div class="kpi-details">
            <span class="stat-label">Website Visitors</span>
            <span class="stat-value">125,430</span>
            <span class="stat-trend positive">+14.2% this month</span>
          </div>
        </div>

        <div class="glass-card kpi-card">
          <div class="kpi-icon-wrap">🎬</div>
          <div class="kpi-details">
            <span class="stat-label">Video Hub Views</span>
            <span class="stat-value">1.8M</span>
            <span class="stat-trend positive">+28.5% this month</span>
          </div>
        </div>

        <div class="glass-card kpi-card">
          <div class="kpi-icon-wrap">🛒</div>
          <div class="kpi-details">
            <span class="stat-label">Product Views</span>
            <span class="stat-value">24,530</span>
            <span class="stat-trend positive">+9.8% this month</span>
          </div>
        </div>

        <div class="glass-card kpi-card">
          <div class="kpi-icon-wrap">🔗</div>
          <div class="kpi-details">
            <span class="stat-label">Affiliate Clicks</span>
            <span class="stat-value">12,340</span>
            <span class="stat-trend positive">+18.1% this month</span>
          </div>
        </div>

        <div class="glass-card kpi-card">
          <div class="kpi-icon-wrap">💬</div>
          <div class="kpi-details">
            <span class="stat-label">Community Chat</span>
            <span class="stat-value">8,420</span>
            <span class="stat-trend neutral">Active community</span>
          </div>
        </div>

        <div class="glass-card kpi-card">
          <div class="kpi-icon-wrap">📬</div>
          <div class="kpi-details">
            <span class="stat-label">Business Enquiries</span>
            <span class="stat-value">42</span>
            <span class="stat-trend positive">3 new today</span>
          </div>
        </div>

      </div>

      <!-- Main Tables Grid -->
      <div class="dashboard-tables-grid">
        
        <!-- Top Videos Card -->
        <div class="glass-card table-card">
          <div class="card-header-bar">
            <h3>Top Performing Videos</h3>
            <a routerLink="/admin/videos" class="card-action-link">Manage all →</a>
          </div>
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Video</th>
                  <th>Category</th>
                  <th>Views</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let vid of topVideos()">
                  <td>
                    <div class="table-item-cell">
                      <img [src]="vid.thumbnail" [alt]="vid.title" class="thumb-mini" />
                      <span class="table-item-title">{{ vid.title }}</span>
                    </div>
                  </td>
                  <td><span class="badge badge-surface">{{ vid.category }}</span></td>
                  <td><strong>{{ vid.viewCount | number }}</strong></td>
                  <td>
                    <a [routerLink]="['/admin/videos', vid.id, 'edit']" class="btn btn-ghost btn-sm">Edit</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Products & Deals Card -->
        <div class="glass-card table-card">
          <div class="card-header-bar">
            <h3>Top Recommended Products</h3>
            <a routerLink="/admin/products" class="card-action-link">Manage all →</a>
          </div>
          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let prod of topProducts()">
                  <td>
                    <div class="table-item-cell">
                      <img [src]="prod.image" [alt]="prod.name" class="thumb-mini" />
                      <span class="table-item-title">{{ prod.name }}</span>
                    </div>
                  </td>
                  <td><span class="badge badge-accent">{{ prod.type }}</span></td>
                  <td><span class="prod-price">₹{{ prod.price | number }}</span></td>
                  <td>
                    <a [routerLink]="['/admin/products', prod.id, 'edit']" class="btn btn-ghost btn-sm">Edit</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-2xl);
    }

    .dashboard-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: var(--space-md);

      .dash-title { font-size: 1.8rem; font-weight: 800; }
      .dash-sub { color: var(--text-secondary); font-size: 0.9rem; margin: 0; }
    }

    .quick-actions-row {
      display: flex;
      gap: var(--space-sm);
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-lg);
    }

    .kpi-card {
      padding: var(--space-lg);
      display: flex;
      gap: var(--space-md);
      align-items: flex-start;

      .kpi-icon-wrap {
        font-size: 1.6rem;
        background: var(--surface-hover);
        padding: 10px;
        border-radius: var(--radius-sm);
      }

      .kpi-details {
        display: flex;
        flex-direction: column;
      }

      .stat-trend {
        font-size: 0.72rem;
        margin-top: 4px;
        &.positive { color: var(--success); }
        &.neutral { color: var(--text-muted); }
      }
    }

    .dashboard-tables-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-xl);

      @media (max-width: 1200px) {
        grid-template-columns: 1fr;
      }
    }

    .table-card {
      padding: var(--space-xl);

      .card-header-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-lg);

        h3 { font-size: 1.15rem; }
        .card-action-link { font-size: 0.85rem; color: var(--accent); }
      }
    }

    .table-responsive {
      overflow-x: auto;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;

      th {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--text-muted);
        letter-spacing: 0.06em;
        padding: 10px 12px;
        border-bottom: 1px solid var(--border);
      }

      td {
        padding: 12px;
        border-bottom: 1px solid var(--border);
        font-size: 0.88rem;
        vertical-align: middle;
      }

      tbody tr:hover {
        background: var(--surface-hover);
      }
    }

    .table-item-cell {
      display: flex;
      align-items: center;
      gap: var(--space-sm);

      .thumb-mini {
        width: 44px;
        height: 32px;
        object-fit: cover;
        border-radius: var(--radius-xs);
      }

      .table-item-title {
        font-weight: 600;
        color: var(--text-primary);
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .prod-price {
      font-weight: 700;
      color: var(--text-primary);
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  topVideos = signal<Video[]>([]);
  topProducts = signal<Product[]>([]);

  constructor(
    private videosApi: VideosApiService,
    private productsApi: ProductsApiService
  ) {}

  ngOnInit(): void {
    this.videosApi.getAll().subscribe((vids: any) => this.topVideos.set(vids.slice(0, 5)));
    this.productsApi.getAll().subscribe((prods: any) => this.topProducts.set(prods.slice(0, 5)));
  }
}
