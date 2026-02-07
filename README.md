# 🥗 NutriTrack - ระบบติดตามโภชนาการ

[![Version](https://img.shields.io/badge/version-2.0-green.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Node](https://img.shields.io/badge/node-18+-brightgreen.svg)]()

ระบบติดตามโภชนาการและวางแผนอาหารครบวงจร พร้อมฐานข้อมูล USDA กว่า 200+ รายการ

> **🌟 Recent Updates (Feb 2026):** ปรับปรุงหน้าค้นหาอาหารใหม่ (Modern UI), เพิ่มระบบ Smart Search, แก้ไขการแสดงผลกราฟความคืบหน้า, และปรับปรุงประสิทธิภาพ Backend (Rate Limiting)

---

## ✨ ฟีเจอร์หลัก

### 👤 สำหรับผู้ใช้ทั่วไป

| ฟีเจอร์ | รายละเอียด |
|---------|------------|
| 🔐 ระบบสมาชิก | สมัคร/เข้าสู่ระบบ/ลืมรหัสผ่าน อย่างปลอดภัย |
| 🔍 ค้นหาเมนูอาหาร | **Smart Search** พร้อมระบบตัวกรองหมวดหมู่อัจฉริยะ, Infinite Scroll โหลดต่อเนื่อง, และ Smart Debounce |
| 📅 วางแผนโภชนาการ | คำนวณ BMR/TDEE อัตโนมัติ พร้อมบันทึกมื้ออาหาร (เช้า, กลางวัน, เย็น, ของว่าง) |
| 📊 Dashboard ส่วนตัว | ภาพรวมแคลอรี่รายวัน, กราฟวงกลมสารอาหาร (Macronutrients), และการดื่มน้ำ |
| 📈 สถิติความคืบหน้า | **Interactive Charts** (Chart.js) แสดงแนวโน้มแคลอรี่ 7 วันย้อนหลัง + สัดส่วนสารอาหารที่แม่นยำ |
| 🏆 Gamification | ระบบเหรียญรางวัล (Badges) เมื่อทำตามเป้าหมายสำเร็จ |
| ⚖️ ติดตามน้ำหนัก | บันทึกและดูแนวโน้มน้ำหนักตัว พร้อมคำแนะนำ BMI |
| 📤 รายงานผล | Export ข้อมูลเป็น **CSV** หรือ **PDF** เพื่อสุขภาพ |
| 📷 สแกนบาร์โค้ด | (Beta) รองรับการสแกนบาร์โค้ดสินค้าเพื่อดึงข้อมูลโภชนาการ |

### 🛠️ สำหรับ Admin

| ฟีเจอร์ | รายละเอียด |
|---------|------------|
| 📊 Dashboard | สถิติภาพรวมระบบ |
| 👤 จัดการผู้ใช้ | CRUD + เปลี่ยน Role |
| 🍽️ จัดการอาหาร | เพิ่ม/แก้ไข/ลบ/อนุมัติ |
| ✅ อนุมัติอาหาร | ตรวจสอบอาหารที่ผู้ใช้เพิ่ม |

---

## 📁 โครงสร้างโปรเจค

```
nutrition-app/
├── frontend/                    # Frontend (HTML, CSS, JS)
│   ├── html/
│   │   ├── index.html          # Landing page
│   │   ├── login.html          # เข้าสู่ระบบ
│   │   ├── register.html       # สมัครสมาชิก
│   │   ├── dashboard.html      # หน้าหลัก + Water tracking
│   │   ├── search.html         # ค้นหาอาหาร
│   │   ├── planner.html        # วางแผนอาหาร
│   │   ├── progress.html       # ความคืบหน้า + กราฟ
│   │   ├── profile.html        # โปรไฟล์ + Notifications
│   │   ├── weight-tracker.html # ติดตามน้ำหนัก
│   │   ├── scan-barcode.html   # สแกนบาร์โค้ด
│   │   ├── community.html      # ชุมชน
│   │   └── admin/              # Admin Panel
│   │       ├── dashboard.html
│   │       ├── users.html
│   │       ├── foods.html
│   │       └── pending-foods.html
│   │
│   ├── css/
│   │   ├── base.css            # Variables + Reset
│   │   ├── layout.css          # Grid + Container
│   │   ├── components.css      # Buttons, Cards, Forms
│   │   ├── utilities.css       # Helper classes
│   │   ├── animations.css      # Transitions
│   │   └── responsive.css      # Mobile-first
│   │
│   └── js/
│       ├── config.js           # API configuration
│       ├── api.js              # API calls wrapper
│       ├── auth.js             # Authentication
│       ├── utils.js            # Helper functions
│       ├── navigation.js       # Navbar + routing
│       ├── notifications.js    # Push notifications
│       ├── social-sharing.js   # Social sharing modal
│       ├── dashboard.js        # Dashboard logic
│       ├── search.js           # Search page
│       ├── planner.js          # Meal planner
│       ├── progress.js         # Progress charts
│       ├── weight-tracker.js   # Weight tracking
│       ├── barcode-scanner.js  # Barcode scanning
│       └── community.js        # Community posts
│
├── backend/                     # Backend (Node.js + Express)
│   ├── src/
│   │   ├── app.js              # Main application
│   │   ├── config/
│   │   │   └── database.js     # MySQL connection
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT authentication
│   │   ├── routes/
│   │   │   ├── auth.js         # Login, Register, Profile
│   │   │   ├── foods.js        # CRUD Foods + USDA
│   │   │   ├── mealPlans.js    # Meal planning
│   │   │   ├── progress.js     # Progress tracking
│   │   │   └── admin.js        # Admin endpoints
│   │   ├── services/
│   │   │   └── usdaService.js  # USDA API integration
│   │   └── database/
│   │       ├── migration_complete.sql
│   │       ├── nutritrack_seed_foods.sql
│   │       └── nutritrack_seed_nutrients.sql
│   │
│   ├── .env.example
│   └── package.json
│
└── docs/
    └── DATABASE_DESIGN.md      # Database documentation
```

---

## 🚀 การติดตั้ง

### 1. Clone และติดตั้ง Dependencies

```bash
# Clone repository
git clone <repo-url>
cd nutrition-app

# Backend
cd backend
npm install
cp .env.example .env
# แก้ไข .env ใส่ค่า database credentials

# Frontend
cd ../frontend
npm install
```

### 2. ตั้งค่า Database

```bash
# สร้างฐานข้อมูล MySQL
mysql -u root -p

# ใน MySQL:
CREATE DATABASE nutritrack;
USE nutritrack;

# รันไฟล์ migration
SOURCE src/database/migration_complete.sql;
SOURCE src/database/nutritrack_seed_foods.sql;
SOURCE src/database/nutritrack_seed_nutrients.sql;
```

### 3. รัน Development Server

```bash
# Terminal 1 - Backend (Port 3001)
cd backend
npm run dev

# Terminal 2 - Frontend (Port 5500)
cd frontend
npm run dev
```

### 4. เปิดเว็บ

```
http://127.0.0.1:5500/html/index.html
```

---

## 🔐 บัญชีทดสอบ

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@nutritrack.com | admin123 |
| **User** | user@nutritrack.com | user123 |

> สามารถสมัครสมาชิกใหม่ผ่านหน้า Register

---

## 📋 API Endpoints

### 🔓 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | สมัครสมาชิก |
| POST | `/api/auth/login` | เข้าสู่ระบบ |
| GET | `/api/auth/me` | ข้อมูลผู้ใช้ปัจจุบัน |
| PUT | `/api/auth/profile` | อัพเดทโปรไฟล์ |
| POST | `/api/auth/forgot-password` | ลืมรหัสผ่าน |

### 🍽️ Foods
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/foods` | รายการอาหาร (filter, search, pagination) |
| GET | `/api/foods/:id` | รายละเอียดอาหาร |
| POST | `/api/foods` | เพิ่มอาหาร (pending) |
| GET | `/api/foods/categories/list` | รายการหมวดหมู่ |

### 📅 Meal Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/meal-plans` | แผนอาหารตามวันที่ |
| POST | `/api/meal-plans/:id/items` | เพิ่มอาหารในแผน |
| DELETE | `/api/meal-plans/:id/items/:itemId` | ลบอาหารจากแผน |

### 📊 Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress/weekly` | สรุป 7 วัน |
| GET | `/api/progress/daily` | สรุปรายวัน |

### 🛠️ Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | สถิติ Dashboard |
| GET | `/api/admin/users` | รายการผู้ใช้ |
| PUT | `/api/admin/users/:id` | แก้ไขผู้ใช้ |
| DELETE | `/api/admin/users/:id` | ลบผู้ใช้ |
| PUT | `/api/admin/foods/:id/approve` | อนุมัติอาหาร |
| PUT | `/api/admin/foods/:id/reject` | ปฏิเสธอาหาร |

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid
- **JavaScript** - Vanilla ES6+
- **Chart.js** - กราฟและแผนภูมิ

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Database
- **200+ รายการอาหาร** จาก USDA
- **6 หมวดหมู่** อาหารไทย, อาหารคลีน, เครื่องดื่ม, ผลไม้, ของหวาน, อาหารต่างชาติ
- **สารอาหาร** โปรตีน, คาร์บ, ไขมัน, ไฟเบอร์, วิตามิน, แร่ธาตุ

---

## 📱 Screenshots

### Landing Page
![Landing](docs/screenshots/landing.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Search
![Search](docs/screenshots/search.png)

---

