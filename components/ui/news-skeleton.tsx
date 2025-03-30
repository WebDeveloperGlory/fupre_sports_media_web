'use client';

import { BlurFade } from "./blur-fade";

export function NewsArticleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid md:grid-cols-5 gap-6 items-start">
        <div className="md:col-span-2">
          <div className="w-full aspect-video rounded-lg bg-muted" />
        </div>
        <div className="md:col-span-3 space-y-3">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-4" />
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-4" />
            <div className="h-4 bg-muted rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewsSkeletonList() {
  return (
    <BlurFade>
      <div className="h-8 w-48 bg-muted rounded mb-6" />
      <div className="grid gap-8 max-w-4xl">
        {[1, 2, 3].map((i) => (
          <NewsArticleSkeleton key={i} />
        ))}
      </div>
    </BlurFade>
  );
}