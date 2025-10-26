import express from "express";
import testRoutes from './agent.route';

const router = express.Router();

router.use("/", testRoutes);



export default router;
