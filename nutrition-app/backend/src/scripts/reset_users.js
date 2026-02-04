const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../../.env' });

async function resetUsers() {
    console.log('🔄 Connecting to database...');

    // Create connection using .env
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'nutritrack'
    });

    try {
        console.log('🗑️ Deleting old users (admin@nutritrack.com, user@nutritrack.com)...');
        await connection.execute(
            `DELETE FROM users WHERE email IN ('admin@nutritrack.com', 'user@nutritrack.com')`
        );

        console.log('🔐 Hashing password "admin123"...');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        console.log('✨ Creating new Admin user...');
        await connection.execute(
            `INSERT INTO users (email, password, name, role, daily_calories, weight, height, age, gender) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['admin@nutritrack.com', hashedPassword, 'Admin NutriTrack', 'admin', 2000, 70, 175, 30, 'male']
        );

        console.log('✨ Creating new Standard user...');
        await connection.execute(
            `INSERT INTO users (email, password, name, role, daily_calories, weight, height, age, gender) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['user@nutritrack.com', hashedPassword, 'User NutriTrack', 'user', 1800, 65, 170, 25, 'female']
        );

        console.log('✅ Users reset successfully!');
        console.log('   - Admin: admin@nutritrack.com / admin123');
        console.log('   - User:  user@nutritrack.com  / admin123');

    } catch (error) {
        console.error('❌ Error resetting users:', error);
    } finally {
        await connection.end();
    }
}

resetUsers();
