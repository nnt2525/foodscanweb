-- ========================================
-- NutriTrack Nutrients Seed Data
-- สารอาหารมาตรฐานสำหรับระบบ NutriTrack
-- ========================================

USE nutritrack;

-- สร้างตาราง Nutrients (ถ้ายังไม่มี)
CREATE TABLE IF NOT EXISTS nutrients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_th VARCHAR(100),
    unit VARCHAR(20) NOT NULL,
    daily_value DECIMAL(10,2) DEFAULT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- สร้างตาราง Food_Nutrients (Junction Table)
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

-- ========================================
-- Insert Nutrients Data
-- ========================================

-- Macronutrients (สารอาหารหลัก)
INSERT INTO nutrients (code, name, name_th, unit, daily_value, category) VALUES
('ENERGY', 'Energy', 'พลังงาน', 'kcal', 2000, 'Macronutrient'),
('PROTEIN', 'Protein', 'โปรตีน', 'g', 50, 'Macronutrient'),
('FAT', 'Total Fat', 'ไขมันรวม', 'g', 78, 'Macronutrient'),
('CARBS', 'Carbohydrates', 'คาร์โบไฮเดรต', 'g', 275, 'Macronutrient'),
('FIBER', 'Dietary Fiber', 'ใยอาหาร', 'g', 28, 'Macronutrient'),
('SUGAR', 'Total Sugars', 'น้ำตาลรวม', 'g', 50, 'Macronutrient'),
('SATFAT', 'Saturated Fat', 'ไขมันอิ่มตัว', 'g', 20, 'Macronutrient'),
('TRANSFAT', 'Trans Fat', 'ไขมันทรานส์', 'g', 0, 'Macronutrient'),
('CHOL', 'Cholesterol', 'คอเลสเตอรอล', 'mg', 300, 'Macronutrient');

-- Vitamins (วิตามิน)
INSERT INTO nutrients (code, name, name_th, unit, daily_value, category) VALUES
('VITA', 'Vitamin A', 'วิตามิน เอ', 'mcg', 900, 'Vitamin'),
('VITB1', 'Thiamin (B1)', 'ไทอามีน (บี1)', 'mg', 1.2, 'Vitamin'),
('VITB2', 'Riboflavin (B2)', 'ไรโบฟลาวิน (บี2)', 'mg', 1.3, 'Vitamin'),
('VITB3', 'Niacin (B3)', 'ไนอะซิน (บี3)', 'mg', 16, 'Vitamin'),
('VITB5', 'Pantothenic Acid (B5)', 'กรดแพนโทเธนิก (บี5)', 'mg', 5, 'Vitamin'),
('VITB6', 'Vitamin B6', 'วิตามิน บี6', 'mg', 1.7, 'Vitamin'),
('VITB7', 'Biotin (B7)', 'ไบโอติน (บี7)', 'mcg', 30, 'Vitamin'),
('VITB9', 'Folate (B9)', 'โฟเลต (บี9)', 'mcg', 400, 'Vitamin'),
('FOLATE', 'Folate', 'โฟเลต', 'mcg', 400, 'Vitamin'),
('VITB12', 'Vitamin B12', 'วิตามิน บี12', 'mcg', 2.4, 'Vitamin'),
('VITC', 'Vitamin C', 'วิตามิน ซี', 'mg', 90, 'Vitamin'),
('VITD', 'Vitamin D', 'วิตามิน ดี', 'mcg', 20, 'Vitamin'),
('VITE', 'Vitamin E', 'วิตามิน อี', 'mg', 15, 'Vitamin'),
('VITK', 'Vitamin K', 'วิตามิน เค', 'mcg', 120, 'Vitamin');

-- Minerals (แร่ธาตุ)
INSERT INTO nutrients (code, name, name_th, unit, daily_value, category) VALUES
('CALCIUM', 'Calcium', 'แคลเซียม', 'mg', 1300, 'Mineral'),
('IRON', 'Iron', 'เหล็ก', 'mg', 18, 'Mineral'),
('MAGNESIUM', 'Magnesium', 'แมกนีเซียม', 'mg', 420, 'Mineral'),
('PHOSPHORUS', 'Phosphorus', 'ฟอสฟอรัส', 'mg', 1250, 'Mineral'),
('POTASSIUM', 'Potassium', 'โพแทสเซียม', 'mg', 4700, 'Mineral'),
('SODIUM', 'Sodium', 'โซเดียม', 'mg', 2300, 'Mineral'),
('ZINC', 'Zinc', 'สังกะสี', 'mg', 11, 'Mineral'),
('COPPER', 'Copper', 'ทองแดง', 'mg', 0.9, 'Mineral'),
('MANGANESE', 'Manganese', 'แมงกานีส', 'mg', 2.3, 'Mineral'),
('SELENIUM', 'Selenium', 'ซีลีเนียม', 'mcg', 55, 'Mineral'),
('IODINE', 'Iodine', 'ไอโอดีน', 'mcg', 150, 'Mineral'),
('CHROMIUM', 'Chromium', 'โครเมียม', 'mcg', 35, 'Mineral'),
('MOLYBDENUM', 'Molybdenum', 'โมลิบดีนัม', 'mcg', 45, 'Mineral'),
('CHLORIDE', 'Chloride', 'คลอไรด์', 'mg', 2300, 'Mineral');

-- Other (อื่นๆ)
INSERT INTO nutrients (code, name, name_th, unit, daily_value, category) VALUES
('WATER', 'Water', 'น้ำ', 'g', NULL, 'Other'),
('CAFFEINE', 'Caffeine', 'คาเฟอีน', 'mg', 400, 'Other'),
('ALCOHOL', 'Alcohol', 'แอลกอฮอล์', 'g', NULL, 'Other');

-- ========================================
-- ตรวจสอบผลลัพธ์
-- ========================================
SELECT category, COUNT(*) as count FROM nutrients GROUP BY category;
SELECT * FROM nutrients ORDER BY category, code;
