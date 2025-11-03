// src/routes/client/seller/assignment.route.ts
import express from "express";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import { cancelAssignmentRequest } from "../../../controllers/client/seller/assignment.controller";

const router = express.Router();

//  Hủy yêu cầu khi đã gửi cho agent
router.patch("/:id/cancel", verifyToken, roleCheck("seller"), cancelAssignmentRequest);

export default router;
