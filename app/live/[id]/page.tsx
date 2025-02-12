'use client';

import { Timeline } from '@/components/live/Timeline';
import useLiveStore from '@/stores/liveStore';
import useTimerStore from '@/stores/timerStore';
import { LiveStatState } from '@/utils/stateTypes';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { BackButton } from '@/components/ui/back-button';
import Image from 'next/image';

export default function LiveMatchPage() {
  const params = useParams();
  const { matchEvents } = useLiveStore();
  const { time, half } = useTimerStore();
  const [statValues, setStatValues] = useState<LiveStatState>({
    homeTeam: { name: 'Home Team', _id: '1' },
    awayTeam: { name: 'Away Team', _id: '2' },
    homeScore: 0,
    awayScore: 0,
    home: {
      shotsOnTarget: 0,
      shotsOffTarget: 0,
      fouls: 0,
      corners: 0,
      offsides: 0,
      yellowCards: 0,
      redCards: 0
    },
    away: {
      shotsOnTarget: 0,
      shotsOffTarget: 0,
      fouls: 0,
      corners: 0,
      offsides: 0,
      yellowCards: 0,
      redCards: 0
    },
    competition: { name: 'Competition', _id: '1', type: 'league' },
    homeLineup: null,
    awayLineup: null,
    homePenalty: null,
    awayPenalty: null
  });

  // TODO: Fetch match data using params.id

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="fixed top-20 left-4 md:left-8 z-10">
        <BackButton />
      </div>

      <BlurFade>
        <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">
          {/* Match Header */}
          <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
            <div className="text-center mb-4">
              <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-2">
                {statValues.competition?.name || 'Friendly'}
              </div>
            </div>

            <div className="flex items-center justify-between gap-8">
              {/* Home Team */}
              <div className="flex flex-col items-center gap-4 w-1/3">
                <div className="relative w-16 h-16 md:w-24 md:h-24">
                  <Image
                    src="/team-logos/team-a.png"
                    alt={statValues.homeTeam.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-base md:text-lg font-medium text-center">
                  {statValues.homeTeam.name}
                </span>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center">
                <div className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg">
                  <div className="text-4xl font-bold tracking-wider">
                    {statValues.homeScore} - {statValues.awayScore}
                  </div>
                  <div className="text-xs text-gray-400 text-center mt-1">
                    {half} • {Math.floor(time / 60)}'
                  </div>
                </div>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center gap-4 w-1/3">
                <div className="relative w-16 h-16 md:w-24 md:h-24">
                  <Image
                    src="/team-logos/team-b.png"
                    alt={statValues.awayTeam.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-base md:text-lg font-medium text-center">
                  {statValues.awayTeam.name}
                </span>
              </div>
            </div>
          </div>

          {/* Match Timeline */}
          <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4">Match Timeline</h2>
            <Timeline events={matchEvents} statValues={statValues} />
          </div>

          {/* Match Stats */}
          <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
            <h2 className="text-lg font-semibold mb-4">Match Stats</h2>
            <div className="space-y-4">
              <StatBar
                label="Shots"
                home={statValues.home.shotsOnTarget + statValues.home.shotsOffTarget}
                away={statValues.away.shotsOnTarget + statValues.away.shotsOffTarget}
              />
              <StatBar
                label="Shots on Target"
                home={statValues.home.shotsOnTarget}
                away={statValues.away.shotsOnTarget}
              />
              <StatBar
                label="Corners"
                home={statValues.home.corners}
                away={statValues.away.corners}
              />
              <StatBar
                label="Fouls"
                home={statValues.home.fouls}
                away={statValues.away.fouls}
              />
            </div>
          </div>
        </div>
      </BlurFade>
    </main>
  );
}

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away;
  const homePercent = total === 0 ? 50 : (home / total) * 100;
  const awayPercent = total === 0 ? 50 : (away / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{home}</span>
        <span className="font-medium">{label}</span>
        <span>{away}</span>
      </div>
      <div className="flex h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="bg-blue-500"
          style={{ width: `${homePercent}%` }}
        />
        <div
          className="bg-orange-500"
          style={{ width: `${awayPercent}%` }}
        />
      </div>
    </div>
  );
} 