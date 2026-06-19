import { api } from './client';
import { NewsArticle, NewsCategory } from '../types';

interface CreateNewsParams {
  title: string;
  body: string;
  category: NewsCategory;
  image?: File | null;
}

export async function createNewsRequest({ title, body, category, image }: CreateNewsParams) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('body', body);
  formData.append('category', category);
  if (image) formData.append('image', image);

  const res = await api.post<{ article: NewsArticle }>('/news', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.article;
}

export async function listNewsRequest(params?: { category?: string; mine?: boolean }) {
  const res = await api.get<{ articles: NewsArticle[] }>('/news', { params });
  return res.data.articles;
}

export async function deleteNewsRequest(id: number) {
  await api.delete(`/news/${id}`);
}
