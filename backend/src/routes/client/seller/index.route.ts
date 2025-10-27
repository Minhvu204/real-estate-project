import express from "express";
import propertiesRoutes from "./properties.route";

const router = express.Router();

router.use("/properties", propertiesRoutes);

export default router;
