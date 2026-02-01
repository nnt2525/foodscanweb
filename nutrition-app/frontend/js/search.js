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
            const cats = ['ทั้งหมด', ...data.categories.map(c => c.name)];
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
    container.innerHTML = cats.map(cat => `
        <button 
            class="btn ${cat === activeCategory ? 'btn-primary' : 'btn-secondary'} btn-sm btn-rounded"
            onclick="filterByCategory('${cat}')"
        >
            ${cat}
        </button>
    `).join('');
}

// Load foods from API
async function loadFoods() {
    const grid = document.getElementById('foodsGrid');
    grid.innerHTML = '<div class="text-center" style="grid-column: 1 / -1; padding: 3rem;"><div class="loading-spinner"></div><p class="text-gray mt-4">กำลังโหลด...</p></div>';

    try {
        const data = await foodsAPI.getAll({ status: 'approved' });
        if (data.success && data.foods) {
            allFoods = data.foods;
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

    grid.innerHTML = foods.map(food => `
        <a href="food-detail.html?id=${food.id}" class="food-card">
            <img src="${food.image || 'https://via.placeholder.com/300x180?text=🍽️'}" alt="${food.name}" class="food-card-image">
            <div class="food-card-content">
                <h3 class="food-card-title">${food.name}</h3>
                <p class="food-card-category">${food.category || 'ทั่วไป'}</p>
                <div class="flex items-center justify-between mt-2">
                    <span class="food-card-calories">${food.calories || 0} kcal</span>
                    <span class="text-gray text-sm">${food.serving_size || food.servingSize || 100}g</span>
                </div>
            </div>
        </a>
    `).join('');
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
