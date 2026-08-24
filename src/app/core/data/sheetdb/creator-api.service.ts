import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Creator, CreatorSettings, SocialLink } from '../../models/creator.model';
import { SheetdbClientService } from './sheetdb-client.service';
import { map } from 'rxjs/operators';

const MOCK_CREATOR: Creator = {
  id: '1',
  name: 'Pirai Adhi',
  username: 'piraiadhi',
  displayName: 'Pirai Adhi - The Explorer',
  bio: 'Food explorer, traditional cuisine enthusiast, and travel vlogger. Journeying through vibrant street foods, traditional kitchen recipes, hidden cultural trails, and authentic local experiences.',
  shortBio: 'Food, Travel & Lifestyle Explorer. Uncovering authentic tastes & stories.',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  heroImage: '/assets/hero-bg.jpg',
  youtubeChannelId: '@PiraiAdhi',
  youtubeUrl: 'https://youtube.com/@PiraiAdhi',
  subscriberCount: '150K+',
  videoCount: '280+',
  location: 'Tamil Nadu, India',
  website: 'https://youtube.com/@PiraiAdhi',
  active: true,
};

const MOCK_SETTINGS: CreatorSettings = {
  id: '1',
  heroTitle: 'Exploring Authentic Flavors, Street Food & Travel Stories',
  heroSubtitle: 'Join 150K+ food & travel enthusiasts discovering local delicacies, secret recipes, and hidden culture.',
  heroCta1Text: 'Watch Latest Explorations',
  heroCta1Url: '/videos',
  heroCta2Text: 'Explorer Gear & Essentials',
  heroCta2Url: '/products',
  footerText: 'Uncovering authentic tastes, cultures, and adventures across India.',
  copyright: `© ${new Date().getFullYear()} Pirai Adhi - The Explorer. All rights reserved.`,
  showSubscriberCount: true,
  showVideoCount: true,
};

const MOCK_SOCIAL_LINKS: SocialLink[] = [
  { id: '1', platform: 'YouTube', label: 'YouTube (@PiraiAdhi)', url: 'https://youtube.com/@PiraiAdhi', icon: 'youtube', displayOrder: 1, active: true },
  { id: '2', platform: 'Instagram', label: 'Instagram (@pirai_adhi_the_explorer)', url: 'https://instagram.com/pirai_adhi_the_explorer', icon: 'instagram', displayOrder: 2, active: true },
  { id: '3', platform: 'Facebook', label: 'Facebook (Pirai Adhi Vlogs)', url: 'https://www.facebook.com/people/Pirai-Adhi-Vlogs/61556637380183/', icon: 'facebook', displayOrder: 3, active: true },
  { id: '4', platform: 'X', label: 'X / Twitter', url: 'https://x.com/piraiadhi', icon: 'twitter', displayOrder: 4, active: true },
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
