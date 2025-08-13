'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import { Loader } from "@/components/ui/loader";
import Image from "next/image";
import { Trophy, Calendar, Clock, Users, History, Swords, Target, AlertCircle, Star, Crown, Award, ThumbsUp, Download, Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import { use, useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

  // Refs for share cards
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

  // Function to download card as image
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

  // Function to share card
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
      // Fallback - copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !fixture) {
    notFound();
  }

  const formattedDate = format(new Date(fixture.scheduledDate), 'MMM dd, yyyy');
  const formattedTime = format(new Date(fixture.scheduledDate), 'HH:mm');

  const totalElapsedGameTime = fixture ? fixture.statistics.home.possessionTime + fixture.statistics.away.possessionTime : 0;
  const homePossession = totalElapsedGameTime > 0 ? ( fixture!.statistics.home.possessionTime / totalElapsedGameTime ) * 100 : 50;
  const awayPossession = 100 - homePossession;

  // Helper function to get star rating display
  const getStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(Math.max(0, 10 - Math.ceil(rating)))].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Helper function to get position badge color
  const getPositionColor = (position: string) => {
    const pos = position?.toLowerCase();
    if (pos?.includes('gk') || pos?.includes('goalkeeper')) return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    if (pos?.includes('def') || pos?.includes('back')) return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    if (pos?.includes('mid')) return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (pos?.includes('for') || pos?.includes('att') || pos?.includes('wing')) return 'bg-red-500/10 text-red-600 border-red-500/20';
    return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  };

  // Shareable Cards Components
  const ScoreCard = () => (
    <div ref={scoreCardRef} className="bg-card p-6 rounded-xl shadow-lg max-w-md mx-auto border border-muted-foreground z-10">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-emerald-600 font-bold text-lg">{fixture.competition.name}</div>
        <div className="text-muted-foreground text-sm">{formattedDate}</div>
      </div>

      {/* Teams and Score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="w-16 h-16 relative">
            <Image
              src={teamLogos[fixture.homeTeam.name] || '/images/team_logos/default.jpg'}
              alt={fixture.homeTeam.name}
              fill
              className="object-contain rounded-full"
            />
          </div>
          <span className="text-sm font-medium text-center">
            {fixture.homeTeam.name}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold text-emerald-600">
            {fixture.result.homeScore} - {fixture.result.awayScore}
          </div>
          <div className="text-xs">Full Time</div>
          {/* Half Time Score if available */}
          {fixture.result.halftimeHomeScore !== null && fixture.result.halftimeAwayScore !== null && (
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              HT: {fixture.result.halftimeHomeScore} - {fixture.result.halftimeAwayScore}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="w-16 h-16 relative">
            <Image
              src={teamLogos[fixture.awayTeam.name] || '/images/team_logos/default.jpg'}
              alt={fixture.awayTeam.name}
              fill
              className="object-contain rounded-full"
            />
          </div>
          <span className="text-sm font-medium text-center">
            {fixture.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Goal Scorers */}
      {fixture.goalScorers && fixture.goalScorers.length > 0 && (
        <div className="border-t pt-3">
          <div className="text-sm font-semibold mb-2">Goal Scorers</div>
          {fixture.goalScorers.slice(0, 4).map((scorer, index) => (
            <div key={index} className="text-xs text-muted-foreground mb-1">
              ⚽ {scorer.player?.name} {scorer.time}'
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="border-t pt-3 mt-3 text-center">
        <div className="text-xs text-muted-foreground">Get live match updates on</div>
        <div className="text-sm font-semibold text-emerald-600">Fupre Sports Media</div>
      </div>
    </div>
  );

  const POTMCard = () => (
    <div ref={potmCardRef} className="bg-card p-6 rounded-xl shadow-lg max-w-md mx-auto border border-muted-foreground">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          <span className="text-lg font-bold">Player of the Match</span>
        </div>
        <div className="text-sm">{fixture.homeTeam.name} vs {fixture.awayTeam.name}</div>
      </div>

      {/* POTM */}
      {fixture.playerOfTheMatch?.official && (
        <div className="bg-primary-foreground rounded-lg p-4 mb-4 border border-muted-foreground">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              👑
            </div>
            <div>
              <div className="font-bold text-lg">{fixture.playerOfTheMatch.official.name}</div>
              <div className="text-sm text-muted-foreground">{fixture.playerOfTheMatch.official.department}</div>
              <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full inline-block mt-1">
                {fixture.playerOfTheMatch.official.position}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 5 Ratings */}
      {fixture.playerRatings && fixture.playerRatings.length > 0 && (
        <div>
          <div className="text-sm font-semibold text-muted-foreground mb-3">Top Rated Players</div>
          <div className="space-y-2">
            {fixture.playerRatings
              .sort((a, b) => b.official.rating - a.official.rating)
              .slice(0, 5)
              .map((rating, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-primary-foreground rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{rating.player.name}</div>
                      <div className="text-xs text-muted-foreground">{rating.player.position}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {rating.official.rating.toFixed(1)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="border-t pt-3 mt-4 text-center">
        <div className="text-xs text-muted-foreground">View detailed player ratings on</div>
        <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Fupre Sports Media</div>
      </div>
    </div>
  );

  const StatsCard = () => (
    <div ref={statsCardRef} className="bg-card p-6 rounded-xl shadow-lg max-w-md mx-auto border border-muted-foreground">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-emerald-500" />
          <span className="text-lg font-bold">Match Statistics</span>
        </div>
        <div className="text-sm">{fixture.homeTeam.name} vs {fixture.awayTeam.name}</div>
        <div className="text-lg font-bold text-emerald-600 mt-2">
          {fixture.result.homeScore} - {fixture.result.awayScore}
        </div>
      </div>

      {/* Stats */}
      {fixture.statistics && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{fixture.statistics.home.shotsOnTarget + fixture.statistics.home.shotsOffTarget}</span>
            <span className="text-sm text-muted-foreground font-medium">Shots</span>
            <span className="text-sm font-medium">{fixture.statistics.away.shotsOnTarget + fixture.statistics.away.shotsOffTarget}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{fixture.statistics.home.shotsOnTarget}</span>
            <span className="text-sm text-muted-foreground font-medium">Shots on Target</span>
            <span className="text-sm font-medium">{fixture.statistics.away.shotsOnTarget}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{homePossession.toFixed(1)}%</span>
            <span className="text-sm text-muted-foreground font-medium">Possession</span>
            <span className="text-sm font-medium">{awayPossession.toFixed(1)}%</span>
          </div>

          {/* Possession Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full" 
              style={{ width: `${homePossession}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium ">{fixture.statistics.home.fouls}</span>
            <span className="text-sm text-muted-foreground">Fouls</span>
            <span className="text-sm font-medium ">{fixture.statistics.away.fouls}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium ">{fixture.statistics.home.yellowCards}</span>
            <span className="text-sm text-muted-foreground">Yellow Cards</span>
            <span className="text-sm font-medium ">{fixture.statistics.away.yellowCards}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium ">{fixture.statistics.home.corners}</span>
            <span className="text-sm text-muted-foreground">Corners</span>
            <span className="text-sm font-medium ">{fixture.statistics.away.corners}</span>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="border-t pt-3 mt-4 text-center">
        <div className="text-xs text-muted-foreground">Get detailed match analysis on</div>
        <div className="text-sm font-semibold text-emerald-600">Fupre Sports Media</div>
      </div>
    </div>
  );

  const RatingsCard = () => {
    const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
    const topRatedPlayers = fixture.playerRatings?.sort((a, b) => b.official.rating - a.official.rating) || [];
    
    if (topRatedPlayers.length === 0) return null;

    const topRatedPlayer = topRatedPlayers[selectedPlayerIndex];

    return (
      <div ref={ratingsCardRef} className="bg-card p-6 rounded-xl shadow-lg max-w-md mx-auto border border-muted-foreground">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-5 h-5 text-emerald-500" />
            <span className="text-lg font-bold">Player Rating</span>
          </div>
          <div className="text-sm">{fixture.homeTeam.name} vs {fixture.awayTeam.name}</div>
        </div>

        {/* Player Selector */}
        {topRatedPlayers.length > 1 && (
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setSelectedPlayerIndex(prev => Math.max(0, prev - 1))}
                disabled={selectedPlayerIndex === 0}
                className="p-1 rounded-full bg-secondary disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="text-sm font-medium">
                {selectedPlayerIndex + 1} of {topRatedPlayers.length}
              </div>
              <button
                onClick={() => setSelectedPlayerIndex(prev => Math.min(topRatedPlayers.length - 1, prev + 1))}
                disabled={selectedPlayerIndex === topRatedPlayers.length - 1}
                className="p-1 rounded-full bg-secondary disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Player Card */}
        <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="font-bold text-xl">{topRatedPlayer.player.name}</div>
              <div className="text-sm">{topRatedPlayer.player.department}</div>
              <div className={cn(
                "inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 border",
                getPositionColor(topRatedPlayer.player.position || '')
              )}>
                {topRatedPlayer.player.position}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-500">
                {topRatedPlayer.official.rating.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Official Rating</div>
            </div>
          </div>

          {/* Fan Rating */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Fan Rating</span>
              <span className="text-sm font-medium">
                {topRatedPlayer.fanRatings.average.toFixed(1)} ({topRatedPlayer.fanRatings.count} votes)
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(Math.floor(topRatedPlayer.fanRatings.average))].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              {topRatedPlayer.fanRatings.average % 1 >= 0.5 && (
                <div className="relative">
                  <Star className="w-4 h-4" />
                  <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              )}
              {[...Array(Math.max(0, 10 - Math.ceil(topRatedPlayer.fanRatings.average)))].map((_, i) => (
                <Star key={`empty-${i}`} className="w-4 h-4" />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-background rounded">
              <div className="font-bold text-emerald-500">{topRatedPlayer.stats.goals}</div>
              <div className="text-xs text-muted-foreground">Goals</div>
            </div>
            <div className="text-center p-2 bg-background rounded">
              <div className="font-bold text-blue-500">{topRatedPlayer.stats.assists}</div>
              <div className="text-xs text-muted-foreground">Assists</div>
            </div>
            <div className="text-center p-2 bg-background rounded">
              <div className="font-bold text-orange-500">{topRatedPlayer.stats.shots}</div>
              <div className="text-xs text-muted-foreground">Shots</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="border-t pt-3 mt-4 text-center">
          <div className="text-xs text-muted-foreground">Rate players and view all ratings on</div>
          <div className="text-sm font-semibold text-emerald-600">Fupre Sports Media</div>
        </div>
      </div>
    );
  };

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

                {/* Share Button */}
                {(fixture.status === FixtureStatus.COMPLETED || fixture.status === FixtureStatus.LIVE) && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setShowShareCards(!showShareCards)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Match Cards
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Shareable Cards Modal/Section */}
            <AnimatePresence>
              {showShareCards && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-emerald-500" />
                      Share Match Cards
                    </h2>
                    <button
                      onClick={() => setShowShareCards(false)}
                      className="text-muted-foreground hover:text-foreground p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Score Card */}
                    <div className="space-y-3">
                      <ScoreCard />
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => downloadCard(scoreCardRef, 'match-score')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button
                          onClick={() => shareCard(scoreCardRef, 'Match Score')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>

                    {/* POTM Card */}
                    {fixture.playerOfTheMatch && (
                      <div className="space-y-3">
                        <POTMCard />
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => downloadCard(potmCardRef, 'player-of-match')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          <button
                            onClick={() => shareCard(potmCardRef, 'Player of the Match')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
                          >
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Stats Card */}
                    {fixture.statistics && (
                      <div className="space-y-3">
                        <StatsCard />
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => downloadCard(statsCardRef, 'match-statistics')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          <button
                            onClick={() => shareCard(statsCardRef, 'Match Statistics')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
                          >
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Individual Rating Card */}
                    {fixture.playerRatings && fixture.playerRatings.length > 0 && (
                      <div className="space-y-3">
                        <RatingsCard />
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => downloadCard(ratingsCardRef, 'player-rating')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          <button
                            onClick={() => shareCard(ratingsCardRef, 'Player Rating')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
                          >
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex border-b border-border overflow-x-auto">
              {fixture.status === FixtureStatus.SCHEDULED && (
                <button
                  onClick={() => setActiveTab('details')}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    activeTab === 'details'
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Details
                </button>
              )}
              {(fixture.status === FixtureStatus.COMPLETED || fixture.status === FixtureStatus.LIVE) && (
                <>
                  <button
                    onClick={() => setActiveTab('stats')}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                      activeTab === 'stats'
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Stats
                  </button>
                  <button
                    onClick={() => setActiveTab('ratings')}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                      activeTab === 'ratings'
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Ratings & POTM
                  </button>
                </>
              )}
              <button
                onClick={() => setActiveTab('lineups')}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
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
                              <div className="font-medium">{scorer.player ? scorer.player.name : 'Unknown'}</div>
                              <div className="text-sm text-muted-foreground">{scorer.team ? scorer.team.name : 'Unknown'}</div>
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
                        <span className="text-sm font-medium">{homePossession.toFixed(1)}%</span>
                        <span className="text-sm text-muted-foreground">Possession</span>
                        <span className="text-sm font-medium">{awayPossession.toFixed(1)}%</span>
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

            {/* Player Ratings & POTM Tab */}
            {(fixture.status === FixtureStatus.COMPLETED || fixture.status === FixtureStatus.LIVE) && activeTab === 'ratings' && (
              <div className="space-y-6">
                {/* Player of the Match Section */}
                {fixture.playerOfTheMatch && (
                  <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      Player of the Match
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Official POTM */}
                      <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Award className="w-5 h-5 text-yellow-500" />
                          <h3 className="font-semibold text-yellow-600">Official Selection</h3>
                        </div>
                        {fixture.playerOfTheMatch.official ? (
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              👑
                            </div>
                            <div>
                              <div className="font-medium text-lg">{fixture.playerOfTheMatch.official.name}</div>
                              <div className="text-sm text-muted-foreground">{fixture.playerOfTheMatch.official.department}</div>
                              <div className={cn(
                                "inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 border",
                                getPositionColor(fixture.playerOfTheMatch.official.position || '')
                              )}>
                                {fixture.playerOfTheMatch.official.position}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-4">
                            No official selection yet
                          </div>
                        )}
                      </div>

                      {/* Fan Votes POTM */}
                      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <ThumbsUp className="w-5 h-5 text-blue-500" />
                          <h3 className="font-semibold text-blue-600">Fan Favorite</h3>
                        </div>
                        {fixture.playerOfTheMatch.fanVotes && fixture.playerOfTheMatch.fanVotes.length > 0 ? (
                          <div className="space-y-3">
                            {fixture.playerOfTheMatch.fanVotes.slice(0, 3).map((vote, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
                                    index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-400"
                                  )}>
                                    {index + 1}
                                  </div>
                                  <div>
                                    <div className="font-medium">{vote.player.name}</div>
                                    <div className="text-xs text-muted-foreground">{vote.player.position}</div>
                                  </div>
                                </div>
                                <div className="text-sm font-medium text-blue-600">
                                  {vote.votes} votes
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-4">
                            No fan votes yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Player Ratings Section */}
                {fixture.playerRatings && fixture.playerRatings.length > 0 && (
                  <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <Star className="w-5 h-5 text-emerald-500" />
                      Player Ratings
                    </h2>

                    {/* Home Team Ratings */}
                    <div className="mb-8">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Image
                          src={teamLogos[fixture.homeTeam.name] || '/images/team_logos/default.jpg'}
                          alt={fixture.homeTeam.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        {fixture.homeTeam.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fixture.playerRatings
                          .filter(rating => rating.team === 'home')
                          .sort((a, b) => b.official.rating - a.official.rating)
                          .map((rating, index) => (
                            <motion.div
                              key={index}
                              className="bg-secondary/50 rounded-lg p-4 border border-border/50"
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="font-medium">{rating.player.name}</div>
                                  <div className="text-sm text-muted-foreground">{rating.player.department}</div>
                                  <div className={cn(
                                    "inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 border",
                                    getPositionColor(rating.player.position || '')
                                  )}>
                                    {rating.player.position}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-emerald-500">
                                    {rating.official.rating.toFixed(1)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Official</div>
                                </div>
                              </div>
                              
                              {/* Fan Rating */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-muted-foreground">Fan Rating</span>
                                  <span className="text-sm font-medium">{rating.fanRatings.average.toFixed(1)} ({rating.fanRatings.count} votes)</span>
                                </div>
                                {getStarRating(rating.fanRatings.average)}
                              </div>

                              {/* Player Stats */}
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="text-center p-2 bg-background rounded">
                                  <div className="font-medium text-emerald-500">{rating.stats.goals}</div>
                                  <div className="text-muted-foreground">Goals</div>
                                </div>
                                <div className="text-center p-2 bg-background rounded">
                                  <div className="font-medium text-blue-500">{rating.stats.assists}</div>
                                  <div className="text-muted-foreground">Assists</div>
                                </div>
                                <div className="text-center p-2 bg-background rounded">
                                  <div className="font-medium text-orange-500">{rating.stats.shots}</div>
                                  <div className="text-muted-foreground">Shots</div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </div>

                    {/* Away Team Ratings */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Image
                          src={teamLogos[fixture.awayTeam.name] || '/images/team_logos/default.jpg'}
                          alt={fixture.awayTeam.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        {fixture.awayTeam.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fixture.playerRatings
                          .filter(rating => rating.team === 'away')
                          .sort((a, b) => b.official.rating - a.official.rating)
                          .map((rating, index) => (
                            <motion.div
                              key={index}
                              className="bg-secondary/50 rounded-lg p-4 border border-border/50"
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="font-medium">{rating.player.name}</div>
                                  <div className="text-sm text-muted-foreground">{rating.player.department}</div>
                                  <div className={cn(
                                    "inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 border",
                                    getPositionColor(rating.player.position || '')
                                  )}>
                                    {rating.player.position}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-emerald-500">
                                    {rating.official.rating.toFixed(1)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Official</div>
                                </div>
                              </div>
                              
                              {/* Fan Rating */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-muted-foreground">Fan Rating</span>
                                  <span className="text-sm font-medium">{rating.fanRatings.average.toFixed(1)} ({rating.fanRatings.count} votes)</span>
                                </div>
                                {getStarRating(rating.fanRatings.average)}
                              </div>

                              {/* Player Stats */}
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="text-center p-2 bg-background rounded">
                                  <div className="font-medium text-emerald-500">{rating.stats.goals}</div>
                                  <div className="text-muted-foreground">Goals</div>
                                </div>
                                <div className="text-center p-2 bg-background rounded">
                                  <div className="font-medium text-blue-500">{rating.stats.assists}</div>
                                  <div className="text-muted-foreground">Assists</div>
                                </div>
                                <div className="text-center p-2 bg-background rounded">
                                  <div className="font-medium text-orange-500">{rating.stats.shots}</div>
                                  <div className="text-muted-foreground">Shots</div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
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
                      <h3 className="font-semibold mb-3 text-center flex items-center justify-center gap-2">
                        <Image
                          src={teamLogos[fixture.homeTeam.name] || '/images/team_logos/default.jpg'}
                          alt={fixture.homeTeam.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        {fixture.homeTeam.name}
                      </h3>
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground text-center bg-secondary/50 rounded-lg py-2">
                          Formation: <span className="font-medium">{fixture.lineups.home.formation}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-3 text-emerald-600">Starting XI</div>
                          <div className="space-y-2">
                            {fixture.lineups.home.startingXI.map((player, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-border/30"
                                whileHover={{ backgroundColor: "rgba(var(--secondary), 0.6)" }}
                              >
                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                  {player.shirtNumber}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{player.player.name}</span>
                                    {player.isCaptain && (
                                      <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">C</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{player.player.department}</div>
                                </div>
                                <div className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium border",
                                  getPositionColor(player.position)
                                )}>
                                  {player.position}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Substitutes */}
                        {fixture.lineups.home.substitutes && fixture.lineups.home.substitutes.length > 0 && (
                          <div>
                            <div className="text-sm font-medium mb-3 text-blue-600">Substitutes</div>
                            <div className="space-y-2">
                              {fixture.lineups.home.substitutes.map((player, index) => (
                                <motion.div
                                  key={index}
                                  className="flex items-center gap-3 p-2 bg-secondary/20 rounded-lg border border-border/20"
                                  whileHover={{ backgroundColor: "rgba(var(--secondary), 0.4)" }}
                                >
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {player.shirtNumber}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{player.player.name}</div>
                                    <div className="text-xs text-muted-foreground">{player.player.department}</div>
                                  </div>
                                  <div className={cn(
                                    "px-2 py-1 rounded-full text-xs font-medium border",
                                    getPositionColor(player.position)
                                  )}>
                                    {player.position}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Away Team Lineup */}
                    <div>
                      <h3 className="font-semibold mb-3 text-center flex items-center justify-center gap-2">
                        <Image
                          src={teamLogos[fixture.awayTeam.name] || '/images/team_logos/default.jpg'}
                          alt={fixture.awayTeam.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        {fixture.awayTeam.name}
                      </h3>
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground text-center bg-secondary/50 rounded-lg py-2">
                          Formation: <span className="font-medium">{fixture.lineups.away.formation}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-3 text-emerald-600">Starting XI</div>
                          <div className="space-y-2">
                            {fixture.lineups.away.startingXI.map((player, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-border/30"
                                whileHover={{ backgroundColor: "rgba(var(--secondary), 0.6)" }}
                              >
                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                  {player.shirtNumber}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{player.player.name}</span>
                                    {player.isCaptain && (
                                      <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">C</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{player.player.department}</div>
                                </div>
                                <div className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium border",
                                  getPositionColor(player.position)
                                )}>
                                  {player.position}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Substitutes */}
                        {fixture.lineups.away.substitutes && fixture.lineups.away.substitutes.length > 0 && (
                          <div>
                            <div className="text-sm font-medium mb-3 text-blue-600">Substitutes</div>
                            <div className="space-y-2">
                              {fixture.lineups.away.substitutes.map((player, index) => (
                                <motion.div
                                  key={index}
                                  className="flex items-center gap-3 p-2 bg-secondary/20 rounded-lg border border-border/20"
                                  whileHover={{ backgroundColor: "rgba(var(--secondary), 0.4)" }}
                                >
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {player.shirtNumber}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{player.player.name}</div>
                                    <div className="text-xs text-muted-foreground">{player.player.department}</div>
                                  </div>
                                  <div className={cn(
                                    "px-2 py-1 rounded-full text-xs font-medium border",
                                    getPositionColor(player.position)
                                  )}>
                                    {player.position}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
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