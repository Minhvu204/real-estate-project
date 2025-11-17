import express from "express";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import { getMyOffers, forwardOffer } from "../../../controllers/client/agent/offer.controller";

const router = express.Router();

router.get("/", verifyToken, roleCheck("agent"), getMyOffers);
router.patch("/:id/forward", verifyToken, roleCheck("agent"), forwardOffer);

export default router;