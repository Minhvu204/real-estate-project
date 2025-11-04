import express from "express";

// Import các route con của admin
import cityRoutes from "./city.route";
import typeRoutes from "./type.route";
import featureRoutes from "./feature.route";
import categoryRoutes from "./category.route";

const router = express.Router();

// Kết nối các nhóm route
router.use("/cities", cityRoutes);
router.use("/types", typeRoutes);
router.use("/features", featureRoutes);
router.use("/categories", categoryRoutes);

export default router;
