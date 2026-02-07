-- ==========================================================
-- NutriTrack: 100 Popular Thai Foods Seed Data
-- ข้อมูลอาหารไทย 100 เมนู พร้อมโภชนาการโดยประมาณ
-- ==========================================================

-- ----------------------------------------------------------
-- 1. อาหารจานเดียว & กับข้าว (Category ID: 1)
-- ----------------------------------------------------------
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, source, status, created_by) VALUES 
('ข้าวมันไก่', 'Hainanese Chicken Rice', 596, 19, 75, 23, 1, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวมันไก่ทอด', 'Fried Chicken Rice', 695, 16, 78, 35, 1, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวขาหมู', 'Stewed Pork Leg on Rice', 436, 19, 53, 16, 1, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวหมูแดง', 'Red Pork on Rice', 420, 16, 68, 8, 1, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวหมูกรอบ', 'Crispy Pork on Rice', 550, 15, 65, 25, 1, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวหน้าเป็ด', 'Roasted Duck on Rice', 400, 18, 55, 12, 1, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวกะเพราหมูสับ (ไข่ดาว)', 'Basil Pork with Rice & Fried Egg', 650, 25, 60, 30, 1, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวกะเพราไก่', 'Basil Chicken with Rice', 480, 28, 58, 15, 1, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวกะเพราเนื้อ', 'Basil Beef with Rice', 580, 26, 58, 22, 1, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวกะเพราทะเล', 'Basil Seafood with Rice', 520, 24, 58, 20, 1, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวผัดหมู', 'Fried Rice with Pork', 550, 18, 65, 22, 2, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวผัดไก่', 'Fried Rice with Chicken', 530, 22, 65, 18, 2, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวผัดกุ้ง', 'Fried Rice with Shrimp', 500, 20, 65, 16, 2, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวผัดปู', 'Fried Rice with Crab', 510, 18, 65, 17, 2, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวผัดอเมริกัน', 'American Fried Rice', 790, 25, 80, 38, 2, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวไข่เจียวหมูสับ', 'Omelet with Minced Pork on Rice', 620, 22, 50, 35, 0, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวราดแกงเขียวหวานไก่', 'Green Curry Chicken on Rice', 480, 18, 55, 20, 2, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวราดผัดพริกแกงหมู', 'Stir-fried Red Curry Pork on Rice', 520, 20, 58, 22, 2, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวหมูกระเทียม', 'Garlic Pork on Rice', 525, 22, 60, 20, 1, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวคลุกกะปิ', 'Shrimp Paste Fried Rice', 614, 24, 75, 22, 3, '1 จาน', 1, 'THAI', 'approved', 1),
('ข้าวหน้าไก่', 'Chicken in Gravy Sauce on Rice', 400, 25, 50, 10, 1, '1 จาน', 1, 'THAI', 'approved', 1),
('สุกี้น้ำไก่', 'Suki Soup with Chicken', 300, 25, 35, 8, 4, '1 ชาม', 1, 'THAI', 'approved', 1),
('สุกี้แห้งทะเล', 'Stir-fried Suki Seafood', 380, 28, 40, 15, 4, '1 จาน', 1, 'THAI', 'approved', 1),
('ลาบหมู', 'Spicy Minced Pork Salad', 150, 18, 10, 5, 2, '1 จาน (กับข้าว)', 1, 'THAI', 'approved', 1),
('น้ำตกหมู', 'Spicy Grilled Pork Salad', 200, 22, 8, 10, 2, '1 จาน (กับข้าว)', 1, 'THAI', 'approved', 1),
('คอหมูย่าง', 'Grilled Pork Neck', 350, 20, 5, 28, 0, '1 จาน', 1, 'THAI', 'approved', 1),
('ไก่ย่าง', 'Grilled Chicken', 220, 30, 2, 10, 0, '1 น่องติดสะโพก', 1, 'THAI', 'approved', 1);

-- ----------------------------------------------------------
-- 2. เมนูเส้น (Category ID: 2)
-- ----------------------------------------------------------
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, source, status, created_by) VALUES 
('ผัดไทยกุ้งสด', 'Pad Thai with Shrimp', 545, 22, 65, 20, 3, '1 จาน', 2, 'THAI', 'approved', 1),
('ผัดซีอิ๊วหมู', 'Pad See Ew Pork', 679, 25, 70, 30, 3, '1 จาน', 2, 'THAI', 'approved', 1),
('ราดหน้าหมู', 'Rad Na Pork', 397, 20, 45, 12, 2, '1 จาน', 2, 'THAI', 'approved', 1),
('ราดหน้าหมี่กรอบ', 'Crispy Noodle Rad Na', 550, 18, 55, 28, 2, '1 จาน', 2, 'THAI', 'approved', 1),
('ก๋วยเตี๋ยวเรือหมูน้ำตก', 'Boat Noodle Soup (Pork)', 350, 20, 45, 10, 2, '1 ชาม', 2, 'THAI', 'approved', 1),
('ก๋วยเตี๋ยวต้มยำกุ้ง', 'Tom Yum Noodle Soup (Shrimp)', 380, 22, 45, 12, 2, '1 ชาม', 2, 'THAI', 'approved', 1),
('บะหมี่เกี๊ยวหมูแดง', 'Wonton Noodles with BBQ Pork', 420, 22, 55, 12, 2, '1 ชาม', 2, 'THAI', 'approved', 1),
('บะหมี่แห้งหมูแดง', 'Dry Wonton Noodles with BBQ Pork', 450, 22, 58, 15, 2, '1 ชาม', 2, 'THAI', 'approved', 1),
('เย็นตาโฟ', 'Yentafo Noodle Soup', 350, 15, 50, 8, 3, '1 ชาม', 2, 'THAI', 'approved', 1),
('ก๋วยจั๊บน้ำข้น', 'Chinese Roll Noodle Soup', 400, 20, 45, 15, 1, '1 ชาม', 2, 'THAI', 'approved', 1),
('ขนมจีนน้ำยา', 'Rice Noodles with Fish Curry Sauce', 332, 12, 40, 14, 3, '1 จาน', 2, 'THAI', 'approved', 1),
('ขนมจีนแกงเขียวหวาน', 'Rice Noodles with Green Curry', 450, 15, 45, 22, 3, '1 จาน', 2, 'THAI', 'approved', 1),
('ผัดมาม่าหมู', 'Stir-fried Instant Noodles with Pork', 500, 15, 60, 20, 1, '1 จาน', 2, 'THAI', 'approved', 1),
('ก๋วยเตี๋ยวคั่วไก่', 'Roasted Chicken Noodles', 550, 25, 50, 25, 1, '1 จาน', 2, 'THAI', 'approved', 1),
('หอยทอด', 'Fried Mussel Pancake', 650, 22, 45, 40, 1, '1 จาน', 2, 'THAI', 'approved', 1),
('ออส่วน', 'Oyster Omelette', 600, 25, 30, 40, 1, '1 จาน', 2, 'THAI', 'approved', 1);

-- ----------------------------------------------------------
-- 3. แกงและต้ม (Category ID: 3)
-- ----------------------------------------------------------
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, source, status, created_by) VALUES 
('ต้มยำกุ้ง (น้ำข้น)', 'Tom Yum Kung (Creamy)', 250, 20, 10, 15, 2, '1 ถ้วย', 3, 'THAI', 'approved', 1),
('ต้มยำกุ้ง (น้ำใส)', 'Tom Yum Kung (Clear)', 120, 20, 8, 2, 2, '1 ถ้วย', 3, 'THAI', 'approved', 1),
('แกงเขียวหวานไก่', 'Green Curry Chicken', 240, 18, 10, 15, 3, '1 ถ้วย', 3, 'THAI', 'approved', 1),
('แกงมัสมั่นไก่', 'Massaman Chicken Curry', 350, 22, 18, 22, 3, '1 ถ้วย', 3, 'THAI', 'approved', 1),
('แกงพะแนงหมู', 'Panang Pork Curry', 320, 20, 12, 20, 2, '1 ถ้วย', 3, 'THAI', 'approved', 1),
('แกงส้มชะอมกุ้ง', 'Sour Curry with Acacia Omelet', 280, 18, 15, 12, 4, '1 ถ้วย', 3, 'THAI', 'approved', 1),
('ต้มข่าไก่', 'Chicken in Coconut Soup', 350, 20, 12, 25, 2, '1 ถ้วย', 3, 'THAI', 'approved', 1),
('แกงจืดเต้าหู้หมูสับ', 'Clear Soup with Tofu and Minced Pork', 120, 15, 8, 5, 2, '1 ถ้วย', 3, 'THAI', 'approved', 1),
('ต้มเลือดหมู', 'Pork Blood Soup', 150, 20, 5, 6, 2, '1 ถ้วย', 3, 'THAI', 'approved', 1),
('เล้งแซ่บ', 'Spicy Pork Spine Soup', 300, 35, 5, 15, 1, '1 ชามใหญ่', 3, 'THAI', 'approved', 1),
('แกงไตปลา', 'Southern Fish Curry', 100, 15, 8, 2, 4, '1 ถ้วย', 3, 'THAI', 'approved', 1),
('พะโล้หมูสามชั้น', 'Stewed Pork Belly with Egg', 450, 20, 15, 35, 1, '1 ถ้วย', 3, 'THAI', 'approved', 1);

-- ----------------------------------------------------------
-- 4. ผัดและของทอด (Category ID: 4)
-- ----------------------------------------------------------
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, source, status, created_by) VALUES 
('ผัดผักบุ้งไฟแดง', 'Stir-fried Morning Glory', 180, 4, 10, 14, 4, '1 จาน', 4, 'THAI', 'approved', 1),
('ผัดคะน้าหมูกรอบ', 'Stir-fried Kale with Crispy Pork', 420, 15, 10, 35, 3, '1 จาน', 4, 'THAI', 'approved', 1),
('ไก่ผัดเม็ดมะม่วง', 'Stir-fried Chicken with Cashew Nuts', 380, 25, 20, 22, 2, '1 จาน', 4, 'THAI', 'approved', 1),
('ปลากะพงทอดน้ำปลา', 'Deep Fried Sea Bass with Fish Sauce', 450, 40, 5, 30, 0, '1 จานกลาง', 4, 'THAI', 'approved', 1),
('ทอดมันกุ้ง', 'Deep Fried Shrimp Cakes', 280, 12, 15, 20, 0, '3 ชิ้น', 4, 'THAI', 'approved', 1),
('ปีกไก่ทอด', 'Fried Chicken Wings', 350, 20, 5, 28, 0, '4 ชิ้น', 4, 'THAI', 'approved', 1),
('ไข่เจียวหมูสับ', 'Minced Pork Omelet', 380, 18, 2, 32, 0, '1 จาน', 4, 'THAI', 'approved', 1),
('ไข่ดาว', 'Fried Egg', 120, 7, 1, 10, 0, '1 ฟอง', 4, 'THAI', 'approved', 1),
('หมูทอดกระเทียม', 'Garlic Fried Pork', 350, 25, 5, 25, 0, '1 จาน', 4, 'THAI', 'approved', 1),
('ผัดเปรี้ยวหวานไก่', 'Sweet and Sour Chicken', 280, 20, 25, 12, 2, '1 จาน', 4, 'THAI', 'approved', 1);

-- ----------------------------------------------------------
-- 5. ส้มตำและยำ (Category ID: 5)
-- ----------------------------------------------------------
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, source, status, created_by) VALUES 
('ส้มตำไทย', 'Papaya Salad (Thai Style)', 120, 5, 20, 3, 5, '1 จาน', 5, 'THAI', 'approved', 1),
('ส้มตำปูปลาร้า', 'Papaya Salad with Crab and Fermented Fish', 80, 6, 15, 1, 5, '1 จาน', 5, 'THAI', 'approved', 1),
('ส้มตำข้าวโพด', 'Corn Salad', 150, 4, 30, 2, 4, '1 จาน', 5, 'THAI', 'approved', 1),
('ยำวุ้นเส้นหมูสับ', 'Spicy Glass Noodle Salad with Minced Pork', 200, 15, 25, 5, 2, '1 จาน', 5, 'THAI', 'approved', 1),
('ยำรวมมิตรทะเล', 'Spicy Mixed Seafood Salad', 180, 25, 15, 2, 2, '1 จาน', 5, 'THAI', 'approved', 1),
('ยำมาม่า', 'Spicy Instant Noodle Salad', 250, 10, 35, 8, 2, '1 จาน', 5, 'THAI', 'approved', 1),
('ยำหมูยอ', 'Spicy Vietnamese Sausage Salad', 220, 15, 15, 10, 2, '1 จาน', 5, 'THAI', 'approved', 1),
('พล่ากุ้ง', 'Spicy Shrimp Salad with Herbs', 180, 22, 10, 6, 3, '1 จาน', 5, 'THAI', 'approved', 1);

-- ----------------------------------------------------------
-- 6. ของหวานและผลไม้ (Category ID: 6 & 7)
-- ----------------------------------------------------------
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, source, status, created_by) VALUES 
('ข้าวเหนียวมะม่วง', 'Mango Sticky Rice', 450, 5, 80, 12, 3, '1 ชุด', 7, 'THAI', 'approved', 1),
('บัวลอยไข่หวาน', 'Rice Balls in Coconut Milk with Egg', 380, 6, 50, 18, 1, '1 ถ้วย', 7, 'THAI', 'approved', 1),
('ทับทิมกรอบ', 'Water Chestnuts in Coconut Milk', 250, 2, 40, 10, 1, '1 ถ้วย', 7, 'THAI', 'approved', 1),
('ลอดช่องน้ำกะทิ', 'Lod Chong in Coconut Milk', 280, 2, 45, 12, 1, '1 ถ้วย', 7, 'THAI', 'approved', 1),
('กล้วยบวชชี', 'Banana in Coconut Milk', 300, 3, 50, 10, 2, '1 ถ้วย', 7, 'THAI', 'approved', 1),
('ขนมครก', 'Coconut Rice Pancakes', 180, 2, 25, 8, 1, '4 คู่', 7, 'THAI', 'approved', 1),
('ปาท่องโก๋', 'Deep-fried Dough Stick', 180, 3, 20, 10, 0, '1 คู่', 7, 'THAI', 'approved', 1),
('สังขยาฟักทอง', 'Pumpkin Custard', 220, 6, 30, 8, 3, '1 ชิ้น', 7, 'THAI', 'approved', 1),
('ทุเรียน', 'Durian', 150, 2, 28, 5, 3, '1 เม็ดกลาง', 6, 'THAI', 'approved', 1),
('มะม่วงสุก', 'Ripe Mango', 130, 1, 32, 0, 3, '1 ลูก', 6, 'THAI', 'approved', 1),
('มะละกอสุก', 'Ripe Papaya', 60, 1, 15, 0, 3, '1 ชิ้นยาว', 6, 'THAI', 'approved', 1),
('ฝรั่ง', 'Guava', 60, 2, 14, 0, 5, '1 ลูก', 6, 'THAI', 'approved', 1);

-- ----------------------------------------------------------
-- 7. เครื่องดื่ม (Category ID: 8)
-- ----------------------------------------------------------
INSERT INTO foods (name, name_en, calories, protein, carbs, fat, fiber, serving_size, category_id, source, status, created_by) VALUES 
('ชาไทยเย็น', 'Thai Iced Tea', 250, 2, 40, 10, 0, '1 แก้ว', 8, 'THAI', 'approved', 1),
('ชาเขียวนมสด', 'Iced Green Tea Latte', 220, 4, 35, 8, 0, '1 แก้ว', 8, 'THAI', 'approved', 1),
('กาแฟเย็น (โบราณ)', 'Traditional Thai Iced Coffee', 200, 2, 35, 6, 0, '1 แก้ว', 8, 'THAI', 'approved', 1),
('โอเลี้ยง', 'Black Iced Coffee', 100, 0, 25, 0, 0, '1 แก้ว', 8, 'THAI', 'approved', 1),
('นมเย็น (นมชมพู)', 'Iced Pink Milk', 280, 5, 45, 10, 0, '1 แก้ว', 8, 'THAI', 'approved', 1),
('น้ำลำไย', 'Longan Juice', 150, 0, 38, 0, 0, '1 แก้ว', 8, 'THAI', 'approved', 1),
('น้ำเก๊กฮวย', 'Chrysanthemum Juice', 120, 0, 30, 0, 0, '1 แก้ว', 8, 'THAI', 'approved', 1),
('น้ำมะพร้าวสด', 'Fresh Coconut Water', 45, 0, 11, 0, 0, '1 ลูก', 8, 'THAI', 'approved', 1),
('น้ำแตงโมปั่น', 'Watermelon Smoothie', 100, 1, 24, 0, 1, '1 แก้ว', 8, 'THAI', 'approved', 1),
('ชานมไข่มุก', 'Bubble Milk Tea', 350, 2, 60, 12, 0, '1 แก้ว', 8, 'THAI', 'approved', 1),
('หมูปิ้ง', 'Grilled Pork Skewer', 130, 8, 5, 9, 0, '1 ไม้', 1, 'THAI', 'approved', 1),
('ข้าวเหนียว', 'Sticky Rice', 160, 3, 35, 0, 1, '1 ห่อ (100g)', 2, 'THAI', 'approved', 1),
('ไก่ทอดหาดใหญ่', 'Hat Yai Fried Chicken', 350, 25, 10, 25, 0, '1 น่อง', 1, 'THAI', 'approved', 1);
