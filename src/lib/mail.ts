import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password
    },
});

export async function sendTwoFactorEmail(email: string, token: string) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not found. Logging token to console:', token);
        return;
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your 2FA Login Code',
            html: `<p>Your code is: <strong>${token}</strong></p><p>Expires in 5 minutes.</p>`,
        });
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send verification email');
    }
}
