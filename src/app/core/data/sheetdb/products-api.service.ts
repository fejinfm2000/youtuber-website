import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SheetdbClientService } from './sheetdb-client.service';
import { Product, ProductCategory } from '../../models/product.model';
import { environment } from '../../../../environments/environment';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Sony ZV-E10 Camera',
    slug: 'sony-zv-e10-camera',
    description: 'The perfect mirrorless camera for YouTube creators. Excellent autofocus, great video quality.',
    shortDescription: 'Perfect mirrorless camera for content creation.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    category: 'Camera',
    type: 'PHYSICAL',
    brand: 'Sony',
    price: 64999,
    currency: 'INR',
    officialUrl: 'https://www.sony.co.in',
    amazonUrl: 'https://amazon.in',
    featured: true,
    active: true,
    creatorNote: 'This is the camera I use for all my videos. The autofocus is insane for the price.',
    rating: 4.8,
    memberDiscountEligible: true,
    memberDiscountPercent: 10,
  },
  {
    id: '2',
    name: 'Rode NT-USB Microphone',
    slug: 'rode-nt-usb-microphone',
    description: 'Studio-quality USB microphone perfect for podcasting, YouTube, and streaming.',
    shortDescription: 'Studio-quality USB mic for creators.',
    image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=800',
    category: 'Audio',
    type: 'PHYSICAL',
    brand: 'Rode',
    price: 12500,
    currency: 'INR',
    officialUrl: 'https://www.rode.com',
    amazonUrl: 'https://amazon.in',
    featured: true,
    active: true,
    creatorNote: 'My go-to mic for recording voiceovers and tutorials. Crystal clear audio.',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Notion',
    slug: 'notion-productivity',
    description: 'The all-in-one workspace for your notes, tasks, wikis, and databases.',
    shortDescription: 'All-in-one workspace for productivity.',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
    category: 'Software',
    type: 'SOFTWARE',
    brand: 'Notion',
    price: 0,
    currency: 'USD',
    officialUrl: 'https://notion.so',
    affiliateUrl: 'https://notion.so/ref/alexcreator',
    featured: false,
    active: true,
    creatorNote: 'I plan all my videos in Notion. The free plan is more than enough to get started.',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Elgato Key Light',
    slug: 'elgato-key-light',
    description: 'Professional studio light with 2800 lumens, color temperature control and smart home integration.',
    shortDescription: 'Pro studio light for perfect lighting.',
    image: 'https://images.unsplash.com/photo-1565765943832-a0c53b01f95c?w=800',
    category: 'Lighting',
    type: 'PHYSICAL',
    brand: 'Elgato',
    price: 18999,
    currency: 'INR',
    officialUrl: 'https://www.elgato.com',
    amazonUrl: 'https://amazon.in',
    featured: false,
    active: true,
    creatorNote: 'Game changer for video quality. Natural-looking light that flatters every shot.',
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Cursor AI Editor',
    slug: 'cursor-ai-editor',
    description: 'The AI-first code editor built for pair programming with AI.',
    shortDescription: 'AI-powered code editor that boosts productivity.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    category: 'Development Tools',
    type: 'SOFTWARE',
    brand: 'Anysphere',
    price: 2000,
    currency: 'INR',
    officialUrl: 'https://cursor.sh',
    affiliateUrl: 'https://cursor.sh?ref=alexcreator',
    featured: false,
    active: true,
    creatorNote: 'I switched from VS Code and never looked back. 10x faster with AI assistance.',
    rating: 4.8,
  },
  {
    id: '6',
    name: 'MacBook Pro M4',
    slug: 'macbook-pro-m4',
    description: 'The most powerful MacBook ever. Handles 4K editing, AI workloads, and coding without breaking a sweat.',
    shortDescription: 'The most powerful laptop for creators.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    category: 'Laptop',
    type: 'PHYSICAL',
    brand: 'Apple',
    price: 189900,
    currency: 'INR',
    officialUrl: 'https://apple.com',
    amazonUrl: 'https://amazon.in',
    featured: false,
    active: true,
    creatorNote: 'My main machine. The battery life alone makes it worth every rupee.',
    rating: 4.9,
    memberDiscountEligible: false,
  },
];

const MOCK_CATEGORIES: ProductCategory[] = [
  { id: '1', name: 'Camera', slug: 'camera', icon: 'camera' },
  { id: '2', name: 'Audio', slug: 'audio', icon: 'mic' },
  { id: '3', name: 'Lighting', slug: 'lighting', icon: 'sun' },
  { id: '4', name: 'Laptop', slug: 'laptop', icon: 'laptop' },
  { id: '5', name: 'Software', slug: 'software', icon: 'code' },
  { id: '6', name: 'Development Tools', slug: 'dev-tools', icon: 'terminal' },
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
