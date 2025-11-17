import express from "express";
import propertiesRoutes from "./properties.route";
import agentRoutes from "./agentList.route";
import assignmentRoutes from './assignment.route';
import taxonomyRoutes from './taxonomy.route';
import offerRoutes from "./offer.route";

const router = express.Router();

router.use("/properties", propertiesRoutes);
router.use("/agents", agentRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/taxonomies", taxonomyRoutes);
router.use("/offers", offerRoutes);

export default router;
