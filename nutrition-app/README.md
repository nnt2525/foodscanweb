# 🥗 NutriTrack - ระบบติดตามโภชนาการ

ระบบติดตามโภชนาการและวางแผนอาหาร พร้อมระบบ Admin/User แยกกัน

## 📁 โครงสร้างโปรเจค

```
nutrition-app/
├── frontend/                 # Frontend (HTML, CSS, JS)
│   ├── html/
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── dashboard.html
│   │   ├── planner.html
│   │   └── admin/
│   │       ├── dashboard.html
│   │       ├── users.html
│   │       ├── foods.html
│   │       └── pending-foods.html
│   ├── css/
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── auth.css
│   │   └── admin.css
│   ├── js/
│   │   ├── config.js
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── utils.js
│   │   ├── constants.js
│   │   └── pages/
│   │       ├── admin-dashboard.js
│   │       ├── admin-users.js
│   │       ├── admin-foods.js
│   │       └── admin-pending.js
│   └── package.json
│
├── backend/                  # Backend (Node.js + Express)
│   ├── src/
│   │   ├── app.js           # Main application
│   │   ├── config/
│   │   │   └── database.js  # MySQL connection
│   │   ├── middleware/
│   │   │   └── auth.js      # JWT authentication
│   │   ├── routes/
│   │   │   ├── auth.js      # Login, Register, Profile
│   │   │   ├── foods.js     # CRUD Foods
│   │   │   ├── mealPlans.js # Meal planning
│   │   │   ├── progress.js  # Progress tracking
│   │   │   └── admin.js     # Admin endpoints
│   │   └── database/
│   │       └── seed.sql     # Database schema & seed data
│   ├── .env.example
│   └── package.json
│
└── docs/
    └── DATABASE_DESIGN.md   # Database documentation
```

## 🚀 การติดตั้ง

### 1. Backend

```bash
cd nutrition-app/backend
npm install
cp .env.example .env
# แก้ไขไฟล์ .env ใส่ค่า database และ JWT secret
```

### 2. Database

```bash
# สร้างฐานข้อมูลและ seed data
mysql -u root -p < src/database/seed.sql
```

### 3. รัน Backend

```bash
npm run dev
# API จะรันที่ http://localhost:3000
```

### 4. Frontend

```bash
cd nutrition-app/frontend
npm install
npm run dev
# Frontend จะเปิดที่ http://localhost:5500
```

## 🔐 บัญชีเริ่มต้น

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@nutritrack.com   | admin123  |
| User  | user@nutritrack.com    | admin123  |

> ผู้ใช้ใหม่สามารถสมัครสมาชิกผ่านหน้า Register

## 📋 API Endpoints

### Auth
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/me` - ข้อมูลผู้ใช้ปัจจุบัน
- `PUT /api/auth/profile` - อัพเดทโปรไฟล์

### Foods
- `GET /api/foods` - รายการอาหาร (รองรับ search, category, pagination)
- `GET /api/foods/:id` - รายละเอียดอาหาร
- `POST /api/foods` - เพิ่มอาหาร (status = pending)
- `GET /api/foods/categories/list` - รายการหมวดหมู่

### Meal Plans
- `GET /api/meal-plans` - แผนอาหารตามวันที่
- `POST /api/meal-plans/:id/items` - เพิ่มอาหารในแผน
- `DELETE /api/meal-plans/:id/items/:itemId` - ลบอาหารจากแผน

### Admin (ต้องเป็น role=admin)
- `GET /api/admin/stats` - สถิติ Dashboard
- `GET /api/admin/users` - รายการผู้ใช้
- `PUT /api/admin/users/:id` - แก้ไขผู้ใช้
- `DELETE /api/admin/users/:id` - ลบผู้ใช้
- `GET /api/admin/foods/pending` - อาหารรออนุมัติ
- `PUT /api/admin/foods/:id/approve` - อนุมัติอาหาร
- `PUT /api/admin/foods/:id/reject` - ปฏิเสธอาหาร

## ✨ Features

### User
- ✅ สมัครสมาชิก/เข้าสู่ระบบ
- ✅ ค้นหาอาหาร
- ✅ วางแผนอาหารรายวัน
- ✅ เพิ่มอาหารใหม่เข้าระบบ (รอ Admin อนุมัติ)
- ✅ ติดตามแคลอรี่และสารอาหาร

### Admin
- ✅ Dashboard ภาพรวมระบบ
- ✅ จัดการผู้ใช้ (CRUD)
- ✅ จัดการอาหาร (CRUD)
- ✅ อนุมัติ/ปฏิเสธอาหารที่ผู้ใช้เพิ่ม

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Chart.js สำหรับกราฟ

**Backend:**
- Node.js + Express
- MySQL
- JWT Authentication
- bcryptjs สำหรับ hash password

## 📝 License

MIT
