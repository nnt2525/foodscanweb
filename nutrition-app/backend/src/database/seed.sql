-- ========================================
-- NutriTrack Database Seed Data
-- ========================================

-- Create Database
CREATE DATABASE IF NOT EXISTS nutritrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nutritrack;

-- ========================================
-- Tables
-- ========================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    avatar VARCHAR(255),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    age INT,
    gender ENUM('male', 'female'),
    activity_level VARCHAR(50),
    goal VARCHAR(50),
    daily_calories INT DEFAULT 2000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foods Table
CREATE TABLE IF NOT EXISTS foods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    calories INT NOT NULL,
    protein DECIMAL(6,2) DEFAULT 0,
    carbs DECIMAL(6,2) DEFAULT 0,
    fat DECIMAL(6,2) DEFAULT 0,
    fiber DECIMAL(6,2) DEFAULT 0,
    serving_size VARCHAR(100),
    image_url VARCHAR(500),
    category_id INT,
    created_by INT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Meal Plans Table
CREATE TABLE IF NOT EXISTS meal_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date)
);

-- Meal Items Table
CREATE TABLE IF NOT EXISTS meal_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meal_plan_id INT NOT NULL,
    food_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snacks') NOT NULL,
    quantity DECIMAL(5,2) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    badge_type VARCHAR(50) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_badge (user_id, badge_type)
);

-- ========================================
-- Seed Data
-- ========================================

-- Admin User (password: admin123)
INSERT INTO users (email, password, name, role, daily_calories) VALUES
('admin@nutritrack.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQHLVLmXRbJZz6LrVQDxGIFqJ6Iyje', 'Admin NutriTrack', 'admin', 2000);

-- User Account (password: user123)
INSERT INTO users (email, password, name, role, weight, height, age, gender, daily_calories) VALUES
('user@nutritrack.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQHLVLmXRbJZz6LrVQDxGIFqJ6Iyje', 'User NutriTrack', 'user', 70.00, 170.00, 25, 'male', 2000);

-- Categories
INSERT INTO categories (name, icon, description) VALUES
('อาหารไทย', '🍜', 'อาหารไทยต้นตำรับ'),
('อาหารคลีน', '🥗', 'อาหารสุขภาพ แคลอรี่ต่ำ'),
('ฟาสต์ฟู้ด', '🍔', 'อาหารจานด่วน'),
('เครื่องดื่ม', '🥤', 'เครื่องดื่มและน้ำผลไม้'),
('ผลไม้', '🍎', 'ผลไม้สดต่างๆ'),
('ของหวาน', '🍰', 'ขนมและของหวาน');

-- Foods (Approved)
INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving_size, category_id, created_by, status) VALUES
('ข้าวผัดไก่', 450, 25, 60, 12, 2, '1 จาน (300g)', 1, 1, 'approved'),
('ต้มยำกุ้ง', 180, 22, 8, 6, 2, '1 ชาม (350ml)', 1, 1, 'approved'),
('ผัดกะเพราหมูสับ', 520, 28, 45, 25, 3, '1 จาน', 1, 1, 'approved'),
('ส้มตำไทย', 150, 5, 25, 4, 5, '1 จาน', 1, 1, 'approved'),
('แกงเขียวหวานไก่', 380, 22, 15, 25, 3, '1 ชาม', 1, 1, 'approved'),
('สลัดผักรวม', 120, 4, 15, 5, 6, '1 จาน (200g)', 2, 1, 'approved'),
('อกไก่ย่าง', 280, 42, 0, 11, 0, '150g', 2, 1, 'approved'),
('ปลาแซลมอนย่าง', 310, 38, 0, 16, 0, '150g', 2, 1, 'approved'),
('ไข่ต้ม', 78, 6, 0.5, 5, 0, '1 ฟอง', 2, 1, 'approved'),
('โยเกิร์ตกรีก', 100, 17, 6, 0.7, 0, '1 ถ้วย (170g)', 2, 1, 'approved'),
('แฮมเบอร์เกอร์เนื้อ', 550, 28, 45, 30, 2, '1 ชิ้น', 3, 1, 'approved'),
('พิซซ่าชีส', 285, 12, 36, 10, 2, '1 ชิ้น', 3, 1, 'approved'),
('เฟรนช์ฟรายส์', 365, 4, 48, 17, 4, 'L (150g)', 3, 1, 'approved'),
('ไก่ทอด', 320, 22, 12, 20, 1, '1 ชิ้น', 3, 1, 'approved'),
('น้ำส้มคั้น', 110, 2, 26, 0, 0.5, '1 แก้ว (240ml)', 4, 1, 'approved'),
('กาแฟลาเต้', 190, 10, 18, 7, 0, '1 แก้ว (350ml)', 4, 1, 'approved'),
('ชาเขียวไม่หวาน', 0, 0, 0, 0, 0, '1 แก้ว (300ml)', 4, 1, 'approved'),
('สมูทตี้ผลไม้รวม', 180, 3, 40, 1, 4, '1 แก้ว (400ml)', 4, 1, 'approved'),
('กล้วยหอม', 105, 1.3, 27, 0.4, 3, '1 ลูก', 5, 1, 'approved'),
('แอปเปิ้ล', 95, 0.5, 25, 0.3, 4, '1 ลูก', 5, 1, 'approved'),
('ส้ม', 62, 1.2, 15, 0.2, 3, '1 ลูก', 5, 1, 'approved'),
('มะม่วงสุก', 135, 1, 35, 0.5, 2, '1 ลูก', 5, 1, 'approved'),
('ไอศกรีมวานิลลา', 207, 4, 24, 11, 0, '1 ถ้วย (100g)', 6, 1, 'approved'),
('บราวนี่', 280, 3, 35, 15, 2, '1 ชิ้น', 6, 1, 'approved'),
('โดนัท', 253, 4, 31, 12, 1, '1 ชิ้น', 6, 1, 'approved');

-- Pending Foods (for admin to approve)
INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving_size, category_id, created_by, status) VALUES
('ข้าวมันไก่', 600, 30, 65, 22, 1, '1 จาน', 1, 1, 'pending'),
('ก๋วยเตี๋ยวเรือ', 380, 18, 45, 14, 2, '1 ชาม', 1, 1, 'pending'),
('โจ๊กหมู', 250, 15, 35, 6, 1, '1 ชาม', 1, 1, 'pending'),
('ลาบหมู', 280, 22, 8, 18, 2, '1 จาน', 1, 1, 'pending');

-- ========================================
-- Indexes
-- ========================================
CREATE INDEX idx_foods_status ON foods(status);
CREATE INDEX idx_foods_category ON foods(category_id);
CREATE INDEX idx_meal_plans_user_date ON meal_plans(user_id, date);
CREATE INDEX idx_meal_items_plan ON meal_items(meal_plan_id);
