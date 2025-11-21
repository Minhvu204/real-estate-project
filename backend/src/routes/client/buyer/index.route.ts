import express from "express";
import appointmentRoutes from "./appointment.route";
import contractRoutes from "./contract.route";
import favoriteRoutes from "./favorite.route";
import offersRoutes from "./offer.route";
import reviewRoutes from "./review.route";
import paymentRoutes from "./payment.route";

const router = express.Router();

router.use("/appointments", appointmentRoutes);
router.use("/", contractRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/offers", offersRoutes);
router.use("/reviews", reviewRoutes);
router.use("/payments", paymentRoutes);

export default router;
