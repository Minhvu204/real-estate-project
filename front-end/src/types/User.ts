export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  password?: string; 
}

export interface UpdateProfileDto {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  avatar?: File;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}