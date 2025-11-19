import express from "express";
import appointmentRoutes from "./appointment.route";
import contractRoutes from "./contract.route";

const router = express.Router();

router.use("/appointments", appointmentRoutes);
router.use("/", contractRoutes);

export default router;
