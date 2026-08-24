import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SheetdbClientService } from './sheetdb-client.service';
import { Product, ProductCategory } from '../../models/product.model';
import { environment } from '../../../../environments/environment';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Sony ZV-E10 Mirrorless Camera',
    slug: 'sony-zv-e10-camera',
    description: 'The ultimate portable mirrorless camera for travel and street food creators. Fast autofocus, interchangeable lenses, and superior 4K video.',
    shortDescription: 'Essential mirrorless camera for food & travel vlogging.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    category: 'Cameras',
    type: 'PHYSICAL',
    brand: 'Sony',
    price: 64999,
    currency: 'INR',
    officialUrl: 'https://www.sony.co.in',
    amazonUrl: 'https://amazon.in',
    featured: true,
    active: true,
    creatorNote: 'My daily driver for food shots and dynamic travel scenes. The product showcase mode and autofocus are unbeatable.',
    rating: 4.9,
    memberDiscountEligible: true,
    memberDiscountPercent: 10,
  },
  {
    id: '2',
    name: 'DJI Mic 2 Wireless Microphone System',
    slug: 'dji-mic-2-wireless',
    description: 'Dual-channel wireless microphone with 32-bit float recording, intelligent noise cancelling, and 18-hour battery with charging case.',
    shortDescription: 'Pro wireless audio for noisy street food markets.',
    image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=800',
    category: 'Audio',
    type: 'PHYSICAL',
    brand: 'DJI',
    price: 29990,
    currency: 'INR',
    officialUrl: 'https://www.dji.com',
    amazonUrl: 'https://amazon.in',
    featured: true,
    active: true,
    creatorNote: 'Never worry about crowded street noise or wind again. The noise cancellation keeps voice crisp and loud.',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Joby GorillaPod 3K Pro Rig',
    slug: 'joby-gorillapod-3k-pro',
    description: 'Flexible tripod with modular arms for mounting lights and microphones. Wraps around railings and handles rocky outdoor terrain.',
    shortDescription: 'Flexible all-terrain tripod for solo explorers.',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
    category: 'Accessories',
    type: 'PHYSICAL',
    brand: 'Joby',
    price: 8499,
    currency: 'INR',
    officialUrl: 'https://joby.com',
    amazonUrl: 'https://amazon.in',
    featured: false,
    active: true,
    creatorNote: 'Indispensable for solo travelers. I wrap it on branches, fences, or food carts to get stable B-roll angles.',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Traditional Pre-Seasoned Cast Iron Kadai',
    slug: 'traditional-cast-iron-kadai',
    description: 'Heavy duty, chemical-free pre-seasoned cast iron kadai for authentic slow cooking, deep frying, and village style gravies.',
    shortDescription: 'Authentic cookware for traditional village recipes.',
    image: 'https://images.unsplash.com/photo-1584990347449-399081e72e12?w=800',
    category: 'Kitchen & Cooking',
    type: 'PHYSICAL',
    brand: 'Indus Valley',
    price: 2199,
    currency: 'INR',
    officialUrl: 'https://theindusvalley.com',
    affiliateUrl: 'https://theindusvalley.com?ref=piraiadhi',
    featured: true,
    active: true,
    creatorNote: 'Gives that unmatched earthy flavor to curries and biriyanis. Pure traditional cooking at its finest.',
    rating: 4.8,
  },
  {
    id: '5',
    name: 'DJI Osmo Mobile 6 Gimbal',
    slug: 'dji-osmo-mobile-6-gimbal',
    description: '3-axis smartphone stabilizer with built-in extension rod, ActiveTrack 6.0, and quick launch magnetic phone clamp.',
    shortDescription: 'Ultra-smooth smartphone stabilizer for walking shots.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800',
    category: 'Accessories',
    type: 'PHYSICAL',
    brand: 'DJI',
    price: 12990,
    currency: 'INR',
    officialUrl: 'https://www.dji.com',
    amazonUrl: 'https://amazon.in',
    featured: false,
    active: true,
    creatorNote: 'Essential for walking through bustling markets and catching butter-smooth running shots.',
    rating: 4.8,
  },
  {
    id: '6',
    name: 'Peak Design Everyday Travel Backpack (30L)',
    slug: 'peak-design-everyday-backpack-30l',
    description: 'Weatherproof adventure backpack with customizable FlexFold dividers, dedicated laptop sleeve, and quick side access.',
    shortDescription: 'Rugged, weatherproof travel backpack for camera gear.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    category: 'Travel Gear',
    type: 'PHYSICAL',
    brand: 'Peak Design',
    price: 24900,
    currency: 'INR',
    officialUrl: 'https://peakdesign.com',
    amazonUrl: 'https://amazon.in',
    featured: false,
    active: true,
    creatorNote: 'Carries all my lenses, drone, power banks, and sound gear comfortably on long trek days.',
    rating: 4.9,
  },
  {
    id: '7',
    name: 'Insta360 X3 Waterproof 360 Action Camera',
    slug: 'insta360-x3-action-camera',
    description: 'Pocket 360-degree action camera with 5.7K 360 capture, invisible selfie stick effect, and waterproof build for bike tours and waterfall treks.',
    shortDescription: '360-degree action camera for travel vlogs and outdoor action.',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
    category: 'Cameras',
    type: 'PHYSICAL',
    brand: 'Insta360',
    price: 37990,
    currency: 'INR',
    officialUrl: 'https://store.insta360.com',
    amazonUrl: 'https://amazon.in',
    featured: true,
    active: true,
    creatorNote: 'The invisible selfie stick effect makes it look like you have a personal cameraman following you through markets!',
    rating: 4.8,
    memberDiscountEligible: true,
    memberDiscountPercent: 12,
  },
  {
    id: '8',
    name: 'Mi 20000mAh 18W Fast Charging Power Bank 3i',
    slug: 'mi-20000mah-fast-charging-power-bank',
    description: 'High-capacity 20,000mAh dual input/triple output fast power bank with advanced 12-layer circuit protection.',
    shortDescription: 'Essential heavy duty battery backup for full-day field vlogs.',
    image: 'https://images.unsplash.com/photo-1609592424368-809e08399587?w=800',
    category: 'Accessories',
    type: 'PHYSICAL',
    brand: 'Xiaomi',
    price: 2199,
    currency: 'INR',
    officialUrl: 'https://mi.com/in',
    amazonUrl: 'https://amazon.in',
    featured: false,
    active: true,
    creatorNote: 'I never leave on a multi-stall midnight food crawl without this. Powers both my camera batteries and phone all night.',
    rating: 4.9,
  },
];

const MOCK_CATEGORIES: ProductCategory[] = [
  { id: '1', name: 'Cameras', slug: 'cameras', icon: 'camera' },
  { id: '2', name: 'Audio', slug: 'audio', icon: 'mic' },
  { id: '3', name: 'Accessories', slug: 'accessories', icon: 'tool' },
  { id: '4', name: 'Kitchen & Cooking', slug: 'kitchen-cooking', icon: 'coffee' },
  { id: '5', name: 'Travel Gear', slug: 'travel-gear', icon: 'briefcase' },
];

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private readonly SHEET = 'Products';
  private readonly CAT_SHEET = 'ProductCategories';
  private readonly USE_MOCK = !environment.sheetdbUrl.includes('sheetdb.io/api/v1/YOUR') === false;

  constructor(private client: SheetdbClientService) {}

  getAll(): Observable<Product[]> {
    // Using mock data
    return of(MOCK_PRODUCTS.filter(p => p.active));
  }

  getFeatured(): Observable<Product[]> {
    return of(MOCK_PRODUCTS.filter(p => p.featured && p.active));
  }

  getBySlug(slug: string): Observable<Product | null> {
    return of(MOCK_PRODUCTS.find(p => p.slug === slug) || null);
  }

  getByCategory(category: string): Observable<Product[]> {
    return of(MOCK_PRODUCTS.filter(p => p.category === category && p.active));
  }

  getCategories(): Observable<ProductCategory[]> {
    return of(MOCK_CATEGORIES);
  }

  create(product: Partial<Product>): Observable<any> {
    return this.client.create<Product>(this.SHEET, { ...product, createdAt: new Date().toISOString() });
  }

  update(slug: string, data: Partial<Product>): Observable<any> {
    return this.client.update<Product>(this.SHEET, 'slug', slug, { ...data, updatedAt: new Date().toISOString() });
  }

  archive(slug: string): Observable<any> {
    return this.client.update<Product>(this.SHEET, 'slug', slug, { active: false, updatedAt: new Date().toISOString() });
  }
}
