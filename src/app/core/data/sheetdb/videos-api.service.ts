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
    title: 'Friday Night Unexpected Home-made Chicken Biriyani | Secret Spices & Woodfire Dum',
    slug: 'friday-night-unexpected-homemade-chicken-biriyani',
    description: 'An impromptu Friday night cooking adventure! Making rich, aromatic home-style chicken biriyani with freshly ground spices, slow dum cooking, and crispy fried onions.',
    shortDescription: 'Friday night spontaneous homemade chicken biriyani masterclass.',
    thumbnail: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop',
    category: 'Food & Recipes',
    tags: ['Biriyani', 'Chicken Biriyani', 'Home Cooking', 'Food Explorer'],
    publishedAt: '2026-08-18',
    duration: '18:45',
    viewCount: 185000,
    featured: true,
    status: 'PUBLISHED',
  },
  {
    id: '2',
    youtubeUrl: 'https://www.youtube.com/watch?v=abc123',
    youtubeVideoId: 'abc123',
    title: 'Exploring 24-Hour Midnight Street Food Market | Unlimited Tastes & Late-Night Stalls',
    slug: 'exploring-24h-midnight-street-food-market',
    description: 'Join me as we explore the bustling night food bazaar, tasting iconic piping-hot parottas, kothu, crispy dosa varieties, and refreshing midnight falooda.',
    shortDescription: 'Midnight street food exploration across iconic stalls.',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop',
    category: 'Street Food Trails',
    tags: ['Street Food', 'Night Market', 'Food Trail', 'Local Delicacies'],
    publishedAt: '2026-08-08',
    duration: '21:12',
    viewCount: 220000,
    featured: true,
    status: 'PUBLISHED',
  },
  {
    id: '3',
    youtubeUrl: 'https://www.youtube.com/watch?v=xyz789',
    youtubeVideoId: 'xyz789',
    title: 'Theme Restaurant Experience: Haunted Themed Dining & Honest Food Review',
    slug: 'theme-restaurant-haunted-dining-experience',
    description: 'We checked out a sensational spooky haunted theme restaurant! From the eerie dungeon interior to signature sizzling platters and mocktails — is it worth visiting?',
    shortDescription: 'Spooky themed restaurant experience and honest food review.',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
    category: 'Food & Recipes',
    tags: ['Theme Restaurant', 'Food Review', 'Dining Experience', 'Vlog'],
    publishedAt: '2026-07-30',
    duration: '15:20',
    viewCount: 145000,
    featured: false,
    status: 'PUBLISHED',
  },
  {
    id: '4',
    youtubeUrl: 'https://www.youtube.com/watch?v=lmn456',
    youtubeVideoId: 'lmn456',
    title: 'Kerala Trip Exploration: Tea Plantations, Waterfalls & Malabar Food Trail',
    slug: 'kerala-trip-tea-plantations-malabar-food-trail',
    description: 'A breathtaking road trip through the misty Western Ghats, visiting tea gardens, hidden streams, and savoring authentic Kerala appam, stew, and Malabar porotta.',
    shortDescription: 'Scenic Kerala road trip and authentic Malabar food trail.',
    thumbnail: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop',
    category: 'Travel & Exploration',
    tags: ['Kerala Trip', 'Travel Vlog', 'Malabar Food', 'Nature Trek'],
    publishedAt: '2026-07-20',
    duration: '26:40',
    viewCount: 295000,
    featured: true,
    status: 'PUBLISHED',
  },
  {
    id: '5',
    youtubeUrl: 'https://www.youtube.com/watch?v=pqr321',
    youtubeVideoId: 'pqr321',
    title: 'My Solo Vlogging & Travel Gear 2026: Cameras, Audio, and Mobile Rig',
    slug: 'solo-vlogging-travel-gear-2026',
    description: 'Full breakdown of the exact camera, wireless microphone, smartphone gimbal, and travel backpack I use for all my food vlogging and field exploration videos.',
    shortDescription: 'The ultimate solo creator & food vlogger gear guide.',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop',
    category: 'Creator & Vlog Gear',
    tags: ['Vlog Setup', 'Camera Gear', 'Microphones', 'Creator Tech'],
    publishedAt: '2026-07-05',
    duration: '14:50',
    viewCount: 92000,
    featured: false,
    status: 'PUBLISHED',
  },
  {
    id: '6',
    youtubeUrl: 'https://www.youtube.com/watch?v=stu654',
    youtubeVideoId: 'stu654',
    title: 'Top 5 Iconic Food Spots in Madurai: Bun Parotta, Kari Dosa & Famous Jigarthanda',
    slug: 'top-5-iconic-food-spots-madurai',
    description: 'An unforgettable culinary journey in the temple city of Madurai. We tasted legendary crispy bun parottas, piping mutton salna, fluffy kari dosas, and royal jigarthanda.',
    shortDescription: 'Ultimate Madurai food tour and culinary guide.',
    thumbnail: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop',
    category: 'Street Food Trails',
    tags: ['Madurai', 'Bun Parotta', 'Kari Dosa', 'Jigarthanda', 'Food Guide'],
    publishedAt: '2026-06-22',
    duration: '22:15',
    viewCount: 340000,
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
