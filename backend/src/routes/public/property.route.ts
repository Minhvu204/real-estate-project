import express from "express";
import { getAllProperties } from "../../controllers/public/property.controller";

const router = express.Router();

router.get("/properties", getAllProperties);

export default router;
