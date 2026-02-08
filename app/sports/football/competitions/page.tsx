'use client'

import { Loader } from "@/components/ui/loader";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { footballFixtureApi } from "@/lib/api/v1/football-fixture.api";
import { CompetitionResponse, FixtureResponse } from "@/lib/types/v1.response.types";
import { CompetitionType } from "@/types/v1.football-competition.types";
import { IV2Blog } from "@/utils/V2Utils/v2requestData.types";
import { ArrowRight, ArrowLeft, Bolt, CalendarClock, Crown, Trophy, Users, Flame, CalendarDays, Newspaper } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllBlogs } from "@/lib/requests/v2/admin/media-admin/news-management/requests";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { teamLogos } from "@/constants";

type CompetitionPageData = {
  competitionFixturesCount: number;
  liveCompetitionFixturesCount: number;
  allCompetitions: CompetitionResponse[];
  allActiveCompetitions: CompetitionResponse[];
  featuredCompetitions: CompetitionResponse[];
}

export default function FootballCompetitionsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [pageData, setPageData] = useState<CompetitionPageData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all competitions');
  const [upcomingFixtures, setUpcomingFixtures] = useState<FixtureResponse[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<IV2Blog[]>([]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [competitionsRes, fixturesRes, liveRes, upcomingRes, blogsRes] = await Promise.all([
          footballCompetitionApi.getAll(1, 200),
          footballFixtureApi.getAll(1, 200),
          footballFixtureApi.getLive(),
          footballFixtureApi.getUpcoming(1, 5),
          getAllBlogs(),
        ]);

        const competitionsData = Array.isArray(competitionsRes?.data) ? competitionsRes.data : [];
        const fixturesData = Array.isArray(fixturesRes?.data) ? fixturesRes.data : [];
        const liveData = Array.isArray(liveRes?.data) ? liveRes.data : [];
        const upcomingData = Array.isArray(upcomingRes?.data) ? upcomingRes.data : [];

        setPageData({
          competitionFixturesCount: fixturesRes?.total ?? fixturesData.length,
          liveCompetitionFixturesCount: liveData.length,
          allCompetitions: competitionsData,
          allActiveCompetitions: competitionsData.filter((comp) => comp.isActive),
          featuredCompetitions: competitionsData.filter((comp) => comp.isFeatured),
        });

        setUpcomingFixtures(upcomingData.slice(0, 5));

        if (blogsRes?.code === '00') {
          const published = (blogsRes.data as IV2Blog[]).filter(b => b.isPublished);
          const sorted = published.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setLatestBlogs(sorted.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching competitions page data:', error);
        toast.error('Failed to load page data');
      } finally {
        setLoading(false);
      }
    }

    if (loading) fetchData();
  }, [loading]);

  const filteredCompetitions = pageData?.allCompetitions.filter((competition) => {
    if (activeTab === 'all competitions') return true;
    if (activeTab === 'league') return competition.type === 'league';
    if (activeTab === 'knockout') return competition.type === 'knockout';
    if (activeTab === 'hybrid') return competition.type === 'hybrid';
    return false;
  }) || [];

  if (loading) {
    return <Loader />
  }

  const getTypeColors = (type: string) => {
    switch (type) {
      case CompetitionType.LEAGUE:
        return {
          bg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10',
          border: 'border-emerald-500/30',
          accent: 'text-emerald-500',
          badgeBg: 'bg-emerald-500/10',
          badgeText: 'text-emerald-600 dark:text-emerald-400',
          iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          hoverBorder: 'hover:border-emerald-500/50',
        };
      case CompetitionType.KNOCKOUT:
        return {
          bg: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10',
          border: 'border-purple-500/30',
          accent: 'text-purple-500',
          badgeBg: 'bg-purple-500/10',
          badgeText: 'text-purple-600 dark:text-purple-400',
          iconBg: 'bg-purple-100 dark:bg-purple-900/40',
          iconColor: 'text-purple-600 dark:text-purple-400',
          hoverBorder: 'hover:border-purple-500/50',
        };
      case CompetitionType.HYBRID:
        return {
          bg: 'bg-gradient-to-br from-orange-500/20 to-orange-600/10',
          border: 'border-orange-500/30',
          accent: 'text-orange-500',
          badgeBg: 'bg-orange-500/10',
          badgeText: 'text-orange-600 dark:text-orange-400',
          iconBg: 'bg-orange-100 dark:bg-orange-900/40',
          iconColor: 'text-orange-600 dark:text-orange-400',
          hoverBorder: 'hover:border-orange-500/50',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-500/20 to-gray-600/10',
          border: 'border-gray-500/30',
          accent: 'text-gray-500',
          badgeBg: 'bg-gray-500/10',
          badgeText: 'text-gray-600 dark:text-gray-400',
          iconBg: 'bg-gray-100 dark:bg-gray-900/40',
          iconColor: 'text-gray-600 dark:text-gray-400',
          hoverBorder: 'hover:border-gray-500/50',
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
            <Flame className="w-3 h-3" />
            <span className="hidden sm:inline">Live</span>
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium">
            <CalendarDays className="w-3 h-3" />
            <span className="hidden sm:inline">Upcoming</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
            <Trophy className="w-3 h-3" />
            <span className="hidden sm:inline">Completed</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getCompetitionIcon = (type: string) => {
    switch (type) {
      case CompetitionType.LEAGUE:
        return <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />;
      case CompetitionType.KNOCKOUT:
        return <Crown className="w-5 h-5 sm:w-6 sm:h-6" />;
      case CompetitionType.HYBRID:
        return <Bolt className="w-5 h-5 sm:w-6 sm:h-6" />;
      default:
        return <CalendarClock className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-emerald-500/30">
      {/* Hero Section with Gradient Background */}
      <section className="relative pt-6 sm:pt-24 pb-10 sm:pb-16 overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[400px] sm:h-[600px] bg-emerald-500/10 rounded-full blur-[100px] sm:blur-[120px] -z-10 dark:bg-emerald-500/5 animate-pulse" />
        <div className="absolute top-20 right-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-emerald-500/5 rounded-full blur-[80px] sm:blur-[100px] -z-10" />

        <div className="container px-0 sm:px-4 lg:px-6 mx-auto max-w-7xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 sm:mb-8"
          >
            <Link
              href="/sports/football"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </motion.div>

          <div className="flex flex-col gap-4 sm:gap-8">
            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-2 sm:space-y-4"
            >
              <div className="inline-flex items-center rounded-full border px-2.5 sm:px-3 py-1 text-xs font-semibold bg-secondary text-secondary-foreground">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                Season 2024/2025
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/60">
                Football Competitions
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
                Explore all football competitions at FUPRE. Follow leagues, knockout tournaments, and hybrid events.
              </p>
            </motion.div>

            {/* Stats Cards - Horizontal scroll on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              <Card className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">{pageData?.allCompetitions.length || 0}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mt-1">Total</div>
                </div>
              </Card>

              <Card className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-500 flex items-center justify-center gap-1">
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                    {pageData?.liveCompetitionFixturesCount || 0}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mt-1">Live</div>
                </div>
              </Card>

              <Card className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">{pageData?.competitionFixturesCount || 0}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mt-1">Matches</div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Highlights: Fixtures + News */}
      <section className="py-6 sm:py-12 bg-secondary/30 border-y border-border/50">
        <div className="container px-0 sm:px-4 lg:px-6 mx-auto max-w-7xl">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
          >
            {/* Upcoming Fixtures */}
            <motion.div variants={item}>
              <Card className="h-full p-4 sm:p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold">Fixtures</h2>
                  </div>
                  <Link href="/sports/football/fixtures" className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-500 font-medium flex items-center gap-1">
                    View all
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Link>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {upcomingFixtures.length > 0 ? (
                    upcomingFixtures.slice(0, 3).map((fx) => (
                      <Link
                        key={fx.id}
                        href={`/sports/football/fixtures/${fx.id}/stats`}
                        className="group block rounded-xl border border-border/50 hover:border-emerald-500/30 bg-background/50 hover:bg-emerald-500/5 transition-all duration-300 p-3 sm:p-4"
                      >
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <div className="text-[10px] sm:text-xs text-muted-foreground bg-secondary px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                            {fx.scheduledDate ? format(new Date(fx.scheduledDate), 'EEE, MMM d - HH:mm') : 'TBD'}
                          </div>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-foreground">
                          {fx.homeTeam?.name ?? fx.temporaryHomeTeamName ?? 'Home'} <span className="text-muted-foreground font-normal">vs</span> {fx.awayTeam?.name ?? fx.temporaryAwayTeamName ?? 'Away'}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-muted-foreground">
                      <CalendarDays className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-xs sm:text-sm">No upcoming fixtures</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Latest News */}
            <motion.div variants={item}>
              <Card className="h-full p-4 sm:p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Newspaper className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold">News</h2>
                  </div>
                  <Link href="/news" className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-500 font-medium flex items-center gap-1">
                    View all
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Link>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {latestBlogs.length > 0 ? (
                    latestBlogs.slice(0, 3).map((blog) => (
                      <Link
                        key={blog._id}
                        href={`/news/${blog._id}`}
                        className="group block rounded-xl border border-border/50 hover:border-emerald-500/30 bg-background/50 hover:bg-emerald-500/5 transition-all duration-300 p-3 sm:p-4"
                      >
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <span className="text-[10px] sm:text-xs text-emerald-600 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
                            {blog.category}
                          </span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-foreground line-clamp-1">{blog.title}</div>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mt-1">{blog.content.slice(0, 60)}...</p>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-6 sm:py-8 text-muted-foreground">
                      <Newspaper className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-xs sm:text-sm">No news articles yet</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-4 sm:py-8 bg-background">
        <div className="container px-0 sm:px-4 lg:px-6 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 sm:gap-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold">Browse</h2>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {filteredCompetitions.length} found
              </span>
            </div>

            {/* Pill Tabs - Horizontal scroll on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {[
                { id: 'all competitions', label: 'All', icon: CalendarClock },
                { id: 'league', label: 'League', icon: Trophy },
                { id: 'knockout', label: 'Knockout', icon: Crown },
                { id: 'hybrid', label: 'Hybrid', icon: Bolt },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300',
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Competition List */}
      <section className="pb-10 sm:pb-16 bg-background">
        <div className="container px-0 sm:px-4 lg:px-6 mx-auto max-w-7xl">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-3 sm:gap-4"
          >
            {filteredCompetitions.length > 0 ? (
              filteredCompetitions.map((comp) => {
                const colors = getTypeColors(comp.type);
                const leaderTeamId = comp.leagueTable?.[0]?.team;
                const leaderTeam = leaderTeamId
                  ? comp.teams?.find((team) => team.id === leaderTeamId)
                  : null;
                const competitionImage = comp.logo || comp.coverImage || null;
                const competitionShort =
                  comp.shorthand ||
                  comp.name
                    ?.split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 4)
                    .toUpperCase() ||
                  'COMP';

                return (
                  <motion.div key={comp.id} variants={item}>
                    <Link href={`/sports/football/competitions/${comp.id}`}>
                      <Card className={cn(
                        "group p-4 sm:p-6 bg-card/50 backdrop-blur-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                        colors.border,
                        colors.hoverBorder
                      )}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                          {/* Icon & Info */}
                          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                            {/* Type Icon */}
                            <div className={cn(
                              "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0",
                              colors.iconBg
                            )}>
                              {competitionImage ? (
                                <img
                                  src={competitionImage}
                                  alt={`${comp.name} logo`}
                                  className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                                  loading="lazy"
                                  onError={(event) => {
                                    (event.currentTarget as HTMLImageElement).src = '/images/team_logos/default.jpg';
                                  }}
                                />
                              ) : (
                                <span className={`text-xs sm:text-sm font-bold tracking-wide ${colors.iconColor}`}>
                                  {competitionShort}
                                </span>
                              )}
                            </div>

                            {/* Competition Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1 sm:mb-2">
                                <h3 className="text-base sm:text-xl font-bold text-foreground truncate max-w-[180px] sm:max-w-none">
                                  {comp.name}
                                </h3>
                                <span className={cn(
                                  "px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium uppercase",
                                  colors.badgeBg,
                                  colors.badgeText
                                )}>
                                  {comp.type}
                                </span>
                                {getStatusBadge(comp.status)}
                              </div>

                              <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4 max-w-2xl hidden sm:block">
                                {comp.description}
                              </p>

                              {/* Stats Row - Responsive grid */}
                              <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-6 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                                  <span className="font-semibold">{comp.teams.length}</span>
                                  <span className="text-muted-foreground hidden xs:inline">Teams</span>
                                </div>

                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <CalendarClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                                  <span className="font-semibold capitalize text-xs sm:text-sm">{comp.currentStage || 'Registration'}</span>
                                </div>

                                {comp.type === CompetitionType.LEAGUE && comp.leagueTable && comp.leagueTable?.length > 0 && leaderTeam && (
                                  <div className="hidden sm:flex items-center gap-2">
                                    <Crown className="w-4 h-4 text-amber-500" />
                                    <span className="font-semibold text-emerald-600 truncate max-w-[100px]">{leaderTeam.name}</span>
                                    <span className="text-muted-foreground">Leaders</span>
                                  </div>
                                )}

                                {comp.season && (
                                  <div className="hidden md:flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-semibold">{comp.season}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Arrow */}
                          <div className="hidden sm:flex items-center pr-2">
                            <ArrowRight className={cn(
                              "w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground transition-all duration-300",
                              "group-hover:translate-x-2 group-hover:text-emerald-500"
                            )} />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 sm:py-20"
              >
                <Card className="max-w-sm sm:max-w-md mx-auto p-6 sm:p-8 bg-card/50 backdrop-blur-sm border-border/50 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-secondary flex items-center justify-center">
                    {activeTab === 'all competitions' && <CalendarClock className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/50" />}
                    {activeTab === 'league' && <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/50" />}
                    {activeTab === 'knockout' && <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/50" />}
                    {activeTab === 'hybrid' && <Bolt className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/50" />}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">No competitions found</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {activeTab === 'all competitions'
                      ? "No competitions available. Check back later."
                      : `No ${activeTab} competitions running. Try a different filter.`
                    }
                  </p>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}


