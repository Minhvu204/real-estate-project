import express from "express";
import assignmentRoutes from './assignment.route';

const router = express.Router();

router.use("/assignments", assignmentRoutes);


export default router;
