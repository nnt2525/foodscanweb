// ========================================
// Meal Plans Routes
// ========================================

const express = require('express');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get meal plan by date
router.get('/', auth, async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date || new Date().toISOString().split('T')[0];

        // Get or create meal plan for the date
        let [plans] = await db.query(
            'SELECT * FROM meal_plans WHERE user_id = ? AND date = ?',
            [req.user.id, targetDate]
        );

        let plan;
        if (plans.length === 0) {
            // Create new plan
            const [result] = await db.query(
                'INSERT INTO meal_plans (user_id, date) VALUES (?, ?)',
                [req.user.id, targetDate]
            );
            plan = { id: result.insertId, user_id: req.user.id, date: targetDate };
        } else {
            plan = plans[0];
        }

        // Get meal items
        const [items] = await db.query(
            `SELECT mi.*, f.name, f.calories, f.protein, f.carbs, f.fat
             FROM meal_items mi
             JOIN foods f ON mi.food_id = f.id
             WHERE mi.meal_plan_id = ?
             ORDER BY mi.created_at`,
            [plan.id]
        );

        // Group by meal type
        const meals = {
            breakfast: items.filter(i => i.meal_type === 'breakfast'),
            lunch: items.filter(i => i.meal_type === 'lunch'),
            dinner: items.filter(i => i.meal_type === 'dinner'),
            snacks: items.filter(i => i.meal_type === 'snacks')
        };

        // Calculate totals
        const totals = items.reduce((acc, item) => ({
            calories: acc.calories + (item.calories * item.quantity),
            protein: acc.protein + (item.protein * item.quantity),
            carbs: acc.carbs + (item.carbs * item.quantity),
            fat: acc.fat + (item.fat * item.quantity)
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        res.json({
            success: true,
            data: {
                plan,
                meals,
                totals
            }
        });
    } catch (error) {
        console.error('Get meal plan error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Add item to meal plan
router.post('/:planId/items', auth, async (req, res) => {
    try {
        const { planId } = req.params;
        const { food_id, meal_type, quantity = 1 } = req.body;

        // Verify plan ownership
        const [plans] = await db.query(
            'SELECT * FROM meal_plans WHERE id = ? AND user_id = ?',
            [planId, req.user.id]
        );

        if (plans.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบแผนอาหาร'
            });
        }

        // Add item
        const [result] = await db.query(
            'INSERT INTO meal_items (meal_plan_id, food_id, meal_type, quantity) VALUES (?, ?, ?, ?)',
            [planId, food_id, meal_type, quantity]
        );

        res.status(201).json({
            success: true,
            message: 'เพิ่มอาหารสำเร็จ',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Add meal item error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Remove item from meal plan
router.delete('/:planId/items/:itemId', auth, async (req, res) => {
    try {
        const { planId, itemId } = req.params;

        // Verify plan ownership
        const [plans] = await db.query(
            'SELECT * FROM meal_plans WHERE id = ? AND user_id = ?',
            [planId, req.user.id]
        );

        if (plans.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบแผนอาหาร'
            });
        }

        await db.query('DELETE FROM meal_items WHERE id = ? AND meal_plan_id = ?', [itemId, planId]);

        res.json({ success: true, message: 'ลบอาหารสำเร็จ' });
    } catch (error) {
        console.error('Remove meal item error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Update meal item (change quantity)
router.put('/:planId/items/:itemId', auth, async (req, res) => {
    try {
        const { planId, itemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 0.1) {
            return res.status(400).json({
                success: false,
                message: 'จำนวนต้องมากกว่า 0'
            });
        }

        // Verify plan ownership
        const [plans] = await db.query(
            'SELECT * FROM meal_plans WHERE id = ? AND user_id = ?',
            [planId, req.user.id]
        );

        if (plans.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบแผนอาหาร'
            });
        }

        // Verify item exists
        const [items] = await db.query(
            'SELECT * FROM meal_items WHERE id = ? AND meal_plan_id = ?',
            [itemId, planId]
        );

        if (items.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบรายการอาหาร'
            });
        }

        await db.query(
            'UPDATE meal_items SET quantity = ? WHERE id = ?',
            [quantity, itemId]
        );

        res.json({ success: true, message: 'แก้ไขจำนวนสำเร็จ' });
    } catch (error) {
        console.error('Update meal item error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// Clear all items for a meal plan
router.delete('/:planId/items', auth, async (req, res) => {
    try {
        const { planId } = req.params;

        // Verify plan ownership
        const [plans] = await db.query(
            'SELECT * FROM meal_plans WHERE id = ? AND user_id = ?',
            [planId, req.user.id]
        );

        if (plans.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบแผนอาหาร'
            });
        }

        await db.query('DELETE FROM meal_items WHERE meal_plan_id = ?', [planId]);

        res.json({ success: true, message: 'ล้างรายการสำเร็จ' });
    } catch (error) {
        console.error('Clear meal items error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

module.exports = router;
