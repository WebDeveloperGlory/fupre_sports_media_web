'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { Play, Clock, Calendar, Filter } from "lucide-react";
import Image from "next/image";

// Temporary mock data
const highlights = [
  {
    id: 1,
    title: "FUPRE Tigers vs Lions - Match Highlights",
    thumbnail: "https://picsum.photos/seed/1/640/360",
    duration: "10:25",
    date: "2 days ago",
    views: "1.2K views",
    category: "Football",
  },
  {
    id: 2,
    title: "Best Goals of the Week - FUPRE Sports",
    thumbnail: "https://picsum.photos/seed/2/640/360",
    duration: "5:30",
    date: "1 week ago",
    views: "2.5K views",
    category: "Football",
  },
  {
    id: 3,
    title: "Tournament Finals Highlights 2024",
    thumbnail: "https://picsum.photos/seed/3/640/360",
    duration: "15:45",
    date: "2 weeks ago",
    views: "3.8K views",
    category: "Basketball",
  },
  {
    id: 4,
    title: "Top 10 Plays of the Month - January 2024",
    thumbnail: "https://picsum.photos/seed/4/640/360",
    duration: "8:15",
    date: "3 weeks ago",
    views: "4.2K views",
    category: "Basketball",
  },
  {
    id: 5,
    title: "FUPRE Athletics Championship Highlights",
    thumbnail: "https://picsum.photos/seed/5/640/360",
    duration: "12:30",
    date: "1 month ago",
    views: "5.1K views",
    category: "Athletics",
  },
  {
    id: 6,
    title: "Volleyball Tournament - Final Match Highlights",
    thumbnail: "https://picsum.photos/seed/6/640/360",
    duration: "20:15",
    date: "1 month ago",
    views: "3.3K views",
    category: "Volleyball",
  },
];

const categories = ["All", "Football", "Basketball", "Athletics", "Volleyball"];

export default function HighlightsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <BlurFade>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Match Highlights</h1>
          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </BlurFade>

      {/* Categories */}
      <BlurFade delay={0.1}>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors whitespace-nowrap"
            >
              {category}
            </button>
          ))}
        </div>
      </BlurFade>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((highlight) => (
          <BlurFade key={highlight.id} delay={0.1 * highlight.id}>
            <div className="group relative bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted overflow-hidden">
                <Image
                  src={highlight.thumbnail}
                  alt={highlight.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-200">
                    <Play className="w-6 h-6" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                  {highlight.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-medium text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {highlight.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{highlight.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{highlight.views}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                    {highlight.category}
                  </span>
                </div>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
} 