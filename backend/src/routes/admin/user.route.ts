import express from "express";
<<<<<<< HEAD
import { getAllUsers, getUserById, updateUserInfo, updateUserStatus } from "../../controllers/admin/user.controller";
=======
import {
  getAllUsers,
  getUserById,
  updateUserInfo,
  updateUserStatus,
} from "../../controllers/admin/user.controller";
>>>>>>> 323883bbf57c3bcf649faf95975a91161ac87e9e
import { verifyToken } from "../../middlewares/auth.middleware";
import { roleCheck } from "../../middlewares/roleCheck.middleware";

const router = express.Router();

<<<<<<< HEAD
router.get("/users/:id", verifyToken, roleCheck("admin"), getUserById);
router.patch("/users/:id", verifyToken, roleCheck("admin"), updateUserInfo);
router.get("/users", verifyToken, roleCheck("admin"), getAllUsers);
router.patch("/users/:id/status", verifyToken, roleCheck("admin"), updateUserStatus);
=======
router.get("/users/:id", getUserById);
router.patch("/users/:id", updateUserInfo);
router.get("/users", getAllUsers);
router.patch("/users/:id/status", updateUserStatus);
>>>>>>> 323883bbf57c3bcf649faf95975a91161ac87e9e

export default router;
