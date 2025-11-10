import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URL;

if (!MONGO_URI) {
  console.error("❌ MONGO_URL is not defined in .env");
  process.exit(1);
}

async function clearPropertiesCollection() {
  try {
    await mongoose.connect(MONGO_URI || "");
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection is undefined");
    }

    const collection = db.collection("properties");

    const result = await collection.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} document(s) from 'properties'.`);
  } catch (error) {
    console.error("❌ Error clearing collection:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

clearPropertiesCollection();
