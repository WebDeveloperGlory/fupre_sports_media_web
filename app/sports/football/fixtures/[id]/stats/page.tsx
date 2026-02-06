'use client';

import { BackButton } from "@/components/ui/back-button";
import { Loader } from "@/components/ui/loader";
import Image from "next/image";
import { Trophy, Calendar, Clock, Users, Target, Download, Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import { use, useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { FixtureResponse } from "@/lib/types/v1.response.types";
import { FixtureStatus } from "@/types/v1.football-fixture.types";
import { footballFixtureApi } from "@/lib/api/v1/football-fixture.api";
import { teamLogos } from "@/constants";
import { format } from "date-fns";
import html2canvas from 'html2canvas';

export default function MatchStatsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params);
  const [fixture, setFixture] = useState<FixtureResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'stats'>('details');
  const [showShareCards, setShowShareCards] = useState(false);

  const scoreCardRef = useRef<HTMLDivElement>(null);
  const statsCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFixture = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await footballFixtureApi.getById(resolvedParams.id);

        if (response?.success && response.data) {
          setFixture(response.data);
          setActiveTab(response.data.status === FixtureStatus.SCHEDULED ? 'details' : 'stats');
        } else {
          setError(response?.message || "Fixture not found");
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

  const downloadCard = async (cardRef: React.RefObject<HTMLDivElement | null>, filename: string) => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef!.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const shareCard = async (cardRef: React.RefObject<HTMLDivElement | null>, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this match stats from our app!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return <Loader />;
  if (error || !fixture) notFound();

  const homeTeamName = fixture.homeTeam?.name ?? fixture.temporaryHomeTeamName ?? 'Home Team';
  const awayTeamName = fixture.awayTeam?.name ?? fixture.temporaryAwayTeamName ?? 'Away Team';
  const competitionName = fixture.competition?.name ?? 'Friendly';

  const formattedDate = format(new Date(fixture.scheduledDate), 'MMM dd, yyyy');
  const formattedTime = format(new Date(fixture.scheduledDate), 'HH:mm');

  const totalElapsedGameTime = fixture ? fixture.statistics.home.possessionTime + fixture.statistics.away.possessionTime : 0;
  const homePossession = totalElapsedGameTime > 0 ? (fixture!.statistics.home.possessionTime / totalElapsedGameTime) * 100 : 50;
  const awayPossession = 100 - homePossession;


  // Shareable Cards
  const ScoreCard = () => (
    <div ref={scoreCardRef} className="bg-background p-6 rounded-lg border border-border max-w-md mx-auto">
      <div className="text-center mb-4">
        <div className="text-emerald-600 dark:text-emerald-400 font-bold">{competitionName}</div>
        <div className="text-muted-foreground text-sm">{formattedDate}</div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="w-14 h-14 relative">
            <Image src={teamLogos[homeTeamName] || '/images/team_logos/default.jpg'} alt={homeTeamName} fill className="object-contain rounded-full" />
          </div>
          <span className="text-sm font-medium text-center">{homeTeamName}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {fixture.result.homeScore} - {fixture.result.awayScore}
          </div>
          <div className="text-xs text-muted-foreground">Full Time</div>
        </div>
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="w-14 h-14 relative">
            <Image src={teamLogos[awayTeamName] || '/images/team_logos/default.jpg'} alt={awayTeamName} fill className="object-contain rounded-full" />
          </div>
          <span className="text-sm font-medium text-center">{awayTeamName}</span>
        </div>
      </div>
      <div className="border-t border-border pt-3 text-center">
        <div className="text-xs text-muted-foreground">Get live match updates on</div>
        <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Fupre Sports Media</div>
      </div>
    </div>
  );

  const StatsCard = () => (
    <div ref={statsCardRef} className="bg-background p-6 rounded-lg border border-border max-w-md mx-auto">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold">Match Statistics</span>
        </div>
        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{fixture.result.homeScore} - {fixture.result.awayScore}</div>
      </div>
      {fixture.statistics && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{fixture.statistics.home.shotsOnTarget + fixture.statistics.home.shotsOffTarget}</span>
            <span className="text-muted-foreground">Shots</span>
            <span className="font-medium">{fixture.statistics.away.shotsOnTarget + fixture.statistics.away.shotsOffTarget}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{homePossession.toFixed(0)}%</span>
            <span className="text-muted-foreground">Possession</span>
            <span className="font-medium">{awayPossession.toFixed(0)}%</span>
          </div>
          <div className="flex h-2 bg-secondary rounded-full overflow-hidden">
            <div className="bg-emerald-600 dark:bg-emerald-500" style={{ width: `${homePossession}%` }} />
            <div className="bg-emerald-600/30 dark:bg-emerald-500/30" style={{ width: `${awayPossession}%` }} />
          </div>
        </div>
      )}
      <div className="border-t border-border pt-3 mt-4 text-center">
        <div className="text-xs text-muted-foreground">Get detailed match analysis on</div>
        <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Fupre Sports Media</div>
      </div>
    </div>
  );


  return (
    <main className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="pt-4 pb-8 px-0 sm:px-2 md:px-4">
        <div className="mx-auto max-w-4xl space-y-3 md:space-y-4">
          {/* Back Button */}
          <div className="px-2 md:px-0">
            <BackButton />
          </div>

          {/* Match Header */}
          <div className="border border-border rounded-lg md:rounded-xl overflow-hidden">
            <div className="bg-secondary/50 px-3 py-1.5 sm:px-4 sm:py-2 text-center">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {competitionName}
              </span>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 md:gap-8">
                {/* Home Team */}
                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <div className="relative w-14 h-14 md:w-20 md:h-20">
                    <Image src={teamLogos[homeTeamName] || '/images/team_logos/default.jpg'} alt={homeTeamName} fill className="object-contain rounded-full" />
                  </div>
                  <span className="text-xs md:text-base font-medium text-center truncate w-full">{homeTeamName}</span>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center">
                  {fixture.status === FixtureStatus.COMPLETED ? (
                    <>
                      <div className="text-3xl md:text-4xl font-bold">
                        <span className="text-emerald-600 dark:text-emerald-400">{fixture.result.homeScore}</span>
                        <span className="mx-2 text-muted-foreground">-</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{fixture.result.awayScore}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Full Time</div>
                      {fixture.result.halftimeHomeScore !== null && (
                        <div className="text-xs text-muted-foreground">HT: {fixture.result.halftimeHomeScore} - {fixture.result.halftimeAwayScore}</div>
                      )}
                    </>
                  ) : fixture.status === FixtureStatus.LIVE ? (
                    <>
                      <div className="text-3xl md:text-4xl font-bold">
                        <span className="text-emerald-600 dark:text-emerald-400">{fixture.result.homeScore}</span>
                        <span className="mx-2 text-muted-foreground">-</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{fixture.result.awayScore}</span>
                      </div>
                      <div className="text-xs text-red-500 font-medium mt-1">LIVE</div>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl md:text-4xl font-bold text-muted-foreground">VS</div>
                      <div className="text-xs text-muted-foreground mt-1">Upcoming</div>
                    </>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <div className="relative w-14 h-14 md:w-20 md:h-20">
                    <Image src={teamLogos[awayTeamName] || '/images/team_logos/default.jpg'} alt={awayTeamName} fill className="object-contain rounded-full" />
                  </div>
                  <span className="text-xs md:text-base font-medium text-center truncate w-full">{awayTeamName}</span>
                </div>
              </div>

              {/* Match Details */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formattedDate}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formattedTime}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{fixture.stadium}</span>
                </div>
              </div>

              {/* Share Button */}
              {(fixture.status === FixtureStatus.COMPLETED || fixture.status === FixtureStatus.LIVE) && (
                <div className="flex justify-center mt-4">
                  <button onClick={() => setShowShareCards(!showShareCards)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share Match Cards
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Share Cards Section */}
          {showShareCards && (
            <div className="border border-border rounded-lg p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Share Match Cards
                </h2>
                <button onClick={() => setShowShareCards(false)} className="text-muted-foreground hover:text-foreground p-1">✕</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <ScoreCard />
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => downloadCard(scoreCardRef, 'match-score')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <button onClick={() => shareCard(scoreCardRef, 'Match Score')} className="border border-border hover:bg-secondary px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                </div>

                {fixture.statistics && (
                  <div className="space-y-3">
                    <StatsCard />
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => downloadCard(statsCardRef, 'match-statistics')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                        <Download className="w-4 h-4" /> Download
                      </button>
                      <button onClick={() => shareCard(statsCardRef, 'Match Statistics')} className="border border-border hover:bg-secondary px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                        <Share2 className="w-4 h-4" /> Share
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="border border-border rounded-lg p-1">
            <div className="flex overflow-x-auto scrollbar-hide gap-1">
              {fixture.status === FixtureStatus.SCHEDULED && (
                <button
                  onClick={() => setActiveTab('details')}
                  className={cn("flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                    activeTab === 'details' ? "bg-emerald-600 text-white" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >Details</button>
              )}
              {(fixture.status === FixtureStatus.COMPLETED || fixture.status === FixtureStatus.LIVE) && (
                <>
                  <button
                    onClick={() => setActiveTab('stats')}
                    className={cn("flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                      activeTab === 'stats' ? "bg-emerald-600 text-white" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >Stats</button>
                </>
              )}
            </div>
          </div>

          {/* Tab Content */}
          {fixture.status === FixtureStatus.SCHEDULED && activeTab === 'details' && (
            <div className="border border-border rounded-lg p-4 md:p-6">
              <h2 className="font-bold mb-4">Match Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-secondary rounded-lg">
                  <div className="text-xs text-muted-foreground">Referee</div>
                  <div className="font-medium">{fixture.referee || 'TBD'}</div>
                </div>
                <div className="p-3 bg-secondary rounded-lg">
                  <div className="text-xs text-muted-foreground">Match Type</div>
                  <div className="font-medium capitalize">{fixture.matchType}</div>
                </div>
                {fixture.weather && (
                  <div className="p-3 bg-secondary rounded-lg">
                    <div className="text-xs text-muted-foreground">Weather</div>
                    <div className="font-medium">{fixture.weather.condition}, {fixture.weather.temperature}°C</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {(fixture.status === FixtureStatus.COMPLETED || fixture.status === FixtureStatus.LIVE) && activeTab === 'stats' && (
            <div className="space-y-3">
              {/* Goal Scorers */}
              {fixture.goalScorers && fixture.goalScorers.length > 0 && (
                <div className="border border-border rounded-lg p-4 md:p-6">
                  <h2 className="font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Goal Scorers
                  </h2>
                  <div className="space-y-2">
                    {fixture.goalScorers.map((scorer, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">⚽</span>
                          <div>
                            <div className="font-medium text-sm">{scorer.temporaryPlayerName || 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground">{scorer.temporaryTeamName || 'Unknown'}</div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{scorer.time}'</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Match Statistics */}
              {fixture.statistics && (
                <div className="border border-border rounded-lg p-4 md:p-6">
                  <h2 className="font-bold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Match Statistics
                  </h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Shots', home: fixture.statistics.home.shotsOnTarget + fixture.statistics.home.shotsOffTarget, away: fixture.statistics.away.shotsOnTarget + fixture.statistics.away.shotsOffTarget },
                      { label: 'Shots on Target', home: fixture.statistics.home.shotsOnTarget, away: fixture.statistics.away.shotsOnTarget },
                      { label: 'Fouls', home: fixture.statistics.home.fouls, away: fixture.statistics.away.fouls },
                      { label: 'Yellow Cards', home: fixture.statistics.home.yellowCards, away: fixture.statistics.away.yellowCards },
                      { label: 'Red Cards', home: fixture.statistics.home.redCards, away: fixture.statistics.away.redCards },
                      { label: 'Corners', home: fixture.statistics.home.corners, away: fixture.statistics.away.corners },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="font-bold w-8 text-emerald-600 dark:text-emerald-400">{stat.home}</span>
                        <span className="text-muted-foreground flex-1 text-center">{stat.label}</span>
                        <span className="font-bold w-8 text-right text-emerald-600 dark:text-emerald-400">{stat.away}</span>
                      </div>
                    ))}

                    {/* Possession Bar */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{homePossession.toFixed(0)}%</span>
                        <span className="text-muted-foreground">Possession</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{awayPossession.toFixed(0)}%</span>
                      </div>
                      <div className="flex h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="bg-emerald-600 dark:bg-emerald-500" style={{ width: `${homePossession}%` }} />
                        <div className="bg-emerald-600/30 dark:bg-emerald-500/30" style={{ width: `${awayPossession}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}