import type { User, UpdateProfileDto, ChangePasswordDto } from '../types/User';
import { mockUser } from '../data/mockUser';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const UserService = {
  getProfile: async (): Promise<User> => {
    await delay(500);
    const { password, ...userWithoutPassword } = mockUser;
    return userWithoutPassword as User;
  },

  updateProfile: async (data: UpdateProfileDto): Promise<User> => {
    await delay(800);
    Object.assign(mockUser, data);
    const { password, ...userWithoutPassword } = mockUser;
    return userWithoutPassword as User;
  },
  
  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await delay(500);
    if (!mockUser.password || data.currentPassword !== mockUser.password) {
      throw new Error("Current password is incorrect");
    }
    if (data.newPassword !== data.confirmPassword) {
      throw new Error("Confirmation password does not match");
    }
    mockUser.password = data.newPassword;
    console.log("✅ Password changed successfully! New password:", mockUser.password);
  }
};