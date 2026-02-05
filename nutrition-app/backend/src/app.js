// ========================================
// NutriTrack API - Main Application
// ========================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/foods');
const mealPlanRoutes = require('./routes/mealPlans');
const progressRoutes = require('./routes/progress');
const adminRoutes = require('./routes/admin');
const nutrientsRoutes = require('./routes/nutrients');
const importRoutes = require('./routes/import');
const categoriesRoutes = require('./routes/categories');

const app = express();

// Security Middleware
app.use(helmet()); // ป้องกัน HTTP Headers
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 นาที
    max: 100 // จำกัด 100 requests ต่อ IP
}));

// Middleware
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/nutrients', nutrientsRoutes);
app.use('/api/import', importRoutes);
app.use('/api/categories', categoriesRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 NutriTrack API running on port ${PORT}`);
});

module.exports = app;
