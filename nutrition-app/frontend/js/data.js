// ========================================
// NutriTrack App - Configuration & Constants
// ========================================

// Daily Recommended Intake (Default values)
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

// Food Categories (matching database categories table)
const categories = [
    { id: 'all', name: 'ทั้งหมด', icon: '📋', filterType: 'all' },
    { id: 'thai', name: 'อาหารไทย', icon: '🍜', filterType: 'source', filterValue: 'THAI' },
    { id: 'usda', name: 'อาหารสากล', icon: '🌍', filterType: 'source', filterValue: 'USDA' },
    { id: 'meat', name: 'เนื้อสัตว์', icon: '🍖', filterType: 'category', filterValue: 1 },
    { id: 'rice', name: 'ข้าว/แป้ง', icon: '🍚', filterType: 'category', filterValue: 2 },
    { id: 'soup', name: 'แกง/ต้ม', icon: '🍲', filterType: 'category', filterValue: 3 },
    { id: 'fried', name: 'ผัด/ทอด', icon: '🍳', filterType: 'category', filterValue: 4 },
    { id: 'veg', name: 'ผัก/สลัด', icon: '🥗', filterType: 'category', filterValue: 5 },
    { id: 'fruits', name: 'ผลไม้', icon: '🍎', filterType: 'category', filterValue: 6 },
    { id: 'dessert', name: 'ขนมหวาน', icon: '🍰', filterType: 'category', filterValue: 7 },
    { id: 'drinks', name: 'เครื่องดื่ม', icon: '🥤', filterType: 'category', filterValue: 8 }
];


// Achievement Badge Types
const badgeTypes = [
    { id: 'first_log', name: 'เริ่มต้น', description: 'บันทึกอาหารครั้งแรก', icon: '🌟' },
    { id: 'streak_7', name: 'สม่ำเสมอ', description: 'บันทึกติดต่อกัน 7 วัน', icon: '🔥' },
    { id: 'streak_30', name: 'ผู้เชี่ยวชาญ', description: 'บันทึกติดต่อกัน 30 วัน', icon: '🏆' },
    { id: 'goal_5', name: 'สมดุล', description: 'ทำตามเป้าหมายได้ 5 วัน', icon: '⚖️' },
    { id: 'foods_10', name: 'นักเพิ่มอาหาร', description: 'เพิ่มอาหาร 10 รายการ', icon: '📝' },
    { id: 'posts_5', name: 'สังคมดี', description: 'โพสต์ในชุมชน 5 ครั้ง', icon: '💬' }
];

// Meal Types
const mealTypes = [
    { id: 'breakfast', name: 'มื้อเช้า', icon: '🌅' },
    { id: 'lunch', name: 'มื้อกลางวัน', icon: '☀️' },
    { id: 'dinner', name: 'มื้อเย็น', icon: '🌙' },
    { id: 'snacks', name: 'ของว่าง', icon: '🍿' }
];

// Activity Levels (for TDEE calculation)
const activityLevels = [
    { id: 'sedentary', name: 'ไม่ออกกำลังกาย', multiplier: 1.2 },
    { id: 'light', name: 'ออกกำลังกายเบาๆ (1-3 วัน/สัปดาห์)', multiplier: 1.375 },
    { id: 'moderate', name: 'ออกกำลังกายปานกลาง (3-5 วัน/สัปดาห์)', multiplier: 1.55 },
    { id: 'active', name: 'ออกกำลังกายหนัก (6-7 วัน/สัปดาห์)', multiplier: 1.725 },
    { id: 'very_active', name: 'ออกกำลังกายหนักมาก (นักกีฬา)', multiplier: 1.9 }
];

// Goals
const goals = [
    { id: 'lose', name: 'ลดน้ำหนัก', calorieAdjust: -500 },
    { id: 'maintain', name: 'รักษาน้ำหนัก', calorieAdjust: 0 },
    { id: 'gain', name: 'เพิ่มน้ำหนัก', calorieAdjust: 500 }
];

// User Roles
const userRoles = {
    ADMIN: 'admin',
    USER: 'user'
};

// Food Status
const foodStatus = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};
