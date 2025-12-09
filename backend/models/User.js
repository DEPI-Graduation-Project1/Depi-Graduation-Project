// User.js

// 1. استخدام import بدلاً من require للتبعيات
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 2. تعريف الـ Schema (بما في ذلك الحقول الجديدة)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // التحقق من صحة صيغة البريد الإلكتروني
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters long'], // رسالة خطأ مُحسّنة
      select: false, // لا يتم إرجاع حقل 'password' تلقائياً عند جلب المستخدم
    },
    role: {
      type: String,
      enum: ['customer', 'admin'], // تم تصحيح 'custmor' إلى 'customer'
      default: 'customer',
    },
  },
  {
    // إضافة خيارات (Options) للـ Schema
    timestamps: true, // يضيف حقلي createdAt و updatedAt
  }
);

// --- 3. Middleware: تشفير كلمة المرور قبل الحفظ (Hashing Password) ---
userSchema.pre('save', async function (next) {
  // لا تقم بالتشفير إلا إذا تم تعديل حقل كلمة المرور
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // توليد Salt (عامل التمليح)
    const salt = await bcrypt.genSalt(10);
    
    // تشفير كلمة المرور
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
  } catch (err) {
    // تمرير الخطأ إلى Mongoose
    next(err);
  }
});

// --- 4. Methods: وظيفة لمقارنة كلمة المرور المدخلة بكلمة المرور المشفرة ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    throw new Error('Password not available for comparison');
  }
  if (!enteredPassword) {
    return false;
  }
  // استخدام bcrypt.compare لمقارنة النص المُدخل بالقيمة المشفرة المخزنة
  return await bcrypt.compare(enteredPassword, this.password);
};

// 5. تصدير الموديل
const User = mongoose.model('User', userSchema);
export default User;