import express from "express";
import userRoutes from "./user.route";
// import propertyRoutes from "./property.route";
import cityRoutes from "./city.route";
import typeRoutes from "./type.route";
import categoryRoutes from "./category.route";
import featureRoutes from "./feature.route";

const router = express.Router();


router.use("/", userRoutes);
// router.use("/properties", propertyRoutes);

router.use("/cities", cityRoutes);
router.use("/types", typeRoutes);
router.use("/categories", categoryRoutes);
router.use("/features", featureRoutes);

export default router;
