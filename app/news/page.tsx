'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NewsSkeletonList } from "@/components/ui/news-skeleton";
import { Suspense } from "react";

const latestArticles = [
  {
    id: 3,
    title: "Current Champions vs Past Champions: A Clash of Titans",
    excerpt: "Will Citizens remember that it was Seventeen that helped them clinch the title on the final day? No, it's football and it's a new season. Seventeen are kicking off their season with tough fixtures.",
    author: "Churchill Usaide",
    date: "Feb 19, 2025",
    readTime: "2 min read",
    image: "/images/news/Today's game.jpg"
  },
  {
    id: 2,
    title: "Propellers Penalized for Fielding Ineligible Player, Lose Points and Face Fine",
    excerpt: "The FUPRE Super League Board has issued a disciplinary action against Propellers FC for fielding an ineligible player, 'Jala,' in their recent match against Rayos FC.",
    author: "Churchill Usaide",
    date: "Feb 15, 2025",
    readTime: "2 min read",
    image: "/images/news/News 2.jpg"
  },
  {
    id: 1,
    title: "FUPRE Super League Fines Propellers FC for Rule Violations",
    excerpt: "In a significant development for the FUPRE Super League (FSL), Propellers FC has been handed a substantial fine following multiple rule violations during their recent fixture.",
    author: "Churchill Usaide",
    date: "Feb 14, 2025",
    readTime: "3 min read",
    image: "/images/news/News 1.jpg"
  }
];

export default function NewsPage() {
  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-8">
        {/* Latest Articles */}
        <Suspense fallback={<NewsSkeletonList />}>
        </Suspense>
          <BlurFade>
          <h2 className="text-2xl font-bold mb-6">Latest Stories</h2>
          <div className="grid gap-8 max-w-4xl">
            {latestArticles.map((article) => (
              <article key={article.id} className="group">
                <div className="grid md:grid-cols-5 gap-6 items-start">
                  <div className="md:col-span-2 relative">
                    <Image
                      src={article.image}
                      alt={article.title}
                      width={800}
                      height={450}
                      className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>
                  <div className="md:col-span-3 space-y-3">
                    <h3 className="text-xl font-bold group-hover:text-emerald-500 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="relative w-6 h-6 rounded-full bg-muted overflow-hidden flex items-center justify-center text-muted-foreground">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <span>{article.author}</span>
                      </div>
                      <span>·</span>
                      <span>{article.date}</span>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link 
                        href={`/news/${article.id}`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-500 hover:text-emerald-600 transition-colors"
                      >
                        Read More
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </BlurFade>
      </div>
    </div>
  );
}