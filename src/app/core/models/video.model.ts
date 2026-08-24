export interface Video {
  id: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  thumbnail: string;
  category: string;
  categoryId?: string;
  tags?: string[];
  publishedAt: string;
  duration?: string;
  viewCount?: number;
  likeCount?: number;
  featured: boolean;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  creatorId?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VideoCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface VideoTag {
  id: string;
  name: string;
  slug: string;
}
