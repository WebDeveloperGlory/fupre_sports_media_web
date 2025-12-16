'use client';

import { motion } from "framer-motion";
import { YouTubeVideo } from "@/components/ui/youtube-video";
import { Play, TrendingUp, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

// YouTube video data
const highlights = [
  {
    id: 7,
    videoId: "y1BASn-gU5c",
    title: "CITIZENS (4) - (2) SEVENTEEN FC HIGHLIGHTS|| FSL 24/25 SEASON",
    date: "Feb 21, 2025",
    views: "48 views",
    category: "Football",
  },
  {
    id: 6,
    videoId: "kGms8wBnogM",
    title: "MATADORS (3) - (1) TWALE FC HIGHLIGHTS|| FSL 24/25 SEASON",
    date: "Feb 20, 2025",
    views: "40 views",
    category: "Football",
  },
  {
    id: 5,
    videoId: "IdV6OYycymQ",
    title: "TWALE FC (1) - (3) KALAKUTA FC HIGHLIGHTS|| FSL 24/25 SEASON",
    date: "Mar 20, 2025",
    views: "47 views",
    category: "Football",
  },
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function HighlightsPage() {
  const totalViews = highlights.reduce((acc, h) => acc + parseInt(h.views), 0);

  return (
    <div className="min-h-screen bg-background selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10 pb-6 sm:pb-10 overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[400px] sm:h-[500px] bg-emerald-500/10 rounded-full blur-[100px] sm:blur-[120px] -z-10 dark:bg-emerald-500/5 animate-pulse" />

        <div className="container px-4 mx-auto max-w-7xl">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
              <span className="text-xs sm:text-sm font-medium text-emerald-500">Match Highlights</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight">
              Relive The <span className="text-emerald-500">Best Moments</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Watch full match highlights from the FUPRE Super League and Unity Cup. Never miss a goal!
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto mb-6 sm:mb-10"
          >
            <Card className="p-3 sm:p-4 bg-card/50 backdrop-blur-sm border-border/50 text-center">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/10 mx-auto mb-2">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              </div>
              <p className="text-lg sm:text-2xl font-bold">{highlights.length}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Videos</p>
            </Card>
            <Card className="p-3 sm:p-4 bg-card/50 backdrop-blur-sm border-border/50 text-center">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/10 mx-auto mb-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
              <p className="text-lg sm:text-2xl font-bold">{totalViews}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Views</p>
            </Card>
            <Card className="p-3 sm:p-4 bg-card/50 backdrop-blur-sm border-border/50 text-center">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500/10 mx-auto mb-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              </div>
              <p className="text-lg sm:text-2xl font-bold">24/25</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Season</p>
            </Card>
          </motion.div>

          {/* Videos Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {highlights.map((highlight) => (
              <motion.div key={highlight.id} variants={item}>
                <YouTubeVideo
                  videoId={highlight.videoId}
                  title={highlight.title}
                  date={highlight.date}
                  views={highlight.views}
                  category={highlight.category}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}