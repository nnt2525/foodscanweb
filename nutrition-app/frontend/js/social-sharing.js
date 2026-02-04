// ========================================
// Social Sharing System - NutriTrack
// Share progress, achievements, and meals
// ========================================

// Share URLs for different platforms
const SHARE_PLATFORMS = {
    facebook: {
        name: 'Facebook',
        icon: '📘',
        color: '#1877F2',
        urlTemplate: 'https://www.facebook.com/sharer/sharer.php?u={url}&quote={text}'
    },
    twitter: {
        name: 'Twitter/X',
        icon: '🐦',
        color: '#1DA1F2',
        urlTemplate: 'https://twitter.com/intent/tweet?text={text}&url={url}'
    },
    line: {
        name: 'LINE',
        icon: '💬',
        color: '#00B900',
        urlTemplate: 'https://social-plugins.line.me/lineit/share?url={url}&text={text}'
    },
    clipboard: {
        name: 'คัดลอกลิงก์',
        icon: '📋',
        color: '#6B7280'
    }
};

// ========================================
// Share Modal Component
// ========================================

function showShareModal(shareData) {
    // shareData = { title, text, type, stats }

    const modal = document.createElement('div');
    modal.className = 'share-modal-overlay';
    modal.id = 'shareModal';
    modal.innerHTML = `
        <div class="share-modal">
            <div class="share-modal-header">
                <h3>🔗 แชร์ไปยัง</h3>
                <button onclick="closeShareModal()" class="share-modal-close">&times;</button>
            </div>
            
            <div class="share-preview">
                <div class="share-preview-icon">${getShareIcon(shareData.type)}</div>
                <div class="share-preview-content">
                    <h4>${shareData.title}</h4>
                    <p>${shareData.text}</p>
                </div>
            </div>
            
            <div class="share-buttons">
                ${Object.entries(SHARE_PLATFORMS).map(([key, platform]) => `
                    <button 
                        class="share-btn" 
                        style="background-color: ${platform.color}"
                        onclick="shareToPlatform('${key}', '${encodeURIComponent(shareData.text)}', '${encodeURIComponent(shareData.url || window.location.href)}')"
                    >
                        <span class="share-btn-icon">${platform.icon}</span>
                        <span class="share-btn-text">${platform.name}</span>
                    </button>
                `).join('')}
            </div>
            
            ${shareData.stats ? renderShareStats(shareData.stats) : ''}
        </div>
    `;

    document.body.appendChild(modal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeShareModal();
    });
}

function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) modal.remove();
}

function getShareIcon(type) {
    const icons = {
        progress: '📊',
        achievement: '🏆',
        meal: '🍽️',
        weight: '⚖️',
        water: '💧',
        streak: '🔥'
    };
    return icons[type] || '📤';
}

function renderShareStats(stats) {
    return `
        <div class="share-stats">
            ${stats.map(stat => `
                <div class="share-stat">
                    <div class="share-stat-value">${stat.value}</div>
                    <div class="share-stat-label">${stat.label}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// ========================================
// Share to Platform
// ========================================

function shareToPlatform(platform, text, url) {
    const platformData = SHARE_PLATFORMS[platform];

    if (platform === 'clipboard') {
        copyToClipboard(decodeURIComponent(text) + '\n' + decodeURIComponent(url));
        return;
    }

    const shareUrl = platformData.urlTemplate
        .replace('{text}', text)
        .replace('{url}', url);

    window.open(shareUrl, '_blank', 'width=600,height=400');
    closeShareModal();

    // Track share event
    trackShareEvent(platform);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('คัดลอกลิงก์แล้ว!', 'success');
        closeShareModal();
    }).catch(() => {
        showNotification('ไม่สามารถคัดลอกได้', 'error');
    });
}

function trackShareEvent(platform) {
    const shareLog = getFromLocalStorage('nutritrack_share_log', []);
    shareLog.push({
        platform,
        timestamp: new Date().toISOString()
    });
    saveToLocalStorage('nutritrack_share_log', shareLog.slice(-100)); // Keep last 100
}

// ========================================
// Share Specific Content Types
// ========================================

// Share daily progress
function shareProgress(progressData) {
    const { calories, calorieGoal, protein, carbs, fat } = progressData;
    const percentage = Math.round((calories / calorieGoal) * 100);

    showShareModal({
        type: 'progress',
        title: 'ความคืบหน้าวันนี้',
        text: `📊 วันนี้ฉันกิน ${calories}/${calorieGoal} แคลอรี่ (${percentage}%) กับ NutriTrack! 💪 #NutriTrack #HealthyLife`,
        stats: [
            { value: `${calories}`, label: 'แคลอรี่' },
            { value: `${protein}g`, label: 'โปรตีน' },
            { value: `${carbs}g`, label: 'คาร์บ' },
            { value: `${fat}g`, label: 'ไขมัน' }
        ]
    });
}

// Share achievement
function shareAchievement(achievement) {
    showShareModal({
        type: 'achievement',
        title: achievement.title,
        text: `🏆 ฉันได้รับความสำเร็จ "${achievement.title}" บน NutriTrack! ${achievement.description} #NutriTrack #Achievement`,
        stats: [
            { value: achievement.icon, label: achievement.title }
        ]
    });
}

// Share weight progress
function shareWeightProgress(weightData) {
    const { current, starting, goal, change } = weightData;
    const changeText = change > 0 ? `+${change}` : change;
    const emoji = change < 0 ? '📉' : change > 0 ? '📈' : '➡️';

    showShareModal({
        type: 'weight',
        title: 'ความคืบหน้าน้ำหนัก',
        text: `${emoji} น้ำหนักฉันเปลี่ยนไป ${changeText} kg ด้วย NutriTrack! ปัจจุบัน ${current} kg เป้าหมาย ${goal} kg 💪 #NutriTrack #WeightLoss`,
        stats: [
            { value: `${starting} kg`, label: 'เริ่มต้น' },
            { value: `${current} kg`, label: 'ปัจจุบัน' },
            { value: `${goal} kg`, label: 'เป้าหมาย' }
        ]
    });
}

// Share water tracking
function shareWaterProgress(glasses, goal = 8) {
    const percentage = Math.round((glasses / goal) * 100);

    showShareModal({
        type: 'water',
        title: 'การดื่มน้ำวันนี้',
        text: `💧 ฉันดื่มน้ำไปแล้ว ${glasses}/${goal} แก้ว (${percentage}%) วันนี้! #NutriTrack #HydrationGoals`,
        stats: [
            { value: `${glasses}`, label: 'แก้ว' },
            { value: `${percentage}%`, label: 'ของเป้าหมาย' }
        ]
    });
}

// Share streak
function shareStreak(days) {
    showShareModal({
        type: 'streak',
        title: 'Streak ติดต่อกัน',
        text: `🔥 ฉันใช้ NutriTrack ติดต่อกันมา ${days} วันแล้ว! ความสม่ำเสมอคือกุญแจสู่ความสำเร็จ 💪 #NutriTrack #HealthStreak`,
        stats: [
            { value: `${days}`, label: 'วัน' },
            { value: '🔥', label: 'Streak' }
        ]
    });
}

// Share meal
function shareMeal(mealData) {
    const { name, calories, image } = mealData;

    showShareModal({
        type: 'meal',
        title: name,
        text: `🍽️ มื้อนี้ฉันกิน ${name} (${calories} kcal) บันทึกด้วย NutriTrack! #NutriTrack #HealthyEating`,
        stats: [
            { value: `${calories}`, label: 'แคลอรี่' }
        ]
    });
}

// ========================================
// Quick Share Button Component
// ========================================

function createShareButton(shareFunction, label = 'แชร์') {
    return `
        <button onclick="${shareFunction}" class="btn btn-secondary btn-sm share-quick-btn">
            📤 ${label}
        </button>
    `;
}

// ========================================
// Add Share Styles
// ========================================

const shareStyles = document.createElement('style');
shareStyles.textContent = `
    /* Share Modal Overlay */
    .share-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.2s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    /* Share Modal */
    .share-modal {
        background: white;
        border-radius: 16px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    }
    
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .share-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .share-modal-header h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
    }
    
    .share-modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        line-height: 1;
    }
    
    .share-modal-close:hover {
        color: #333;
    }
    
    /* Share Preview */
    .share-preview {
        display: flex;
        gap: 16px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 12px;
        margin-bottom: 20px;
    }
    
    .share-preview-icon {
        font-size: 2.5rem;
    }
    
    .share-preview-content h4 {
        margin: 0 0 8px 0;
        font-size: 1rem;
        font-weight: 600;
    }
    
    .share-preview-content p {
        margin: 0;
        font-size: 0.875rem;
        color: #666;
        line-height: 1.5;
    }
    
    /* Share Buttons */
    .share-buttons {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 20px;
    }
    
    .share-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 16px;
        border: none;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .share-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .share-btn-icon {
        font-size: 1.25rem;
    }
    
    .share-btn-text {
        font-size: 0.875rem;
    }
    
    /* Share Stats */
    .share-stats {
        display: flex;
        justify-content: space-around;
        padding-top: 16px;
        border-top: 1px solid #eee;
    }
    
    .share-stat {
        text-align: center;
    }
    
    .share-stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-600, #22c55e);
    }
    
    .share-stat-label {
        font-size: 0.75rem;
        color: #666;
        margin-top: 4px;
    }
    
    /* Quick Share Button */
    .share-quick-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }
`;
document.head.appendChild(shareStyles);

// Log initialization
console.log('📤 Social Sharing module loaded');
