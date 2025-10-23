import User from "../../models/user.model";
import bcrypt from "bcryptjs";

export const userService = {
  // Lấy thông tin profile
  async getProfile(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }
    return user;
  },

  // Cập nhật thông tin profile
  async updateProfile(userId: string, data: { fullName?: string; phone?: string; avatar?: string }) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }

    return updatedUser;
  },

  // Đổi mật khẩu
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await User.findById(userId);
    if (!user) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      const err: any = new Error("Mật khẩu cũ không đúng");
      err.status = 400;
      throw err;
    }

    //Gán mật khẩu mới 
    user.password = newPassword;
    await user.save();

    return { message: "Đổi mật khẩu thành công" };
  },
};
