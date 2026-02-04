-- ========================================
-- Reset Users Script (Delete & Recreate)
-- ========================================
USE nutritrack;

-- 1. ลบ Users เดิม (ถ้ามี)
DELETE FROM users WHERE email IN ('admin@nutritrack.com', 'user@nutritrack.com');

-- 2. สร้างใหม่ด้วยรหัสผ่าน "admin123" (ทั้งคู่ใช้ hash เดียวกันเพื่อความชัวร์)
-- Hash: $2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQHLVLmXRbJZz6LrVQDxGIFqJ6Iyje
INSERT INTO users (email, password, name, role, daily_calories, weight, height, age, gender) VALUES
('admin@nutritrack.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQHLVLmXRbJZz6LrVQDxGIFqJ6Iyje', 'Admin NutriTrack', 'admin', 2000, 70, 175, 30, 'male'),
('user@nutritrack.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQHLVLmXRbJZz6LrVQDxGIFqJ6Iyje', 'User NutriTrack', 'user', 1800, 65, 170, 25, 'female');

-- ========================================
-- ตรวจสอบข้อมูล
-- ========================================
SELECT id, email, role, password FROM users;
