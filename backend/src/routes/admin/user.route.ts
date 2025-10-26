import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserInfo,
  updateUserStatus,
} from "../../controllers/admin/user.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { roleCheck } from "../../middlewares/roleCheck.middleware";

const router = express.Router();

router.get("/users/:id", getUserById);
router.patch("/users/:id", updateUserInfo);
router.get("/users", getAllUsers);
router.patch("/users/:id/status", updateUserStatus);

export default router;
