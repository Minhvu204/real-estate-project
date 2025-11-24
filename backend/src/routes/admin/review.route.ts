import express from "express";
import {
  listReviews,
  hideReview,
  unhideReview,
  deleteReview,
} from "../../controllers/admin/review.controller";

import { verifyToken } from "../../middlewares/auth.middleware";
import { roleCheck } from "../../middlewares/roleCheck.middleware";

const router = express.Router();

router.get("/", verifyToken, roleCheck("admin"), listReviews);

router.patch("/:id/hide", verifyToken, roleCheck("admin"), hideReview);

router.patch("/:id/unhide", verifyToken, roleCheck("admin"), unhideReview);

router.delete("/:id", verifyToken, roleCheck("admin"), deleteReview);

export default router;
