import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SheetdbClientService } from './sheetdb-client.service';
import { Video, VideoCategory } from '../../models/video.model';

// Mock data for development (when SheetDB is not configured)
const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeVideoId: 'dQw4w9WgXcQ',
    title: 'Authentic Dindigul Thalappakatti Style Mutton Biriyani | Secret Spices & Full Recipe',
    slug: 'authentic-dindigul-mutton-biriyani-recipe',
    description: 'A step-by-step masterclass on making traditional seeraga samba mutton biriyani with aromatic freshly ground spices and authentic wood-fire techniques.',
    shortDescription: 'Master the authentic seeraga samba mutton biriyani.',
    thumbnail: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&fit=crop',
    category: 'Food & Recipes',
    tags: ['Biriyani', 'Traditional Cooking', 'Recipes', 'Food Explorer'],
    publishedAt: '2026-08-15',
    duration: '24:18',
    viewCount: 245000,
    featured: true,
    status: 'PUBLISHED',
  },
  {
    id: '2',
    youtubeUrl: 'https://www.youtube.com/watch?v=abc123',
    youtubeVideoId: 'abc123',
    title: 'Exploring 24-Hour Midnight Street Food Market | Unlimited Tastes & Hidden Stalls',
    slug: 'exploring-24h-midnight-street-food-market',
    description: 'Join me as we explore the bustling night food bazaar, tasting iconic parottas, kothu, dosa varieties, and local special drinks.',
    shortDescription: 'Midnight street food exploration across iconic stalls.',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&fit=crop',
    category: 'Street Food Trails',
    tags: ['Street Food', 'Night Market', 'Food Trail', 'Local Delicacies'],
    publishedAt: '2026-08-05',
    duration: '18:42',
    viewCount: 198000,
    featured: true,
    status: 'PUBLISHED',
  },
  {
    id: '3',
    youtubeUrl: 'https://www.youtube.com/watch?v=xyz789',
    youtubeVideoId: 'xyz789',
    title: 'Hidden Waterfall Trek & Forest Cooking Adventure | Village Style Spicy Chicken Gravy',
    slug: 'hidden-waterfall-trek-forest-village-chicken',
    description: 'Trekking deep into the lush Western Ghats trails to cook traditional country chicken curry alongside crystal clear river streams.',
    shortDescription: 'Forest trek, waterfall discovery, and outdoor village cooking.',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&fit=crop',
    category: 'Travel & Exploration',
    tags: ['Travel Vlog', 'Nature Trek', 'Village Cooking', 'Western Ghats'],
    publishedAt: '2026-07-28',
    duration: '22:15',
    viewCount: 162000,
    featured: false,
    status: 'PUBLISHED',
  },
  {
    id: '4',
    youtubeUrl: 'https://www.youtube.com/watch?v=lmn456',
    youtubeVideoId: 'lmn456',
    title: 'My Solo Vlogging Gear Setup 2026: Cameras, Audio, and Travel Essentials',
    slug: 'solo-vlogging-gear-setup-2026',
    description: 'A complete breakdown of the lightweight camera gear, wireless audio, stabilizers, and accessories I use for street food and travel vlogging.',
    shortDescription: 'Pro setup for solo travel & street food vloggers.',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&fit=crop',
    category: 'Creator & Vlog Gear',
    tags: ['Vlog Setup', 'Camera Gear', 'Microphones', 'Travel Gear'],
    publishedAt: '2026-07-14',
    duration: '16:50',
    viewCount: 88000,
    featured: false,
    status: 'PUBLISHED',
  },
  {
    id: '5',
    youtubeUrl: 'https://www.youtube.com/watch?v=pqr321',
    youtubeVideoId: 'pqr321',
    title: 'Exploring a 100-Year-Old Heritage Sweet Stall in Traditional Temple Town',
    slug: 'exploring-100-year-old-heritage-sweet-stall',
    description: 'Stepping into centuries-old traditions to taste authentic melt-in-mouth halwa and ghee delicacies made using ancient family secret recipes.',
    shortDescription: 'Heritage sweet stall review and cultural story.',
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&fit=crop',
    category: 'Food & Recipes',
    tags: ['Heritage Food', 'Traditional Sweets', 'Temple Town', 'Culture'],
    publishedAt: '2026-06-30',
    duration: '14:20',
    viewCount: 142000,
    featured: false,
    status: 'PUBLISHED',
  },
  {
    id: '6',
    youtubeUrl: 'https://www.youtube.com/watch?v=stu654',
    youtubeVideoId: 'stu654',
    title: 'Top 5 Hidden Food Spots in Madurai You Must Try Before You Die',
    slug: 'top-5-hidden-food-spots-madurai',
    description: 'From bun parotta to legendary jigarthanda and mutton chukka, here are the absolute top culinary gems in Madurai.',
    shortDescription: 'Ultimate Madurai food guide and culinary tour.',
    thumbnail: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&fit=crop',
    category: 'Street Food Trails',
    tags: ['Madurai', 'Bun Parotta', 'Street Food', 'Food Guide'],
    publishedAt: '2026-06-18',
    duration: '21:05',
    viewCount: 310000,
    featured: true,
    status: 'PUBLISHED',
  },
];

const MOCK_CATEGORIES: VideoCategory[] = [
  { id: '1', name: 'Food & Recipes', slug: 'food-recipes' },
  { id: '2', name: 'Street Food Trails', slug: 'street-food' },
  { id: '3', name: 'Travel & Exploration', slug: 'travel-exploration' },
  { id: '4', name: 'Creator & Vlog Gear', slug: 'creator-gear' },
];

@Injectable({ providedIn: 'root' })
export class VideosApiService {
  private readonly SHEET = 'Videos';
  private readonly CAT_SHEET = 'VideoCategories';
  private readonly USE_MOCK = !environment.sheetdbUrl.includes('sheetdb.io/api');

  constructor(private client: SheetdbClientService) {}

  getAll(): Observable<Video[]> {
    if (this.USE_MOCK) return of(MOCK_VIDEOS);
    return this.client.getAll<Video>(this.SHEET).pipe(
      map(videos => videos.filter(v => v.status === 'PUBLISHED'))
    );
  }

  getFeatured(): Observable<Video[]> {
    if (this.USE_MOCK) return of(MOCK_VIDEOS.filter(v => v.featured));
    return this.client.search<Video>(this.SHEET, 'featured', 'true');
  }

  getLatest(limit = 1): Observable<Video[]> {
    if (this.USE_MOCK) return of([...MOCK_VIDEOS].sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    ).slice(0, limit));
    return this.client.getAll<Video>(this.SHEET).pipe(
      map(videos => videos
        .filter(v => v.status === 'PUBLISHED')
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, limit)
      )
    );
  }

  getPopular(limit = 6): Observable<Video[]> {
    if (this.USE_MOCK) return of([...MOCK_VIDEOS].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, limit));
    return this.client.getAll<Video>(this.SHEET).pipe(
      map(videos => videos
        .filter(v => v.status === 'PUBLISHED')
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, limit)
      )
    );
  }

  getBySlug(slug: string): Observable<Video | null> {
    if (this.USE_MOCK) return of(MOCK_VIDEOS.find(v => v.slug === slug) || null);
    return this.client.search<Video>(this.SHEET, 'slug', slug).pipe(
      map(results => results[0] || null)
    );
  }

  getCategories(): Observable<VideoCategory[]> {
    if (this.USE_MOCK) return of(MOCK_CATEGORIES);
    return this.client.getAll<VideoCategory>(this.CAT_SHEET);
  }

  create(video: Partial<Video>): Observable<any> {
    return this.client.create<Video>(this.SHEET, { ...video, createdAt: new Date().toISOString() });
  }

  update(slug: string, data: Partial<Video>): Observable<any> {
    return this.client.update<Video>(this.SHEET, 'slug', slug, { ...data, updatedAt: new Date().toISOString() });
  }

  delete(slug: string): Observable<any> {
    return this.client.update<Video>(this.SHEET, 'slug', slug, { status: 'ARCHIVED', updatedAt: new Date().toISOString() });
  }
}

// Import at bottom to avoid circular reference
import { environment } from '../../../../environments/environment';
