// ========================================
// Search Page - NutriTrack
// Connected to Backend API
// ========================================

let activeCategory = 'ทั้งหมด';
let activeFilter = { type: 'all', value: null };
let allFoods = [];

let currentPage = 1;
let isLoading = false;
let hasMore = true;

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

// Load categories
async function loadCategories() {
    const categoriesContainer = document.getElementById('categoryFilters');
    // Use the categories from data.js
    const categoriesData = typeof categories !== 'undefined' ? categories : [];

    categoriesContainer.innerHTML = categoriesData.map(category => {
        const isActive = activeCategory === category.name;
        return `
            <button class="category-btn ${isActive ? 'active' : ''}"
                onclick="filterByCategory('${category.name}', '${category.filterType}', '${category.filterValue}')">
                <span class="category-icon">${category.icon}</span>
                <span>${category.name}</span>
            </button>
        `;
    }).join('');
}

// Load foods from API
async function loadFoods(isLoadMore = false) {
    if (isLoading) return;
    isLoading = true;

    const grid = document.getElementById('foodsGrid');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loadingMore = document.getElementById('loadingMore');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (isLoadMore) {
        loadMoreBtn.classList.add('hidden');
        loadingMore.classList.remove('hidden');
    } else {
        currentPage = 1;
        hasMore = true;
        allFoods = [];
        grid.innerHTML = '<div class="text-center" style="grid-column: 1 / -1; padding: 3rem;"><div class="loading-spinner"></div><p class="text-gray mt-4">กำลังโหลด...</p></div>';
        loadMoreContainer.classList.add('hidden');
    }

    try {
        const query = document.getElementById('searchInput').value.trim();
        const params = {
            status: 'approved',
            page: currentPage,
            limit: 20
        };

        if (activeCategory !== 'ทั้งหมด') {
            // Find category ID if possible, otherwise rely on filtering client-side if API doesn't support name
            // For now, let's just fetch all and filter client side if we strictly follow existing pattern, 
            // OR better: rely on client side filtering for category/search as before, but handle pagination for "All"
            // The previous implementation fetched ALL then filtered. 
            // If we want true server-side pagination, we need to pass filters.
            // Let's stick to client-side filtering for simplicity if the dataset is < 500 items, 
            // BUT api supports limit. 
            // For this task, "Load More" implies fetching next page.

            // Note: The previous code fetched *everything* (limit default 20 in backend but maybe frontend expected all?)
            // Actually, backend defaults to 20. So frontend was only seeing 20.
            // To properly search/filter with pagination, we should pass params.

            if (activeFilter.type === 'category' && activeFilter.value) {
                params.category = activeFilter.value;
            }
        }

        if (query) {
            params.search = query;
        }

        const data = await foodsAPI.getAll(params);

        if (data.success && data.data) {
            if (isLoadMore) {
                allFoods = [...allFoods, ...data.data];
            } else {
                allFoods = data.data;
            }

            // Check pagination
            const { total, page, limit } = data.pagination;
            hasMore = page * limit < total;
            currentPage++;

            renderFoods(allFoods); // Render all because we filter client-side too? 
            // Actually, if we filter client-side, we need ALL data. 
            // But if we paginate server-side, we should render what we have.
            // The previous code had client-side filtering `filterFoods`.
            // Mixing server pagination and client filtering is tricky.
            // Let's assume server filtering for now if we pass params.
            // But wait, `filterFoods` handles client-side filtering.
            // If we use server-side search/category, we don't need `filterFoods` to filter `allFoods` again unless for "source".

            // Let's keep it simple: Append result to UI.
        } else {
            if (!isLoadMore) {
                allFoods = [];
                renderFoods([]);
            }
            hasMore = false;
        }
    } catch (error) {
        console.log('API failed', error);
        if (!isLoadMore) {
            allFoods = [];
            renderFoods([]);
        }
        hasMore = false;
    } finally {
        isLoading = false;
        if (isLoadMore) {
            loadingMore.classList.add('hidden');
        }
        updateLoadMoreButton();
    }
}

function updateLoadMoreButton() {
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    // Only show if we have more and we are not filtering client-side strictly 
    // (if we filter client-side, hasMore might be inaccurate effectively, but let's trust API)
    if (hasMore) {
        loadMoreContainer.classList.remove('hidden');
        loadMoreBtn.classList.remove('hidden');
    } else {
        loadMoreContainer.classList.add('hidden');
    }
}

async function loadMoreFoods() {
    if (hasMore && !isLoading) {
        await loadFoods(true);
    }
}

// Render foods grid
function renderFoods(foods) {
    const grid = document.getElementById('foodsGrid');
    document.getElementById('resultsCount').textContent = `แสดงอาหาร ${foods.length} รายการ`;

    const html = foods.map(food => {
        const imageUrl = food.image_url || food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
        const categoryName = food.category_name || food.category || 'ทั่วไป';

        return `
        <a href="food-detail.html?id=${food.id}" class="food-list-item">
            <div class="food-info">
                <h3 class="food-title">${food.name}</h3>
                <p class="food-detail">${food.calories || 0} kcal • ${food.serving_size || '100g'}</p>
            </div>
            <div class="food-action">
                <span class="btn-icon">➔</span> 
            </div>
        </a>
    `;
    }).join('');

    grid.innerHTML = html || `
            <div class="text-center" style="grid-column: 1 / -1; padding: 3rem;">
                <div class="text-4xl mb-4">🔍</div>
                <p class="text-gray">ไม่พบอาหารที่ค้นหา</p>
            </div>
        `;
}

// Filter foods by search query (Enhanced to trigger server search)
// We need to debounce this to avoid spamming API
const debouncedSearch = debounce(async () => {
    currentPage = 1;
    await loadFoods();
}, 500);

function filterFoods() {
    // Override existing client-side filter with server-side search
    debouncedSearch();
}

// Filter by category
async function filterByCategory(categoryName, filterType, filterValue) {
    activeCategory = categoryName;
    activeFilter = {
        type: filterType || 'all',
        value: filterValue || null
    };
    loadCategories();

    // Trigger reload
    currentPage = 1;
    await loadFoods();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initSearchPage);
