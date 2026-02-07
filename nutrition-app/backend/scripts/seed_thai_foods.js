const fs = require('fs');
const path = require('path');
const db = require('../src/config/database');

async function importFoods() {
    try {
        console.log('📦 Starting Food Import...');

        // 1. Ensure Categories Exist
        console.log('Checking categories...');
        const categories = [
            { id: 1, name: 'อาหารจานเดียว/กับข้าว', icon: '🍛' },
            { id: 2, name: 'เมนูเส้น', icon: '🍜' },
            { id: 3, name: 'แกงและต้ม', icon: '🍲' },
            { id: 4, name: 'ผัดและทอด', icon: '🍳' },
            { id: 5, name: 'ส้มตำและยำ', icon: '🥗' },
            { id: 6, name: 'ผลไม้', icon: '🍎' },
            { id: 7, name: 'ของหวาน', icon: '🍰' },
            { id: 8, name: 'เครื่องดื่ม', icon: '🥤' }
        ];

        for (const cat of categories) {
            await db.query(`
                INSERT INTO categories (id, name, icon) 
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE name=VALUES(name), icon=VALUES(icon)
            `, [cat.id, cat.name, cat.icon]);
        }
        console.log('✅ Categories synced.');

        // 2. Read SQL File using absolute path or relative to this script
        const sqlPath = path.join(__dirname, '../src/database/seed_thai_foods_100.sql');
        console.log(`Reading SQL file from: ${sqlPath}`);

        let sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // 3. Remove comments and split statements
        // Basic parser: split by semicolon, ignore empty lines
        const statements = sqlContent
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Found ${statements.length} SQL statements to execute.`);

        // 4. Execute each statement
        let successCount = 0;
        for (const statement of statements) {
            // Skip comments if entire line matches --
            if (statement.startsWith('--')) continue;

            try {
                await db.query(statement);
                successCount++;
            } catch (err) {
                // Ignore duplicate errors if re-running
                if (err.code !== 'ER_DUP_ENTRY') {
                    console.error('❌ Error executing statement:', err.message);
                    console.error(statement.substring(0, 50) + '...');
                }
            }
        }

        console.log(`✅ Successfully executed ${successCount} statements.`);
        console.log('🎉 detailed food import completed!');

    } catch (error) {
        console.error('💥 Import failed:', error);
    } finally {
        process.exit();
    }
}

importFoods();
