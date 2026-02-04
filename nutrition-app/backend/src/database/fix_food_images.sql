-- ========================================
-- Fix Food Images - Better URLs
-- ========================================
USE nutritrack;

-- Fix Peanut Butter image
UPDATE foods SET 
    image_url = 'https://images.unsplash.com/photo-1598887142487-3c854d51eabb?w=400'
WHERE name LIKE 'Peanut Butter%';

-- Fix Beans images (ถูเป็นรูป pasta อยู่)
UPDATE foods SET 
    image_url = 'https://images.unsplash.com/photo-1628619876503-2db74e724757?w=400'
WHERE name LIKE 'Beans%';

-- Fix Flour image
UPDATE foods SET 
    image_url = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'
WHERE name LIKE 'Flour%';

-- ตรวจสอบผลลัพธ์
SELECT name, image_url FROM foods WHERE name LIKE 'Peanut%' OR name LIKE 'Beans%' OR name LIKE 'Flour%' LIMIT 15;
