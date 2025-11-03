import express from "express";
import userRoutes from "./user.route";
import propertyRoutes from "./property.route";
const router = express.Router();

router.use("/", userRoutes);
router.use("/properties", propertyRoutes);
export default router;
