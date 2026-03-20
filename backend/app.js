import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import pool from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
// IMPORT ROUTES BARU
import transaksiRoutes from './src/routes/transaksiRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import programRoutes from './src/routes/programRoutes.js';

const app = express();

// Test koneksi DB
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('✅ Connected to Supabase DB');
    release();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/transaksi', transaksiRoutes);           
app.use('/notif', notificationRoutes);   
app.use('/program', programRoutes);       

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'NurimanPay API is running',
        version: '1.0.0',
        status: 'ok',
        timestamp: new Date(),
        endpoints: {
            auth: {
                login: 'POST /auth/login'
            },
            transaksi: {
                create: 'POST /transaksi/create',
                getAll: 'GET /transaksi'
            },
            program: {
                create: 'POST /program/create',
                getAll: 'GET /program'
            },
            midtrans: {
                notification: 'POST /notif',
                cekStatus: 'GET /status/:orderId'
            }
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route tidak ditemukan'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Terjadi kesalahan pada server'
    });
});

export default app;