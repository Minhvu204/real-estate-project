import express from "express";
import assignmentRoutes from './assignment.route';
import offerRoutes from "./offer.route";

const router = express.Router();

router.use("/assignments", assignmentRoutes);
router.use("/offers", offerRoutes);

export default router;
