// ========================================
// Planner Page - NutriTrack
// Connected to Backend API
// ========================================

if (!requireAuth()) throw new Error('Not authorized');

let currentMealType = 'breakfast';
let currentMealPlanId = null;
const userGoal = getCurrentUser()?.profile?.dailyCalories || 2000;

document.getElementById('todayDate').textContent = formatDate(new Date());

// ========================================
// Initialize
// ========================================
async function initPlanner() {
    await loadMeals();
    await loadFoodsForSearch();
}

// ========================================
// Load Meals
// ========================================
async function loadMeals() {
    const today = new Date().toISOString().split('T')[0];

    try {
        const data = await mealPlansAPI.getByDate(today);
        if (data.success && data.mealPlan) {
            currentMealPlanId = data.mealPlan.id;
            renderMealsFromAPI(data.mealPlan.items || []);
        } else {
            // No meal plan for today, use localStorage fallback
            renderMealsFromLocalStorage();
        }
    } catch (error) {
        console.log('API failed, using localStorage');
        renderMealsFromLocalStorage();
    }
}

function renderMealsFromAPI(items) {
    const meals = { breakfast: [], lunch: [], dinner: [], snacks: [] };

    items.forEach(item => {
        const type = item.meal_type || 'snacks';
        if (meals[type]) {
            meals[type].push({
                id: item.id,
                name: item.food_name || item.name,
                calories: item.calories || 0,
                protein: item.protein || 0,
                carbs: item.carbs || 0,
                fat: item.fat || 0
            });
        }
    });

    renderMealsUI(meals);
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

function renderFoodList(foods) {
    if (foods.length === 0) {
        return `
            <div class="text-center text-gray py-8">
                <p>ยังไม่มีอาหารในระบบ</p>
                <p class="text-sm mt-2">ลองเพิ่มอาหารของคุณเอง!</p>
            </div>
        `;
    }

    return foods.map(food => `
        <div class="food-search-item" onclick="addFoodToMeal(${food.id})">
            <div class="food-search-info">
                <span class="food-search-name">${food.name}</span>
                <span class="food-search-macro">
                    ${food.protein ? `P:${food.protein}g` : ''} 
                    ${food.carbs ? `C:${food.carbs}g` : ''} 
                    ${food.fat ? `F:${food.fat}g` : ''}
                </span>
            </div>
            <span class="food-search-calories">${food.calories} kcal</span>
        </div>
    `).join('');
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

    // Add to localStorage (API integration can be added later)
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
        category: document.getElementById('customCategory').value
    };

    if (!food.name || !food.calories) {
        showNotification('กรุณากรอกชื่อและแคลอรี่', 'error');
        return;
    }

    try {
        // Try to save to API
        const response = await foodsAPI.create(food);
        if (response.success) {
            food.id = response.food.id;
        }
    } catch (error) {
        // Fallback: save locally
        food.id = Date.now();
        const foods = getFromLocalStorage('nutritrack_foods', []);
        foods.push(food);
        saveToLocalStorage('nutritrack_foods', foods);
    }

    // Add to meal
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
