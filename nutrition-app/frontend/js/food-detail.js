// ========================================
// Food Detail Page - NutriTrack
// Connected to Backend API
// ========================================

let food = null;
const container = document.getElementById('foodContent');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const foodId = getQueryParam('id');

    if (!foodId) {
        showError();
        return;
    }

    await loadFoodDetail(foodId);
});

async function loadFoodDetail(id) {
    try {
        const response = await foodsAPI.getById(id);

        if (response.success && response.data) {
            food = response.data;
            renderFoodDetail();
        } else {
            showError();
        }
    } catch (error) {
        console.error('Load food error:', error);
        showError();
    }
}

function showError() {
    container.innerHTML = `
        <div class="text-center" style="padding: 3rem;">
            <div class="text-4xl mb-4">❌</div>
            <h2 class="text-2xl font-bold mb-2">ไม่พบอาหาร</h2>
            <p class="text-gray mb-4">อาหารที่คุณค้นหาไม่มีในระบบ</p>
            <a href="search.html" class="btn btn-primary">กลับไปค้นหา</a>
        </div>
    `;
}

function renderFoodDetail() {
    document.title = `${food.name} - NutriTrack`;

    container.innerHTML = `
        <div class="max-w-3xl mx-auto">
            <a href="search.html" class="btn btn-ghost mb-6 inline-flex items-center gap-2">
                <span>←</span> กลับไปค้นหา
            </a>

            <!-- Section 2: Basic Info (Middle) -->
            <div class="card shadow-lg p-8 mb-6">
                <!-- Header -->
                <div class="text-center mb-8">
                    <div class="flex justify-center gap-2 mb-4">
                            <span class="badge badge-green">${food.category_name || 'ทั่วไป'}</span>
                            ${food.source && food.source !== 'manual' ? `<span class="badge badge-blue">${food.source.toUpperCase()}</span>` : ''}
                    </div>
                    <h1 class="text-4xl font-bold text-dark mb-2">${food.name}</h1>
                    <p class="text-gray mb-4 text-lg">${food.name_en || ''} ${food.brand ? `• ${food.brand}` : ''}</p>
                </div>
                
                <!-- Main Stats (Calories) -->
                <div class="bg-primary-50 rounded-2xl p-6 text-center mb-8 max-w-sm mx-auto" style="border-radius: 1rem;">
                    <div class="text-sm text-gray uppercase tracking-widest mb-2" style="letter-spacing: 0.1em;">พลังงาน</div>
                    <div class="flex items-baseline justify-center gap-2">
                        <span class="text-5xl font-bold text-primary">${food.calories}</span>
                        <span class="text-xl text-primary font-medium">kcal</span>
                    </div>
                    <div class="text-sm text-gray mt-2">ต่อ ${food.serving_size || '100g'}</div>
                </div>

                <!-- Macros Grid -->
                <div class="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
                    <div class="text-center p-4 bg-gray-50" style="border-radius: 1rem;">
                        <div class="text-2xl font-bold text-dark mb-1">${food.protein || 0}g</div>
                        <div class="text-sm text-gray">โปรตีน</div>
                    </div>
                    <div class="text-center p-4 bg-gray-50" style="border-radius: 1rem;">
                        <div class="text-2xl font-bold text-dark mb-1">${food.carbs || 0}g</div>
                        <div class="text-sm text-gray">คาร์บ</div>
                    </div>
                    <div class="text-center p-4 bg-gray-50" style="border-radius: 1rem;">
                        <div class="text-2xl font-bold text-dark mb-1">${food.fat || 0}g</div>
                        <div class="text-sm text-gray">ไขมัน</div>
                    </div>
                </div>

                <!-- Add to Meal -->
                ${auth.isLoggedIn() ? `
                    <div class="max-w-lg mx-auto" style="border-top: 1px solid var(--gray-200); padding-top: 2rem;">
                        <label class="form-label mb-3 text-center block">บันทึกลงมื้ออาหาร</label>
                        <div class="flex gap-3">
                            <select id="mealSelect" class="form-input flex-1">
                                <option value="breakfast">Breakfast (มื้อเช้า)</option>
                                <option value="lunch">Lunch (มื้อเที่ยง)</option>
                                <option value="dinner">Dinner (มื้อเย็น)</option>
                                <option value="snacks">Snack (ของว่าง)</option>
                            </select>
                            <button onclick="addToMeal()" class="btn btn-primary px-8">
                                + บันทึก
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="text-center mt-6">
                        <a href="login.html" class="btn btn-outline inline-flex px-8">
                            เข้าสู่ระบบเพื่อบันทึก
                        </a>
                    </div>
                `}
            </div>

            <!-- Section 3: Detailed Info (Bottom) -->
            <div class="card shadow-lg p-8">
                <h2 class="text-xl font-bold mb-6 flex items-center gap-2 border-b border-gray-200 pb-4">
                    <span class="text-2xl">📋</span> ข้อมูลโภชนาการโดยละเอียด
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="font-semibold mb-4 text-dark text-lg">สารอาหารหลัก</h3>
                        <div class="text-base space-y-3">
                            <div class="flex justify-between py-2 border-b border-gray-100">
                                <span class="text-gray-600">พลังงานทั้งหมด</span>
                                <span class="font-medium">${food.calories} kcal</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100">
                                <span class="text-gray-600">โปรตีน</span>
                                <span class="font-medium">${food.protein || 0}g</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100">
                                <span class="text-gray-600">คาร์โบไฮเดรต</span>
                                <span class="font-medium">${food.carbs || 0}g</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100">
                                <span class="text-gray-600">ไขมัน</span>
                                <span class="font-medium">${food.fat || 0}g</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100">
                                <span class="text-gray-600">ใยอาหาร</span>
                                <span class="font-medium">${food.fiber || 0}g</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-semibold mb-4 text-dark text-lg">ข้อมูลเพิ่มเติม</h3>
                        <div class="text-base space-y-3">
                            <div class="flex justify-between py-2 border-b border-gray-100">
                                <span class="text-gray-600">หมวดหมู่</span>
                                <span class="badge badge-gray text-sm">${food.category_name || '-'}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-gray-100">
                                <span class="text-gray-600">แหล่งที่มา</span>
                                <span class="text-gray-800">${food.source || 'manual'}</span>
                            </div>
                            ${food.barcode ? `
                            <div class="flex justify-between py-2 border-b border-gray-100">
                                <span class="text-gray-600">บาร์โค้ด</span>
                                <span class="font-mono text-gray-800">${food.barcode}</span>
                            </div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Set default meal based on time
    if (auth.isLoggedIn()) {
        const now = new Date().getHours();
        let defaultMeal = 'snacks';
        if (now < 10) defaultMeal = 'breakfast';
        else if (now < 14) defaultMeal = 'lunch';
        else if (now < 20) defaultMeal = 'dinner';

        setTimeout(() => {
            const select = document.getElementById('mealSelect');
            if (select) select.value = defaultMeal;
        }, 0);
    }
}

function addToMeal() {
    const meals = getFromLocalStorage('nutritrack_meals', { breakfast: [], lunch: [], dinner: [], snacks: [] });
    const mealType = document.getElementById('mealSelect').value;
    const mealNames = {
        breakfast: 'มื้อเช้า',
        lunch: 'มื้อเที่ยง',
        dinner: 'มื้อเย็น',
        snacks: 'ของว่าง'
    };

    meals[mealType].push({
        id: food.id,
        name: food.name,
        calories: food.calories || 0,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0,
        addedAt: new Date().toISOString()
    });
    saveToLocalStorage('nutritrack_meals', meals);
    showNotification(`เพิ่ม ${food.name} ลงใน${mealNames[mealType]}แล้ว!`, 'success');
}
