// src/scripts/seedProperties.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// 🧩 Models
import City from "../models/city.model";
import Category from "../models/category.model";
import PropertyType from "../models/propertyType.model";
import Feature from "../models/feature.model";
import User from "../models/user.model";
import Property from "../models/property.model";

dotenv.config();

const MONGO_URI = process.env.MONGO_URL || "your_mongodb_atlas_url_here";

async function seed() {
  try {
    console.log("🚀 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully!");

    // 🧹 Clear old data
    await Promise.all([
      City.deleteMany({}),
      Category.deleteMany({}),
      PropertyType.deleteMany({}),
      Feature.deleteMany({}),
      User.deleteMany({}),
      Property.deleteMany({}),
    ]);
    console.log("🧼 Old collections cleared!");

    // 🏙️ Cities
    await City.insertMany([
      { city_name: "Ho Chi Minh City" },
      { city_name: "Hanoi" },
      { city_name: "Da Nang" },
    ]);
    const cities = await City.find();
    console.log("🏙️ Cities seeded!");

    // 🏷️ Categories
    await Category.insertMany([
      { category_name: "Apartment" },
      { category_name: "House" },
      { category_name: "Villa" },
    ]);
    const categories = await Category.find();
    console.log("🏷️ Categories seeded!");

    // 🏠 Property Types
    await PropertyType.insertMany([
      { type_name: "For Rent" },
      { type_name: "For Sale" },
    ]);
    const types = await PropertyType.find();
    console.log("🏠 Property types seeded!");

    // ✨ Features
    await Feature.insertMany([
      { feature_name: "Balcony" },
      { feature_name: "Swimming Pool" },
      { feature_name: "Garage" },
      { feature_name: "Garden" },
    ]);
    const features = await Feature.find();
    console.log("✨ Features seeded!");

    // 👤 Users
    const hashedPassword = await bcrypt.hash("123456", 10); // hash mật khẩu mẫu

    const users = await User.create([
      {
        fullName: "Nguyen Van A",
        email: "owner@example.com",
        password: hashedPassword,
        role: "seller",
        phone: "0901234567",
      },
      {
        fullName: "Le Thi B",
        email: "agent@example.com",
        password: hashedPassword,
        role: "agent",
        phone: "0907654321",
      },
    ]);
    console.log("👤 Users seeded!");

    const owner = users.find((u) => u.role === "seller");
    const agent = users.find((u) => u.role === "agent");

    if (!cities.length || !categories.length || !types.length || !owner || !agent) {
      throw new Error("Collections or users not seeded properly!");
    }

    // 🏡 Property
    await Property.create({
      title: "Luxury Apartment in District 1",
      description: "A beautiful modern apartment with city view and full amenities.",
      price: 250000,
      city_id: cities[0]._id,
      type_id: types[1]._id,
      category_id: categories[0]._id,
      owner_id: owner._id,
      agent_id: agent._id,
      features: features.map((f) => f._id),
      images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
      status: "available",
    });
    console.log("🏡 Property seeded!");

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error while seeding:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
  }
}

seed();
