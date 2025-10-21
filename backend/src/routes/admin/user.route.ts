import express from "express";
import { getAllUsers } from "../../controllers/admin/user.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { roleCheck } from "../../middlewares/roleCheck.middleware";

const router = express.Router();

router.get("/users", verifyToken, roleCheck("admin"), getAllUsers);

export default router;
