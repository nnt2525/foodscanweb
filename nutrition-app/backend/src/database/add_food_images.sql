-- ========================================
-- Add Food Images - NutriTrack
-- Run this in phpMyAdmin to add images
-- ========================================

-- เลือก Database ก่อน
USE nutritrack;

-- อัปเดตรูปภาพอาหาร (ใช้ภาพจาก Unsplash)
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400' WHERE name LIKE '%ข้าวผัด%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400' WHERE name LIKE '%ต้มยำ%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400' WHERE name LIKE '%ผัดกะเพรา%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400' WHERE name LIKE '%ส้มตำ%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' WHERE name LIKE '%แกงเขียว%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400' WHERE name LIKE '%สลัด%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' WHERE name LIKE '%ผัก%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400' WHERE name LIKE '%มาม่า%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400' WHERE name LIKE '%ไก่%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400' WHERE name LIKE '%อกไก่%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1544384899-8a458e3b31cc?w=400' WHERE name LIKE '%ปลา%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400' WHERE name LIKE '%นม%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400' WHERE name LIKE '%โยเกิร์ต%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=400' WHERE name LIKE '%กาแฟ%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' WHERE name LIKE '%น้ำผลไม้%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400' WHERE name LIKE '%น้ำส้ม%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' WHERE name LIKE '%ขนมปัง%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=400' WHERE name LIKE '%ไข่%';
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400' WHERE name LIKE '%อาหารเช้า%';

-- Default image สำหรับอาหารที่ยังไม่มีรูป
UPDATE foods SET image_url = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' WHERE image_url IS NULL;

-- ตรวจสอบผล
SELECT id, name, image_url FROM foods LIMIT 20;
