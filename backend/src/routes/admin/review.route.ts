import express from "express";
import {
  listReviews,
  approveReview,
  rejectReview,
  hideReview,
  unhideReview,
  deleteReview,
} from "../../controllers/admin/review.controller";

import { verifyToken } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/", verifyToken, listReviews);
router.patch("/:id/approve", verifyToken, approveReview);
router.patch("/:id/reject", verifyToken, rejectReview);
router.patch("/:id/hide", verifyToken, hideReview);
router.patch("/:id/unhide", verifyToken, unhideReview);
router.delete("/:id", verifyToken, deleteReview);

export default router;
