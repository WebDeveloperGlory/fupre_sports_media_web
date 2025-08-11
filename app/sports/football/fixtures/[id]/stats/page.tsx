'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import { Loader } from "@/components/ui/loader";
import Image from "next/image";
import { Trophy, Calendar, Clock, Users, History, Swords, Target, AlertCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PopIV2FootballFixture } from "@/utils/V2Utils/v2requestData.types";
import { FixtureStatus } from "@/utils/V2Utils/v2requestData.enums";
import { getFixtureById } from "@/lib/requests/v2/fixtures/requests";
import { teamLogos } from "@/constants";
import { format } from "date-fns";

export default function MatchStatsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params);
  const [fixture, setFixture] = useState<PopIV2FootballFixture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'lineups' | 'stats'>('details');

  useEffect(() => {
    const fetchFixture = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFixtureById(resolvedParams.id);

        if (response && response.data) {
          setFixture(response.data);
          // Set default tab based on fixture status
          setActiveTab(response.data.status === FixtureStatus.SCHEDULED ? 'details' : 'stats');
        } else {
          setError("Fixture not found");
        }
      } catch (err) {
        console.error("Error fetching fixture:", err);
        setError("Failed to load fixture data");
      } finally {
        setLoading(false);
      }
    };

    fetchFixture();
  }, [resolvedParams.id]);

  if (loading) {
    return <Loader />;
  }

  if (error || !fixture) {
    notFound();
  }

  const formattedDate = format(new Date(fixture.scheduledDate), 'MMM dd, yyyy');
  const formattedTime = format(new Date(fixture.scheduledDate), 'HH:mm');

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Back Button */}
      <div className="fixed top-4 left-3 md:top-8 md:left-8 z-10">
        <BackButton />
      </div>

      <div className="pt-12 pb-4 md:pt-4 md:pb-6">
        <BlurFade>
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {/* Match Header */}
            <div className="relative bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
              
              <div className="relative">
                <div className="text-center mb-3 md:mb-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-2.5 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                    <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    <span>{fixture.competition.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 md:gap-8">
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-2 md:gap-3 w-1/3">
                    <motion.div
                      className="relative w-12 h-12 md:w-20 md:h-20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src={teamLogos[fixture.homeTeam.name] || '/images/team_logos/default.jpg'}
                        alt={fixture.homeTeam.name}
                        fill
                        className="object-contain rounded-full"
                      />
                    </motion.div>
                    <span className="text-xs md:text-base font-medium text-center">
                      {fixture.homeTeam.name}
                    </span>
                  </div>

                  {/* Center Section - VS or Score */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-card shadow-xl rounded-lg md:rounded-xl p-2 md:p-3 border border-border min-w-[90px] md:min-w-[120px] text-center">
                      {fixture.status === FixtureStatus.COMPLETED ? (
                        <>
                          <div className="text-2xl md:text-4xl font-bold tracking-tighter">
                            <span className="text-emerald-500">{fixture.result.homeScore}</span>
                            <span className="mx-2 md:mx-3 text-muted-foreground">-</span>
                            <span className="text-emerald-500">{fixture.result.awayScore}</span>
                          </div>
                          <div className="flex items-center justify-center gap-1 md:gap-1.5 mt-0.5 md:mt-1 text-[10px] md:text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            <span>Full Time</span>
                          </div>
                        </>
                      ) : fixture.status === FixtureStatus.LIVE ? (
                        <>
                          <div className="text-2xl md:text-4xl font-bold tracking-tighter">
                            <span className="text-emerald-500">{fixture.result.homeScore}</span>
                            <span className="mx-2 md:mx-3 text-muted-foreground">-</span>
                            <span className="text-emerald-500">{fixture.result.awayScore}</span>
                          </div>
                          <div className="flex items-center justify-center gap-1 md:gap-1.5 mt-0.5 md:mt-1 text-[10px] md:text-xs text-red-500">
                            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            <span>LIVE</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-2xl md:text-4xl font-bold tracking-tighter text-center">
                            <span className="text-muted-foreground">VS</span>
                          </div>
                          <div className="flex items-center justify-center gap-1 md:gap-1.5 mt-0.5 md:mt-1 text-[10px] md:text-xs text-muted-foreground capitalize">
                            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            <span>{fixture.status === FixtureStatus.SCHEDULED ? 'Upcoming' : fixture.status}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-2 md:gap-3 w-1/3">
                    <motion.div
                      className="relative w-12 h-12 md:w-20 md:h-20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src={teamLogos[fixture.awayTeam.name] || '/images/team_logos/default.jpg'}
                        alt={fixture.awayTeam.name}
                        fill
                        className="object-contain rounded-full"
                      />
                    </motion.div>
                    <span className="text-xs md:text-base font-medium text-center">
                      {fixture.awayTeam.name}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mt-3 md:mt-4">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{fixture.competition.name}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{formattedTime}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{fixture.stadium}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              {fixture.status === FixtureStatus.SCHEDULED && (
                <button
                  onClick={() => setActiveTab('details')}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors",
                    activeTab === 'details'
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Details
                </button>
              )}
              {(fixture.status === FixtureStatus.COMPLETED || fixture.status === FixtureStatus.LIVE) && (
                <button
                  onClick={() => setActiveTab('stats')}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors",
                    activeTab === 'stats'
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Stats
                </button>
              )}
              <button
                onClick={() => setActiveTab('lineups')}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  activeTab === 'lineups'
                    ? "text-emerald-500 border-b-2 border-emerald-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Lineups
              </button>
            </div>

            {/* Tab Content */}
            {fixture.status === FixtureStatus.SCHEDULED && activeTab === 'details' && (
              <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-emerald-500" />
                  Match Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="text-sm text-muted-foreground">Referee</div>
                    <div className="font-medium">{fixture.referee || 'TBD'}</div>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="text-sm text-muted-foreground">Match Type</div>
                    <div className="font-medium capitalize">{fixture.matchType}</div>
                  </div>
                  {fixture.weather && (
                    <div className="p-4 bg-secondary rounded-lg">
                      <div className="text-sm text-muted-foreground">Weather</div>
                      <div className="font-medium">{fixture.weather.condition}, {fixture.weather.temperature}°C</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(fixture.status === FixtureStatus.COMPLETED || fixture.status === FixtureStatus.LIVE) && activeTab === 'stats' && (
              <div className="space-y-6">
                {/* Goal Scorers */}
                {fixture.goalScorers && fixture.goalScorers.length > 0 && (
                  <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-500" />
                      Goal Scorers
                    </h2>
                    <div className="space-y-3">
                      {fixture.goalScorers.map((scorer, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              ⚽
                            </div>
                            <div>
                              <div className="font-medium">{scorer.player}</div>
                              <div className="text-sm text-muted-foreground">{scorer.team}</div>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-emerald-500">
                            {scorer.time}'
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Match Statistics */}
                {fixture.statistics && (
                  <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-emerald-500" />
                      Match Statistics
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{fixture.statistics.home.shotsOnTarget + fixture.statistics.home.shotsOffTarget}</span>
                        <span className="text-sm text-muted-foreground">Shots</span>
                        <span className="text-sm font-medium">{fixture.statistics.away.shotsOnTarget + fixture.statistics.away.shotsOffTarget}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{fixture.statistics.home.shotsOnTarget}</span>
                        <span className="text-sm text-muted-foreground">Shots on Target</span>
                        <span className="text-sm font-medium">{fixture.statistics.away.shotsOnTarget}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{fixture.statistics.home.possessionTime}%</span>
                        <span className="text-sm text-muted-foreground">Possession</span>
                        <span className="text-sm font-medium">{fixture.statistics.away.possessionTime}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{fixture.statistics.home.fouls}</span>
                        <span className="text-sm text-muted-foreground">Fouls</span>
                        <span className="text-sm font-medium">{fixture.statistics.away.fouls}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{fixture.statistics.home.yellowCards}</span>
                        <span className="text-sm text-muted-foreground">Yellow Cards</span>
                        <span className="text-sm font-medium">{fixture.statistics.away.yellowCards}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{fixture.statistics.home.redCards}</span>
                        <span className="text-sm text-muted-foreground">Red Cards</span>
                        <span className="text-sm font-medium">{fixture.statistics.away.redCards}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{fixture.statistics.home.corners}</span>
                        <span className="text-sm text-muted-foreground">Corners</span>
                        <span className="text-sm font-medium">{fixture.statistics.away.corners}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'lineups' && (
              <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-500" />
                  Team Lineups
                </h2>
                {fixture.lineups ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Home Team Lineup */}
                    <div>
                      <h3 className="font-semibold mb-3 text-center">{fixture.homeTeam.name}</h3>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground mb-2">Formation: {fixture.lineups.home.formation}</div>
                        <div className="text-sm font-medium mb-2">Starting XI:</div>
                        {fixture.lineups.home.startingXI.map((player, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                            <span className="text-sm">{player.player.name}</span>
                            <span className="text-xs text-muted-foreground">{player.position}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Away Team Lineup */}
                    <div>
                      <h3 className="font-semibold mb-3 text-center">{fixture.awayTeam.name}</h3>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground mb-2">Formation: {fixture.lineups.away.formation}</div>
                        <div className="text-sm font-medium mb-2">Starting XI:</div>
                        {fixture.lineups.away.startingXI.map((player, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                            <span className="text-sm">{player.player.name}</span>
                            <span className="text-xs text-muted-foreground">{player.position}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Lineups not available yet
                  </div>
                )}
              </div>
            )}
          </div>
        </BlurFade>
      </div>
    </main>
  );
}
