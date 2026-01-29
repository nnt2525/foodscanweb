// ========================================
// Utility Functions for NutriTrack
// ========================================

// Format number with Thai locale
function formatNumber(num) {
    return num.toLocaleString('th-TH');
}

// Calculate percentage
function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.min(Math.round((value / total) * 100), 100);
}

// Save to localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Error saving:', e);
    }
}

// Get from localStorage
function getFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

// Remove from localStorage
function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

// Show toast notification
function showNotification(message, type = 'success', duration = 3000) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const colors = { success: '#22c55e', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };

    toast.innerHTML = `<span style="background:${colors[type]};color:white;padding:4px 8px;border-radius:50%">${icons[type]}</span><span>${message}</span>`;
    toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:white;padding:12px 20px;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.15);display:flex;align-items:center;gap:12px;z-index:9999;border-left:4px solid ${colors[type]}`;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// Format date to Thai
function formatDate(date) {
    return date.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// Get URL query parameter
function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Calculate BMI
function calculateBMI(weight, height) {
    const h = height / 100;
    return (weight / (h * h)).toFixed(1);
}

// Get BMI status
function getBMIStatus(bmi) {
    if (bmi < 18.5) return { label: 'ผอม', color: '#3b82f6' };
    if (bmi < 23) return { label: 'ปกติ', color: '#22c55e' };
    if (bmi < 25) return { label: 'น้ำหนักเกิน', color: '#f59e0b' };
    return { label: 'อ้วน', color: '#ef4444' };
}

// Calculate BMR (Mifflin-St Jeor Equation)
function calculateBMR(weight, height, age, gender) {
    // Men: 10W + 6.25H - 5A + 5
    // Women: 10W + 6.25H - 5A - 161
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    return gender === 'male' ? bmr + 5 : bmr - 161;
}

// Activity Level Multipliers
const ACTIVITY_LEVELS = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Hard exercise 6-7 days/week
    very_active: 1.9     // Very hard exercise & physical job
};

// Calculate TDEE (Total Daily Energy Expenditure)
function calculateTDEE(bmr, activityLevel) {
    const multiplier = ACTIVITY_LEVELS[activityLevel] || 1.2;
    return Math.round(bmr * multiplier);
}

// Calculate Recommended Calories based on Goal
function calculateRecommendedCalories(tdee, goal) {
    switch (goal) {
        case 'lose': return tdee - 500;
        case 'gain': return tdee + 500;
        default: return tdee; // maintain
    }
}

// Get greeting based on time
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 17) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
}
