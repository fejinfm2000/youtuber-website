import { Routes } from '@angular/router';
import { adminGuard } from '../../core/auth/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () => import('./shell/admin-shell.component').then(m => m.AdminShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'videos',
        loadComponent: () => import('./videos/admin-videos-list.component').then(m => m.AdminVideosListComponent),
      },
      {
        path: 'videos/new',
        loadComponent: () => import('./videos/admin-video-form.component').then(m => m.AdminVideoFormComponent),
      },
      {
        path: 'videos/:id/edit',
        loadComponent: () => import('./videos/admin-video-form.component').then(m => m.AdminVideoFormComponent),
      },
      {
        path: 'products',
        loadComponent: () => import('./products/admin-products-list.component').then(m => m.AdminProductsListComponent),
      },
      {
        path: 'products/new',
        loadComponent: () => import('./products/admin-product-form.component').then(m => m.AdminProductFormComponent),
      },
      {
        path: 'products/:id/edit',
        loadComponent: () => import('./products/admin-product-form.component').then(m => m.AdminProductFormComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/admin-settings.component').then(m => m.AdminSettingsComponent),
      },
      {
        path: 'analytics',
        loadComponent: () => import('./analytics/admin-analytics.component').then(m => m.AdminAnalyticsComponent),
      },
    ],
  },
];
