'use client';

import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { Trophy, Calendar, AlertCircle, ArrowRight, Activity, Clock, Users, CalendarDays } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { teamLogos } from "@/constants";
import { Loader } from "@/components/ui/loader";
import { Card } from "@/components/ui/card";
import RecentGames from "@/components/football/RecentGames";
import { getAllLiveFixtures, getLiveFixtureById } from "@/lib/requests/v2/admin/super-admin/live-management/requests";
import { IV2FootballLiveFixture, PopIV2FootballFixture } from "@/utils/V2Utils/v2requestData.types";
import { getRecentFixtures } from "@/lib/requests/v2/public/requests";

const FootballHomePage: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [liveFixture, setLiveFixture] = useState<IV2FootballLiveFixture | null>(null);
  const [recentFixtures, setRecentFixtures] = useState<PopIV2FootballFixture[]>([]);
  const [recentLoading, setRecentLoading] = useState<boolean>(true);

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
        const liveData = await getAllLiveFixtures();
        if (liveData && liveData.code === '00' && liveData.data && liveData.data.length > 0) {
          try {
            const data = await getLiveFixtureById(liveData.data[0].fixture);
            if (data && data.code === '00') {
              setLiveFixture(data.data);
            }
          } catch (error) {
            console.error('Error fetching live fixture details:', error);
            setLiveFixture(null);
          }
        } else {
          setLiveFixture(null);
        }

        const recentData = await getRecentFixtures();
        if (recentData && recentData.code === '00') {
          setRecentFixtures(recentData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLiveFixture(null);
        setRecentFixtures([]);
      } finally {
        setLoading(false);
        setRecentLoading(false);
      }
    };

    if (loading) {
      fetchData();
    }
  }, [loading]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="relative pt-4 sm:pt-12 pb-8 sm:pb-12 overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[400px] sm:h-[600px] bg-emerald-500/10 rounded-full blur-[100px] sm:blur-[120px] -z-10 dark:bg-emerald-500/5 animate-pulse" />

        <div className="container px-4 sm:px-6 mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-10"
          >
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-secondary text-secondary-foreground">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Season 2024/2025
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/60">
              Football at <span className="text-emerald-500">FUPRE</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto">
              Stay updated with live matches, recent results, and all football action
            </p>
          </motion.div>

          {/* Live Match Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {liveFixture && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>
                </div>

                {liveFixture ? (
                  <div className="bg-background/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border/50">
                    <div className="flex items-center justify-between gap-4 sm:gap-8">
                      {/* Home Team */}
                      <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1">
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
                          <Image
                            src={teamLogos[liveFixture.homeTeam.name] || '/images/team_logos/default.jpg'}
                            alt={liveFixture.homeTeam.name}
                            fill
                            className="object-contain rounded-full"
                          />
                        </div>
                        <span className="text-xs sm:text-sm lg:text-base font-semibold text-center leading-tight">
                          {liveFixture.homeTeam.name}
                        </span>
                      </div>

                      {/* Score */}
                      <div className="flex flex-col items-center gap-1 sm:gap-2">
                        <div className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                          <span>{liveFixture.result.homeScore}</span>
                          <span className="text-muted-foreground mx-2 sm:mx-3">-</span>
                          <span>{liveFixture.result.awayScore}</span>
                        </div>
                        {liveFixture.result.homePenalty !== null && liveFixture.result.awayPenalty !== null && (
                          <div className="text-[10px] sm:text-xs text-muted-foreground">
                            ({liveFixture.result.homePenalty} - {liveFixture.result.awayPenalty})
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-600 font-medium">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{liveFixture.currentMinute}'</span>
                        </div>
                      </div>

                      {/* Away Team */}
                      <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1">
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
                          <Image
                            src={teamLogos[liveFixture.awayTeam.name] || '/images/team_logos/default.jpg'}
                            alt={liveFixture.awayTeam.name}
                            fill
                            className="object-contain rounded-full"
                          />
                        </div>
                        <span className="text-xs sm:text-sm lg:text-base font-semibold text-center leading-tight">
                          {liveFixture.awayTeam.name}
                        </span>
                      </div>
                    </div>

                    {/* Match Info */}
                    <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="truncate max-w-[100px] sm:max-w-full">{liveFixture.competition?.name || 'Friendly'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>Today</span>
                      </div>
                    </div>

                    {/* Watch Live Button - Now at bottom */}
                    <div className="mt-4 sm:mt-6 flex justify-center">
                      <Link
                        href={`/live/${liveFixture.fixture}`}
                        className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-medium transition-all hover:scale-105"
                      >
                        Watch Live
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-secondary flex items-center justify-center mb-3 sm:mb-4">
                      <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1">No Live Match</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Check back later for live coverage</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Recent Games Section */}
      <section className="py-6 sm:py-10 bg-secondary/20 border-y border-border/50">
        <div className="container px-4 sm:px-6 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Recent Games</h2>
            </div>

            <RecentGames fixtures={recentFixtures} loading={recentLoading} />
          </motion.div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-8 sm:py-12">
        <div className="container px-4 sm:px-6 mx-auto max-w-6xl">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
          >
            {/* TOTS Card */}
            <motion.div variants={item}>
              <Link href="/sports/football/tots">
                <Card className="group relative overflow-hidden p-4 sm:p-6 bg-gradient-to-br from-amber-500/20 to-amber-600/5 border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-[50px] group-hover:bg-amber-500/20 transition-all" />

                  <div className="relative flex items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Team of the Season</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Vote for your favorite players</p>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* Competitions Card */}
            <motion.div variants={item}>
              <Link href="/sports/football/competitions">
                <Card className="group relative overflow-hidden p-4 sm:p-6 bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-[50px] group-hover:bg-emerald-500/20 transition-all" />

                  <div className="relative flex items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">All Competitions</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Browse leagues and tournaments</p>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* Fixtures Card */}
            <motion.div variants={item}>
              <Link href="/sports/football/fixtures">
                <Card className="group relative overflow-hidden p-4 sm:p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-[50px] group-hover:bg-blue-500/20 transition-all" />

                  <div className="relative flex items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Fixtures</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Upcoming matches schedule</p>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* Teams Card */}
            <motion.div variants={item}>
              <Link href="/sports/football/teams">
                <Card className="group relative overflow-hidden p-4 sm:p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-[50px] group-hover:bg-purple-500/20 transition-all" />

                  <div className="relative flex items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Teams</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">View all participating teams</p>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FootballHomePage;
