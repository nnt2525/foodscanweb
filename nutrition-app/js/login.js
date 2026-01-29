// ========================================
// Login Page - NutriTrack
// ========================================

// Redirect if already logged in
if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('errorMessage');

    const result = login(email, password);

    if (result.success) {
        showNotification('เข้าสู่ระบบสำเร็จ!', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
    } else {
        errorEl.textContent = result.message;
        errorEl.classList.remove('hidden');
    }
}

function demoLogin() {
    // Create demo account if not exists
    const users = getFromLocalStorage('nutritrack_users', []);
    if (!users.find(u => u.email === 'demo@nutritrack.com')) {
        register('ผู้ใช้ทดสอบ', 'demo@nutritrack.com', 'demo1234');
    }

    document.getElementById('email').value = 'demo@nutritrack.com';
    document.getElementById('password').value = 'demo1234';

    const result = login('demo@nutritrack.com', 'demo1234');
    if (result.success) {
        showNotification('เข้าสู่ระบบด้วยบัญชีทดสอบ!', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
    }
}
