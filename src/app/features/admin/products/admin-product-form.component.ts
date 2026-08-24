import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductsApiService } from '@data/sheetdb/products-api.service';
import { Product, ProductCategory, ProductType } from '@models/product.model';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="admin-form-page">
      
      <div class="form-header-row">
        <div>
          <a routerLink="/admin/products" class="back-link">← Back to Products List</a>
          <h2 class="form-title">{{ isEdit() ? 'Edit Recommendation' : 'Add New Recommendation' }}</h2>
          <p class="form-subtitle">Add hardware, tools, and digital resources with affiliate links.</p>
        </div>
      </div>

      <div class="form-layout-grid">
        
        <!-- Left: Product Inputs -->
        <div class="glass-card main-form-card">
          <form (submit)="saveProduct($event)" class="crud-form">
            
            <!-- Name & Slug -->
            <div class="grid-2">
              <div class="form-group">
                <label for="prod-name">Product Name *</label>
                <input 
                  type="text" 
                  id="prod-name" 
                  class="input" 
                  [(ngModel)]="formData.name" 
                  (ngModelChange)="onNameChange($event)"
                  name="name" 
                  placeholder="Sony ZV-E10 Camera" 
                  required 
                />
              </div>

              <div class="form-group">
                <label for="prod-slug">URL Slug *</label>
                <input 
                  type="text" 
                  id="prod-slug" 
                  class="input" 
                  [(ngModel)]="formData.slug" 
                  name="slug" 
                  placeholder="sony-zv-e10-camera" 
                  required 
                />
              </div>
            </div>

            <!-- Category & Type -->
            <div class="grid-2">
              <div class="form-group">
                <label for="prod-category">Category *</label>
                <select id="prod-category" class="input" [(ngModel)]="formData.category" name="category">
                  <option *ngFor="let cat of categories()" [value]="cat.name">{{ cat.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="prod-type">Product Type *</label>
                <select id="prod-type" class="input" [(ngModel)]="formData.type" name="type">
                  <option value="PHYSICAL">Physical Hardware / Gear</option>
                  <option value="SOFTWARE">Software / SaaS Tool</option>
                  <option value="COURSE">Educational Course</option>
                  <option value="BOOK">Book / Guide</option>
                  <option value="DIGITAL_PRODUCT">Digital Download</option>
                  <option value="SERVICE">Professional Service</option>
                </select>
              </div>
            </div>

            <!-- Brand & Price -->
            <div class="grid-2">
              <div class="form-group">
                <label for="prod-brand">Brand / Manufacturer</label>
                <input 
                  type="text" 
                  id="prod-brand" 
                  class="input" 
                  [(ngModel)]="formData.brand" 
                  name="brand" 
                  placeholder="Sony, Rode, Apple, etc." 
                />
              </div>

              <div class="form-group">
                <label for="prod-price">Price (₹ INR)</label>
                <input 
                  type="number" 
                  id="prod-price" 
                  class="input" 
                  [(ngModel)]="formData.price" 
                  name="price" 
                  placeholder="e.g. 64999" 
                />
              </div>
            </div>

            <!-- Image URL -->
            <div class="form-group">
              <label for="prod-image">Image URL *</label>
              <input 
                type="url" 
                id="prod-image" 
                class="input" 
                [(ngModel)]="formData.image" 
                name="image" 
                placeholder="https://images.unsplash.com/..." 
                required 
              />
            </div>

            <!-- Creator Note -->
            <div class="form-group">
              <label for="prod-note">
                <strong>Creator's Opinion / Verdict *</strong>
                <span class="helper-text">(Why you personally recommend it)</span>
              </label>
              <textarea 
                id="prod-note" 
                class="input" 
                [(ngModel)]="formData.creatorNote" 
                name="creatorNote" 
                placeholder="I've used this for 2 years on my main studio desk..." 
                required
              ></textarea>
            </div>

            <!-- Outbound Links -->
            <div class="section-divider">
              <h4>Outbound Store Links</h4>
            </div>

            <div class="form-group">
              <label for="prod-affiliate">Special Partner / Affiliate URL</label>
              <input 
                type="url" 
                id="prod-affiliate" 
                class="input" 
                [(ngModel)]="formData.affiliateUrl" 
                name="affiliateUrl" 
                placeholder="https://partner.com/?ref=alexcreator" 
              />
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label for="prod-amazon">Amazon India URL</label>
                <input 
                  type="url" 
                  id="prod-amazon" 
                  class="input" 
                  [(ngModel)]="formData.amazonUrl" 
                  name="amazonUrl" 
                  placeholder="https://amazon.in/dp/..." 
                />
              </div>

              <div class="form-group">
                <label for="prod-official">Official Manufacturer Site</label>
                <input 
                  type="url" 
                  id="prod-official" 
                  class="input" 
                  [(ngModel)]="formData.officialUrl" 
                  name="officialUrl" 
                  placeholder="https://sony.co.in/..." 
                />
              </div>
            </div>

            <!-- Member Perk Configuration -->
            <div class="section-divider">
              <h4>Member Exclusive Discount (Section 69)</h4>
            </div>

            <div class="grid-2">
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="formData.memberDiscountEligible" name="memberDiscountEligible" />
                  <span>Eligible for Logged-In Member Discount</span>
                </label>
              </div>

              <div class="form-group" *ngIf="formData.memberDiscountEligible">
                <label for="discount-percent">Discount Percentage (%)</label>
                <input 
                  type="number" 
                  id="discount-percent" 
                  class="input" 
                  [(ngModel)]="formData.memberDiscountPercent" 
                  name="memberDiscountPercent" 
                  placeholder="10" 
                />
              </div>
            </div>

            <!-- Submit -->
            <div class="form-action-row">
              <button type="submit" class="btn btn-primary btn-lg" id="save-product-submit-btn">
                {{ isEdit() ? 'Update Product' : 'Add Recommendation' }}
              </button>
              <a routerLink="/admin/products" class="btn btn-ghost">Cancel</a>
            </div>

          </form>
        </div>

        <!-- Right: Live Preview -->
        <div class="glass-card preview-sidebar-card">
          <h3>Card Preview</h3>
          <p class="preview-sub">As shown on public recommendations page.</p>

          <div class="prod-preview-frame">
            <img 
              [src]="formData.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600'" 
              alt="Product preview" 
              class="preview-img" 
            />
            <span class="preview-type-badge">{{ formData.type }}</span>
            <span class="preview-discount-badge" *ngIf="formData.memberDiscountEligible">
              {{ formData.memberDiscountPercent }}% Perk
            </span>
          </div>

          <div class="preview-prod-details">
            <span class="brand">{{ formData.brand || formData.category }}</span>
            <strong>{{ formData.name || 'Product Title' }}</strong>
            <span class="price" *ngIf="formData.price">₹{{ formData.price | number }}</span>
            <p class="quote" *ngIf="formData.creatorNote">“{{ formData.creatorNote }}”</p>
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
      gap: var(--space-lg);
      min-width: 0;

      @media (max-width: 1100px) {
        grid-template-columns: 1fr;
      }
    }

    .main-form-card, .preview-sidebar-card {
      padding: var(--space-lg);
      min-width: 0;
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

    .section-divider {
      border-top: 1px solid var(--border);
      padding-top: var(--space-md);
      margin-top: var(--space-sm);

      h4 { font-size: 0.95rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.06em; }
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

    .prod-preview-frame {
      position: relative;
      aspect-ratio: 4 / 3;
      border-radius: var(--radius-sm);
      overflow: hidden;
      margin-bottom: var(--space-md);
      border: 1px solid var(--border);

      .preview-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .preview-type-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        background: var(--surface-solid);
        font-size: 0.65rem;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 700;
      }

      .preview-discount-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: var(--accent);
        color: #000;
        font-size: 0.65rem;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 800;
      }
    }

    .preview-prod-details {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .brand { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
      strong { font-size: 1.05rem; color: var(--text-primary); }
      .price { font-size: 1.1rem; font-weight: 800; color: var(--accent); }
      .quote { font-size: 0.85rem; font-style: italic; color: var(--text-secondary); margin-top: 4px; }
    }
  `]
})
export class AdminProductFormComponent implements OnInit {
  isEdit = signal(false);
  categories = signal<ProductCategory[]>([]);

  formData: Product = {
    id: '',
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    image: '',
    category: 'Camera',
    type: 'PHYSICAL',
    brand: '',
    price: 0,
    currency: 'INR',
    officialUrl: '',
    affiliateUrl: '',
    amazonUrl: '',
    featured: false,
    active: true,
    creatorNote: '',
    rating: 5.0,
    memberDiscountEligible: false,
    memberDiscountPercent: 10,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsApi: ProductsApiService
  ) {}

  ngOnInit(): void {
    this.productsApi.getCategories().subscribe((cats: any) => this.categories.set(cats));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.productsApi.getAll().subscribe((prods: any) => {
        const found = prods.find((p: any) => p.id === id);
        if (found) {
          this.formData = { ...found };
        }
      });
    }
  }

  onNameChange(name: string): void {
    if (!this.isEdit() && name) {
      this.formData.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
  }

  saveProduct(e: Event): void {
    e.preventDefault();
    this.router.navigate(['/admin/products']);
  }
}
