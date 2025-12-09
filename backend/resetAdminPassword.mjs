import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js'; // تأكد المسار صح

async function resetAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "admin@example.com"; // الايميل اللي عايز تحدثه
    const newPassword = "admin12345"; // الباسورد الجديد اللي هتدخل به

    const hashed = await bcrypt.hash(newPassword, 10);

    const result = await User.updateOne(
      { email },
      { password: hashed }
    );

    if (result.matchedCount === 0) {
      console.log("❌ مفيش يوزر بالاميل ده!");
    } else {
      console.log("✅ الباسورد اتحدث بنجاح!");
      console.log(`🔑 الباسورد الجديد: ${newPassword}`);
    }

    process.exit();
  } catch (err) {
    console.error("❌ حصل خطأ:", err);
    process.exit();
  }
}

resetAdminPassword();
