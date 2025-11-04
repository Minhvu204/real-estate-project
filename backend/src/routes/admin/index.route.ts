import express from "express";
import { verifyToken } from "../../middlewares/auth.middleware";
import { roleCheck } from "../../middlewares/roleCheck.middleware";


import userRoutes from "./user.route";
import cityRoutes from "./city.route";
import typeRoutes from "./type.route";
import categoryRoutes from "./category.route";
import featureRoutes from "./feature.route";

const router = express.Router();


router.use(verifyToken, roleCheck("admin"));

router.use("/users", userRoutes);
router.use("/cities", cityRoutes);
router.use("/types", typeRoutes);
router.use("/categories", categoryRoutes);
router.use("/features", featureRoutes);
export default router;
