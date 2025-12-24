'use client';

import { motion } from "framer-motion";
import { Clock, Calendar, User, ArrowRight, Newspaper, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10 pb-6 sm:pb-10 overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[400px] sm:h-[500px] bg-emerald-500/10 rounded-full blur-[100px] sm:blur-[120px] -z-10 dark:bg-emerald-500/5 animate-pulse" />

        <div className="container px-0 sm:px-4 mx-auto max-w-6xl">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Newspaper className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
              <span className="text-xs sm:text-sm font-medium text-emerald-500">Latest News</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight">
              Stay <span className="text-emerald-500">Updated</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Get the latest news, updates, and stories from FUPRE sports
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-4 sm:gap-8 mb-6 sm:mb-10"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Newspaper className="w-4 h-4 text-emerald-500" />
              </div>
              <span><strong className="text-foreground">{latestArticles.length}</strong> Articles</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <span><strong className="text-foreground">24/25</strong> Season</span>
            </div>
          </motion.div>

          {/* Featured Article (First Article) */}
          {latestArticles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 sm:mb-10"
            >
              <Link href={`/news/${latestArticles[0].id}`}>
                <Card className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="relative aspect-video md:aspect-auto overflow-hidden">
                      <Image
                        src={latestArticles[0].image}
                        alt={latestArticles[0].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                      <div className="absolute bottom-3 left-3 md:hidden">
                        <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">Featured</span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col justify-center">
                      <div className="hidden md:inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-medium rounded-full w-fit mb-3">
                        <TrendingUp className="w-3 h-3" />
                        Featured
                      </div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-emerald-500 transition-colors line-clamp-2">
                        {latestArticles[0].title}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                        {latestArticles[0].excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span>{latestArticles[0].author}</span>
                        </div>
                        <span className="hidden sm:inline">·</span>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{latestArticles[0].date}</span>
                        </div>
                        <span className="hidden sm:inline">·</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{latestArticles[0].readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          )}

          {/* Other Articles */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {latestArticles.slice(1).map((article) => (
              <motion.div key={article.id} variants={item}>
                <Link href={`/news/${article.id}`}>
                  <Card className="group h-full overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="text-base sm:text-lg font-bold mb-2 group-hover:text-emerald-500 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{article.author}</span>
                        </div>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{article.date}</span>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4 flex items-center gap-1 text-emerald-500 text-xs sm:text-sm font-medium group-hover:gap-2 transition-all">
                        Read More
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}