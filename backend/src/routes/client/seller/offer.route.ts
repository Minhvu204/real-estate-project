import express from "express";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import { getOfferById } from "../../../controllers/client/seller/offer.controller";

const router = express.Router();

router.get("/:id", verifyToken, roleCheck("seller"), getOfferById);

export default router;

