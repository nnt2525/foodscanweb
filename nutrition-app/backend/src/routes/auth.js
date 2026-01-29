// ========================================
// Auth Routes
// ========================================

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
    body('email').isEmail().withMessage('อีเมลไม่ถูกต้อง'),
    body('password').isLength({ min: 6 }).withMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
    body('name').notEmpty().withMessage('กรุณากรอกชื่อ')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        
        const { email, password, name } = req.body;
        
        // Check existing user
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'อีเมลนี้ถูกใช้แล้ว'
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const [result] = await db.query(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, name, 'user']
        );
        
        // Generate token
        const token = jwt.sign(
            { userId: result.insertId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        
        res.status(201).json({
            success: true,
            message: 'สมัครสมาชิกสำเร็จ',
            token,
            user: { id: result.insertId, email, name, role: 'user' }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Login
router.post('/login', [
    body('email').isEmail().withMessage('อีเมลไม่ถูกต้อง'),
    body('password').notEmpty().withMessage('กรุณากรอกรหัสผ่าน')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        
        const { email, password } = req.body;
        
        // Find user
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
            });
        }
        
        const user = users[0];
        
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
            });
        }
        
        // Generate token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
        
        res.json({
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT id, email, name, role, weight, height, age, gender, 
             activity_level, goal, daily_calories, created_at 
             FROM users WHERE id = ?`,
            [req.user.id]
        );
        
        res.json({ success: true, user: users[0] });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, weight, height, age, gender, activity_level, goal, daily_calories } = req.body;
        
        await db.query(
            `UPDATE users SET name = ?, weight = ?, height = ?, age = ?, 
             gender = ?, activity_level = ?, goal = ?, daily_calories = ?, updated_at = NOW()
             WHERE id = ?`,
            [name, weight, height, age, gender, activity_level, goal, daily_calories, req.user.id]
        );
        
        res.json({ success: true, message: 'อัพเดทโปรไฟล์สำเร็จ' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

module.exports = router;
