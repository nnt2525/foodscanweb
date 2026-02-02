// ========================================
// Weight Tracker - NutriTrack
// ========================================

if (!requireAuth()) throw new Error('Not authorized');

let weightHistory = [];
let weightChart = null;

// Initialize
function initWeightTracker() {
    loadWeightHistory();
    renderAll();
}

// Load weight history from localStorage
function loadWeightHistory() {
    weightHistory = getFromLocalStorage('nutritrack_weight_history', []);
    // Sort by date descending
    weightHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Save weight history
function saveWeightHistory() {
    saveToLocalStorage('nutritrack_weight_history', weightHistory);
}

// Add new weight entry
function addWeight() {
    const input = document.getElementById('weightInput');
    const weight = parseFloat(input.value);

    if (!weight || weight < 20 || weight > 300) {
        showNotification('กรุณากรอกน้ำหนักที่ถูกต้อง (20-300 kg)', 'warning');
        return;
    }

    const today = new Date().toISOString().split('T')[0];

    // Check if already logged today
    const todayIndex = weightHistory.findIndex(w => w.date === today);
    if (todayIndex !== -1) {
        // Update existing entry
        weightHistory[todayIndex].weight = weight;
        showNotification('อัปเดตน้ำหนักวันนี้แล้ว!', 'success');
    } else {
        // Add new entry
        weightHistory.unshift({
            date: today,
            weight: weight,
            timestamp: new Date().toISOString()
        });
        showNotification('บันทึกน้ำหนักสำเร็จ!', 'success');
    }

    // Update user profile weight
    const profile = getFromLocalStorage('nutritrack_profile', {});
    profile.weight = weight;
    saveToLocalStorage('nutritrack_profile', profile);

    saveWeightHistory();
    input.value = '';
    renderAll();
}

// Delete weight entry
function deleteWeight(date) {
    weightHistory = weightHistory.filter(w => w.date !== date);
    saveWeightHistory();
    renderAll();
    showNotification('ลบข้อมูลแล้ว', 'info');
}

// Clear all history
function clearHistory() {
    if (!confirm('ต้องการลบประวัติทั้งหมดหรือไม่?')) return;

    weightHistory = [];
    saveWeightHistory();
    renderAll();
    showNotification('ลบประวัติทั้งหมดแล้ว', 'info');
}

// Render all components
function renderAll() {
    renderCurrentWeight();
    renderChart();
    renderHistory();
}

// Render current weight display
function renderCurrentWeight() {
    const noData = document.getElementById('noData');
    const hasData = document.getElementById('hasData');
    const currentEl = document.getElementById('currentWeight');
    const changeEl = document.getElementById('weightChange');
    const lastUpdateEl = document.getElementById('lastUpdate');

    if (weightHistory.length === 0) {
        noData.classList.remove('hidden');
        hasData.classList.add('hidden');
        return;
    }

    noData.classList.add('hidden');
    hasData.classList.remove('hidden');

    const latest = weightHistory[0];
    currentEl.textContent = latest.weight.toFixed(1);

    // Calculate change from previous entry
    if (weightHistory.length >= 2) {
        const previous = weightHistory[1];
        const change = latest.weight - previous.weight;

        if (change < -0.1) {
            changeEl.className = 'weight-change down';
            changeEl.innerHTML = `<span>↓</span> <span>${Math.abs(change).toFixed(1)} kg</span>`;
        } else if (change > 0.1) {
            changeEl.className = 'weight-change up';
            changeEl.innerHTML = `<span>↑</span> <span>+${change.toFixed(1)} kg</span>`;
        } else {
            changeEl.className = 'weight-change same';
            changeEl.innerHTML = `<span>→</span> <span>ไม่เปลี่ยนแปลง</span>`;
        }
    } else {
        changeEl.className = 'weight-change same';
        changeEl.innerHTML = `<span>→</span> <span>เริ่มต้นบันทึก</span>`;
    }

    // Format last update date
    const date = new Date(latest.date);
    lastUpdateEl.textContent = `อัปเดตเมื่อ: ${date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}`;
}

// Render weight chart
function renderChart() {
    const ctx = document.getElementById('weightChart');
    if (!ctx) return;

    // Get last 30 days of data
    const data = weightHistory.slice(0, 30).reverse();

    if (data.length === 0) {
        if (weightChart) {
            weightChart.destroy();
            weightChart = null;
        }
        return;
    }

    const labels = data.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    });

    const weights = data.map(d => d.weight);

    // Calculate min/max for better visualization
    const minWeight = Math.min(...weights) - 2;
    const maxWeight = Math.max(...weights) + 2;

    if (weightChart) {
        weightChart.destroy();
    }

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');

    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'น้ำหนัก (kg)',
                data: weights,
                borderColor: '#22c55e',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#22c55e',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
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
                    bodyFont: { size: 16, weight: 'bold' },
                    padding: 12,
                    cornerRadius: 12,
                    callbacks: {
                        label: ctx => ctx.parsed.y.toFixed(1) + ' kg'
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 }, maxRotation: 45 }
                },
                y: {
                    min: minWeight,
                    max: maxWeight,
                    grid: { color: '#f3f4f6', borderDash: [5, 5] },
                    border: { display: false },
                    ticks: {
                        callback: value => value.toFixed(1) + ' kg'
                    }
                }
            },
            interaction: { mode: 'index', intersect: false }
        }
    });
}

// Render history list
function renderHistory() {
    const container = document.getElementById('historyList');

    if (weightHistory.length === 0) {
        container.innerHTML = '<p class="text-gray text-center py-4">ไม่มีประวัติการบันทึก</p>';
        return;
    }

    container.innerHTML = weightHistory.slice(0, 30).map(entry => {
        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString('th-TH', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="history-item">
                <div>
                    <div class="history-weight">${entry.weight.toFixed(1)} kg</div>
                    <div class="history-date">${dateStr}</div>
                </div>
                <button onclick="deleteWeight('${entry.date}')" class="delete-btn btn btn-ghost btn-sm text-red-500">
                    🗑️
                </button>
            </div>
        `;
    }).join('');
}

// Initialize on load
initWeightTracker();
