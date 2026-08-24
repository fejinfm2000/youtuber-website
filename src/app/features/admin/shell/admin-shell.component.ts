import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-wrapper">
      
      <!-- Admin Sidebar -->
      <aside class="admin-sidebar glass-card" [class.open]="sidebarOpen()">
        
        <div class="sidebar-brand">
          <a routerLink="/" class="admin-logo">
            <span class="logo-icon">◈</span>
            <span class="logo-text">CreatorHub</span>
          </a>
          <span class="badge badge-accent">STUDIO</span>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section-title">CORE PLATFORM</div>
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="side-link" id="admin-nav-dashboard">
            <span class="icon">📊</span>
            <span>Dashboard</span>
          </a>
          <a routerLink="/admin/videos" routerLinkActive="active" class="side-link" id="admin-nav-videos">
            <span class="icon">🎬</span>
            <span>Videos Manager</span>
          </a>
          <a routerLink="/admin/products" routerLinkActive="active" class="side-link" id="admin-nav-products">
            <span class="icon">🛒</span>
            <span>Products & Deals</span>
          </a>
          <a routerLink="/admin/analytics" routerLinkActive="active" class="side-link" id="admin-nav-analytics">
            <span class="icon">📈</span>
            <span>Logistics & Analytics</span>
          </a>

          <div class="nav-section-title">CONFIGURATION</div>
          <a routerLink="/admin/settings" routerLinkActive="active" class="side-link" id="admin-nav-settings">
            <span class="icon">⚙️</span>
            <span>Creator Settings</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/" target="_blank" class="btn btn-secondary btn-sm preview-btn">
            View Live Site ↗
          </a>
          <button class="btn btn-ghost btn-sm logout-btn" (click)="authService.logout()">
            Sign Out
          </button>
        </div>

      </aside>

      <!-- Main Admin Content Area -->
      <div class="admin-main">
        
        <!-- Admin Top Navigation Bar -->
        <header class="admin-topbar glass-card">
          <button class="icon-btn mobile-sidebar-toggle" (click)="toggleSidebar()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>

          <div class="topbar-title">
            <span>Creator Management Studio</span>
          </div>

          <div class="topbar-actions">
            <!-- Theme Toggle -->
            <button class="icon-btn" (click)="themeService.toggle()" title="Toggle Theme">
              <span *ngIf="themeService.isDark()">☀️</span>
              <span *ngIf="!themeService.isDark()">🌙</span>
            </button>

            <!-- User profile chip -->
            <div class="admin-user-pill" *ngIf="authService.currentUser() as user">
              <span class="user-avatar">A</span>
              <span class="user-name">{{ user.displayName }}</span>
            </div>
          </div>
        </header>

        <!-- Dynamic Admin Child Pages -->
        <main class="admin-body">
          <router-outlet />
        </main>

      </div>

    </div>
  `,
  styles: [`
    .admin-wrapper {
      display: flex;
      min-height: 100vh;
      background: var(--bg-primary);
      overflow-x: hidden;
    }

    .admin-sidebar {
      width: 240px;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      border-radius: 0;
      border-right: 1px solid var(--border);
      border-top: none;
      border-bottom: none;
      border-left: none;
      z-index: 100;
      padding: var(--space-md) var(--space-md);
      background: var(--bg-secondary);

      @media (max-width: 1024px) {
        transform: translateX(-100%);
        transition: transform var(--transition-base);
        &.open { transform: translateX(0); }
      }
    }

    .sidebar-brand {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
      padding: 0 4px;

      .admin-logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.05rem;
        font-weight: 800;
        color: var(--text-primary);
        text-decoration: none;
        .logo-icon { color: var(--accent); font-size: 1.2rem; }
      }
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 3px;
      flex: 1;
      overflow-y: auto;
    }

    .nav-section-title {
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.08em;
      margin: var(--space-sm) 0 var(--space-xs) 8px;
    }

    .side-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: var(--radius-xs);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.86rem;
      font-weight: 500;
      transition: all var(--transition-fast);

      .icon { font-size: 1rem; }

      &:hover {
        background: var(--surface-hover);
        color: var(--text-primary);
      }

      &.active {
        background: var(--accent-soft);
        color: var(--accent);
        font-weight: 700;
        border-left: 3px solid var(--accent);
      }
    }

    .sidebar-footer {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      border-top: 1px solid var(--border);
      padding-top: var(--space-sm);

      .preview-btn, .logout-btn {
        width: 100%;
        text-align: center;
      }
    }

    .admin-main {
      flex: 1;
      margin-left: 240px;
      width: calc(100% - 240px);
      min-width: 0;
      display: flex;
      flex-direction: column;
      min-height: 100vh;

      @media (max-width: 1024px) {
        margin-left: 0;
        width: 100%;
      }
    }

    .admin-topbar {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-lg);
      border-radius: 0;
      border-bottom: 1px solid var(--border);
      border-top: none;
      border-left: none;
      border-right: none;
      position: sticky;
      top: 0;
      z-index: 90;
    }

    .mobile-sidebar-toggle {
      display: none;
      @media (max-width: 1024px) { display: flex; }
    }

    .topbar-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .topbar-actions {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .admin-user-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 3px 10px 3px 3px;
      border-radius: var(--radius-full);

      .user-avatar {
        width: 24px;
        height: 24px;
        background: var(--accent);
        color: #000;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 0.75rem;
      }
      .user-name {
        font-size: 0.8rem;
        font-weight: 600;
      }
    }

    .admin-body {
      padding: var(--space-lg);
      flex: 1;
      min-width: 0;

      @media (max-width: 768px) {
        padding: var(--space-md);
      }
    }
  `]
})
export class AdminShellComponent {
  sidebarOpen = signal(false);

  constructor(
    public authService: AuthService,
    public themeService: ThemeService
  ) {}

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }
}
