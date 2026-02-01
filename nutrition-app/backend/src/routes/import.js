// ========================================
// Food Import Routes - NutriTrack
// Import foods from external sources (USDA, etc.)
// ========================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');
const usdaService = require('../services/usdaService');

// ========================================
// Search USDA Foods (Public)
// ========================================
router.get('/usda/search', async (req, res) => {
    try {
        const { q, page = 1, limit = 25 } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุคำค้นหาอย่างน้อย 2 ตัวอักษร'
            });
        }

        const result = await usdaService.searchFoods(q, {
            pageNumber: parseInt(page),
            pageSize: parseInt(limit)
        });

        res.json(result);
    } catch (error) {
        console.error('USDA search error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// ========================================
// Get USDA Food Details (Public)
// ========================================
router.get('/usda/:fdcId', async (req, res) => {
    try {
        const result = await usdaService.getFoodDetails(req.params.fdcId);
        res.json(result);
    } catch (error) {
        console.error('USDA get food error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// ========================================
// Import Single Food from USDA
// ========================================
router.post('/usda/import/:fdcId', auth, async (req, res) => {
    try {
        const { fdcId } = req.params;
        const { category_id, name_th } = req.body; // Optional Thai name and category

        // Check if already imported
        const [existing] = await db.query(
            'SELECT id FROM foods WHERE external_id = ? AND source = ?',
            [fdcId, 'usda']
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'อาหารนี้ถูก import แล้ว',
                food_id: existing[0].id
            });
        }

        // Get food details from USDA
        const result = await usdaService.getFoodDetails(fdcId);
        if (!result.success) {
            return res.status(400).json(result);
        }

        const food = result.food;

        // Insert into foods table
        const [insertResult] = await db.query(`
            INSERT INTO foods (
                name, name_en, calories, protein, carbs, fat, fiber,
                serving_size, category_id, source, external_id, brand,
                created_by, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            name_th || food.name_en,
            food.name_en,
            food.calories,
            food.protein,
            food.carbs,
            food.fat,
            food.fiber,
            food.serving_size,
            category_id || null,
            'usda',
            fdcId,
            food.brand,
            req.user.id,
            'approved' // Auto-approve USDA imports
        ]);

        const foodId = insertResult.insertId;

        // Insert nutrients if available
        if (food.nutrients && Object.keys(food.nutrients).length > 0) {
            await saveNutrients(foodId, food.nutrients);
        }

        // Insert portions if available
        if (food.portions && food.portions.length > 0) {
            await savePortions(foodId, food.portions);
        }

        // Log the import
        await db.query(`
            INSERT INTO food_import_log (source, external_id, food_id, status)
            VALUES (?, ?, ?, ?)
        `, ['usda', fdcId, foodId, 'success']);

        res.json({
            success: true,
            message: 'Import สำเร็จ',
            food_id: foodId
        });

    } catch (error) {
        console.error('USDA import error:', error);

        // Log failed import
        await db.query(`
            INSERT INTO food_import_log (source, external_id, status, message)
            VALUES (?, ?, ?, ?)
        `, ['usda', req.params.fdcId, 'failed', error.message]);

        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการ import' });
    }
});

// ========================================
// Bulk Import from USDA (Admin only)
// ========================================
router.post('/usda/bulk-import', adminAuth, async (req, res) => {
    try {
        const { fdcIds, category_id } = req.body;

        if (!Array.isArray(fdcIds) || fdcIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาระบุ fdcIds เป็น array'
            });
        }

        if (fdcIds.length > 50) {
            return res.status(400).json({
                success: false,
                message: 'สามารถ import ได้ไม่เกิน 50 รายการต่อครั้ง'
            });
        }

        // Get foods from USDA
        const result = await usdaService.getFoodsByIds(fdcIds);
        if (!result.success) {
            return res.status(400).json(result);
        }

        const imported = [];
        const skipped = [];
        const failed = [];

        for (const food of result.foods) {
            try {
                // Check if already imported
                const [existing] = await db.query(
                    'SELECT id FROM foods WHERE external_id = ? AND source = ?',
                    [food.external_id, 'usda']
                );

                if (existing.length > 0) {
                    skipped.push({ fdcId: food.external_id, reason: 'already_imported' });
                    continue;
                }

                // Insert food
                const [insertResult] = await db.query(`
                    INSERT INTO foods (
                        name, name_en, calories, protein, carbs, fat, fiber,
                        serving_size, category_id, source, external_id, brand,
                        created_by, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    food.name_en,
                    food.name_en,
                    food.calories,
                    food.protein,
                    food.carbs,
                    food.fat,
                    food.fiber,
                    food.serving_size,
                    category_id || null,
                    'usda',
                    food.external_id,
                    food.brand,
                    req.user.id,
                    'approved'
                ]);

                imported.push({ fdcId: food.external_id, foodId: insertResult.insertId });

                // Log success
                await db.query(`
                    INSERT INTO food_import_log (source, external_id, food_id, status)
                    VALUES (?, ?, ?, ?)
                `, ['usda', food.external_id, insertResult.insertId, 'success']);

            } catch (err) {
                failed.push({ fdcId: food.external_id, error: err.message });

                await db.query(`
                    INSERT INTO food_import_log (source, external_id, status, message)
                    VALUES (?, ?, ?, ?)
                `, ['usda', food.external_id, 'failed', err.message]);
            }
        }

        res.json({
            success: true,
            summary: {
                total: fdcIds.length,
                imported: imported.length,
                skipped: skipped.length,
                failed: failed.length
            },
            imported,
            skipped,
            failed
        });

    } catch (error) {
        console.error('Bulk import error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
});

// ========================================
// Helper Functions
// ========================================
async function saveNutrients(foodId, nutrients) {
    // Get nutrient IDs from database
    const [dbNutrients] = await db.query('SELECT id, code FROM nutrients');
    const nutrientMap = {};
    dbNutrients.forEach(n => { nutrientMap[n.code] = n.id; });

    const values = [];
    for (const [code, amount] of Object.entries(nutrients)) {
        if (nutrientMap[code] && amount > 0) {
            values.push([foodId, nutrientMap[code], amount]);
        }
    }

    if (values.length > 0) {
        await db.query(`
            INSERT INTO food_nutrients (food_id, nutrient_id, amount)
            VALUES ?
            ON DUPLICATE KEY UPDATE amount = VALUES(amount)
        `, [values]);
    }
}

async function savePortions(foodId, portions) {
    const values = portions.map((p, i) => [
        foodId,
        p.name,
        p.grams,
        i === 0 // First portion is default
    ]);

    if (values.length > 0) {
        await db.query(`
            INSERT INTO portion_sizes (food_id, name, grams, is_default)
            VALUES ?
        `, [values]);
    }
}

module.exports = router;
