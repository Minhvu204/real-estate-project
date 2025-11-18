import express from "express";
import appointmentRoutes from "./appointment.route";
import testRoutes from "./buyer.route";
import offerRoutes from "./offer.route";

const router = express.Router();

router.use("/", testRoutes);
router.use("/offers", offerRoutes);
router.use("/appointments", appointmentRoutes);

export default router;
