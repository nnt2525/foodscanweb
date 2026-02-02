-- ========================================
-- NutriTrack: Complete Database Update (Phase B + Thai Data)
-- Run this single file to update your database schema and add data
-- ========================================

USE nutritrack;

-- ========================================
-- PART 1: Phase B Schema Enhancements
-- ========================================

-- 1. Nutrients Reference Table
CREATE TABLE IF NOT EXISTS nutrients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,         -- e.g., 'VITA', 'VITC', 'IRON'
    name_th VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL,                -- e.g., 'mg', 'g', 'mcg'
    daily_value DECIMAL(10,2),
    category ENUM('macro', 'vitamin', 'mineral', 'other') DEFAULT 'other',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Food Nutrients Junction Table
CREATE TABLE IF NOT EXISTS food_nutrients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    food_id INT NOT NULL,
    nutrient_id INT NOT NULL,
    amount DECIMAL(10,4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
    FOREIGN KEY (nutrient_id) REFERENCES nutrients(id) ON DELETE CASCADE,
    UNIQUE KEY unique_food_nutrient (food_id, nutrient_id)
);

-- 3. Update Foods Table
-- Add support for external IDs, barcodes, and English names
ALTER TABLE foods 
    ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'manual',
    ADD COLUMN IF NOT EXISTS external_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
    ADD COLUMN IF NOT EXISTS barcode VARCHAR(50),
    ADD COLUMN IF NOT EXISTS brand VARCHAR(100);

-- 4. Portion Sizes Table
CREATE TABLE IF NOT EXISTS portion_sizes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    food_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,               -- e.g., '1 cup', '100g'
    grams DECIMAL(8,2) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- 5. Food Import Log
CREATE TABLE IF NOT EXISTS food_import_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    source VARCHAR(50) NOT NULL,
    external_id VARCHAR(100) NOT NULL,
    food_id INT,
    status ENUM('success', 'failed', 'duplicate') NOT NULL,
    message TEXT,
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL
);

-- ========================================
-- PART 2: Password Reset Support
-- ========================================

ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS reset_token VARCHAR(500) NULL,
    ADD COLUMN IF NOT EXISTS reset_token_expires DATETIME NULL;

-- ========================================
-- PART 3: Seed Reference Data (Nutrients)
-- ========================================

-- Macronutrients
INSERT IGNORE INTO nutrients (code, name_th, name_en, unit, daily_value, category) VALUES
('ENERGY', 'พลังงาน', 'Energy', 'kcal', 2000, 'macro'),
('PROTEIN', 'โปรตีน', 'Protein', 'g', 50, 'macro'),
('CARBS', 'คาร์โบไฮเดรต', 'Carbohydrates', 'g', 275, 'macro'),
('FAT', 'ไขมัน', 'Fat', 'g', 78, 'macro'),
('FIBER', 'ใยอาหาร', 'Fiber', 'g', 28, 'macro'),
('SUGAR', 'น้ำตาล', 'Sugar', 'g', 50, 'macro');

-- Vitamins
INSERT IGNORE INTO nutrients (code, name_th, name_en, unit, daily_value, category) VALUES
('VITA', 'วิตามินเอ', 'Vitamin A', 'mcg', 900, 'vitamin'),
('VITB1', 'วิตามินบี1', 'Vitamin B1', 'mg', 1.2, 'vitamin'),
('VITB2', 'วิตามินบี2', 'Vitamin B2', 'mg', 1.3, 'vitamin'),
('VITB3', 'วิตามินบี3', 'Vitamin B3', 'mg', 16, 'vitamin'),
('VITB6', 'วิตามินบี6', 'Vitamin B6', 'mg', 1.7, 'vitamin'),
('VITB12', 'วิตามินบี12', 'Vitamin B12', 'mcg', 2.4, 'vitamin'),
('VITC', 'วิตามินซี', 'Vitamin C', 'mg', 90, 'vitamin'),
('VITD', 'วิตามินดี', 'Vitamin D', 'mcg', 20, 'vitamin'),
('VITE', 'วิตามินอี', 'Vitamin E', 'mg', 15, 'vitamin'),
('VITK', 'วิตามินเค', 'Vitamin K', 'mcg', 120, 'vitamin'),
('FOLATE', 'กรดโฟลิก', 'Folate', 'mcg', 400, 'vitamin');

-- Minerals
INSERT IGNORE INTO nutrients (code, name_th, name_en, unit, daily_value, category) VALUES
('CALCIUM', 'แคลเซียม', 'Calcium', 'mg', 1000, 'mineral'),
('IRON', 'ธาตุเหล็ก', 'Iron', 'mg', 18, 'mineral'),
('MAGNESIUM', 'แมกนีเซียม', 'Magnesium', 'mg', 400, 'mineral'),
('PHOSPHORUS', 'ฟอสฟอรัส', 'Phosphorus', 'mg', 1000, 'mineral'),
('POTASSIUM', 'โพแทสเซียม', 'Potassium', 'mg', 3500, 'mineral'),
('SODIUM', 'โซเดียม', 'Sodium', 'mg', 2300, 'mineral'),
('ZINC', 'สังกะสี', 'Zinc', 'mg', 11, 'mineral'),
('COPPER', 'ทองแดง', 'Copper', 'mg', 0.9, 'mineral'),
('SELENIUM', 'ซีลีเนียม', 'Selenium', 'mcg', 55, 'mineral');

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_nutrients_code ON nutrients(code);
CREATE INDEX IF NOT EXISTS idx_food_nutrients_food ON food_nutrients(food_id);

-- ========================================
-- PART 4: Seed Categories (Ensure IDs 1-8 exist)
-- ========================================

INSERT IGNORE INTO categories (id, name, icon, description) VALUES
(1, 'อาหารจานเดียว', '🍚', 'Rice dishes'),
(2, 'เส้น/ก๋วยเตี๋ยว', '🍜', 'Noodles'),
(3, 'แกง/ต้ม', '🍛', 'Curries/Soups'),
(4, 'ผัด/ทอด', '🍳', 'Stir-fried/Fried'),
(5, 'ยำ/สลัด', '🥗', 'Salads'),
(6, 'ของว่าง/ทานเล่น', '🍢', 'Snacks'),
(7, 'ขนมหวาน', '🍮', 'Desserts'),
(8, 'เครื่องดื่ม', '🥤', 'Beverages');

-- ========================================
-- PART 5: Seed Thai Foods Data
-- ========================================

INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, status, created_by) VALUES
('ข้าวมันไก่', 'Hainanese Chicken Rice', 480, 28, 55, 15, 1, '1 จาน', 1, 'approved', 1),
('ข้าวกะเพราหมูสับ', 'Basil Pork Rice', 520, 22, 58, 20, 2, '1 จาน', 1, 'approved', 1),
('ข้าวผัดกุ้ง', 'Shrimp Fried Rice', 450, 18, 60, 14, 2, '1 จาน', 1, 'approved', 1),
('ข้าวหมูแดง', 'Red Pork Rice', 470, 25, 55, 16, 1, '1 จาน', 1, 'approved', 1),
('ข้าวหมูกรอบ', 'Crispy Pork Rice', 550, 20, 52, 28, 1, '1 จาน', 1, 'approved', 1),
('ข้าวขาหมู', 'Pork Leg Rice', 620, 35, 48, 32, 1, '1 จาน', 1, 'approved', 1),
('ข้าวคลุกกะปิ', 'Shrimp Paste Fried Rice', 380, 15, 52, 12, 3, '1 จาน', 1, 'approved', 1),

-- Noodles
('ก๋วยเตี๋ยวเรือ', 'Boat Noodles', 350, 20, 40, 12, 2, '1 ชาม', 2, 'approved', 1),
('ผัดไทยกุ้งสด', 'Pad Thai with Shrimp', 480, 22, 55, 18, 3, '1 จาน', 2, 'approved', 1),
('ผัดซีอิ๊วหมู', 'Pad See Ew', 450, 18, 58, 16, 2, '1 จาน', 2, 'approved', 1),
('ก๋วยเตี๋ยวหมู', 'Pork Noodle Soup', 320, 18, 42, 8, 2, '1 ชาม', 2, 'approved', 1),
('บะหมี่เกี๊ยวหมูแดง', 'Wonton Egg Noodles', 380, 22, 45, 12, 2, '1 ชาม', 2, 'approved', 1),
('ราดหน้าทะเล', 'Rad Na Seafood', 420, 25, 48, 15, 2, '1 จาน', 2, 'approved', 1),
('หมี่กะทิ', 'Coconut Noodles', 440, 12, 55, 20, 2, '1 จาน', 2, 'approved', 1),

-- Curries
('แกงเขียวหวานไก่', 'Green Curry Chicken', 380, 22, 12, 28, 3, '1 ถ้วย', 3, 'approved', 1),
('แกงมัสมั่นไก่', 'Massaman Curry', 520, 28, 25, 35, 4, '1 ถ้วย', 3, 'approved', 1),
('แกงพะแนง', 'Panang Curry', 420, 25, 10, 32, 2, '1 ถ้วย', 3, 'approved', 1),
('แกงส้มกุ้ง', 'Sour Curry with Shrimp', 180, 18, 8, 8, 3, '1 ถ้วย', 3, 'approved', 1),
('ฉู่ฉี่ปลา', 'Choo Chee Fish', 350, 28, 8, 24, 2, '1 จาน', 3, 'approved', 1),

-- Stir-fry
('ผัดกะเพราไก่', 'Basil Chicken', 320, 28, 8, 20, 2, '1 จาน', 4, 'approved', 1),
('ผัดพริกหมู', 'Stir-fried Pork with Chili', 280, 22, 6, 18, 2, '1 จาน', 4, 'approved', 1),
('ไก่ผัดเม็ดมะม่วง', 'Cashew Chicken', 380, 25, 15, 25, 2, '1 จาน', 4, 'approved', 1),
('หมูผัดกระเทียม', 'Garlic Pork', 300, 24, 5, 20, 1, '1 จาน', 4, 'approved', 1),
('กุ้งผัดพริกเผา', 'Shrimp in Chili Paste', 280, 22, 8, 18, 2, '1 จาน', 4, 'approved', 1),

-- Soups & Salads
('ต้มยำกุ้ง', 'Tom Yum Goong', 180, 18, 8, 8, 2, '1 ถ้วย', 5, 'approved', 1),
('ต้มข่าไก่', 'Tom Kha Gai', 280, 20, 8, 20, 2, '1 ถ้วย', 5, 'approved', 1),
('ส้มตำไทย', 'Thai Papaya Salad', 120, 4, 18, 4, 4, '1 จาน', 5, 'approved', 1),
('ส้มตำปูปลาร้า', 'Papaya Salad with Crab', 150, 8, 16, 6, 4, '1 จาน', 5, 'approved', 1),
('ลาบหมู', 'Minced Pork Salad', 220, 22, 6, 12, 2, '1 จาน', 5, 'approved', 1),
('น้ำตกหมู', 'Grilled Pork Salad', 250, 25, 8, 14, 2, '1 จาน', 5, 'approved', 1),
('ยำวุ้นเส้น', 'Glass Noodle Salad', 220, 15, 25, 8, 2, '1 จาน', 5, 'approved', 1),

-- Snacks & Street Food
('ไก่ย่าง', 'Grilled Chicken', 280, 32, 2, 16, 0, '1 ชิ้นใหญ่', 6, 'approved', 1),
('หมูปิ้ง', 'Grilled Pork Skewers', 180, 15, 8, 10, 0, '5 ไม้', 6, 'approved', 1),
('ปอเปี๊ยะทอด', 'Fried Spring Rolls', 280, 8, 30, 14, 2, '4 ชิ้น', 6, 'approved', 1),
('สะเต๊ะหมู', 'Pork Satay', 250, 18, 12, 15, 1, '5 ไม้', 6, 'approved', 1),
('ทอดมันกุ้ง', 'Shrimp Cake', 320, 15, 25, 18, 1, '4 ชิ้น', 6, 'approved', 1),

-- Desserts
('ข้าวเหนียวมะม่วง', 'Mango Sticky Rice', 380, 4, 65, 12, 2, '1 จาน', 7, 'approved', 1),
('บัวลอยน้ำขิง', 'Rice Balls in Ginger Soup', 180, 2, 38, 2, 1, '1 ถ้วย', 7, 'approved', 1),
('ไอติมกะทิ', 'Coconut Ice Cream', 220, 3, 28, 12, 1, '1 ถ้วย', 7, 'approved', 1),
('ขนมครก', 'Coconut Pancakes', 250, 4, 35, 10, 1, '8 ชิ้น', 7, 'approved', 1),
('ทับทิมกรอบ', 'Water Chestnut in Coconut', 180, 2, 36, 4, 1, '1 ถ้วย', 7, 'approved', 1),

-- Beverages
('ชาไทย', 'Thai Tea', 180, 2, 30, 6, 0, '1 แก้ว', 8, 'approved', 1),
('ชาเขียวนม', 'Green Milk Tea', 160, 3, 28, 4, 0, '1 แก้ว', 8, 'approved', 1),
('น้ำมะพร้าว', 'Coconut Water', 45, 0, 10, 0, 0, '1 แก้ว', 8, 'approved', 1),
('น้ำมะนาว', 'Lemonade', 80, 0, 20, 0, 0, '1 แก้ว', 8, 'approved', 1),
('กาแฟเย็น', 'Thai Iced Coffee', 150, 2, 22, 6, 0, '1 แก้ว', 8, 'approved', 1);

-- Update icons
UPDATE categories SET icon = '🍚' WHERE id = 1;
UPDATE categories SET icon = '🍜' WHERE id = 2;
UPDATE categories SET icon = '🍛' WHERE id = 3;
UPDATE categories SET icon = '🍳' WHERE id = 4;
UPDATE categories SET icon = '🥗' WHERE id = 5;
UPDATE categories SET icon = '🍢' WHERE id = 6;
UPDATE categories SET icon = '🍮' WHERE id = 7;
UPDATE categories SET icon = '🥤' WHERE id = 8;
