import express from "express";
import propertyRoutes from "./property.route";
import taxonomyRoutes from "./taxonomy.route";

const router = express.Router();

router.use("/", propertyRoutes);
router.use("/taxonomy", taxonomyRoutes);

export default router;