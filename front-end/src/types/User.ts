export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  province?: string;
  district?: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  province?: string;
  district?: string;
  avatar?: File;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}