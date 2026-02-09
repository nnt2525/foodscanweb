// ========================================
// Admin Pending Foods Page
// ========================================

let pendingFoods = [];
let currentFoodId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Check admin access
    const user = auth.getUser();

    if (!auth.isLoggedIn() || user?.role !== 'admin') {
        window.location.href = '../login.html';
        return;
    }

    loadPendingFoods();
});

async function loadPendingFoods() {
    const list = document.getElementById('pendingFoodsList');
    const emptyState = document.getElementById('emptyState');
    const pendingHeader = document.getElementById('pendingHeader');

    try {
        const response = await adminAPI.getPendingFoods();

        if (response.success && response.data.length > 0) {
            pendingFoods = response.data;
            const count = pendingFoods.length;
            
            // Update count displays
            document.getElementById('pendingBadge').textContent = count;
            document.getElementById('pendingCount').textContent = count;
            
            // Show header and hide empty state
            pendingHeader.classList.remove('hidden');
            emptyState.classList.add('hidden');

            // Render list items
            list.innerHTML = pendingFoods.map(food => `
                <div class="pending-list-item" data-id="${food.id}">
                    <div class="pending-item-image">
                        🍽️
                    </div>
                    <div class="pending-item-info">
                        <div class="pending-item-name">${food.name}</div>
                        <div class="pending-item-meta">
                            <span class="pending-item-category">${food.category_name || 'ไม่ระบุหมวดหมู่'}</span>
                            <span class="pending-item-calories">${food.calories} kcal</span>
                            <span class="pending-item-nutrients">โปรตีน ${food.protein || 0}g • คาร์บ ${food.carbs || 0}g • ไขมัน ${food.fat || 0}g</span>
                        </div>
                        <div class="pending-item-submitter">
                            👤 เพิ่มโดย: ${food.created_by_name || 'ไม่ระบุ'} • 📅 ${formatDate(food.created_at)}
                        </div>
                    </div>
                    <div class="pending-item-actions">
                        <button onclick="viewDetail(${food.id})" class="btn btn-sm btn-ghost" title="ดูรายละเอียด">
                            👁️
                        </button>
                        <button onclick="approveFood(${food.id})" class="btn btn-sm btn-approve" title="อนุมัติ">
                            ✓
                        </button>
                        <button onclick="rejectFood(${food.id})" class="btn btn-sm btn-reject" title="ปฏิเสธ">
                            ✕
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            list.innerHTML = '';
            pendingHeader.classList.add('hidden');
            emptyState.classList.remove('hidden');
            document.getElementById('pendingBadge').textContent = '0';
        }
    } catch (error) {
        list.innerHTML = '<p class="text-danger text-center py-8">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
    }
}

function viewDetail(id) {
    const food = pendingFoods.find(f => f.id === id);
    if (!food) return;

    currentFoodId = id;
    document.getElementById('modalFoodName').textContent = food.name;
    document.getElementById('modalContent').innerHTML = `
        <div class="mb-4">
            <h4 class="font-semibold mb-2">ข้อมูลโภชนาการ</h4>
            <div class="grid grid-cols-2 gap-4">
                <div class="card" style="padding: 1rem;">
                    <p class="text-sm text-gray">แคลอรี่</p>
                    <p class="text-xl font-bold text-primary">${food.calories} kcal</p>
                </div>
                <div class="card" style="padding: 1rem;">
                    <p class="text-sm text-gray">ปริมาณต่อหน่วย</p>
                    <p class="text-xl font-bold">${food.serving_size || '-'}</p>
                </div>
            </div>
        </div>
        
        <div class="mb-4">
            <h4 class="font-semibold mb-2">สารอาหารหลัก</h4>
            <table class="table">
                <tr><td>โปรตีน</td><td class="text-right font-semibold">${food.protein || 0}g</td></tr>
                <tr><td>คาร์โบไฮเดรต</td><td class="text-right font-semibold">${food.carbs || 0}g</td></tr>
                <tr><td>ไขมัน</td><td class="text-right font-semibold">${food.fat || 0}g</td></tr>
                <tr><td>ใยอาหาร</td><td class="text-right font-semibold">${food.fiber || 0}g</td></tr>
            </table>
        </div>
        
        <div class="text-sm text-gray">
            <p><strong>หมวดหมู่:</strong> ${food.category_name || 'ไม่ระบุ'}</p>
            <p><strong>เพิ่มโดย:</strong> ${food.created_by_name || 'ไม่ระบุ'}</p>
            <p><strong>วันที่เพิ่ม:</strong> ${formatDate(food.created_at, 'long')}</p>
        </div>
    `;

    document.getElementById('detailModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('detailModal').classList.add('hidden');
    currentFoodId = null;
}

async function approveFood(id) {
    try {
        const response = await adminAPI.approveFood(id);
        if (response.success) {
            showNotification('อนุมัติอาหารแล้ว', 'success');
            loadPendingFoods();
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
        }
    } catch (error) {
        showNotification('เกิดข้อผิดพลาด', 'error');
    }
}

function approveCurrentFood() {
    if (currentFoodId) {
        approveFood(currentFoodId);
        closeModal();
    }
}

function rejectCurrentFood() {
    if (currentFoodId) {
        rejectFood(currentFoodId);
        closeModal();
    }
}

async function approveAll() {
    if (!confirm(`ต้องการอนุมัติอาหารทั้งหมด ${pendingFoods.length} รายการ?`)) return;

    try {
        for (const food of pendingFoods) {
            await adminAPI.approveFood(food.id);
        }
        showNotification('อนุมัติอาหารทั้งหมดแล้ว', 'success');
        loadPendingFoods();
    } catch (error) {
        showNotification('เกิดข้อผิดพลาด', 'error');
    }
}
