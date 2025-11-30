import express from "express";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import {
  createReview,
  getMyReviews,
  updateMyReview,
  deleteMyReview,
} from "../../../controllers/client/buyer/review.controller";

const router = express.Router();

router.post("/", verifyToken, roleCheck("buyer"), createReview);
router.get("/", verifyToken, roleCheck("buyer"), getMyReviews);
router.patch("/:id", verifyToken, roleCheck("buyer"), updateMyReview);
router.delete("/:id", verifyToken, roleCheck("buyer"), deleteMyReview);

export default router;

