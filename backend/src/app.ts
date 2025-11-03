import express from "express";
import dotenv from "dotenv";
import i18nMiddleware from "./config/i18n.config";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser"; 
import routes from "./routes/index.route";

import { errorHandler } from "./middlewares/errorHandler.middleware";

dotenv.config();

const app = express();

// Cấu hình CORS trước khi định nghĩa route
app.use(cors({
  origin: true, // FE URL
  credentials: true, // cho phép gửi cookie
}));

// Đọc cookie từ request
app.use(cookieParser());

// Middleware parse body
app.use(i18nMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Global error handler
app.use(errorHandler);

export default app;
