'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/providers/loading-provider';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    // Show loading state
    setIsLoading(true);
    
    // Hide loading state after a short delay
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams, setIsLoading]);

  return null;
} 