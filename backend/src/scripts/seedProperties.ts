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
      { feature_name: "Gym" },
      { feature_name: "Elevator" },
    ]);
    const features = await Feature.find();
    console.log("✨ Features seeded!");

    // 👤 Users
    // const hashedPassword = await bcrypt.hash("123456", 10); // hash mật khẩu mẫu

    const users = await User.create([
      {
        fullName: "Nguyen Van A",
        email: "owner@example.com",
        password: "123456",
        role: "seller",
        phone: "0901234567",
        isActive: true
      },
      {
        fullName: "Le Thi B",
        email: "agent@example.com",
        password: "123456",
        role: "agent",
        phone: "0907654321",
        isActive: true
      },
    ]);
    console.log("👤 Users seeded!");

    const owner = users.find((u) => u.role === "seller");
    const agent = users.find((u) => u.role === "agent");

    if (!cities.length || !categories.length || !types.length || !owner || !agent) {
      throw new Error("Collections or users not seeded properly!");
    }

    // 🏡 Property
    // await Property.create({
    //   title: "Luxury Apartment in District 1",
    //   description: "A beautiful modern apartment with city view and full amenities.",
    //   price: 250000,
    //   city_id: cities[0]._id,
    //   type_id: types[1]._id,
    //   category_id: categories[0]._id,
    //   owner_id: owner._id,
    //   agent_id: agent._id,
    //   features: features.map((f) => f._id),
    //   images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
    //   status: "available",
    // });
    const now = new Date();
    await Property.insertMany([
      {
        // 1
        title: "Luxury Apartment in District 1",
        description: "A beautiful modern apartment with city view and full amenities.",
        price: 250000,
        address: "123 Nguyen Hue, District 1, Ho Chi Minh City",
        bedrooms: 2,
        bathrooms: 2,
        coordinates: { lat: 10.7769, lng: 106.7009 },
        listingType: "sale",
        city_id: cities[0]._id,
        type_id: types.find(t => t.type_name === "For Sale")?._id || types[1]._id,
        category_id: categories.find(c => c.category_name === "Apartment")?._id || categories[0]._id,
        owner_id: owner._id,
        agent_id: agent._id,
        features: features.slice(0, 3).map((f) => f._id),
        images: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/518308113.jpg?k=134060b34af97004d911560301b891d9882b02f31eab9645fb6fe0dd07b084bc&o=&hp=1", "https://cf.bstatic.com/xdata/images/hotel/max1024x768/525593268.jpg?k=615de8dd83adca84bd9ac794b80bb7b10ff6c468542c7e4b451ac6ad3e0a193b&o=&hp=1", "https://pix10.agoda.net/hotelImages/4567921/0/7deeafc57df289800ebb70b70126e90f.jpg?ca=7&ce=1&s=414x232"],
        status: "available",
        createdAt: now,
        updatedAt: now,
      },
      {
        // 2
        title: "Cozy House near West Lake",
        description: "A cozy family home located near the West Lake area with a large garden.",
        price: 180000,
        address: "45 Trich Sai, Tay Ho, Hanoi",
        bedrooms: 3,
        bathrooms: 2,
        coordinates: { lat: 21.0501, lng: 105.8188 },
        listingType: "rent",
        city_id: cities[1]._id,
        type_id: types.find(t => t.type_name === "For Rent")?._id || types[0]._id,
        category_id: categories.find(c => c.category_name === "House")?._id || categories[1]._id,
        owner_id: owner._id,
        agent_id: agent._id,
        features: [features[1]._id, features[3]._id],
        images: ["https://houseinhanoi.vn/wp-content/uploads/2022/12/cozy-house-for-rent-on-to-ngoc-van-near-west-lake-16-835x467.jpg", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRma1501-CdXLYmZkltgSVtC_wMD1dbNLq8pA&s", "https://houseinhanoi.vn/wp-content/uploads/2022/12/cozy-house-for-rent-on-to-ngoc-van-near-west-lake-38-835x467.jpg"],
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
      {
        // 3
        title: "Beachfront Villa in Da Nang",
        description: "Luxury villa with sea view, swimming pool and private access to the beach.",
        price: 450000,
        address: "Son Tra Peninsula, Da Nang",
        bedrooms: 5,
        bathrooms: 4,
        coordinates: { lat: 16.0921, lng: 108.2477 },
        listingType: "sale",
        city_id: cities[2]._id,
        type_id: types.find(t => t.type_name === "For Sale")?._id || types[1]._id,
        category_id: categories.find(c => c.category_name === "Villa")?._id || categories[2]._id,
        owner_id: owner._id,
        agent_id: agent._id,
        features: [features[1]._id, features[2]._id],
        images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWSdBDQ3QfTiw8v4lC0v9Aa2UQI-YCfSvB2w&s", "https://fusionresorts.com/danang/wp-content/uploads/2024/07/Thumnail-5bedroom-1024x662.webp", "https://cf.bstatic.com/xdata/images/hotel/max1024x768/569598891.jpg?k=a73db8f9c1d3f432c56778c38ac220972aac6b8ee16036c86d772c040f8a9e1f&o=&hp=1"],
        status: "available",
        createdAt: now,
        updatedAt: now,
      },
      {
        // 4
        title: "Modern Studio in District 3",
        description: "Compact studio ideal for single professionals, close to cafés and coworking spaces.",
        price: 85000,
        address: "78 Pasteur, District 3, Ho Chi Minh City",
        bedrooms: 1,
        bathrooms: 1,
        coordinates: { lat: 10.7760, lng: 106.6900 },
        listingType: "rent",
        city_id: cities[0]._id,
        type_id: types.find(t => t.type_name === "For Rent")?._id || types[0]._id,
        category_id: categories.find(c => c.category_name === "Apartment")?._id || categories[0]._id,
        owner_id: owner._id,
        agent_id: agent._id,
        features: [features[0]._id, features[4]._id],
        images: ["https://jhouse.vn/wp-content/uploads/2025/08/Modern-studio-apartment-at-The-Urban-Studio-Apartment-District-3-HCM-2.jpeg", "https://jhouse.vn/wp-content/uploads/2025/08/Modern-studio-apartment-at-The-Urban-Studio-Apartment-District-3-HCM-6.jpeg", "https://jhouse.vn/wp-content/uploads/2025/08/New-studio-apartment-for-rent-at-The-Urban-Studio-District-3-5.jpeg"],
        status: "available",
        createdAt: now,
        updatedAt: now,
      },
      {
        // 5
        title: "Family House in District 9",
        description: "Spacious family house with garage and garden, perfect for growing families.",
        price: 200000,
        address: "12 Long Truong, District 9, Ho Chi Minh City",
        bedrooms: 4,
        bathrooms: 3,
        coordinates: { lat: 10.8250, lng: 106.7634 },
        listingType: "sale",
        city_id: cities[0]._id,
        type_id: types.find(t => t.type_name === "For Sale")?._id || types[1]._id,
        category_id: categories.find(c => c.category_name === "House")?._id || categories[1]._id,
        owner_id: owner._id,
        agent_id: agent._id,
        features: [features[2]._id, features[3]._id],
        images: ["https://picsum.photos/seed/p5a/800/600"],
        status: "pending",
        createdAt: now,
        updatedAt: now,
      },
      {
        // 6
        title: "Penthouse with City View",
        description: "High-floor penthouse offering 360° views of the city, designer finishes.",
        price: 1200000,
        address: "50 Le Loi, District 1, Ho Chi Minh City",
        bedrooms: 4,
        bathrooms: 4,
        coordinates: { lat: 10.7750, lng: 106.7020 },
        listingType: "sale",
        city_id: cities[0]._id,
        type_id: types.find(t => t.type_name === "For Sale")?._id || types[1]._id,
        category_id: categories.find(c => c.category_name === "Apartment")?._id || categories[0]._id,
        owner_id: owner._id,
        agent_id: agent._id,
        features: [features[0]._id, features[4]._id, features[5]._id],
        images: ["https://picsum.photos/seed/p6a/800/600"],
        status: "approved",
        createdAt: now,
        updatedAt: now,
      },
      {
        // 7
        title: "Riverside Condo in Thao Dien",
        description: "Modern condo with river access and communal pool. Great for expat families.",
        price: 320000,
        address: "Thao Dien, District 2, Ho Chi Minh City",
        bedrooms: 3,
        bathrooms: 2,
        coordinates: { lat: 10.8010, lng: 106.7375 },
        listingType: "rent",
        city_id: cities[0]._id,
        type_id: types.find(t => t.type_name === "For Rent")?._id || types[0]._id,
        category_id: categories.find(c => c.category_name === "Apartment")?._id || categories[0]._id,
        owner_id: owner._id,
        agent_id: agent._id,
        features: [features[1]._id, features[5]._id],
        images: ["https://picsum.photos/seed/p7a/800/600"],
        status: "available",
        createdAt: now,
        updatedAt: now,
      },
      {
        // 8
        title: "Sunny Townhouse near Marble Mountain",
        description: "Comfortable townhouse with terrace and two balconies, close to beaches.",
        price: 150000,
        address: "Near Marble Mountain, Da Nang",
        bedrooms: 3,
        bathrooms: 3,
        coordinates: { lat: 16.0425, lng: 108.2190 },
        listingType: "sale",
        city_id: cities[2]._id,
        type_id: types.find(t => t.type_name === "For Sale")?._id || types[1]._id,
        category_id: categories.find(c => c.category_name === "House")?._id || categories[1]._id,
        owner_id: owner._id,
        agent_id: agent._id,
        features: [features[3]._id, features[4]._id],
        images: ["https://picsum.photos/seed/p8a/800/600"],
        status: "available",
        createdAt: now,
        updatedAt: now,
      },
      {
        // 9
        title: "Compact Studio near University",
        description: "Affordable studio near university campus, ideal for students.",
        price: 35000,
        address: "University area, Da Nang",
        bedrooms: 1,
        bathrooms: 1,
        coordinates: { lat: 16.0678, lng: 108.2232 },
        listingType: "rent",
        city_id: cities[2]._id,
        type_id: types.find(t => t.type_name === "For Rent")?._id || types[0]._id,
        category_id: categories.find(c => c.category_name === "Apartment")?._id || categories[0]._id,
        owner_id: owner._id,
        agent_id: agent._id,
        features: [features[0]._id],
        images: ["https://picsum.photos/seed/p9a/800/600"],
        status: "available",
        createdAt: now,
        updatedAt: now,
      },
      {
        // 10
        title: "Seaside Bungalow",
        description: "Small bungalow perfect for weekend getaways, private garden included.",
        price: 90000,
        address: "Coastal road, Da Nang",
        bedrooms: 2,
        bathrooms: 1,
        coordinates: { lat: 16.0530, lng: 108.2300 },
        listingType: "sale",
        city_id: cities[2]._id,
        type_id: types.find(t => t.type_name === "For Sale")?._id || types[1]._id,
        category_id: categories.find(c => c.category_name === "Villa")?._id || categories[2]._id,
        owner_id: owner._id,
        agent_id: agent._id,
        features: [features[3]._id],
        images: ["https://picsum.photos/seed/p10a/800/600"],
        status: "available",
        createdAt: now,
        updatedAt: now,
      },
    ]);

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
