import express from "express";
import appointmentRoutes from "./appointment.route";
import offerRoutes from "./offer.route";

const router = express.Router();

router.use("/appointments", appointmentRoutes);
router.use("/offers", offerRoutes);

export default router;
