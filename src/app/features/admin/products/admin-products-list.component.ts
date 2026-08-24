import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsApiService } from '@data/sheetdb/products-api.service';
import { Product } from '@models/product.model';

@Component({
  selector: 'app-admin-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="admin-products-page">
      
      <!-- Top Header -->
      <div class="action-bar-row">
        <div>
          <h2>Product & Recommendations Manager</h2>
          <p>Manage hardware, software deals, affiliate links, and member perks.</p>
        </div>
        <a routerLink="/admin/products/new" class="btn btn-primary" id="add-new-product-btn">
          + Add New Product
        </a>
      </div>

      <!-- Controls -->
      <div class="glass-card table-control-card">
        <div class="search-input-wrap">
          <input 
            type="text" 
            class="input" 
            placeholder="Search by product name, brand, or category..." 
            [(ngModel)]="searchQuery" 
            id="admin-product-search-input"
          />
        </div>

        <div class="table-stats-pill">
          Total: <strong>{{ products().length }}</strong> items
        </div>
      </div>

      <!-- Table Card -->
      <div class="glass-card table-container-card">
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category / Brand</th>
                <th>Type</th>
                <th>Price</th>
                <th>Member Perk</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let prod of filteredProducts()">
                
                <!-- Product Preview -->
                <td>
                  <div class="prod-cell">
                    <img [src]="prod.image" [alt]="prod.name" class="prod-table-thumb" />
                    <div class="prod-cell-text">
                      <strong class="prod-row-name">{{ prod.name }}</strong>
                      <code class="slug-pill">/products/{{ prod.slug }}</code>
                    </div>
                  </div>
                </td>

                <!-- Category & Brand -->
                <td>
                  <div class="meta-stack">
                    <span class="badge badge-surface">{{ prod.category }}</span>
                    <span class="brand-sub">{{ prod.brand }}</span>
                  </div>
                </td>

                <!-- Type -->
                <td>
                  <span class="badge badge-accent">{{ prod.type }}</span>
                </td>

                <!-- Price -->
                <td>
                  <strong class="price-text" *ngIf="prod.price">₹{{ prod.price | number }}</strong>
                  <span class="text-muted" *ngIf="!prod.price">Free / Direct</span>
                </td>

                <!-- Member Perk -->
                <td>
                  <span class="badge badge-success" *ngIf="prod.memberDiscountEligible">
                    {{ prod.memberDiscountPercent }}% OFF
                  </span>
                  <span class="text-muted" *ngIf="!prod.memberDiscountEligible">—</span>
                </td>

                <!-- Status -->
                <td>
                  <span class="badge" [class.badge-success]="prod.active" [class.badge-surface]="!prod.active">
                    {{ prod.active ? 'Active' : 'Archived' }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="text-right">
                  <div class="table-action-btns">
                    <a [routerLink]="['/products', prod.slug]" target="_blank" class="btn btn-ghost btn-sm" title="View Product Page">
                      👁️
                    </a>
                    <a [routerLink]="['/admin/products', prod.id, 'edit']" class="btn btn-secondary btn-sm">
                      Edit
                    </a>
                    <button class="btn btn-ghost btn-sm delete-btn" (click)="archiveProduct(prod.slug)" title="Archive Item">
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
    .admin-products-page {
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
      min-width: 620px;

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

    .prod-cell {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      min-width: 0;

      .prod-table-thumb {
        width: 42px;
        height: 42px;
        object-fit: cover;
        border-radius: var(--radius-xs);
        flex-shrink: 0;
      }

      .prod-cell-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        max-width: 240px;
      }

      .prod-row-name {
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

    .meta-stack {
      display: flex;
      flex-direction: column;
      gap: 2px;
      .brand-sub { font-size: 0.72rem; color: var(--text-muted); }
    }

    .price-text {
      color: var(--text-primary);
      font-weight: 700;
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
export class AdminProductsListComponent implements OnInit {
  products = signal<Product[]>([]);
  searchQuery = '';

  filteredProducts = computed(() => {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.products();
    return this.products().filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.slug.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q))
    );
  });

  constructor(private productsApi: ProductsApiService) {}

  ngOnInit(): void {
    this.productsApi.getAll().subscribe((prods: any) => this.products.set(prods));
  }

  archiveProduct(slug: string): void {
    if (confirm('Archive this product?')) {
      this.products.set(this.products().filter(p => p.slug !== slug));
    }
  }
}
