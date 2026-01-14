
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function toggle2FA() {
    const email = process.argv[2];
    const enable = process.argv[3] === 'true';

    if (!email) {
        console.error('Usage: npx ts-node scripts/toggle-2fa.ts <email> <true|false>');
        process.exit(1);
    }

    try {
        const user = await prisma.admin.update({
            where: { email },
            data: { twoFactorEnabled: enable }
        });
        console.log(`2FA for ${email} is now ${user.twoFactorEnabled ? 'ENABLED' : 'DISABLED'}`);
    } catch (e) {
        console.error('Error updating user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

toggle2FA();
