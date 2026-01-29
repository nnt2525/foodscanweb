// ========================================
// Profile Page - NutriTrack
// ========================================

if (!requireAuth()) throw new Error('Not authorized');

const user = getCurrentUser();
document.getElementById('userName').textContent = user.name;
document.getElementById('userEmail').textContent = user.email;
document.getElementById('joinDate').textContent = new Date(user.createdAt).toLocaleDateString('th-TH');

// Load existing profile
if (user.profile) {
    document.getElementById('weight').value = user.profile.weight || '';
    document.getElementById('height').value = user.profile.height || '';
    document.getElementById('age').value = user.profile.age || '';
    document.getElementById('gender').value = user.profile.gender || '';
    document.getElementById('activity').value = user.profile.activity || 'sedentary';
    document.getElementById('goal').value = user.profile.goal || 'maintain';
    updateStats();
}

function saveProfile(e) {
    e.preventDefault();
    const data = {
        weight: parseFloat(document.getElementById('weight').value),
        height: parseFloat(document.getElementById('height').value),
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        activity: document.getElementById('activity').value,
        goal: document.getElementById('goal').value
    };

    updateProfile(data);
    updateStats();
    showNotification('บันทึกข้อมูลแล้ว!', 'success');
}

function updateStats() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const activity = document.getElementById('activity').value;
    const goal = document.getElementById('goal').value;

    if (weight && height && age && gender) {
        // BMI
        const bmi = calculateBMI(weight, height);
        const bmiStatus = getBMIStatus(bmi);

        document.getElementById('resultsSection').style.display = 'grid';
        document.getElementById('bmiValue').textContent = bmi;
        document.getElementById('bmiStatus').textContent = bmiStatus.label;
        document.getElementById('bmiStatus').style.background = bmiStatus.color;
        document.getElementById('bmiStatus').style.color = 'white';

        // Calories
        const bmr = calculateBMR(weight, height, age, gender);
        const tdee = calculateTDEE(bmr, activity);
        const recommended = calculateRecommendedCalories(tdee, goal);

        document.getElementById('calorieValue').textContent = formatNumber(recommended);
    }
}
