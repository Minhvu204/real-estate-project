import express from "express";
import testRoutes from './buyer.route';

const router = express.Router();

router.use("/", testRoutes);


export default router;
