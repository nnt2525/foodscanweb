// ========================================
// Profile Page - NutriTrack
// Connected to Backend API
// ========================================

if (!requireAuth()) throw new Error('Not authorized');

// Initialize page
async function initProfilePage() {
    await loadUserProfile();
}

// Load user profile from API or cache
async function loadUserProfile() {
    let user = getCurrentUser();

    // Try to fetch fresh data from API
    try {
        const freshUser = await fetchUserProfile();
        if (freshUser) {
            user = freshUser;
        }
    } catch (error) {
        console.log('Using cached user data');
    }

    if (!user) {
        logout();
        return;
    }

    // Display user info
    document.getElementById('userName').textContent = user.name || 'ผู้ใช้';
    document.getElementById('userEmail').textContent = user.email || '';
    document.getElementById('joinDate').textContent = user.created_at
        ? new Date(user.created_at).toLocaleDateString('th-TH')
        : new Date().toLocaleDateString('th-TH');

    // Load profile form
    const profile = user.profile || {};
    document.getElementById('weight').value = profile.weight || '';
    document.getElementById('height').value = profile.height || '';
    document.getElementById('age').value = profile.age || '';
    document.getElementById('gender').value = profile.gender || '';
    document.getElementById('activity').value = profile.activity || 'sedentary';
    document.getElementById('goal').value = profile.goal || 'maintain';

    updateStats();
}

// Save profile to API
async function saveProfile(e) {
    e.preventDefault();

    const data = {
        weight: parseFloat(document.getElementById('weight').value),
        height: parseFloat(document.getElementById('height').value),
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        activity: document.getElementById('activity').value,
        goal: document.getElementById('goal').value
    };

    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'กำลังบันทึก...';
    submitBtn.disabled = true;

    try {
        const result = await updateProfile(data);
        if (result.success) {
            showNotification('บันทึกข้อมูลแล้ว!', 'success');
        } else {
            showNotification(result.message || 'เกิดข้อผิดพลาด', 'error');
        }
    } catch (error) {
        showNotification('ไม่สามารถบันทึกได้', 'error');
    }

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    updateStats();
}

// Update BMI and calorie stats
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

// Initialize
initProfilePage();
