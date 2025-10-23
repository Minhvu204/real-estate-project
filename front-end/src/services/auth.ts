import { http } from './api';

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: number;
  password: string;
  role?: 'buyer' | 'seller' | 'agent' | 'admin';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface RegisterResult {
  user: {
    id: string;
    fullName: string;
    email: string;
    role?: string;
  };
  token?: string;
}

export async function register(payload: RegisterPayload) {
  return http<ApiResponse<RegisterResult>>('/client/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
