// ========================================
// Admin Dashboard - NutriTrack
// ========================================

// Check admin access
function requireAdmin() {
    const user = getFromLocalStorage('nutritrack_user', null);
    if (!user || user.role !== userRoles.ADMIN) {
        window.location.href = '../login.html';
        return false;
    }
    return true;
}

if (!requireAdmin()) throw new Error('Not authorized');

// ========================================
// Initialize Dashboard
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

function initDashboard() {
    // Set current date
    document.getElementById('currentDate').textContent = formatDate(new Date());
    
    // Load admin name
    const user = getFromLocalStorage('nutritrack_user', {});
    document.getElementById('adminName').textContent = user.name || 'Admin';
    
    // Load stats
    loadDashboardStats();
    
    // Load pending foods
    loadPendingFoods();
    
    // Load recent users
    loadRecentUsers();
    
    // Initialize charts
    initCharts();
}

// ========================================
// Dashboard Stats (LocalStorage version - จะเปลี่ยนเป็น API)
// ========================================
function loadDashboardStats() {
    const users = getFromLocalStorage('nutritrack_all_users', []);
    const foods = getFromLocalStorage('nutritrack_foods', []);
    const pendingFoods = foods.filter(f => f.status === foodStatus.PENDING);
    const todayLogs = getFromLocalStorage('nutritrack_food_logs', [])
        .filter(log => {
            const logDate = new Date(log.logged_at).toDateString();
            return logDate === new Date().toDateString();
        });
    
    document.getElementById('totalUsers').textContent = formatNumber(users.length);
    document.getElementById('totalFoods').textContent = formatNumber(foods.length);
    document.getElementById('pendingFoods').textContent = formatNumber(pendingFoods.length);
    document.getElementById('pendingCount').textContent = pendingFoods.length;
    document.getElementById('todayLogs').textContent = formatNumber(todayLogs.length);
}

// ========================================
// Pending Foods
// ========================================
function loadPendingFoods() {
    const foods = getFromLocalStorage('nutritrack_foods', []);
    const pendingFoods = foods.filter(f => f.status === foodStatus.PENDING).slice(0, 5);
    
    const container = document.getElementById('pendingFoodsList');
    
    if (pendingFoods.length === 0) {
        container.innerHTML = '<p class="text-gray text-center py-4">ไม่มีรายการรออนุมัติ</p>';
        return;
    }
    
    container.innerHTML = pendingFoods.map(food => `
        <div class="list-item">
            <div class="list-item-info">
                <div class="list-item-avatar">🍽️</div>
                <div class="list-item-details">
                    <span class="list-item-name">${food.name}</span>
                    <span class="list-item-meta">${food.calories} kcal • ${getCategoryName(food.category)}</span>
                </div>
            </div>
            <div class="list-item-actions">
                <button onclick="approveFood(${food.id})" class="btn btn-sm btn-approve">✓</button>
                <button onclick="rejectFood(${food.id})" class="btn btn-sm btn-reject">✕</button>
            </div>
        </div>
    `).join('');
}

function getCategoryName(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'ไม่ระบุ';
}

function approveFood(foodId) {
    const foods = getFromLocalStorage('nutritrack_foods', []);
    const index = foods.findIndex(f => f.id === foodId);
    
    if (index !== -1) {
        foods[index].status = foodStatus.APPROVED;
        foods[index].approvedAt = new Date().toISOString();
        saveToLocalStorage('nutritrack_foods', foods);
        loadPendingFoods();
        loadDashboardStats();
        showNotification('อนุมัติอาหารแล้ว', 'success');
    }
}

function rejectFood(foodId) {
    if (!confirm('ต้องการปฏิเสธอาหารนี้?')) return;
    
    const foods = getFromLocalStorage('nutritrack_foods', []);
    const index = foods.findIndex(f => f.id === foodId);
    
    if (index !== -1) {
        foods[index].status = foodStatus.REJECTED;
        foods[index].rejectedAt = new Date().toISOString();
        saveToLocalStorage('nutritrack_foods', foods);
        loadPendingFoods();
        loadDashboardStats();
        showNotification('ปฏิเสธอาหารแล้ว', 'info');
    }
}

// ========================================
// Recent Users
// ========================================
function loadRecentUsers() {
    const users = getFromLocalStorage('nutritrack_all_users', [])
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    const container = document.getElementById('recentUsersList');
    
    if (users.length === 0) {
        container.innerHTML = '<p class="text-gray text-center py-4">ไม่มีข้อมูลผู้ใช้</p>';
        return;
    }
    
    container.innerHTML = users.map(user => `
        <div class="list-item">
            <div class="list-item-info">
                <div class="list-item-avatar">👤</div>
                <div class="list-item-details">
                    <span class="list-item-name">${user.name}</span>
                    <span class="list-item-meta">${user.email}</span>
                </div>
            </div>
            <span class="status-badge ${user.role === 'admin' ? 'status-approved' : 'status-pending'}">
                ${user.role === 'admin' ? 'Admin' : 'User'}
            </span>
        </div>
    `).join('');
}

// ========================================
// Charts
// ========================================
function initCharts() {
    initUsersChart();
    initActivityChart();
}

function initUsersChart() {
    const ctx = document.getElementById('usersChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
            datasets: [{
                label: 'ผู้ใช้ใหม่',
                data: [0, 0, 0, 0, 0, 0, 0],
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function initActivityChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['บันทึกอาหาร', 'วางแผน', 'ค้นหา', 'ชุมชน'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// ========================================
// Logout
// ========================================
function logout() {
    localStorage.removeItem('nutritrack_user');
    localStorage.removeItem('nutritrack_token');
    window.location.href = '../login.html';
}
