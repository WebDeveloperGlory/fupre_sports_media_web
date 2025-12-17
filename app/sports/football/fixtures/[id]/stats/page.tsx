'use client';

import { BackButton } from "@/components/ui/back-button";
import { Loader } from "@/components/ui/loader";
import Image from "next/image";
import { Trophy, Calendar, Clock, Users, Target, Star, Crown, Award, ThumbsUp, Download, Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import { use, useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { PopIV2FootballFixture } from "@/utils/V2Utils/v2requestData.types";
import { FixtureStatus } from "@/utils/V2Utils/v2requestData.enums";
import { getFixtureById } from "@/lib/requests/v2/fixtures/requests";
import { teamLogos } from "@/constants";
import { format } from "date-fns";
import html2canvas from 'html2canvas';

export default function MatchStatsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params);
  const [fixture, setFixture] = useState<PopIV2FootballFixture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'lineups' | 'stats' | 'ratings'>('details');
  const [showShareCards, setShowShareCards] = useState(false);

  const scoreCardRef = useRef<HTMLDivElement>(null);
  const potmCardRef = useRef<HTMLDivElement>(null);
  const statsCardRef = useRef<HTMLDivElement>(null);
  const ratingsCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFixture = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFixtureById(resolvedParams.id);

        if (response && response.data) {
          setFixture(response.data);
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

  const formattedDate = format(new Date(fixture.scheduledDate), 'MMM dd, yyyy');
  const formattedTime = format(new Date(fixture.scheduledDate), 'HH:mm');

  const totalElapsedGameTime = fixture ? fixture.statistics.home.possessionTime + fixture.statistics.away.possessionTime : 0;
  const homePossession = totalElapsedGameTime > 0 ? (fixture!.statistics.home.possessionTime / totalElapsedGameTime) * 100 : 50;
  const awayPossession = 100 - homePossession;

  const getPositionColor = (position: string) => {
    const pos = position?.toLowerCase();
    if (pos?.includes('gk') || pos?.includes('goalkeeper')) return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
    if (pos?.includes('def') || pos?.includes('back')) return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
    if (pos?.includes('mid')) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
    if (pos?.includes('for') || pos?.includes('att') || pos?.includes('wing')) return 'bg-red-500/10 text-red-600 border-red-500/30';
    return 'bg-secondary text-muted-foreground border-border';
  };

  // Shareable Cards
  const ScoreCard = () => (
    <div ref={scoreCardRef} className="bg-background p-6 rounded-lg border border-border max-w-md mx-auto">
      <div className="text-center mb-4">
        <div className="text-emerald-600 dark:text-emerald-400 font-bold">{fixture.competition.name}</div>
        <div className="text-muted-foreground text-sm">{formattedDate}</div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="w-14 h-14 relative">
            <Image src={teamLogos[fixture.homeTeam.name] || '/images/team_logos/default.jpg'} alt={fixture.homeTeam.name} fill className="object-contain rounded-full" />
          </div>
          <span className="text-sm font-medium text-center">{fixture.homeTeam.name}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {fixture.result.homeScore} - {fixture.result.awayScore}
          </div>
          <div className="text-xs text-muted-foreground">Full Time</div>
        </div>
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="w-14 h-14 relative">
            <Image src={teamLogos[fixture.awayTeam.name] || '/images/team_logos/default.jpg'} alt={fixture.awayTeam.name} fill className="object-contain rounded-full" />
          </div>
          <span className="text-sm font-medium text-center">{fixture.awayTeam.name}</span>
        </div>
      </div>
      <div className="border-t border-border pt-3 text-center">
        <div className="text-xs text-muted-foreground">Get live match updates on</div>
        <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Fupre Sports Media</div>
      </div>
    </div>
  );

  const POTMCard = () => (
    <div ref={potmCardRef} className="bg-background p-6 rounded-lg border border-border max-w-md mx-auto">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-amber-500" />
          <span className="font-bold">Player of the Match</span>
        </div>
        <div className="text-sm text-muted-foreground">{fixture.homeTeam.name} vs {fixture.awayTeam.name}</div>
      </div>
      {fixture.playerOfTheMatch?.official && (
        <div className="bg-secondary rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-xl">👑</div>
            <div>
              <div className="font-bold text-lg">{fixture.playerOfTheMatch.official.name}</div>
              <div className="text-sm text-muted-foreground">{fixture.playerOfTheMatch.official.department}</div>
            </div>
          </div>
        </div>
      )}
      <div className="border-t border-border pt-3 text-center">
        <div className="text-xs text-muted-foreground">View detailed player ratings on</div>
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

  const RatingsCard = () => {
    const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
    const topRatedPlayers = fixture.playerRatings?.sort((a, b) => b.official ? b.official.rating - a.official.rating : 0) || [];
    if (topRatedPlayers.length === 0) return null;
    const topRatedPlayer = topRatedPlayers[selectedPlayerIndex];

    return (
      <div ref={ratingsCardRef} className="bg-background p-6 rounded-lg border border-border max-w-md mx-auto">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold">Player Rating</span>
          </div>
        </div>
        {topRatedPlayers.length > 1 && (
          <div className="flex items-center justify-center gap-3 mb-4">
            <button onClick={() => setSelectedPlayerIndex(prev => Math.max(0, prev - 1))} disabled={selectedPlayerIndex === 0} className="p-1.5 rounded-lg bg-secondary disabled:opacity-50">←</button>
            <span className="text-sm">{selectedPlayerIndex + 1} of {topRatedPlayers.length}</span>
            <button onClick={() => setSelectedPlayerIndex(prev => Math.min(topRatedPlayers.length - 1, prev + 1))} disabled={selectedPlayerIndex === topRatedPlayers.length - 1} className="p-1.5 rounded-lg bg-secondary disabled:opacity-50">→</button>
          </div>
        )}
        <div className="bg-secondary rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-bold text-lg">{topRatedPlayer.player.name}</div>
              <div className="text-sm text-muted-foreground">{topRatedPlayer.player.department}</div>
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{topRatedPlayer.official.rating.toFixed(1)}</div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-background rounded-lg">
              <div className="font-bold text-emerald-600 dark:text-emerald-400">{topRatedPlayer.stats.goals}</div>
              <div className="text-xs text-muted-foreground">Goals</div>
            </div>
            <div className="p-2 bg-background rounded-lg">
              <div className="font-bold text-blue-600">{topRatedPlayer.stats.assists}</div>
              <div className="text-xs text-muted-foreground">Assists</div>
            </div>
            <div className="p-2 bg-background rounded-lg">
              <div className="font-bold text-orange-600">{topRatedPlayer.stats.shots}</div>
              <div className="text-xs text-muted-foreground">Shots</div>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-3 mt-4 text-center">
          <div className="text-xs text-muted-foreground">Rate players on</div>
          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Fupre Sports Media</div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="pt-4 pb-8 px-2 md:px-4">
        <div className="mx-auto max-w-4xl space-y-3 md:space-y-4">
          {/* Back Button */}
          <div className="px-2 md:px-0">
            <BackButton />
          </div>

          {/* Match Header */}
          <div className="border border-border rounded-lg md:rounded-xl overflow-hidden">
            <div className="bg-secondary/50 px-4 py-2 text-center">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {fixture.competition.name}
              </span>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 md:gap-8">
                {/* Home Team */}
                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <div className="relative w-14 h-14 md:w-20 md:h-20">
                    <Image src={teamLogos[fixture.homeTeam.name] || '/images/team_logos/default.jpg'} alt={fixture.homeTeam.name} fill className="object-contain rounded-full" />
                  </div>
                  <span className="text-xs md:text-base font-medium text-center truncate w-full">{fixture.homeTeam.name}</span>
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
                    <Image src={teamLogos[fixture.awayTeam.name] || '/images/team_logos/default.jpg'} alt={fixture.awayTeam.name} fill className="object-contain rounded-full" />
                  </div>
                  <span className="text-xs md:text-base font-medium text-center truncate w-full">{fixture.awayTeam.name}</span>
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

                {fixture.playerOfTheMatch && (
                  <div className="space-y-3">
                    <POTMCard />
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => downloadCard(potmCardRef, 'player-of-match')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                        <Download className="w-4 h-4" /> Download
                      </button>
                      <button onClick={() => shareCard(potmCardRef, 'Player of the Match')} className="border border-border hover:bg-secondary px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                        <Share2 className="w-4 h-4" /> Share
                      </button>
                    </div>
                  </div>
                )}

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

                {fixture.playerRatings && fixture.playerRatings.length > 0 && (
                  <div className="space-y-3">
                    <RatingsCard />
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => downloadCard(ratingsCardRef, 'player-rating')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                        <Download className="w-4 h-4" /> Download
                      </button>
                      <button onClick={() => shareCard(ratingsCardRef, 'Player Rating')} className="border border-border hover:bg-secondary px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
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
                  <button
                    onClick={() => setActiveTab('ratings')}
                    className={cn("flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                      activeTab === 'ratings' ? "bg-emerald-600 text-white" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >Ratings</button>
                </>
              )}
              <button
                onClick={() => setActiveTab('lineups')}
                className={cn("flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                  activeTab === 'lineups' ? "bg-emerald-600 text-white" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >Lineups</button>
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
                            <div className="font-medium text-sm">{scorer.player ? scorer.player.name : 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground">{scorer.team ? scorer.team.name : 'Unknown'}</div>
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

          {/* Ratings Tab */}
          {(fixture.status === FixtureStatus.COMPLETED || fixture.status === FixtureStatus.LIVE) && activeTab === 'ratings' && (
            <div className="space-y-3">
              {/* POTM Section */}
              {fixture.playerOfTheMatch && (
                <div className="border border-border rounded-lg p-4 md:p-6">
                  <h2 className="font-bold mb-4 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    Player of the Match
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Official */}
                    <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="font-medium text-sm text-amber-600">Official Selection</span>
                      </div>
                      {fixture.playerOfTheMatch.official ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-lg">👑</div>
                          <div>
                            <div className="font-bold">{fixture.playerOfTheMatch.official.name}</div>
                            <div className="text-xs text-muted-foreground">{fixture.playerOfTheMatch.official.position}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">Not selected yet</div>
                      )}
                    </div>

                    {/* Fan Votes */}
                    <div className="border border-blue-500/30 bg-blue-500/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ThumbsUp className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-sm text-blue-600">Fan Favorite</span>
                      </div>
                      {fixture.playerOfTheMatch.fanVotes && fixture.playerOfTheMatch.fanVotes.length > 0 ? (
                        <div className="space-y-2">
                          {fixture.playerOfTheMatch.fanVotes.slice(0, 3).map((vote, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold",
                                  index === 0 ? "bg-amber-500" : index === 1 ? "bg-gray-400" : "bg-orange-400"
                                )}>{index + 1}</span>
                                <span className="font-medium">{vote.player.name}</span>
                              </div>
                              <span className="text-blue-600">{vote.votes} votes</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No votes yet</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Player Ratings */}
              {fixture.playerRatings && fixture.playerRatings.length > 0 && (
                <div className="border border-border rounded-lg p-4 md:p-6">
                  <h2 className="font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Player Ratings
                  </h2>

                  {/* Home Team */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Image src={teamLogos[fixture.homeTeam.name] || '/images/team_logos/default.jpg'} alt="" width={20} height={20} className="rounded-full" />
                      {fixture.homeTeam.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {fixture.playerRatings.filter(r => r.team === 'home').sort((a, b) => (b.official?.rating || 0) - (a.official?.rating || 0)).map((rating, idx) => (
                        <div key={idx} className="border border-border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-medium">{rating.player.name}</div>
                              <span className={cn("inline-block px-2 py-0.5 rounded text-xs border mt-1", getPositionColor(rating.player.position || ''))}>{rating.player.position}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{rating.official ? rating.official.rating.toFixed(1) : '-'}</div>
                              <div className="text-xs text-muted-foreground">Official</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Fan: {rating.fanRatings.average.toFixed(1)} ({rating.fanRatings.count})</span>
                            <span>G: {rating.stats.goals} A: {rating.stats.assists}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Away Team */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Image src={teamLogos[fixture.awayTeam.name] || '/images/team_logos/default.jpg'} alt="" width={20} height={20} className="rounded-full" />
                      {fixture.awayTeam.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {fixture.playerRatings.filter(r => r.team === 'away').sort((a, b) => (b.official?.rating || 0) - (a.official?.rating || 0)).map((rating, idx) => (
                        <div key={idx} className="border border-border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-medium">{rating.player.name}</div>
                              <span className={cn("inline-block px-2 py-0.5 rounded text-xs border mt-1", getPositionColor(rating.player.position || ''))}>{rating.player.position}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{rating.official ? rating.official.rating.toFixed(1) : '-'}</div>
                              <div className="text-xs text-muted-foreground">Official</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Fan: {rating.fanRatings.average.toFixed(1)} ({rating.fanRatings.count})</span>
                            <span>G: {rating.stats.goals} A: {rating.stats.assists}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lineups Tab */}
          {activeTab === 'lineups' && (
            <div className="border border-border rounded-lg p-4 md:p-6">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Team Lineups
              </h2>

              {fixture.lineups ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Home Team */}
                  <div>
                    <h3 className="font-medium text-center mb-3 flex items-center justify-center gap-2">
                      <Image src={teamLogos[fixture.homeTeam.name] || '/images/team_logos/default.jpg'} alt="" width={20} height={20} className="rounded-full" />
                      {fixture.homeTeam.name}
                    </h3>
                    <div className="text-center text-sm text-muted-foreground bg-secondary rounded-lg py-2 mb-3">
                      Formation: <span className="font-medium">{fixture.lineups.home.formation}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">Starting XI</div>
                      {fixture.lineups.home.startingXI.map((player, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2.5 border border-border rounded-lg">
                          <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{player.shirtNumber}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm truncate">{player.player.name}</span>
                              {player.isCaptain && <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold">C</span>}
                            </div>
                          </div>
                          <span className={cn("px-2 py-0.5 rounded text-xs border", getPositionColor(player.position))}>{player.position}</span>
                        </div>
                      ))}

                      {fixture.lineups.home.substitutes && fixture.lineups.home.substitutes.length > 0 && (
                        <>
                          <div className="text-sm font-medium text-blue-600 mt-4 mb-2">Substitutes</div>
                          {fixture.lineups.home.substitutes.map((player, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 border border-border/50 rounded-lg">
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{player.shirtNumber}</div>
                              <span className="font-medium text-sm flex-1 truncate">{player.player.name}</span>
                              <span className={cn("px-2 py-0.5 rounded text-xs border", getPositionColor(player.position))}>{player.position}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Away Team */}
                  <div>
                    <h3 className="font-medium text-center mb-3 flex items-center justify-center gap-2">
                      <Image src={teamLogos[fixture.awayTeam.name] || '/images/team_logos/default.jpg'} alt="" width={20} height={20} className="rounded-full" />
                      {fixture.awayTeam.name}
                    </h3>
                    <div className="text-center text-sm text-muted-foreground bg-secondary rounded-lg py-2 mb-3">
                      Formation: <span className="font-medium">{fixture.lineups.away.formation}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">Starting XI</div>
                      {fixture.lineups.away.startingXI.map((player, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2.5 border border-border rounded-lg">
                          <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{player.shirtNumber}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm truncate">{player.player.name}</span>
                              {player.isCaptain && <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold">C</span>}
                            </div>
                          </div>
                          <span className={cn("px-2 py-0.5 rounded text-xs border", getPositionColor(player.position))}>{player.position}</span>
                        </div>
                      ))}

                      {fixture.lineups.away.substitutes && fixture.lineups.away.substitutes.length > 0 && (
                        <>
                          <div className="text-sm font-medium text-blue-600 mt-4 mb-2">Substitutes</div>
                          {fixture.lineups.away.substitutes.map((player, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 border border-border/50 rounded-lg">
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{player.shirtNumber}</div>
                              <span className="font-medium text-sm flex-1 truncate">{player.player.name}</span>
                              <span className={cn("px-2 py-0.5 rounded text-xs border", getPositionColor(player.position))}>{player.position}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">Lineups not available yet</div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}