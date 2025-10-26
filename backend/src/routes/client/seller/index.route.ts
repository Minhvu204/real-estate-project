import express from "express";
import propertiesRoutes from "./properties.route";
import agentRoutes from "./agentList.route";

const router = express.Router();

router.use("/properties", propertiesRoutes);
router.use("/agents", agentRoutes);

export default router;
