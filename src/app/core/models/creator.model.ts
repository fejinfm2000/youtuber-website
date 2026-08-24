export interface Creator {
  id: string;
  name: string;
  username: string;
  displayName: string;
  bio: string;
  shortBio: string;
  profileImage: string;
  heroImage?: string;
  youtubeChannelId: string;
  youtubeUrl: string;
  subscriberCount: string;
  videoCount: string;
  location?: string;
  email?: string;
  website?: string;
  active: boolean;
}

export interface CreatorSettings {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta1Text: string;
  heroCta1Url: string;
  heroCta2Text: string;
  heroCta2Url: string;
  footerText: string;
  copyright: string;
  accentColor?: string;
  showSubscriberCount: boolean;
  showVideoCount: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string;
  displayOrder: number;
  active: boolean;
}
