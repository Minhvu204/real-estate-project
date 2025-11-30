import express from "express";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import { listBuyerPurchasedProperties } from "../../../controllers/client/buyer/properties.controller";

const router = express.Router();

router.get("/", verifyToken, roleCheck("buyer"), listBuyerPurchasedProperties);

export default router;

