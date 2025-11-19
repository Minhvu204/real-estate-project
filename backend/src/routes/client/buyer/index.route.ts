import express from "express";
import appointmentRoutes from "./appointment.route";
import contractRoutes from "./contract.route";
import favoriteRoutes from "./favorite.route";
import offersRoutes from "./offer.route";

const router = express.Router();

router.use("/appointments", appointmentRoutes);
router.use("/", contractRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/offers", offersRoutes);

export default router;
