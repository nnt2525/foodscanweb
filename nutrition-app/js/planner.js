// ========================================
// Planner Page - NutriTrack
// ========================================

if (!requireAuth()) throw new Error('Not authorized');

document.getElementById('todayDate').textContent = formatDate(new Date());

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
                    <div class="flex items-center justify-between" style="padding:0.5rem;background:var(--gray-50);border-radius:0.5rem;">
                        <div class="flex items-center gap-2">
                            <span class="text-sm">${item.name}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-primary">${item.calories} kcal</span>
                            <button onclick="removeMeal('${type}', ${i})" class="text-gray" style="cursor:pointer;">✕</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    });

    document.getElementById('totalCalories').textContent = formatNumber(total);
    document.getElementById('caloriesProgress').style.width = Math.min((total / 2000) * 100, 100) + '%';
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

renderMeals();
