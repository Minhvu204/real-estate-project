import express from "express";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import { getOfferById } from "../../../controllers/client/agent/offer.controller";

const router = express.Router();

router.get("/:id", verifyToken, roleCheck("agent"), getOfferById);

export default router;

