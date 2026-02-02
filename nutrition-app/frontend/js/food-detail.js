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
        <a href="search.html" class="btn btn-ghost mb-4">← กลับ</a>
        
        <div class="grid grid-cols-2 grid-responsive gap-6">
            <div>
            <div class="food-image-container" style="width:100%;height:300px;border-radius:1rem;overflow:hidden;background:linear-gradient(135deg, var(--primary-100), var(--primary-50));">
                    ${food.image_url
            ? `<img src="${food.image_url}" alt="${food.name}" style="width:100%;height:100%;object-fit:cover;">`
            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"><span style="font-size:5rem;">🍽️</span></div>`
        }
                </div>
                <div class="flex gap-2 mt-4 flex-wrap">
                    <span class="badge badge-green">${food.category_name || 'ทั่วไป'}</span>
                    ${food.source && food.source !== 'manual' ? `<span class="badge badge-blue">${food.source.toUpperCase()}</span>` : ''}
                </div>
            </div>
            
            <div>
                <h1 class="text-3xl font-bold mb-2">${food.name}</h1>
                <p class="text-gray mb-4">${food.name_en || ''} ${food.brand ? `• ${food.brand}` : ''}</p>
                
                <div class="card mb-4">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-lg font-bold">ปริมาณต่อหนึ่งที่</span>
                        <span class="badge badge-blue">${food.serving_size || '100g'}</span>
                    </div>
                    <div class="text-center mb-4" style="padding:1rem;background:var(--primary-50);border-radius:0.75rem;">
                        <div class="text-3xl font-bold text-primary">${food.calories}</div>
                        <div class="text-gray">แคลอรี่</div>
                    </div>
                    <div class="grid grid-cols-3 gap-4 text-center">
                        <div style="padding:1rem;background:var(--gray-50);border-radius:0.5rem;">
                            <div class="font-bold">${food.carbs || 0}g</div>
                            <div class="text-sm text-gray">คาร์บ</div>
                        </div>
                        <div style="padding:1rem;background:var(--gray-50);border-radius:0.5rem;">
                            <div class="font-bold">${food.protein || 0}g</div>
                            <div class="text-sm text-gray">โปรตีน</div>
                        </div>
                        <div style="padding:1rem;background:var(--gray-50);border-radius:0.5rem;">
                            <div class="font-bold">${food.fat || 0}g</div>
                            <div class="text-sm text-gray">ไขมัน</div>
                        </div>
                    </div>
                </div>
                
                ${auth.isLoggedIn() ? `
                    <div class="form-group mb-4">
                        <label class="form-label">เลือกมื้ออาหาร</label>
                        <select id="mealSelect" class="form-input">
                            <option value="breakfast">มื้อเช้า</option>
                            <option value="lunch">มื้อเที่ยง</option>
                            <option value="dinner">มื้อเย็น</option>
                            <option value="snacks">ของว่าง</option>
                        </select>
                    </div>
                    <button onclick="addToMeal()" class="btn btn-primary btn-block btn-lg">
                        + เพิ่มลงมื้ออาหาร
                    </button>
                ` : `
                    <a href="login.html" class="btn btn-primary btn-block btn-lg">
                        เข้าสู่ระบบเพื่อบันทึก
                    </a>
                `}
            </div>
        </div>
        
        <!-- Detailed Nutrition -->
        <div class="card mt-6">
            <h2 class="text-xl font-bold mb-4">ข้อมูลโภชนาการโดยละเอียด</h2>
            <div class="grid grid-cols-2 grid-responsive gap-6">
                <div>
                    <h3 class="font-semibold mb-3">สารอาหารหลัก</h3>
                    <div class="text-sm">
                        <div class="flex justify-between mb-2"><span>พลังงาน</span><span>${food.calories} kcal</span></div>
                        <div class="flex justify-between mb-2"><span>โปรตีน</span><span>${food.protein || 0}g</span></div>
                        <div class="flex justify-between mb-2"><span>คาร์โบไฮเดรต</span><span>${food.carbs || 0}g</span></div>
                        <div class="flex justify-between mb-2"><span>ไขมัน</span><span>${food.fat || 0}g</span></div>
                        <div class="flex justify-between"><span>ใยอาหาร</span><span>${food.fiber || 0}g</span></div>
                    </div>
                </div>
                <div>
                    <h3 class="font-semibold mb-3">ข้อมูลเพิ่มเติม</h3>
                    <div class="text-sm">
                        <div class="flex justify-between mb-2"><span>หมวดหมู่</span><span>${food.category_name || '-'}</span></div>
                        <div class="flex justify-between mb-2"><span>แหล่งที่มา</span><span>${food.source || 'manual'}</span></div>
                        ${food.barcode ? `<div class="flex justify-between"><span>Barcode</span><span>${food.barcode}</span></div>` : ''}
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
