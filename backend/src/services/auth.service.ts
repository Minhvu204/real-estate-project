// src/services/auth.service.ts
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/jwt.config";
import { OAuth2Client } from "google-auth-library";

//register
export const registerUser = async (data: {
  fullName: string;
  email: string;
  password: string;
  role?: "buyer" | "seller" | "agent";
}) => {
  const { fullName, email, password, role } = data;

  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email đã được sử dụng");

  const newUser = new User({
    fullName,
    email,
    password,
    role: role || "buyer",
  });

  await newUser.save();

  const token = generateToken({ id: newUser._id, role: newUser.role });

  return {
    user: {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
    },
    token,
  };
};

//login
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email không tồn tại");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Mật khẩu không chính xác");
  }

  // Tạo JWT
  const token = generateToken({
    id: user._id,
    role: user.role,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Login bằng Google
export const loginWithGoogle = async (googleToken: string) => {
  // 1. Xác thực token từ Google
  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Xác thực Google thất bại");
  }
  const { email, name, picture, given_name, family_name } = payload;

  const fullName =
    name || [given_name, family_name].filter(Boolean).join(" ") || "Người dùng Google";

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({
      fullName, 
      email,
      password: Math.random().toString(36).slice(-8), // random password
      avatar: picture || "",
      role: "buyer",
    });
    await user.save();
  }
  // 2. Tạo JWT token
  const token = generateToken({
    id: user._id,
    role: user.role,
    email: user.email,
  });

  // 4. Trả về dữ liệu
  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  };
};
