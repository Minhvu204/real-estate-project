import express from "express";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import {
  removeAgentFromProperty,
} from "../../../controllers/client/seller/property.controller";
import { createAssignmentRequest } from "../../../controllers/client/seller/assignment.controller";


const router = express.Router();

// Seller gán agent cho property
router.post(
  "/:id/assign-agent",
  verifyToken,
  roleCheck("seller"),
  createAssignmentRequest
);

// Seller huỷ gán
router.patch(
  "/:id/remove-agent",
  verifyToken,
  roleCheck("seller"),
  removeAgentFromProperty
);

export default router;