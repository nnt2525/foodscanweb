// ========================================
// Barcode Scanner - NutriTrack
// ========================================

if (!requireAuth()) throw new Error('Not authorized');

let videoStream = null;
let currentFood = null;

// Start camera
async function startCamera() {
    const video = document.getElementById('video');
    const noCamera = document.getElementById('noCamera');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');

    try {
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // ใช้กล้องหลัง
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        video.srcObject = videoStream;
        video.classList.remove('hidden');
        noCamera.classList.add('hidden');
        startBtn.disabled = true;
        stopBtn.disabled = false;

        showNotification('เปิดกล้องแล้ว - เล็งไปที่บาร์โค้ด', 'success');

        // Start scanning loop (simulated - in real app would use barcode library)
        startScanningLoop();

    } catch (error) {
        console.error('Camera error:', error);
        video.classList.add('hidden');
        noCamera.classList.remove('hidden');
        showNotification('ไม่สามารถเปิดกล้องได้', 'error');
    }
}

// Stop camera
function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }

    const video = document.getElementById('video');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');

    video.srcObject = null;
    startBtn.disabled = false;
    stopBtn.disabled = true;

    showNotification('ปิดกล้องแล้ว', 'info');
}

// Simulated scanning loop
// In production, use a library like QuaggaJS or ZXing
function startScanningLoop() {
    // This is a placeholder for actual barcode detection
    // Real implementation would use canvas to capture frames
    // and process them with a barcode detection library

    // For demo purposes, we'll just use manual input
    console.log('Scanning started - use manual input for demo');
}

// Search barcode in database
async function searchBarcode() {
    const barcode = document.getElementById('barcodeInput').value.trim();

    if (!barcode) {
        showNotification('กรุณาใส่เลขบาร์โค้ด', 'warning');
        return;
    }

    // Hide previous results
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('notFoundSection').classList.add('hidden');

    showNotification('กำลังค้นหา...', 'info');

    try {
        // Search in our database by barcode
        const response = await api.get(`/foods?barcode=${barcode}`);

        if (response.success && response.data && response.data.length > 0) {
            currentFood = response.data[0];
            displayResult(currentFood);
        } else {
            // Try searching in USDA or other sources
            showNotFound(barcode);
        }
    } catch (error) {
        console.error('Search error:', error);

        // Fallback: check mock data
        const mockFood = getMockFoodByBarcode(barcode);
        if (mockFood) {
            currentFood = mockFood;
            displayResult(mockFood);
        } else {
            showNotFound(barcode);
        }
    }
}

// Mock barcode database for demo
function getMockFoodByBarcode(barcode) {
    const mockBarcodes = {
        '8850329112108': { name: 'นมสดโฟร์โมสต์', calories: 150, protein: 8, carbs: 12, fat: 8 },
        '8851959132012': { name: 'น้ำดื่มสิงห์', calories: 0, protein: 0, carbs: 0, fat: 0 },
        '8858891303231': { name: 'โยเกิร์ตดัชชี่', calories: 120, protein: 4, carbs: 20, fat: 3 },
        '8850999220017': { name: 'มาม่าต้มยำกุ้ง', calories: 350, protein: 8, carbs: 50, fat: 12 },
        '8850329102109': { name: 'นมถั่วเหลืองแลคตาซอย', calories: 140, protein: 6, carbs: 18, fat: 5 },
        '8851123312025': { name: 'ขนมปังฟาร์มเฮ้าส์', calories: 80, protein: 3, carbs: 15, fat: 1 },
        '8850999220123': { name: 'มาม่าหมูสับ', calories: 340, protein: 7, carbs: 48, fat: 13 },
        '8858998581112': { name: 'กาแฟเนสกาแฟ 3in1', calories: 90, protein: 1, carbs: 17, fat: 2 }
    };

    return mockBarcodes[barcode] ? { ...mockBarcodes[barcode], barcode } : null;
}

// Display search result
function displayResult(food) {
    document.getElementById('resultName').textContent = food.name;
    document.getElementById('resultBarcode').textContent = `บาร์โค้ด: ${food.barcode || '-'}`;
    document.getElementById('resultCalories').textContent = food.calories || 0;
    document.getElementById('resultProtein').textContent = `${food.protein || 0}g`;
    document.getElementById('resultCarbs').textContent = `${food.carbs || 0}g`;
    document.getElementById('resultFat').textContent = `${food.fat || 0}g`;

    document.getElementById('resultSection').classList.remove('hidden');
    document.getElementById('notFoundSection').classList.add('hidden');

    showNotification(`พบ: ${food.name}`, 'success');
}

// Show not found message
function showNotFound(barcode) {
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('notFoundSection').classList.remove('hidden');

    showNotification(`ไม่พบบาร์โค้ด: ${barcode}`, 'warning');
}

// Add scanned food to meal
function addToMeal() {
    if (!currentFood) {
        showNotification('ไม่มีข้อมูลอาหาร', 'error');
        return;
    }

    const meals = getFromLocalStorage('nutritrack_meals', {
        breakfast: [], lunch: [], dinner: [], snacks: []
    });

    // Determine meal type based on time
    const hour = new Date().getHours();
    let mealType = 'snacks';
    if (hour < 10) mealType = 'breakfast';
    else if (hour < 14) mealType = 'lunch';
    else if (hour < 20) mealType = 'dinner';

    const mealNames = {
        breakfast: 'มื้อเช้า',
        lunch: 'มื้อกลางวัน',
        dinner: 'มื้อเย็น',
        snacks: 'ของว่าง'
    };

    meals[mealType].push({
        id: Date.now(),
        name: currentFood.name,
        calories: currentFood.calories || 0,
        protein: currentFood.protein || 0,
        carbs: currentFood.carbs || 0,
        fat: currentFood.fat || 0,
        barcode: currentFood.barcode,
        addedAt: new Date().toISOString()
    });

    saveToLocalStorage('nutritrack_meals', meals);
    showNotification(`เพิ่ม ${currentFood.name} ลง${mealNames[mealType]}แล้ว!`, 'success');

    // Reset
    currentFood = null;
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('barcodeInput').value = '';
}

// Navigate to add new food page
function addNewFood() {
    window.location.href = 'planner.html';
}

// Cleanup on page leave
window.addEventListener('beforeunload', () => {
    stopCamera();
});
