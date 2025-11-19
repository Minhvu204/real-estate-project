import express from "express";
import assignmentRoutes from "./assignment.route";
import contractRoutes from "./contract.route";
import offerRoutes from "./offer.route";
import dealRoutes from "./deal.route";
import appointmentRoutes from "./appointment.route";

const router = express.Router();

router.use("/assignments", assignmentRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/", contractRoutes);

export default router;
