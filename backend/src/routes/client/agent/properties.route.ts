import express from "express";
import { verifyToken } from "../../../middlewares/auth.middleware";
import { roleCheck } from "../../../middlewares/roleCheck.middleware";
import { agentRequestManage } from "../../../controllers/client/buyer/properties.controller";


const router = express.Router();


// Seller gui yêu cầu quan li propety cho agent
router.post(
  "/:id/request-manage",
  verifyToken,
  roleCheck("agent"),
  agentRequestManage
);



export default router;