import express from "express";
import {
  registerController,
  loginController,
  googleAuthController,
  logoutController,
  refreshTokenController,
} from "../../../controllers/client/auth/auth.controller";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/google", googleAuthController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);

export default router;
