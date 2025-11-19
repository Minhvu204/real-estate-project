import express from "express";
import i18nMiddleware from "./config/i18n.config";
import cors from "cors";
import cookieParser from "cookie-parser"; 

import { errorHandler } from "./middlewares/errorHandler.middleware";


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


// Global error handler
app.use(errorHandler);

export default app;
