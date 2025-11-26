// src/services/auth.service.ts
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../config/jwt.config";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER
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

  const payload = { id: newUser._id, role: newUser.role, email: newUser.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
    },
  };
};

// LOGIN
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email không tồn tại");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Mật khẩu không chính xác");


  if (!user.isVerified) {
    const err = new Error("Vui lòng xác thực email trước khi đăng nhập");
    (err as any).requiresVerification = true;
    (err as any).userId = (user!._id as any).toString();
    throw err;
  }

  const payload = { id: user._id, role: user.role, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};

// GOOGLE LOGIN (verify idToken and create user if not exists)
export const loginWithGoogle = async (googleIdToken: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: googleIdToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) throw new Error("Xác thực Google thất bại");

  const { email, name, picture, given_name, family_name } = payload as any;
  const fullName = name || [given_name, family_name].filter(Boolean).join(" ") || "Người dùng Google";

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

  const tokenPayload = { id: user._id, role: user.role, email: user.email };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  };
};
