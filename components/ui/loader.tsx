'use client';

import { cn } from "@/utils/cn";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Loader({ className, size = "md" }: LoaderProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-4",
      className
    )}>
      <div className={cn(
        "relative",
        size === "sm" && "w-6 h-6",
        size === "md" && "w-8 h-8",
        size === "lg" && "w-12 h-12"
      )}>
        {/* Outer ring */}
        <div className="absolute inset-0 border-2 border-t-emerald-500 border-r-emerald-500 border-b-transparent border-l-transparent rounded-full animate-spin" />
        {/* Inner ring */}
        <div className="absolute inset-1 border-2 border-t-transparent border-r-transparent border-b-emerald-500 border-l-emerald-500 rounded-full animate-spin-reverse" />
      </div>
      <span className="text-sm text-muted-foreground animate-pulse">Loading...</span>
    </div>
  );
} 