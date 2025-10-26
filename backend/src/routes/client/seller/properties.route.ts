// src/routes/client/seller/properties.route.ts
import express from "express";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import {
  assignAgentToProperty,
  removeAgentFromProperty,
} from "../../../controllers/client/seller/property.controller";

const router = express.Router();

// Seller gán agent cho property
router.post(
  "/:id/assign-agent",
  verifyToken,
  roleCheck("seller"),
  assignAgentToProperty
);

// Seller huỷ gán
router.post(
  "/:id/remove-agent",
  verifyToken,
  roleCheck("seller"),
  removeAgentFromProperty
);

export default router;