// ========================================
// Progress Page - NutriTrack
// ========================================

if (!requireAuth()) throw new Error('Not authorized');

// Calories Chart (Bar)
const barCtx = document.getElementById('caloriesChart').getContext('2d');
const barGradient = barCtx.createLinearGradient(0, 0, 0, 400);
barGradient.addColorStop(0, '#22c55e');
barGradient.addColorStop(1, 'rgba(34, 197, 94, 0.6)');

new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: mockProgressData.labels,
        datasets: [{
            label: 'แคลอรี่',
            data: mockProgressData.calories,
            backgroundColor: barGradient,
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
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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
                beginAtZero: false,
                min: 1000,
                grid: { color: '#f3f4f6', borderDash: [5, 5] },
                border: { display: false }
            }
        }
    }
});

// Nutrients Chart (Doughnut)
new Chart(document.getElementById('nutrientsChart'), {
    type: 'doughnut',
    data: {
        labels: ['คาร์โบไฮเดรต', 'โปรตีน', 'ไขมัน'],
        datasets: [{
            data: [265, 49, 66],
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

// Achievements
document.getElementById('achievementsList').innerHTML = achievements.map(a => `
    <div class="text-center" style="padding:1.5rem;background:${a.unlocked ? 'var(--primary-50)' : 'var(--gray-100)'};border-radius:1rem;opacity:${a.unlocked ? 1 : 0.5};">
        <div class="text-4xl mb-2">${a.icon}</div>
        <h3 class="font-bold">${a.name}</h3>
        <p class="text-sm text-gray">${a.description}</p>
        ${a.unlocked ? '<span class="badge badge-green mt-2">ปลดล็อกแล้ว</span>' : '<span class="badge badge-gray mt-2">ยังไม่ปลดล็อก</span>'}
    </div>
`).join('');
