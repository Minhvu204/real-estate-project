import express from "express";
import appointmentRoutes from "./appointment.route";
import favoriteRoutes from "./favorite.route";
const router = express.Router();

router.use("/appointments", appointmentRoutes);
router.use("/favorites", favoriteRoutes);
export default router;
