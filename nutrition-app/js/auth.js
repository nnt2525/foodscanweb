// ========================================
// Authentication Helpers for NutriTrack
// ========================================

const AUTH_KEY = 'nutritrack_user';
const USERS_KEY = 'nutritrack_users';

// Check if user is logged in
function isLoggedIn() {
    return getFromLocalStorage(AUTH_KEY) !== null;
}

// Get current user
function getCurrentUser() {
    return getFromLocalStorage(AUTH_KEY);
}

// Login user
function login(email, password) {
    const users = getFromLocalStorage(USERS_KEY, []);
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const sessionUser = { ...user };
        delete sessionUser.password;
        saveToLocalStorage(AUTH_KEY, sessionUser);
        return { success: true, user: sessionUser };
    }
    return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
}

// Register user
function register(name, email, password) {
    const users = getFromLocalStorage(USERS_KEY, []);

    if (users.find(u => u.email === email)) {
        return { success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' };
    }

    const newUser = {
        id: generateId(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
        profile: {
            weight: null,
            height: null,
            age: null,
            gender: null,
            goal: null,
            dailyCalories: 2000
        }
    };

    users.push(newUser);
    saveToLocalStorage(USERS_KEY, users);

    const sessionUser = { ...newUser };
    delete sessionUser.password;
    saveToLocalStorage(AUTH_KEY, sessionUser);

    return { success: true, user: sessionUser };
}

// Logout user
function logout() {
    removeFromLocalStorage(AUTH_KEY);
    window.location.href = 'index.html';
}

// Require authentication - redirect if not logged in
function requireAuth() {
    if (!isLoggedIn()) {
        showNotification('กรุณาเข้าสู่ระบบก่อน', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return false;
    }
    return true;
}

// Update user profile
function updateProfile(profileData) {
    const user = getCurrentUser();
    if (!user) return false;

    user.profile = { ...user.profile, ...profileData };
    saveToLocalStorage(AUTH_KEY, user);

    // Update in users list too
    const users = getFromLocalStorage(USERS_KEY, []);
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index] = { ...users[index], profile: user.profile };
        saveToLocalStorage(USERS_KEY, users);
    }

    return true;
}

// Update navigation based on auth state
function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');
    const userNameEl = document.getElementById('userName');

    if (isLoggedIn()) {
        const user = getCurrentUser();
        if (authButtons) authButtons.classList.add('hidden');
        if (userProfile) {
            userProfile.classList.remove('hidden');
            userProfile.style.display = 'flex';
        }
        if (userNameEl) userNameEl.textContent = user.name;
    } else {
        if (authButtons) {
            authButtons.classList.remove('hidden');
            authButtons.style.display = 'flex';
        }
        if (userProfile) userProfile.classList.add('hidden');
    }
}
