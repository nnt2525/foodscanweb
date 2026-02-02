-- ========================================
-- NutriTrack Thai Foods Seed Data
-- ข้อมูลอาหารไทยสำหรับระบบ NutriTrack
-- (แก้ไข category_id ให้ตรงกับ categories ที่มี)
-- Categories: 1=อาหารไทย, 2=อาหารคลีน, 3=ฟาสต์ฟู้ด, 4=เครื่องดื่ม, 5=ผลไม้, 6=ของหวาน
-- ========================================

USE nutritrack;

-- ========================================
-- เพิ่มข้อมูลอาหารไทย 60+ รายการ
-- ========================================

-- อาหารไทยจานเดียว (category_id = 1)
INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('ข้าวผัดไก่', 450, 18, 55, 15, 2, '1 จาน (300g)', 1, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', 'approved', 1),
('ข้าวผัดกุ้ง', 420, 20, 52, 14, 2, '1 จาน (300g)', 1, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', 'approved', 1),
('ข้าวผัดปู', 480, 22, 50, 18, 2, '1 จาน (300g)', 1, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', 'approved', 1),
('ข้าวมันไก่', 550, 28, 60, 20, 1, '1 จาน (350g)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ข้าวหมูแดง', 520, 25, 58, 18, 1, '1 จาน (300g)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ข้าวหมูกรอบ', 600, 22, 55, 28, 1, '1 จาน (300g)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ข้าวขาหมู', 650, 30, 55, 32, 1, '1 จาน (350g)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1);

-- ผัดกับข้าว (category_id = 1)
INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('ผัดกะเพราหมูสับ', 520, 25, 45, 22, 3, '1 จาน (250g)', 1, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', 'approved', 1),
('ผัดกะเพราไก่', 480, 28, 42, 18, 3, '1 จาน (250g)', 1, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', 'approved', 1),
('ผัดกะเพรากุ้ง', 450, 26, 40, 16, 3, '1 จาน (250g)', 1, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', 'approved', 1),
('ผัดพริกแกงหมู', 480, 22, 35, 25, 4, '1 จาน (200g)', 1, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', 'approved', 1),
('ผัดซีอิ๊วไก่', 420, 26, 48, 12, 2, '1 จาน (250g)', 1, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', 'approved', 1),
('ผัดคะน้าหมูกรอบ', 380, 18, 25, 22, 4, '1 จาน (200g)', 1, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', 'approved', 1),
('ไก่ผัดเม็ดมะม่วงหิมพานต์', 450, 28, 30, 24, 3, '1 จาน (200g)', 1, 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=400', 'approved', 1);

-- แกงไทย (category_id = 1)
INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('แกงเขียวหวานไก่', 380, 22, 18, 25, 4, '1 ถ้วย (250ml)', 1, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 'approved', 1),
('แกงเผ็ดหมู', 400, 20, 20, 26, 4, '1 ถ้วย (250ml)', 1, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 'approved', 1),
('แกงมัสมั่นไก่', 450, 24, 30, 28, 5, '1 ถ้วย (300ml)', 1, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 'approved', 1),
('แกงพะแนงหมู', 420, 22, 22, 28, 3, '1 ถ้วย (250ml)', 1, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 'approved', 1),
('แกงส้มกุ้ง', 280, 24, 20, 12, 5, '1 ถ้วย (250ml)', 1, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 'approved', 1),
('แกงจืดเต้าหู้หมูสับ', 180, 15, 12, 8, 2, '1 ถ้วย (250ml)', 1, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', 'approved', 1);

-- ต้มยำ & ซุป (category_id = 1)
INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('ต้มยำกุ้ง', 180, 22, 12, 6, 2, '1 ถ้วย (350ml)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ต้มยำไก่', 160, 20, 10, 5, 2, '1 ถ้วย (350ml)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ต้มข่าไก่', 320, 18, 15, 22, 2, '1 ถ้วย (350ml)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ต้มเลือดหมู', 150, 12, 8, 6, 1, '1 ถ้วย (250ml)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1);

-- ยำ & ส้มตำ (category_id = 1)
INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('ส้มตำไทย', 150, 4, 28, 4, 6, '1 จาน (200g)', 1, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', 'approved', 1),
('ส้มตำปู', 180, 8, 26, 6, 5, '1 จาน (200g)', 1, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', 'approved', 1),
('ยำวุ้นเส้น', 220, 12, 35, 5, 3, '1 จาน (200g)', 1, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', 'approved', 1),
('ยำหมูยอ', 280, 15, 18, 16, 4, '1 จาน (180g)', 1, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', 'approved', 1),
('ลาบหมู', 250, 22, 12, 14, 3, '1 จาน (150g)', 1, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', 'approved', 1),
('น้ำตกหมู', 280, 24, 10, 16, 3, '1 จาน (150g)', 1, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', 'approved', 1);

-- ก๋วยเตี๋ยว (category_id = 1)
INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('ก๋วยเตี๋ยวต้มยำ', 380, 22, 45, 12, 3, '1 ชาม (400ml)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ก๋วยเตี๋ยวน้ำใส', 320, 18, 42, 8, 2, '1 ชาม (400ml)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ก๋วยเตี๋ยวเรือ', 350, 20, 40, 12, 2, '1 ชาม (300ml)', 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', 'approved', 1),
('ผัดไทยกุ้งสด', 550, 22, 65, 20, 4, '1 จาน (300g)', 1, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', 'approved', 1),
('ผัดซีอิ๊ว', 480, 18, 58, 18, 3, '1 จาน (280g)', 1, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', 'approved', 1),
('ราดหน้าหมู', 520, 20, 55, 22, 3, '1 จาน (300g)', 1, 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', 'approved', 1);

-- อาหารคลีน & สุขภาพ (category_id = 2)
INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('อกไก่ย่าง', 165, 31, 0, 4, 0, '100g', 2, 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400', 'approved', 1),
('สลัดผักรวม', 80, 3, 12, 2, 5, '1 จาน (150g)', 2, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', 'approved', 1),
('ปลานึ่งมะนาว', 180, 28, 8, 5, 1, '1 จาน (200g)', 2, 'https://images.unsplash.com/photo-1544384899-8a458e3b31cc?w=400', 'approved', 1),
('ข้าวกล้อง', 216, 5, 45, 2, 4, '1 จาน (150g)', 2, 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400', 'approved', 1),
('ไข่ต้ม', 78, 6, 1, 5, 0, '1 ฟอง (50g)', 2, 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=400', 'approved', 1),
('ไข่ดาว', 92, 6, 0, 7, 0, '1 ฟอง (55g)', 2, 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=400', 'approved', 1);

-- เครื่องดื่ม (category_id = 4)
INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('ชาเขียว', 0, 0, 0, 0, 0, '1 แก้ว (250ml)', 4, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 'approved', 1),
('ชาไทย', 180, 2, 35, 4, 0, '1 แก้ว (350ml)', 4, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 'approved', 1),
('กาแฟดำ', 5, 0, 1, 0, 0, '1 แก้ว (240ml)', 4, 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=400', 'approved', 1),
('กาแฟลาเต้', 120, 6, 12, 5, 0, '1 แก้ว (350ml)', 4, 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=400', 'approved', 1),
('น้ำมะนาว', 90, 0, 22, 0, 0, '1 แก้ว (300ml)', 4, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400', 'approved', 1),
('น้ำส้มคั้น', 110, 2, 26, 0, 1, '1 แก้ว (250ml)', 4, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400', 'approved', 1),
('นมสด', 150, 8, 12, 8, 0, '1 แก้ว (250ml)', 4, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400', 'approved', 1);

-- ขนม & ของหวาน (category_id = 6)
INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('ข้าวเหนียวมะม่วง', 420, 6, 72, 14, 3, '1 จาน (200g)', 6, 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400', 'approved', 1),
('บัวลอย', 280, 4, 48, 8, 1, '1 ถ้วย (200ml)', 6, 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400', 'approved', 1),
('ทองหยิบ', 180, 3, 28, 6, 0, '1 ถุง (50g)', 6, 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400', 'approved', 1),
('ขนมครก', 220, 4, 30, 10, 1, '6 ชิ้น (80g)', 6, 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400', 'approved', 1);

-- ผลไม้ไทย (category_id = 5)
INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving_size, category_id, image_url, status, created_by) VALUES
('มะม่วง', 100, 1, 25, 0, 3, '1 ลูก (150g)', 5, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400', 'approved', 1),
('ทุเรียน', 357, 4, 66, 13, 9, '1 พู (200g)', 5, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400', 'approved', 1),
('มังคุด', 73, 0, 18, 0, 2, '4 ลูก (100g)', 5, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400', 'approved', 1),
('ลำไย', 60, 1, 15, 0, 1, '10 ลูก (80g)', 5, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400', 'approved', 1),
('สับปะรด', 82, 1, 22, 0, 2, '1 ถ้วย (165g)', 5, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400', 'approved', 1),
('แตงโม', 46, 1, 12, 0, 1, '1 ถ้วย (150g)', 5, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400', 'approved', 1);

-- ========================================
-- ตรวจสอบผลลัพธ์
-- ========================================
SELECT category_id, COUNT(*) as count FROM foods WHERE status = 'approved' GROUP BY category_id;
SELECT COUNT(*) as total_foods FROM foods WHERE status = 'approved';
