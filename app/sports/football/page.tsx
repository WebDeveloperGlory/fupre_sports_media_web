'use client';

import Image from "next/image";
import { FC, useEffect, useState, useRef } from "react";
import { Trophy, Calendar, AlertCircle, ArrowRight, Clock, Users, CalendarDays } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { teamLogos } from "@/constants";
import { Loader } from "@/components/ui/loader";
import RecentGames from "@/components/football/RecentGames";
import { footballFixtureApi } from "@/lib/api/v1/football-fixture.api";
import { footballLiveApi } from "@/lib/api/v1/football-live.api";
import { FixtureResponse, LiveFixtureResponse } from "@/lib/types/v1.response.types";
import getLiveFixtureSocketService, { LiveFixtureSocketEvent } from "@/lib/socket/live-fixture-socket.service";

const FootballHomePage: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [liveFixture, setLiveFixture] = useState<LiveFixtureResponse | null>(null);
  const [recentFixtures, setRecentFixtures] = useState<FixtureResponse[]>([]);
  const [recentLoading, setRecentLoading] = useState<boolean>(true);
  const socketService = useRef(getLiveFixtureSocketService());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveRes, recentRes] = await Promise.all([
          footballLiveApi.getActive(),
          footballFixtureApi.getRecentResults(1, 5),
        ]);
        const liveData = Array.isArray(liveRes?.data) ? liveRes.data : [];
        const recentData = Array.isArray(recentRes?.data) ? recentRes.data : [];

        setLiveFixture(liveData.length > 0 ? liveData[0] : null);
        setRecentFixtures(recentData);
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

  // Subscribe to WebSocket updates for live fixture
  useEffect(() => {
    if (!liveFixture?.id) return;

    const socket = socketService.current;
    socket.joinFixture(liveFixture.id);

    // Score updates
    const unsubscribeScore = socket.on(LiveFixtureSocketEvent.SCORE_UPDATE, (payload) => {
      if (payload.fixtureId === liveFixture.id) {
        setLiveFixture(prev => prev ? {
          ...prev,
          result: payload.data.result,
          goalScorers: payload.data.goalScorers || prev.goalScorers
        } : null);
      }
    });

    // Status updates
    const unsubscribeStatus = socket.on(LiveFixtureSocketEvent.STATUS_UPDATE, (payload) => {
      if (payload.fixtureId === liveFixture.id) {
        setLiveFixture(prev => prev ? {
          ...prev,
          status: payload.data.status,
          currentMinute: payload.data.currentMinute,
          injuryTime: payload.data.injuryTime
        } : null);
      }
    });

    // Full update
    const unsubscribeFull = socket.on(LiveFixtureSocketEvent.FULL_UPDATE, (payload) => {
      if (payload.fixtureId === liveFixture.id) {
        setLiveFixture(payload.data);
      }
    });

    // Fixture ended
    const unsubscribeEnded = socket.on(LiveFixtureSocketEvent.FIXTURE_ENDED, (payload) => {
      if (payload.fixtureId === liveFixture.id) {
        setLiveFixture(null);
      }
    });

    return () => {
      socket.leaveFixture(liveFixture.id);
      unsubscribeScore();
      unsubscribeStatus();
      unsubscribeFull();
      unsubscribeEnded();
    };
  }, [liveFixture?.id]);

  if (loading) {
    return <Loader />;
  }

  const liveHomeName = liveFixture?.homeTeam?.name ?? liveFixture?.temporaryHomeTeamName ?? 'Home';
  const liveAwayName = liveFixture?.awayTeam?.name ?? liveFixture?.temporaryAwayTeamName ?? 'Away';
  const liveHomeLogo = teamLogos[liveHomeName] || '/images/team_logos/default.jpg';
  const liveAwayLogo = teamLogos[liveAwayName] || '/images/team_logos/default.jpg';

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Hero Section - Minimal */}
      <section className="pt-10 pb-4 md:pt-16 md:pb-10 px-0 sm:px-4">
        <div className="container mx-auto max-w-5xl px-2 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            {/* Season Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">2025/2026</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Football at <span className="text-emerald-600 dark:text-emerald-400">FUPRE</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Stay updated with live matches, recent results, and all football action
            </p>
          </motion.div>
        </div>
      </section>

      {/* Live Match Section */}
      <section className="py-6 md:py-12">
        <div className="container mx-auto px-0 sm:px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="border border-border rounded-xl md:rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-secondary/50 px-3 py-1.5 sm:px-4 sm:py-3 text-center">
                {liveFixture ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    LIVE NOW
                  </span>
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">Live Match</span>
                )}
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 md:p-10">
                {liveFixture ? (
                  <div>
                    {/* Teams and Score */}
                    <div className="flex items-center justify-between gap-4 md:gap-8">
                      {/* Home Team */}
                      <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="relative w-14 h-14 md:w-20 md:h-20">
                          <Image
                            src={liveHomeLogo}
                            alt={liveHomeName}
                            fill
                            className="object-contain rounded-full"
                          />
                        </div>
                        <span className="text-sm md:text-base font-semibold text-center">
                          {liveHomeName}
                        </span>
                      </div>

                      {/* Score */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-3xl md:text-5xl font-bold tracking-tight">
                          <span>{liveFixture.result?.homeScore ?? 0}</span>
                          <span className="text-muted-foreground mx-2 md:mx-3">-</span>
                          <span>{liveFixture.result?.awayScore ?? 0}</span>
                        </div>
                        {liveFixture.result && liveFixture.result.homePenalty !== null && liveFixture.result.awayPenalty !== null && (
                          <div className="text-xs text-muted-foreground">
                            ({liveFixture.result.homePenalty} - {liveFixture.result.awayPenalty})
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                          <Clock className="w-4 h-4" />
                          <span>{liveFixture.currentMinute ?? 0}'</span>
                        </div>
                      </div>

                      {/* Away Team */}
                      <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="relative w-14 h-14 md:w-20 md:h-20">
                          <Image
                            src={liveAwayLogo}
                            alt={liveAwayName}
                            fill
                            className="object-contain rounded-full"
                          />
                        </div>
                        <span className="text-sm md:text-base font-semibold text-center">
                          {liveAwayName}
                        </span>
                      </div>
                    </div>

                    {/* Match Info */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        <span>{liveFixture.competition?.name || 'Friendly'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Today</span>
                      </div>
                    </div>

                    {/* Watch Live Button */}
                    <div className="mt-6 flex justify-center">
                      <Link
                        href={`/live/${liveFixture.id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-medium transition-colors"
                      >
                        Watch Live
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
                      <AlertCircle className="w-7 h-7 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No Live Match</h3>
                    <p className="text-sm text-muted-foreground">Check back later for live coverage</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Games Section */}
      <section className="py-6 md:py-12 border-y border-border">
        <div className="container mx-auto px-0 sm:px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold">Recent Games</h2>
              <Link href="/sports/football/fixtures" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center">
                All Fixtures <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <RecentGames fixtures={recentFixtures} loading={recentLoading} />
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-0 sm:px-4 max-w-5xl">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Explore</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* TOTS */}
            <div
              aria-disabled="true"
              className="relative p-3 sm:p-4 md:p-6 border border-dashed border-border rounded-xl bg-muted/40 text-muted-foreground cursor-not-allowed"
            >
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 font-semibold">
                Coming Soon
              </span>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1">TOTS</h3>
              <p className="text-xs text-muted-foreground">Vote for your stars</p>
            </div>

            {/* Competitions */}
            <Link
              href="/sports/football/competitions"
              className="group p-3 sm:p-4 md:p-6 border border-border rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                <CalendarDays className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1">Competitions</h3>
              <p className="text-xs text-muted-foreground">Leagues & tournaments</p>
            </Link>

            {/* Fixtures */}
            <Link
              href="/sports/football/fixtures"
              className="group p-3 sm:p-4 md:p-6 border border-border rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1">Fixtures</h3>
              <p className="text-xs text-muted-foreground">Match schedule</p>
            </Link>

            {/* Teams */}
            <Link
              href="/sports/football/teams"
              className="group p-3 sm:p-4 md:p-6 border border-border rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1">Teams</h3>
              <p className="text-xs text-muted-foreground">All participating teams</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FootballHomePage;
