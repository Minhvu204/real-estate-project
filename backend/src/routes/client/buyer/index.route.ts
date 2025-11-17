import express from "express";
import testRoutes from "./buyer.route";
import offerRoutes from "./offer.route";

const router = express.Router();

router.use("/", testRoutes);
router.use("/offers", offerRoutes);

export default router;
