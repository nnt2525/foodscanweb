// ========================================
// Constants - NutriTrack Frontend
// ========================================

// Daily Recommended Intake (Default)
const DAILY_RECOMMENDED = {
    calories: 2000,
    carbohydrates: 300,
    protein: 50,
    fat: 70,
    fiber: 25,
    sugar: 50,
    sodium: 2300
};

// Food Categories
const CATEGORIES = [
    { id: 'all', name: 'ทั้งหมด', icon: '📋' },
    { id: 'thai', name: 'อาหารไทย', icon: '🍜' },
    { id: 'clean', name: 'อาหารคลีน', icon: '🥗' },
    { id: 'fastfood', name: 'ฟาสต์ฟู้ด', icon: '🍔' },
    { id: 'drinks', name: 'เครื่องดื่ม', icon: '🥤' },
    { id: 'fruits', name: 'ผลไม้', icon: '🍎' },
    { id: 'dessert', name: 'ของหวาน', icon: '🍰' }
];

// Meal Types
const MEAL_TYPES = [
    { id: 'breakfast', name: 'มื้อเช้า', icon: '🌅' },
    { id: 'lunch', name: 'มื้อกลางวัน', icon: '☀️' },
    { id: 'dinner', name: 'มื้อเย็น', icon: '🌙' },
    { id: 'snacks', name: 'ของว่าง', icon: '🍿' }
];

// Activity Levels
const ACTIVITY_LEVELS = [
    { id: 'sedentary', name: 'ไม่ออกกำลังกาย', multiplier: 1.2 },
    { id: 'light', name: 'ออกกำลังกายเบาๆ (1-3 วัน/สัปดาห์)', multiplier: 1.375 },
    { id: 'moderate', name: 'ออกกำลังกายปานกลาง (3-5 วัน/สัปดาห์)', multiplier: 1.55 },
    { id: 'active', name: 'ออกกำลังกายหนัก (6-7 วัน/สัปดาห์)', multiplier: 1.725 },
    { id: 'very_active', name: 'ออกกำลังกายหนักมาก', multiplier: 1.9 }
];

// Goals
const GOALS = [
    { id: 'lose', name: 'ลดน้ำหนัก', calorieAdjust: -500 },
    { id: 'maintain', name: 'รักษาน้ำหนัก', calorieAdjust: 0 },
    { id: 'gain', name: 'เพิ่มน้ำหนัก', calorieAdjust: 500 }
];

// User Roles
const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user'
};

// Food Status
const FOOD_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

// Export
window.DAILY_RECOMMENDED = DAILY_RECOMMENDED;
window.CATEGORIES = CATEGORIES;
window.MEAL_TYPES = MEAL_TYPES;
window.ACTIVITY_LEVELS = ACTIVITY_LEVELS;
window.GOALS = GOALS;
window.USER_ROLES = USER_ROLES;
window.FOOD_STATUS = FOOD_STATUS;
