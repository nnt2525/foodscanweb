// ========================================
// Authentication Module - NutriTrack Frontend
// ========================================

const Auth = {
    // Check if user is logged in
    isLoggedIn() {
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    },
    
    // Get current user
    getUser() {
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
    },
    
    // Check if user is admin
    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    },
    
    // Save auth data
    saveAuth(token, user) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },
    
    // Clear auth data
    clearAuth() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
    },
    
    // Login
    async login(email, password) {
        try {
            const response = await authAPI.login(email, password);
            if (response.success) {
                this.saveAuth(response.token, response.user);
                return { success: true, user: response.user };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },
    
    // Register
    async register(data) {
        try {
            const response = await authAPI.register(data);
            if (response.success) {
                this.saveAuth(response.token, response.user);
                return { success: true, user: response.user };
            }
            return { success: false, message: response.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },
    
    // Logout
    logout() {
        this.clearAuth();
        window.location.href = '/html/login.html';
    },
    
    // Require login (redirect if not logged in)
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/html/login.html';
            return false;
        }
        return true;
    },
    
    // Require admin (redirect if not admin)
    requireAdmin() {
        if (!this.isLoggedIn()) {
            window.location.href = '/html/login.html';
            return false;
        }
        if (!this.isAdmin()) {
            window.location.href = '/html/dashboard.html';
            return false;
        }
        return true;
    }
};

window.Auth = Auth;
