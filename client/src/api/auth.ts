import { api } from './client';
import { PublicUser } from '../types';

export async function loginRequest(email: string, password: string) {
  const res = await api.post<{ user: PublicUser }>('/auth/login', { email, password });
  return res.data.user;
}

export async function logoutRequest() {
  await api.post('/auth/logout');
}

export async function getMeRequest() {
  const res = await api.get<{ user: PublicUser }>('/auth/me');
  return res.data.user;
}

export async function changePasswordRequest(currentPassword: string, newPassword: string) {
  const res = await api.put<{ message: string }>('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return res.data.message;
}
