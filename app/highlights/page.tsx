'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { YouTubeVideo } from "@/components/ui/youtube-video";
import { BackButton } from "@/components/ui/back-button";

// YouTube video data
const highlights = [
  {
    id: 1,
    videoId: "XBFJQicmp7Q",
    title: "Earth Science (2) Vs (0) Maritime Highlights || Unity Cup 24/25 season",
    date: "Jan 30, 2025",
    views: "304 views",
    category: "Football",
  }
];

export default function HighlightsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <BlurFade>
          <div className="mb-6 pb-6 border-b border-border">
            <h1 className="text-2xl font-semibold">Match Highlights</h1>
          </div>
        </BlurFade>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {highlights.map((highlight) => (
            <BlurFade key={highlight.id} delay={0.1 * highlight.id}>
              <YouTubeVideo
                videoId={highlight.videoId}
                title={highlight.title}
                date={highlight.date}
                views={highlight.views}
                category={highlight.category}
              />
            </BlurFade>
          ))}
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <BackButton />
        </div>
      </div>
    </div>
  );
} 