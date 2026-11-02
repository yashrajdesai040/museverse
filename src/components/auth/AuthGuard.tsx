'use client';

import React, { useEffect, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

function AuthGuardInternal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isInitializing = useAuthStore((s) => s.isInitializing);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const checkSession = useAuthStore((s) => s.checkSession);

  // Hydrate & check session on mount (handles F5 page refresh state restoration)
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Route protection redirect check
  useEffect(() => {
    if (isInitializing) return;

    const isProfilePage = pathname.startsWith('/profile');

    if (!isAuthenticated && isProfilePage) {
      const searchStr = searchParams?.toString() ? `?${searchParams.toString()}` : '';
      const currentPath = pathname + searchStr;
      const redirectUrl = `/login?redirectTo=${encodeURIComponent(currentPath)}`;
      router.replace(redirectUrl);
    }
  }, [isInitializing, isAuthenticated, pathname, searchParams, router]);

  // Return clean loading state during session check ONLY on protected profile page
  if (isInitializing && pathname.startsWith('/profile')) {
    return (
      <div className="fixed inset-0 bg-[#0d0d0d] z-50 flex items-center justify-center font-mono text-xs text-[#FFD400]">
        CHECKING ARCHIVAL CREDENTIALS...
      </div>
    );
  }

  return <>{children}</>;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-[#0d0d0d] z-50 pointer-events-none" />}>
      <AuthGuardInternal>{children}</AuthGuardInternal>
    </Suspense>
  );
}
