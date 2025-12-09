import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js'; // تأكد المسار صح

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "admin@example.com";
    const password = "admin12345";
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("❌ Admin موجود بالفعل. حاول تسجيل الدخول بالباسورد الحالي.");
    } else {
      const admin = new User({
        name: "Admin", // لازم تعطي قيمة للحقل المطلوب
        email,
        password: hashedPassword,
        role: "admin" // لو عندك role
      });
      await admin.save();
      console.log("✅ Admin جديد اتخلق بنجاح!");
      console.log(`🔑 الإيميل: ${email}`);
      console.log(`🔑 الباسورد: ${password}`);
    }

    process.exit();
  } catch (err) {
    console.error("❌ حصل خطأ:", err);
    process.exit();
  }
}

createAdminUser();
