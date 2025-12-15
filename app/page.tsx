'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Trophy, Newspaper, Zap, Activity, Clock, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

// Mock Data (In a real app, this would be fetched)
const latestArticles = [
  {
    id: 3,
    title: "Current Champions vs Past Champions: A Clash of Titans",
    excerpt: "Will Citizens remember that it was Seventeen that helped them clinch the title on the final day?",
    author: "Churchill Usaide",
    date: "Feb 19, 2025",
    readTime: "2 min read",
    image: "/images/news/Today's game.jpg"
  },
  {
    id: 2,
    title: "Propellers Penalized for Fielding Ineligible Player",
    excerpt: "The FUPRE Super League Board has issued a disciplinary action against Propellers FC.",
    author: "Churchill Usaide",
    date: "Feb 15, 2025",
    readTime: "2 min read",
    image: "/images/news/News 2.jpg"
  },
  {
    id: 1,
    title: "FUPRE Super League Fines Propellers FC",
    excerpt: "Propellers FC has been handed a substantial fine following multiple rule violations.",
    author: "Churchill Usaide",
    date: "Feb 14, 2025",
    readTime: "3 min read",
    image: "/images/news/News 1.jpg"
  }
];

const upcomingMatch = {
  competition: "Unity Cup Championship",
  teams: {
    home: "Engineering FC",
    away: "Science United"
  },
  date: "Tomorrow",
  time: "4:00 PM",
  venue: "FUPRE Sports Complex"
};

export default function RootPage() {
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

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30">

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 dark:bg-emerald-500/5 animate-pulse" />

        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Live Season 2025/2026
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50">
              Elevating <br className="hidden md:block" />
              University Sports.
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              The official digital hub for FUPRE sports. Experience live scores,
              comprehensive match statistics, and breaking news from the heart of the action.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/sports/competitions">
                <Button size="lg" className="h-12 px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all hover:scale-105">
                  Explore Competitions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/news">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full hover:bg-secondary transition-all">
                  Latest News
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="py-20 bg-secondary/30 border-y border-border/50">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Live Scores Card */}
            <motion.div variants={item} className="group">
              <Link href="/sports/competitions">
                <Card className="h-full p-6 bg-card hover:bg-emerald-500/5 border-border/50 hover:border-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Live Scores</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Real-time updates from all ongoing matches across different sports categories.
                  </p>
                </Card>
              </Link>
            </motion.div>

            {/* Team of the Season Card */}
            <motion.div variants={item} className="group">
              <Link href="/sports/football/tots">
                <Card className="h-full p-6 bg-card hover:bg-emerald-500/5 border-border/50 hover:border-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Team of the Season</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Vote for your favorite players and see who makes the ultimate squad lineup.
                  </p>
                </Card>
              </Link>
            </motion.div>

            {/* News Card */}
            <motion.div variants={item} className="group">
              <Link href="/news">
                <Card className="h-full p-6 bg-card hover:bg-emerald-500/5 border-border/50 hover:border-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Newspaper className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Latest News</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Stay updated with match reports, player interviews, and university sports announcements.
                  </p>
                </Card>
              </Link>
            </motion.div>

            {/* Highlights Card */}
            <motion.div variants={item} className="group">
              <Link href="/highlights">
                <Card className="h-full p-6 bg-card hover:bg-emerald-500/5 border-border/50 hover:border-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Highlights</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Watch best moments, top goals, and game-changing plays from recent fixtures.
                  </p>
                </Card>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Content Area */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Upcoming Match Spotlight */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Next Match</h2>
                <Link href="/sports/competitions" className="text-emerald-500 hover:text-emerald-600 flex items-center text-sm font-medium">
                  View Schedule <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <Card className="p-0 overflow-hidden border-border/50 shadow-lg group">
                <div className="bg-emerald-900/10 p-6 flex flex-col items-center justify-center border-b border-border/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4 z-10">
                    {upcomingMatch.competition}
                  </span>

                  <div className="flex w-full items-center justify-between z-10">
                    <div className="text-center w-1/3">
                      <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-2 flex items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground">E</span>
                      </div>
                      <span className="text-sm font-bold block">{upcomingMatch.teams.home}</span>
                    </div>

                    <div className="text-center w-1/3">
                      <span className="text-3xl font-bold text-muted-foreground">VS</span>
                    </div>

                    <div className="text-center w-1/3">
                      <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-2 flex items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground">S</span>
                      </div>
                      <span className="text-sm font-bold block">{upcomingMatch.teams.away}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-card space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>{upcomingMatch.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>{upcomingMatch.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span>{upcomingMatch.venue}</span>
                  </div>

                  <Link href="/sports/competitions" className="block mt-4">
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">Match Details</Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Latest News Feed */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Trending News</h2>
                <Link href="/news" className="text-emerald-500 hover:text-emerald-600 flex items-center text-sm font-medium">
                  View All News <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid gap-6">
                {latestArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Link href={`/news/${article.id}`}>
                      <Card className="flex flex-col md:flex-row overflow-hidden hover:shadow-lg transition-all border-border/50 bg-card/50 hover:bg-card">
                        <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0 overflow-hidden">
                          {/* Placeholder for real image since we might not have access to public assets */}
                          <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground">
                            <Newspaper className="w-8 h-8 opacity-20" />
                          </div>
                          {/* Try to use Image if src works, otherwise fallback will be needed in production code, but here we just use what was in news page */}

                        </div>
                        <div className="p-6 flex flex-col justify-center">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span className="text-emerald-500 font-medium">Sports</span>
                            <span>•</span>
                            <span>{article.readTime}</span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-500 transition-colors line-clamp-1">
                            {article.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
                            <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                              <span className="text-[10px] font-bold">CU</span>
                            </div>
                            <span>{article.author}</span>
                            <span>•</span>
                            <span>{article.date}</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>



    </div>
  );
}
