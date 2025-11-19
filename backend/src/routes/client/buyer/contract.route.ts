import express from "express";
import multer from "multer";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import { upload as uploadToCloudinary } from "../../../middlewares/uploadCloundinary.middleware";
import {
  getContractByDeal,
  downloadContract,
  uploadContract,
  listContracts,
  acceptContract,
  rejectContract,
} from "../../../controllers/client/buyer/contract.controller";

const router = express.Router();
const multerUpload = multer({ storage: multer.memoryStorage() });

router.get("/contracts", verifyToken, roleCheck("buyer"), listContracts);
router.get("/deals/:dealId/contract", verifyToken, roleCheck("buyer"), getContractByDeal);

router.get(
  "/deals/:dealId/contract/download",
  verifyToken,
  roleCheck("buyer"),
  downloadContract
);

router.post(
  "/deals/:dealId/contract",
  verifyToken,
  roleCheck("buyer"),
  multerUpload.single("file"),
  uploadToCloudinary,
  uploadContract
);

router.post(
  "/deals/:dealId/contract/accept",
  verifyToken,
  roleCheck("buyer"),
  acceptContract
);

router.post(
  "/deals/:dealId/contract/reject",
  verifyToken,
  roleCheck("buyer"),
  rejectContract
);

export default router;


