// ========================================
// Dashboard Page - NutriTrack
// Connected to Backend API
// ========================================

// Default/Fallback data
const defaultWeeklyData = {
    labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
    calories: [1850, 2100, 1950, 2200, 2000, 1800, 1900]
};

// Main initialization
async function initDashboard() {
    // Check auth first
    if (!requireAuth()) {
        return;
    }

    // Get user info
    const user = getCurrentUser();
    if (user) {
        const greetingEl = document.getElementById('greeting');
        if (greetingEl) {
            greetingEl.textContent = `${getGreeting()}, ${user.name}!`;
        }
    }

    // Load dashboard data
    await loadTodayData();
    await loadWeeklyChart();
}

// Load today's meal data
async function loadTodayData() {
    const today = new Date().toISOString().split('T')[0];

    // Default values
    let calories = {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snacks: 0
    };
    let recentMeals = [];
    const goalCalories = getCurrentUser()?.profile?.dailyCalories || 2000;

    try {
        // Try to fetch from API
        const data = await mealPlansAPI.getByDate(today);

        if (data.success && data.mealPlan) {
            // Process meal items from API
            const items = data.mealPlan.items || [];
            items.forEach(item => {
                const mealType = item.meal_type || 'snacks';
                if (calories[mealType] !== undefined) {
                    calories[mealType] += item.calories || 0;
                }
            });
            recentMeals = items.slice(0, 4);
        }
    } catch (error) {
        console.log('Using localStorage fallback for meals');
        // Fallback to localStorage
        const meals = getFromLocalStorage('nutritrack_meals', {
            breakfast: [], lunch: [], dinner: [], snacks: []
        });

        calories = {
            breakfast: meals.breakfast.reduce((sum, item) => sum + (item.calories || 0), 0),
            lunch: meals.lunch.reduce((sum, item) => sum + (item.calories || 0), 0),
            dinner: meals.dinner.reduce((sum, item) => sum + (item.calories || 0), 0),
            snacks: meals.snacks.reduce((sum, item) => sum + (item.calories || 0), 0)
        };

        recentMeals = [
            ...meals.breakfast,
            ...meals.lunch,
            ...meals.dinner,
            ...meals.snacks
        ].reverse().slice(0, 4);
    }

    // Calculate totals
    const totalCalories = Object.values(calories).reduce((a, b) => a + b, 0);

    // Update UI
    updateCaloriesUI(totalCalories, goalCalories);
    updateDailyChart(calories);
    updateRecentFoods(recentMeals);
}

// Load weekly progress chart
async function loadWeeklyChart() {
    let weeklyData = defaultWeeklyData;

    try {
        const data = await progressAPI.getWeekly();
        if (data.success && data.progress) {
            weeklyData = {
                labels: data.progress.map(d => d.day || d.date),
                calories: data.progress.map(d => d.calories || 0)
            };
        }
    } catch (error) {
        console.log('Using default weekly data');
    }

    renderWeeklyChart(weeklyData);
}

// Update calories display
function updateCaloriesUI(total, goal) {
    const todayCaloriesEl = document.getElementById('todayCalories');
    const progressEl = document.getElementById('caloriesProgress');
    const centerEl = document.getElementById('dailyChartCenter');

    if (todayCaloriesEl) todayCaloriesEl.textContent = formatNumber(total);
    if (progressEl) progressEl.style.width = Math.min((total / goal) * 100, 100) + '%';
    if (centerEl) centerEl.textContent = formatNumber(total);
}

// Update recent foods list
function updateRecentFoods(meals) {
    const recentFoodsEl = document.getElementById('recentFoods');
    if (!recentFoodsEl) return;

    if (meals.length === 0) {
        recentFoodsEl.innerHTML = '<div class="text-gray col-span-2 text-center py-4">ยังไม่มีรายการอาหารวันนี้</div>';
    } else {
        recentFoodsEl.innerHTML = meals.map(food => `
            <div class="food-card">
                <div class="food-card-content p-3">
                    <h3 class="food-card-title text-base">${food.name || food.food_name || 'ไม่ระบุชื่อ'}</h3>
                    <p class="food-card-category text-xs">${food.category || 'ทั่วไป'}</p>
                    <span class="food-card-calories text-sm">${food.calories || 0} kcal</span>
                </div>
            </div>
        `).join('');
    }
}

// Render daily doughnut chart
function updateDailyChart(calories) {
    const dailyCtx = document.getElementById('dailyChart');
    if (!dailyCtx) return;

    new Chart(dailyCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['🌅 เช้า', '☀️ กลางวัน', '🌙 เย็น', '🍿 ของว่าง'],
            datasets: [{
                data: [calories.breakfast, calories.lunch, calories.dinner, calories.snacks],
                backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 12, family: "'Inter', sans-serif", weight: '500' },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        boxWidth: 8,
                        color: '#4b5563'
                    }
                },
                tooltip: { enabled: false }
            },
            layout: { padding: 20 }
        }
    });
}

// Render weekly line chart
function renderWeeklyChart(data) {
    const ctx = document.getElementById('caloriesChart');
    if (!ctx) return;

    const context = ctx.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.4)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0.0)');

    new Chart(context, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'แคลอรี่',
                data: data.calories,
                borderColor: '#22c55e',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 6,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#22c55e',
                pointBorderWidth: 3,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#1f2937',
                    bodyColor: '#22c55e',
                    bodyFont: { size: 14, weight: 'bold' },
                    padding: 12,
                    cornerRadius: 12,
                    displayColors: false,
                    callbacks: {
                        label: ctx => ctx.parsed.y + ' kcal'
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 12 }, color: '#6b7280' }
                },
                y: {
                    beginAtZero: false,
                    min: 1500,
                    max: 2500,
                    grid: { color: '#f3f4f6', borderDash: [5, 5] },
                    ticks: { font: { size: 11 }, color: '#9ca3af' },
                    border: { display: false }
                }
            },
            interaction: { mode: 'index', intersect: false }
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initDashboard);
