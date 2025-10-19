import express from "express";
import { getProfile, updateProfile } from "../../../controllers/client/common/user.controller";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { body } from "express-validator";
import { upload } from "../../../middlewares/uploadCloundinary.middleware";


const router = express.Router();

// GET profile
router.get("/profile", verifyToken, getProfile);

// PUT update profile (có thể upload avatar)
router.put(
  "/profile",
  verifyToken,
  upload, // middleware Cloudinary, nếu có file avatar
  [
    body("fullName").optional().isLength({ min: 2 }).withMessage("FullName ít nhất 2 ký tự"),
    body("phone").optional().isMobilePhone("vi-VN").withMessage("Phone không hợp lệ"),
    body("avatar").optional().isURL().withMessage("Avatar phải là URL")
  ],
  updateProfile
);

export default router;
