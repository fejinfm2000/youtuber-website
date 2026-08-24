import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Creator, CreatorSettings, SocialLink } from '../../models/creator.model';
import { SheetdbClientService } from './sheetdb-client.service';
import { map } from 'rxjs/operators';

const MOCK_CREATOR: Creator = {
  id: '1',
  name: 'Alex Creator',
  username: 'alexcreator',
  displayName: 'Alex Creator',
  bio: 'I create videos about technology, AI, and software development. Helping developers and creators level up their skills and workflows.',
  shortBio: 'Tech, AI & Software creator. 2.4M subscribers.',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  heroImage: '/assets/hero-bg.jpg',
  youtubeChannelId: 'UC_CHANNEL_ID',
  youtubeUrl: 'https://youtube.com/@alexcreator',
  subscriberCount: '2.4M',
  videoCount: '850+',
  location: 'Bangalore, India',
  website: 'https://alexcreator.com',
  active: true,
};

const MOCK_SETTINGS: CreatorSettings = {
  id: '1',
  heroTitle: 'I Create Content About Technology, AI & Software',
  heroSubtitle: 'Join 2.4M+ subscribers learning to build, ship, and grow in the age of AI.',
  heroCta1Text: 'Watch Latest Video',
  heroCta1Url: '/videos',
  heroCta2Text: 'My Recommendations',
  heroCta2Url: '/products',
  footerText: 'Helping developers and creators build the future.',
  copyright: `© ${new Date().getFullYear()} Alex Creator. All rights reserved.`,
  showSubscriberCount: true,
  showVideoCount: true,
};

const MOCK_SOCIAL_LINKS: SocialLink[] = [
  { id: '1', platform: 'YouTube', label: 'YouTube', url: 'https://youtube.com/@alexcreator', icon: 'youtube', displayOrder: 1, active: true },
  { id: '2', platform: 'Instagram', label: 'Instagram', url: 'https://instagram.com/alexcreator', icon: 'instagram', displayOrder: 2, active: true },
  { id: '3', platform: 'X', label: 'X / Twitter', url: 'https://x.com/alexcreator', icon: 'twitter', displayOrder: 3, active: true },
  { id: '4', platform: 'LinkedIn', label: 'LinkedIn', url: 'https://linkedin.com/in/alexcreator', icon: 'linkedin', displayOrder: 4, active: true },
  { id: '5', platform: 'GitHub', label: 'GitHub', url: 'https://github.com/alexcreator', icon: 'github', displayOrder: 5, active: true },
];

@Injectable({ providedIn: 'root' })
export class CreatorApiService {
  constructor(private client: SheetdbClientService) {}

  getCreator(): Observable<Creator> {
    return of(MOCK_CREATOR);
  }

  getSettings(): Observable<CreatorSettings> {
    return of(MOCK_SETTINGS);
  }

  getSocialLinks(): Observable<SocialLink[]> {
    return of(MOCK_SOCIAL_LINKS.filter(l => l.active).sort((a, b) => a.displayOrder - b.displayOrder));
  }

  updateCreator(data: Partial<Creator>): Observable<any> {
    return this.client.update<Creator>('Creator', 'id', '1', data);
  }

  updateSettings(data: Partial<CreatorSettings>): Observable<any> {
    return this.client.update<CreatorSettings>('CreatorSettings', 'id', '1', data);
  }
}
