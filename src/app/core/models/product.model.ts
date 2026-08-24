export type ProductType =
  | 'PHYSICAL'
  | 'SOFTWARE'
  | 'COURSE'
  | 'BOOK'
  | 'DIGITAL_PRODUCT'
  | 'SERVICE'
  | 'SUBSCRIPTION'
  | 'CREATOR_PRODUCT'
  | 'OTHER';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  image: string;
  category: string;
  categoryId?: string;
  type: ProductType;
  brand?: string;
  price?: number;
  currency?: string;
  officialUrl?: string;
  affiliateUrl?: string;
  amazonUrl?: string;
  flipkartUrl?: string;
  featured: boolean;
  active: boolean;
  creatorNote?: string;
  rating?: number;
  memberDiscountEligible?: boolean;
  memberDiscountPercent?: number;
  memberDiscountCode?: string;
  creatorId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}
