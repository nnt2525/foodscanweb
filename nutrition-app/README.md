# NutriTrack - ระบบติดตามโภชนาการอาหาร

ระบบติดตามโภชนาการอาหารที่ช่วยให้คุณดูแลสุขภาพได้ง่ายขึ้น พัฒนาด้วย Pure HTML5, CSS3, และ Vanilla JavaScript

## 🚀 เริ่มต้นใช้งาน

1. เปิดไฟล์ `index.html` ใน Browser
2. กด **"เข้าสู่ระบบ"** → **"ใช้บัญชีทดสอบ"**
3. เริ่มใช้งานฟีเจอร์ต่างๆ ได้เลย!

## 📱 ฟีเจอร์หลัก

| ฟีเจอร์ | คำอธิบาย |
|---------|----------|
| 🔍 ค้นหาอาหาร | ค้นหาข้อมูลโภชนาการจากฐานข้อมูล 1,000+ รายการ |
| 📸 สแกนอาหาร | ถ่ายรูปอาหารเพื่อวิเคราะห์สารอาหาร (Demo) |
| 📅 วางแผนมื้อ | จัดมื้ออาหารประจำวัน - เช้า/กลางวัน/เย็น/ของว่าง |
| 📊 ติดตามความคืบหน้า | ดูกราฟแคลอรี่และสถิติย้อนหลัง 7 วัน |
| 👥 ชุมชน | แชร์ประสบการณ์และเคล็ดลับสุขภาพ |
| 👤 โปรไฟล์ | ตั้งค่าข้อมูลสุขภาพและคำนวณ BMI |

## 📁 โครงสร้างไฟล์

```
nutrition-app/
├── index.html          # หน้าแรก
├── login.html          # เข้าสู่ระบบ
├── register.html       # สมัครสมาชิก
├── dashboard.html      # Dashboard
├── search.html         # ค้นหาอาหาร
├── food-detail.html    # รายละเอียดอาหาร
├── scanner.html        # สแกนอาหาร
├── planner.html        # วางแผนมื้อ
├── progress.html       # ความคืบหน้า
├── community.html      # ชุมชน
├── profile.html        # โปรไฟล์
├── css/style.css       # CSS Design System
└── js/
    ├── data.js         # Mock Data
    ├── utils.js        # Utility Functions
    ├── auth.js         # Authentication
    └── navigation.js   # Navigation Component
```

## 🛠️ เทคโนโลยี

- **HTML5** - โครงสร้างหน้าเว็บ
- **CSS3** - Design System พร้อม Responsive
- **JavaScript** - Logic และ Interactivity
- **Chart.js** - กราฟแสดงข้อมูล
- **LocalStorage** - เก็บข้อมูลผู้ใช้

## 📱 Responsive Design

- รองรับ Desktop, Tablet, และ Mobile
- Hamburger Menu สำหรับหน้าจอขนาดเล็ก
- Grid ปรับตัวตามขนาดหน้าจอ

## 📝 หมายเหตุ

- นี่เป็น Frontend Demo ไม่มี Backend จริง
- ข้อมูลเก็บใน LocalStorage ของ Browser
- ใช้ Mock Data สำหรับการทดสอบ

---

© 2025 NutriTrack. สงวนลิขสิทธิ์.
