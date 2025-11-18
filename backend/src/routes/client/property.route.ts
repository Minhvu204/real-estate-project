import express from "express";
import multer from "multer";
import { verifyToken } from "../../middlewares/auth.middleware";
import { roleCheck } from "../../middlewares/roleCheck.middleware";
import { uploadMultiple } from "../../middlewares/uploadCloundinary.middleware";
import { updateProperty, deleteProperty } from "../../controllers/client/property.controller";

const router = express.Router();

const uploadImages = multer().array("images", 10);

// PATCH /api/client/properties/:id (multipart nếu chỉnh ảnh)
router.patch(
  "/:id",
  verifyToken,
  roleCheck("seller", "agent"),
  uploadImages,
  uploadMultiple,
  updateProperty
);

// DELETE /api/client/properties/:id -> soft-delete
router.delete(
  "/:id",
  verifyToken,
  roleCheck("seller", "agent"),
  deleteProperty
);

export default router;


