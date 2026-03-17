import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import pool from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';

const app = express();
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to Supabase DB');
    release();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

console.log('Registering routes...');
console.log(' - Auth routes: /auth');

// Routes
app.use('/auth', authRoutes);
console.log('✅ All routes registered');

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Infaq API is running',
        version: '1.0.0',
        status: 'ok',
        timestamp: new Date(),
        endpoints: {
            auth: {
                login: 'POST /auth/login',
            },
            
        }
    });
});

// 404 
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