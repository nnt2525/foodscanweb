# NutriTrack Database Design

## ภาพรวมระบบ

### Roles
- **Admin**: จัดการผู้ใช้, อนุมัติอาหารที่ user เพิ่ม, ดูสถิติระบบ
- **User**: บันทึกอาหาร, วางแผนมื้ออาหาร, ดูความคืบหน้า

---

## Entity Relationship Diagram (ERD)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │   foods     │       │ categories  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ email       │       │ name        │       │ name        │
│ password    │       │ calories    │       │ icon        │
│ name        │       │ protein     │       │ created_at  │
│ role        │──┐    │ carbs       │    ┌──│             │
│ avatar      │  │    │ fat         │    │  └─────────────┘
│ weight      │  │    │ fiber       │    │
│ height      │  │    │ image_url   │    │
│ age         │  │    │ category_id │────┘
│ gender      │  │    │ created_by  │────┐ (user ที่เพิ่ม)
│ activity    │  │    │ status      │    │ (pending/approved)
│ goal        │  │    │ created_at  │    │
│ created_at  │  │    │ updated_at  │    │
│ updated_at  │  │    └─────────────┘    │
└─────────────┘  │                       │
       │         │                       │
       │         └───────────────────────┘
       │
       │    ┌─────────────┐       ┌─────────────┐
       │    │ meal_plans  │       │ meal_items  │
       │    ├─────────────┤       ├─────────────┤
       │    │ id (PK)     │       │ id (PK)     │
       └────│ user_id(FK) │       │ meal_plan_id│────┐
            │ date        │───────│ food_id(FK) │    │
            │ created_at  │       │ meal_type   │    │
            │ updated_at  │       │ quantity    │    │
            └─────────────┘       │ created_at  │    │
                                  └─────────────┘    │
                                         │           │
       ┌─────────────┐                   │           │
       │ food_logs   │───────────────────┘           │
       ├─────────────┤                               │
       │ id (PK)     │                               │
       │ user_id(FK) │───────────────────────────────┘
       │ food_id(FK) │
       │ meal_type   │
       │ quantity    │
       │ logged_at   │
       │ created_at  │
       └─────────────┘

       ┌─────────────┐       ┌─────────────┐
       │   posts     │       │  comments   │
       ├─────────────┤       ├─────────────┤
       │ id (PK)     │       │ id (PK)     │
       │ user_id(FK) │       │ post_id(FK) │
       │ content     │───────│ user_id(FK) │
       │ likes       │       │ content     │
       │ created_at  │       │ created_at  │
       └─────────────┘       └─────────────┘

       ┌─────────────┐
       │achievements │
       ├─────────────┤
       │ id (PK)     │
       │ user_id(FK) │
       │ badge_type  │
       │ earned_at   │
       └─────────────┘
```

---

## ตารางฐานข้อมูล

### 1. users (ผู้ใช้งาน)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | รหัสผู้ใช้ |
| email | VARCHAR(255) | UNIQUE, NOT NULL | อีเมล |
| password | VARCHAR(255) | NOT NULL | รหัสผ่าน (hashed) |
| name | VARCHAR(100) | NOT NULL | ชื่อ |
| role | ENUM('admin','user') | DEFAULT 'user' | บทบาท |
| avatar | VARCHAR(255) | NULL | รูปโปรไฟล์ |
| weight | DECIMAL(5,2) | NULL | น้ำหนัก (kg) |
| height | DECIMAL(5,2) | NULL | ส่วนสูง (cm) |
| age | INT | NULL | อายุ |
| gender | ENUM('male','female') | NULL | เพศ |
| activity_level | ENUM('sedentary','light','moderate','active','very_active') | DEFAULT 'moderate' | ระดับกิจกรรม |
| goal | ENUM('lose','maintain','gain') | DEFAULT 'maintain' | เป้าหมาย |
| daily_calories | INT | NULL | เป้าหมายแคลอรี่/วัน |
| created_at | TIMESTAMP | DEFAULT NOW() | วันที่สร้าง |
| updated_at | TIMESTAMP | ON UPDATE NOW() | วันที่แก้ไข |

### 2. categories (หมวดหมู่อาหาร)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | รหัสหมวดหมู่ |
| name | VARCHAR(50) | UNIQUE, NOT NULL | ชื่อหมวดหมู่ |
| icon | VARCHAR(10) | NULL | Emoji icon |
| created_at | TIMESTAMP | DEFAULT NOW() | วันที่สร้าง |

### 3. foods (อาหาร)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | รหัสอาหาร |
| name | VARCHAR(100) | NOT NULL | ชื่ออาหาร |
| calories | INT | NOT NULL | แคลอรี่ |
| protein | DECIMAL(5,1) | DEFAULT 0 | โปรตีน (g) |
| carbs | DECIMAL(5,1) | DEFAULT 0 | คาร์โบไฮเดรต (g) |
| fat | DECIMAL(5,1) | DEFAULT 0 | ไขมัน (g) |
| fiber | DECIMAL(5,1) | DEFAULT 0 | ไฟเบอร์ (g) |
| serving_size | VARCHAR(50) | NULL | ขนาดหนึ่งหน่วยบริโภค |
| image_url | VARCHAR(255) | NULL | รูปอาหาร |
| category_id | INT | FK → categories.id | หมวดหมู่ |
| created_by | INT | FK → users.id, NULL | ผู้เพิ่ม (NULL = ระบบ) |
| status | ENUM('pending','approved','rejected') | DEFAULT 'approved' | สถานะ |
| created_at | TIMESTAMP | DEFAULT NOW() | วันที่สร้าง |
| updated_at | TIMESTAMP | ON UPDATE NOW() | วันที่แก้ไข |

### 4. meal_plans (แผนอาหารรายวัน)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | รหัสแผน |
| user_id | INT | FK → users.id, NOT NULL | ผู้ใช้ |
| date | DATE | NOT NULL | วันที่ |
| notes | TEXT | NULL | หมายเหตุ |
| created_at | TIMESTAMP | DEFAULT NOW() | วันที่สร้าง |
| updated_at | TIMESTAMP | ON UPDATE NOW() | วันที่แก้ไข |

**UNIQUE INDEX**: (user_id, date)

### 5. meal_items (รายการอาหารในแผน)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | รหัสรายการ |
| meal_plan_id | INT | FK → meal_plans.id | แผนอาหาร |
| food_id | INT | FK → foods.id | อาหาร |
| meal_type | ENUM('breakfast','lunch','dinner','snacks') | NOT NULL | มื้อ |
| quantity | DECIMAL(3,1) | DEFAULT 1 | จำนวน (หน่วยบริโภค) |
| created_at | TIMESTAMP | DEFAULT NOW() | วันที่สร้าง |

### 6. food_logs (บันทึกอาหารที่กิน)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | รหัสบันทึก |
| user_id | INT | FK → users.id, NOT NULL | ผู้ใช้ |
| food_id | INT | FK → foods.id, NOT NULL | อาหาร |
| meal_type | ENUM('breakfast','lunch','dinner','snacks') | NOT NULL | มื้อ |
| quantity | DECIMAL(3,1) | DEFAULT 1 | จำนวน |
| logged_at | TIMESTAMP | DEFAULT NOW() | เวลาที่บันทึก |
| created_at | TIMESTAMP | DEFAULT NOW() | วันที่สร้าง |

### 7. posts (โพสต์ชุมชน)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | รหัสโพสต์ |
| user_id | INT | FK → users.id, NOT NULL | ผู้โพสต์ |
| content | TEXT | NOT NULL | เนื้อหา |
| image_url | VARCHAR(255) | NULL | รูปภาพ |
| likes | INT | DEFAULT 0 | จำนวนไลค์ |
| created_at | TIMESTAMP | DEFAULT NOW() | วันที่สร้าง |

### 8. comments (คอมเมนต์)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | รหัสคอมเมนต์ |
| post_id | INT | FK → posts.id | โพสต์ |
| user_id | INT | FK → users.id | ผู้คอมเมนต์ |
| content | TEXT | NOT NULL | เนื้อหา |
| created_at | TIMESTAMP | DEFAULT NOW() | วันที่สร้าง |

### 9. achievements (เหรียญรางวัล)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | รหัส |
| user_id | INT | FK → users.id | ผู้ใช้ |
| badge_type | VARCHAR(50) | NOT NULL | ประเภทเหรียญ |
| earned_at | TIMESTAMP | DEFAULT NOW() | วันที่ได้รับ |

**UNIQUE INDEX**: (user_id, badge_type)

---

## SQL Scripts

### สร้างตาราง (MySQL)

```sql
-- Users
CREATE TABLE users (
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
    activity_level ENUM('sedentary', 'light', 'moderate', 'active', 'very_active') DEFAULT 'moderate',
    goal ENUM('lose', 'maintain', 'gain') DEFAULT 'maintain',
    daily_calories INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    icon VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foods
CREATE TABLE foods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    calories INT NOT NULL,
    protein DECIMAL(5,1) DEFAULT 0,
    carbs DECIMAL(5,1) DEFAULT 0,
    fat DECIMAL(5,1) DEFAULT 0,
    fiber DECIMAL(5,1) DEFAULT 0,
    serving_size VARCHAR(50),
    image_url VARCHAR(255),
    category_id INT,
    created_by INT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Meal Plans
CREATE TABLE meal_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date)
);

-- Meal Items
CREATE TABLE meal_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meal_plan_id INT NOT NULL,
    food_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snacks') NOT NULL,
    quantity DECIMAL(3,1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id)
);

-- Food Logs
CREATE TABLE food_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snacks') NOT NULL,
    quantity DECIMAL(3,1) DEFAULT 1,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id)
);

-- Posts
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Comments
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Achievements
CREATE TABLE achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    badge_type VARCHAR(50) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_badge (user_id, badge_type)
);

-- Insert default categories
INSERT INTO categories (name, icon) VALUES
('อาหารไทย', '🍜'),
('อาหารคลีน', '🥗'),
('อาหารฟาสต์ฟู้ด', '🍔'),
('เครื่องดื่ม', '🥤'),
('ผลไม้', '🍎'),
('ของหวาน', '🍰');

-- Insert admin user (password: admin123)
INSERT INTO users (email, password, name, role) VALUES
('admin@nutritrack.com', '$2b$10$...hashed...', 'Admin', 'admin');
```

---

## API Endpoints ที่ต้องพัฒนา

### Auth
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/me` - ข้อมูลผู้ใช้ปัจจุบัน

### Users (Admin)
- `GET /api/admin/users` - รายชื่อผู้ใช้ทั้งหมด
- `PUT /api/admin/users/:id` - แก้ไขผู้ใช้
- `DELETE /api/admin/users/:id` - ลบผู้ใช้

### Foods
- `GET /api/foods` - รายการอาหารทั้งหมด
- `GET /api/foods/:id` - รายละเอียดอาหาร
- `POST /api/foods` - เพิ่มอาหาร (User)
- `PUT /api/admin/foods/:id/approve` - อนุมัติอาหาร (Admin)
- `DELETE /api/admin/foods/:id` - ลบอาหาร (Admin)

### Meal Plans
- `GET /api/meal-plans?date=YYYY-MM-DD` - แผนอาหารวันนั้น
- `POST /api/meal-plans` - สร้าง/อัพเดทแผน
- `POST /api/meal-plans/:id/items` - เพิ่มอาหารในแผน
- `DELETE /api/meal-plans/:planId/items/:itemId` - ลบอาหารจากแผน

### Food Logs
- `POST /api/food-logs` - บันทึกอาหาร
- `GET /api/food-logs?from=DATE&to=DATE` - ดึงประวัติ

### Progress
- `GET /api/progress/weekly` - สรุปรายสัปดาห์
- `GET /api/progress/achievements` - เหรียญรางวัล

---

## โครงสร้าง Backend (Node.js)

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── foodController.js
│   │   ├── mealPlanController.js
│   │   ├── progressController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── adminAuth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Food.js
│   │   ├── MealPlan.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js
│   │   ├── foods.js
│   │   ├── mealPlans.js
│   │   ├── progress.js
│   │   └── admin.js
│   └── app.js
├── package.json
└── .env
```
