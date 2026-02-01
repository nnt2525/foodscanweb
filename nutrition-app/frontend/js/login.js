// ========================================
// Login Page - NutriTrack
// Connected to Backend API
// ========================================

// Redirect if already logged in
if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('errorMessage');
    const submitBtn = document.querySelector('button[type="submit"]');

    // Hide previous error
    errorEl.classList.add('hidden');

    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'กำลังเข้าสู่ระบบ...';
    submitBtn.disabled = true;

    try {
        const result = await login(email, password);

        if (result.success) {
            showNotification('เข้าสู่ระบบสำเร็จ!', 'success');
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        } else {
            errorEl.textContent = result.message;
            errorEl.classList.remove('hidden');
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        errorEl.textContent = 'เกิดข้อผิดพลาด กรุณาลองใหม่';
        errorEl.classList.remove('hidden');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}
