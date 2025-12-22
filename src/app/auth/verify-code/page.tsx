"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Swal from 'sweetalert2';

const VerifyCodeContent = () => {
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const { verifyResetCode } = useAuth();

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        } else {
            // If no email is provided, redirect back to forgot-password
            router.push('/auth/forgot-password');
        }
    }, [searchParams, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!code) {
            setError('Please enter the verification code.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await verifyResetCode(email, code);

            if (result.success && result.reset_token) {
                Swal.fire({
                    icon: 'success',
                    title: 'Code Verified',
                    text: 'Your code is correct. Please set a new password.',
                    toast: true,
                    position: 'top-end',
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    router.push(`/auth/reset-password?token=${encodeURIComponent(result.reset_token!)}`);
                });
            } else {
                const msg = result.message || 'Invalid or expired code';
                setError(msg);
                Swal.fire({ icon: 'error', title: 'Failed', text: msg });
            }
        } catch (err: any) {
            const msg = err?.message || 'An unexpected error occurred';
            setError(msg);
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
                        Verify Reset Code
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We&apos;ve sent a code to <span className="font-semibold">{email}</span>. Please enter it below.
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
                            <label htmlFor="verify-code" className="sr-only">
                                Verification Code
                            </label>
                            <input
                                id="verify-code"
                                name="code"
                                type="text"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Enter 6-digit code"
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify Code"}
                        </Button>
                    </div>
                </form>

                <div className="text-sm text-center">
                    Didn&apos;t receive a code?
                    <Link
                        href="/auth/forgot-password"
                        className="font-medium text-primary hover:text-primary/80"
                    >
                        {" "}
                        Resend
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Wrap content in Suspense for useSearchParams
export default function VerifyCodePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <VerifyCodeContent />
        </Suspense>
    );
}
