import express from "express";
import profileRoutes from "./profile.route";
import propertiesRoutes from "./properties.route";

const router = express.Router();

router.use("/profile", profileRoutes);
router.use("/properties", propertiesRoutes);

export default router;
