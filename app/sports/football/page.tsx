"use client";

import Image from "next/image";
import { FC, useEffect, useState, useCallback } from "react";
import {
  Trophy,
  Calendar,
  AlertCircle,
  ArrowRight,
  Clock,
  Users,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { teamLogos } from "@/constants";
import { Loader } from "@/components/ui/loader";
import RecentGames from "@/components/football/RecentGames";
import { footballFixtureApi } from "@/lib/api/v1/football-fixture.api";
import {
  FixtureResponse,
  LiveFixtureResponse,
} from "@/lib/types/v1.response.types";
import { footballLiveApi } from "@/lib/api/v1/football-live.api";
import { LiveStatus } from "@/types/v1.football-live.types";
import { toast } from "react-toastify";

const FootballHomePage: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [recentFixtures, setRecentFixtures] = useState<FixtureResponse[]>([]);
  const [recentLoading, setRecentLoading] = useState<boolean>(true);

  // Store all active fixtures and get the first one as "live"
  const [activeFixtures, setActiveFixtures] = useState<LiveFixtureResponse[]>(
    [],
  );
  const [socketConnected, setSocketConnected] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveRes, recentRes] = await Promise.all([
          footballLiveApi.getAll(),
          footballFixtureApi.getRecentResults(1, 5),
        ]);

        if (liveRes.success && liveRes.total > 0) {
          setActiveFixtures(liveRes.data);
        } else {
          setActiveFixtures([]);
        }

        const recentData = Array.isArray(recentRes?.data) ? recentRes.data : [];
        setRecentFixtures(recentData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setActiveFixtures([]);
        setRecentFixtures([]);
      } finally {
        setLoading(false);
        setRecentLoading(false);
      }
    };

    fetchData();
  }, []);

  // Setup WebSocket connection for all active fixtures
  useEffect(() => {
    let socket: any = null;
    let isConnected = false;

    const connectToSocket = async () => {
      try {
        // Dynamically import the socket service only on client side
        const socketModule =
          await import("@/lib/socket/live-fixture-socket.service");
        const { getLiveFixtureSocketService, LiveFixtureSocketEvent } =
          socketModule;

        socket = getLiveFixtureSocketService();

        // Join all active fixtures room
        socket.joinAllActive();
        setSocketConnected(true);

        // Listen for fixture updates
        const unsubscribeUpdates = socket.on(
          LiveFixtureSocketEvent.FULL_UPDATE,
          (payload: any) => {
            setActiveFixtures((prev) => {
              const existingIndex = prev.findIndex(
                (f) => f.id === payload.fixtureId,
              );
              if (existingIndex >= 0) {
                // Update existing fixture
                const updated = [...prev];
                updated[existingIndex] = payload.data;
                return updated;
              } else {
                // Add new fixture if it's active
                const status = payload.data.status;
                const isActive = [
                  LiveStatus.FIRSTHALF,
                  LiveStatus.HALFTIME,
                  LiveStatus.SECONDHALF,
                  LiveStatus.EXTRATIME,
                  LiveStatus.PENALTIES,
                ].includes(status);

                if (isActive) {
                  return [payload.data, ...prev];
                }
                return prev;
              }
            });
          },
        );

        // Listen for status updates
        const unsubscribeStatus = socket.on(
          LiveFixtureSocketEvent.STATUS_UPDATE,
          (payload: any) => {
            setActiveFixtures((prev) => {
              const existingIndex = prev.findIndex(
                (f) => f.id === payload.fixtureId,
              );
              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                  ...updated[existingIndex],
                  status: payload.data.status,
                  currentMinute: payload.data.currentMinute,
                  injuryTime: payload.data.injuryTime,
                };
                return updated;
              }
              return prev;
            });
          },
        );

        // Listen for score updates
        const unsubscribeScore = socket.on(
          LiveFixtureSocketEvent.SCORE_UPDATE,
          (payload: any) => {
            setActiveFixtures((prev) => {
              const existingIndex = prev.findIndex(
                (f) => f.id === payload.fixtureId,
              );
              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                  ...updated[existingIndex],
                  result: payload.data.result,
                  goalScorers:
                    payload.data.goalScorers ||
                    updated[existingIndex].goalScorers,
                };
                return updated;
              }
              return prev;
            });
          },
        );

        // Listen for fixture ended
        const unsubscribeEnded = socket.on(
          LiveFixtureSocketEvent.FIXTURE_ENDED,
          (payload: any) => {
            setActiveFixtures((prev) => {
              const existingIndex = prev.findIndex(
                (f) => f.id === payload.fixtureId,
              );
              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                  ...updated[existingIndex],
                  status: LiveStatus.FINISHED,
                };
                return updated;
              }
              return prev;
            });
          },
        );

        // Listen for fixture created (new live fixture)
        const unsubscribeCreated = socket.on(
          LiveFixtureSocketEvent.FIXTURE_CREATED,
          (payload: any) => {
            setActiveFixtures((prev) => [payload.data, ...prev]);
          },
        );

        // Cleanup function
        return () => {
          unsubscribeUpdates();
          unsubscribeStatus();
          unsubscribeScore();
          unsubscribeEnded();
          unsubscribeCreated();
          if (socket) {
            socket.leaveAllActive();
          }
          setSocketConnected(false);
        };
      } catch (error) {
        console.error("Error setting up WebSocket:", error);
      }
    };

    const cleanupPromise = connectToSocket();

    return () => {
      cleanupPromise.then((cleanup) => {
        if (cleanup) cleanup();
      });
    };
  }, []);

  // Get the first live fixture (most recent)
  const liveFixture = activeFixtures.length > 0 ? activeFixtures[0] : null;

  if (loading) {
    return <Loader />;
  }

  const liveHomeName =
    liveFixture?.homeTeam?.name ?? liveFixture?.temporaryHomeTeamName ?? "Home";
  const liveAwayName =
    liveFixture?.awayTeam?.name ?? liveFixture?.temporaryAwayTeamName ?? "Away";
  const liveHomeLogo =
    liveFixture?.homeTeam?.logo ||
    teamLogos[liveHomeName] ||
    "/images/team_logos/default.jpg";
  const liveAwayLogo =
    liveFixture?.awayTeam?.logo ||
    teamLogos[liveAwayName] ||
    "/images/team_logos/default.jpg";

  // Determine if the fixture is actually live or has ended
  const isFixtureActive =
    liveFixture &&
    [
      LiveStatus.FIRSTHALF,
      LiveStatus.HALFTIME,
      LiveStatus.SECONDHALF,
      LiveStatus.EXTRATIME,
      LiveStatus.PENALTIES,
    ].includes(liveFixture.status);

  const isFixtureEnded =
    liveFixture && liveFixture.status === LiveStatus.FINISHED;

  // Function to get match status text
  const getMatchStatusText = () => {
    if (!liveFixture) return "";

    switch (liveFixture.status) {
      case LiveStatus.FINISHED:
        return "FULL TIME";
      case LiveStatus.POSTPONED:
        return "POSTPONED";
      case LiveStatus.ABANDONED:
        return "ABANDONED";
      default:
        return "LIVE";
    }
  };

  // Function to get status badge color
  const getStatusBadgeColor = () => {
    if (!liveFixture) return "bg-gray-500/10 text-gray-500";

    switch (liveFixture.status) {
      case LiveStatus.FINISHED:
        return "bg-blue-500/10 text-blue-500";
      case LiveStatus.POSTPONED:
        return "bg-amber-500/10 text-amber-500";
      case LiveStatus.ABANDONED:
        return "bg-rose-500/10 text-rose-500";
      default:
        return "bg-red-500/10 text-red-500";
    }
  };

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
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                2025/2026
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Football at{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                FUPRE
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Stay updated with live matches, recent results, and all football
              action
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
              <div className="bg-secondary/50 px-3 py-1.5 sm:px-4 sm:py-3 text-center flex items-center justify-center gap-2">
                {liveFixture ? (
                  <>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor()}`}
                    >
                      {isFixtureActive && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                      {getMatchStatusText()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${socketConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {socketConnected ? "Live" : "Connecting..."}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">
                    Live Match
                  </span>
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
                            sizes="(max-width: 768px) 56px, 80px"
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
                          <span className="text-muted-foreground mx-2 md:mx-3">
                            -
                          </span>
                          <span>{liveFixture.result?.awayScore ?? 0}</span>
                        </div>
                        {liveFixture.result &&
                          liveFixture.result.homePenalty !== null &&
                          liveFixture.result.awayPenalty !== null && (
                            <div className="text-xs text-muted-foreground">
                              ({liveFixture.result.homePenalty} -{" "}
                              {liveFixture.result.awayPenalty})
                            </div>
                          )}
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          {isFixtureActive ? (
                            <>
                              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-emerald-600 dark:text-emerald-400">
                                {liveFixture.currentMinute ?? 0}'
                              </span>
                              {liveFixture.injuryTime > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  +{liveFixture.injuryTime}
                                </span>
                              )}
                            </>
                          ) : isFixtureEnded ? (
                            <span className="text-blue-500">Full Time</span>
                          ) : (
                            <span className="text-muted-foreground">
                              {liveFixture.status}
                            </span>
                          )}
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
                            sizes="(max-width: 768px) 56px, 80px"
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
                        <span>
                          {liveFixture.competition?.name || "Friendly"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Today</span>
                      </div>
                    </div>

                    {/* Watch Live / View Details Button */}
                    <div className="mt-6 flex justify-center">
                      <Link
                        href={`/live/${liveFixture.id}`}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                          isFixtureActive
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-secondary hover:bg-secondary/80 text-foreground"
                        }`}
                      >
                        {isFixtureActive ? "Watch Live" : "View Details"}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
                      <AlertCircle className="w-7 h-7 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      No Live Match
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Check back later for live coverage
                    </p>
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
              <Link
                href="/sports/football/fixtures"
                className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center"
              >
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
              <p className="text-xs text-muted-foreground">
                Vote for your stars
              </p>
            </div>

            {/* Competitions */}
            <Link
              href="/sports/football/competitions"
              className="group p-3 sm:p-4 md:p-6 border border-border rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                <CalendarDays className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1">
                Competitions
              </h3>
              <p className="text-xs text-muted-foreground">
                Leagues & tournaments
              </p>
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
              <p className="text-xs text-muted-foreground">
                All participating teams
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FootballHomePage;
