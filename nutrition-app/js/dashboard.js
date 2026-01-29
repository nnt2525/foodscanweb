// ========================================
// Dashboard Page - NutriTrack
// ========================================

// Check auth
if (!requireAuth()) throw new Error('Not authorized');

// Set greeting
const user = getCurrentUser();
document.getElementById('greeting').textContent = `${getGreeting()}, ${user.name}!`;

// Get Summary Data from LocalStorage (Real Data)
const meals = getFromLocalStorage('nutritrack_meals', { breakfast: [], lunch: [], dinner: [], snacks: [] });

// Calculate totals
const calories = {
    breakfast: meals.breakfast.reduce((sum, item) => sum + item.calories, 0),
    lunch: meals.lunch.reduce((sum, item) => sum + item.calories, 0),
    dinner: meals.dinner.reduce((sum, item) => sum + item.calories, 0),
    snacks: meals.snacks.reduce((sum, item) => sum + item.calories, 0)
};
const totalCalories = Object.values(calories).reduce((a, b) => a + b, 0);
const goalCalories = 2000;

// Update UI stats
document.getElementById('todayCalories').textContent = formatNumber(totalCalories);
document.getElementById('caloriesProgress').style.width = Math.min((totalCalories / goalCalories) * 100, 100) + '%';

// Update doughnut center text
document.getElementById('dailyChartCenter').textContent = formatNumber(totalCalories);

// Render recent foods
const recentFoodsEl = document.getElementById('recentFoods');
const allMeals = [
    ...meals.breakfast,
    ...meals.lunch,
    ...meals.dinner,
    ...meals.snacks
].reverse().slice(0, 4);

if (allMeals.length === 0) {
    recentFoodsEl.innerHTML = '<div class="text-gray col-span-2 text-center py-4">ยังไม่มีรายการอาหารวันนี้</div>';
} else {
    recentFoodsEl.innerHTML = '';
    allMeals.forEach(food => {
        const category = food.category || 'ทั่วไป';
        recentFoodsEl.innerHTML += `
            <div class="food-card">
                <div class="food-card-content p-3">
                    <h3 class="food-card-title text-base">${food.name}</h3>
                    <p class="food-card-category text-xs">${category}</p>
                    <span class="food-card-calories text-sm">${food.calories} kcal</span>
                </div>
            </div>
        `;
    });
}

// Chart (Weekly - Keep Mock for now as we don't have history storage yet)
const ctx = document.getElementById('caloriesChart').getContext('2d');

// Create Gradient
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(34, 197, 94, 0.4)');
gradient.addColorStop(1, 'rgba(34, 197, 94, 0.0)');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: mockProgressData.labels,
        datasets: [{
            label: 'แคลอรี่',
            data: mockProgressData.calories,
            borderColor: '#22c55e',
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 6,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#22c55e',
            pointBorderWidth: 3,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#22c55e',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1f2937',
                bodyColor: '#22c55e',
                bodyFont: { size: 14, weight: 'bold' },
                titleFont: { size: 13 },
                padding: 12,
                cornerRadius: 12,
                borderColor: 'rgba(0,0,0,0.05)',
                borderWidth: 1,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return context.parsed.y + ' kcal';
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 12, family: "'Inter', sans-serif" },
                    color: '#6b7280'
                }
            },
            y: {
                beginAtZero: false,
                min: 1500,
                max: 2500,
                grid: {
                    color: '#f3f4f6',
                    borderDash: [5, 5]
                },
                ticks: {
                    font: { size: 11, family: "'Inter', sans-serif" },
                    color: '#9ca3af',
                    callback: value => value
                },
                border: { display: false }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    }
});

// Daily Chart (Real Data)
const dailyCtx = document.getElementById('dailyChart').getContext('2d');
new Chart(dailyCtx, {
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
            tooltip: {
                enabled: false
            }
        },
        layout: {
            padding: 20
        }
    }
});
