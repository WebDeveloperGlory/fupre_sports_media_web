'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const latestArticles = [
  {
    id: 1,
    title: "With strict enforcement of league rules, teams are expected to adhere to the regulations",
    excerpt: "The board emphasized that the fine aligns with FSL rules and must be settled 24 hours before the team's next game.",
    author: "FSL Media Team",
    date: "Mar 13, 2024",
    readTime: "1 min read",
    image: "/images/news/News 1.jpg",
  }
];

export default function NewsPage() {
  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-8">
        {/* Latest Articles */}
        <BlurFade delay={0.1}>
          <h2 className="text-2xl font-bold mb-6">Latest Stories</h2>
          <div className="grid gap-8 max-w-4xl">
            {latestArticles.map((article) => (
              <article key={article.id} className="group">
                <div className="grid md:grid-cols-5 gap-6 items-start">
                  <div className="md:col-span-2 aspect-[4/3] relative rounded-lg overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                        <div className="relative w-6 h-6 rounded-full bg-muted overflow-hidden">
                          <Image
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${article.author}`}
                            alt={article.author}
                            fill
                            className="object-cover"
                          />
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