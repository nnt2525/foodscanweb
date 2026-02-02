-- Reset Admin Password
-- Password: admin123 (bcrypt hash)
USE nutritrack;

UPDATE users 
SET password = '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQHLVLmXRbJZz6LrVQDxGIFqJ6Iyje'
WHERE email = 'admin@nutritrack.com';

-- ถ้าไม่มี admin ให้สร้างใหม่
INSERT IGNORE INTO users (email, password, name, role, daily_calories) 
VALUES ('admin@nutritrack.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQHLVLmXRbJZz6LrVQDxGIFqJ6Iyje', 'Admin NutriTrack', 'admin', 2000);

-- ตรวจสอบผลลัพธ์
SELECT id, email, name, role FROM users WHERE role = 'admin';
