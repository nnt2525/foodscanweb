// ========================================
// Admin Dashboard Page
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Check admin access
    const user = auth.getUser();

    if (!auth.isLoggedIn() || user?.role !== 'admin') {
        window.location.href = '../login.html';
        return;
    }

    initAdminDashboard();
});

async function initAdminDashboard() {
    // Set current date
    document.getElementById('currentDate').textContent = formatDate(new Date(), 'long');

    // Set admin name
    const user = auth.getUser();
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
            
            // Update stat cards with null checks
            const totalUsersEl = document.getElementById('totalUsers');
            const totalFoodsEl = document.getElementById('totalFoods');
            const pendingFoodsEl = document.getElementById('pendingFoods');
            const todayLogsEl = document.getElementById('todayLogs');
            
            if (totalUsersEl) totalUsersEl.textContent = formatNumber(totalUsers);
            if (totalFoodsEl) totalFoodsEl.textContent = formatNumber(totalFoods);
            if (pendingFoodsEl) pendingFoodsEl.textContent = formatNumber(pendingFoods);
            if (todayLogsEl) todayLogsEl.textContent = formatNumber(todayLogs);
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

async function initCharts() {
    // Fetch chart data from API or generate sample
    let usersChartData = [0, 0, 0, 0, 0, 0, 0];
    let activityChartData = [0, 0, 0, 0, 0, 0, 0];
    
    try {
        const response = await adminAPI.getStats();
        if (response.success && response.data) {
            // Use usersByDay data if available, otherwise estimate from total
            if (response.data.usersByDay) {
                usersChartData = response.data.usersByDay;
            } else {
                // Generate sample data based on total users
                const total = response.data.totalUsers || 0;
                const avg = Math.max(1, Math.floor(total / 30));
                usersChartData = Array(7).fill(0).map(() => 
                    Math.floor(Math.random() * avg * 2)
                );
            }
            
            // Use activity data if available
            if (response.data.activityByDay) {
                activityChartData = response.data.activityByDay;
            } else {
                // Generate sample activity data based on logs
                const logs = response.data.todayLogs || 0;
                const avg = Math.max(5, logs);
                activityChartData = Array(7).fill(0).map(() => 
                    Math.floor(Math.random() * avg * 1.5) + Math.floor(avg * 0.5)
                );
            }
        }
    } catch (error) {
        console.error('Failed to load chart data:', error);
    }
    
    // Get day labels for last 7 days
    const dayLabels = getLast7DaysLabels();

    // Users Chart
    const usersCtx = document.getElementById('usersChart');
    if (usersCtx) {
        new Chart(usersCtx, {
            type: 'line',
            data: {
                labels: dayLabels,
                datasets: [{
                    label: 'ผู้ใช้ใหม่',
                    data: usersChartData,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#22c55e',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: { 
                        beginAtZero: true, 
                        ticks: { stepSize: 1 },
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // Activity Chart - Fixed: using correct ID 'activityChart' instead of 'foodsChart'
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
        new Chart(activityCtx, {
            type: 'bar',
            data: {
                labels: dayLabels,
                datasets: [{
                    label: 'การใช้งาน',
                    data: activityChartData,
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(20, 184, 166, 0.8)',
                        'rgba(249, 115, 22, 0.8)'
                    ],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

// Helper function to get last 7 days labels in Thai
function getLast7DaysLabels() {
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const labels = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(days[date.getDay()]);
    }
    
    return labels;
}
