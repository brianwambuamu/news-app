import { api } from './client';
import { PublicUser, UserRole } from '../types';

export async function listReportersRequest() {
  const res = await api.get<{ users: PublicUser[] }>('/users');
  return res.data.users;
}

export async function createUserRequest(name: string, email: string, role: UserRole = 'reporter') {
  const res = await api.post<{ user: PublicUser; warning?: string }>('/users', {
    name,
    email,
    role,
  });
  return res.data;
}

export async function terminateUserRequest(id: number) {
  const res = await api.patch<{ user: PublicUser }>(`/users/${id}/terminate`);
  return res.data.user;
}

export async function deleteUserRequest(id: number) {
  await api.delete(`/users/${id}`);
}
