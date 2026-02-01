// ========================================
// Admin Users Management Page
// ========================================

let currentPage = 1;
let currentSearch = '';

// Initialize on load
document.addEventListener('DOMContentLoaded', async function () {
    // Check admin access
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

    await loadUsers();
});

// ========================================
// Load Users
// ========================================
async function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    const roleFilter = document.getElementById('roleFilter')?.value || '';

    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-gray py-8">กำลังโหลด...</td></tr>';

    try {
        const response = await adminAPI.getUsers({
            page: currentPage,
            limit: 20,
            search: currentSearch,
            role: roleFilter
        });

        if (response.success && response.data.length > 0) {
            tbody.innerHTML = response.data.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>
                        <div class="user-info">
                            <strong>${user.name}</strong>
                        </div>
                    </td>
                    <td>${user.email}</td>
                    <td>
                        <span class="badge badge-${user.role === 'admin' ? 'primary' : 'secondary'}">${user.role}</span>
                    </td>
                    <td>${formatDate(user.created_at)}</td>
                    <td>
                        <div class="btn-group">
                            <button onclick="editUser(${user.id}, '${user.name}', '${user.role}')" 
                                    class="btn btn-sm btn-ghost">✏️</button>
                            <button onclick="deleteUser(${user.id})" 
                                    class="btn btn-sm btn-ghost text-danger">🗑️</button>
                        </div>
                    </td>
                </tr>
            `).join('');

            // Render pagination
            renderPagination(response.pagination);
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-gray py-8">ไม่พบผู้ใช้</td></tr>';
        }
    } catch (error) {
        console.error('Load users error:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-8">เกิดข้อผิดพลาด</td></tr>';
    }
}

// ========================================
// Search
// ========================================
function handleSearch(event) {
    if (event.key === 'Enter') {
        currentSearch = document.getElementById('searchInput').value;
        currentPage = 1;
        loadUsers();
    }
}

// ========================================
// Pagination
// ========================================
function renderPagination(pagination) {
    const container = document.getElementById('pagination');
    if (!container || !pagination) return;

    const totalPages = Math.ceil(pagination.total / pagination.limit);

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';

    // Previous
    if (currentPage > 1) {
        html += `<button class="btn btn-sm btn-ghost" onclick="goToPage(${currentPage - 1})">← ก่อนหน้า</button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            html += `<span class="pagination-current">${i}</span>`;
        } else if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
            html += `<button class="btn btn-sm btn-ghost" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<span class="pagination-dots">...</span>`;
        }
    }

    // Next
    if (currentPage < totalPages) {
        html += `<button class="btn btn-sm btn-ghost" onclick="goToPage(${currentPage + 1})">ถัดไป →</button>`;
    }

    container.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    loadUsers();
}

// ========================================
// Edit User
// ========================================
function editUser(id, name, role) {
    document.getElementById('editUserId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editRole').value = role;
    document.getElementById('editModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('editModal').classList.add('hidden');
}

async function handleEditSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('editUserId').value;
    const name = document.getElementById('editName').value;
    const role = document.getElementById('editRole').value;

    try {
        const response = await adminAPI.updateUser(id, { name, role });

        if (response.success) {
            showToast('อัพเดทผู้ใช้สำเร็จ', 'success');
            closeModal();
            loadUsers();
        }
    } catch (error) {
        showToast('เกิดข้อผิดพลาด', 'error');
    }
}

// ========================================
// Delete User
// ========================================
async function deleteUser(id) {
    if (!confirm('ยืนยันการลบผู้ใช้นี้?')) return;

    try {
        const response = await adminAPI.deleteUser(id);

        if (response.success) {
            showToast('ลบผู้ใช้สำเร็จ', 'success');
            loadUsers();
        }
    } catch (error) {
        showToast(error.message || 'เกิดข้อผิดพลาด', 'error');
    }
}

// ========================================
// Utilities
// ========================================
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
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
