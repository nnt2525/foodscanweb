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

// Change password
router.put('/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกรหัสผ่านให้ครบถ้วน'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร'
            });
        }

        // Get current password hash
        const [users] = await db.query(
            'SELECT password FROM users WHERE id = ?',
            [req.user.id]
        );

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, users[0].password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query(
            'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
            [hashedPassword, req.user.id]
        );

        res.json({ success: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Delete account
router.delete('/account', auth, async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'กรุณายืนยันรหัสผ่าน'
            });
        }

        // Verify password
        const [users] = await db.query(
            'SELECT password FROM users WHERE id = ?',
            [req.user.id]
        );

        const isMatch = await bcrypt.compare(password, users[0].password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'รหัสผ่านไม่ถูกต้อง'
            });
        }

        // Delete user (cascade will delete related data)
        await db.query('DELETE FROM users WHERE id = ?', [req.user.id]);

        res.json({ success: true, message: 'ลบบัญชีสำเร็จ' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// ========================================
// Password Reset - Request (generates token)
// ========================================
router.post('/forgot-password', [
    body('email').isEmail().withMessage('อีเมลไม่ถูกต้อง')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email } = req.body;

        // Check if user exists
        const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);

        // Always return success to prevent email enumeration
        if (users.length === 0) {
            return res.json({
                success: true,
                message: 'หากอีเมลนี้ลงทะเบียนไว้ ท่านจะได้รับลิงก์รีเซ็ตรหัสผ่าน'
            });
        }

        // Generate reset token (valid for 1 hour)
        const resetToken = jwt.sign(
            { userId: users[0].id, type: 'password_reset' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // In a real app, send email with reset link
        // For now, we'll store the token and return it (for testing)
        await db.query(
            'UPDATE users SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?',
            [resetToken, users[0].id]
        );

        // In production, send email instead of returning token
        res.json({
            success: true,
            message: 'หากอีเมลนี้ลงทะเบียนไว้ ท่านจะได้รับลิงก์รีเซ็ตรหัสผ่าน',
            // For development testing only - remove in production!
            resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// ========================================
// Password Reset - Verify Token and Reset
// ========================================
router.post('/reset-password', [
    body('token').notEmpty().withMessage('กรุณาระบุ token'),
    body('newPassword').isLength({ min: 6 }).withMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { token, newPassword } = req.body;

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.type !== 'password_reset') {
                throw new Error('Invalid token type');
            }
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'ลิงก์รีเซ็ตไม่ถูกต้องหรือหมดอายุแล้ว'
            });
        }

        // Check if token matches stored token
        const [users] = await db.query(
            'SELECT id, reset_token FROM users WHERE id = ? AND reset_token = ? AND reset_token_expires > NOW()',
            [decoded.userId, token]
        );

        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'ลิงก์รีเซ็ตไม่ถูกต้องหรือหมดอายุแล้ว'
            });
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query(
            'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL, updated_at = NOW() WHERE id = ?',
            [hashedPassword, decoded.userId]
        );

        res.json({ success: true, message: 'รีเซ็ตรหัสผ่านสำเร็จ' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

module.exports = router;
