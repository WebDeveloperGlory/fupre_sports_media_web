'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// News data
const featuredArticle = {
  id: 1,
  title: "FUPRE Super League: Propellers Fined for Uniform and Late Arrival Violation",
  excerpt: "The FUPRE Super League Board has fined Propellers FC a total of ₦6,000 for breaching league regulations during their match against Rayos FC.",
  author: "FSL Media Team",
  authorRole: "Sports News",
  date: "Mar 13, 2024",
  readTime: "2 min read",
  image: "/assets/Newsimages/News 1.jpg",
};

const latestArticles = [
  {
    id: 1,
    title: "With strict enforcement of league rules, teams are expected to adhere to the regulations",
    excerpt: "The board emphasized that the fine aligns with FSL rules and must be settled 24 hours before the team's next game.",
    author: "FSL Media Team",
    date: "Mar 13, 2024",
    readTime: "1 min read",
    image: "/assets/Newsimages/News 1.jpg",
  }
];

export default function NewsPage() {
  return (
    <div className="min-h-screen">
      {/* Featured Article */}
      <BlurFade>
        <div className="relative bg-card border-b border-black/20">
          <div className="p-4 md:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
              <div className="flex-1 space-y-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                  {featuredArticle.title}
                </h1>
                <p className="text-base lg:text-lg text-muted-foreground">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-full bg-muted overflow-hidden">
                      <Image
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${featuredArticle.author}`}
                        alt={featuredArticle.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{featuredArticle.author}</p>
                      <p>{featuredArticle.authorRole}</p>
                    </div>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{featuredArticle.readTime}</span>
                  </div>
                  <span>{featuredArticle.date}</span>
                </div>
              </div>
              <div className="lg:flex-1 w-full aspect-[16/9] relative rounded-lg overflow-hidden">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      <div className="p-4 md:p-8">
        {/* Latest Articles */}
        <BlurFade delay={0.1}>
          <h2 className="text-2xl font-bold mb-6">Latest Stories</h2>
          <div className="grid gap-8 max-w-4xl">
            {latestArticles.map((article) => (
              <article key={article.id} className="group">
                <Link href={`/news/${article.id}`} className="grid md:grid-cols-5 gap-6 items-start">
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
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </BlurFade>
      </div>
    </div>
  );
}