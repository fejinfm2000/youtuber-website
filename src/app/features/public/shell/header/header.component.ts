import { Component, HostListener, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '@services/theme.service';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  template: `
    <header class="site-header" [class.scrolled]="isScrolled()">
      <div class="container header-inner">
        <!-- Logo -->
        <a routerLink="/" class="logo" id="header-logo">
          <span class="logo-icon">◈</span>
          <span class="logo-text">CreatorHub</span>
        </a>

        <!-- Desktop Nav -->
        <nav class="main-nav" aria-label="Main navigation">
          <a *ngFor="let item of navItems"
             [routerLink]="item.route"
             routerLinkActive="active"
             [routerLinkActiveOptions]="{ exact: item.route === '/' }"
             class="nav-link"
             [id]="'nav-' + item.label.toLowerCase()">
            {{ item.label }}
          </a>
        </nav>

        <!-- Right Actions -->
        <div class="header-actions">
          <!-- Search -->
          <button class="icon-btn" id="header-search-btn" (click)="toggleSearch()" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          <!-- Theme toggle -->
          <button class="icon-btn theme-toggle" id="header-theme-toggle" (click)="themeService.toggle()" [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
            <span *ngIf="themeService.isDark()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            </span>
            <span *ngIf="!themeService.isDark()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            </span>
          </button>

          <!-- Admin/Login -->
          <a routerLink="/login" class="btn btn-primary btn-sm" id="header-login-btn">
            Dashboard
          </a>

          <!-- Mobile hamburger -->
          <button class="icon-btn mobile-menu-btn" id="header-menu-btn" (click)="toggleMobileMenu()" aria-label="Toggle menu">
            <span *ngIf="!mobileMenuOpen()">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>
              </svg>
            </span>
            <span *ngIf="mobileMenuOpen()">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      <!-- Search bar -->
      <div class="search-bar" [class.open]="searchOpen()">
        <div class="container">
          <div class="search-input-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              class="search-input"
              id="header-search-input"
              placeholder="Search videos, products, resources..."
              [(ngModel)]="searchQuery"
              (keyup.enter)="doSearch()"
              autofocus>
            <button class="btn btn-sm btn-primary" (click)="doSearch()">Search</button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileMenuOpen()">
        <nav class="mobile-nav">
          <a *ngFor="let item of navItems"
             [routerLink]="item.route"
             routerLinkActive="active"
             (click)="closeMobileMenu()"
             class="mobile-nav-link">
            {{ item.label }}
          </a>
          <hr class="divider">
          <a routerLink="/login" class="mobile-nav-link accent" (click)="closeMobileMenu()">Dashboard</a>
        </nav>
      </div>

      <!-- Mobile menu backdrop -->
      <div class="mobile-backdrop" *ngIf="mobileMenuOpen()" (click)="closeMobileMenu()"></div>
    </header>
  `,
  styles: [`
    .site-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 500;
      height: var(--header-height);
      transition: background var(--transition-base), box-shadow var(--transition-base), backdrop-filter var(--transition-base);

      &.scrolled {
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 1px 0 var(--border), var(--shadow-sm);
      }
    }

    .header-inner {
      display: flex;
      align-items: center;
      height: var(--header-height);
      gap: var(--space-lg);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      flex-shrink: 0;

      .logo-icon {
        font-size: 1.5rem;
        color: var(--accent);
        line-height: 1;
      }
      .logo-text {
        font-size: 1.1rem;
        font-weight: 800;
        color: var(--text-primary);
        letter-spacing: -0.03em;
      }
    }

    .main-nav {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
    }

    .nav-link {
      padding: 8px 14px;
      border-radius: var(--radius-xs);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      transition: color var(--transition-fast), background var(--transition-fast);
      white-space: nowrap;

      &:hover { color: var(--text-primary); background: var(--accent-softer); }
      &.active { color: var(--accent); background: var(--accent-soft); }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      flex-shrink: 0;
    }

    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: var(--radius-xs);
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        color: var(--text-primary);
        background: var(--surface-hover);
        border-color: var(--border-strong);
      }
    }

    .mobile-menu-btn { display: none; }

    .search-bar {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      max-height: 0;
      overflow: hidden;
      transition: max-height var(--transition-base), padding var(--transition-base);
      &.open { max-height: 80px; padding: var(--space-md) 0; }
    }

    .search-input-wrap {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      background: var(--surface-solid);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 0 var(--space-md);

      svg { color: var(--text-muted); flex-shrink: 0; }
    }

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 0.95rem;
      padding: 14px 0;
      outline: none;
      &::placeholder { color: var(--text-muted); }
    }

    .mobile-menu {
      display: none;
      position: fixed;
      top: var(--header-height);
      left: 0;
      right: 0;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      z-index: 499;
      transform: translateY(-100%);
      transition: transform var(--transition-base);
      &.open { transform: translateY(0); }
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      padding: var(--space-md);
    }

    .mobile-nav-link {
      padding: 14px 16px;
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      &:hover, &.active { color: var(--text-primary); background: var(--surface); }
      &.accent { color: var(--accent); }
    }

    .mobile-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: var(--overlay);
      z-index: 498;
    }

    @media (max-width: 1024px) {
      .main-nav { display: none; }
      .mobile-menu-btn { display: flex; }
      .mobile-menu { display: block; }
      .mobile-backdrop { display: block; }
      .btn-sm[routerLink="/login"] { display: none; }
    }
    @media (max-width: 640px) {
      .theme-toggle { display: none; }
    }
  `]
})
export class HeaderComponent implements OnInit {
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);
  searchOpen = signal(false);
  searchQuery = '';

  navItems: NavItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Videos', route: '/videos' },
    { label: 'Products', route: '/products' },
    { label: 'Community', route: '/community' },
    { label: 'About', route: '/about' },
    { label: 'Contact', route: '/contact' },
  ];

  constructor(public themeService: ThemeService, private router: Router) {}

  ngOnInit(): void {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
    if (this.mobileMenuOpen()) this.searchOpen.set(false);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleSearch(): void {
    this.searchOpen.set(!this.searchOpen());
    if (this.searchOpen()) this.mobileMenuOpen.set(false);
  }

  doSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
      this.searchOpen.set(false);
      this.searchQuery = '';
    }
  }
}
