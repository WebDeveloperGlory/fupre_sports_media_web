'use client';

import { useLoading } from "@/providers/loading-provider";
import { Loader } from "./loader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function LoadingOverlay() {
  const { isLoading, setIsLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleStop = () => {
      setIsLoading(false);
    };

    // Subscribe to router events
    window.addEventListener('beforeunload', handleStart);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleStart();
      }
    });

    return () => {
      window.removeEventListener('beforeunload', handleStart);
    };
  }, [setIsLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Loader size="lg" />
    </div>
  );
} 