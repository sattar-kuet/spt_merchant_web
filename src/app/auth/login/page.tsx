"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { consumeLogoutReason } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  // Explain a forced logout (e.g. account signed in on another device)
  useEffect(() => {
    const reason = consumeLogoutReason();
    if (reason) {
      setError(reason);
      Swal.fire({ icon: 'warning', title: 'Signed out', text: reason });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const result = await login(identifier, password);

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Signed in',
          text: 'You have signed in successfully',
          toast: true,
          position: 'top-end',
          timer: 1200,
          showConfirmButton: false,
        }).then(() => router.push('/'));
      } else {
        const msg = result.message || 'Login failed';
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
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-3">
            <div>
              <label htmlFor="identifier" className="sr-only">
                Email or Phone Number
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email or Phone Number"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>

        <div className="text-sm text-center">
          Don&apos;t have an account?
          <Link
            href="/auth/register"
            className="font-medium text-primary hover:text-primary/80"
          >
            {" "}
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
