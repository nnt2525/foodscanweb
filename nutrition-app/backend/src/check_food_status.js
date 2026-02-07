const db = require('./config/database');

async function check() {
    try {
        const [foods] = await db.query("SELECT * FROM foods WHERE name LIKE '%Burger%'");
        console.log('Foods found:', foods);

        const [users] = await db.query("SELECT * FROM users WHERE email LIKE '%admin%'");
        console.log('Users found:', users.map(u => ({ id: u.id, email: u.email, role: u.role })));

    } catch (e) {
        console.error(e);
    }
    process.exit();
}

check();
