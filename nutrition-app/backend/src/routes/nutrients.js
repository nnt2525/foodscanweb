// ========================================
// Nutrients API Routes - NutriTrack
// ========================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// ========================================
// Get All Nutrients
// ========================================
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;

        let query = 'SELECT * FROM nutrients';
        const params = [];

        if (category) {
            query += ' WHERE category = ?';
            params.push(category);
        }

        query += ' ORDER BY category, name_en';

        const [nutrients] = await db.query(query, params);

        res.json({
            success: true,
            nutrients
        });
    } catch (error) {
        console.error('Get nutrients error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// ========================================
// Get Nutrient by ID
// ========================================
router.get('/:id', async (req, res) => {
    try {
        const [nutrients] = await db.query(
            'SELECT * FROM nutrients WHERE id = ?',
            [req.params.id]
        );

        if (nutrients.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบข้อมูลสารอาหาร'
            });
        }

        res.json({
            success: true,
            nutrient: nutrients[0]
        });
    } catch (error) {
        console.error('Get nutrient error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// ========================================
// Get Nutrients for a Food
// ========================================
router.get('/food/:foodId', async (req, res) => {
    try {
        const [nutrients] = await db.query(`
            SELECT 
                n.id, n.code, n.name_th, n.name_en, n.unit, n.daily_value, n.category,
                fn.amount,
                ROUND((fn.amount / n.daily_value) * 100, 1) as percent_daily
            FROM food_nutrients fn
            JOIN nutrients n ON fn.nutrient_id = n.id
            WHERE fn.food_id = ?
            ORDER BY n.category, n.name_en
        `, [req.params.foodId]);

        res.json({
            success: true,
            nutrients
        });
    } catch (error) {
        console.error('Get food nutrients error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// ========================================
// Add/Update Nutrient for a Food (Admin only)
// ========================================
router.post('/food/:foodId', auth, async (req, res) => {
    try {
        const { foodId } = req.params;
        const { nutrient_id, amount } = req.body;

        // Upsert: insert or update
        await db.query(`
            INSERT INTO food_nutrients (food_id, nutrient_id, amount)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE amount = VALUES(amount)
        `, [foodId, nutrient_id, amount]);

        res.json({
            success: true,
            message: 'บันทึกข้อมูลสารอาหารแล้ว'
        });
    } catch (error) {
        console.error('Save food nutrient error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// ========================================
// Bulk Add Nutrients for a Food (Admin only)
// ========================================
router.post('/food/:foodId/bulk', auth, async (req, res) => {
    try {
        const { foodId } = req.params;
        const { nutrients } = req.body; // Array of { nutrient_id, amount }

        if (!Array.isArray(nutrients) || nutrients.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุข้อมูลสารอาหาร'
            });
        }

        // Build bulk insert query
        const values = nutrients.map(n => [foodId, n.nutrient_id, n.amount]);

        await db.query(`
            INSERT INTO food_nutrients (food_id, nutrient_id, amount)
            VALUES ?
            ON DUPLICATE KEY UPDATE amount = VALUES(amount)
        `, [values]);

        res.json({
            success: true,
            message: `บันทึกสารอาหาร ${nutrients.length} รายการแล้ว`
        });
    } catch (error) {
        console.error('Bulk save nutrients error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

module.exports = router;
