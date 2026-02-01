// ========================================
// Categories Routes - Admin CRUD
// ========================================

const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// ========================================
// Public Routes
// ========================================

// Get all categories
router.get('/', async (req, res) => {
    try {
        const [categories] = await db.query(
            'SELECT * FROM categories ORDER BY name'
        );
        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Get category by ID
router.get('/:id', async (req, res) => {
    try {
        const [categories] = await db.query(
            'SELECT * FROM categories WHERE id = ?',
            [req.params.id]
        );

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบหมวดหมู่'
            });
        }

        res.json({ success: true, data: categories[0] });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// ========================================
// Admin Routes
// ========================================

// Create category (Admin only)
router.post('/', adminAuth, [
    body('name').notEmpty().withMessage('กรุณากรอกชื่อหมวดหมู่')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, icon, description } = req.body;

        // Check if name exists
        const [existing] = await db.query(
            'SELECT id FROM categories WHERE name = ?',
            [name]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'ชื่อหมวดหมู่นี้มีอยู่แล้ว'
            });
        }

        const [result] = await db.query(
            'INSERT INTO categories (name, icon, description) VALUES (?, ?, ?)',
            [name, icon || '📁', description || null]
        );

        res.status(201).json({
            success: true,
            message: 'สร้างหมวดหมู่สำเร็จ',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Update category (Admin only)
router.put('/:id', adminAuth, [
    body('name').notEmpty().withMessage('กรุณากรอกชื่อหมวดหมู่')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { id } = req.params;
        const { name, icon, description } = req.body;

        // Check if category exists
        const [existing] = await db.query(
            'SELECT id FROM categories WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบหมวดหมู่'
            });
        }

        // Check if name is taken by another category
        const [nameTaken] = await db.query(
            'SELECT id FROM categories WHERE name = ? AND id != ?',
            [name, id]
        );

        if (nameTaken.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'ชื่อหมวดหมู่นี้มีอยู่แล้ว'
            });
        }

        await db.query(
            'UPDATE categories SET name = ?, icon = ?, description = ? WHERE id = ?',
            [name, icon, description, id]
        );

        res.json({ success: true, message: 'แก้ไขหมวดหมู่สำเร็จ' });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Delete category (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category exists
        const [existing] = await db.query(
            'SELECT id FROM categories WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบหมวดหมู่'
            });
        }

        // Check if category has foods
        const [foods] = await db.query(
            'SELECT COUNT(*) as count FROM foods WHERE category_id = ?',
            [id]
        );

        if (foods[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: `ไม่สามารถลบได้ มีอาหาร ${foods[0].count} รายการในหมวดหมู่นี้`
            });
        }

        await db.query('DELETE FROM categories WHERE id = ?', [id]);

        res.json({ success: true, message: 'ลบหมวดหมู่สำเร็จ' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

module.exports = router;
