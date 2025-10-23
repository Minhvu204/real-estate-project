import express from "express";
import { registerController, loginController, googleAuthController  } from "../../../controllers/client/auth/auth.controller";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/google", googleAuthController);

export default router;
