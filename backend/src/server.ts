import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { Server } from "socket.io"; 
import app from "./app";
import routes from "./routes/index.route";
import { connectDB } from "./config/db.config";
import { setupSocketIO } from "./socket/socket";

const httpServer = http.createServer(app);
// Khởi tạo Socket.IO Server
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  },
});

// gán ioInstance và cài đặt tất cả listeners
setupSocketIO(io);

app.use("/api", routes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log("Socket.IO server ready."); // Thêm log cho socket
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();