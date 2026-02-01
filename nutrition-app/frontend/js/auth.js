// ========================================
// Authentication Helpers for NutriTrack
// Connected to Backend API with JWT
// ========================================

const TOKEN_KEY = 'nutritrack_token';
const USER_KEY = 'nutritrack_user';

// ========================================
// Token Management
// ========================================

// Get stored JWT token
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Save JWT token
function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

// Remove JWT token
function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// ========================================
// User Session Management
// ========================================

// Check if user is logged in (has valid token)
function isLoggedIn() {
    const token = getToken();
    if (!token) return false;

    // Check if token is expired (basic check)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000; // Convert to milliseconds
        return Date.now() < expiry;
    } catch (e) {
        return false;
    }
}

// Get current user from localStorage cache
function getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
}

// Save user to localStorage cache
function saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Remove user from localStorage
function removeUser() {
    localStorage.removeItem(USER_KEY);
}

// ========================================
// Authentication API Functions
// ========================================

// Login user via API
async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            saveToken(data.token);
            saveUser(data.user);
            return { success: true, user: data.user };
        } else {
            return { success: false, message: data.message || 'เข้าสู่ระบบไม่สำเร็จ' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' };
    }
}

// Register user via API
async function register(name, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.success) {
            saveToken(data.token);
            saveUser(data.user);
            return { success: true, user: data.user };
        } else {
            // Handle validation errors
            if (data.errors && data.errors.length > 0) {
                return { success: false, message: data.errors[0].msg };
            }
            return { success: false, message: data.message || 'สมัครสมาชิกไม่สำเร็จ' };
        }
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' };
    }
}

// Logout user
function logout() {
    removeToken();
    removeUser();
    window.location.href = 'login.html';
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

// ========================================
// Profile Management
// ========================================

// Update user profile via API
async function updateProfile(profileData) {
    try {
        const token = getToken();
        if (!token) return { success: false, message: 'กรุณาเข้าสู่ระบบก่อน' };

        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();

        if (data.success) {
            // Update cached user
            const user = getCurrentUser();
            if (user) {
                user.profile = { ...user.profile, ...profileData };
                saveUser(user);
            }
            return { success: true };
        } else {
            return { success: false, message: data.message || 'อัพเดทโปรไฟล์ไม่สำเร็จ' };
        }
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' };
    }
}

// Fetch user profile from API
async function fetchUserProfile() {
    try {
        const token = getToken();
        if (!token) return null;

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            saveUser(data.user);
            return data.user;
        } else {
            // Token might be invalid, clear it
            if (response.status === 401) {
                removeToken();
                removeUser();
            }
            return null;
        }
    } catch (error) {
        console.error('Fetch profile error:', error);
        return null;
    }
}

// ========================================
// UI Updates
// ========================================

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
        if (userNameEl && user) userNameEl.textContent = user.name;
    } else {
        if (authButtons) {
            authButtons.classList.remove('hidden');
            authButtons.style.display = 'flex';
        }
        if (userProfile) userProfile.classList.add('hidden');
    }
}
