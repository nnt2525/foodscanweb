// ========================================
// Admin Foods Page
// ========================================

if (!Auth.requireAdmin()) {
    throw new Error('Not authorized');
}

let currentPage = 1;
const limit = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadFoods();
});

async function loadCategories() {
    try {
        const response = await foodsAPI.getCategories();
        if (response.success) {
            const filterSelect = document.getElementById('categoryFilter');
            const formSelect = document.getElementById('foodCategory');
            
            response.data.forEach(cat => {
                filterSelect.innerHTML += `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`;
                formSelect.innerHTML += `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`;
            });
        }
    } catch (error) {
        console.error('Load categories error:', error);
    }
}

const handleSearch = debounce(() => {
    currentPage = 1;
    loadFoods();
}, 300);

async function loadFoods() {
    const tbody = document.getElementById('foodsTableBody');
    const search = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-gray py-8">กำลังโหลด...</td></tr>';
    
    try {
        const params = { page: currentPage, limit };
        if (search) params.search = search;
        if (category) params.category = category;
        if (status) params.status = status;
        
        const response = await foodsAPI.getAll(params);
        
        if (response.success && response.data.length > 0) {
            tbody.innerHTML = response.data.map(food => `
                <tr>
                    <td>
                        <div class="flex items-center gap-2">
                            <div class="avatar">🍽️</div>
                            <div>
                                <div class="font-medium">${food.name}</div>
                                <div class="text-xs text-gray">${food.serving_size || '-'}</div>
                            </div>
                        </div>
                    </td>
                    <td>${food.category_name || 'ไม่ระบุ'}</td>
                    <td><span class="text-primary font-semibold">${food.calories}</span> kcal</td>
                    <td>${food.protein || 0}g</td>
                    <td>
                        <span class="status-badge status-${food.status}">
                            ${getStatusLabel(food.status)}
                        </span>
                    </td>
                    <td>
                        <div class="flex gap-2">
                            <button onclick="editFood(${food.id})" class="btn btn-sm btn-ghost">✏️</button>
                            <button onclick="deleteFood(${food.id})" class="btn btn-sm btn-ghost text-danger">🗑️</button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            renderPagination(response.pagination);
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-gray py-8">ไม่พบอาหาร</td></tr>';
        }
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-8">เกิดข้อผิดพลาด</td></tr>';
    }
}

function getStatusLabel(status) {
    const labels = {
        pending: 'รออนุมัติ',
        approved: 'อนุมัติ',
        rejected: 'ปฏิเสธ'
    };
    return labels[status] || status;
}

function renderPagination(pagination) {
    const container = document.getElementById('pagination');
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    
    if (currentPage > 1) {
        html += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})">‹</button>`;
    }
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            html += `<button class="pagination-btn active">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="pagination-btn" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span>...</span>';
        }
    }
    
    if (currentPage < totalPages) {
        html += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})">›</button>`;
    }
    
    container.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    loadFoods();
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'เพิ่มอาหาร';
    document.getElementById('foodForm').reset();
    document.getElementById('foodId').value = '';
    document.getElementById('foodModal').classList.remove('hidden');
}

async function editFood(id) {
    try {
        const response = await foodsAPI.getById(id);
        if (response.success) {
            const food = response.data;
            document.getElementById('modalTitle').textContent = 'แก้ไขอาหาร';
            document.getElementById('foodId').value = food.id;
            document.getElementById('foodName').value = food.name;
            document.getElementById('foodCalories').value = food.calories;
            document.getElementById('foodCategory').value = food.category_id || '';
            document.getElementById('foodProtein').value = food.protein || '';
            document.getElementById('foodCarbs').value = food.carbs || '';
            document.getElementById('foodFat').value = food.fat || '';
            document.getElementById('foodServing').value = food.serving_size || '';
            document.getElementById('foodModal').classList.remove('hidden');
        }
    } catch (error) {
        showNotification('ไม่สามารถโหลดข้อมูลอาหาร', 'error');
    }
}

function closeModal() {
    document.getElementById('foodModal').classList.add('hidden');
}

async function handleFoodSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('foodId').value;
    const data = {
        name: document.getElementById('foodName').value,
        calories: parseInt(document.getElementById('foodCalories').value),
        category_id: document.getElementById('foodCategory').value || null,
        protein: parseFloat(document.getElementById('foodProtein').value) || 0,
        carbs: parseFloat(document.getElementById('foodCarbs').value) || 0,
        fat: parseFloat(document.getElementById('foodFat').value) || 0,
        serving_size: document.getElementById('foodServing').value
    };
    
    try {
        let response;
        if (id) {
            response = await api.put(`/admin/foods/${id}`, data);
        } else {
            response = await foodsAPI.create(data);
        }
        
        if (response.success) {
            showNotification(id ? 'อัพเดทอาหารสำเร็จ' : 'เพิ่มอาหารสำเร็จ', 'success');
            closeModal();
            loadFoods();
        }
    } catch (error) {
        showNotification('เกิดข้อผิดพลาด', 'error');
    }
}

async function deleteFood(id) {
    if (!confirm('ต้องการลบอาหารนี้?')) return;
    
    try {
        const response = await adminAPI.deleteFood(id);
        if (response.success) {
            showNotification('ลบอาหารสำเร็จ', 'success');
            loadFoods();
        }
    } catch (error) {
        showNotification('เกิดข้อผิดพลาด', 'error');
    }
}
