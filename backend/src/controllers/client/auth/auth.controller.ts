import { Request, Response } from "express";
import { loginUser, registerUser } from "../../../services/auth.service";
import { successResponse, errorResponse } from "../../../utils/responseHandler";
import { validateEmail, validatePassword } from "../../../utils/validation";

//register
export const registerController = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password)
      return errorResponse(res, "Thiếu thông tin bắt buộc", 400);

    if (!validateEmail(email))
      return errorResponse(res, "Email không hợp lệ", 400);

    if (!validatePassword(password))
      return errorResponse(res, "Mật khẩu phải ít nhất 6 ký tự", 400);

    const result = await registerUser({ fullName, email, password, role });
    return successResponse(res, "Đăng ký thành công", result);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

//login
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    if (result) {
      return successResponse(res, "Đăng nhập thành công", result);
    }
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};
