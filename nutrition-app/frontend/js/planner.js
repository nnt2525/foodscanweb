// ========================================
// Planner Page - NutriTrack
// Connected to Backend API
// ========================================

if (!requireAuth()) throw new Error('Not authorized');

let currentMealType = 'breakfast';
let currentMealPlanId = null;
const userGoal = getCurrentUser()?.daily_calories || 2000;
let currentSelectedDate = new Date().toISOString().split('T')[0];

// ========================================
// Initialize
// ========================================
async function initPlanner() {
    // Set initial date
    const dateInput = document.getElementById('dateSelector');
    if (dateInput) {
        dateInput.value = currentSelectedDate;
    }

    // Display target calories from user profile
    const targetDisplay = document.getElementById('targetCalories');
    if (targetDisplay) {
        targetDisplay.textContent = formatNumber(userGoal) + ' kcal';
    }

    await loadMeals();
    await loadFoodsForSearch();
}

// ========================================
// Date Navigation
// ========================================
async function changeDate(offset) {
    const date = new Date(currentSelectedDate);
    date.setDate(date.getDate() + offset);
    currentSelectedDate = date.toISOString().split('T')[0];

    document.getElementById('dateSelector').value = currentSelectedDate;
    await loadMeals();
}

async function handleDateChange(value) {
    if (!value) return;
    currentSelectedDate = value;
    await loadMeals();
}

// ========================================
// Meal Type Selector Modal
// ========================================
function openMealTypeSelector() {
    document.getElementById('mealTypeSelectorModal').classList.remove('hidden');
}

function closeMealTypeSelector() {
    document.getElementById('mealTypeSelectorModal').classList.add('hidden');
}

function selectMealTypeAndOpenFood(mealType) {
    closeMealTypeSelector();
    openAddFoodModal(mealType);
}

// ========================================
// Load Meals
// ========================================
async function loadMeals() {
    const today = currentSelectedDate;

    try {
        const response = await mealPlansAPI.getByDate(today);
        if (response.success && response.data) {
            const { plan, meals } = response.data;
            currentMealPlanId = plan.id;

            // Backend returns meals grouped by type with correct fields
            renderMealsUI(meals);
        } else {
            // Fallback for offline/error
            renderMealsFromLocalStorage();
        }
    } catch (error) {
        console.log('API failed, using localStorage', error);
        renderMealsFromLocalStorage();
    }
}

function renderMealsFromLocalStorage() {
    const meals = getFromLocalStorage('nutritrack_meals', { breakfast: [], lunch: [], dinner: [], snacks: [] });
    renderMealsUI(meals);
}

function renderMealsUI(meals) {
    let total = 0;

    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(type => {
        const list = document.getElementById(type + 'List');
        const items = meals[type] || [];

        if (items.length === 0) {
            list.innerHTML = '<p class="text-gray text-sm">ยังไม่มีรายการ</p>';
        } else {
            list.innerHTML = items.map((item, i) => {
                total += item.calories;
                return `
                    <div class="meal-item">
                        <div class="meal-item-info">
                            <span class="meal-item-name">${item.name}</span>
                            ${item.protein ? `<span class="meal-item-macro">P:${item.protein}g</span>` : ''}
                        </div>
                        <div class="meal-item-actions">
                            <span class="meal-item-calories">${item.calories} kcal</span>
                            <button onclick="removeMeal('${type}', ${item.id || i})" class="meal-item-remove">✕</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    });

    document.getElementById('totalCalories').textContent = formatNumber(total);
    document.getElementById('caloriesProgress').style.width = Math.min((total / userGoal) * 100, 100) + '%';
}

// ========================================
// Remove Meal
// ========================================
async function removeMeal(type, itemId) {
    if (currentMealPlanId) {
        try {
            await mealPlansAPI.removeItem(currentMealPlanId, itemId);
            await loadMeals();
            showNotification('ลบรายการแล้ว', 'info');
            return;
        } catch (error) {
            console.log('API failed, removing from localStorage');
        }
    }

    // Fallback to localStorage
    const meals = getFromLocalStorage('nutritrack_meals', {});
    meals[type].splice(itemId, 1);
    saveToLocalStorage('nutritrack_meals', meals);
    renderMealsFromLocalStorage();
    showNotification('ลบรายการแล้ว', 'info');
}

function clearAllMeals() {
    if (confirm('ต้องการล้างรายการทั้งหมด?')) {
        saveToLocalStorage('nutritrack_meals', { breakfast: [], lunch: [], dinner: [], snacks: [] });
        renderMealsFromLocalStorage();
        showNotification('ล้างรายการทั้งหมดแล้ว', 'success');
    }
}

// ========================================
// Modal Functions
// ========================================
let searchFoods = [];

async function loadFoodsForSearch() {
    try {
        const data = await foodsAPI.getAll({ status: 'approved' });
        if (data.success) {
            searchFoods = data.data || [];
        }
    } catch (error) {
        searchFoods = getFromLocalStorage('nutritrack_foods', []);
    }
}

function openAddFoodModal(mealType) {
    currentMealType = mealType;
    document.getElementById('addFoodModal').classList.remove('hidden');
    document.getElementById('modalSearchInput').value = '';
    document.getElementById('searchResults').innerHTML = renderFoodList(searchFoods);
    switchTab('search');
}

function closeAddFoodModal() {
    document.getElementById('addFoodModal').classList.add('hidden');
    document.getElementById('customFoodForm').reset();
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));

    if (tab === 'search') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('searchTab').classList.remove('hidden');
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('customTab').classList.remove('hidden');
    }
}

// ========================================
// Search Foods in Modal
// ========================================
function searchFoodsInModal() {
    const query = document.getElementById('modalSearchInput').value.toLowerCase().trim();

    const filtered = query
        ? searchFoods.filter(f => f.name && f.name.toLowerCase().includes(query))
        : searchFoods;

    document.getElementById('searchResults').innerHTML = renderFoodList(filtered);
}

function renderFoodList(foods, showAll = false) {
    const totalCount = foods.length;
    
    if (totalCount === 0) {
        return `
            <div class="food-search-empty">
                <div class="icon">🍽️</div>
                <p>ไม่พบอาหารที่ค้นหา</p>
                <p class="text-sm mt-2">ลองค้นหาใหม่ หรือเพิ่มอาหารของคุณเอง!</p>
            </div>
        `;
    }

    // Limit display items unless showing all
    const displayLimit = showAll ? totalCount : 50;
    const displayFoods = foods.slice(0, displayLimit);
    
    let html = `
        <div class="search-results-header">
            <span class="search-results-count">
                พบ <strong>${totalCount}</strong> รายการ
                ${totalCount > displayLimit ? `(แสดง ${displayLimit} รายการแรก)` : ''}
            </span>
        </div>
    `;

    html += displayFoods.map(food => `
        <div class="food-search-item" onclick="addFoodToMeal(${food.id})">
            <div class="food-search-info">
                <span class="food-search-name">${food.name}</span>
                <span class="food-search-macro">
                    ${food.protein ? `<span>🥩 ${food.protein}g</span>` : ''} 
                    ${food.carbs ? `<span>🍚 ${food.carbs}g</span>` : ''} 
                    ${food.fat ? `<span>🧈 ${food.fat}g</span>` : ''}
                </span>
            </div>
            <span class="food-search-calories">${food.calories} kcal</span>
        </div>
    `).join('');

    // Add load more button if there are more items
    if (totalCount > displayLimit && !showAll) {
        html += `
            <button class="load-more-btn" onclick="showAllFoods()">
                แสดงทั้งหมด ${totalCount} รายการ
            </button>
        `;
    }

    return html;
}

// Show all foods without limit
function showAllFoods() {
    const query = document.getElementById('modalSearchInput').value.toLowerCase().trim();
    const filtered = query
        ? searchFoods.filter(f => f.name && f.name.toLowerCase().includes(query))
        : searchFoods;
    document.getElementById('searchResults').innerHTML = renderFoodList(filtered, true);
}

// ========================================
// Add Food to Meal
// ========================================
async function addFoodToMeal(foodId) {
    const food = searchFoods.find(f => f.id === foodId);

    if (!food) {
        showNotification('ไม่พบอาหาร', 'error');
        return;
    }

    if (currentMealPlanId) {
        try {
            const response = await mealPlansAPI.addItem(currentMealPlanId, {
                food_id: food.id,
                meal_type: currentMealType,
                quantity: 1
            });

            if (response.success) {
                await loadMeals();
                closeAddFoodModal();
                showNotification(`เพิ่ม ${food.name} แล้ว`, 'success');
                return;
            }
        } catch (error) {
            console.error('Failed to add to backend:', error);
            // Fallback to local storage if API fails
        }
    }

    // Fallback/Offline mode
    const meals = getFromLocalStorage('nutritrack_meals', { breakfast: [], lunch: [], dinner: [], snacks: [] });
    meals[currentMealType].push({
        id: food.id,
        name: food.name,
        calories: food.calories || 0,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0
    });

    saveToLocalStorage('nutritrack_meals', meals);
    renderMealsFromLocalStorage();
    closeAddFoodModal();
    showNotification(`เพิ่ม ${food.name} แล้ว`, 'success');
}

// ========================================
// Add Custom Food
// ========================================
async function addCustomFood(event) {
    event.preventDefault();

    const food = {
        name: document.getElementById('customName').value.trim(),
        calories: parseInt(document.getElementById('customCalories').value) || 0,
        protein: parseFloat(document.getElementById('customProtein').value) || 0,
        carbs: parseFloat(document.getElementById('customCarbs').value) || 0,
        fat: parseFloat(document.getElementById('customFat').value) || 0,
        category: document.getElementById('customCategory').value || 'general'
    };

    if (!food.name || !food.calories) {
        showNotification('กรุณากรอกชื่อและแคลอรี่', 'error');
        return;
    }

    try {
        // 1. Create the food in the backend
        const foodResponse = await foodsAPI.create(food);

        if (foodResponse.success && currentMealPlanId) {
            // 2. Add the new food to the current meal plan
            const newFoodId = foodResponse.data.id;
            await mealPlansAPI.addItem(currentMealPlanId, {
                food_id: newFoodId,
                meal_type: currentMealType,
                quantity: 1
            });

            await loadMeals();
            closeAddFoodModal();
            showNotification(`เพิ่ม ${food.name} แล้ว`, 'success');
            return;
        }
    } catch (error) {
        console.error('API Error:', error);
        // Fallback to local storage
    }

    // Fallback
    food.id = Date.now();

    // Save custom food locally
    const foods = getFromLocalStorage('nutritrack_foods', []);
    foods.push(food);
    saveToLocalStorage('nutritrack_foods', foods);

    // Add to meal locally
    const meals = getFromLocalStorage('nutritrack_meals', { breakfast: [], lunch: [], dinner: [], snacks: [] });
    meals[currentMealType].push({
        id: food.id,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat
    });

    saveToLocalStorage('nutritrack_meals', meals);
    renderMealsFromLocalStorage();
    closeAddFoodModal();
    showNotification(`เพิ่ม ${food.name} แล้ว`, 'success');
}

// ========================================
// Initialize
// ========================================
initPlanner();
