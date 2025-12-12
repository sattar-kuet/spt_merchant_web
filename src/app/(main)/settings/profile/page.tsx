"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded shadow text-sm text-slate-700">
          You are not signed in. <Link href="/auth/login" className="text-blue-600">Sign in</Link>
        </div>
      </div>
    );
  }

  const name = user.name ?? '';
  const email = user.email ?? '';
  const id = user.user_id ?? '';
  const groups = Array.isArray(user.groups) ? user.groups : (user.groups ? [user.groups] : []);

  const initials = name
    ? name
        .split(' ')
        .map((n: string) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-md">
        <div className="relative bg-white rounded-2xl shadow-md overflow-hidden pt-12 pb-6 px-6">
          <div className="-mt-4 flex justify-center">
            <div className="bg-white rounded-full p-1 shadow-sm">
              <Avatar className="w-24 h-24">
                {user.avatar ? (
                  <AvatarImage src={String(user.avatar)} alt={name} />
                ) : (
                  <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-slate-900">{name || '-'}</h2>
            <p className="text-sm text-slate-500 mt-1">{email || '-'}</p>
          </div>

          <div className="mt-6 border-t pt-4 text-sm text-slate-700">
            <div className="flex justify-between py-2">
              <span className="text-slate-500">User ID</span>
              <span className="font-medium">{id || '-'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Groups</span>
              <span className="font-medium">{groups.length ? groups.join(', ') : '-'}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button className="px-4 py-2 rounded bg-indigo-600 text-white text-sm">Edit</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
