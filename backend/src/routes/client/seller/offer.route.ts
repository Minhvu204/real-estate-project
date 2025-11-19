import express from "express";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import { getMyOffers, acceptOffer, rejectOffer } from "../../../controllers/client/seller/offer.controller";

const router = express.Router();

router.get("/", verifyToken, roleCheck("seller"), getMyOffers);
router.patch("/:id/accept", verifyToken, roleCheck("seller"), acceptOffer);
router.patch("/:id/reject", verifyToken, roleCheck("seller"), rejectOffer);

export default router;
