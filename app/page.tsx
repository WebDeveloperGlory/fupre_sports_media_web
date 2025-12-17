'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Trophy, Newspaper, Play, Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import GalleryCarousel from '@/components/GalleryCarousel';

// Mock Data
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

const quickLinks = [
  { href: "/sports/competitions", label: "Scores", icon: Trophy },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/highlights", label: "Highlights", icon: Play },
];

export default function RootPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero Section - Clean, Bold, Minimal */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            {/* Season Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">2025/2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]">
              Elevating<br />
              <span className="text-muted-foreground">University Sports.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              Live scores, match statistics, and breaking news from FUPRE.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/sports/competitions">
                <Button size="lg" className="h-14 w-64 text-base rounded-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Explore Competitions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/highlights">
                <Button size="lg" variant="outline" className="h-14 w-64 text-base rounded-full border-border hover:bg-secondary">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Highlights
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar - Minimal horizontal strip */}
      <section className="border-y border-border py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            <div className="py-2">
              <span className="text-2xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400">2</span>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Live Matches</p>
            </div>
            <div className="py-2">
              <span className="text-2xl md:text-4xl font-bold">5</span>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Competitions</p>
            </div>
            <div className="py-2">
              <span className="text-2xl md:text-4xl font-bold">12</span>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Teams</p>
            </div>
            <div className="py-2">
              <span className="text-2xl md:text-4xl font-bold">48</span>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Fixtures</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Match - Clean Split Layout */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Next Match</h2>
            <Link href="/sports/competitions" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center">
              All Fixtures <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="border border-border rounded-2xl overflow-hidden">
            {/* Competition Header */}
            <div className="bg-secondary/50 px-6 py-3 text-center">
              <span className="text-sm font-medium text-muted-foreground">
                {upcomingMatch.competition}
              </span>
            </div>

            {/* Match Content */}
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between gap-4">
                {/* Home Team */}
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl md:text-3xl font-bold">E</span>
                  </div>
                  <h3 className="font-bold text-lg md:text-xl">{upcomingMatch.teams.home}</h3>
                </div>

                {/* VS */}
                <div className="flex flex-col items-center px-4 md:px-8">
                  <span className="text-2xl md:text-3xl font-bold text-muted-foreground">VS</span>
                </div>

                {/* Away Team */}
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl md:text-3xl font-bold">S</span>
                  </div>
                  <h3 className="font-bold text-lg md:text-xl">{upcomingMatch.teams.away}</h3>
                </div>
              </div>

              {/* Match Details */}
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{upcomingMatch.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{upcomingMatch.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{upcomingMatch.venue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section - Clean Minimal */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">Latest News</h2>
            <Link href="/news" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Featured Article */}
          {latestArticles[0] && (
            <Link href={`/news/${latestArticles[0].id}`} className="block group mb-10">
              <article className="md:flex md:gap-8 md:items-center">
                <div className="w-full md:w-1/2 aspect-video rounded-xl bg-secondary mb-4 md:mb-0 overflow-hidden relative">
                  <Image
                    src={latestArticles[0].image}
                    alt={latestArticles[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-1/2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Featured</span>
                    <span>•</span>
                    <span>{latestArticles[0].readTime}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-3">
                    {latestArticles[0].title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
                    {latestArticles[0].excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{latestArticles[0].author}</span>
                    <span>•</span>
                    <span>{latestArticles[0].date}</span>
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* Other Articles - Simple List */}
          <div className="divide-y divide-border">
            {latestArticles.slice(1).map((article) => (
              <Link key={article.id} href={`/news/${article.id}`} className="block group py-6 first:pt-0">
                <article className="flex gap-4 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Sports</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="font-bold text-base md:text-lg leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-secondary flex-shrink-0 overflow-hidden relative">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - Full Width Parallax */}
      <GalleryCarousel />

      {/* Quick Links - Icon Row */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-8 md:gap-16">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-border bg-background flex items-center justify-center group-hover:bg-secondary group-hover:border-foreground/20 transition-colors">
                  <link.icon className="w-6 h-6 md:w-7 md:h-7 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
