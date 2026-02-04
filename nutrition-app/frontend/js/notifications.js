// ========================================
// Push Notifications System - NutriTrack
// Browser Notifications for reminders
// ========================================

// Default notification settings
const defaultSettings = {
    enabled: true,
    mealReminders: true,
    waterReminder: true,
    goalAlert: true,
    mealTimes: {
        breakfast: '08:00',
        lunch: '12:00',
        dinner: '18:00'
    },
    waterInterval: 2 // hours
};

// Get notification settings from localStorage
function getNotificationSettings() {
    return getFromLocalStorage('nutritrack_notifications', defaultSettings);
}

// Save notification settings
function saveNotificationSettings(settings) {
    saveToLocalStorage('nutritrack_notifications', settings);
}

// Request notification permission
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        showNotification('เบราว์เซอร์ของคุณไม่รองรับการแจ้งเตือน', 'warning');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
}

// Check notification permission status
function getNotificationStatus() {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
}

// Show browser notification
function showBrowserNotification(title, options = {}) {
    if (Notification.permission !== 'granted') return;

    const defaultOptions = {
        icon: '🥗',
        badge: '🥗',
        tag: 'nutritrack-notification',
        requireInteraction: false,
        silent: false,
        ...options
    };

    try {
        const notification = new Notification(title, defaultOptions);

        notification.onclick = function () {
            window.focus();
            notification.close();
            if (options.onClick) options.onClick();
        };

        // Auto close after 5 seconds
        setTimeout(() => notification.close(), 5000);

        return notification;
    } catch (error) {
        console.error('Notification error:', error);
    }
}

// ========================================
// Meal Reminders
// ========================================

let mealReminderIntervals = [];

function scheduleMealReminders() {
    // Clear existing intervals
    mealReminderIntervals.forEach(id => clearInterval(id));
    mealReminderIntervals = [];

    const settings = getNotificationSettings();
    if (!settings.enabled || !settings.mealReminders) return;

    // Check every minute
    const checkInterval = setInterval(() => {
        checkMealTime();
    }, 60000);

    mealReminderIntervals.push(checkInterval);

    // Also check immediately
    checkMealTime();
}

function checkMealTime() {
    const settings = getNotificationSettings();
    if (!settings.enabled || !settings.mealReminders) return;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const todayKey = now.toDateString();
    const shownReminders = getFromLocalStorage('nutritrack_shown_reminders', {});

    // Check breakfast
    if (currentTime === settings.mealTimes.breakfast && !shownReminders[`${todayKey}-breakfast`]) {
        showBrowserNotification('🍳 มื้อเช้า!', {
            body: 'อย่าลืมบันทึกมื้อเช้านะ! เริ่มต้นวันใหม่อย่างมีพลัง',
            tag: 'meal-breakfast'
        });
        shownReminders[`${todayKey}-breakfast`] = true;
        saveToLocalStorage('nutritrack_shown_reminders', shownReminders);
    }

    // Check lunch
    if (currentTime === settings.mealTimes.lunch && !shownReminders[`${todayKey}-lunch`]) {
        showBrowserNotification('🍱 มื้อกลางวัน!', {
            body: 'ถึงเวลามื้อกลางวันแล้ว! อย่าลืมบันทึกอาหารด้วยนะ',
            tag: 'meal-lunch'
        });
        shownReminders[`${todayKey}-lunch`] = true;
        saveToLocalStorage('nutritrack_shown_reminders', shownReminders);
    }

    // Check dinner
    if (currentTime === settings.mealTimes.dinner && !shownReminders[`${todayKey}-dinner`]) {
        showBrowserNotification('🍽️ มื้อเย็น!', {
            body: 'ถึงเวลามื้อเย็นแล้ว! บันทึกอาหารเพื่อติดตามแคลอรี่',
            tag: 'meal-dinner'
        });
        shownReminders[`${todayKey}-dinner`] = true;
        saveToLocalStorage('nutritrack_shown_reminders', shownReminders);
    }
}

// ========================================
// Water Reminders
// ========================================

let waterReminderInterval = null;

function scheduleWaterReminders() {
    if (waterReminderInterval) clearInterval(waterReminderInterval);

    const settings = getNotificationSettings();
    if (!settings.enabled || !settings.waterReminder) return;

    const intervalMs = settings.waterInterval * 60 * 60 * 1000; // Convert hours to ms

    waterReminderInterval = setInterval(() => {
        showWaterReminder();
    }, intervalMs);
}

function showWaterReminder() {
    const settings = getNotificationSettings();
    if (!settings.enabled || !settings.waterReminder) return;

    const waterCount = getFromLocalStorage('nutritrack_water_count', 0);

    if (waterCount < 8) {
        showBrowserNotification('💧 ดื่มน้ำแล้วหรือยัง?', {
            body: `คุณดื่มน้ำไปแล้ว ${waterCount}/8 แก้ว วันนี้ ดื่มเพิ่มอีกนิดนะ!`,
            tag: 'water-reminder'
        });
    }
}

// ========================================
// Goal Alerts
// ========================================

function checkAndNotifyGoal(currentCalories, targetCalories) {
    const settings = getNotificationSettings();
    if (!settings.enabled || !settings.goalAlert) return;

    const todayKey = new Date().toDateString();
    const shownGoals = getFromLocalStorage('nutritrack_shown_goals', {});

    // Check if reached 100% of goal
    if (currentCalories >= targetCalories && !shownGoals[todayKey]) {
        showBrowserNotification('🎯 ยินดีด้วย!', {
            body: `คุณทำได้ตามเป้าหมาย ${targetCalories} แคลอรี่ วันนี้แล้ว! 🎉`,
            tag: 'goal-reached'
        });
        shownGoals[todayKey] = true;
        saveToLocalStorage('nutritrack_shown_goals', shownGoals);
    }

    // Warning at 80%
    const warningKey = `${todayKey}-warning`;
    if (currentCalories >= targetCalories * 0.8 && currentCalories < targetCalories && !shownGoals[warningKey]) {
        showBrowserNotification('📊 ใกล้ถึงเป้าหมายแล้ว!', {
            body: `คุณกินไป ${currentCalories}/${targetCalories} แคลอรี่ (${Math.round(currentCalories / targetCalories * 100)}%)`,
            tag: 'goal-warning'
        });
        shownGoals[warningKey] = true;
        saveToLocalStorage('nutritrack_shown_goals', shownGoals);
    }
}

// ========================================
// Notification Settings UI
// ========================================

function renderNotificationSettings(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const settings = getNotificationSettings();
    const status = getNotificationStatus();

    container.innerHTML = `
        <div class="card">
            <h3 class="text-lg font-bold mb-4">🔔 ตั้งค่าการแจ้งเตือน</h3>
            
            <!-- Permission Status -->
            <div class="mb-4 p-3 rounded-lg ${status === 'granted' ? 'bg-green-100' : status === 'denied' ? 'bg-red-100' : 'bg-yellow-100'}">
                <p class="text-sm">
                    ${status === 'granted' ? '✅ เปิดการแจ้งเตือนแล้ว' :
            status === 'denied' ? '❌ การแจ้งเตือนถูกปิด (กรุณาเปิดใน Browser Settings)' :
                '⚠️ ยังไม่ได้ขอสิทธิ์การแจ้งเตือน'}
                </p>
                ${status === 'default' ? `<button onclick="enableNotifications()" class="btn btn-primary btn-sm mt-2">เปิดการแจ้งเตือน</button>` : ''}
            </div>

            <!-- Main Toggle -->
            <div class="flex items-center justify-between mb-4 pb-4 border-b">
                <span>เปิดการแจ้งเตือนทั้งหมด</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="notifEnabled" ${settings.enabled ? 'checked' : ''} onchange="toggleMainNotification()">
                    <span class="toggle-slider"></span>
                </label>
            </div>

            <!-- Individual Settings -->
            <div class="space-y-4" id="notifOptions" style="${settings.enabled ? '' : 'opacity: 0.5; pointer-events: none'}">
                <!-- Meal Reminders -->
                <div class="flex items-center justify-between">
                    <span>🍽️ เตือนมื้ออาหาร</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="mealReminders" ${settings.mealReminders ? 'checked' : ''} onchange="updateNotificationSetting('mealReminders', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <!-- Meal Times -->
                <div class="grid grid-cols-3 gap-2 pl-4" id="mealTimesSection" style="${settings.mealReminders ? '' : 'opacity: 0.5'}">
                    <div>
                        <label class="text-sm text-gray">เช้า</label>
                        <input type="time" value="${settings.mealTimes.breakfast}" onchange="updateMealTime('breakfast', this.value)" class="form-input form-input-sm">
                    </div>
                    <div>
                        <label class="text-sm text-gray">กลางวัน</label>
                        <input type="time" value="${settings.mealTimes.lunch}" onchange="updateMealTime('lunch', this.value)" class="form-input form-input-sm">
                    </div>
                    <div>
                        <label class="text-sm text-gray">เย็น</label>
                        <input type="time" value="${settings.mealTimes.dinner}" onchange="updateMealTime('dinner', this.value)" class="form-input form-input-sm">
                    </div>
                </div>

                <!-- Water Reminder -->
                <div class="flex items-center justify-between">
                    <span>💧 เตือนดื่มน้ำ (ทุก ${settings.waterInterval} ชม.)</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="waterReminder" ${settings.waterReminder ? 'checked' : ''} onchange="updateNotificationSetting('waterReminder', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <!-- Goal Alert -->
                <div class="flex items-center justify-between">
                    <span>🎯 แจ้งเตือนเมื่อถึงเป้าหมาย</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="goalAlert" ${settings.goalAlert ? 'checked' : ''} onchange="updateNotificationSetting('goalAlert', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <!-- Test Button -->
            <div class="mt-4 pt-4 border-t">
                <button onclick="testNotification()" class="btn btn-secondary btn-sm">🔔 ทดสอบการแจ้งเตือน</button>
            </div>
        </div>
    `;
}

// UI Event Handlers
async function enableNotifications() {
    const granted = await requestNotificationPermission();
    if (granted) {
        showNotification('เปิดการแจ้งเตือนสำเร็จ!', 'success');
        initNotifications();
        // Re-render settings
        renderNotificationSettings('notificationSettings');
    } else {
        showNotification('ไม่สามารถเปิดการแจ้งเตือนได้', 'error');
    }
}

function toggleMainNotification() {
    const settings = getNotificationSettings();
    settings.enabled = document.getElementById('notifEnabled').checked;
    saveNotificationSettings(settings);

    // Re-render and re-init
    renderNotificationSettings('notificationSettings');
    if (settings.enabled) {
        initNotifications();
    }
}

function updateNotificationSetting(key, value) {
    const settings = getNotificationSettings();
    settings[key] = value;
    saveNotificationSettings(settings);

    // Reschedule reminders
    if (key === 'mealReminders') scheduleMealReminders();
    if (key === 'waterReminder') scheduleWaterReminders();

    renderNotificationSettings('notificationSettings');
}

function updateMealTime(meal, time) {
    const settings = getNotificationSettings();
    settings.mealTimes[meal] = time;
    saveNotificationSettings(settings);
    scheduleMealReminders();
}

function testNotification() {
    if (Notification.permission !== 'granted') {
        showNotification('กรุณาเปิดการแจ้งเตือนก่อน', 'warning');
        return;
    }

    showBrowserNotification('🔔 ทดสอบการแจ้งเตือน', {
        body: 'การแจ้งเตือนใช้งานได้ปกติ! NutriTrack พร้อมเตือนคุณแล้ว 💪',
        tag: 'test-notification'
    });
}

// ========================================
// Initialize Notifications
// ========================================

function initNotifications() {
    const settings = getNotificationSettings();

    if (settings.enabled && Notification.permission === 'granted') {
        scheduleMealReminders();
        scheduleWaterReminders();
        console.log('🔔 Notifications initialized');
    }
}

// Auto-init when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only init if user is logged in
    if (isLoggedIn()) {
        initNotifications();
    }
});
