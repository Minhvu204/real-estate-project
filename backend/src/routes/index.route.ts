import express from "express";
import adminRoutes from "./admin/index.route";
import clientRoutes from "./client/index.route";
import publicRoutes from "./public/index.route";
import reviewRoutes from "./admin/review.route";
const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/client", clientRoutes);
router.use("/public", publicRoutes);
router.use("/admin/reviews", reviewRoutes);

export default router;
