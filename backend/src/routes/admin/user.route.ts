import express from "express";
import { getAllUsers, updateUserStatus } from "../../controllers/admin/user.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { roleCheck } from "../../middlewares/roleCheck.middleware";

const router = express.Router();

router.get("/users", verifyToken, roleCheck("admin"), getAllUsers);
router.put("/users/:id/status", roleCheck("admin"), updateUserStatus);

export default router;
