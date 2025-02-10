'use client';

import { Play, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface YouTubeVideoProps {
  videoId: string;
  title: string;
  date: string;
  views: string;
  category: string;
}

export function YouTubeVideo({ videoId, title, date, views, category }: YouTubeVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (isPlaying) {
    return (
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all border border-border">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-200">
            <Play className="w-6 h-6" />
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{views}</span>
            </div>
          </div>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>
    </div>
  );
} 