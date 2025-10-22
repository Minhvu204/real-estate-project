import type { User, UpdateProfileDto, ChangePasswordDto } from '../types/User';
import { mockUser } from '../data/mockUser';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const UserService = {
  getProfile: async (): Promise<User> => {
    await delay(500); 
    return mockUser;
  },

  updateProfile: async (data: UpdateProfileDto): Promise<User> => {
    await delay(800);
    Object.assign(mockUser, data);
    return mockUser;
  },

  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await delay(500);
    if (data.currentPassword !== "password123") {
      throw new Error("Current password is incorrect");
    }
  }
};