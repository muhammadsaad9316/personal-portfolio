'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loginStepOne } from '@/app/actions/auth';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (step === 1) {
            // Use FormData for Server Action
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            const result = await loginStepOne(formData);

            if (result.error) {
                setError(result.error);
                setLoading(false);
                return;
            }

            if (result.twoFactorRequired) {
                setStep(2);
                setLoading(false);
            } else {
                // No 2FA, proceed to login directly
                // We restart the loading since we are calling signIn immediately
                setLoading(true); // Keep loading state
                await performSignIn();
            }
        } else {
            // Step 2: Submit with code
            await performSignIn();
        }
    };

    const performSignIn = async () => {
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
                code: step === 2 ? code : undefined,
            });

            if (result?.error) {
                setError('Invalid credentials or code');
                setLoading(false);
            } else if (result?.ok) {
                window.location.href = '/admin/dashboard';
            }
        } catch (err) {
            setError('An error occurred during login');
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>
                        {step === 1 ? 'Welcome Back' : '2FA Verification'}
                    </h1>
                    <p style={{ color: '#64748b' }}>
                        {step === 1 ? 'Sign in to your dashboard' : `Enter code sent to ${email}`}
                    </p>
                </div>

                {error && (
                    <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>Email</label>
                            <input
                                type="email"
                                required
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                                disabled={loading}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>Password</label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                                disabled={loading}
                            />
                        </div>
                    </>
                )}

                {step === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>Verification Code</label>
                        <input
                            type="text"
                            required
                            placeholder="123456"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.5rem' }}
                            disabled={loading}
                            maxLength={6}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '0.75rem',
                        background: loading ? '#94a3b8' : '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    {loading ? 'Processing...' : (step === 1 ? 'Sign in' : 'Verify Code')}
                </button>

                {step === 2 && (
                    <button
                        type="button"
                        onClick={() => { setStep(1); setError(''); }}
                        style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.875rem', cursor: 'pointer', marginTop: '-0.5rem' }}
                    >
                        Back to Login
                    </button>
                )}
            </form>
        </div>
    );
}
