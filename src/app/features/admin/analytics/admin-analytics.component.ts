import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'AUTH' | 'VIDEO_VIEW' | 'PRODUCT_VIEW' | 'AFFILIATE_CLICK' | 'DISCOUNT_REVEAL' | 'ENQUIRY';
  user: string;
  target: string;
  source: string;
  device: string;
}

const MOCK_EVENTS: ActivityEvent[] = [
  { id: '1', timestamp: '2026-08-24 09:15', type: 'AFFILIATE_CLICK', user: 'Guest (#8821)', target: 'Sony ZV-E10 Mirrorless Camera', source: 'Amazon Outbound', device: 'Chrome / Android' },
  { id: '2', timestamp: '2026-08-24 09:12', type: 'DISCOUNT_REVEAL', user: 'Karthik (Member)', target: 'Traditional Cast Iron Kadai', source: 'Product Page', device: 'Safari / iPhone' },
  { id: '3', timestamp: '2026-08-24 08:58', type: 'VIDEO_VIEW', user: 'Guest (#4102)', target: 'Friday Night Unexpected Home-made Chicken Biriyani', source: 'Homepage Grid', device: 'Chrome / Windows' },
  { id: '4', timestamp: '2026-08-24 08:45', type: 'AUTH', user: 'aravind@foodies.in', target: 'Self-Registration', source: 'Register Page', device: 'Firefox / Linux' },
  { id: '5', timestamp: '2026-08-24 08:30', type: 'ENQUIRY', user: 'Anand (Spice Brand Lead)', target: 'Culinary Brand Collaboration', source: 'Contact Form', device: 'Edge / Windows' },
  { id: '6', timestamp: '2026-08-24 08:15', type: 'AFFILIATE_CLICK', user: 'Guest (#1920)', target: 'DJI Mic 2 Wireless Microphone System', source: 'Video Details', device: 'Chrome / Android' },
  { id: '7', timestamp: '2026-08-24 07:50', type: 'PRODUCT_VIEW', user: 'Meena (Member)', target: 'Insta360 X3 Action Camera', source: 'Recommendations', device: 'Safari / iPad' },
];

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-analytics-page">
      
      <div class="analytics-header-row">
        <div>
          <h2>Activity & Logistics Log</h2>
          <p>Real-time stream of visitor engagement, affiliate intent, and member activity.</p>
        </div>
        <button class="btn btn-secondary btn-sm" (click)="exportToCsv()" id="export-csv-btn">
          📥 Export Log to CSV
        </button>
      </div>

      <!-- Quick Metrics Summary -->
      <div class="summary-pills-grid">
        <div class="glass-card pill-card">
          <span class="label">Total Events</span>
          <span class="val">142,890</span>
        </div>
        <div class="glass-card pill-card">
          <span class="label">Affiliate Intent</span>
          <span class="val accent">12,340</span>
        </div>
        <div class="glass-card pill-card">
          <span class="label">Perk Reveals</span>
          <span class="val">4,810</span>
        </div>
        <div class="glass-card pill-card">
          <span class="label">Registered Members</span>
          <span class="val success">8,920</span>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="glass-card filter-card">
        <div class="filter-group">
          <label>Filter by Event Type:</label>
          <div class="chip-row">
            <button class="chip" [class.active]="selectedType() === 'ALL'" (click)="selectedType.set('ALL')">All Events</button>
            <button class="chip" [class.active]="selectedType() === 'AFFILIATE_CLICK'" (click)="selectedType.set('AFFILIATE_CLICK')">Affiliate Clicks</button>
            <button class="chip" [class.active]="selectedType() === 'DISCOUNT_REVEAL'" (click)="selectedType.set('DISCOUNT_REVEAL')">Discount Reveals</button>
            <button class="chip" [class.active]="selectedType() === 'VIDEO_VIEW'" (click)="selectedType.set('VIDEO_VIEW')">Video Views</button>
            <button class="chip" [class.active]="selectedType() === 'AUTH'" (click)="selectedType.set('AUTH')">Auth Events</button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="glass-card table-card">
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event Type</th>
                <th>User / Session</th>
                <th>Target Object</th>
                <th>Source Page</th>
                <th>Device</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ev of filteredEvents()">
                <td><span class="text-muted">{{ ev.timestamp }}</span></td>
                <td>
                  <span class="badge" [class.badge-accent]="ev.type === 'AFFILIATE_CLICK'" [class.badge-success]="ev.type === 'DISCOUNT_REVEAL'" [class.badge-surface]="ev.type !== 'AFFILIATE_CLICK' && ev.type !== 'DISCOUNT_REVEAL'">
                    {{ ev.type }}
                  </span>
                </td>
                <td><strong>{{ ev.user }}</strong></td>
                <td>{{ ev.target }}</td>
                <td><span class="badge badge-surface">{{ ev.source }}</span></td>
                <td><span class="device-text">{{ ev.device }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .admin-analytics-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
      min-width: 0;
    }

    .analytics-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: var(--space-md);

      h2 { font-size: 1.5rem; margin-bottom: 2px; }
      p { color: var(--text-secondary); margin: 0; font-size: 0.85rem; }
    }

    .summary-pills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: var(--space-md);
    }

    .pill-card {
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;

      .label {
        font-size: 0.7rem;
        text-transform: uppercase;
        color: var(--text-muted);
        letter-spacing: 0.04em;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .val {
        font-size: 1.35rem;
        font-weight: 800;
        color: var(--text-primary);
        line-height: 1.2;
        &.accent { color: var(--accent); }
        &.success { color: var(--success); }
      }
    }

    .filter-card {
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: var(--space-md);

      .filter-group {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        flex-wrap: wrap;

        label { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); }
      }

      .chip-row {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
    }

    .table-card {
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
      min-width: 580px;

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

    .device-text {
      font-size: 0.78rem;
      color: var(--text-muted);
    }
  `]
})
export class AdminAnalyticsComponent implements OnInit {
  events = signal<ActivityEvent[]>(MOCK_EVENTS);
  selectedType = signal<string>('ALL');

  filteredEvents = computed(() => {
    const t = this.selectedType();
    if (t === 'ALL') return this.events();
    return this.events().filter(e => e.type === t);
  });

  ngOnInit(): void {}

  exportToCsv(): void {
    const rows = this.events().map(e => `${e.timestamp},${e.type},"${e.user}","${e.target}","${e.source}","${e.device}"`);
    const csvContent = 'data:text/csv;charset=utf-8,Timestamp,Type,User,Target,Source,Device\n' + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `creatorhub_activity_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
