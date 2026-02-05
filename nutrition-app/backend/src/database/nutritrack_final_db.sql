-- ========================================
-- NutriTrack Final Database (Full Schema)
-- Combined Features: User System + USDA Data + Social Features
-- ========================================
CREATE DATABASE IF NOT EXISTS nutritrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nutritrack;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS food_logs;
DROP TABLE IF EXISTS meal_items;
DROP TABLE IF EXISTS meal_plans;
DROP TABLE IF EXISTS portion_sizes;
DROP TABLE IF EXISTS food_nutrients;
DROP TABLE IF EXISTS foods;
DROP TABLE IF EXISTS nutrients;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;


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

CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nutrients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name_th VARCHAR(100),
    name_en VARCHAR(100),
    unit VARCHAR(20),
    daily_value DECIMAL(10,2),
    category ENUM('macro', 'vitamin', 'mineral', 'other') DEFAULT 'other'
);

CREATE TABLE IF NOT EXISTS foods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    brand VARCHAR(100),         
    barcode VARCHAR(50),        
    calories INT NOT NULL DEFAULT 0,
    protein DECIMAL(6,2) DEFAULT 0,
    carbs DECIMAL(6,2) DEFAULT 0,
    fat DECIMAL(6,2) DEFAULT 0,
    fiber DECIMAL(6,2) DEFAULT 0,
    serving_size VARCHAR(100),
    image_url VARCHAR(500),
    category_id INT,
    source VARCHAR(50) DEFAULT 'system',
    external_id VARCHAR(100),   
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS food_nutrients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    food_id INT NOT NULL,
    nutrient_id INT NOT NULL,
    amount DECIMAL(10,4) NOT NULL,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
    FOREIGN KEY (nutrient_id) REFERENCES nutrients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS portion_sizes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    food_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    grams DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meal_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date)
);

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

CREATE TABLE IF NOT EXISTS food_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snacks') NOT NULL,
    quantity DECIMAL(5,2) DEFAULT 1,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    badge_type VARCHAR(50) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_badge (user_id, badge_type)
);
INSERT IGNORE INTO users (id, email, password, name, role, daily_calories) VALUES (1, 'admin@nutritrack.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQHLVLmXRbJZz6LrVQDxGIFqJ6Iyje', 'Admin NutriTrack', 'admin', 2000);
INSERT IGNORE INTO users (id, email, password, name, role, daily_calories) VALUES (2, 'user@nutritrack.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQHLVLmXRbJZz6LrVQDxGIFqJ6Iyje', 'User NutriTrack', 'user', 2000);

INSERT IGNORE INTO categories (id, name, icon) VALUES 
(1, 'อาหารจานเดียว/เนื้อสัตว์', 'mw'), (2, 'ข้าว/เส้น/แป้ง', 'cw'), (3, 'แกง/ต้ม', 'sw'), (4, 'ผัด/ทอด/ไขมัน', 'fw'),
(5, 'ผัก/สลัด', 'vw'), (6, 'ผลไม้/ของว่าง', 'fr'), (7, 'ขนมหวาน', 'dw'), (8, 'เครื่องดื่ม', 'bw');

INSERT IGNORE INTO nutrients (code, name_th, name_en, unit, daily_value, category) VALUES
('ENERGY', 'พลังงาน', 'Energy', 'kcal', 2000, 'macro'),
('PROTEIN', 'โปรตีน', 'Protein', 'g', 50, 'macro'),
('FAT', 'ไขมัน', 'Total Fat', 'g', 78, 'macro'),
('CARBS', 'คาร์โบไฮเดรต', 'Carbohydrates', 'g', 275, 'macro'),
('FIBER', 'ใยอาหาร', 'Fiber', 'g', 28, 'macro'),
('SUGAR', 'น้ำตาล', 'Sugars', 'g', 50, 'macro'),
('SODIUM', 'โซเดียม', 'Sodium', 'mg', 2300, 'mineral'),
('CALCIUM', 'แคลเซียม', 'Calcium', 'mg', 1000, 'mineral'),
('IRON', 'ธาตุเหล็ก', 'Iron', 'mg', 18, 'mineral'),
('VITC', 'วิตามินซี', 'Vitamin C', 'mg', 90, 'vitamin'),
('VITA', 'วิตามินเอ', 'Vitamin A', 'mcg', 900, 'vitamin'),
('VITD', 'วิตามินดี', 'Vitamin D', 'mcg', 20, 'vitamin');
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, source, status) VALUES ('ข้าวมันไก่', 'Hainanese Chicken Rice', 600, 30, 65, 22, 1, '1 จาน', 1, 'THAI', 'approved');
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, source, status) VALUES ('ข้าวผัดกะเพราหมูสับ', 'Basil Pork with Rice', 520, 22, 58, 20, 2, '1 จาน', 1, 'THAI', 'approved');
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, source, status) VALUES ('ต้มยำกุ้ง', 'Tom Yum Kung', 180, 22, 8, 6, 2, '1 ถ้วย', 3, 'THAI', 'approved');
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, source, status) VALUES ('ส้มตำไทย', 'Papaya Salad', 120, 4, 18, 4, 4, '1 จาน', 5, 'THAI', 'approved');
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, source, status) VALUES ('แกงเขียวหวานไก่', 'Green Curry Chicken', 380, 22, 12, 28, 3, '1 ถ้วย', 3, 'THAI', 'approved');
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, source, status) VALUES ('ไข่ต้ม', 'Boiled Egg', 78, 6, 0.5, 5, 0, '1 ฟอง', 1, 'THAI', 'approved');
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, source, status) VALUES ('กล้วยหอม', 'Banana', 105, 1.3, 27, 0.4, 3, '1 ลูก', 6, 'THAI', 'approved');
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Rice, Brown, Long Grain, Parboiled (Chefway)', 'Rice, Brown, Long Grain, Parboiled (Chefway)', 'Chefway', '10035200265673', 150, 3.0, 32.0, 1.0, 1.0, '44 GRM', 2, 'USDA', '100500', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.5 FROM foods WHERE source='USDA' AND external_id='100500';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Rice, Brown, Long Grain, Parboiled (Chefway)', 'Rice, Brown, Long Grain, Parboiled (Chefway)', 'Chefway', '35200265683', 150, 3.0, 32.0, 1.0, 1.0, '44 GRM', 2, 'USDA', '101031', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.5 FROM foods WHERE source='USDA' AND external_id='101031';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Spinach, Chopped, No Salt Added, Frozen (IQF) (Margaret Holmes)', 'Spinach, Chopped, No Salt Added, Frozen (IQF) (Margaret Holmes)', 'Margaret Holmes', '10041443140028', 31, 4.0, 4.0, 1.0, 3.0, '113 GRM', 5, 'USDA', '110425', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 136.0 FROM foods WHERE source='USDA' AND external_id='110425';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 4.0 FROM foods WHERE source='USDA' AND external_id='110425';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Apple Juice, 100%, Unsweetened, Cups, Frozen (SUNCUP)', 'Apple Juice, 100%, Unsweetened, Cups, Frozen (SUNCUP)', 'SUNCUP', '77484000352', 60, 0.0, 14.0, 0.0, 0.0, '118 milliliters MLT', 6, 'USDA', '111790', 'approved', 1);
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Chicken, Pulled, Cooked, Frozen  (Foster Farms)', 'Chicken, Pulled, Cooked, Frozen  (Foster Farms)', 'Foster Farms', '75278996539', 100, 19.0, 1.0, 2.0, 0.0, '84 GRM', 1, 'USDA', '111881', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.36 FROM foods WHERE source='USDA' AND external_id='111881';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Cheese, Cheddar, White, Shredded, Chilled (Masters Gallery Select)', 'Cheese, Cheddar, White, Shredded, Chilled (Masters Gallery Select)', 'Masters Gallery Select', '88748270046', 110, 6.0, 1.0, 9.0, 0.0, '28 GRM', 1, 'USDA', '100002', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 200.0 FROM foods WHERE source='USDA' AND external_id='100002';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Cheese, Cheddar, Yellow, Shredded, Chilled (Masters Gallery Select)', 'Cheese, Cheddar, Yellow, Shredded, Chilled (Masters Gallery Select)', 'Masters Gallery Select', '88748270039', 110, 6.0, 1.0, 9.0, 0.0, '28 GRM', 1, 'USDA', '100003', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 200.0 FROM foods WHERE source='USDA' AND external_id='100003';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Cheese, Cheddar, Yellow, Reduced Fat, Shredded, Chilled (Masters Gallery Select)', 'Cheese, Cheddar, Yellow, Reduced Fat, Shredded, Chilled (Masters Gallery Select)', 'Masters Gallery Select', '88748270015', 90, 8.0, 1.0, 6.0, 0.0, '28 GRM', 1, 'USDA', '100012', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 200.0 FROM foods WHERE source='USDA' AND external_id='100012';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Cheese, American, Yellow, Pasteurized, Loaves, Chilled (Bongards®)', 'Cheese, American, Yellow, Pasteurized, Loaves, Chilled (Bongards®)', 'Bongards®', '10071078002736', 100, 5.0, 2.0, 9.0, 0.0, '28.35 GRM', 1, 'USDA', '100017', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 167.0 FROM foods WHERE source='USDA' AND external_id='100017';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Cheese, American, Yellow, Pasteurized, Sliced, Chilled (Bongards®)', 'Cheese, American, Yellow, Pasteurized, Sliced, Chilled (Bongards®)', 'Bongards®', '10071078011394', 100, 5.0, 2.0, 9.0, 0.0, '28 GRM', 1, 'USDA', '100018', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 160.0 FROM foods WHERE source='USDA' AND external_id='100018';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Cheese, Mozzarella, Low Moisture Part Skim, Shredded, Frozen (USDA)', 'Cheese, Mozzarella, Low Moisture Part Skim, Shredded, Frozen (USDA)', 'USDA', '90075805885223', 80, 7.0, 2.0, 5.0, 1.0, '28 GRM', 1, 'USDA', '100021', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 190.0 FROM foods WHERE source='USDA' AND external_id='100021';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Cheese, Mozzarella, Low Moisture Part Skim, Loaves, Frozen  (USDA)', 'Cheese, Mozzarella, Low Moisture Part Skim, Loaves, Frozen  (USDA)', 'USDA', '90075805885216', 80, 7.0, 1.0, 5.0, 0.0, '28 GRM', 1, 'USDA', '100022', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 200.0 FROM foods WHERE source='USDA' AND external_id='100022';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Cheese, Blended American, Yellow, Reduced Fat, Sliced, Chilled (Bongards®)', 'Cheese, Blended American, Yellow, Reduced Fat, Sliced, Chilled (Bongards®)', 'Bongards®', '10071078101422', 70, 5.0, 4.0, 4.5, 0.0, '28 GRM', 1, 'USDA', '100036', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 141.0 FROM foods WHERE source='USDA' AND external_id='100036';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Cheese, Blended American, White, Reduced Fat, Sliced, Chilled (Bongards®)', 'Cheese, Blended American, White, Reduced Fat, Sliced, Chilled (Bongards®)', 'Bongards®', '10071078011431', 70, 5.0, 4.0, 4.5, 0.0, '28 GRM', 1, 'USDA', '100037', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 141.0 FROM foods WHERE source='USDA' AND external_id='100037';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Eggs, Liquid Whole, Frozen  (Sonstegard Foods)', 'Eggs, Liquid Whole, Frozen  (Sonstegard Foods)', 'Sonstegard Foods', '664194000019', 70, 6.0, 1.0, 4.5, 0.0, '50 GRM', 1, 'USDA', '100046', 'approved', 1);
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Chicken, Diced, Cooked, Frozen  (Tyson)', 'Chicken, Diced, Cooked, Frozen  (Tyson)', 'Tyson', '10715001015171', 130, 19.0, 1.0, 6.0, 0.0, '84 GRM', 1, 'USDA', '100101', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 10.0 FROM foods WHERE source='USDA' AND external_id='100101';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.5 FROM foods WHERE source='USDA' AND external_id='100101';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Chicken, Fajita Seasoned Strips, Cooked, Frozen  (Tyson)', 'Chicken, Fajita Seasoned Strips, Cooked, Frozen  (Tyson)', 'Tyson', '31400073332', 140, 17.0, 2.0, 7.0, 0.0, '84 GRM', 1, 'USDA', '100117', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 10.0 FROM foods WHERE source='USDA' AND external_id='100117';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.9 FROM foods WHERE source='USDA' AND external_id='100117';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Turkey, Taco Filling, Cooked, Frozen  (USDA)', 'Turkey, Taco Filling, Cooked, Frozen  (USDA)', 'USDA', '31400090322', 90, 12.0, 4.0, 3.0, 1.0, '56 GRM', 1, 'USDA', '100119', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 20.0 FROM foods WHERE source='USDA' AND external_id='100119';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.2 FROM foods WHERE source='USDA' AND external_id='100119';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Turkey, Deli Breast, Frozen  (Unbranded)', 'Turkey, Deli Breast, Frozen  (Unbranded)', 'Unbranded', '10715001001211', 70, 12.0, 1.0, 1.5, 0.0, '56 GRM', 1, 'USDA', '100121', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.4 FROM foods WHERE source='USDA' AND external_id='100121';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Turkey, Deli Breast, Smoked, Frozen  (Cargill Unbranded)', 'Turkey, Deli Breast, Smoked, Frozen  (Cargill Unbranded)', 'Cargill Unbranded', '90642205556871', 60, 12.0, 1.0, 0.5, 0.0, '56 GRM', 1, 'USDA', '100122', 'approved', 1);
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Turkey, Roast, Raw, Frozen  (USDA - FNS)', 'Turkey, Roast, Raw, Frozen  (USDA - FNS)', 'USDA - FNS', '90800020246487', 160, 20.0, 0.0, 8.0, 0.0, '112 GRM', 1, 'USDA', '100125', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.72 FROM foods WHERE source='USDA' AND external_id='100125';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Turkey, Deli Ham, Smoked, Frozen (Hof Hause)', 'Turkey, Deli Ham, Smoked, Frozen (Hof Hause)', 'Hof Hause', '713480101265', 60, 9.0, 2.0, 1.5, 0.0, '57 GRM', 1, 'USDA', '100126', 'approved', 1);
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beef, Coarse Ground, Cooked, Canned (Lakeside)', 'Beef, Coarse Ground, Cooked, Canned (Lakeside)', 'Lakeside', '790901617', 120, 10.0, 0.0, 8.0, 0.0, '56 GRM', 1, 'USDA', '100127', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.72 FROM foods WHERE source='USDA' AND external_id='100127';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beef, Crumbles w/SPP, Cooked, Frozen  (Don Lee Farms)', 'Beef, Crumbles w/SPP, Cooked, Frozen  (Don Lee Farms)', 'Don Lee Farms', '87427425838', 109, 10.5, 1.2, 6.9, 0.8, '56.7 GRM', 1, 'USDA', '100134', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 17.0 FROM foods WHERE source='USDA' AND external_id='100134';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.2 FROM foods WHERE source='USDA' AND external_id='100134';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Pork, Coarse Ground, Cooked, Canned (Lakeside Foods)', 'Pork, Coarse Ground, Cooked, Canned (Lakeside Foods)', 'Lakeside Foods', '790902614', 120, 9.0, 0.0, 8.0, 0.0, '56 GRM', 1, 'USDA', '100139', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.36 FROM foods WHERE source='USDA' AND external_id='100139';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beef, Fine Ground, 100%, 85/15, Raw, Frozen (Criss Cross Express of Illinois, LLC)', 'Beef, Fine Ground, 100%, 85/15, Raw, Frozen (Criss Cross Express of Illinois, LLC)', 'Criss Cross Express of Illinois, LLC', '195893447824', 240, 22.0, 0.0, 17.0, 0.0, '112 GRM', 1, 'USDA', '100158', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='100158';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beef, Patties, Lean, Raw, 2.0 MMA, Frozen (Cherry Meat Packers)', 'Beef, Patties, Lean, Raw, 2.0 MMA, Frozen (Cherry Meat Packers)', 'Cherry Meat Packers', '79183001630', 100, 15.0, 2.0, 3.5, 0.0, '88 GRM', 1, 'USDA', '100163', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 2.0 FROM foods WHERE source='USDA' AND external_id='100163';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Ham, 97% Fat Free, Water-Added, Cooked, Sliced, Frozen (Hof Hause)', 'Ham, 97% Fat Free, Water-Added, Cooked, Sliced, Frozen (Hof Hause)', 'Hof Hause', '713480101876', 50, 9.0, 1.0, 1.0, 0.0, '57 GRM', 1, 'USDA', '100187', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 4.0 FROM foods WHERE source='USDA' AND external_id='100187';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.2 FROM foods WHERE source='USDA' AND external_id='100187';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Tuna, Chunk Light, Canned (K) (Bumble Bee)', 'Tuna, Chunk Light, Canned (K) (Bumble Bee)', 'Bumble Bee', '86600115801', 80, 16.0, 1.0, 1.0, 0.0, '85 GRM', 1, 'USDA', '100195', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 10.0 FROM foods WHERE source='USDA' AND external_id='100195';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.8 FROM foods WHERE source='USDA' AND external_id='100195';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Apple Slices, Unsweetened, Canned (Del Monte)', 'Apple Slices, Unsweetened, Canned (Del Monte)', 'Del Monte', '24000249764', 50, 0.0, 13.0, 0.0, 1.0, '123 GRM', 6, 'USDA', '100206', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 3.0 FROM foods WHERE source='USDA' AND external_id='100206';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Mixed Fruit (Peaches, Pears, Grapes), Extra Light Syrup, Canned (Mission Pride)', 'Mixed Fruit (Peaches, Pears, Grapes), Extra Light Syrup, Canned (Mission Pride)', 'Mission Pride', '73934152893', 65, 0.5084, 16.329312, 0.211296, 1.683548, '124 GRM', 6, 'USDA', '100212', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 5.381848 FROM foods WHERE source='USDA' AND external_id='100212';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.215016 FROM foods WHERE source='USDA' AND external_id='100212';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Apricots, Diced, Extra Light Syrup, Canned (Mission Pride)', 'Apricots, Diced, Extra Light Syrup, Canned (Mission Pride)', 'Mission Pride', '73934150752', 60, 1.0, 15.0, 0.0, 1.0, '124 GRM', 6, 'USDA', '100216', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 7.0 FROM foods WHERE source='USDA' AND external_id='100216';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Peaches, Sliced, Extra Light Syrup, Canned (Mission Pride)', 'Peaches, Sliced, Extra Light Syrup, Canned (Mission Pride)', 'Mission Pride', '73934151278', 60, 1.0, 16.0, 0.0, 1.0, '124 GRM', 6, 'USDA', '100219', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 1.0 FROM foods WHERE source='USDA' AND external_id='100219';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Peaches, Diced, Extra Light Syrup, Canned (Del Monte)', 'Peaches, Diced, Extra Light Syrup, Canned (Del Monte)', 'Del Monte', '24000509691', 60, 0.0, 14.0, 0.0, 1.0, '126 GRM', 6, 'USDA', '100220', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 6.0 FROM foods WHERE source='USDA' AND external_id='100220';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.2 FROM foods WHERE source='USDA' AND external_id='100220';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Pears, Sliced, Extra Light Syrup, Canned (Oregon Trail)', 'Pears, Sliced, Extra Light Syrup, Canned (Oregon Trail)', 'Oregon Trail', '10041712914565', 70, 0.0, 17.0, 0.0, 3.0, '128 GRM', 6, 'USDA', '100224', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 9.0 FROM foods WHERE source='USDA' AND external_id='100224';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Pears, Diced, Extra Light Syrup, Canned (K) (Oregon Trail)', 'Pears, Diced, Extra Light Syrup, Canned (K) (Oregon Trail)', 'Oregon Trail', '10041712915562', 70, 0.0, 18.0, 0.0, 3.0, '128 GRM', 6, 'USDA', '100225', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 9.0 FROM foods WHERE source='USDA' AND external_id='100225';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Pears, Halves, Extra Light Syrup, Canned (Oregon Trail)', 'Pears, Halves, Extra Light Syrup, Canned (Oregon Trail)', 'Oregon Trail', '10041712912561', 70, 0.0, 17.0, 0.0, 3.0, '128 GRM', 6, 'USDA', '100226', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 9.0 FROM foods WHERE source='USDA' AND external_id='100226';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Peaches, Sliced, Frozen  (Southern Sliced Peaches)', 'Peaches, Sliced, Frozen  (Southern Sliced Peaches)', 'Southern Sliced Peaches', '10817134025772', 80, 1.0, 19.0, 0.0, 2.0, '140 GRM', 6, 'USDA', '100238', 'approved', 1);
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Peaches, Sliced, Frozen  (Southern Sliced Peaches)', 'Peaches, Sliced, Frozen  (Southern Sliced Peaches)', 'Southern Sliced Peaches', '10817134024232', 84, 0.0, 21.0, 0.0, 2.0, '125 GRM', 6, 'USDA', '100239', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 4.0 FROM foods WHERE source='USDA' AND external_id='100239';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Peaches, Diced, Cups, Frozen  (Wawona Frozen Foods)', 'Peaches, Diced, Cups, Frozen  (Wawona Frozen Foods)', 'Wawona Frozen Foods', '10034742055377', 80, 1.0, 21.0, 0.0, 2.0, '125 GRM', 6, 'USDA', '100241', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 7.0 FROM foods WHERE source='USDA' AND external_id='100241';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Blueberries, Wild, Unsweetened, Frozen  (Wyman\'s)', 'Blueberries, Wild, Unsweetened, Frozen  (Wyman\'s)', 'Wyman\'s', '79900001691', 80, 0.0, 19.0, 0.0, 6.0, '140 GRM', 6, 'USDA', '100242', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 25.0 FROM foods WHERE source='USDA' AND external_id='100242';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.8 FROM foods WHERE source='USDA' AND external_id='100242';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Blueberries, Wild, Unsweetened, Frozen  (Passamaquoddy Wild Blueberry Co.)', 'Blueberries, Wild, Unsweetened, Frozen  (Passamaquoddy Wild Blueberry Co.)', 'Passamaquoddy Wild Blueberry Co.', '198168171158', 40, 0.0, 9.0, 0.0, 3.0, '70 GRM', 6, 'USDA', '100243', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 12.0 FROM foods WHERE source='USDA' AND external_id='100243';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='100243';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Strawberries, Sliced, Frozen (Anacapa Foods)', 'Strawberries, Sliced, Frozen (Anacapa Foods)', 'Anacapa Foods', '86289258929', 45, 1.0, 11.0, 0.0, 1.0, '70 GRM', 6, 'USDA', '100254', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 10.0 FROM foods WHERE source='USDA' AND external_id='100254';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.4 FROM foods WHERE source='USDA' AND external_id='100254';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Strawberries, Diced, Cups, Frozen (Wawona Frozen Foods)', 'Strawberries, Diced, Cups, Frozen (Wawona Frozen Foods)', 'Wawona Frozen Foods', '10034742055995', 80, 1.0, 19.0, 0.0, 2.0, '128 GRM', 6, 'USDA', '100256', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 19.0 FROM foods WHERE source='USDA' AND external_id='100256';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Apricots, Diced, Cups, Frozen  (Big Valley)', 'Apricots, Diced, Cups, Frozen  (Big Valley)', 'Big Valley', '10071202303005', 110, 1.0, 25.0, 0.0, 2.0, '128 GRM', 6, 'USDA', '100261', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.4 FROM foods WHERE source='USDA' AND external_id='100261';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Orange Juice, Unsweetened, Cartons, Frozen  (SUNCUP)', 'Orange Juice, Unsweetened, Cartons, Frozen  (SUNCUP)', 'SUNCUP', '774840301015', 60, 0.0, 14.0, 0.0, 0.0, '118 milliliters MLT', 6, 'USDA', '100277', 'approved', 1);
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Raisins, Unsweetened, Individual Portion (Sun-Maid®)', 'Raisins, Unsweetened, Individual Portion (Sun-Maid®)', 'Sun-Maid®', '41143121221', 120, 1.0, 30.0, 0.0, 2.0, '38 GRM', 6, 'USDA', '100293', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 20.0 FROM foods WHERE source='USDA' AND external_id='100293';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.7 FROM foods WHERE source='USDA' AND external_id='100293';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Green, Low-sodium, Canned (K) (Hart)', 'Beans, Green, Low-sodium, Canned (K) (Hart)', 'Hart', '70222072604', 15, 1.0, 3.0, 0.0, 1.0, '120 GRM', 5, 'USDA', '100307', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 26.0 FROM foods WHERE source='USDA' AND external_id='100307';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='100307';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Carrots, Sliced, Low-sodium, Canned  (Hart)', 'Carrots, Sliced, Low-sodium, Canned  (Hart)', 'Hart', '70222073731', 20, 0.0, 4.0, 0.0, 1.0, '120 GRM', 5, 'USDA', '100309', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 37.0 FROM foods WHERE source='USDA' AND external_id='100309';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Corn, Whole Kernel, No Salt Added, Canned (K) (Hart)', 'Corn, Whole Kernel, No Salt Added, Canned (K) (Hart)', 'Hart', '70222073779', 60, 1.0, 9.0, 0.5, 1.0, '125 GRM', 5, 'USDA', '100313', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 13.0 FROM foods WHERE source='USDA' AND external_id='100313';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Peas, Green, Low-sodium, Canned  (Hart)', 'Peas, Green, Low-sodium, Canned  (Hart)', 'Hart', '70222074271', 60, 3.0, 11.0, 0.0, 3.0, '125 GRM', 5, 'USDA', '100315', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 17.0 FROM foods WHERE source='USDA' AND external_id='100315';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='100315';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Sweet Potatoes, Light Syrup, No Salt Added, Canned  (Dunbar)', 'Sweet Potatoes, Light Syrup, No Salt Added, Canned  (Dunbar)', 'Dunbar', '10023709820134', 130, 0.0, 34.0, 0.0, 4.0, '160 GRM', 5, 'USDA', '100317', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 16.0 FROM foods WHERE source='USDA' AND external_id='100317';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Tomato Paste, No Salt Added, Canned  (Villa d\'Este)', 'Tomato Paste, No Salt Added, Canned  (Villa d\'Este)', 'Villa d\'Este', '10041712470504', 25, 1.0, 6.0, 0.0, 1.0, '30 GRM', 5, 'USDA', '100327', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 11.0 FROM foods WHERE source='USDA' AND external_id='100327';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='100327';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Tomatoes, Diced, No Salt Added, Canned  (Villa d\'Este)', 'Tomatoes, Diced, No Salt Added, Canned  (Villa d\'Este)', 'Villa d\'Este', '10041712174518', 25, 1.0, 5.0, 0.0, 1.0, '130 GRM', 5, 'USDA', '100329', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 27.0 FROM foods WHERE source='USDA' AND external_id='100329';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Salsa, Low-sodium, Canned  (Villa d\'Este)', 'Salsa, Low-sodium, Canned  (Villa d\'Este)', 'Villa d\'Este', '10041712772745', 35, 2.0, 7.0, 0.0, 2.0, '123 GRM', 5, 'USDA', '100330', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 17.0 FROM foods WHERE source='USDA' AND external_id='100330';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='100330';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Tomato Sauce, Low-sodium, Canned  (Villa d\'Este)', 'Tomato Sauce, Low-sodium, Canned  (Villa d\'Este)', 'Villa d\'Este', '10041712770543', 40, 2.0, 9.0, 0.0, 2.0, '123 GRM', 5, 'USDA', '100334', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 20.0 FROM foods WHERE source='USDA' AND external_id='100334';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='100334';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Spaghetti Sauce, Low-sodium, Canned (Villa d\'Este)', 'Spaghetti Sauce, Low-sodium, Canned (Villa d\'Este)', 'Villa d\'Este', '10041712771540', 35, 2.0, 8.0, 0.0, 2.0, '125 GRM', 5, 'USDA', '100336', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 19.0 FROM foods WHERE source='USDA' AND external_id='100336';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='100336';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Corn, Whole Kernel, No Salt Added, Frozen  (Libby\'s)', 'Corn, Whole Kernel, No Salt Added, Frozen  (Libby\'s)', 'Libby\'s', '10037100451934', 80, 3.0, 15.0, 1.0, 3.0, '93 GRM', 5, 'USDA', '100348', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.4 FROM foods WHERE source='USDA' AND external_id='100348';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Peas, Green, No Salt Added, Frozen  (Libby\'s)', 'Peas, Green, No Salt Added, Frozen  (Libby\'s)', 'Libby\'s', '10037100421630', 80, 5.0, 13.0, 0.0, 5.0, '93 GRM', 5, 'USDA', '100350', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 20.0 FROM foods WHERE source='USDA' AND external_id='100350';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.4 FROM foods WHERE source='USDA' AND external_id='100350';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Green, No Salt Added, Frozen  (Libby\'s)', 'Beans, Green, No Salt Added, Frozen  (Libby\'s)', 'Libby\'s', '10037100343130', 35, 2.0, 7.0, 0.0, 2.0, '89 GRM', 5, 'USDA', '100351', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 40.0 FROM foods WHERE source='USDA' AND external_id='100351';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.8 FROM foods WHERE source='USDA' AND external_id='100351';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Carrots, Sliced, No Salt Added, Frozen  (Libby\'s)', 'Carrots, Sliced, No Salt Added, Frozen  (Libby\'s)', 'Libby\'s', '10037100513144', 30, 0.0, 7.0, 0.0, 3.0, '86 GRM', 5, 'USDA', '100352', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 30.0 FROM foods WHERE source='USDA' AND external_id='100352';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.4 FROM foods WHERE source='USDA' AND external_id='100352';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Potatoes, Wedges, Fat Free, Low-sodium, Frozen (IQF) (Dickinson Frozen Foods)', 'Potatoes, Wedges, Fat Free, Low-sodium, Frozen (IQF) (Dickinson Frozen Foods)', 'Dickinson Frozen Foods', '86289201628', 70, 2.0, 16.0, 0.0, 1.0, '80 GRM', 5, 'USDA', '100356', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 7.0 FROM foods WHERE source='USDA' AND external_id='100356';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='100356';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Black, Low-sodium, Canned  (Michigan Made)', 'Beans, Black, Low-sodium, Canned  (Michigan Made)', 'Michigan Made', '71109999434', 110, 2.0, 19.0, 1.0, 7.0, '130 GRM', 5, 'USDA', '100359', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 50.0 FROM foods WHERE source='USDA' AND external_id='100359';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 2.0 FROM foods WHERE source='USDA' AND external_id='100359';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Garbanzo, Low-sodium, Canned (K) (Michigan Made)', 'Beans, Garbanzo, Low-sodium, Canned (K) (Michigan Made)', 'Michigan Made', '71109999830', 110, 6.0, 18.0, 1.0, 6.0, '130 GRM', 5, 'USDA', '100360', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 20.0 FROM foods WHERE source='USDA' AND external_id='100360';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.1 FROM foods WHERE source='USDA' AND external_id='100360';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Refried, Low-sodium, Canned  (Hart)', 'Beans, Refried, Low-sodium, Canned  (Hart)', 'Hart', '70222073823', 140, 8.0, 24.0, 1.5, 6.0, '130 GRM', 5, 'USDA', '100362', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 50.0 FROM foods WHERE source='USDA' AND external_id='100362';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 2.0 FROM foods WHERE source='USDA' AND external_id='100362';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Vegetarian, Low-sodium, Canned  (Michigan Made)', 'Beans, Vegetarian, Low-sodium, Canned  (Michigan Made)', 'Michigan Made', '71109999236', 130, 6.0, 20.0, 0.0, 4.0, '130 GRM', 5, 'USDA', '100364', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 50.0 FROM foods WHERE source='USDA' AND external_id='100364';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 2.4 FROM foods WHERE source='USDA' AND external_id='100364';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Pinto, Low-sodium, Canned  (Michigan Made)', 'Beans, Pinto, Low-sodium, Canned  (Michigan Made)', 'Michigan Made', '71109999137', 80, 8.0, 19.0, 0.0, 7.0, '130 GRM', 5, 'USDA', '100365', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 50.0 FROM foods WHERE source='USDA' AND external_id='100365';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='100365';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Small Red, Low-sodium, Canned  (Michigan Made)', 'Beans, Small Red, Low-sodium, Canned  (Michigan Made)', 'Michigan Made', '71109999632', 110, 6.0, 20.0, 0.5, 9.0, '130 GRM', 5, 'USDA', '100366', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 50.0 FROM foods WHERE source='USDA' AND external_id='100366';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='100366';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Black-eyed Pea, Low-sodium, Canned  (Margaret Holmes)', 'Beans, Black-eyed Pea, Low-sodium, Canned  (Margaret Holmes)', 'Margaret Holmes', '10041443117822', 90, 5.0, 14.0, 0.0, 4.0, '130 GRM', 5, 'USDA', '100368', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 32.0 FROM foods WHERE source='USDA' AND external_id='100368';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 2.0 FROM foods WHERE source='USDA' AND external_id='100368';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Pink, Low-sodium, Canned  (Michigan Made)', 'Beans, Pink, Low-sodium, Canned  (Michigan Made)', 'Michigan Made', '71109999038', 80, 5.0, 16.0, 0.0, 7.0, '130 GRM', 5, 'USDA', '100369', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 50.0 FROM foods WHERE source='USDA' AND external_id='100369';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='100369';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Kidney, Dark Red, Low-sodium, Canned  (Michigan Made)', 'Beans, Kidney, Dark Red, Low-sodium, Canned  (Michigan Made)', 'Michigan Made', '71109999731', 75, 8.0, 14.0, 0.0, 5.0, '130 GRM', 5, 'USDA', '100370', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 50.0 FROM foods WHERE source='USDA' AND external_id='100370';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='100370';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Baby Lima, Low-sodium, Canned  (Allens)', 'Beans, Baby Lima, Low-sodium, Canned  (Allens)', 'Allens', '10034700512140', 110, 9.0, 20.0, 0.0, 5.0, '128 GRM', 5, 'USDA', '100371', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 40.0 FROM foods WHERE source='USDA' AND external_id='100371';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.44 FROM foods WHERE source='USDA' AND external_id='100371';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Great Northern, Low-sodium, Canned  (Michigan Made)', 'Beans, Great Northern, Low-sodium, Canned  (Michigan Made)', 'Michigan Made', '71109999533', 110, 6.0, 24.0, 0.0, 7.0, '130 GRM', 5, 'USDA', '100373', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 53.0 FROM foods WHERE source='USDA' AND external_id='100373';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.6 FROM foods WHERE source='USDA' AND external_id='100373';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Pinto, Dry (Pappy\'s Pantry)', 'Beans, Pinto, Dry (Pappy\'s Pantry)', 'Pappy\'s Pantry', '753213757727', 225, 19.3, 62.43, 1.72, 32.8, '100 GRM', 5, 'USDA', '100382', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 35.0 FROM foods WHERE source='USDA' AND external_id='100382';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 5.31 FROM foods WHERE source='USDA' AND external_id='100382';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Peanut Butter, Smooth (Algood)', 'Peanut Butter, Smooth (Algood)', 'Algood', '88252010756', 180, 7.0, 8.0, 15.0, 2.0, '32 GRM', 6, 'USDA', '100396', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 19.0 FROM foods WHERE source='USDA' AND external_id='100396';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.5 FROM foods WHERE source='USDA' AND external_id='100396';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Flour, All Purpose, Enriched, Bleached (Stafford County Flour Mills)', 'Flour, All Purpose, Enriched, Bleached (Stafford County Flour Mills)', 'Stafford County Flour Mills', '76929002050', 110, 3.0, 23.0, 0.0, 1.0, '30 GRM', 2, 'USDA', '100400', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 7.0 FROM foods WHERE source='USDA' AND external_id='100400';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='100400';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Pasta, Spaghetti, Enriched (Ravarino)', 'Pasta, Spaghetti, Enriched (Ravarino)', 'Ravarino', '47325905269', 210, 7.0, 41.0, 1.0, 2.0, '56 GRM', 2, 'USDA', '100425', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 10.0 FROM foods WHERE source='USDA' AND external_id='100425';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Oats, Rolled, Quick Cooking (Ralston Foods)', 'Oats, Rolled, Quick Cooking (Ralston Foods)', 'Ralston Foods', '791669620226', 150, 5.0, 27.0, 2.5, 4.0, '40 GRM', 2, 'USDA', '100465', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.6 FROM foods WHERE source='USDA' AND external_id='100465';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Rice, Long Grain, Parboiled (Riceland)', 'Rice, Long Grain, Parboiled (Riceland)', 'Riceland', '35200265492', 170, 4.0, 37.0, 0.0, 0.0, '47 GRM', 2, 'USDA', '100494', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 50.0 FROM foods WHERE source='USDA' AND external_id='100494';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.4 FROM foods WHERE source='USDA' AND external_id='100494';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Chicken, Oven Roasted, Cut-up, Cooked, Frozen  (Tyson)', 'Chicken, Oven Roasted, Cut-up, Cooked, Frozen  (Tyson)', 'Tyson', '10715001236309', 160, 18.0, 0.0, 9.0, 0.0, '84 GRM', 1, 'USDA', '110080', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 20.0 FROM foods WHERE source='USDA' AND external_id='110080';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.7 FROM foods WHERE source='USDA' AND external_id='110080';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Spaghetti Sauce, Low-sodium, Pouch (Tomatek)', 'Spaghetti Sauce, Low-sodium, Pouch (Tomatek)', 'Tomatek', '10715001101775', 35, 2.0, 8.0, 0.0, 2.0, '124 GRM', 5, 'USDA', '110177', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 19.0 FROM foods WHERE source='USDA' AND external_id='110177';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='110177';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Salsa, Low-sodium, Pouch  (Tomatek)', 'Salsa, Low-sodium, Pouch  (Tomatek)', 'Tomatek', '10715001101867', 35, 2.0, 8.0, 0.0, 2.0, '125 GRM', 5, 'USDA', '110186', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 18.0 FROM foods WHERE source='USDA' AND external_id='110186';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='110186';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Tomato Sauce, Low-sodium, Pouch  (Tomatek)', 'Tomato Sauce, Low-sodium, Pouch  (Tomatek)', 'Tomatek', '10715001101874', 40, 2.0, 9.0, 0.0, 2.0, '120 GRM', 5, 'USDA', '110187', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 19.0 FROM foods WHERE source='USDA' AND external_id='110187';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='110187';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Flour, White Whole Wheat/Enriched 60/40 Blend (SCFM)', 'Flour, White Whole Wheat/Enriched 60/40 Blend (SCFM)', 'SCFM', '76929012257', 100, 3.0, 23.0, 0.5, 4.0, '30 GRM', 2, 'USDA', '110208', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 10.0 FROM foods WHERE source='USDA' AND external_id='110208';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='110208';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Flour, White Whole Wheat/Enriched 60/40 Blend (Stafford County Flour Mills)', 'Flour, White Whole Wheat/Enriched 60/40 Blend (Stafford County Flour Mills)', 'Stafford County Flour Mills', '76929012059', 100, 3.0, 23.0, 0.5, 4.0, '30 GRM', 2, 'USDA', '110211', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 10.0 FROM foods WHERE source='USDA' AND external_id='110211';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='110211';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beef, Fine Ground, 100%, 85/15, LFTB OPT, Raw, Frozen (Criss Cross Express of Illinois, LLC)', 'Beef, Fine Ground, 100%, 85/15, LFTB OPT, Raw, Frozen (Criss Cross Express of Illinois, LLC)', 'Criss Cross Express of Illinois, LLC', '195893253012', 240, 22.0, 0.0, 17.0, 0.0, '112 GRM', 1, 'USDA', '110261', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='110261';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beef, Patties w/SPP, Cooked, 2.0 MMA, Frozen  (Mistica Ranch)', 'Beef, Patties w/SPP, Cooked, 2.0 MMA, Frozen  (Mistica Ranch)', 'Mistica Ranch', '10810869031926', 118, 11.16, 1.86, 6.82, 1.2, '62 GRM', 1, 'USDA', '110322', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 19.0 FROM foods WHERE source='USDA' AND external_id='110322';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.3 FROM foods WHERE source='USDA' AND external_id='110322';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beef, Patties, 100%, 90/10, Raw, 2.0 MMA, Frozen (Cherry Meat Packers)', 'Beef, Patties, 100%, 90/10, Raw, 2.0 MMA, Frozen (Cherry Meat Packers)', 'Cherry Meat Packers', '79183103464', 130, 15.0, 0.0, 8.0, 0.0, '80 GRM', 1, 'USDA', '110346', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 2.0 FROM foods WHERE source='USDA' AND external_id='110346';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beef, Patties, 100%, 85/15, Raw, 2.0 MMA, Frozen (Palo Duro Brand)', 'Beef, Patties, 100%, 85/15, Raw, 2.0 MMA, Frozen (Palo Duro Brand)', 'Palo Duro Brand', '90052846160083', 172, 15.0, 0.0, 12.0, 0.0, '80 GRM', 1, 'USDA', '110349', 'approved', 1);
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Applesauce, Unsweetened, Cups, Shelf-Stable (Peterson Farms)', 'Applesauce, Unsweetened, Cups, Shelf-Stable (Peterson Farms)', 'Peterson Farms', '10604774202119', 50, 0.0, 14.0, 0.0, 1.0, '128 GRM', 6, 'USDA', '110361', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 5.0 FROM foods WHERE source='USDA' AND external_id='110361';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Pancakes, Whole Grain or Whole Grain-Rich, Frozen (Echo Lake Foods)', 'Pancakes, Whole Grain or Whole Grain-Rich, Frozen (Echo Lake Foods)', 'Echo Lake Foods', '10786294720165', 130, 4.0, 26.0, 2.0, 3.0, '68 GRM', 2, 'USDA', '110393', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 63.0 FROM foods WHERE source='USDA' AND external_id='110393';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='110393';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Tortillas, Whole Grain or Whole Grain-Rich, 8 inch, Frozen (Catallia)', 'Tortillas, Whole Grain or Whole Grain-Rich, 8 inch, Frozen (Catallia)', 'Catallia', '10729630400284', 110, 3.0, 18.0, 3.0, 3.0, '44 GRM', 2, 'USDA', '110394', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 38.0 FROM foods WHERE source='USDA' AND external_id='110394';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='110394';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Cheese, Mozzarella, Low Moisture Part Skim, String, Chilled (Sargento)', 'Cheese, Mozzarella, Low Moisture Part Skim, String, Chilled (Sargento)', 'Sargento', '46100007006', 90, 7.0, 1.0, 6.0, 0.0, '28 GRM', 1, 'USDA', '110396', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 210.0 FROM foods WHERE source='USDA' AND external_id='110396';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.1 FROM foods WHERE source='USDA' AND external_id='110396';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Yogurt, High-Protein, Blueberry, Chilled (K) (Chobani®)', 'Yogurt, High-Protein, Blueberry, Chilled (K) (Chobani®)', 'Chobani®', '818290010506', 90, 9.0, 13.0, 0.0, 1.0, '113 GRM', 6, 'USDA', '110400', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 110.0 FROM foods WHERE source='USDA' AND external_id='110400';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Yogurt, High-Protein, Strawberry, Chilled (K) (Chobani®)', 'Yogurt, High-Protein, Strawberry, Chilled (K) (Chobani®)', 'Chobani®', '818290010490', 90, 9.0, 12.0, 0.0, 1.0, '113 GRM', 6, 'USDA', '110401', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 110.0 FROM foods WHERE source='USDA' AND external_id='110401';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Yogurt, High-Protein, Vanilla, Chilled (K) (Chobani®)', 'Yogurt, High-Protein, Vanilla, Chilled (K) (Chobani®)', 'Chobani®', '818290010513', 80, 9.0, 11.0, 0.0, 0.0, '113 GRM', 6, 'USDA', '110402', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 110.0 FROM foods WHERE source='USDA' AND external_id='110402';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Chicken, Unseasoned Grilled Strips, Cooked, Frozen (Tyson)', 'Chicken, Unseasoned Grilled Strips, Cooked, Frozen (Tyson)', 'Tyson', '31400081849', 120, 19.0, 1.0, 5.0, 0.0, '84 GRM', 1, 'USDA', '110462', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 10.0 FROM foods WHERE source='USDA' AND external_id='110462';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.5 FROM foods WHERE source='USDA' AND external_id='110462';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Broccoli Florets, No Salt Added, Frozen (Cebro Frozen Foods)', 'Broccoli Florets, No Salt Added, Frozen (Cebro Frozen Foods)', 'Cebro Frozen Foods', '86289207866', 10, 1.0, 2.0, 0.0, 1.0, '42 GRM', 5, 'USDA', '110473', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 20.0 FROM foods WHERE source='USDA' AND external_id='110473';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.5 FROM foods WHERE source='USDA' AND external_id='110473';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Carrots, Diced, No Salt Added, Frozen (PNW/Quincy)', 'Carrots, Diced, No Salt Added, Frozen (PNW/Quincy)', 'PNW/Quincy', '86289201284', 25, 1.0, 6.0, 0.0, 2.0, '64 GRM', 5, 'USDA', '110480', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 20.0 FROM foods WHERE source='USDA' AND external_id='110480';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.3 FROM foods WHERE source='USDA' AND external_id='110480';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Pasta, Macaroni, Whole Grain-Rich Blend (Heartland)', 'Pasta, Macaroni, Whole Grain-Rich Blend (Heartland)', 'Heartland', '47325907591', 200, 7.0, 41.0, 1.5, 5.0, '56 GRM', 2, 'USDA', '110501', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 2.0 FROM foods WHERE source='USDA' AND external_id='110501';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Pasta, Rotini, Whole Grain-Rich Blend (Heartland)', 'Pasta, Rotini, Whole Grain-Rich Blend (Heartland)', 'Heartland', '20047325902828', 200, 7.0, 41.0, 1.5, 5.0, '56 GRM', 2, 'USDA', '110504', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 10.0 FROM foods WHERE source='USDA' AND external_id='110504';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Pasta, Spaghetti, Whole Grain-Rich Blend (Heartland)', 'Pasta, Spaghetti, Whole Grain-Rich Blend (Heartland)', 'Heartland', '47325902831', 200, 7.0, 41.0, 1.5, 5.0, '56 GRM', 2, 'USDA', '110506', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 2.0 FROM foods WHERE source='USDA' AND external_id='110506';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Pasta, Penne, Whole Grain-Rich Blend (ZEREGA)', 'Pasta, Penne, Whole Grain-Rich Blend (ZEREGA)', 'ZEREGA', '10070753081547', 200, 7.0, 41.0, 1.0, 1.0, '56 GRM', 2, 'USDA', '110520', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 10.0 FROM foods WHERE source='USDA' AND external_id='110520';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Applesauce, Unsweetened, Canned (K) (Mission Pride)', 'Applesauce, Unsweetened, Canned (K) (Mission Pride)', 'Mission Pride', '73934150769', 60, 0.0, 15.0, 0.0, 1.0, '135 GRM', 6, 'USDA', '110541', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 5.0 FROM foods WHERE source='USDA' AND external_id='110541';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Sweet Potatoes, Cubes, No Salt Added, Frozen (Trinity Frozen Foods )', 'Sweet Potatoes, Cubes, No Salt Added, Frozen (Trinity Frozen Foods )', 'Trinity Frozen Foods ', '10086289201649', 45, 1.0, 10.0, 0.0, 1.0, '56 GRM', 5, 'USDA', '110562', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 15.0 FROM foods WHERE source='USDA' AND external_id='110562';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.4 FROM foods WHERE source='USDA' AND external_id='110562';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Blueberries, Unsweetened, Frozen  (Cardinal Foods)', 'Blueberries, Unsweetened, Frozen  (Cardinal Foods)', 'Cardinal Foods', '10715001106237', 40, 0.33, 9.49, 0.5, 2.1, '78 GRM', 6, 'USDA', '110623', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 6.0 FROM foods WHERE source='USDA' AND external_id='110623';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.14 FROM foods WHERE source='USDA' AND external_id='110623';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Blueberries, Unsweetened, Frozen  (Cardinal Foods)', 'Blueberries, Unsweetened, Frozen  (Cardinal Foods)', 'Cardinal Foods', '10715001106244', 39, 0.3276, 9.4926, 0.4992, 2.106, '78 GRM', 6, 'USDA', '110624', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 6.24 FROM foods WHERE source='USDA' AND external_id='110624';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.1404 FROM foods WHERE source='USDA' AND external_id='110624';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Orange Juice, Unsweetened, Cups, Frozen (SUNCUP)', 'Orange Juice, Unsweetened, Cups, Frozen (SUNCUP)', 'SUNCUP', '774840701013', 60, 0.0, 14.0, 0.0, 0.0, '118 milliliters MLT', 6, 'USDA', '110651', 'approved', 1);
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beef, Patties, Cooked, 2.0 MMA, Frozen (Mistica Ranch)', 'Beef, Patties, Cooked, 2.0 MMA, Frozen (Mistica Ranch)', 'Mistica Ranch', '10810869031919', 130, 11.47, 0.25, 8.27, 0.0, '62 GRM', 1, 'USDA', '110711', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 11.0 FROM foods WHERE source='USDA' AND external_id='110711';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.34 FROM foods WHERE source='USDA' AND external_id='110711';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Sweet Potatoes, Crinkle Cut Fries, Low-Sodium, Frozen (Trinity Frozen Foods )', 'Sweet Potatoes, Crinkle Cut Fries, Low-Sodium, Frozen (Trinity Frozen Foods )', 'Trinity Frozen Foods ', '10086289201656', 130, 2.0, 19.0, 5.0, 4.0, '85 GRM', 5, 'USDA', '110721', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 19.0 FROM foods WHERE source='USDA' AND external_id='110721';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.4 FROM foods WHERE source='USDA' AND external_id='110721';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Cranberries, Dried, Individual Portion (Sun Valley Raisins, Inc.)', 'Cranberries, Dried, Individual Portion (Sun Valley Raisins, Inc.)', 'Sun Valley Raisins, Inc.', '858023005317', 115, 0.0, 27.72, 0.0, 1.98, '33 GRM', 6, 'USDA', '110723', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 4.95 FROM foods WHERE source='USDA' AND external_id='110723';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.099 FROM foods WHERE source='USDA' AND external_id='110723';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Pepper/Onion Strips, No Salt Added, Frozen (Dickinson Frozen Foods)', 'Pepper/Onion Strips, No Salt Added, Frozen (Dickinson Frozen Foods)', 'Dickinson Frozen Foods', '86289281736', 25, 1.0, 6.0, 0.1, 0.7, '56 GRM', 5, 'USDA', '110724', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 12.0 FROM foods WHERE source='USDA' AND external_id='110724';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.1 FROM foods WHERE source='USDA' AND external_id='110724';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Pork, Pulled, Cooked, Frozen (Rose Packing)', 'Pork, Pulled, Cooked, Frozen (Rose Packing)', 'Rose Packing', '77052307623', 120, 14.0, 0.0, 7.0, 0, '84 GRM', 1, 'USDA', '110730', 'approved', 1);
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Peas, Green, No Salt Added, Frozen  (Lakeside Foods Inc.)', 'Peas, Green, No Salt Added, Frozen  (Lakeside Foods Inc.)', 'Lakeside Foods Inc.', '33828306030', 70, 4.0, 12.0, 0.0, 4.0, '89 GRM', 5, 'USDA', '110763', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.1 FROM foods WHERE source='USDA' AND external_id='110763';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Potatoes, Diced, No Salt Added, Frozen (Dickinson Frozen Foods)', 'Potatoes, Diced, No Salt Added, Frozen (Dickinson Frozen Foods)', 'Dickinson Frozen Foods', '86289201635', 25, 0.3, 5.0, 0.0, 2.0, '64 GRM', 5, 'USDA', '110844', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 154.0 FROM foods WHERE source='USDA' AND external_id='110844';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Eggs, Liquid Whole, Frozen  (Sonstegard Foods)', 'Eggs, Liquid Whole, Frozen  (Sonstegard Foods)', 'Sonstegard Foods', '664194000033', 70, 6.0, 1.0, 4.5, 0.0, '50 GRM', 1, 'USDA', '110845', 'approved', 1);
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Strawberries, Whole, Unsweetened, Frozen (IQF) (Anacapa Foods)', 'Strawberries, Whole, Unsweetened, Frozen (IQF) (Anacapa Foods)', 'Anacapa Foods', '10086289208648', 25, 0.3, 6.0, 0.0, 1.0, '70 GRM', 6, 'USDA', '110846', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 10.0 FROM foods WHERE source='USDA' AND external_id='110846';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.5 FROM foods WHERE source='USDA' AND external_id='110846';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Alaska Pollock, Whole Grain-Rich Breaded Sticks, Frozen (Trident Seafoods)', 'Alaska Pollock, Whole Grain-Rich Breaded Sticks, Frozen (Trident Seafoods)', 'Trident Seafoods', '10028029250890', 220, 16.0, 20.0, 9.0, 2.0, '113 GRM', 1, 'USDA', '110851', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 20.0 FROM foods WHERE source='USDA' AND external_id='110851';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 5.2 FROM foods WHERE source='USDA' AND external_id='110851';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Peanut Butter, Individual Portion, Smooth (MeWe)', 'Peanut Butter, Individual Portion, Smooth (MeWe)', 'MeWe', '852118008580', 200, 7.0, 4.0, 16.0, 2.0, '31.2 GRM', 6, 'USDA', '110854', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 0.014 FROM foods WHERE source='USDA' AND external_id='110854';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.5 FROM foods WHERE source='USDA' AND external_id='110854';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Flour, 100% White Whole Wheat (Hudson Cream Flour)', 'Flour, 100% White Whole Wheat (Hudson Cream Flour)', 'Hudson Cream Flour', '76929001053', 110, 4.0, 22.0, 0.5, 4.0, '30 GRM', 2, 'USDA', '110857', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 12.0 FROM foods WHERE source='USDA' AND external_id='110857';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='110857';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Mixed Berries (Blueberries, Strawberries), Cups, Frozen (Wawona Frozen Foods)', 'Mixed Berries (Blueberries, Strawberries), Cups, Frozen (Wawona Frozen Foods)', 'Wawona Frozen Foods', '10034742055803', 70, 1.0, 19.0, 0.0, 3.0, '113 GRM', 6, 'USDA', '110859', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 22.0 FROM foods WHERE source='USDA' AND external_id='110859';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Strawberries, Sliced, Unsweetened, Frozen (IQF) (Sure Fresh Produce, Inc. )', 'Strawberries, Sliced, Unsweetened, Frozen (IQF) (Sure Fresh Produce, Inc. )', 'Sure Fresh Produce, Inc. ', '10086289208631', 25, 0.3, 6.0, 0.0, 1.0, '70 GRM', 6, 'USDA', '110860', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 10.0 FROM foods WHERE source='USDA' AND external_id='110860';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.5 FROM foods WHERE source='USDA' AND external_id='110860';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Cherries, Sweet, Pitted, Unsweetened, Frozen (IQF) (Peterson Farms)', 'Cherries, Sweet, Pitted, Unsweetened, Frozen (IQF) (Peterson Farms)', 'Peterson Farms', '10604774292936', 90, 1.0, 22.0, 0.0, 3.0, '140 GRM', 6, 'USDA', '110872', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 18.0 FROM foods WHERE source='USDA' AND external_id='110872';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='110872';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Chicken, Grilled Fillet, 2.0 MMA, Cooked, Frozen (Tyson)', 'Chicken, Grilled Fillet, 2.0 MMA, Cooked, Frozen (Tyson)', 'Tyson', '31400084017', 120, 19.0, 0.0, 4.0, 0.0, '80 GRM', 1, 'USDA', '110921', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 10.0 FROM foods WHERE source='USDA' AND external_id='110921';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.5 FROM foods WHERE source='USDA' AND external_id='110921';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Carrots, Diced, No Salt Added, Frozen (PNW/Quincy)', 'Carrots, Diced, No Salt Added, Frozen (PNW/Quincy)', 'PNW/Quincy', '10086289201212', 26, 1.0, 6.0, 0.0, 2.0, '64 GRM', 5, 'USDA', '111052', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 20.0 FROM foods WHERE source='USDA' AND external_id='111052';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.3 FROM foods WHERE source='USDA' AND external_id='111052';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Corn, Whole Kernel, No Salt Added, Frozen  (Lakeside Foods)', 'Corn, Whole Kernel, No Salt Added, Frozen  (Lakeside Foods)', 'Lakeside Foods', '33828604235', 100, 2.0, 21.0, 1.0, 2.0, '90 GRM', 5, 'USDA', '111053', 'approved', 1);
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Beans, Green, No Salt Added, Frozen  (Lakeside Foods)', 'Beans, Green, No Salt Added, Frozen  (Lakeside Foods)', 'Lakeside Foods', '33828503026', 35, 1.4, 7.1, 0.0, 2.3, '81 GRM', 5, 'USDA', '111054', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 36.3 FROM foods WHERE source='USDA' AND external_id='111054';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.6 FROM foods WHERE source='USDA' AND external_id='111054';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Cheese, Cheddar, Yellow, Sliced, Chilled (Cheese Crafters)', 'Cheese, Cheddar, Yellow, Sliced, Chilled (Cheese Crafters)', 'Cheese Crafters', '10664857146907', 80, 5.0, 0.0, 7.0, 0.0, '21 GRM', 1, 'USDA', '111110', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 150.0 FROM foods WHERE source='USDA' AND external_id='111110';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Cheese, Pepper Jack, Shredded, Chilled (Cheese Crafters)', 'Cheese, Pepper Jack, Shredded, Chilled (Cheese Crafters)', 'Cheese Crafters', '10664857146280', 100, 6.0, 1.0, 8.0, 0.0, '28 GRM', 1, 'USDA', '111220', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 190.0 FROM foods WHERE source='USDA' AND external_id='111220';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Mixed Vegetables, No Salt Added, Frozen (Lakeside Foods)', 'Mixed Vegetables, No Salt Added, Frozen (Lakeside Foods)', 'Lakeside Foods', '33828383093', 50, 2.0, 11.0, 0.0, 3.0, '90 GRM', 5, 'USDA', '111230', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.5 FROM foods WHERE source='USDA' AND external_id='111230';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Chicken, Cut-up, Raw, Frozen  (Tyson)', 'Chicken, Cut-up, Raw, Frozen  (Tyson)', 'Tyson', '10715001015157', 250, 19.0, 0.0, 19.0, 0.0, '112 GRM', 1, 'USDA', '111361', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 1.0 FROM foods WHERE source='USDA' AND external_id='111361';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Yogurt, High-Protein, Vanilla, Chilled (K) (Hood)', 'Yogurt, High-Protein, Vanilla, Chilled (K) (Hood)', 'Hood', '44100158940', 130, 15.0, 18.0, 0.0, 1.0, '170 GRM', 6, 'USDA', '111750', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 170.0 FROM foods WHERE source='USDA' AND external_id='111750';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.1 FROM foods WHERE source='USDA' AND external_id='111750';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Eggs, Patties, Cooked, 1.0 MMA, Round, Frozen (Papetti\'s®)', 'Eggs, Patties, Cooked, 1.0 MMA, Round, Frozen (Papetti\'s®)', 'Papetti\'s®', '10746025702334', 60, 4.0, 1.0, 4.5, 0.0, '35 GRM', 1, 'USDA', '111751', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 20.0 FROM foods WHERE source='USDA' AND external_id='111751';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.6 FROM foods WHERE source='USDA' AND external_id='111751';
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Turkey, Deli Breast, Smoked, Sliced, Frozen (Cargill Unbranded)', 'Turkey, Deli Breast, Smoked, Sliced, Frozen (Cargill Unbranded)', 'Cargill Unbranded', '10642205008923', 60, 12.0, 1.0, 1.0, 0.0, '56 GRM', 1, 'USDA', '111882', 'approved', 1);
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Turkey, Deli Ham, Smoked, Sliced, Frozen (Hof Hause)', 'Turkey, Deli Ham, Smoked, Sliced, Frozen (Hof Hause)', 'Hof Hause', '713480109117', 60, 9.0, 2.0, 1.5, 0.0, '57 GRM', 1, 'USDA', '111893', 'approved', 1);
INSERT INTO foods (name, name_en, brand, barcode, calories, protein, carbs, fat, fiber, serving_size, category_id, source, external_id, status, created_by) VALUES ('Turkey, Deli Breast, Sliced, Frozen (ES Foods)', 'Turkey, Deli Breast, Sliced, Frozen (ES Foods)', 'ES Foods', '10715001109030', 60, 1.0, 0.0, 1.0, 0.0, '55 GRM', 1, 'USDA', '111900', 'approved', 1);
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='CALCIUM'), 26.0 FROM foods WHERE source='USDA' AND external_id='111900';
INSERT INTO food_nutrients (food_id, nutrient_id, amount) SELECT id, (SELECT id FROM nutrients WHERE code='IRON'), 0.36 FROM foods WHERE source='USDA' AND external_id='111900';