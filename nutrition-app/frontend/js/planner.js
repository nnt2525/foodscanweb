// ========================================
// Planner Page - NutriTrack
// ========================================

if (!requireAuth()) throw new Error('Not authorized');

let currentMealType = 'breakfast';
const userGoal = getFromLocalStorage('nutritrack_user_goal', 2000);

document.getElementById('todayDate').textContent = formatDate(new Date());

// ========================================
// Meal Rendering
// ========================================
function renderMeals() {
    const meals = getFromLocalStorage('nutritrack_meals', { breakfast: [], lunch: [], dinner: [], snacks: [] });
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
                            <button onclick="removeMeal('${type}', ${i})" class="meal-item-remove">✕</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    });

    document.getElementById('totalCalories').textContent = formatNumber(total);
    document.getElementById('caloriesProgress').style.width = Math.min((total / userGoal) * 100, 100) + '%';
}

function removeMeal(type, index) {
    const meals = getFromLocalStorage('nutritrack_meals', {});
    meals[type].splice(index, 1);
    saveToLocalStorage('nutritrack_meals', meals);
    renderMeals();
    showNotification('ลบรายการแล้ว', 'info');
}

function clearAllMeals() {
    if (confirm('ต้องการล้างรายการทั้งหมด?')) {
        saveToLocalStorage('nutritrack_meals', { breakfast: [], lunch: [], dinner: [], snacks: [] });
        renderMeals();
        showNotification('ล้างรายการทั้งหมดแล้ว', 'success');
    }
}

// ========================================
// Modal Functions
// ========================================
function openAddFoodModal(mealType) {
    currentMealType = mealType;
    document.getElementById('addFoodModal').classList.remove('hidden');
    document.getElementById('modalSearchInput').value = '';
    document.getElementById('searchResults').innerHTML = renderFoodList(getFoodsFromStorage());
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
// Food Storage (จะเปลี่ยนเป็น API ภายหลัง)
// ========================================
function getFoodsFromStorage() {
    return getFromLocalStorage('nutritrack_foods', []);
}

function saveFoodToStorage(food) {
    const foods = getFoodsFromStorage();
    food.id = Date.now();
    food.createdAt = new Date().toISOString();
    food.status = 'pending';
    foods.push(food);
    saveToLocalStorage('nutritrack_foods', foods);
    return food;
}

// ========================================
// Search Foods
// ========================================
function searchFoodsInModal() {
    const query = document.getElementById('modalSearchInput').value.toLowerCase().trim();
    const foods = getFoodsFromStorage();
    
    const filtered = query 
        ? foods.filter(f => f.name.toLowerCase().includes(query))
        : foods;
    
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
function addFoodToMeal(foodId) {
    const foods = getFoodsFromStorage();
    const food = foods.find(f => f.id === foodId);
    
    if (!food) {
        showNotification('ไม่พบอาหาร', 'error');
        return;
    }
    
    const meals = getFromLocalStorage('nutritrack_meals', { breakfast: [], lunch: [], dinner: [], snacks: [] });
    meals[currentMealType].push({
        id: food.id,
        name: food.name,
        calories: food.calories,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0
    });
    
    saveToLocalStorage('nutritrack_meals', meals);
    renderMeals();
    closeAddFoodModal();
    showNotification(`เพิ่ม ${food.name} แล้ว`, 'success');
}

// ========================================
// Add Custom Food
// ========================================
function addCustomFood(event) {
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
    
    const savedFood = saveFoodToStorage(food);
    
    const meals = getFromLocalStorage('nutritrack_meals', { breakfast: [], lunch: [], dinner: [], snacks: [] });
    meals[currentMealType].push({
        id: savedFood.id,
        name: savedFood.name,
        calories: savedFood.calories,
        protein: savedFood.protein,
        carbs: savedFood.carbs,
        fat: savedFood.fat
    });
    
    saveToLocalStorage('nutritrack_meals', meals);
    renderMeals();
    closeAddFoodModal();
    showNotification(`เพิ่ม ${food.name} แล้ว (รอการอนุมัติ)`, 'success');
}

// ========================================
// Initialize
// ========================================
renderMeals();
