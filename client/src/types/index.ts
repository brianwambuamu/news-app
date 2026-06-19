export type UserRole = 'admin' | 'reporter';

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  body: string;
  category: string;
  imageUrl: string | null;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export const NEWS_CATEGORIES = [
  'politics',
  'sports',
  'entertainment',
  'business',
  'technology',
  'health',
  'other',
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];
