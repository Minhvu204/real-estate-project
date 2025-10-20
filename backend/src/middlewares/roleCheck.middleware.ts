// src/middlewares/roleCheck.middleware.ts
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: { role?: string };
}

export const roleCheck = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !roles.includes(user.role || "")) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
  };
};
