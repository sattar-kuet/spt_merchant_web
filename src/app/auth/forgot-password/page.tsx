"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Swal from 'sweetalert2';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            const result = await forgotPassword(email);

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Reset link sent',
                    text: result.message,
                    confirmButtonColor: '#ff5a1f',
                }).then(() => router.push(`/auth/verify-code?email=${encodeURIComponent(email)}`));
            } else {
                const msg = result.message || 'Something went wrong';
                setError(msg);
                Swal.fire({ icon: 'error', title: 'Failed', text: msg });
            }
        } catch (err: any) {
            const msg = err?.message || 'An unexpected error occurred';
            setError(msg);
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Error', text: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className='w-2/10 mx-auto'>
                    <img src="https://i.ibb.co.com/BH1VBCj2/logo.png" className='w-full' alt="App Logo" />
                </div>
                <div>
                    <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email and we&apos;ll send you a reset code.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    <div className="rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Code"}
                        </Button>
                    </div>
                </form>

                <div className="text-sm text-center">
                    Remember your password?
                    <Link
                        href="/auth/login"
                        className="font-medium text-primary hover:text-primary/80"
                    >
                        {" "}
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
