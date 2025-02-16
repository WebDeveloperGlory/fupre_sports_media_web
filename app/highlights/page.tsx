'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { YouTubeVideo } from "@/components/ui/youtube-video";
import { BackButton } from "@/components/ui/back-button";

// YouTube video data
const highlights = [
  {
    id: 4,
    videoId: "sAryUL5_oVw",
    title: "SEVENTEEN FC (1) VS (2) NEW HORIZONS HIGHLIGHTS|| FSL 24/25 SEASON",
    date: "Feb 15, 2025",
    views: "47 views",
    category: "Football",
  },
  {
    id: 3,
    videoId: "vLFyWYHQROs",
    title: "CITIZENS (2) - (0) RED BULLS HIGHLIGHTS|| FSL 23/24 SEASON",
    date: "Feb 5, 2025",
    views: "13 views",
    category: "Football",
  },
  {
    id: 2,
    videoId: "HziHwzKdzUk",
    title: "PROPELLERS (2) - (1) RAYOS FC HIGHLIGHTS|| FSL 24/25 SEASON",
    date: "Feb 1, 2025",
    views: "45 views",
    category: "Football",
  },
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
      <div className="space-y-6">
        <BlurFade>
          <div className="pb-4 border-b border-border flex justify-center items-center">
            <h1 className="text-2xl font-semibold">Match Highlights</h1>
          </div>
        </BlurFade>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
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
      </div>
    </div>
  );
}