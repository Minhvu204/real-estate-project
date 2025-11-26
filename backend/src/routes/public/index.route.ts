import express from "express";
import propertyRoutes from "./property.route";
import taxonomyRoutes from "./taxonomy.route";
import webhookRoutes from "./webhook.route";

const router = express.Router();

router.use("/", propertyRoutes);
router.use("/taxonomy", taxonomyRoutes);
router.use("/webhook", webhookRoutes);

export default router;