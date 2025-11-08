import express from "express";
import profileRoutes from "./profile.route";
import propertiesRoutes from "./properties.route";
import notificationRoutes from "./notification.route";

const router = express.Router();

router.use("/profile", profileRoutes);
router.use("/properties", propertiesRoutes);
router.use("/notifications", notificationRoutes);

export default router;
