// ========================================
// Foods Routes
// ========================================

const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all approved foods
router.get('/', async (req, res) => {
    try {
        const { category, search, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT f.*, c.name as category_name, c.icon as category_icon
            FROM foods f
            LEFT JOIN categories c ON f.category_id = c.id
            WHERE f.status = 'approved'
        `;
        const params = [];
        
        if (category && category !== 'all') {
            query += ' AND c.id = ?';
            params.push(category);
        }
        
        if (search) {
            query += ' AND f.name LIKE ?';
            params.push(`%${search}%`);
        }
        
        query += ' ORDER BY f.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);
        
        const [foods] = await db.query(query, params);
        
        // Get total count
        const [countResult] = await db.query(
            'SELECT COUNT(*) as total FROM foods WHERE status = ?',
            ['approved']
        );
        
        res.json({
            success: true,
            data: foods,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult[0].total
            }
        });
    } catch (error) {
        console.error('Get foods error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Get food by ID
router.get('/:id', async (req, res) => {
    try {
        const [foods] = await db.query(
            `SELECT f.*, c.name as category_name, c.icon as category_icon,
             u.name as created_by_name
             FROM foods f
             LEFT JOIN categories c ON f.category_id = c.id
             LEFT JOIN users u ON f.created_by = u.id
             WHERE f.id = ?`,
            [req.params.id]
        );
        
        if (foods.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบอาหาร'
            });
        }
        
        res.json({ success: true, data: foods[0] });
    } catch (error) {
        console.error('Get food error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Create food (User can add, status = pending)
router.post('/', auth, [
    body('name').notEmpty().withMessage('กรุณากรอกชื่ออาหาร'),
    body('calories').isInt({ min: 0 }).withMessage('แคลอรี่ต้องเป็นตัวเลข')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        
        const { name, calories, protein, carbs, fat, fiber, serving_size, image_url, category_id } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving_size, 
             image_url, category_id, created_by, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, calories, protein || 0, carbs || 0, fat || 0, fiber || 0, 
             serving_size, image_url, category_id, req.user.id, 'pending']
        );
        
        res.status(201).json({
            success: true,
            message: 'เพิ่มอาหารสำเร็จ รอการอนุมัติ',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create food error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Get categories
router.get('/categories/list', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories ORDER BY name');
        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

module.exports = router;
