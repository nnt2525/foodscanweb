-- ========================================
-- NutriTrack Phase B: Database Schema Enhancement
-- Run this after the initial seed.sql
-- ========================================

USE nutritrack;

-- ========================================
-- 1. Nutrients Reference Table
-- Contains all possible nutrients (vitamins, minerals, etc.)
-- ========================================
CREATE TABLE IF NOT EXISTS nutrients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,         -- e.g., 'VITA', 'VITC', 'IRON', 'CALCIUM'
    name_th VARCHAR(100) NOT NULL,            -- Thai name
    name_en VARCHAR(100) NOT NULL,            -- English name
    unit VARCHAR(20) NOT NULL,                -- e.g., 'mg', 'g', 'mcg', 'IU'
    daily_value DECIMAL(10,2),                -- Recommended daily value
    category ENUM('macro', 'vitamin', 'mineral', 'other') DEFAULT 'other',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 2. Food Nutrients (Many-to-Many)
-- Links foods with their nutrient values
-- ========================================
CREATE TABLE IF NOT EXISTS food_nutrients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    food_id INT NOT NULL,
    nutrient_id INT NOT NULL,
    amount DECIMAL(10,4) NOT NULL,            -- Amount per serving
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
    FOREIGN KEY (nutrient_id) REFERENCES nutrients(id) ON DELETE CASCADE,
    UNIQUE KEY unique_food_nutrient (food_id, nutrient_id)
);

-- ========================================
-- 3. Add External Source Tracking to Foods
-- For importing from USDA, Thai FCD, etc.
-- ========================================
ALTER TABLE foods 
    ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'manual',
    ADD COLUMN IF NOT EXISTS external_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
    ADD COLUMN IF NOT EXISTS barcode VARCHAR(50),
    ADD COLUMN IF NOT EXISTS brand VARCHAR(100);

-- ========================================
-- 4. Portion Sizes Table
-- Multiple serving sizes per food
-- ========================================
CREATE TABLE IF NOT EXISTS portion_sizes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    food_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,               -- e.g., '1 cup', '100g', '1 piece'
    grams DECIMAL(8,2) NOT NULL,              -- Weight in grams
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- ========================================
-- 5. Food Import Log
-- Track what has been imported from external sources
-- ========================================
CREATE TABLE IF NOT EXISTS food_import_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    source VARCHAR(50) NOT NULL,              -- 'usda', 'thai_fcd', etc.
    external_id VARCHAR(100) NOT NULL,
    food_id INT,
    status ENUM('success', 'failed', 'duplicate') NOT NULL,
    message TEXT,
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL
);

-- ========================================
-- Seed Nutrients Data
-- ========================================

-- Macronutrients (already in foods table, but for reference)
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
('VITB1', 'วิตามินบี1', 'Vitamin B1 (Thiamin)', 'mg', 1.2, 'vitamin'),
('VITB2', 'วิตามินบี2', 'Vitamin B2 (Riboflavin)', 'mg', 1.3, 'vitamin'),
('VITB3', 'วิตามินบี3', 'Vitamin B3 (Niacin)', 'mg', 16, 'vitamin'),
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

-- ========================================
-- Indexes for Performance
-- ========================================
CREATE INDEX IF NOT EXISTS idx_nutrients_code ON nutrients(code);
CREATE INDEX IF NOT EXISTS idx_nutrients_category ON nutrients(category);
CREATE INDEX IF NOT EXISTS idx_food_nutrients_food ON food_nutrients(food_id);
CREATE INDEX IF NOT EXISTS idx_food_nutrients_nutrient ON food_nutrients(nutrient_id);
CREATE INDEX IF NOT EXISTS idx_foods_source ON foods(source);
CREATE INDEX IF NOT EXISTS idx_foods_external ON foods(external_id);
CREATE INDEX IF NOT EXISTS idx_portion_sizes_food ON portion_sizes(food_id);
