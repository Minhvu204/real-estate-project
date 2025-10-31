import express from "express";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";

const router = express.Router();

router.get("", verifyToken, roleCheck("seller","agent"), (req, res) => {
  res.json({ message: "Lấy danh sách properties" });
});


export default router;
