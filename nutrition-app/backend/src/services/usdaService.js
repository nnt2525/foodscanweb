// ========================================
// USDA FoodData Central API Service
// https://fdc.nal.usda.gov/api-guide.html
// ========================================

const axios = require('axios');

const USDA_API_KEY = process.env.USDA_API_KEY;
const USDA_API_URL = process.env.USDA_API_URL || 'https://api.nal.usda.gov/fdc/v1';

// ========================================
// Search Foods in USDA Database
// ========================================
async function searchFoods(query, options = {}) {
    const {
        pageSize = 25,
        pageNumber = 1,
        dataType = ['Survey (FNDDS)', 'SR Legacy', 'Foundation']
    } = options;

    try {
        const response = await axios.post(
            `${USDA_API_URL}/foods/search?api_key=${USDA_API_KEY}`,
            {
                query,
                pageSize,
                pageNumber,
                dataType,
                sortBy: 'dataType.keyword',
                sortOrder: 'asc'
            }
        );

        return {
            success: true,
            foods: response.data.foods.map(mapUSDAFood),
            totalHits: response.data.totalHits,
            currentPage: response.data.currentPage,
            totalPages: response.data.totalPages
        };
    } catch (error) {
        console.error('USDA search error:', error.response?.data || error.message);
        return {
            success: false,
            message: 'ไม่สามารถค้นหาข้อมูลจาก USDA ได้',
            error: error.message
        };
    }
}

// ========================================
// Get Food Details from USDA
// ========================================
async function getFoodDetails(fdcId) {
    try {
        const response = await axios.get(
            `${USDA_API_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`
        );

        return {
            success: true,
            food: mapUSDAFoodDetails(response.data)
        };
    } catch (error) {
        console.error('USDA get food error:', error.response?.data || error.message);
        return {
            success: false,
            message: 'ไม่สามารถดึงข้อมูลอาหารจาก USDA ได้',
            error: error.message
        };
    }
}

// ========================================
// Get Multiple Foods by IDs
// ========================================
async function getFoodsByIds(fdcIds) {
    try {
        const response = await axios.post(
            `${USDA_API_URL}/foods?api_key=${USDA_API_KEY}`,
            { fdcIds }
        );

        return {
            success: true,
            foods: response.data.map(mapUSDAFoodDetails)
        };
    } catch (error) {
        console.error('USDA get foods error:', error.response?.data || error.message);
        return {
            success: false,
            message: 'ไม่สามารถดึงข้อมูลอาหารจาก USDA ได้',
            error: error.message
        };
    }
}

// ========================================
// Map USDA Food to NutriTrack Format
// ========================================
function mapUSDAFood(usdaFood) {
    const nutrients = extractNutrients(usdaFood.foodNutrients || []);

    return {
        external_id: String(usdaFood.fdcId),
        source: 'usda',
        name_en: usdaFood.description,
        name: usdaFood.description, // Will be translated later
        brand: usdaFood.brandOwner || null,
        category: usdaFood.foodCategory || 'General',
        serving_size: '100g',
        calories: nutrients.calories || 0,
        protein: nutrients.protein || 0,
        carbs: nutrients.carbs || 0,
        fat: nutrients.fat || 0,
        fiber: nutrients.fiber || 0,
        dataType: usdaFood.dataType
    };
}

function mapUSDAFoodDetails(usdaFood) {
    const nutrients = extractAllNutrients(usdaFood.foodNutrients || []);
    const portions = (usdaFood.foodPortions || []).map(p => ({
        name: p.portionDescription || p.modifier || '1 serving',
        grams: p.gramWeight || 100
    }));

    return {
        external_id: String(usdaFood.fdcId),
        source: 'usda',
        name_en: usdaFood.description,
        name: usdaFood.description,
        brand: usdaFood.brandOwner || null,
        category: usdaFood.foodCategory?.description || 'General',
        serving_size: '100g',
        calories: nutrients.ENERGY || 0,
        protein: nutrients.PROTEIN || 0,
        carbs: nutrients.CARBS || 0,
        fat: nutrients.FAT || 0,
        fiber: nutrients.FIBER || 0,
        nutrients: nutrients,
        portions: portions,
        dataType: usdaFood.dataType
    };
}

// ========================================
// Extract Nutrients from USDA Format
// ========================================
function extractNutrients(foodNutrients) {
    const nutrientMap = {
        1008: 'calories',  // Energy
        1003: 'protein',   // Protein
        1005: 'carbs',     // Carbohydrates
        1004: 'fat',       // Total Fat
        1079: 'fiber'      // Fiber
    };

    const result = {};

    foodNutrients.forEach(n => {
        const key = nutrientMap[n.nutrientId];
        if (key) {
            result[key] = Math.round((n.value || 0) * 100) / 100;
        }
    });

    return result;
}

function extractAllNutrients(foodNutrients) {
    // USDA Nutrient ID to our code mapping
    const nutrientMap = {
        1008: 'ENERGY',
        1003: 'PROTEIN',
        1005: 'CARBS',
        1004: 'FAT',
        1079: 'FIBER',
        2000: 'SUGAR',
        1106: 'VITA',
        1165: 'VITB1',
        1166: 'VITB2',
        1167: 'VITB3',
        1175: 'VITB6',
        1178: 'VITB12',
        1162: 'VITC',
        1114: 'VITD',
        1109: 'VITE',
        1185: 'VITK',
        1177: 'FOLATE',
        1087: 'CALCIUM',
        1089: 'IRON',
        1090: 'MAGNESIUM',
        1091: 'PHOSPHORUS',
        1092: 'POTASSIUM',
        1093: 'SODIUM',
        1095: 'ZINC',
        1098: 'COPPER',
        1103: 'SELENIUM'
    };

    const result = {};

    foodNutrients.forEach(n => {
        const nutrientId = n.nutrient?.id || n.nutrientId;
        const code = nutrientMap[nutrientId];
        if (code) {
            result[code] = Math.round((n.amount || n.value || 0) * 1000) / 1000;
        }
    });

    return result;
}

module.exports = {
    searchFoods,
    getFoodDetails,
    getFoodsByIds,
    mapUSDAFood,
    mapUSDAFoodDetails,
    extractNutrients,
    extractAllNutrients
};
