'use server';

import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { randomInt } from 'crypto';
import { sendTwoFactorEmail } from '@/lib/mail';

export async function loginStepOne(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    try {
        const user = await prisma.admin.findUnique({
            where: { email },
        });

        if (!user) {
            return { error: 'Invalid credentials' };
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return { error: 'Invalid credentials' };
        }

        // If 2FA is NOT enabled, we can just return success and let the client call signIn
        // But to avoid "user enumeration" via timing, we might want to simulate 2FA delay? 
        // For simplicity, we just check enabled status.
        // Actually, if 2FA is NOT enabled, 
        // the client will proceed to call signIn with just email/pass.
        // The server action just verifies password to prevent sending emails to random people.

        // In my plan, I said "If 2FA enabled -> Send Email".
        // If 2FA is disabled, we return { twoFactorRequired: false }.

        // Wait, if I return success here, the client has the password in state.
        // Ideally, we shouldn't send the password back and forth too much, but it's HTTPS.

        if (!user.twoFactorEnabled) {
            return { success: true, twoFactorRequired: false };
        }

        // Generate 6-digit code
        const token = randomInt(100000, 999999).toString();
        const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await prisma.admin.update({
            where: { id: user.id },
            data: {
                twoFactorToken: token,
                twoFactorExpires: expires,
            },
        });

        await sendTwoFactorEmail(email, token);

        return { success: true, twoFactorRequired: true };

    } catch (error) {
        console.error('Login step one error:', error);
        return { error: 'Something went wrong' };
    }
}
