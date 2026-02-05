// ========================================
// Progress Page - NutriTrack
// Connected to Backend API
// ========================================

if (!requireAuth()) throw new Error('Not authorized');

// Default data for charts
const defaultWeeklyData = {
    labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
    calories: [0, 0, 0, 0, 0, 0, 0]
};

const defaultAchievements = [
    { icon: '🎯', name: 'เริ่มต้นดี', description: 'บันทึกอาหารครบ 7 วัน', unlocked: false },
    { icon: '🔥', name: 'ติดเทรนด์', description: 'บันทึกติดต่อกัน 14 วัน', unlocked: false },
    { icon: '💪', name: 'โปรตีนจัดเต็ม', description: 'กินโปรตีนครบเป้า 7 วัน', unlocked: false },
    { icon: '🥗', name: 'กินคลีน', description: 'กินผักทุกวันใน 1 สัปดาห์', unlocked: false },
    { icon: '⚖️', name: 'สมดุลสุด', description: 'แคลอรี่ตรงเป้า ±10%', unlocked: false },
    { icon: '🏆', name: 'แชมป์เปี้ยน', description: 'ติดอันดับ 1 ของสัปดาห์', unlocked: false }
];

let weeklyData = null;
let caloriesChart = null;
let nutrientsChart = null;

// Initialize
async function initProgress() {
    await loadWeeklyData();
    await loadAchievements();
}

// Load weekly data from API
async function loadWeeklyData() {
    try {
        const response = await progressAPI.getWeekly();

        if (response.success && response.data) {
            weeklyData = response.data;
            updateStats(weeklyData);
            renderCaloriesChart(weeklyData.daily);
            renderNutrientsChart(weeklyData.totals);
        } else {
            // Use default/fallback data
            renderCaloriesChart([]);
            renderNutrientsChart({ protein: 0, carbs: 0, fat: 0 });
        }
    } catch (error) {
        console.log('API failed, showing empty data');
        renderCaloriesChart([]);
        renderNutrientsChart({ protein: 0, carbs: 0, fat: 0 });
        updateStatsWithZeros();
    }
}

// Update stats display
function updateStats(data) {
    const totalCalEl = document.getElementById('totalCaloriesWeek');
    const avgCalEl = document.getElementById('avgCaloriesWeek');
    const daysOnTargetEl = document.getElementById('daysOnTargetWeek');
    const badgesEl = document.getElementById('totalBadgesWeek');

    if (totalCalEl) totalCalEl.textContent = formatNumber(data.totals?.calories || 0);
    if (avgCalEl) avgCalEl.textContent = formatNumber(data.avgCalories || 0);
    if (daysOnTargetEl) daysOnTargetEl.textContent = data.daysOnTarget || 0;
    if (badgesEl) badgesEl.textContent = data.badges || 0;
}

function updateStatsWithZeros() {
    // Initialize with zeros when no data available
    const ids = ['totalCaloriesWeek', 'avgCaloriesWeek', 'daysOnTargetWeek', 'totalBadgesWeek'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0';
    });
}

// Render calories bar chart
function renderCaloriesChart(dailyData) {
    const ctx = document.getElementById('caloriesChart')?.getContext('2d');
    if (!ctx) return;

    const labels = [];
    const calories = [];

    // Get last 7 days
    const days = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(days[date.getDay()]);

        // Find data for this date
        const dateStr = date.toISOString().split('T')[0];
        const dayData = dailyData.find(d => d.date === dateStr);
        calories.push(dayData ? dayData.calories : 0);
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#22c55e');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0.6)');

    if (caloriesChart) caloriesChart.destroy();

    caloriesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'แคลอรี่',
                data: calories,
                backgroundColor: gradient,
                borderRadius: 8,
                barThickness: 40
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
                    callbacks: {
                        label: ctx => ctx.parsed.y + ' kcal'
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { family: "'Inter', sans-serif" } }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: '#f3f4f6', borderDash: [5, 5] },
                    border: { display: false }
                }
            }
        }
    });
}

// Render nutrients doughnut chart
function renderNutrientsChart(totals) {
    const ctx = document.getElementById('nutrientsChart');
    if (!ctx) return;

    const protein = totals.protein || 49;
    const carbs = totals.carbs || 265;
    const fat = totals.fat || 66;

    if (nutrientsChart) nutrientsChart.destroy();

    nutrientsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['คาร์โบไฮเดรต', 'โปรตีน', 'ไขมัน'],
            datasets: [{
                data: [carbs, protein, fat],
                backgroundColor: ['#f59e0b', '#3b82f6', '#8b5cf6'],
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
                        boxWidth: 8
                    }
                },
                tooltip: { enabled: false }
            },
            layout: { padding: 20 }
        }
    });
}

// Load achievements from API
async function loadAchievements() {
    let achievementsList = defaultAchievements;

    try {
        const response = await progressAPI.getAchievements();
        if (response.success && response.data && response.data.length > 0) {
            // Map API data to our format
            achievementsList = response.data.map(a => ({
                icon: a.icon || '🏆',
                name: a.name,
                description: a.description,
                unlocked: true
            }));
        }
    } catch (error) {
        console.log('Using default achievements');
    }

    renderAchievements(achievementsList);
}

// Render achievements
function renderAchievements(achievements) {
    const container = document.getElementById('achievementsList');
    if (!container) return;

    container.innerHTML = achievements.map(a => `
        <div class="text-center" style="padding:1.5rem;background:${a.unlocked ? 'var(--primary-50)' : 'var(--gray-100)'};border-radius:1rem;opacity:${a.unlocked ? 1 : 0.5};">
            <div class="text-4xl mb-2">${a.icon}</div>
            <h3 class="font-bold">${a.name}</h3>
            <p class="text-sm text-gray">${a.description}</p>
            ${a.unlocked ? '<span class="badge badge-green mt-2">ปลดล็อกแล้ว</span>' : '<span class="badge badge-gray mt-2">ยังไม่ปลดล็อก</span>'}
        </div>
    `).join('');
}

// ========================================
// Export Functions
// ========================================

// Export to CSV
function exportToCSV() {
    const user = getCurrentUser();
    const today = new Date().toLocaleDateString('th-TH');

    // Get data for export
    const meals = getFromLocalStorage('nutritrack_meals', { breakfast: [], lunch: [], dinner: [], snacks: [] });

    // Build CSV content
    let csvContent = 'วันที่,มื้อ,ชื่ออาหาร,แคลอรี่,โปรตีน,คาร์บส,ไขมัน\n';

    const mealTypes = {
        breakfast: 'มื้อเช้า',
        lunch: 'มื้อกลางวัน',
        dinner: 'มื้อเย็น',
        snacks: 'ของว่าง'
    };

    Object.keys(meals).forEach(mealType => {
        meals[mealType].forEach(food => {
            csvContent += `${today},${mealTypes[mealType]},${food.name},${food.calories || 0},${food.protein || 0},${food.carbs || 0},${food.fat || 0}\n`;
        });
    });

    // Add summary
    const totalCalories = Object.values(meals).flat().reduce((sum, f) => sum + (f.calories || 0), 0);
    const totalProtein = Object.values(meals).flat().reduce((sum, f) => sum + (f.protein || 0), 0);
    const totalCarbs = Object.values(meals).flat().reduce((sum, f) => sum + (f.carbs || 0), 0);
    const totalFat = Object.values(meals).flat().reduce((sum, f) => sum + (f.fat || 0), 0);

    csvContent += `\n${today},รวม,-,${totalCalories},${totalProtein},${totalCarbs},${totalFat}\n`;

    // Download file
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `NutriTrack_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showNotification('ดาวน์โหลด CSV สำเร็จ!', 'success');
}

// Export to PDF (using browser print)
function exportToPDF() {
    const user = getCurrentUser();
    const today = new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Get data
    const meals = getFromLocalStorage('nutritrack_meals', { breakfast: [], lunch: [], dinner: [], snacks: [] });
    const totalCalories = Object.values(meals).flat().reduce((sum, f) => sum + (f.calories || 0), 0);
    const totalProtein = Object.values(meals).flat().reduce((sum, f) => sum + (f.protein || 0), 0);
    const totalCarbs = Object.values(meals).flat().reduce((sum, f) => sum + (f.carbs || 0), 0);
    const totalFat = Object.values(meals).flat().reduce((sum, f) => sum + (f.fat || 0), 0);

    // Create printable HTML
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>NutriTrack Report - ${today}</title>
            <style>
                * { font-family: 'Segoe UI', Tahoma, sans-serif; }
                body { padding: 40px; max-width: 800px; margin: 0 auto; }
                h1 { color: #22c55e; border-bottom: 3px solid #22c55e; padding-bottom: 10px; }
                h2 { color: #333; margin-top: 30px; }
                .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
                .stat { background: #f9fafb; padding: 20px; border-radius: 10px; text-align: center; }
                .stat-value { font-size: 28px; font-weight: bold; color: #22c55e; }
                .stat-label { color: #6b7280; font-size: 14px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
                th { background: #f3f4f6; font-weight: 600; }
                .meal-header { background: #22c55e; color: white; font-weight: bold; }
                .footer { margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px; }
                @media print { body { padding: 20px; } }
            </style>
        </head>
        <body>
            <h1>🥗 รายงานโภชนาการ NutriTrack</h1>
            <p><strong>ชื่อ:</strong> ${user?.name || 'ผู้ใช้'} | <strong>วันที่:</strong> ${today}</p>
            
            <h2>📊 สรุปโภชนาการวันนี้</h2>
            <div class="summary">
                <div class="stat">
                    <div class="stat-value">${formatNumber(totalCalories)}</div>
                    <div class="stat-label">แคลอรี่ (kcal)</div>
                </div>
                <div class="stat">
                    <div class="stat-value" style="color: #3b82f6;">${totalProtein}g</div>
                    <div class="stat-label">โปรตีน</div>
                </div>
                <div class="stat">
                    <div class="stat-value" style="color: #f59e0b;">${totalCarbs}g</div>
                    <div class="stat-label">คาร์โบไฮเดรต</div>
                </div>
                <div class="stat">
                    <div class="stat-value" style="color: #8b5cf6;">${totalFat}g</div>
                    <div class="stat-label">ไขมัน</div>
                </div>
            </div>
            
            <h2>🍽️ รายละเอียดมื้ออาหาร</h2>
            <table>
                <thead>
                    <tr>
                        <th>ชื่ออาหาร</th>
                        <th>แคลอรี่</th>
                        <th>โปรตีน</th>
                        <th>คาร์บส</th>
                        <th>ไขมัน</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateMealRows(meals)}
                </tbody>
            </table>
            
            <div class="footer">
                <p>สร้างโดย NutriTrack - ระบบจัดการโภชนาการอัจฉริยะ</p>
                <p>วันที่พิมพ์: ${new Date().toLocaleString('th-TH')}</p>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();

    // Wait for content to load then print
    setTimeout(() => {
        printWindow.print();
    }, 500);

    showNotification('เปิดหน้าต่างพิมพ์ PDF แล้ว!', 'success');
}

// Helper function for PDF meal rows
function generateMealRows(meals) {
    const mealTypes = {
        breakfast: '🌅 มื้อเช้า',
        lunch: '☀️ มื้อกลางวัน',
        dinner: '🌙 มื้อเย็น',
        snacks: '🍿 ของว่าง'
    };

    let rows = '';

    Object.keys(mealTypes).forEach(type => {
        if (meals[type] && meals[type].length > 0) {
            rows += `<tr class="meal-header"><td colspan="5">${mealTypes[type]}</td></tr>`;
            meals[type].forEach(food => {
                rows += `
                    <tr>
                        <td>${food.name}</td>
                        <td>${food.calories || 0} kcal</td>
                        <td>${food.protein || 0}g</td>
                        <td>${food.carbs || 0}g</td>
                        <td>${food.fat || 0}g</td>
                    </tr>
                `;
            });
        }
    });

    if (!rows) {
        rows = '<tr><td colspan="5" style="text-align:center;color:#9ca3af;">ไม่มีรายการอาหารวันนี้</td></tr>';
    }

    return rows;
}

// ========================================
// Social Sharing
// ========================================
function shareCurrentProgress() {
    // Get current stats from the page
    const totalCalories = weeklyData?.totals?.calories || 13800;
    const avgCalories = weeklyData?.totals?.avgCalories || 1971;
    const protein = weeklyData?.totals?.protein || 490;
    const carbs = weeklyData?.totals?.carbs || 1260;
    const fat = weeklyData?.totals?.fat || 420;
    const goalDays = weeklyData?.goalDays || 5;

    const user = getCurrentUser();
    const calorieGoal = user?.daily_calories || 2000;

    shareProgress({
        calories: avgCalories,
        calorieGoal: calorieGoal,
        protein: Math.round(protein / 7),
        carbs: Math.round(carbs / 7),
        fat: Math.round(fat / 7)
    });
}

// Initialize on load
initProgress();

