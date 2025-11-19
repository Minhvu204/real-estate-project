// src/controllers/client/auth/auth.controller.ts
import { Request, Response } from "express";
import { loginUser, loginWithGoogle, registerUser } from "../../../services/auth.service";
import { successResponse, errorResponse } from "../../../utils/responseHandler";
import { validateEmail, validatePassword } from "../../../utils/validation";
import { setAuthCookie, clearAuthCookie } from "../../../utils/authCookie";
import { verifyRefreshToken, generateAccessToken } from "../../../config/jwt.config";

// REGISTER
export const registerController = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password)
      return errorResponse(req, res, "Thiếu thông tin bắt buộc", 400);

    if (!validateEmail(email)) return errorResponse(req, res, "Email không hợp lệ", 400);
    if (!validatePassword(password)) return errorResponse(req, res, "Mật khẩu phải ít nhất 6 ký tự", 400);

    const result = await registerUser({ fullName, email, password, role });

    // Set refresh token cookie
    setAuthCookie(res, result.refreshToken);

    // Return access token + user
    return successResponse(req, res, "Đăng ký thành công", {
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error: any) {
    return errorResponse(req, res, error.message);
  }
};

// LOGIN
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    // Set refresh token cookie
    setAuthCookie(res, result.refreshToken);

    // Return access token + user
    return successResponse(req, res, "Đăng nhập thành công", {
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error: any) {
    return errorResponse(req, res, error.message);
  }
};

// REFRESH
export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) return errorResponse(req, res, "Không có refresh token", 401);

    const decoded = verifyRefreshToken(refreshToken) as any;
    const newAccessToken = generateAccessToken({ id: decoded.id, role: decoded.role, email: decoded.email });

    return successResponse(req, res, "Lấy Access Token mới thành công", { accessToken: newAccessToken });
  } catch (error: any) {
    return errorResponse(req, res, "Refresh token không hợp lệ hoặc đã hết hạn", 401);
  }
};

// GOOGLE LOGIN
export const googleAuthController = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return errorResponse(req, res, "Missing Google token");

    const result = await loginWithGoogle(idToken);

    setAuthCookie(res, result.refreshToken);

    return successResponse(req, res, "Đăng nhập bằng Google thành công", {
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error: any) {
    return errorResponse(req, res, error.message);
  }
};

// LOGOUT
export const logoutController = async (req: Request, res: Response) => {
  clearAuthCookie(res);
  return successResponse(req, res, "Đăng xuất thành công");
};
