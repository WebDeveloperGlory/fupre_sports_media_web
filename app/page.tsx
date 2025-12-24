'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Trophy, Newspaper, Play, Calendar, Clock, MapPin, ChevronRight, Sparkles, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import GalleryCarousel from '@/components/GalleryCarousel';
import { getFixtures, getUpcomingFixtures } from '@/lib/requests/v2/fixtures/requests';
import { getAllCompetitions } from '@/lib/requests/v2/competition/requests';

// Mock Data for news (to be replaced with real data later)
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

const quickLinks = [
  { href: "/sports/competitions", label: "Scores", icon: Trophy },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/highlights", label: "Highlights", icon: Play },
];

// Types
interface Fixture {
  _id: string;
  competition: { name: string; _id: string };
  homeTeam: { name: string; shorthand?: string };
  awayTeam: { name: string; shorthand?: string };
  scheduledDate: string;
  venue?: string;
  status: string;
}

interface Stats {
  liveMatches: number;
  competitions: number;
  teams: number;
  fixtures: number;
}

export default function RootPage() {
  const [stats, setStats] = useState<Stats>({
    liveMatches: 0,
    competitions: 0,
    teams: 0,
    fixtures: 0,
  });
  const [nextMatch, setNextMatch] = useState<Fixture | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [liveRes, upcomingRes, competitionsRes, fixturesRes] = await Promise.all([
          getFixtures('live', 50),
          getUpcomingFixtures(1), // Get just the next match
          getAllCompetitions(),
          getFixtures(undefined, 100), // Get all fixtures for count
        ]);
        // Extract counts with Array.isArray checks
        const liveData = Array.isArray(liveRes?.data) ? liveRes.data : [];
        const competitionsData = Array.isArray(competitionsRes?.data) ? competitionsRes.data : [];
        const fixturesData = Array.isArray(fixturesRes?.data) ? fixturesRes.data : [];
        const upcomingData = Array.isArray(upcomingRes?.data) ? upcomingRes.data : [];

        const liveMatches = liveData.length;
        const competitions = competitionsData.length;
        const fixtures = fixturesData.length;

        // Count unique teams from competitions
        let teams = 0;
        const teamSet = new Set<string>();
        competitionsData.forEach((comp: any) => {
          if (comp.teams && Array.isArray(comp.teams)) {
            comp.teams.forEach((team: any) => teamSet.add(team._id || team));
          }
        });
        teams = teamSet.size || 12;

        setStats({
          liveMatches,
          competitions,
          teams,
          fixtures,
        });

        // Set next match
        if (upcomingData.length > 0) {
          setNextMatch(upcomingData[0]);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      }
    };

    fetchData();
  }, []);

  // Format date helper
  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === now.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatMatchTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0">

      {/* Hero Section - Clean, Bold, Minimal */}
      <section className="pt-10 pb-6 md:pt-16 md:pb-12 px-0 sm:px-4">
        <div className="container mx-auto max-w-5xl px-2 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-5"
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

      {/* 2025 Wrapped Banner */}
      <section className="py-6 px-0 sm:px-4">
        <div className="container mx-auto max-w-5xl px-2 sm:px-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 p-3 sm:p-6 md:p-12"
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 md:mb-4">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                <span className="text-white/90 text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-wide sm:tracking-widest">Your Year in Sports</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight">
                2025 Wrapped
              </h2>
              <p className="text-white/80 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-xl">
                Relive the unforgettable moments, top performances, and memorable games from FUPRE sports in 2025.
              </p>
              <motion.div
                className="inline-flex items-center gap-2 sm:gap-3 bg-white/20 text-white/60 px-5 py-2.5 sm:px-7 sm:py-3 md:px-8 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg cursor-not-allowed"
              >
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="hidden sm:inline">Coming Soon</span>
                <span className="sm:hidden">Coming Soon</span>
              </motion.div>
            </div>
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -top-10 -right-10 sm:-top-16 sm:-right-16 md:-top-20 md:-right-20 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-2xl sm:blur-3xl"
            />
            <motion.div
              animate={{
                rotate: [360, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -bottom-8 -left-8 sm:-bottom-12 sm:-left-12 md:-bottom-16 md:-left-16 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-emerald-500/20 rounded-full blur-xl sm:blur-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Bar - Minimal horizontal strip */}
      <section className="border-y border-border py-4 sm:py-6">
        <div className="container mx-auto px-0 sm:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            <div className="py-2">
              <span className="text-2xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400">{stats.liveMatches}</span>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Live Matches</p>
            </div>
            <div className="py-2">
              <span className="text-2xl md:text-4xl font-bold">{stats.competitions}</span>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Competitions</p>
            </div>
            <div className="py-2">
              <span className="text-2xl md:text-4xl font-bold">{stats.teams}</span>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Teams</p>
            </div>
            <div className="py-2">
              <span className="text-2xl md:text-4xl font-bold">{stats.fixtures}</span>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Fixtures</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Match - Clean Split Layout */}
      <section className="py-8 md:py-24">
        <div className="container mx-auto px-0 sm:px-4">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold">Next Match</h2>
            <Link href="/sports/competitions" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center">
              All Fixtures <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {nextMatch ? (
            <div className="border border-border rounded-2xl overflow-hidden">
              {/* Competition Header */}
              <div className="bg-secondary/50 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 text-center">
                <span className="text-xs md:text-sm font-medium text-muted-foreground">
                  {nextMatch.competition?.name || 'Competition'}
                </span>
              </div>

              {/* Match Content */}
              <div className="p-3 sm:p-4 md:p-12">
                <div className="flex items-center justify-between gap-2 md:gap-4">
                  {/* Home Team */}
                  <div className="flex-1 text-center min-w-0">
                    <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-secondary mx-auto mb-2 md:mb-4 flex items-center justify-center">
                      <span className="text-lg md:text-3xl font-bold">{nextMatch.homeTeam?.shorthand?.[0] || nextMatch.homeTeam?.name?.[0] || 'H'}</span>
                    </div>
                    <h3 className="font-bold text-sm md:text-xl truncate">{nextMatch.homeTeam?.name || 'Home Team'}</h3>
                  </div>

                  {/* VS */}
                  <div className="flex flex-col items-center px-2 md:px-8 flex-shrink-0">
                    <span className="text-lg md:text-3xl font-bold text-muted-foreground">VS</span>
                  </div>

                  {/* Away Team */}
                  <div className="flex-1 text-center min-w-0">
                    <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-secondary mx-auto mb-2 md:mb-4 flex items-center justify-center">
                      <span className="text-lg md:text-3xl font-bold">{nextMatch.awayTeam?.shorthand?.[0] || nextMatch.awayTeam?.name?.[0] || 'A'}</span>
                    </div>
                    <h3 className="font-bold text-sm md:text-xl truncate">{nextMatch.awayTeam?.name || 'Away Team'}</h3>
                  </div>
                </div>

                {/* Match Details */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 mt-6 md:mt-8 text-xs md:text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{formatMatchDate(nextMatch.scheduledDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{formatMatchTime(nextMatch.scheduledDate)}</span>
                  </div>
                  {nextMatch.venue && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{nextMatch.venue}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-border rounded-2xl p-8 md:p-12 text-center">
              <p className="text-muted-foreground">No upcoming matches scheduled</p>
            </div>
          )}
        </div>
      </section>

      {/* News Section - Clean Minimal */}
      <section className="py-12 md:py-24 border-t border-border">
        <div className="container mx-auto px-0 sm:px-4 max-w-4xl">
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
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-0 sm:px-4">
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
