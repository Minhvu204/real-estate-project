import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.middleware";
import { roleCheck } from "../../middlewares/roleCheck.middleware";
import {
  getAdminSummary,
  getRevenueChart,
  getTopAgents,
} from "../../controllers/admin/report.controller";

const router = Router();

// Summary
router.get(
  "/summary",
  verifyToken,
  roleCheck("admin"),
  getAdminSummary
);

// Revenue chart
router.get(
  "/revenue-chart",
  verifyToken,
  roleCheck("admin"),
  getRevenueChart
);

// Top agents
router.get(
  "/top-agents",
  verifyToken,
  roleCheck("admin"),
  getTopAgents
);

export default router;
