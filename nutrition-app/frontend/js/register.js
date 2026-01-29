// ========================================
// Register Page - NutriTrack
// ========================================

// Redirect if already logged in
if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorEl = document.getElementById('errorMessage');

    // Validate password match
    if (password !== confirmPassword) {
        errorEl.textContent = 'รหัสผ่านไม่ตรงกัน';
        errorEl.classList.remove('hidden');
        return;
    }

    const result = register(name, email, password);

    if (result.success) {
        showNotification('สมัครสมาชิกสำเร็จ!', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
    } else {
        errorEl.textContent = result.message;
        errorEl.classList.remove('hidden');
    }
}
