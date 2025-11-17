import express from "express";
import assignmentRoutes from "./assignment.route";
import contractRoutes from "./contract.route";
import offerRoutes from "./offer.route";

const router = express.Router();

router.use("/assignments", assignmentRoutes);
router.use("/", contractRoutes);
router.use("/offers", offerRoutes);

export default router;
