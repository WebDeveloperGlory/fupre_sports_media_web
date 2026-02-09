'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { BackButton } from '@/components/ui/back-button';
import { Loader } from '@/components/ui/loader';
import { Trophy, Clock, CloudRain, User, MapPin, Clock12, ThumbsUp, Target } from 'lucide-react';
import { teamLogos } from '@/constants';
import { LiveFixtureResponse } from '@/lib/types/v1.response.types';
import { footballLiveApi } from '@/lib/api/v1/football-live.api';
import { FixtureTeamType } from '@/types/v1.football-fixture.types';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useLiveFixture } from '@/lib/hooks/useLiveFixture';

const templateStats = {
  home: {
    shotsOnTarget: 0,
    shotsOffTarget: 0,
    fouls: 0,
    yellowCards: 0,
    redCards: 0,
    offsides: 0,
    corners: 0,
    possessionTime: 0
  },
  away: {
    shotsOnTarget: 0,
    shotsOffTarget: 0,
    fouls: 0,
    yellowCards: 0,
    redCards: 0,
    offsides: 0,
    corners: 0,
    possessionTime: 0
  }
};

const templateCheerMeter = {
  home: 0,
  away: 0,
};

enum Tabs {
  STATS = 'stats',
  OVERVIEW = 'overview',
}

export default function LiveMatchPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params);

  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.STATS);

  const { fixture: liveFixture, loading } = useLiveFixture(resolvedParams.id, {
    autoFetch: true,
    autoJoin: true,
    onError: (error) => {
      console.error('Error fetching live fixture:', error);
    },
  });

  if (loading) return <Loader />;

  if (!liveFixture) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Fixture Not Live</h3>
        <p className="text-sm text-muted-foreground">Check back later for live coverage</p>
      </div>
    );
  }

  const possibleFirstHalfStatuses = ['pre-match', '1st-half', 'postponed'];
  const homeTeamName = liveFixture.homeTeam?.name ?? liveFixture.temporaryHomeTeamName ?? 'Home';
  const awayTeamName = liveFixture.awayTeam?.name ?? liveFixture.temporaryAwayTeamName ?? 'Away';
  const competitionName = liveFixture.competition?.name ?? 'Friendly';

  const stats = liveFixture.statistics ?? templateStats;
  const currentMinute = liveFixture.currentMinute ?? 0;
  const injuryTime = liveFixture.injuryTime ?? 0;
  const currentStatus = liveFixture.status ?? 'SCHEDULED';
  const currentCheerMeter = liveFixture.cheerMeter ?? templateCheerMeter;

  const homeScore = liveFixture.result?.homeScore ?? 0;
  const awayScore = liveFixture.result?.awayScore ?? 0;

  const kickoffTime = liveFixture.kickoffTime ?? '';
  const referee = liveFixture.referee;
  const weather = liveFixture.weather ?? { condition: '', temperature: -10 };

  const goalScorersList = liveFixture.goalScorers ?? [];

  const totalElapsedGameTime = stats.home.possessionTime + stats.away.possessionTime;
  const homePossession = totalElapsedGameTime > 0 ? (stats.home.possessionTime / totalElapsedGameTime) * 100 : 50;
  const awayPossession = 100 - homePossession;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <section className="pt-4 pb-8 px-0 md:px-4">
        <div className="mx-auto max-w-5xl space-y-3 md:space-y-4">
          <div className="flex items-center justify-between px-2 md:px-0">
            <BackButton />
          </div>

          <div className="border border-border rounded-lg md:rounded-2xl overflow-hidden">
            <div className="bg-secondary/50 px-3 py-1.5 sm:px-4 sm:py-2 text-center">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {competitionName}
              </span>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 md:gap-8">
                <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
                  <div className="relative w-16 h-16 md:w-20 md:h-20">
                    <Image
                      src={teamLogos[homeTeamName] || '/images/team_logos/default.jpg'}
                      alt={homeTeamName}
                      fill
                      className="object-contain rounded-full"
                    />
                  </div>
                  <span className="text-sm md:text-base font-semibold text-center truncate w-full">
                    {homeTeamName}
                  </span>
                </div>

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
                      HT: {liveFixture.result?.halftimeHomeScore ?? 0} - {liveFixture.result?.halftimeAwayScore ?? 0}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
                  <div className="relative w-16 h-16 md:w-20 md:h-20">
                    <Image
                      src={teamLogos[awayTeamName] || '/images/team_logos/default.jpg'}
                      alt={awayTeamName}
                      fill
                      className="object-contain rounded-full"
                    />
                  </div>
                  <span className="text-sm md:text-base font-semibold text-center truncate w-full">
                    {awayTeamName}
                  </span>
                </div>
              </div>

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
                  <span>{weather.condition || 'Unknown'}, {weather.temperature ?? 'Unknown'} C</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock12 className="w-3.5 h-3.5" />
                  <span>{kickoffTime ? format(new Date(kickoffTime), 'yyyy-MM-dd HH:mm') : 'Unknown'}</span>
                </div>
              </div>
            </div>
          </div>

          {goalScorersList.length > 0 && (
            <div className="border border-border rounded-lg md:rounded-xl p-4 md:p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Goal Scorers
              </h2>
              <div className="space-y-2">
                {goalScorersList.map((scorer, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-emerald-600">GOAL</span>
                      <div>
                        <div className="font-medium text-sm">{scorer.temporaryPlayerName || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">{scorer.temporaryTeamName || 'Unknown'}</div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <StatBar
              home={stats.home.shotsOffTarget + stats.home.shotsOnTarget}
              away={stats.away.shotsOffTarget + stats.away.shotsOnTarget}
              label="Total Shots"
            />
            <PossessionBar
              home={Number(homePossession.toFixed(0))}
              away={Number(awayPossession.toFixed(0))}
              name="Possession"
            />
            <CardsBar
              home={{ yellow: stats.home.yellowCards, red: stats.home.redCards }}
              away={{ yellow: stats.away.yellowCards, red: stats.away.redCards }}
            />
          </div>

          <CheerBar
            home={currentCheerMeter.home}
            away={currentCheerMeter.away}
            homeShorthand={liveFixture.homeTeam?.shorthand || 'HOM'}
            awayShorthand={liveFixture.awayTeam?.shorthand || 'AWA'}
            homeTeam={homeTeamName}
            awayTeam={awayTeamName}
            liveId={liveFixture.id}
          />

          <div className="border border-border rounded-xl p-1">
            <div className="flex overflow-x-auto scrollbar-hide gap-1">
              {Object.values(Tabs).map((tab) => (
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

          {activeTab === Tabs.OVERVIEW && (
            <div className="border border-border rounded-lg p-4 md:p-6 text-sm text-muted-foreground">
              Live overview and advanced widgets are not available yet for v1 data.
            </div>
          )}

          {activeTab === Tabs.STATS && (
            <div className="border border-border rounded-lg p-4 md:p-6">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Match Statistics
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Shots', home: stats.home.shotsOnTarget + stats.home.shotsOffTarget, away: stats.away.shotsOnTarget + stats.away.shotsOffTarget },
                  { label: 'Shots on Target', home: stats.home.shotsOnTarget, away: stats.away.shotsOnTarget },
                  { label: 'Fouls', home: stats.home.fouls, away: stats.away.fouls },
                  { label: 'Yellow Cards', home: stats.home.yellowCards, away: stats.away.yellowCards },
                  { label: 'Red Cards', home: stats.home.redCards, away: stats.away.redCards },
                  { label: 'Corners', home: stats.home.corners, away: stats.away.corners },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="font-bold w-8 text-emerald-600 dark:text-emerald-400">{stat.home}</span>
                    <span className="text-muted-foreground flex-1 text-center">{stat.label}</span>
                    <span className="font-bold w-8 text-right text-emerald-600 dark:text-emerald-400">{stat.away}</span>
                  </div>
                ))}

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
      </section>
    </div>
  );
}

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

  const handleCheer = async (team: FixtureTeamType) => {
    const now = Date.now();
    const timeSinceLastCheer = now - lastCheerTime;

    if (timeSinceLastCheer < cooldownPeriod) {
      const remainingCooldown = cooldownPeriod - timeSinceLastCheer;
      const secondsLeft = Math.ceil(remainingCooldown / 1000);
      toast.error(`Please wait ${secondsLeft} seconds before cheering again!`);
      return;
    }

    try {
      const response = await footballLiveApi.cheerTeam(liveId, { team });

      if (response?.success) {
        setLastCheerTime(now);
        toast.success(response.message || 'Cheer submitted');
      } else {
        toast.error(response?.message || 'An error occurred');
      }
    } catch (error) {
      toast.error('Network error occurred');
    }
  };

  return (
    <div className="border border-border rounded-xl p-4 space-y-4">
      <div className='flex justify-between items-center'>
        <h3 className='font-bold'>Fan Support</h3>
        <span className='text-muted-foreground text-sm'>{total} votes</span>
      </div>

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

      <div className='grid grid-cols-2 gap-3'>
        <button
          onClick={() => handleCheer(FixtureTeamType.HOME)}
          className='px-4 py-2.5 rounded-lg flex gap-2 items-center justify-center border border-border hover:bg-secondary transition-colors text-sm font-medium'
        >
          <ThumbsUp className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
          <span className='hidden md:inline'>{homeTeam}</span>
          <span className='md:hidden'>{homeShorthand}</span>
        </button>
        <button
          onClick={() => handleCheer(FixtureTeamType.AWAY)}
          className='px-4 py-2.5 rounded-lg flex gap-2 items-center justify-center border border-border hover:bg-secondary transition-colors text-sm font-medium'
        >
          <ThumbsUp className='w-4 h-4 text-emerald-600/50 dark:text-emerald-400/50' />
          <span className='hidden md:inline'>{awayTeam}</span>
          <span className='md:hidden'>{awayShorthand}</span>
        </button>
      </div>
    </div>
  );
}
