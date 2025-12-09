import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js"; // لاحظ إضافة .js ضروري جداً
import User from "./models/User.js";
import Cart from "./models/Cart.js";       // لاحظ إضافة .js
import products from "./data/products.js"; // لاحظ إضافة .js

dotenv.config();

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// ... باقي الكود

const importData = async () => {
  try {
    console.log("Connecting to database...");
    
    // أولاً نحذف البيانات القديمة
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    console.log("Old data deleted");

    // ثم نضيف البيانات الجديدة
    console.log("Creating admin user...");
    const createdUsers = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: '123456',
        role: 'admin'   
    });
    console.log("Admin user created successfully!");
    console.log("Email: admin@example.com");
    console.log("Password: 123456");
    
    const userId = createdUsers._id;

    console.log("Creating products...");
    const sampleProducts = products.map(product => {
      return { ...product, user: userId };
    });
    await Product.insertMany(sampleProducts);

    console.log("Data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding the data:", error);
    process.exit(1);
  }
};

importData();

        