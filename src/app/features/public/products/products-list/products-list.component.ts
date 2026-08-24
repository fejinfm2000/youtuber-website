import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsApiService } from '../../../../core/data/sheetdb/products-api.service';
import { SeoService } from '../../../../core/services/seo.service';
import { Product, ProductCategory } from '../../../../core/models/product.model';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="products-page">
      
      <!-- Header Banner -->
      <section class="page-header-section">
        <div class="container">
          <span class="badge badge-accent">EXPLORER GEAR & COOKWARE</span>
          <h1 class="page-title">Explorer Gear & Essentials</h1>
          <p class="page-subtitle">
            Every camera, wireless microphone, traditional cast iron cookware, and travel accessory tested and personally vouched for by Pirai Adhi.
          </p>

          <!-- Member Discount Callout -->
          <div class="member-perk-banner glass-card">
            <div class="perk-icon">🎁</div>
            <div class="perk-content">
              <strong>Member Exclusive Discounts Available</strong>
              <p>Create a free account to unlock exclusive promo codes and up to 10-20% off selected partner brands.</p>
            </div>
            <a routerLink="/register" class="btn btn-primary btn-sm" id="member-discount-cta">Join Free</a>
          </div>

          <!-- Filters -->
          <div class="filter-controls-card glass-card">
            <div class="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input 
                type="text" 
                class="filter-search-input" 
                placeholder="Search products by brand, category, or keyword..." 
                [(ngModel)]="searchQuery"
                id="products-search-input"
              />
              <button class="clear-btn" *ngIf="searchQuery" (click)="searchQuery = ''">✕</button>
            </div>

            <!-- Categories -->
            <div class="category-pills">
              <button 
                class="chip" 
                [class.active]="selectedCategory() === 'ALL'"
                (click)="setCategory('ALL')">
                All Products ({{ products().length }})
              </button>
              <button 
                *ngFor="let cat of categories()"
                class="chip" 
                [class.active]="selectedCategory() === cat.name"
                (click)="setCategory(cat.name)">
                {{ cat.name }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Products Grid -->
      <section class="section">
        <div class="container">
          
          <div class="results-header" *ngIf="filteredProducts().length > 0">
            <span class="results-count">Showing {{ filteredProducts().length }} recommendation{{ filteredProducts().length === 1 ? '' : 's' }}</span>
          </div>

          <div class="grid-3" *ngIf="filteredProducts().length > 0">
            <div class="glass-card product-card" *ngFor="let prod of filteredProducts()">
              
              <!-- Product Image -->
              <div class="product-thumb-wrap">
                <img [src]="prod.image" [alt]="prod.name" class="product-img" />
                <span class="product-badge-type">{{ prod.type }}</span>
                <span class="discount-pill" *ngIf="prod.memberDiscountEligible">
                  {{ prod.memberDiscountPercent }}% Member Perk
                </span>
              </div>

              <!-- Product Details -->
              <div class="product-card-body">
                <div class="brand-row">
                  <span class="brand-name">{{ prod.brand || prod.category }}</span>
                  <span class="rating" *ngIf="prod.rating">★ {{ prod.rating }}</span>
                </div>

                <h3 class="product-name">
                  <a [routerLink]="['/products', prod.slug]">{{ prod.name }}</a>
                </h3>

                <p class="product-desc">{{ prod.shortDescription || prod.description }}</p>

                <div class="creator-note-quote" *ngIf="prod.creatorNote">
                  “{{ prod.creatorNote }}”
                </div>

                <!-- Footer / Price / CTAs -->
                <div class="product-card-footer">
                  <div class="price-block">
                    <span class="price-val" *ngIf="prod.price && prod.price > 0">
                      {{ prod.currency === 'USD' ? '$' : '₹' }}{{ prod.price | number }}
                    </span>
                    <span class="price-free" *ngIf="!prod.price || prod.price === 0">Free Tier</span>
                  </div>

                  <div class="card-btn-group">
                    <a [routerLink]="['/products', prod.slug]" class="btn btn-secondary btn-sm">Details</a>
                    <a [href]="prod.affiliateUrl || prod.amazonUrl || prod.officialUrl || '#'" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                      Get Deal ↗
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state glass-card" *ngIf="filteredProducts().length === 0">
            <div class="empty-icon">📦</div>
            <h3>No Products Found</h3>
            <p>No gear matching "{{ searchQuery }}" in {{ selectedCategory() }}.</p>
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
      margin-bottom: var(--space-lg);
    }

    .member-perk-banner {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md) var(--space-lg);
      margin-bottom: var(--space-lg);
      border: 1px solid var(--accent);
      background: var(--accent-softer);

      .perk-icon { font-size: 1.8rem; }
      .perk-content {
        flex: 1;
        strong { font-size: 0.95rem; color: var(--accent); display: block; margin-bottom: 2px; }
        p { font-size: 0.85rem; color: var(--text-secondary); margin: 0; }
      }

      @media (max-width: 640px) {
        flex-direction: column;
        align-items: flex-start;
      }
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

    .product-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .product-thumb-wrap {
      position: relative;
      aspect-ratio: 4 / 3;
      overflow: hidden;

      .product-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform var(--transition-slow);
      }

      &:hover .product-img {
        transform: scale(1.04);
      }
    }

    .product-badge-type {
      position: absolute;
      top: 10px;
      left: 10px;
      background: var(--surface-solid);
      border: 1px solid var(--border);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: 3px 8px;
      border-radius: var(--radius-xs);
      color: var(--text-secondary);
      text-transform: uppercase;
    }

    .discount-pill {
      position: absolute;
      top: 10px;
      right: 10px;
      background: var(--accent);
      color: #000;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      padding: 3px 8px;
      border-radius: var(--radius-xs);
      text-transform: uppercase;
    }

    .product-card-body {
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .brand-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;

      .brand-name {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .rating {
        font-size: 0.8rem;
        color: var(--accent);
        font-weight: 700;
      }
    }

    .product-name {
      font-size: 1.15rem;
      line-height: 1.35;
      margin-bottom: 8px;
      a { color: var(--text-primary); &:hover { color: var(--accent); } }
    }

    .product-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: var(--space-md);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .creator-note-quote {
      background: var(--surface-solid);
      border-left: 3px solid var(--accent);
      padding: 8px 12px;
      border-radius: 0 var(--radius-xs) var(--radius-xs) 0;
      font-size: 0.8rem;
      font-style: italic;
      color: var(--text-secondary);
      margin-bottom: var(--space-lg);
    }

    .product-card-footer {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border);
      padding-top: var(--space-md);
      gap: var(--space-sm);
    }

    .price-block {
      .price-val {
        font-size: 1.1rem;
        font-weight: 800;
        color: var(--text-primary);
      }
      .price-free {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--success);
      }
    }

    .card-btn-group {
      display: flex;
      gap: 6px;
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
export class ProductsListComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<ProductCategory[]>([]);
  selectedCategory = signal<string>('ALL');
  searchQuery = '';

  filteredProducts = computed(() => {
    let list = this.products();
    const cat = this.selectedCategory();
    const query = this.searchQuery.trim().toLowerCase();

    if (cat !== 'ALL') {
      list = list.filter(p => p.category === cat);
    }

    if (query) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query))
      );
    }

    return list;
  });

  constructor(private productsApi: ProductsApiService, private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Explorer Gear & Cookware Recommendations — Pirai Adhi',
      description: 'Hand-picked vlogging gear, wireless mics, cameras, cast iron cookware, and travel accessories curated by Pirai Adhi.',
    });

    this.productsApi.getAll().subscribe(prods => this.products.set(prods));
    this.productsApi.getCategories().subscribe(cats => this.categories.set(cats));
  }

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  resetFilters(): void {
    this.selectedCategory.set('ALL');
    this.searchQuery = '';
  }
}
