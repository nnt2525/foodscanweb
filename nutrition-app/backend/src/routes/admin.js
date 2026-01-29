// ========================================
// Admin Routes
// ========================================

const express = require('express');
const db = require('../config/database');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
        const [foodCount] = await db.query('SELECT COUNT(*) as count FROM foods WHERE status = ?', ['approved']);
        const [pendingCount] = await db.query('SELECT COUNT(*) as count FROM foods WHERE status = ?', ['pending']);
        
        const today = new Date().toISOString().split('T')[0];
        const [todayLogs] = await db.query(
            'SELECT COUNT(*) as count FROM meal_items mi JOIN meal_plans mp ON mi.meal_plan_id = mp.id WHERE mp.date = ?',
            [today]
        );
        
        res.json({
            success: true,
            data: {
                totalUsers: userCount[0].count,
                totalFoods: foodCount[0].count,
                pendingFoods: pendingCount[0].count,
                todayLogs: todayLogs[0].count
            }
        });
    } catch (error) {
        console.error('Get admin stats error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const offset = (page - 1) * limit;
        
        let query = 'SELECT id, email, name, role, created_at FROM users';
        const params = [];
        
        if (search) {
            query += ' WHERE name LIKE ? OR email LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }
        
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);
        
        const [users] = await db.query(query, params);
        const [countResult] = await db.query('SELECT COUNT(*) as total FROM users');
        
        res.json({
            success: true,
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult[0].total
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Update user
router.put('/users/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role } = req.body;
        
        await db.query(
            'UPDATE users SET name = ?, role = ?, updated_at = NOW() WHERE id = ?',
            [name, role, id]
        );
        
        res.json({ success: true, message: 'อัพเดทผู้ใช้สำเร็จ' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent deleting self
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'ไม่สามารถลบบัญชีตัวเองได้'
            });
        }
        
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        
        res.json({ success: true, message: 'ลบผู้ใช้สำเร็จ' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Get pending foods
router.get('/foods/pending', adminAuth, async (req, res) => {
    try {
        const [foods] = await db.query(`
            SELECT f.*, c.name as category_name, u.name as created_by_name
            FROM foods f
            LEFT JOIN categories c ON f.category_id = c.id
            LEFT JOIN users u ON f.created_by = u.id
            WHERE f.status = 'pending'
            ORDER BY f.created_at DESC
        `);
        
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error('Get pending foods error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Approve food
router.put('/foods/:id/approve', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        await db.query(
            'UPDATE foods SET status = ?, updated_at = NOW() WHERE id = ?',
            ['approved', id]
        );
        
        res.json({ success: true, message: 'อนุมัติอาหารสำเร็จ' });
    } catch (error) {
        console.error('Approve food error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Reject food
router.put('/foods/:id/reject', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        await db.query(
            'UPDATE foods SET status = ?, updated_at = NOW() WHERE id = ?',
            ['rejected', id]
        );
        
        res.json({ success: true, message: 'ปฏิเสธอาหารสำเร็จ' });
    } catch (error) {
        console.error('Reject food error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Delete food
router.delete('/foods/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        await db.query('DELETE FROM foods WHERE id = ?', [id]);
        
        res.json({ success: true, message: 'ลบอาหารสำเร็จ' });
    } catch (error) {
        console.error('Delete food error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

module.exports = router;
