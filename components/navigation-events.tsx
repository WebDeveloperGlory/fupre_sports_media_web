'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/providers/loading-provider';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleStop = () => {
      setIsLoading(false);
    };

    handleStart();
    const timeout = setTimeout(handleStop, 500);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams, setIsLoading]);

  return null;
} 