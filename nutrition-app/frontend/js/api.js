// ========================================
// API Service Layer - NutriTrack
// ========================================

const API_BASE_URL = 'http://127.0.0.1:3001/api';

// ========================================
// API Configuration
// ========================================
const api = {
    baseUrl: API_BASE_URL,

    async request(endpoint, options = {}) {
        const token = localStorage.getItem('nutritrack_token');

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, config);
            const data = await response.json();

            // Handle unauthorized - redirect to login
            if (response.status === 401) {
                localStorage.removeItem('nutritrack_token');
                localStorage.removeItem('nutritrack_user');
                window.location.href = 'login.html';
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || 'API Error');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};

// ========================================
// Auth API
// ========================================
const authAPI = {
    async login(email, password) {
        return api.post('/auth/login', { email, password });
    },

    async register(data) {
        return api.post('/auth/register', data);
    },

    async getProfile() {
        return api.get('/auth/me');
    },

    async updateProfile(data) {
        return api.put('/auth/profile', data);
    }
};

// ========================================
// Foods API
// ========================================
const foodsAPI = {
    async getAll(params = {}) {
        const query = new URLSearchParams(params).toString();
        return api.get(`/foods${query ? '?' + query : ''}`);
    },

    async getById(id) {
        return api.get(`/foods/${id}`);
    },

    async create(food) {
        return api.post('/foods', food);
    },

    async search(query) {
        return api.get(`/foods/search?q=${encodeURIComponent(query)}`);
    },

    async getCategories() {
        return api.get('/foods/categories/list');
    }
};

// ========================================
// Meal Plans API
// ========================================
const mealPlansAPI = {
    async getByDate(date) {
        return api.get(`/meal-plans?date=${date}`);
    },

    async create(data) {
        return api.post('/meal-plans', data);
    },

    async addItem(planId, item) {
        return api.post(`/meal-plans/${planId}/items`, item);
    },

    async removeItem(planId, itemId) {
        return api.delete(`/meal-plans/${planId}/items/${itemId}`);
    },

    async clear(planId) {
        return api.delete(`/meal-plans/${planId}/items`);
    }
};

// ========================================
// Food Logs API
// ========================================
const foodLogsAPI = {
    async log(data) {
        return api.post('/food-logs', data);
    },

    async getByDateRange(from, to) {
        return api.get(`/food-logs?from=${from}&to=${to}`);
    }
};

// ========================================
// Progress API
// ========================================
const progressAPI = {
    async getWeekly() {
        return api.get('/progress/weekly');
    },

    async getAchievements() {
        return api.get('/progress/achievements');
    }
};

// ========================================
// Community API
// ========================================
const communityAPI = {
    async getPosts(page = 1) {
        return api.get(`/posts?page=${page}`);
    },

    async createPost(content) {
        return api.post('/posts', { content });
    },

    async likePost(postId) {
        return api.post(`/posts/${postId}/like`);
    }
};

// ========================================
// Admin API
// ========================================
const adminAPI = {
    async getStats() {
        return api.get('/admin/stats');
    },

    async getUsers(params = {}) {
        const query = new URLSearchParams(params).toString();
        return api.get(`/admin/users${query ? '?' + query : ''}`);
    },

    async updateUser(id, data) {
        return api.put(`/admin/users/${id}`, data);
    },

    async deleteUser(id) {
        return api.delete(`/admin/users/${id}`);
    },

    async getPendingFoods() {
        return api.get('/admin/foods/pending');
    },

    async approveFood(id) {
        return api.put(`/admin/foods/${id}/approve`);
    },

    async rejectFood(id) {
        return api.put(`/admin/foods/${id}/reject`);
    },

    async deleteFood(id) {
        return api.delete(`/admin/foods/${id}`);
    },

    async updateFood(id, data) {
        return api.put(`/admin/foods/${id}`, data);
    },

    async getDashboardStats() {
        return api.get('/admin/stats');
    },

    async getAllFoods(params = {}) {
        const query = new URLSearchParams(params).toString();
        return api.get(`/admin/foods${query ? '?' + query : ''}`);
    }
};

// ========================================
// Export for use
// ========================================
window.api = api;
window.authAPI = authAPI;
window.foodsAPI = foodsAPI;
window.mealPlansAPI = mealPlansAPI;
window.foodLogsAPI = foodLogsAPI;
window.progressAPI = progressAPI;
window.communityAPI = communityAPI;
window.adminAPI = adminAPI;
