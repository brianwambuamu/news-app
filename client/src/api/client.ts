import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export interface ApiErrorResponse {
  message: string;
}

/** Extracts a human-readable error message from an Axios error. */
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorResponse | undefined;
    if (data?.message) return data.message;
    if (err.message) return err.message;
  }
  return 'Something went wrong. Please try again.';
}
