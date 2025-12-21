const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        console.log('🔐 Creating admin account...');

        // Hash the password
        const hashedPassword = await bcrypt.hash('6969khan', 10);

        // Create admin user
        const admin = await prisma.admin.create({
            data: {
                email: 'admin@muhammadsaad.com',
                password: hashedPassword,
                name: 'Muhammad Saad'
            }
        });

        console.log('✅ Admin account created successfully!');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password: 6969khan');
        console.log('');
        console.log('You can now log in at: /admin/login');

    } catch (error) {
        if (error.code === 'P2002') {
            console.log('⚠️  Admin account already exists!');
            console.log('📧 Email: admin@muhammadsaad.com');
            console.log('🔑 Password: 6969khan');
        } else {
            console.error('❌ Error creating admin:', error.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
