import express from "express";
import propertiesRoutes from "./properties.route";
import agentRoutes from "./agentList.route";
import assignmentRoutes from './assignment.route';

const router = express.Router();

router.use("/properties", propertiesRoutes);
router.use("/agents", agentRoutes);
router.use("/assignments", assignmentRoutes);

export default router;
