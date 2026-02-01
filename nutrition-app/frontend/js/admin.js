// ========================================
// Admin Panel JavaScript
// ========================================

// Check admin access
document.addEventListener('DOMContentLoaded', async function () {
    const user = auth.getUser();

    if (!auth.isLoggedIn()) {
        window.location.href = '../login.html';
        return;
    }

    if (user.role !== 'admin') {
        showToast('ไม่มีสิทธิ์เข้าถึงหน้านี้', 'error');
        window.location.href = '../dashboard.html';
        return;
    }

    // Set admin name
    const adminNameEl = document.getElementById('adminName');
    if (adminNameEl) adminNameEl.textContent = user.name;

    // Set current date
    const currentDateEl = document.getElementById('currentDate');
    if (currentDateEl) {
        currentDateEl.textContent = new Date().toLocaleDateString('th-TH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Load dashboard data
    await loadDashboardStats();
    await loadPendingFoods();
    await loadRecentUsers();
    initCharts();
});

// ========================================
// Dashboard Stats
// ========================================
async function loadDashboardStats() {
    try {
        const response = await adminAPI.getStats();

        if (response.success) {
            document.getElementById('totalUsers').textContent = formatNumber(response.data.totalUsers);
            document.getElementById('totalFoods').textContent = formatNumber(response.data.totalFoods);
            document.getElementById('pendingFoods').textContent = formatNumber(response.data.pendingFoods);
            document.getElementById('todayLogs').textContent = formatNumber(response.data.todayLogs);

            // Update sidebar badge
            const pendingCount = document.getElementById('pendingCount');
            if (pendingCount) pendingCount.textContent = response.data.pendingFoods;
        }
    } catch (error) {
        console.error('Load stats error:', error);
    }
}

// ========================================
// Pending Foods
// ========================================
async function loadPendingFoods() {
    try {
        const response = await adminAPI.getPendingFoods();
        const container = document.getElementById('pendingFoodsList');

        if (!container) return;

        if (response.success && response.data.length > 0) {
            container.innerHTML = response.data.slice(0, 5).map(food => `
                <div class="list-item">
                    <div class="list-item-info">
                        <span class="list-item-name">${food.name}</span>
                        <span class="text-gray text-sm">${food.created_by_name || 'ไม่ระบุ'}</span>
                    </div>
                    <div class="list-item-actions">
                        <button onclick="approveFood(${food.id})" class="btn btn-sm btn-success">✓</button>
                        <button onclick="rejectFood(${food.id})" class="btn btn-sm btn-danger">✕</button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-gray text-center py-4">ไม่มีรายการรออนุมัติ</p>';
        }
    } catch (error) {
        console.error('Load pending foods error:', error);
    }
}

// ========================================
// Recent Users
// ========================================
async function loadRecentUsers() {
    try {
        const response = await adminAPI.getUsers({ limit: 5 });
        const container = document.getElementById('recentUsersList');

        if (!container) return;

        if (response.success && response.data.length > 0) {
            container.innerHTML = response.data.map(user => `
                <div class="list-item">
                    <div class="list-item-info">
                        <span class="list-item-name">${user.name}</span>
                        <span class="text-gray text-sm">${user.email}</span>
                    </div>
                    <span class="badge badge-${user.role === 'admin' ? 'primary' : 'secondary'}">${user.role}</span>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-gray text-center py-4">ไม่มีข้อมูลผู้ใช้</p>';
        }
    } catch (error) {
        console.error('Load recent users error:', error);
    }
}

// ========================================
// Approve/Reject Foods
// ========================================
async function approveFood(id) {
    try {
        const response = await adminAPI.approveFood(id);
        if (response.success) {
            showToast('อนุมัติอาหารสำเร็จ', 'success');
            loadDashboardStats();
            loadPendingFoods();
        }
    } catch (error) {
        showToast('เกิดข้อผิดพลาด', 'error');
    }
}

async function rejectFood(id) {
    if (!confirm('ยืนยันการปฏิเสธอาหารนี้?')) return;

    try {
        const response = await adminAPI.rejectFood(id);
        if (response.success) {
            showToast('ปฏิเสธอาหารสำเร็จ', 'success');
            loadDashboardStats();
            loadPendingFoods();
        }
    } catch (error) {
        showToast('เกิดข้อผิดพลาด', 'error');
    }
}

async function deleteFood(id) {
    if (!confirm('ยืนยันการลบอาหารนี้?')) return;

    try {
        const response = await adminAPI.deleteFood(id);
        if (response.success) {
            showToast('ลบอาหารสำเร็จ', 'success');
            if (typeof loadFoods === 'function') loadFoods();
        }
    } catch (error) {
        showToast('เกิดข้อผิดพลาด', 'error');
    }
}

// ========================================
// User Management
// ========================================
async function deleteUser(id) {
    if (!confirm('ยืนยันการลบผู้ใช้นี้?')) return;

    try {
        const response = await adminAPI.deleteUser(id);
        if (response.success) {
            showToast('ลบผู้ใช้สำเร็จ', 'success');
            if (typeof loadUsers === 'function') loadUsers();
        }
    } catch (error) {
        showToast('เกิดข้อผิดพลาด', 'error');
    }
}

async function updateUserRole(id, role) {
    try {
        const response = await adminAPI.updateUser(id, { role });
        if (response.success) {
            showToast('อัพเดท role สำเร็จ', 'success');
        }
    } catch (error) {
        showToast('เกิดข้อผิดพลาด', 'error');
    }
}

// ========================================
// Charts
// ========================================
function initCharts() {
    const usersChartEl = document.getElementById('usersChart');
    const activityChartEl = document.getElementById('activityChart');

    if (usersChartEl) {
        new Chart(usersChartEl, {
            type: 'line',
            data: {
                labels: getLast7Days(),
                datasets: [{
                    label: 'ผู้ใช้ใหม่',
                    data: [2, 5, 3, 8, 4, 6, 3],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    if (activityChartEl) {
        new Chart(activityChartEl, {
            type: 'bar',
            data: {
                labels: getLast7Days(),
                datasets: [{
                    label: 'การบันทึกอาหาร',
                    data: [45, 52, 38, 65, 48, 55, 42],
                    backgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('th-TH', { weekday: 'short' }));
    }
    return days;
}

// ========================================
// Logout
// ========================================
function logout() {
    auth.logout();
    window.location.href = '../login.html';
}

// ========================================
// Toast Notification (if not defined)
// ========================================
function showToast(message, type = 'info') {
    // Check if toast container exists
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        padding: 12px 20px;
        margin-bottom: 10px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}
