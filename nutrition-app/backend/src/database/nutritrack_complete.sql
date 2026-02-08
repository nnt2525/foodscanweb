-- ========================================
-- NutriTrack Database - Complete Schema
-- Version: 2.0
-- Date: February 2026
-- ========================================

-- Drop database if exists and create new
DROP DATABASE IF EXISTS nutritrack;
CREATE DATABASE nutritrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nutritrack;

-- ========================================
-- Table: users
-- ========================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    avatar VARCHAR(255) DEFAULT NULL,
    weight DECIMAL(5,2) DEFAULT NULL,
    height DECIMAL(5,2) DEFAULT NULL,
    age INT DEFAULT NULL,
    gender ENUM('male', 'female') DEFAULT NULL,
    activity_level ENUM('sedentary', 'light', 'moderate', 'active', 'very_active') DEFAULT 'moderate',
    goal ENUM('lose', 'maintain', 'gain') DEFAULT 'maintain',
    daily_calorie_goal INT DEFAULT 2000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table: categories
-- ========================================
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) DEFAULT NULL,
    icon VARCHAR(10) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table: foods
-- ========================================
CREATE TABLE foods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) DEFAULT NULL,
    brand VARCHAR(100) DEFAULT NULL,
    barcode VARCHAR(50) DEFAULT NULL,
    calories INT NOT NULL DEFAULT 0,
    protein DECIMAL(6,2) DEFAULT 0.00,
    carbs DECIMAL(6,2) DEFAULT 0.00,
    fat DECIMAL(6,2) DEFAULT 0.00,
    fiber DECIMAL(6,2) DEFAULT 0.00,
    sugar DECIMAL(6,2) DEFAULT 0.00,
    sodium DECIMAL(6,2) DEFAULT 0.00,
    serving_size VARCHAR(50) DEFAULT '100g',
    category_id INT DEFAULT NULL,
    source VARCHAR(50) DEFAULT 'manual',
    image_url VARCHAR(500) DEFAULT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_by INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_barcode (barcode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table: meal_plans
-- ========================================
CREATE TABLE meal_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date),
    INDEX idx_user_date (user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table: meal_plan_items
-- ========================================
CREATE TABLE meal_plan_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meal_plan_id INT NOT NULL,
    food_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snacks') NOT NULL,
    quantity DECIMAL(5,2) DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
    INDEX idx_meal_plan (meal_plan_id),
    INDEX idx_meal_type (meal_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table: food_logs
-- ========================================
CREATE TABLE food_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snacks') NOT NULL,
    quantity DECIMAL(5,2) DEFAULT 1.00,
    log_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, log_date),
    INDEX idx_log_date (log_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table: weight_logs
-- ========================================
CREATE TABLE weight_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    log_date DATE NOT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_weight_date (user_id, log_date),
    INDEX idx_user_date (user_id, log_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table: water_logs
-- ========================================
CREATE TABLE water_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount INT NOT NULL DEFAULT 250,
    log_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, log_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table: achievements
-- ========================================
CREATE TABLE achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    icon VARCHAR(10) DEFAULT NULL,
    requirement_type VARCHAR(50) NOT NULL,
    requirement_value INT NOT NULL,
    points INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table: user_achievements
-- ========================================
CREATE TABLE user_achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_achievement (user_id, achievement_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table: posts (Community)
-- ========================================
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table: comments
-- ========================================
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Table: likes
-- ========================================
CREATE TABLE likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_user (post_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- SEED DATA: Categories
-- ========================================
INSERT INTO categories (name, name_en, icon, description) VALUES
('อาหารไทย', 'Thai Food', '🍜', 'อาหารไทยแท้ๆ รสชาติดั้งเดิม'),
('อาหารคลีน', 'Clean Food', '🥗', 'อาหารเพื่อสุขภาพ ไขมันต่ำ'),
('ฟาสต์ฟู้ด', 'Fast Food', '🍔', 'อาหารจานด่วน'),
('เครื่องดื่ม', 'Beverages', '🥤', 'เครื่องดื่มทุกชนิด'),
('ผลไม้', 'Fruits', '🍎', 'ผลไม้สดและแปรรูป'),
('ของหวาน', 'Desserts', '🍰', 'ขนมหวานและของทานเล่น');

-- ========================================
-- SEED DATA: Admin User
-- Password: admin123 (bcrypt hashed)
-- ========================================
INSERT INTO users (email, password, name, role, daily_calorie_goal) VALUES
('admin@nutritrack.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin NutriTrack', 'admin', 2000);

-- ========================================
-- SEED DATA: Achievements
-- ========================================
INSERT INTO achievements (name, description, icon, requirement_type, requirement_value, points) VALUES
('เริ่มต้นดี', 'บันทึกอาหารครั้งแรก', '🌟', 'food_logs', 1, 10),
('นักบันทึก', 'บันทึกอาหาร 7 วันติดต่อกัน', '📝', 'streak_days', 7, 50),
('ดื่มน้ำเก่ง', 'ดื่มน้ำครบ 8 แก้วใน 1 วัน', '💧', 'water_daily', 8, 20),
('นักสำรวจ', 'ลองอาหาร 50 เมนู', '🔍', 'unique_foods', 50, 100),
('ตรงเป้า', 'ทำตามเป้าหมายแคลอรี่ 7 วัน', '🎯', 'goal_days', 7, 75);

-- ========================================
-- SEED DATA: Sample Thai Foods (First 50)
-- Full 850 foods should be imported separately
-- ========================================
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, status, source) VALUES
-- อาหารไทย
('ข้าวผัดกระเพราหมูสับ', 'Basil Pork Fried Rice', 450, 18, 55, 18, 2, '1 จาน', 1, 'approved', 'thai_db'),
('ต้มยำกุ้ง', 'Tom Yum Goong', 120, 15, 8, 4, 1, '1 ถ้วย', 1, 'approved', 'thai_db'),
('ผัดไทย', 'Pad Thai', 380, 12, 45, 16, 2, '1 จาน', 1, 'approved', 'thai_db'),
('แกงเขียวหวานไก่', 'Green Curry Chicken', 320, 22, 12, 22, 3, '1 ถ้วย', 1, 'approved', 'thai_db'),
('ส้มตำไทย', 'Som Tam Thai', 150, 4, 28, 4, 5, '1 จาน', 1, 'approved', 'thai_db'),
('ข้าวมันไก่', 'Hainanese Chicken Rice', 550, 28, 48, 26, 1, '1 จาน', 1, 'approved', 'thai_db'),
('ก๋วยเตี๋ยวเรือ', 'Boat Noodles', 280, 15, 32, 10, 1, '1 ชาม', 1, 'approved', 'thai_db'),
('ข้าวหมูแดง', 'Red Pork Rice', 480, 25, 52, 18, 1, '1 จาน', 1, 'approved', 'thai_db'),
('ลาบหมู', 'Laab Moo', 180, 20, 5, 10, 2, '1 จาน', 1, 'approved', 'thai_db'),
('น้ำตกหมู', 'Waterfall Pork', 200, 22, 6, 10, 1, '1 จาน', 1, 'approved', 'thai_db'),
('ยำวุ้นเส้น', 'Glass Noodle Salad', 180, 8, 25, 6, 2, '1 จาน', 1, 'approved', 'thai_db'),
('แกงส้มผักรวม', 'Sour Curry Vegetable', 120, 8, 15, 4, 4, '1 ถ้วย', 1, 'approved', 'thai_db'),
('ผัดกะเพราไก่', 'Basil Chicken Stir-fry', 280, 25, 8, 18, 1, '1 จาน', 1, 'approved', 'thai_db'),
('ข้าวคลุกกะปิ', 'Shrimp Paste Fried Rice', 420, 15, 50, 18, 2, '1 จาน', 1, 'approved', 'thai_db'),
('แกงมัสมั่นไก่', 'Massaman Chicken Curry', 380, 20, 22, 24, 3, '1 ถ้วย', 1, 'approved', 'thai_db'),

-- อาหารคลีน
('อกไก่ย่าง', 'Grilled Chicken Breast', 165, 31, 0, 4, 0, '100g', 2, 'approved', 'clean'),
('สลัดผักรวม', 'Mixed Vegetable Salad', 45, 2, 8, 0.5, 3, '1 จาน', 2, 'approved', 'clean'),
('ไข่ต้ม', 'Boiled Egg', 78, 6, 0.6, 5, 0, '1 ฟอง', 2, 'approved', 'clean'),
('ปลาแซลมอนอบ', 'Baked Salmon', 208, 20, 0, 13, 0, '100g', 2, 'approved', 'clean'),
('บร็อคโคลี่นึ่ง', 'Steamed Broccoli', 35, 3, 7, 0.4, 3, '1 ถ้วย', 2, 'approved', 'clean'),
('ข้าวกล้อง', 'Brown Rice', 216, 5, 45, 2, 4, '1 ถ้วย', 2, 'approved', 'clean'),
('เต้าหู้ทอด', 'Fried Tofu', 150, 10, 5, 10, 1, '100g', 2, 'approved', 'clean'),
('กุ้งลวก', 'Boiled Shrimp', 99, 24, 0.2, 0.3, 0, '100g', 2, 'approved', 'clean'),

-- ฟาสต์ฟู้ด
('แฮมเบอร์เกอร์เนื้อ', 'Beef Burger', 540, 25, 40, 30, 2, '1 ชิ้น', 3, 'approved', 'fastfood'),
('พิซซ่าชีส', 'Cheese Pizza', 285, 12, 36, 10, 2, '1 ชิ้น', 3, 'approved', 'fastfood'),
('ไก่ทอด', 'Fried Chicken', 320, 22, 12, 20, 0, '1 ชิ้น', 3, 'approved', 'fastfood'),
('เฟรนช์ฟรายส์', 'French Fries', 312, 4, 41, 15, 4, '1 ถ้วย', 3, 'approved', 'fastfood'),
('ฮอทดอก', 'Hot Dog', 290, 11, 22, 18, 1, '1 ชิ้น', 3, 'approved', 'fastfood'),

-- เครื่องดื่ม
('กาแฟดำ', 'Black Coffee', 2, 0.3, 0, 0, 0, '1 แก้ว', 4, 'approved', 'beverage'),
('ชาเขียว', 'Green Tea', 0, 0, 0, 0, 0, '1 แก้ว', 4, 'approved', 'beverage'),
('น้ำส้มคั้น', 'Orange Juice', 112, 2, 26, 0.5, 0.5, '1 แก้ว', 4, 'approved', 'beverage'),
('นมสด', 'Fresh Milk', 149, 8, 12, 8, 0, '1 แก้ว', 4, 'approved', 'beverage'),
('น้ำมะพร้าว', 'Coconut Water', 46, 2, 9, 0.5, 3, '1 แก้ว', 4, 'approved', 'beverage'),
('ชานมไข่มุก', 'Bubble Milk Tea', 350, 3, 56, 12, 0, '1 แก้ว', 4, 'approved', 'beverage'),

-- ผลไม้
('กล้วยหอม', 'Banana', 105, 1.3, 27, 0.4, 3, '1 ลูก', 5, 'approved', 'fruit'),
('แอปเปิ้ล', 'Apple', 95, 0.5, 25, 0.3, 4, '1 ลูก', 5, 'approved', 'fruit'),
('ส้ม', 'Orange', 62, 1.2, 15, 0.2, 3, '1 ลูก', 5, 'approved', 'fruit'),
('มะม่วงสุก', 'Ripe Mango', 135, 1, 35, 0.6, 2, '1 ลูก', 5, 'approved', 'fruit'),
('แตงโม', 'Watermelon', 46, 0.9, 12, 0.2, 0.6, '1 ถ้วย', 5, 'approved', 'fruit'),
('องุ่น', 'Grapes', 104, 1, 27, 0.2, 1.4, '1 ถ้วย', 5, 'approved', 'fruit'),
('สับปะรด', 'Pineapple', 82, 0.9, 22, 0.2, 2.3, '1 ถ้วย', 5, 'approved', 'fruit'),
('มังคุด', 'Mangosteen', 73, 0.4, 18, 0.6, 2, '100g', 5, 'approved', 'fruit'),

-- ของหวาน
('ไอศกรีมวานิลา', 'Vanilla Ice Cream', 207, 4, 24, 11, 0, '1 ถ้วย', 6, 'approved', 'dessert'),
('เค้กช็อกโกแลต', 'Chocolate Cake', 352, 5, 51, 14, 2, '1 ชิ้น', 6, 'approved', 'dessert'),
('ขนมปังนม', 'Milk Bread', 120, 4, 22, 2, 1, '1 ชิ้น', 6, 'approved', 'dessert'),
('ข้าวเหนียวมะม่วง', 'Mango Sticky Rice', 420, 6, 72, 12, 2, '1 จาน', 6, 'approved', 'dessert'),
('บัวลอย', 'Bua Loy', 250, 4, 45, 6, 1, '1 ถ้วย', 6, 'approved', 'dessert'),
('ทองหยิบ', 'Thong Yip', 150, 3, 20, 7, 0, '3 ชิ้น', 6, 'approved', 'dessert'),
('ฝอยทอง', 'Foi Thong', 180, 4, 25, 8, 0, '1 ขีด', 6, 'approved', 'dessert'),
('ลอดช่องไทย', 'Lod Chong Thai', 220, 2, 48, 4, 1, '1 ถ้วย', 6, 'approved', 'dessert');

-- ========================================
-- End of NutriTrack Database Schema
-- ========================================
