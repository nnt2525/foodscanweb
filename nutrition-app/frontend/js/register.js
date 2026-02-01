// ========================================
// Register Page - NutriTrack
// Connected to Backend API
// ========================================

// Redirect if already logged in
if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
}

async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorEl = document.getElementById('errorMessage');
    const submitBtn = document.querySelector('button[type="submit"]');

    // Hide previous error
    errorEl.classList.add('hidden');

    // Validate password match
    if (password !== confirmPassword) {
        errorEl.textContent = 'รหัสผ่านไม่ตรงกัน';
        errorEl.classList.remove('hidden');
        return;
    }

    // Validate password length
    if (password.length < 6) {
        errorEl.textContent = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
        errorEl.classList.remove('hidden');
        return;
    }

    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'กำลังสมัครสมาชิก...';
    submitBtn.disabled = true;

    try {
        const result = await register(name, email, password);

        if (result.success) {
            showNotification('สมัครสมาชิกสำเร็จ!', 'success');
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
