import express from "express";
import propertyRoutes from "./property.route";

const router = express.Router();

router.use("/", propertyRoutes);

export default router;