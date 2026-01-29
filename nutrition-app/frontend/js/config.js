// ========================================
// Frontend Configuration
// ========================================

const CONFIG = {
    API_BASE_URL: 'http://localhost:3000/api',
    APP_NAME: 'NutriTrack',
    VERSION: '1.0.0'
};

// Local Storage Keys
const STORAGE_KEYS = {
    TOKEN: 'nutritrack_token',
    USER: 'nutritrack_user',
    MEALS: 'nutritrack_meals',
    FOODS: 'nutritrack_foods',
    USER_GOAL: 'nutritrack_user_goal'
};

// Export for use
window.CONFIG = CONFIG;
window.STORAGE_KEYS = STORAGE_KEYS;
