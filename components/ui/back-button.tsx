'use client';

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors cursor-pointer"
    >
      <ChevronLeft className="w-4 h-4" />
      <span>Back</span>
    </button>
  );
} 