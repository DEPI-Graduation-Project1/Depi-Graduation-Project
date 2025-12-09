import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import subscribeRoute from './routes/subscribeRoute.js';
import adminRoutes from './routes/adminRoutes.js';
import productAdminRoutes from './routes/productAdminRoutes.js';
import adminOrderRoutes from './routes/adminOrderRoutes.js';










// 1. تحميل المتغيرات البيئية أول شيء
dotenv.config();

const startServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    // 2. Middleware
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

// قراءة JSON
app.use(express.json());

    // 3. الاتصال بقاعدة البيانات
    try {
        await connectDB();
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1); // إغلاق السيرفر إذا فشل الاتصال
    }

    // 4. Routes
    app.get('/', (req, res) => {
        res.send('Welcome to the RABBIT API!');
    });

    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/checkout', checkoutRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/upload', uploadRoutes);
    app.use('/api/subscribe', subscribeRoute); 

    //Admin
    app.use('/api/admin', adminRoutes);
    app.use('/api/admin/products', productAdminRoutes);
    app.use('/api/admin/orders', adminOrderRoutes); 
 



    // 5. تشغيل السيرفر
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();