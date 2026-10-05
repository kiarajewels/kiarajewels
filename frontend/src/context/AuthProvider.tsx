'use client';
import { SessionProvider, useSession } from 'next-auth/react';
import React, { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

function AuthGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // If user is logged in but has no phone number, and they are not already on complete-profile
      const hasPhone = (session.user as any).phoneNumber && (session.user as any).phoneNumber.trim() !== '';
      if (!hasPhone && pathname !== '/complete-profile' && pathname !== '/login') {
        router.push('/complete-profile');
      }
    }
  }, [session, status, pathname, router]);

  return <>{children}</>;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}
