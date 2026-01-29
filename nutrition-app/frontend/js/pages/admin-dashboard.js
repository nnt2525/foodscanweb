// ========================================
// Admin Dashboard Page
// ========================================

// Check admin access
if (!Auth.requireAdmin()) {
    throw new Error('Not authorized');
}

document.addEventListener('DOMContentLoaded', () => {
    initAdminDashboard();
});

async function initAdminDashboard() {
    // Set current date
    document.getElementById('currentDate').textContent = formatDate(new Date(), 'long');
    
    // Set admin name
    const user = Auth.getUser();
    document.getElementById('adminName').textContent = user?.name || 'Admin';
    
    // Load data
    await Promise.all([
        loadStats(),
        loadPendingFoods(),
        loadRecentUsers()
    ]);
    
    // Init charts
    initCharts();
}

async function loadStats() {
    try {
        const response = await adminAPI.getStats();
        if (response.success) {
            const { totalUsers, totalFoods, pendingFoods, todayLogs } = response.data;
            document.getElementById('totalUsers').textContent = formatNumber(totalUsers);
            document.getElementById('totalFoods').textContent = formatNumber(totalFoods);
            document.getElementById('pendingFoods').textContent = formatNumber(pendingFoods);
            document.getElementById('pendingBadge').textContent = pendingFoods;
            document.getElementById('todayLogs').textContent = formatNumber(todayLogs);
        }
    } catch (error) {
        console.error('Load stats error:', error);
    }
}

async function loadPendingFoods() {
    const container = document.getElementById('pendingFoodsList');
    
    try {
        const response = await adminAPI.getPendingFoods();
        if (response.success && response.data.length > 0) {
            const foods = response.data.slice(0, 5);
            container.innerHTML = foods.map(food => `
                <div class="list-item">
                    <div class="list-item-info">
                        <div class="list-item-avatar">🍽️</div>
                        <div class="list-item-details">
                            <span class="list-item-name">${food.name}</span>
                            <span class="list-item-meta">${food.calories} kcal • ${food.category_name || 'ไม่ระบุ'}</span>
                        </div>
                    </div>
                    <div class="list-item-actions">
                        <button onclick="approveFood(${food.id})" class="btn btn-sm btn-approve">✓</button>
                        <button onclick="rejectFood(${food.id})" class="btn btn-sm btn-reject">✕</button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-gray text-center py-4">ไม่มีรายการรออนุมัติ</p>';
        }
    } catch (error) {
        container.innerHTML = '<p class="text-gray text-center py-4">ไม่สามารถโหลดข้อมูลได้</p>';
    }
}

async function loadRecentUsers() {
    const container = document.getElementById('recentUsersList');
    
    try {
        const response = await adminAPI.getUsers({ limit: 5 });
        if (response.success && response.data.length > 0) {
            container.innerHTML = response.data.map(user => `
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
        } else {
            container.innerHTML = '<p class="text-gray text-center py-4">ไม่มีข้อมูลผู้ใช้</p>';
        }
    } catch (error) {
        container.innerHTML = '<p class="text-gray text-center py-4">ไม่สามารถโหลดข้อมูลได้</p>';
    }
}

async function approveFood(id) {
    try {
        const response = await adminAPI.approveFood(id);
        if (response.success) {
            showNotification('อนุมัติอาหารแล้ว', 'success');
            loadPendingFoods();
            loadStats();
        }
    } catch (error) {
        showNotification('เกิดข้อผิดพลาด', 'error');
    }
}

async function rejectFood(id) {
    if (!confirm('ต้องการปฏิเสธอาหารนี้?')) return;
    
    try {
        const response = await adminAPI.rejectFood(id);
        if (response.success) {
            showNotification('ปฏิเสธอาหารแล้ว', 'info');
            loadPendingFoods();
            loadStats();
        }
    } catch (error) {
        showNotification('เกิดข้อผิดพลาด', 'error');
    }
}

function initCharts() {
    // Users Chart
    const usersCtx = document.getElementById('usersChart');
    if (usersCtx) {
        new Chart(usersCtx, {
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
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    }
    
    // Foods Chart
    const foodsCtx = document.getElementById('foodsChart');
    if (foodsCtx) {
        new Chart(foodsCtx, {
            type: 'doughnut',
            data: {
                labels: CATEGORIES.filter(c => c.id !== 'all').map(c => c.name),
                datasets: [{
                    data: [0, 0, 0, 0, 0, 0],
                    backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
}
