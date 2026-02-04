-- ========================================
-- Update USDA Foods with Better Images & Categories
-- ========================================
USE nutritrack;

-- ========================================
-- 1. อัปเดตรูปภาพตามประเภทอาหาร USDA
-- ========================================

-- Beans (ถั่ว) → อาหารคลีน (category 2)
UPDATE foods SET 
    category_id = 2,
    image_url = 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=400'
WHERE name LIKE 'Beans%' AND (image_url LIKE '%546069901%' OR image_url IS NULL);

-- Rice (ข้าว) → อาหารคลีน (category 2)
UPDATE foods SET 
    category_id = 2,
    image_url = 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400'
WHERE name LIKE 'Rice%' AND (image_url LIKE '%546069901%' OR image_url IS NULL);

-- Oats (ข้าวโอ๊ต) → อาหารคลีน (category 2)
UPDATE foods SET 
    category_id = 2,
    image_url = 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400'
WHERE name LIKE 'Oats%' AND (image_url LIKE '%546069901%' OR image_url IS NULL);

-- Pasta/Spaghetti → อาหารคลีน (category 2)
UPDATE foods SET 
    category_id = 2,
    image_url = 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400'
WHERE (name LIKE 'Pasta%' OR name LIKE 'Spaghetti%') AND (image_url LIKE '%546069901%' OR image_url IS NULL);

-- Flour → อาหารคลีน (category 2)
UPDATE foods SET 
    category_id = 2,
    image_url = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
WHERE name LIKE 'Flour%' AND (image_url LIKE '%546069901%' OR image_url IS NULL);

-- Peanut Butter → อาหารคลีน (category 2)
UPDATE foods SET 
    category_id = 2,
    image_url = 'https://images.unsplash.com/photo-1611510338559-2f463335092c?w=400'
WHERE name LIKE 'Peanut Butter%' AND (image_url LIKE '%546069901%' OR image_url IS NULL);

-- Sauce (ซอส) → อาหารไทย/ทั่วไป (category 1)
UPDATE foods SET 
    category_id = 1,
    image_url = 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400'
WHERE (name LIKE '%Sauce%' OR name LIKE 'Salsa%') AND (image_url LIKE '%546069901%' OR image_url IS NULL);

-- Tomato products → อาหารไทย (category 1)
UPDATE foods SET 
    category_id = 1,
    image_url = 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'
WHERE name LIKE 'Tomato%' AND (image_url LIKE '%546069901%' OR image_url IS NULL);

-- Fruit/Raisin → ผลไม้ (category 5)
UPDATE foods SET 
    category_id = 5,
    image_url = 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400'
WHERE (name LIKE 'Raisins%' OR name LIKE 'Apple%' OR name LIKE 'Fruit%') AND (image_url LIKE '%546069901%' OR image_url IS NULL);

-- Canned vegetables → อาหารคลีน (category 2)
UPDATE foods SET 
    category_id = 2,
    image_url = 'https://images.unsplash.com/photo-1583224994076-e1e6c0b93e9d?w=400'
WHERE name LIKE '%Canned%' AND name NOT LIKE 'Beans%' AND (image_url LIKE '%546069901%' OR image_url IS NULL);

-- ========================================
-- 2. อัปเดตอาหารที่ไม่มีรูปให้ใช้รูป default ตาม category
-- ========================================

-- Default images per category
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400' 
WHERE category_id = 1 AND (image_url IS NULL OR image_url = '');

UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' 
WHERE category_id = 2 AND (image_url IS NULL OR image_url = '');

UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400' 
WHERE category_id = 3 AND (image_url IS NULL OR image_url = '');

UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' 
WHERE category_id = 4 AND (image_url IS NULL OR image_url = '');

UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400' 
WHERE category_id = 5 AND (image_url IS NULL OR image_url = '');

UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400' 
WHERE category_id = 6 AND (image_url IS NULL OR image_url = '');

-- ========================================
-- 3. ตรวจสอบผลลัพธ์
-- ========================================
SELECT category_id, COUNT(*) as count FROM foods WHERE status = 'approved' GROUP BY category_id ORDER BY category_id;
SELECT name, category_id, image_url FROM foods WHERE status = 'approved' LIMIT 20;
