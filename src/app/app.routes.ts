import { Routes } from '@angular/router';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./features/public/shell/public-shell.component').then(m => m.PublicShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'videos',
        loadComponent: () => import('./features/public/videos/videos-list/videos-list.component').then(m => m.VideosListComponent),
      },
      {
        path: 'videos/:slug',
        loadComponent: () => import('./features/public/videos/video-detail/video-detail.component').then(m => m.VideoDetailComponent),
      },
      {
        path: 'products',
        loadComponent: () => import('./features/public/products/products-list/products-list.component').then(m => m.ProductsListComponent),
      },
      {
        path: 'products/:slug',
        loadComponent: () => import('./features/public/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
      },
      {
        path: 'recommendations',
        loadComponent: () => import('./features/public/products/products-list/products-list.component').then(m => m.ProductsListComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./features/public/about/about.component').then(m => m.AboutComponent),
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/public/contact/contact.component').then(m => m.ContactComponent),
      },
      {
        path: 'community',
        loadComponent: () => import('./features/public/community/community.component').then(m => m.CommunityComponent),
      },
      {
        path: 'search',
        loadComponent: () => import('./features/public/search/search.component').then(m => m.SearchComponent),
      },
      {
        path: 'privacy',
        loadComponent: () => import('./features/public/legal/privacy.component').then(m => m.PrivacyComponent),
      },
      {
        path: 'terms',
        loadComponent: () => import('./features/public/legal/terms.component').then(m => m.TermsComponent),
      },
      {
        path: 'affiliate-disclosure',
        loadComponent: () => import('./features/public/legal/affiliate-disclosure.component').then(m => m.AffiliateDisclosureComponent),
      },
    ],
  },

  // Auth routes
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },

  // Affiliate redirect
  {
    path: 'go/:slug',
    loadComponent: () => import('./features/public/affiliate-redirect/affiliate-redirect.component').then(m => m.AffiliateRedirectComponent),
  },

  // Admin routes (lazy loaded)
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
  },

  // Fallback
  {
    path: '**',
    loadComponent: () => import('./features/public/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
