// ========================================
// Admin Users Page
// ========================================

if (!Auth.requireAdmin()) {
    throw new Error('Not authorized');
}

let currentPage = 1;
const limit = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});

const handleSearch = debounce(() => {
    currentPage = 1;
    loadUsers();
}, 300);

async function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    const search = document.getElementById('searchInput').value;
    const role = document.getElementById('roleFilter').value;
    
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-gray py-8">กำลังโหลด...</td></tr>';
    
    try {
        const params = { page: currentPage, limit };
        if (search) params.search = search;
        if (role) params.role = role;
        
        const response = await adminAPI.getUsers(params);
        
        if (response.success && response.data.length > 0) {
            tbody.innerHTML = response.data.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>
                        <div class="flex items-center gap-2">
                            <div class="avatar">${user.name.charAt(0).toUpperCase()}</div>
                            <span>${user.name}</span>
                        </div>
                    </td>
                    <td>${user.email}</td>
                    <td>
                        <span class="status-badge ${user.role === 'admin' ? 'status-approved' : 'status-pending'}">
                            ${user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                    </td>
                    <td>${formatDate(user.created_at)}</td>
                    <td>
                        <div class="flex gap-2">
                            <button onclick="editUser(${user.id}, '${user.name}', '${user.role}')" 
                                    class="btn btn-sm btn-ghost">✏️</button>
                            <button onclick="deleteUser(${user.id})" 
                                    class="btn btn-sm btn-ghost text-danger">🗑️</button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            renderPagination(response.pagination);
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-gray py-8">ไม่พบผู้ใช้</td></tr>';
        }
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-8">เกิดข้อผิดพลาด</td></tr>';
    }
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
    loadUsers();
}

function editUser(id, name, role) {
    document.getElementById('editUserId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editRole').value = role;
    document.getElementById('editModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('editModal').classList.add('hidden');
}

async function handleEditSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('editUserId').value;
    const name = document.getElementById('editName').value;
    const role = document.getElementById('editRole').value;
    
    try {
        const response = await adminAPI.updateUser(id, { name, role });
        if (response.success) {
            showNotification('อัพเดทผู้ใช้สำเร็จ', 'success');
            closeModal();
            loadUsers();
        }
    } catch (error) {
        showNotification('เกิดข้อผิดพลาด', 'error');
    }
}

async function deleteUser(id) {
    if (!confirm('ต้องการลบผู้ใช้นี้?')) return;
    
    try {
        const response = await adminAPI.deleteUser(id);
        if (response.success) {
            showNotification('ลบผู้ใช้สำเร็จ', 'success');
            loadUsers();
        }
    } catch (error) {
        showNotification(error.message || 'เกิดข้อผิดพลาด', 'error');
    }
}
