import express from "express";
import appointmentRoutes from "./appointment.route";

const router = express.Router();

router.use("/appointments", appointmentRoutes);

export default router;
