export type UserRole = 'admin' | 'reporter';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
}

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
  image_path: string | null;
  author_id: number;
  created_at: string;
  updated_at: string;
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

export interface JwtPayload {
  userId: number;
  role: UserRole;
}
