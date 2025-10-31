// src/routes/client/agent/assignment.route.ts
import express from "express";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import { acceptRequest, listMyRequests, rejectRequest } from "../../../controllers/client/agent/assignment.controller";

const router = express.Router();

// Lấy danh sách yêu cầu gán (GET /agents/assignments?status=pending)
router.get("/", verifyToken, roleCheck("agent"), listMyRequests);

// Agent chấp nhận yêu cầu (PATCH /agents/assignments/:id/accept)
router.patch("/:id/accept", verifyToken, roleCheck("agent"), acceptRequest);

// Agent từ chối yêu cầu (PATCH /agents/assignments/:id/reject)
router.patch("/:id/reject", verifyToken, roleCheck("agent"), rejectRequest);

export default router;
