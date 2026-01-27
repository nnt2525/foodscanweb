// ========================================
// Mock Data for NutriTrack App
// ========================================

// Mock Foods Database
const mockFoods = [
    {
        id: 1,
        name: 'ข้าวผัดไก่',
        nameEn: 'Chicken Fried Rice',
        category: 'อาหารจานเดียว',
        description: 'ข้าวผัดไก่ปรุงรสพอดี มีผักและไข่',
        servingSize: 300,
        calories: 450,
        nutrition: {
            carbohydrates: { total: 60, fiber: 2, sugar: 3 },
            protein: { total: 25, quality: 'สูง' },
            fat: { total: 12, saturated: 3, unsaturated: 8, trans: 0.1 },
            vitamins: {
                vitaminA: 120, vitaminB1: 0.3, vitaminB2: 0.2,
                vitaminB3: 4.5, vitaminB6: 0.4, vitaminB12: 0.5,
                vitaminC: 8, vitaminD: 1, vitaminE: 2, vitaminK: 15, folate: 45
            },
            minerals: {
                calcium: 40, iron: 2.5, magnesium: 35, phosphorus: 180,
                potassium: 280, sodium: 850, zinc: 2.8, selenium: 18
            }
        },
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
        tags: ['โปรตีนสูง', 'จานเดียว'],
        benefits: ['ให้พลังงานสูง', 'มีโปรตีนจากไก่']
    },
    {
        id: 2,
        name: 'สลัดผัก',
        nameEn: 'Vegetable Salad',
        category: 'อาหารเพื่อสุขภาพ',
        description: 'สลัดผักสดพร้อมน้ำสลัดโยเกิร์ต',
        servingSize: 200,
        calories: 150,
        nutrition: {
            carbohydrates: { total: 20, fiber: 8, sugar: 10 },
            protein: { total: 8, quality: 'ปานกลาง' },
            fat: { total: 5, saturated: 1, unsaturated: 4, trans: 0 },
            vitamins: {
                vitaminA: 450, vitaminB1: 0.1, vitaminB2: 0.15,
                vitaminB3: 1.2, vitaminB6: 0.3, vitaminB12: 0.1,
                vitaminC: 65, vitaminD: 0.5, vitaminE: 3.5, vitaminK: 180, folate: 120
            },
            minerals: {
                calcium: 85, iron: 1.8, magnesium: 45, phosphorus: 65,
                potassium: 520, sodium: 120, zinc: 0.8, selenium: 2
            }
        },
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        tags: ['แคลอรี่ต่ำ', 'มังสวิรัติ', 'ใยอาหารสูง'],
        benefits: ['อุดมวิตามิน', 'มีใยอาหารสูง', 'ต่ำแคลอรี่']
    },
    {
        id: 3,
        name: 'ไก่ย่าง',
        nameEn: 'Grilled Chicken',
        category: 'โปรตีน',
        description: 'อกไก่ย่างไม่ใส่น้ำมัน',
        servingSize: 150,
        calories: 280,
        nutrition: {
            carbohydrates: { total: 0, fiber: 0, sugar: 0 },
            protein: { total: 42, quality: 'สูง' },
            fat: { total: 11, saturated: 3, unsaturated: 7.5, trans: 0 },
            vitamins: {
                vitaminA: 25, vitaminB1: 0.1, vitaminB2: 0.2,
                vitaminB3: 12, vitaminB6: 0.8, vitaminB12: 0.4,
                vitaminC: 0, vitaminD: 0.3, vitaminE: 0.5, vitaminK: 2, folate: 8
            },
            minerals: {
                calcium: 15, iron: 1.2, magnesium: 32, phosphorus: 220,
                potassium: 320, sodium: 85, zinc: 2.1, selenium: 28
            }
        },
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
        tags: ['โปรตีนสูง', 'ไขมันต่ำ', 'ไม่มีคาร์บ'],
        benefits: ['โปรตีนคุณภาพสูง', 'สร้างกล้ามเนื้อ']
    },
    {
        id: 4,
        name: 'ผลไม้รวม',
        nameEn: 'Mixed Fruits',
        category: 'ของหวาน/ผลไม้',
        description: 'ผลไม้สดหลากหลายชนิด',
        servingSize: 250,
        calories: 120,
        nutrition: {
            carbohydrates: { total: 30, fiber: 5, sugar: 22 },
            protein: { total: 2, quality: 'ต่ำ' },
            fat: { total: 0.5, saturated: 0.1, unsaturated: 0.3, trans: 0 },
            vitamins: {
                vitaminA: 85, vitaminB1: 0.08, vitaminB2: 0.06,
                vitaminB3: 0.8, vitaminB6: 0.4, vitaminB12: 0,
                vitaminC: 78, vitaminD: 0, vitaminE: 1.2, vitaminK: 5, folate: 25
            },
            minerals: {
                calcium: 18, iron: 0.5, magnesium: 22, phosphorus: 28,
                potassium: 420, sodium: 2, zinc: 0.3, selenium: 1
            }
        },
        image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400',
        tags: ['วิตามินสูง', 'ไม่มีไขมัน', 'ธรรมชาติ'],
        benefits: ['วิตามินซีสูง', 'ใยอาหาร', 'ต้านอนุมูลอิสระ']
    },
    {
        id: 5,
        name: 'ปลาแซลมอนย่าง',
        nameEn: 'Grilled Salmon',
        category: 'โปรตีน',
        description: 'ปลาแซลมอนย่างสด อุดมไปด้วยโอเมก้า 3',
        servingSize: 150,
        calories: 310,
        nutrition: {
            carbohydrates: { total: 0, fiber: 0, sugar: 0 },
            protein: { total: 38, quality: 'สูง' },
            fat: { total: 16, saturated: 3.5, unsaturated: 12, trans: 0 },
            vitamins: {
                vitaminA: 65, vitaminB1: 0.25, vitaminB2: 0.4,
                vitaminB3: 8.5, vitaminB6: 0.9, vitaminB12: 4.8,
                vitaminC: 0, vitaminD: 11, vitaminE: 3.5, vitaminK: 0.5, folate: 28
            },
            minerals: {
                calcium: 20, iron: 0.8, magnesium: 35, phosphorus: 280,
                potassium: 490, sodium: 75, zinc: 0.9, selenium: 42
            }
        },
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
        tags: ['โอเมก้า 3', 'โปรตีนสูง', 'ไขมันดี'],
        benefits: ['โอเมก้า 3 สูง', 'ดีต่อหัวใจ', 'บำรุงสมอง']
    },
    {
        id: 6,
        name: 'ข้าวกล้อง',
        nameEn: 'Brown Rice',
        category: 'คาร์โบไฮเดรต',
        description: 'ข้าวกล้องนึ่ง หนึ่งถ้วย',
        servingSize: 195,
        calories: 215,
        nutrition: {
            carbohydrates: { total: 45, fiber: 3.5, sugar: 0.7 },
            protein: { total: 5, quality: 'ปานกลาง' },
            fat: { total: 1.8, saturated: 0.4, unsaturated: 1.3, trans: 0 },
            vitamins: {
                vitaminA: 0, vitaminB1: 0.4, vitaminB2: 0.04,
                vitaminB3: 5.1, vitaminB6: 0.3, vitaminB12: 0,
                vitaminC: 0, vitaminD: 0, vitaminE: 0.6, vitaminK: 1.2, folate: 18
            },
            minerals: {
                calcium: 20, iron: 1.1, magnesium: 86, phosphorus: 162,
                potassium: 154, sodium: 8, zinc: 1.4, selenium: 23
            }
        },
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        tags: ['คาร์บซับซ้อน', 'ใยอาหารสูง', 'GI ต่ำ'],
        benefits: ['ให้พลังงานยาวนาน', 'ใยอาหารสูง', 'ช่วยควบคุมน้ำตาล']
    },
    {
        id: 7,
        name: 'ต้มยำกุ้ง',
        nameEn: 'Tom Yum Goong',
        category: 'อาหารจานเดียว',
        description: 'ต้มยำกุ้งน้ำข้น เปรี้ยว เผ็ด หอม',
        servingSize: 350,
        calories: 180,
        nutrition: {
            carbohydrates: { total: 8, fiber: 2, sugar: 3 },
            protein: { total: 22, quality: 'สูง' },
            fat: { total: 6, saturated: 1.5, unsaturated: 4, trans: 0 },
            vitamins: {
                vitaminA: 180, vitaminB1: 0.15, vitaminB2: 0.1,
                vitaminB3: 3.2, vitaminB6: 0.3, vitaminB12: 1.2,
                vitaminC: 25, vitaminD: 0.8, vitaminE: 2, vitaminK: 8, folate: 35
            },
            minerals: {
                calcium: 65, iron: 2.2, magnesium: 42, phosphorus: 195,
                potassium: 380, sodium: 920, zinc: 1.8, selenium: 32
            }
        },
        image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400',
        tags: ['ต้านอักเสบ', 'โปรตีนสูง', 'เผ็ด'],
        benefits: ['สมุนไพรไทย', 'ต้านอักเสบ', 'เสริมภูมิคุ้มกัน']
    },
    {
        id: 8,
        name: 'โยเกิร์ตกรีก',
        nameEn: 'Greek Yogurt',
        category: 'ของหวาน/ผลไม้',
        description: 'โยเกิร์ตกรีกธรรมชาติ ไม่เติมน้ำตาล',
        servingSize: 170,
        calories: 100,
        nutrition: {
            carbohydrates: { total: 6, fiber: 0, sugar: 4 },
            protein: { total: 17, quality: 'สูง' },
            fat: { total: 0.7, saturated: 0.3, unsaturated: 0.3, trans: 0 },
            vitamins: {
                vitaminA: 8, vitaminB1: 0.04, vitaminB2: 0.3,
                vitaminB3: 0.2, vitaminB6: 0.1, vitaminB12: 1.3,
                vitaminC: 0, vitaminD: 0.1, vitaminE: 0.1, vitaminK: 0.5, folate: 18
            },
            minerals: {
                calcium: 187, iron: 0.1, magnesium: 19, phosphorus: 229,
                potassium: 282, sodium: 65, zinc: 1, selenium: 11
            }
        },
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
        tags: ['โปรตีนสูง', 'โปรไบโอติก', 'แคลเซียม'],
        benefits: ['โปรไบโอติก', 'บำรุงกระดูก', 'โปรตีนสูง']
    },
    {
        id: 9,
        name: 'ก๋วยเตี๋ยวน้ำตกหมู',
        nameEn: 'Pork Nam Tok Noodles',
        category: 'อาหารจานเดียว',
        description: 'ก๋วยเตี๋ยวน้ำซุปเข้มข้น ใส่เนื้อหมูและลูกชิ้น',
        servingSize: 350,
        calories: 350,
        nutrition: {
            carbohydrates: { total: 45, fiber: 2, sugar: 4 },
            protein: { total: 20, quality: 'ปานกลาง' },
            fat: { total: 12, saturated: 4, unsaturated: 7, trans: 0 },
            vitamins: {
                vitaminA: 50, vitaminB1: 0.2, vitaminB2: 0.3,
                vitaminB3: 4, vitaminB6: 0.5, vitaminB12: 1.5,
                vitaminC: 5, vitaminD: 0, vitaminE: 1, vitaminK: 8, folate: 20
            },
            minerals: {
                calcium: 35, iron: 3.5, magnesium: 40, phosphorus: 160,
                potassium: 300, sodium: 1200, zinc: 2.5, selenium: 25
            }
        },
        image: 'https://img.wongnai.com/p/1920x0/2020/01/20/0e4c6a1ca489437985a9636f29bec582.jpg    ',
        tags: ['รสจัด', 'โปรตีน', 'ยอดนิยม'],
        benefits: ['ธาตุเหล็กสูง', 'ให้พลังงาน', 'รสชาติจัดจ้าน']
    }
];

// Daily Recommended Intake
const dailyRecommended = {
    calories: 2000,
    carbohydrates: 300,
    protein: 50,
    fat: 70,
    fiber: 25,
    sugar: 50,
    sodium: 2300,
    calcium: 1000,
    iron: 18,
    vitaminC: 90,
    vitaminD: 20
};

// Categories for filtering
const categories = [
    'ทั้งหมด',
    'อาหารจานเดียว',
    'อาหารเพื่อสุขภาพ',
    'โปรตีน',
    'ของหวาน/ผลไม้',
    'คาร์โบไฮเดรต'
];

// Mock Progress Data (Last 7 days)
const mockProgressData = {
    labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
    calories: [1800, 2100, 1900, 2200, 1850, 2000, 1950],
    protein: [45, 52, 48, 55, 46, 50, 49],
    carbs: [250, 280, 260, 290, 240, 270, 265],
    fat: [60, 70, 65, 75, 58, 68, 66]
};

// Mock Daily Intake Data (Calories per meal)
const mockDailyIntake = {
    labels: ['เช้า', 'กลางวัน', 'เย็น', 'ของว่าง'],
    calories: [450, 650, 500, 250],
    colors: ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6']
};

// Mock Community Posts
const mockPosts = [
    {
        id: 1,
        author: 'สมชาย ใจดี',
        avatar: '👨',
        content: 'วันนี้ลดน้ำหนักได้ 2 กิโล! ตื่นเต้นมาก 🎉',
        likes: 24,
        comments: 5,
        timestamp: '2 ชั่วโมงที่แล้ว',
        liked: false
    },
    {
        id: 2,
        author: 'มานี สุขใจ',
        avatar: '👩',
        content: 'สูตรสลัดผักแซ่บๆ ที่ทำง่ายมาก ใครสนใจบอกน้า 🥗',
        likes: 18,
        comments: 12,
        timestamp: '5 ชั่วโมงที่แล้ว',
        liked: false
    },
    {
        id: 3,
        author: 'สมศรี มีสุข',
        avatar: '👵',
        content: 'เริ่มออกกำลังกายประจำแล้ว รู้สึกว่าสุขภาพดีขึ้นเยอะ 💪',
        likes: 31,
        comments: 8,
        timestamp: '1 วันที่แล้ว',
        liked: true
    },
    {
        id: 4,
        author: 'วิชัย แข็งแรง',
        avatar: '👴',
        content: 'ติดตามแคลอรี่มา 30 วันแล้ว น้ำหนักลดไป 5 กิโล! 📊',
        likes: 42,
        comments: 15,
        timestamp: '2 วันที่แล้ว',
        liked: false
    }
];

// Mock Meal Plan Data
const mockMealPlan = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
};

// Achievement Badges
const achievements = [
    { id: 1, name: 'เริ่มต้น', description: 'บันทึกอาหารครั้งแรก', icon: '🌟', unlocked: true },
    { id: 2, name: 'สม่ำเสมอ', description: 'บันทึกติดต่อกัน 7 วัน', icon: '🔥', unlocked: true },
    { id: 3, name: 'ผู้เชี่ยวชาญ', description: 'บันทึกติดต่อกัน 30 วัน', icon: '🏆', unlocked: false },
    { id: 4, name: 'สมดุล', description: 'ทำตามเป้าหมายได้ 5 วัน', icon: '⚖️', unlocked: true },
    { id: 5, name: 'นักสแกน', description: 'สแกนอาหาร 10 ครั้ง', icon: '📸', unlocked: false },
    { id: 6, name: 'สังคมดี', description: 'โพสต์ในชุมชน 5 ครั้ง', icon: '💬', unlocked: false }
];
