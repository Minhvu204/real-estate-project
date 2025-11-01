import express from "express";
import multer from "multer";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import { updateProperty, deleteProperty } from "../../../controllers/client/common/property.controller";
import { uploadMultiple } from "../../../middlewares/uploadCloundinary.middleware";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("", verifyToken, roleCheck("seller","agent"), (req, res) => {
  res.json({ message: "Lấy danh sách properties" });
});

// PATCH /api/client/properties/:id (multipart nếu chỉnh ảnh)
router.patch(
  "/:id",
  verifyToken,
  roleCheck("seller", "agent"),
  upload.array("images", 10),
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
