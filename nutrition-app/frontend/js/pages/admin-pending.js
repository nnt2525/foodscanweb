// ========================================
// Admin Pending Foods Page
// ========================================

if (!Auth.requireAdmin()) {
    throw new Error('Not authorized');
}

let pendingFoods = [];
let currentFoodId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadPendingFoods();
});

async function loadPendingFoods() {
    const grid = document.getElementById('pendingFoodsGrid');
    const emptyState = document.getElementById('emptyState');
    
    try {
        const response = await adminAPI.getPendingFoods();
        
        if (response.success && response.data.length > 0) {
            pendingFoods = response.data;
            document.getElementById('pendingBadge').textContent = pendingFoods.length;
            emptyState.classList.add('hidden');
            
            grid.innerHTML = pendingFoods.map(food => `
                <div class="card">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-4">
                            <div class="avatar avatar-lg" style="background: var(--gray-100);">
                                🍽️
                            </div>
                            <div>
                                <h3 class="font-bold">${food.name}</h3>
                                <p class="text-sm text-gray">${food.category_name || 'ไม่ระบุหมวดหมู่'}</p>
                            </div>
                        </div>
                        <span class="status-badge status-pending">รออนุมัติ</span>
                    </div>
                    
                    <div class="grid grid-cols-4 gap-4 mb-4 text-center">
                        <div>
                            <p class="text-2xl font-bold text-primary">${food.calories}</p>
                            <p class="text-xs text-gray">แคลอรี่</p>
                        </div>
                        <div>
                            <p class="text-xl font-semibold">${food.protein || 0}g</p>
                            <p class="text-xs text-gray">โปรตีน</p>
                        </div>
                        <div>
                            <p class="text-xl font-semibold">${food.carbs || 0}g</p>
                            <p class="text-xs text-gray">คาร์บ</p>
                        </div>
                        <div>
                            <p class="text-xl font-semibold">${food.fat || 0}g</p>
                            <p class="text-xs text-gray">ไขมัน</p>
                        </div>
                    </div>
                    
                    <div class="text-sm text-gray mb-4">
                        <p>👤 เพิ่มโดย: ${food.created_by_name || 'ไม่ระบุ'}</p>
                        <p>📅 ${formatDate(food.created_at)}</p>
                    </div>
                    
                    <div class="flex gap-2">
                        <button onclick="viewDetail(${food.id})" class="btn btn-sm btn-ghost flex-1">
                            👁️ ดูรายละเอียด
                        </button>
                        <button onclick="approveFood(${food.id})" class="btn btn-sm btn-approve">
                            ✓
                        </button>
                        <button onclick="rejectFood(${food.id})" class="btn btn-sm btn-reject">
                            ✕
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            grid.innerHTML = '';
            emptyState.classList.remove('hidden');
            document.getElementById('pendingBadge').textContent = '0';
        }
    } catch (error) {
        grid.innerHTML = '<p class="text-danger text-center py-8">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
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
