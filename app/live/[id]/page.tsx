'use client';

import { use, useEffect, useState } from 'react';
import useFixtureSocket from '@/lib/socket/useFixtureSocket';
import Image from 'next/image';
import { BackButton } from '@/components/ui/back-button';
import { motion } from 'framer-motion';
import { Trophy, Clock, CloudRain, User, MapPin, Clock12, ThumbsUp, Star, Target } from 'lucide-react';
import { teamLogos } from '@/constants';
import { IV2FootballLiveFixture } from '@/utils/V2Utils/v2requestData.types';
import Overview from '@/components/newLive/Overview';
import PopUpModal from '@/components/modal/PopUpModal';
import Timeline from '@/components/newLive/Timeline';
import Statistics from '@/components/newLive/Statistics';
import Commentary from '@/components/newLive/Commentary';
import Lineups from '@/components/newLive/Lineups';
import { getLiveFixtureById, submitUnofficialCheer, submitUserPlayerRating, submitUserPOTMVote } from '@/lib/requests/v2/admin/super-admin/live-management/requests';
import { TeamType } from '@/utils/V2Utils/v2requestData.enums';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/v2/authStore';
import { format } from 'date-fns';
import { Loader } from '@/components/ui/loader';
import { liveMatchSample } from '@/constants';

const templateStats = {
  home: {
    shotsOnTarget: 1,
    shotsOffTarget: 1,
    fouls: 1,
    yellowCards: 1,
    redCards: 1,
    offsides: 1,
    corners: 1,
    possessionTime: 1
  },
  away: {
    shotsOnTarget: 1,
    shotsOffTarget: 1,
    fouls: 1,
    yellowCards: 1,
    redCards: 1,
    offsides: 1,
    corners: 1,
    possessionTime: 1
  }
}
const templateCheerMeter = {
  official: {
    home: 1,
    away: 1
  },
  unofficial: {
    home: 1,
    away: 1
  },
  userVotes: []
};

enum Tabs {
  OVERVIEW = 'overview',
  TIMELINE = 'timeline',
  STATS = 'stats',
  LINEUPS = 'lineups',
  COMMENTARY = 'commentary',
}

export default function LiveMatchPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { isLoggedIn } = useAuthStore();
  const resolvedParams = use(params);

  const {
    isConnected,
    minute,
    score,
    timeline,
    statistics,
    status,
    generalInfo,
    cheerMeter,
    playerOfTheMatch,
    liveWatchers,
    substitution,
    goalScorers,
  } = useFixtureSocket(resolvedParams.id)

  const [loading, setLoading] = useState<boolean>(true);
  const [liveFixture, setLiveFixture] = useState<IV2FootballLiveFixture | null>(null);
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.OVERVIEW);
  const [open, setOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'rate' | 'vote' | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(5.0);

  useEffect(() => {
    const fetchData = async () => {
      const fixtureData = await getLiveFixtureById(resolvedParams.id);

      if (fixtureData && fixtureData.data) {
        setLiveFixture(fixtureData.data);
        setActiveModalTab(fixtureData.data.homeTeam.name)
      }

      setLoading(false);
    }

    if (loading) fetchData();
  }, [loading, resolvedParams.id]);

  if (loading) return <Loader />

  // On Click Functions
  const onModalClose = () => {
    setOpen(false);
    setModalType(null);
    setRatingValue(5.0);
  }
  const handleSubmitVote = async () => {
    if (liveFixture && selectedPlayer) {
      const response = await submitUserPOTMVote(
        liveFixture._id,
        { playerId: selectedPlayer }
      );
      if (response?.code === '00') {
        toast.success(response.message || 'POTM Candidate Submitted');
        onModalClose();
      } else {
        toast.error(response?.message || 'Error Submitting POTM Candidate');
      }
    }
  }
  const handleRatePlayer = async () => {
    if (!liveFixture || !selectedPlayer) return;

    const storageKey = `rated_players_${liveFixture._id}`;
    const twoHours = 2 * 60 * 60 * 1000;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        const isExpired = Date.now() - data.timestamp > twoHours;

        if (!isExpired && data.players[selectedPlayer]) {
          toast.error('You have already rated this player!');
          return;
        }

        if (isExpired) localStorage.removeItem(storageKey);
      }
    } catch (error) {
      // Ignore localStorage errors
    }

    try {
      const response = await submitUserPlayerRating(
        liveFixture._id,
        {
          playerId: selectedPlayer,
          rating: ratingValue,
          isHomePlayer: activeModalTab === liveFixture.homeTeam.name
        }
      );

      if (response?.code === '00') {
        try {
          const existing = JSON.parse(localStorage.getItem(storageKey) || '{"players":{}}');
          const updated = {
            players: { ...existing.players, [selectedPlayer]: Date.now() },
            timestamp: Date.now()
          };
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch (error) {
          // Ignore localStorage errors
        }

        toast.success(response.message || 'Rating Submitted');
        onModalClose();
      } else {
        toast.error(response?.message || 'Error Submitting Rating');
      }
    } catch (error) {
      toast.error('Network error occurred');
    }
  };

  const possibleFirstHalfStatuses = ['pre-match', '1st-half', 'postponed'];

  const getPlayerFanRating = (playerId: string) => {
    const foundPlayer = liveFixture?.playerRatings.find(player => player.player._id === playerId);
    return foundPlayer ? foundPlayer.fanRatings.average : 0;
  }

  // Derived States
  const currentMinute = minute?.minute ?? liveFixture?.currentMinute ?? 0;
  const injuryTime = minute?.injuryTime ?? liveFixture?.injuryTime ?? 0;
  const currentStatus = status ?? liveFixture?.status ?? 'SCHEDULED';
  const currentCheerMeter = cheerMeter ?? liveFixture?.cheerMeter ?? templateCheerMeter;

  const homeScore = score?.homeScore ?? liveFixture?.result.homeScore ?? 0;
  const awayScore = score?.awayScore ?? liveFixture?.result.awayScore ?? 0;
  const POTM = playerOfTheMatch ?? liveFixture?.playerOfTheMatch ?? liveMatchSample.playerOfTheMatch;
  const stats = statistics ?? liveFixture?.statistics ?? templateStats;
  const referee = generalInfo?.referee ?? liveFixture?.referee;
  const kickoffTime = generalInfo?.kickoffTime ?? liveFixture?.kickoffTime ?? '';
  const weather = generalInfo?.weather ?? liveFixture?.weather ?? { condition: '', temperature: -10, humidity: -10 };
  const goalScorersList = goalScorers ?? liveFixture?.goalScorers ?? []

  const totalElapsedGameTime = liveFixture ? stats.home.possessionTime + stats.away.possessionTime : 0;
  const homePossession = totalElapsedGameTime > 0 ? (liveFixture!.statistics.home.possessionTime / totalElapsedGameTime) * 100 : 50;
  const awayPossession = 100 - homePossession;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Main Section */}
      <section className="pt-4 pb-8 px-0 md:px-4">
        <div className="mx-auto max-w-5xl space-y-3 md:space-y-4">
          {/* Back Button & Viewers */}
          <div className="flex items-center justify-between px-2 md:px-0">
            <BackButton />
            <div className="px-3 py-1.5 border border-border rounded-lg bg-secondary/50">
              <span className="text-xs text-muted-foreground">Viewers: </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{liveWatchers || 0}</span>
            </div>
          </div>

          {liveFixture && (
            <>
              {/* Match Header */}
              <div className="border border-border rounded-lg md:rounded-2xl overflow-hidden">
                {/* Competition Badge */}
                <div className="bg-secondary/50 px-3 py-1.5 sm:px-4 sm:py-2 text-center">
                  <span className="inline-flex items-center gap-2 text-sm font-medium">
                    <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {liveFixture.competition?.name || 'Friendly'}
                  </span>
                </div>

                {/* Teams & Score */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4 md:gap-8">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
                      <div className="relative w-16 h-16 md:w-20 md:h-20">
                        <Image
                          src={teamLogos[liveFixture.homeTeam.name] || '/images/team_logos/default.jpg'}
                          alt={liveFixture.homeTeam.name}
                          fill
                          className="object-contain rounded-full"
                        />
                      </div>
                      <span className="text-sm md:text-base font-semibold text-center truncate w-full">
                        {liveFixture.homeTeam.name}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-xs font-medium text-muted-foreground">{currentStatus}</div>
                      <div className="text-3xl md:text-5xl font-bold tracking-tight">
                        <span className="text-emerald-600 dark:text-emerald-400">{homeScore}</span>
                        <span className="mx-2 md:mx-3 text-muted-foreground">-</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{awayScore}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        <Clock className="w-4 h-4" />
                        <span>{currentMinute}'</span>
                        {injuryTime > 0 && <span>+{injuryTime}</span>}
                      </div>
                      {!possibleFirstHalfStatuses.includes(liveFixture.status) && (
                        <div className="text-xs text-muted-foreground">
                          HT: {liveFixture.result.halftimeHomeScore} - {liveFixture.result.halftimeAwayScore}
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
                      <div className="relative w-16 h-16 md:w-20 md:h-20">
                        <Image
                          src={teamLogos[liveFixture.awayTeam.name] || '/images/team_logos/default.jpg'}
                          alt={liveFixture.awayTeam.name}
                          fill
                          className="object-contain rounded-full"
                        />
                      </div>
                      <span className="text-sm md:text-base font-semibold text-center truncate w-full">
                        {liveFixture.awayTeam.name}
                      </span>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{liveFixture.stadium}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Ref: {referee || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CloudRain className="w-3.5 h-3.5" />
                      <span>{weather.condition || 'Unknown'}, {weather.temperature || 'Unknown'}°C</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock12 className="w-3.5 h-3.5" />
                      <span>{kickoffTime ? format(kickoffTime, 'yyyy-MM-dd HH:mm') : 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal Scorers */}
              {goalScorersList && goalScorersList.length > 0 && (
                <div className="border border-border rounded-lg md:rounded-xl p-4 md:p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Goal Scorers
                  </h2>
                  <div className="space-y-2">
                    {goalScorersList.map((scorer, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">⚽</span>
                          <div>
                            <div className="font-medium text-sm">{scorer.player ? scorer.player.name : 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground">{scorer.team ? scorer.team.name : 'Unknown'}</div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          {scorer.time}'
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <StatBar
                  home={stats.home.shotsOffTarget + stats.home.shotsOnTarget}
                  away={stats.away.shotsOffTarget + stats.away.shotsOnTarget}
                  label='Total Shots'
                />
                <PossessionBar
                  home={Number(homePossession.toFixed(0))}
                  away={Number(awayPossession.toFixed(0))}
                  name='Possession'
                />
                <CardsBar
                  home={{ yellow: stats.home.yellowCards, red: stats.home.redCards }}
                  away={{ yellow: stats.away.yellowCards, red: stats.away.redCards }}
                />
              </div>

              {/* Fan Support */}
              <CheerBar
                home={currentCheerMeter.unofficial.home}
                away={currentCheerMeter.unofficial.away}
                homeShorthand={liveFixture.homeTeam.shorthand || 'HOM'}
                awayShorthand={liveFixture.awayTeam.shorthand || 'AWA'}
                homeTeam={liveFixture.homeTeam.name}
                awayTeam={liveFixture.awayTeam.name}
                liveId={liveFixture._id}
              />

              {/* Navigation Tabs */}
              <div className='border border-border rounded-xl p-1'>
                <div className='flex overflow-x-auto scrollbar-hide md:grid md:grid-cols-5 gap-1'>
                  {Object.values(Tabs).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        flex-shrink-0 px-4 py-2.5 capitalize text-sm font-medium rounded-lg transition-colors whitespace-nowrap
                        ${activeTab === tab
                          ? 'bg-emerald-600 text-white'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }
                      `}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === Tabs.OVERVIEW &&
                  <Overview
                    stream={liveFixture.streamLinks}
                    playerRatings={liveFixture.playerRatings}
                    homeLineup={liveFixture.lineups.home}
                    awayLineup={liveFixture.lineups.away}
                    home={liveFixture.homeTeam.name}
                    away={liveFixture.awayTeam.name}
                    odds={liveFixture.odds}
                    playerOfTheMatch={POTM}
                    setOpen={setOpen}
                    setModalType={setModalType}
                    isLoggedIn={isLoggedIn}
                    minute={currentMinute}
                  />
                }

                {activeTab === Tabs.TIMELINE &&
                  <Timeline
                    events={liveFixture?.timeline || []}
                    homeTeamName={liveFixture?.homeTeam?.name}
                    awayTeamName={liveFixture?.awayTeam?.name}
                    isLive={true}
                  />
                }

                {activeTab === Tabs.STATS &&
                  <Statistics
                    homeStat={stats.home}
                    awayStat={stats.away}
                    ratings={liveFixture.playerRatings}
                    home={liveFixture.homeTeam.name}
                    away={liveFixture.awayTeam.name}
                  />
                }

                {activeTab === Tabs.LINEUPS &&
                  <Lineups
                    home={liveFixture.homeTeam.name}
                    away={liveFixture.awayTeam.name}
                    homeLineup={liveFixture.lineups.home}
                    awayLineup={liveFixture.lineups.away}
                    subs={liveFixture.substitutions}
                  />
                }

                {activeTab === Tabs.COMMENTARY &&
                  <Commentary
                    commentary={liveFixture.commentary}
                  />
                }
              </div>
            </>
          )}

          {!loading && !liveFixture && (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-border rounded-xl">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Fixture Not Live</h3>
              <p className="text-sm text-muted-foreground">Check back later for live coverage</p>
            </div>
          )}
        </div>
      </section>

      {/* PopUp Modal */}
      <PopUpModal open={open} onClose={onModalClose}>
        {liveFixture && (
          <div className='space-y-4'>
            {/* Header */}
            <div className='pr-8'>
              {modalType === 'vote' ? (
                <>
                  <h2 className="text-lg font-bold">Vote for POTM</h2>
                  <p className='text-sm text-muted-foreground'>Select the player you think deserves it</p>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold">Rate A Player</h2>
                  <p className='text-sm text-muted-foreground'>Select a player and rate from 1 to 10</p>
                </>
              )}
            </div>

            {/* Team Tabs - Full width on mobile */}
            <div className='grid grid-cols-2 border border-border rounded-lg overflow-hidden'>
              {[liveFixture.homeTeam.name, liveFixture.awayTeam.name].map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveModalTab(tab);
                    setSelectedPlayer(null);
                  }}
                  className={`
                    py-3 text-sm font-medium text-center transition-colors
                    ${activeModalTab === tab
                      ? 'bg-emerald-600 text-white'
                      : 'bg-secondary text-muted-foreground'
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Player List - Taller scroll area on mobile */}
            <div className='space-y-2 max-h-[40vh] overflow-y-auto'>
              {activeModalTab === liveFixture.homeTeam.name && (
                [...liveFixture.lineups.home.startingXI, ...liveFixture.lineups.home.substitutes].map((player, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPlayer(player.player._id)}
                    className={`
                      w-full py-3 px-4 border rounded-lg text-left flex justify-between items-center transition-colors
                      ${selectedPlayer === player.player._id
                        ? 'border-emerald-600 bg-emerald-600/10'
                        : 'border-border'
                      }
                    `}
                  >
                    <div>
                      <p className="font-medium">{player.player.name}</p>
                      <span className='text-xs text-muted-foreground'>{player.player.position}</span>
                    </div>
                    {modalType === 'vote' && (
                      <div className='flex items-center gap-1 text-sm bg-secondary px-2 py-1 rounded'>
                        <Star className='w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400' />
                        <span className='font-medium'>{getPlayerFanRating(player.player._id)}</span>
                      </div>
                    )}
                  </button>
                ))
              )}
              {activeModalTab === liveFixture.awayTeam.name && (
                [...liveFixture.lineups.away.startingXI, ...liveFixture.lineups.away.substitutes].map((player, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPlayer(player.player._id)}
                    className={`
                      w-full py-3 px-4 border rounded-lg text-left flex justify-between items-center transition-colors
                      ${selectedPlayer === player.player._id
                        ? 'border-emerald-600 bg-emerald-600/10'
                        : 'border-border'
                      }
                    `}
                  >
                    <div>
                      <p className="font-medium">{player.player.name}</p>
                      <span className='text-xs text-muted-foreground'>{player.player.position}</span>
                    </div>
                    {modalType === 'vote' && (
                      <div className='flex items-center gap-1 text-sm bg-secondary px-2 py-1 rounded'>
                        <Star className='w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400' />
                        <span className='font-medium'>{getPlayerFanRating(player.player._id)}</span>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Rate Slider - Better visual design */}
            {modalType === 'rate' && (
              <div className='bg-secondary/50 rounded-lg p-4'>
                <div className="flex justify-between items-center mb-3">
                  <p className='text-sm font-medium'>Your Rating</p>
                  <div className='bg-emerald-600 text-white px-3 py-1.5 flex gap-1.5 items-center text-lg font-bold rounded-lg'>
                    <Star className='w-4 h-4' />
                    {ratingValue.toFixed(1)}
                  </div>
                </div>
                <div className='flex gap-3 items-center w-full'>
                  <span className='text-sm font-medium text-muted-foreground'>1</span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.1}
                    value={ratingValue}
                    onChange={(e) => setRatingValue(parseFloat(e.target.value))}
                    className='w-full h-2 cursor-pointer accent-emerald-600 bg-secondary rounded-full'
                  />
                  <span className='text-sm font-medium text-muted-foreground'>10</span>
                </div>
              </div>
            )}

            {/* Submit Button - Large touch target */}
            <button
              onClick={modalType === 'vote' ? handleSubmitVote : handleRatePlayer}
              className='bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-lg w-full disabled:opacity-50 transition-colors font-medium text-base'
              disabled={selectedPlayer === null}
            >
              {modalType === 'vote' ? 'Submit Vote' : 'Submit Rating'}
            </button>
          </div>
        )}
      </PopUpModal>
    </div>
  );
}

// Helper Components - Minimal Style

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away;
  const homePercent = total === 0 ? 50 : (home / total) * 100;
  const awayPercent = total === 0 ? 50 : (away / total) * 100;

  return (
    <div className="border border-border rounded-xl p-4 space-y-3">
      <div className="flex justify-between text-sm">
        <span className="font-bold text-emerald-600 dark:text-emerald-400">{home}</span>
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400">{away}</span>
      </div>
      <div className="flex h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="bg-emerald-600 dark:bg-emerald-500 transition-all duration-500"
          style={{ width: `${homePercent}%` }}
        />
        <div
          className="bg-emerald-600/30 dark:bg-emerald-500/30 transition-all duration-500"
          style={{ width: `${awayPercent}%` }}
        />
      </div>
    </div>
  );
}

function PossessionBar({ name = 'Possession', home, away }: { name?: string, home: number; away: number }) {
  return (
    <div className="border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{home}%</span>
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <div className="flex h-full">
            <div
              className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-500"
              style={{ width: `${home}%` }}
            />
            <div
              className="h-full bg-emerald-600/30 dark:bg-emerald-500/30 transition-all duration-500"
              style={{ width: `${away}%` }}
            />
          </div>
        </div>
        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{away}%</span>
      </div>
    </div>
  );
}

function CardsBar({ home, away }: { home: { yellow: number; red: number }; away: { yellow: number; red: number } }) {
  return (
    <div className="border border-border rounded-xl p-4 space-y-3">
      <span className="text-sm font-medium">Cards</span>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-4 bg-yellow-500 rounded-sm" />
            <span className="font-bold">{home.yellow}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-4 bg-red-500 rounded-sm" />
            <span className="font-bold">{home.red}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-4 bg-yellow-500 rounded-sm" />
            <span className="font-bold">{away.yellow}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-4 bg-red-500 rounded-sm" />
            <span className="font-bold">{away.red}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheerBar(
  { home, away, homeTeam, awayTeam, homeShorthand, awayShorthand, liveId }:
    { home: number, away: number, homeTeam: string, awayTeam: string, homeShorthand: string, awayShorthand: string, liveId: string }
) {
  const [lastCheerTime, setLastCheerTime] = useState<number>(0);
  const cooldownPeriod = 10 * 1000;

  const total = home + away;
  const homePercent = total === 0 ? 50 : (home / total) * 100;
  const awayPercent = total === 0 ? 50 : (away / total) * 100;

  const handleCheer = async (team: TeamType) => {
    const now = Date.now();
    const timeSinceLastCheer = now - lastCheerTime;

    if (timeSinceLastCheer < cooldownPeriod) {
      const remainingCooldown = cooldownPeriod - timeSinceLastCheer;
      const secondsLeft = Math.ceil(remainingCooldown / 1000);
      toast.error(`Please wait ${secondsLeft} seconds before cheering again!`);
      return;
    }

    try {
      const response = await submitUnofficialCheer(liveId, { team, isOfficial: false });

      if (response?.code === '00') {
        setLastCheerTime(now);
        toast.success(response.message);
      } else {
        toast.error(response?.message || 'An Error Occurred');
      }
    } catch (error) {
      toast.error('Network error occurred');
    }
  };

  return (
    <div className="border border-border rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h3 className='font-bold'>Fan Support</h3>
        <span className='text-muted-foreground text-sm'>{total} votes</span>
      </div>

      {/* Bar */}
      <div className="flex items-center">
        <span className="text-sm font-medium w-12 text-right pr-2">{homeShorthand}</span>
        <div className="flex-1 mx-2">
          <div className="flex h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 dark:bg-emerald-500 transition-all duration-500"
              style={{ width: `${homePercent}%` }}
            />
            <div
              className="bg-emerald-600/30 dark:bg-emerald-500/30 transition-all duration-500"
              style={{ width: `${awayPercent}%` }}
            />
          </div>
        </div>
        <span className="text-sm font-medium w-12 pl-2">{awayShorthand}</span>
      </div>

      {/* Buttons */}
      <div className='grid grid-cols-2 gap-3'>
        <button
          onClick={() => handleCheer(TeamType.HOME)}
          className='px-4 py-2.5 rounded-lg flex gap-2 items-center justify-center border border-border hover:bg-secondary transition-colors text-sm font-medium'
        >
          <ThumbsUp className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
          <span className='hidden md:inline'>{homeTeam}</span>
          <span className='md:hidden'>{homeShorthand}</span>
        </button>
        <button
          onClick={() => handleCheer(TeamType.AWAY)}
          className='px-4 py-2.5 rounded-lg flex gap-2 items-center justify-center border border-border hover:bg-secondary transition-colors text-sm font-medium'
        >
          <ThumbsUp className='w-4 h-4 text-emerald-600/50 dark:text-emerald-400/50' />
          <span className='hidden md:inline'>{awayTeam}</span>
          <span className='md:hidden'>{awayShorthand}</span>
        </button>
      </div>
    </div>
  )
}