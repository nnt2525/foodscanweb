// ========================================
// Search Page - NutriTrack
// ========================================

let activeCategory = 'ทั้งหมด';

// Render categories
function renderCategories() {
    const container = document.getElementById('categoryFilters');
    container.innerHTML = categories.map(cat => `
        <button 
            class="btn ${cat === activeCategory ? 'btn-primary' : 'btn-secondary'} btn-sm btn-rounded"
            onclick="filterByCategory('${cat}')"
        >
            ${cat}
        </button>
    `).join('');
}

// Render foods
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
            <img src="${food.image}" alt="${food.name}" class="food-card-image">
            <div class="food-card-content">
                <h3 class="food-card-title">${food.name}</h3>
                <p class="food-card-category">${food.category}</p>
                <div class="flex items-center justify-between mt-2">
                    <span class="food-card-calories">${food.calories} kcal</span>
                    <span class="text-gray text-sm">${food.servingSize}g</span>
                </div>
                <div class="flex gap-2 mt-3" style="flex-wrap: wrap;">
                    ${food.tags.slice(0, 2).map(tag => `
                        <span class="badge badge-green">${tag}</span>
                    `).join('')}
                </div>
            </div>
        </a>
    `).join('');
}

// Filter by search
function filterFoods() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    let filtered = mockFoods;

    if (activeCategory !== 'ทั้งหมด') {
        filtered = filtered.filter(f => f.category === activeCategory);
    }

    if (query) {
        filtered = filtered.filter(f =>
            f.name.toLowerCase().includes(query) ||
            f.nameEn.toLowerCase().includes(query) ||
            f.category.toLowerCase().includes(query) ||
            f.tags.some(t => t.toLowerCase().includes(query))
        );
    }

    renderFoods(filtered);
}

// Filter by category
function filterByCategory(category) {
    activeCategory = category;
    renderCategories();
    filterFoods();
}

// Initialize
renderCategories();

// Check for search query from URL
const urlQuery = getQueryParam('q');
if (urlQuery) {
    document.getElementById('searchInput').value = urlQuery;
    filterFoods();
} else {
    renderFoods(mockFoods);
}
