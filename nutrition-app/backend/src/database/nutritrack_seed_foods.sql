-- ========================================
-- NutriTrack Thai Foods Seed Data
-- ข้อมูลอาหารไทยสำหรับระบบ NutriTrack
-- ========================================

USE nutritrack;

-- ========================================
-- เพิ่มข้อมูลอาหารไทย 50+ รายการ
-- ========================================

-- อาหารไทยจานเดียว
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('ข้าวผัดไก่', 'Chicken Fried Rice', 450, 18, 55, 15, 2, '1 จาน (300g)', 1, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', 'approved', 1),
('ข้าวผัดกุ้ง', 'Shrimp Fried Rice', 420, 20, 52, 14, 2, '1 จาน (300g)', 1, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', 'approved', 1),
('ข้าวผัดปู', 'Crab Fried Rice', 480, 22, 50, 18, 2, '1 จาน (300g)', 1, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', 'approved', 1),
('ข้าวมันไก่', 'Hainanese Chicken Rice', 550, 28, 60, 20, 1, '1 จาน (350g)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ข้าวหมูแดง', 'Red Pork Rice', 520, 25, 58, 18, 1, '1 จาน (300g)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ข้าวหมูกรอบ', 'Crispy Pork Rice', 600, 22, 55, 28, 1, '1 จาน (300g)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ข้าวขาหมู', 'Stewed Pork Leg Rice', 650, 30, 55, 32, 1, '1 จาน (350g)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1);

-- ผัดกับข้าว
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('ผัดกะเพราหมูสับ', 'Stir-fried Basil with Minced Pork', 520, 25, 45, 22, 3, '1 จาน (250g)', 1, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', 'approved', 1),
('ผัดกะเพราไก่', 'Stir-fried Basil with Chicken', 480, 28, 42, 18, 3, '1 จาน (250g)', 1, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', 'approved', 1),
('ผัดกะเพรากุ้ง', 'Stir-fried Basil with Shrimp', 450, 26, 40, 16, 3, '1 จาน (250g)', 1, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', 'approved', 1),
('ผัดพริกแกงหมู', 'Red Curry Stir-fry Pork', 480, 22, 35, 25, 4, '1 จาน (200g)', 1, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', 'approved', 1),
('ผัดซีอิ๊วไก่', 'Soy Sauce Stir-fry Chicken', 420, 26, 48, 12, 2, '1 จาน (250g)', 1, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', 'approved', 1),
('ผัดคะน้าหมูกรอบ', 'Stir-fried Kale with Crispy Pork', 380, 18, 25, 22, 4, '1 จาน (200g)', 1, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', 'approved', 1),
('ไก่ผัดเม็ดมะม่วงหิมพานต์', 'Cashew Chicken', 450, 28, 30, 24, 3, '1 จาน (200g)', 1, 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=400', 'approved', 1);

-- แกงไทย
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('แกงเขียวหวานไก่', 'Green Curry Chicken', 380, 22, 18, 25, 4, '1 ถ้วย (250ml)', 1, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 'approved', 1),
('แกงเผ็ดหมู', 'Red Curry Pork', 400, 20, 20, 26, 4, '1 ถ้วย (250ml)', 1, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 'approved', 1),
('แกงมัสมั่นไก่', 'Massaman Curry Chicken', 450, 24, 30, 28, 5, '1 ถ้วย (300ml)', 1, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 'approved', 1),
('แกงพะแนงหมู', 'Panang Curry Pork', 420, 22, 22, 28, 3, '1 ถ้วย (250ml)', 1, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 'approved', 1),
('แกงส้มกุ้ง', 'Sour Curry with Shrimp', 280, 24, 20, 12, 5, '1 ถ้วย (250ml)', 1, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 'approved', 1),
('แกงจืดเต้าหู้หมูสับ', 'Clear Soup with Tofu', 180, 15, 12, 8, 2, '1 ถ้วย (250ml)', 1, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 'approved', 1);

-- ต้มยำ & ซุป
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('ต้มยำกุ้ง', 'Tom Yum Goong', 180, 22, 12, 6, 2, '1 ถ้วย (350ml)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ต้มยำไก่', 'Tom Yum Chicken', 160, 20, 10, 5, 2, '1 ถ้วย (350ml)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ต้มข่าไก่', 'Tom Kha Chicken', 320, 18, 15, 22, 2, '1 ถ้วย (350ml)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ต้มเลือดหมู', 'Blood Tofu Soup', 150, 12, 8, 6, 1, '1 ถ้วย (250ml)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1);

-- ยำ & ส้มตำ
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('ส้มตำไทย', 'Thai Papaya Salad', 150, 4, 28, 4, 6, '1 จาน (200g)', 5, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', 'approved', 1),
('ส้มตำปู', 'Papaya Salad with Crab', 180, 8, 26, 6, 5, '1 จาน (200g)', 5, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', 'approved', 1),
('ยำวุ้นเส้น', 'Glass Noodle Salad', 220, 12, 35, 5, 3, '1 จาน (200g)', 5, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', 'approved', 1),
('ยำหมูยอ', 'Vietnamese Sausage Salad', 280, 15, 18, 16, 4, '1 จาน (180g)', 5, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', 'approved', 1),
('ลาบหมู', 'Spicy Minced Pork Salad', 250, 22, 12, 14, 3, '1 จาน (150g)', 1, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', 'approved', 1),
('น้ำตกหมู', 'Grilled Pork Waterfall Salad', 280, 24, 10, 16, 3, '1 จาน (150g)', 1, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', 'approved', 1);

-- ก๋วยเตี๋ยว
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('ก๋วยเตี๋ยวต้มยำ', 'Tom Yum Noodle Soup', 380, 22, 45, 12, 3, '1 ชาม (400ml)', 2, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ก๋วยเตี๋ยวน้ำใส', 'Clear Noodle Soup', 320, 18, 42, 8, 2, '1 ชาม (400ml)', 2, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ก๋วยเตี๋ยวเรือ', 'Boat Noodles', 350, 20, 40, 12, 2, '1 ชาม (300ml)', 2, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ผัดไทยกุ้งสด', 'Pad Thai with Shrimp', 550, 22, 65, 20, 4, '1 จาน (300g)', 2, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', 'approved', 1),
('ผัดซีอิ๊ว', 'Stir-fried Soy Sauce Noodles', 480, 18, 58, 18, 3, '1 จาน (280g)', 2, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', 'approved', 1),
('ราดหน้าหมู', 'Stir-fried Noodles with Gravy', 520, 20, 55, 22, 3, '1 จาน (300g)', 2, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', 'approved', 1);

-- อาหารคลีน & สุขภาพ
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('อกไก่ย่าง', 'Grilled Chicken Breast', 165, 31, 0, 4, 0, '100g', 3, 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400', 'approved', 1),
('สลัดผักรวม', 'Mixed Green Salad', 80, 3, 12, 2, 5, '1 จาน (150g)', 3, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', 'approved', 1),
('ปลานึ่งมะนาว', 'Steamed Fish with Lime', 180, 28, 8, 5, 1, '1 จาน (200g)', 3, 'https://images.unsplash.com/photo-1544384899-8a458e3b31cc?w=400', 'approved', 1),
('ข้าวกล้อง', 'Brown Rice', 216, 5, 45, 2, 4, '1 จาน (150g)', 3, 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400', 'approved', 1),
('ไข่ต้ม', 'Boiled Egg', 78, 6, 1, 5, 0, '1 ฟอง (50g)', 3, 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=400', 'approved', 1),
('ไข่ดาว', 'Fried Egg', 92, 6, 0, 7, 0, '1 ฟอง (55g)', 3, 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=400', 'approved', 1);

-- เครื่องดื่ม
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('ชาเขียว', 'Green Tea (no sugar)', 0, 0, 0, 0, 0, '1 แก้ว (250ml)', 8, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 'approved', 1),
('ชาไทย', 'Thai Iced Tea', 180, 2, 35, 4, 0, '1 แก้ว (350ml)', 8, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 'approved', 1),
('กาแฟดำ', 'Black Coffee', 5, 0, 1, 0, 0, '1 แก้ว (240ml)', 8, 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=400', 'approved', 1),
('กาแฟลาเต้', 'Latte', 120, 6, 12, 5, 0, '1 แก้ว (350ml)', 8, 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=400', 'approved', 1),
('น้ำมะนาว', 'Lime Juice', 90, 0, 22, 0, 0, '1 แก้ว (300ml)', 8, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400', 'approved', 1),
('น้ำส้มคั้น', 'Fresh Orange Juice', 110, 2, 26, 0, 1, '1 แก้ว (250ml)', 8, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400', 'approved', 1),
('นมสด', 'Fresh Milk', 150, 8, 12, 8, 0, '1 แก้ว (250ml)', 8, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400', 'approved', 1);

-- ขนม & ของหวาน
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('ข้าวเหนียวมะม่วง', 'Mango Sticky Rice', 420, 6, 72, 14, 3, '1 จาน (200g)', 7, 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400', 'approved', 1),
('บัวลอย', 'Sweet Rice Balls in Coconut Milk', 280, 4, 48, 8, 1, '1 ถ้วย (200ml)', 7, 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400', 'approved', 1),
('ทองหยิบ', 'Foi Thong (Golden Threads)', 180, 3, 28, 6, 0, '1 ถุง (50g)', 7, 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400', 'approved', 1),
('ขนมครก', 'Coconut Rice Pancakes', 220, 4, 30, 10, 1, '6 ชิ้น (80g)', 7, 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400', 'approved', 1);

-- ผลไม้ไทย
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('มะม่วง', 'Mango', 100, 1, 25, 0, 3, '1 ลูก (150g)', 6, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400', 'approved', 1),
('ทุเรียน', 'Durian', 357, 4, 66, 13, 9, '1 พู (200g)', 6, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400', 'approved', 1),
('มังคุด', 'Mangosteen', 73, 0, 18, 0, 2, '4 ลูก (100g)', 6, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400', 'approved', 1),
('ลำไย', 'Longan', 60, 1, 15, 0, 1, '10 ลูก (80g)', 6, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400', 'approved', 1),
('สับปะรด', 'Pineapple', 82, 1, 22, 0, 2, '1 ถ้วย (165g)', 6, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400', 'approved', 1),
('แตงโม', 'Watermelon', 46, 1, 12, 0, 1, '1 ถ้วย (150g)', 6, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400', 'approved', 1);

-- ========================================
-- ตรวจสอบผลลัพธ์
-- ========================================
SELECT category_id, COUNT(*) as count FROM foods WHERE status = 'approved' GROUP BY category_id;
SELECT COUNT(*) as total_foods FROM foods WHERE status = 'approved';
