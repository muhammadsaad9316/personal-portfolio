const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = '6969khan';
    const hash = await bcrypt.hash(password, 10);

    console.log('\n=================================');
    console.log('PASSWORD HASH GENERATED');
    console.log('=================================\n');
    console.log('Run this SQL in Supabase SQL Editor:\n');
    console.log(`UPDATE "Admin" SET password = '${hash}' WHERE email = 'admin@muhammadsaad.com';\n`);
    console.log('=================================\n');
}

generateHash();
