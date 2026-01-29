// ========================================
// Utility Functions - NutriTrack Frontend
// ========================================

// Format number with commas
function formatNumber(num) {
    return new Intl.NumberFormat('th-TH').format(num);
}

// Format date
function formatDate(date, format = 'short') {
    const d = new Date(date);
    const options = format === 'long' 
        ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        : { year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString('th-TH', options);
}

// Format time ago
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
        ปี: 31536000,
        เดือน: 2592000,
        สัปดาห์: 604800,
        วัน: 86400,
        ชั่วโมง: 3600,
        นาที: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}ที่แล้ว`;
        }
    }
    return 'เมื่อสักครู่';
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show loading
function showLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
}

// Hide loading
function hideLoading(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Calculate BMR (Mifflin-St Jeor)
function calculateBMR(weight, height, age, gender) {
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    }
    return 10 * weight + 6.25 * height - 5 * age - 161;
}

// Calculate TDEE
function calculateTDEE(bmr, activityLevel) {
    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
    };
    return Math.round(bmr * (multipliers[activityLevel] || 1.2));
}

// Calculate BMI
function calculateBMI(weight, heightCm) {
    const heightM = heightCm / 100;
    return (weight / (heightM * heightM)).toFixed(1);
}

// Get BMI category
function getBMICategory(bmi) {
    if (bmi < 18.5) return { label: 'น้ำหนักน้อย', color: 'warning' };
    if (bmi < 23) return { label: 'ปกติ', color: 'success' };
    if (bmi < 25) return { label: 'น้ำหนักเกิน', color: 'warning' };
    if (bmi < 30) return { label: 'อ้วน', color: 'danger' };
    return { label: 'อ้วนมาก', color: 'danger' };
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// Export
window.formatNumber = formatNumber;
window.formatDate = formatDate;
window.timeAgo = timeAgo;
window.showNotification = showNotification;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.debounce = debounce;
window.calculateBMR = calculateBMR;
window.calculateTDEE = calculateTDEE;
window.calculateBMI = calculateBMI;
window.getBMICategory = getBMICategory;
window.getTodayDate = getTodayDate;
