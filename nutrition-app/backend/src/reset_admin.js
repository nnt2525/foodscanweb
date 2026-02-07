const db = require('./config/database');
const bcrypt = require('bcryptjs');

async function reset() {
    try {
        const password = await bcrypt.hash('password', 10);
        await db.query("UPDATE users SET password = ? WHERE email = 'admin@nutritrack.com'", [password]);
        console.log('Admin password reset to: password');
    } catch (e) {
        console.error(e);
    }
    process.exit();
}

reset();
