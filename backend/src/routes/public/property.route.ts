import express from "express";
import { getAllProperties, getPropertyById } from "../../controllers/public/property.controller";

const router = express.Router();

router.get("/properties", getAllProperties);
router.get("/properties/:id", getPropertyById);

export default router;
