// ========================================
// Authentication Middleware
// ========================================

const jwt = require('jsonwebtoken');
const db = require('../config/database');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'กรุณาเข้าสู่ระบบ'
            });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const [users] = await db.query(
            'SELECT id, email, name, role FROM users WHERE id = ?',
            [decoded.userId]
        );
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'ผู้ใช้ไม่ถูกต้อง'
            });
        }
        
        req.user = users[0];
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token ไม่ถูกต้อง'
        });
    }
};

const adminAuth = async (req, res, next) => {
    await auth(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: 'ไม่มีสิทธิ์เข้าถึง'
            });
        }
    });
};

module.exports = { auth, adminAuth };
