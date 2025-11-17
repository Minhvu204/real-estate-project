import express from "express";
import assignmentRoutes from "./assignment.route";
import contractRoutes from "./contract.route";
import offerRoutes from "./offer.route";
import dealRoutes from "./deal.route";

const router = express.Router();

router.use("/assignments", assignmentRoutes);
router.use("/contracts", contractRoutes);
router.use("/offers", offerRoutes);
router.use("/deals", dealRoutes);

export default router;
