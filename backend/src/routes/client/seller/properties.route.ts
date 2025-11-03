import express from "express";
import multer from "multer";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import {
  createProperty,
  removeAgentFromProperty,
} from "../../../controllers/client/seller/property.controller";
import { createAssignmentRequest } from "../../../controllers/client/seller/assignment.controller";
import { uploadMultipleToCloudinary } from "../../../middlewares/uploadMultipleToCloudinary.middleware";



const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


// Seller gui yêu cầu gán agent cho property
router.post(
  "/:id/assign-agent",
  verifyToken,
  roleCheck("seller"),
  createAssignmentRequest
);

// Seller huỷ gán agent khỏi property
router.patch(
  "/:id/remove-agent",
  verifyToken,
  roleCheck("seller"),
  removeAgentFromProperty
);

// Seller tạo bất động sản mới
router.post(
  "/create",
  verifyToken,
  roleCheck("seller", "agent"),
  upload.array("images", 10), 
  uploadMultipleToCloudinary, 
  createProperty
);



export default router;