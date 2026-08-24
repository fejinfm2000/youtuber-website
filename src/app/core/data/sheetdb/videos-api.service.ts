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
    title: 'How I Built an AI SaaS in 30 Days',
    slug: 'how-i-built-an-ai-saas-in-30-days',
    description: 'A deep dive into building a production-ready AI SaaS application from scratch using modern tools and frameworks.',
    shortDescription: 'Building a full AI SaaS from scratch in 30 days.',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    category: 'AI & Machine Learning',
    tags: ['AI', 'SaaS', 'Development'],
    publishedAt: '2026-08-01',
    duration: '28:45',
    viewCount: 124000,
    featured: true,
    status: 'PUBLISHED',
  },
  {
    id: '2',
    youtubeUrl: 'https://www.youtube.com/watch?v=abc123',
    youtubeVideoId: 'abc123',
    title: 'My Complete YouTube Studio Setup 2026',
    slug: 'youtube-studio-setup-2026',
    description: 'Everything you need to know about setting up a professional YouTube studio on any budget.',
    shortDescription: 'Pro YouTube studio setup guide for any budget.',
    thumbnail: 'https://img.youtube.com/vi/abc123/maxresdefault.jpg',
    category: 'Creator Gear',
    tags: ['Setup', 'Studio', 'Equipment'],
    publishedAt: '2026-07-20',
    duration: '22:10',
    viewCount: 87500,
    featured: false,
    status: 'PUBLISHED',
  },
  {
    id: '3',
    youtubeUrl: 'https://www.youtube.com/watch?v=xyz789',
    youtubeVideoId: 'xyz789',
    title: 'Top 10 AI Tools That Changed My Workflow',
    slug: 'top-10-ai-tools-workflow',
    description: 'I tested over 50 AI tools this year. These are the 10 that actually made a difference.',
    shortDescription: 'The 10 AI tools I use every day.',
    thumbnail: 'https://img.youtube.com/vi/xyz789/maxresdefault.jpg',
    category: 'AI & Machine Learning',
    tags: ['AI', 'Tools', 'Productivity'],
    publishedAt: '2026-07-10',
    duration: '18:32',
    viewCount: 215000,
    featured: true,
    status: 'PUBLISHED',
  },
  {
    id: '4',
    youtubeUrl: 'https://www.youtube.com/watch?v=lmn456',
    youtubeVideoId: 'lmn456',
    title: 'Angular 18 Complete Tutorial for Beginners',
    slug: 'angular-18-tutorial-beginners',
    description: 'Learn Angular 18 from scratch with practical examples and real-world projects.',
    shortDescription: 'Complete Angular 18 tutorial from zero to hero.',
    thumbnail: 'https://img.youtube.com/vi/lmn456/maxresdefault.jpg',
    category: 'Web Development',
    tags: ['Angular', 'TypeScript', 'Frontend'],
    publishedAt: '2026-06-28',
    duration: '1:45:20',
    viewCount: 340000,
    featured: false,
    status: 'PUBLISHED',
  },
  {
    id: '5',
    youtubeUrl: 'https://www.youtube.com/watch?v=pqr321',
    youtubeVideoId: 'pqr321',
    title: 'Best Microphone for YouTube Under ₹10,000',
    slug: 'best-microphone-youtube-under-10000',
    description: 'I tested 12 microphones under ₹10,000. Here are my honest results.',
    shortDescription: 'Best mics for YouTube at every budget.',
    thumbnail: 'https://img.youtube.com/vi/pqr321/maxresdefault.jpg',
    category: 'Creator Gear',
    tags: ['Microphone', 'Audio', 'Budget'],
    publishedAt: '2026-06-15',
    duration: '15:48',
    viewCount: 92000,
    featured: false,
    status: 'PUBLISHED',
  },
  {
    id: '6',
    youtubeUrl: 'https://www.youtube.com/watch?v=stu654',
    youtubeVideoId: 'stu654',
    title: 'Firebase vs Supabase — Which Should You Choose?',
    slug: 'firebase-vs-supabase-comparison',
    description: 'A comprehensive comparison of Firebase and Supabase for your next project.',
    shortDescription: 'Firebase vs Supabase — the definitive comparison.',
    thumbnail: 'https://img.youtube.com/vi/stu654/maxresdefault.jpg',
    category: 'Web Development',
    tags: ['Firebase', 'Supabase', 'Backend'],
    publishedAt: '2026-05-30',
    duration: '32:15',
    viewCount: 178000,
    featured: false,
    status: 'PUBLISHED',
  },
];

const MOCK_CATEGORIES: VideoCategory[] = [
  { id: '1', name: 'AI & Machine Learning', slug: 'ai-ml' },
  { id: '2', name: 'Web Development', slug: 'web-dev' },
  { id: '3', name: 'Creator Gear', slug: 'creator-gear' },
  { id: '4', name: 'Productivity', slug: 'productivity' },
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
