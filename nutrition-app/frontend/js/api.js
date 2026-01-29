// ========================================
// API Service Layer - NutriTrack Frontend
// ========================================

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            },
            ...options
        };
        
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, config);
            const data = await response.json();
            
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);
                    window.location.href = '/html/login.html';
                    return;
                }
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
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (data) => api.post('/auth/register', data),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data)
};

// ========================================
// Foods API
// ========================================
const foodsAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return api.get(`/foods${query ? '?' + query : ''}`);
    },
    getById: (id) => api.get(`/foods/${id}`),
    create: (food) => api.post('/foods', food),
    search: (query) => api.get(`/foods?search=${encodeURIComponent(query)}`),
    getCategories: () => api.get('/foods/categories/list')
};

// ========================================
// Meal Plans API
// ========================================
const mealPlansAPI = {
    getByDate: (date) => api.get(`/meal-plans?date=${date}`),
    addItem: (planId, item) => api.post(`/meal-plans/${planId}/items`, item),
    removeItem: (planId, itemId) => api.delete(`/meal-plans/${planId}/items/${itemId}`),
    clearItems: (planId) => api.delete(`/meal-plans/${planId}/items`)
};

// ========================================
// Progress API
// ========================================
const progressAPI = {
    getWeekly: () => api.get('/progress/weekly'),
    getAchievements: () => api.get('/progress/achievements')
};

// ========================================
// Admin API
// ========================================
const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getUsers: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return api.get(`/admin/users${query ? '?' + query : ''}`);
    },
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getPendingFoods: () => api.get('/admin/foods/pending'),
    approveFood: (id) => api.put(`/admin/foods/${id}/approve`),
    rejectFood: (id) => api.put(`/admin/foods/${id}/reject`),
    deleteFood: (id) => api.delete(`/admin/foods/${id}`)
};

// Export
window.api = api;
window.authAPI = authAPI;
window.foodsAPI = foodsAPI;
window.mealPlansAPI = mealPlansAPI;
window.progressAPI = progressAPI;
window.adminAPI = adminAPI;
