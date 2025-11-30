import { Router } from "express";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import { createEscrowPayment, getBuyerPayments, payosWebhook } from "../../../controllers/client/buyer/payment.controller";

const router = Router();

router.get("/", verifyToken, roleCheck("buyer"), getBuyerPayments);

// Buyer creates QR/payment
router.post("/create", verifyToken, roleCheck("buyer"), createEscrowPayment);

// webhook (public)
router.post("/webhook/payos", payosWebhook);


export default router;
