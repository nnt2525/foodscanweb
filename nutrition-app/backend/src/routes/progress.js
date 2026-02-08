// ========================================
// Progress Routes
// ========================================

const express = require('express');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get weekly progress
router.get('/weekly', auth, async (req, res) => {
    try {
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        // Get daily totals for the last 7 days
        const [dailyData] = await db.query(`
            SELECT 
                DATE(mp.date) as date,
                SUM(f.calories * mi.quantity) as calories,
                SUM(f.protein * mi.quantity) as protein,
                SUM(f.carbs * mi.quantity) as carbs,
                SUM(f.fat * mi.quantity) as fat
            FROM meal_plans mp
            JOIN meal_items mi ON mp.id = mi.meal_plan_id
            JOIN foods f ON mi.food_id = f.id
            WHERE mp.user_id = ? AND mp.date >= ? AND mp.date <= ?
            GROUP BY DATE(mp.date)
            ORDER BY date
        `, [req.user.id, weekAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]]);
        
        // Get user's daily goal
        const [users] = await db.query(
            'SELECT daily_calories FROM users WHERE id = ?',
            [req.user.id]
        );
        const dailyGoal = users[0]?.daily_calories || 2000;
        
        // Calculate days on target
        const daysOnTarget = dailyData.filter(d => 
            d.calories >= dailyGoal * 0.9 && d.calories <= dailyGoal * 1.1
        ).length;
        
        // Calculate totals
        const totals = dailyData.reduce((acc, day) => ({
            calories: acc.calories + Number(day.calories || 0),
            protein: acc.protein + Number(day.protein || 0),
            carbs: acc.carbs + Number(day.carbs || 0),
            fat: acc.fat + Number(day.fat || 0)
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
        
        const avgCalories = dailyData.length > 0 
            ? Math.round(totals.calories / dailyData.length) 
            : 0;
        
        res.json({
            success: true,
            data: {
                daily: dailyData,
                totals,
                avgCalories,
                daysOnTarget,
                dailyGoal
            }
        });
    } catch (error) {
        console.error('Get weekly progress error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Get achievements
router.get('/achievements', auth, async (req, res) => {
    try {
        const [achievements] = await db.query(
            `SELECT * FROM achievements WHERE user_id = ? ORDER BY earned_at DESC`,
            [req.user.id]
        );
        
        res.json({ success: true, data: achievements });
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

module.exports = router;
