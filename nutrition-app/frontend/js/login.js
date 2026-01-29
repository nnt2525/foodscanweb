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

