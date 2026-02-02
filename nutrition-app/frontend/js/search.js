// ========================================
// Search Page - NutriTrack
// Connected to Backend API
// ========================================

let activeCategory = 'ทั้งหมด';
let allFoods = [];

// Initialize page
async function initSearchPage() {
    await loadCategories();
    await loadFoods();

    // Check for search query from URL
    const urlQuery = getQueryParam('q');
    if (urlQuery) {
        document.getElementById('searchInput').value = urlQuery;
        filterFoods();
    }
}

// Load categories from API
async function loadCategories() {
    const container = document.getElementById('categoryFilters');

    try {
        const data = await api.get('/foods/categories');
        if (data.success && data.categories) {
            const cats = [{ name: 'ทั้งหมด', icon: '📋' }, ...data.categories];
            renderCategoryButtons(cats);
        } else {
            renderCategoryButtons(categories); // fallback to local data.js
        }
    } catch (error) {
        console.log('Using local categories');
        renderCategoryButtons(categories);
    }
}

function renderCategoryButtons(cats) {
    const container = document.getElementById('categoryFilters');

    // Normalize categories - handle both string and object formats
    const normalized = cats.map(cat => {
        if (typeof cat === 'string') {
            return { name: cat, icon: '' };
        }
        return { name: cat.name, icon: cat.icon || '' };
    });

    container.innerHTML = normalized.map(cat => `
        <button 
            class="btn ${cat.name === activeCategory ? 'btn-primary' : 'btn-secondary'} btn-sm btn-rounded"
            onclick="filterByCategory('${cat.name}')"
        >
            ${cat.icon ? cat.icon + ' ' : ''}${cat.name}
        </button>
    `).join('');
}

// Load foods from API
async function loadFoods() {
    const grid = document.getElementById('foodsGrid');
    grid.innerHTML = '<div class="text-center" style="grid-column: 1 / -1; padding: 3rem;"><div class="loading-spinner"></div><p class="text-gray mt-4">กำลังโหลด...</p></div>';

    try {
        const data = await foodsAPI.getAll({ status: 'approved' });
        if (data.success && data.data) {
            allFoods = data.data;
            renderFoods(allFoods);
        } else {
            allFoods = [];
            renderFoods([]);
        }
    } catch (error) {
        console.log('API failed, showing empty state');
        allFoods = [];
        renderFoods([]);
    }
}

// Render foods grid
function renderFoods(foods) {
    const grid = document.getElementById('foodsGrid');
    document.getElementById('resultsCount').textContent = `แสดงอาหาร ${foods.length} รายการ`;

    if (foods.length === 0) {
        grid.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 3rem;">
                <div class="text-4xl mb-4">🔍</div>
                <p class="text-gray">ไม่พบอาหารที่ค้นหา</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = foods.map(food => {
        const imageUrl = food.image_url || food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
        const categoryName = food.category_name || food.category || 'ทั่วไป';
        const categoryIcon = food.category_icon || '';

        return `
        <a href="food-detail.html?id=${food.id}" class="food-card">
            <div class="food-card-image-wrapper">
                <img src="${imageUrl}" alt="${food.name}" class="food-card-image" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'">
            </div>
            <div class="food-card-content">
                <h3 class="food-card-title">${food.name}</h3>
                <p class="food-card-category">${categoryIcon} ${categoryName}</p>
                <div class="flex items-center justify-between mt-2">
                    <span class="food-card-calories">${food.calories || 0} kcal</span>
                    <span class="text-gray text-sm">${food.serving_size || '100g'}</span>
                </div>
            </div>
        </a>
    `;
    }).join('');
}

// Filter foods by search query
function filterFoods() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    let filtered = allFoods;

    if (activeCategory !== 'ทั้งหมด') {
        filtered = filtered.filter(f => f.category === activeCategory);
    }

    if (query) {
        filtered = filtered.filter(f =>
            (f.name && f.name.toLowerCase().includes(query)) ||
            (f.name_en && f.name_en.toLowerCase().includes(query)) ||
            (f.category && f.category.toLowerCase().includes(query))
        );
    }

    renderFoods(filtered);
}

// Filter by category
function filterByCategory(category) {
    activeCategory = category;
    loadCategories(); // Re-render buttons with updated active state
    filterFoods();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initSearchPage);
