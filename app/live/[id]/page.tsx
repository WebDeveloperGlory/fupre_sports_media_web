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
import { motion } from 'framer-motion';
import { Trophy, Clock, Activity, Target, Flag, Users } from 'lucide-react';

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
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="pt-24 pb-6 px-4 md:px-6">
        {/* Back Button */}
        <div className="fixed top-8 left-4 md:left-8 z-10">
          <BackButton />
        </div>

        <BlurFade>
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Match Header */}
            <div className="relative bg-card/40 backdrop-blur-sm rounded-2xl p-6 border border-border overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
              
              <div className="relative">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{statValues.competition?.name || 'Friendly'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 md:gap-8">
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-3 w-1/3">
                    <motion.div 
                      className="relative w-16 h-16 md:w-20 md:h-20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src="/team-logos/team-a.png"
                        alt={statValues.homeTeam.name}
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                    <span className="text-sm md:text-base font-medium text-center">
                      {statValues.homeTeam.name}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-card shadow-xl rounded-xl p-3 border border-border min-w-[120px]">
                      <div className="text-3xl md:text-4xl font-bold tracking-tighter text-center">
                        <span className="text-emerald-500">{statValues.homeScore}</span>
                        <span className="mx-3 text-muted-foreground">-</span>
                        <span className="text-emerald-500">{statValues.awayScore}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{half} • {Math.floor(time / 60)}'</span>
                      </div>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-3 w-1/3">
                    <motion.div 
                      className="relative w-16 h-16 md:w-20 md:h-20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src="/team-logos/team-b.png"
                        alt={statValues.awayTeam.name}
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                    <span className="text-sm md:text-base font-medium text-center">
                      {statValues.awayTeam.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickStat
                icon={<Activity className="w-5 h-5 text-emerald-500" />}
                label="Total Shots"
                home={statValues.home.shotsOnTarget + statValues.home.shotsOffTarget}
                away={statValues.away.shotsOnTarget + statValues.away.shotsOffTarget}
              />
              <QuickStat
                icon={<Target className="w-5 h-5 text-emerald-500" />}
                label="On Target"
                home={statValues.home.shotsOnTarget}
                away={statValues.away.shotsOnTarget}
              />
              <QuickStat
                icon={<Flag className="w-5 h-5 text-emerald-500" />}
                label="Corners"
                home={statValues.home.corners}
                away={statValues.away.corners}
              />
              <QuickStat
                icon={<Users className="w-5 h-5 text-emerald-500" />}
                label="Offsides"
                home={statValues.home.offsides}
                away={statValues.away.offsides}
              />
            </div>

            {/* Match Timeline */}
            <div className="bg-card/40 backdrop-blur-sm rounded-2xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                Match Timeline
              </h2>
              <Timeline events={matchEvents} statValues={statValues} />
            </div>

            {/* Detailed Stats */}
            <div className="bg-card/40 backdrop-blur-sm rounded-2xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                Match Statistics
              </h2>
              <div className="space-y-6">
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

                {/* Cards Section */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-6 bg-yellow-500 rounded-sm" />
                        <span className="text-sm">Yellow Cards</span>
                      </div>
                      <span className="font-semibold">{statValues.home.yellowCards}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-6 bg-red-500 rounded-sm" />
                        <span className="text-sm">Red Cards</span>
                      </div>
                      <span className="font-semibold">{statValues.home.redCards}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{statValues.away.yellowCards}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Yellow Cards</span>
                        <div className="w-4 h-6 bg-yellow-500 rounded-sm" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{statValues.away.redCards}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Red Cards</span>
                        <div className="w-4 h-6 bg-red-500 rounded-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </main>
  );
}

function QuickStat({ icon, label, home, away }: { icon: React.ReactNode; label: string; home: number; away: number }) {
  return (
    <div className="bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold text-emerald-500">{home}</span>
        <span className="text-xl font-semibold text-emerald-500">{away}</span>
      </div>
    </div>
  );
}

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away;
  const homePercent = total === 0 ? 50 : (home / total) * 100;
  const awayPercent = total === 0 ? 50 : (away / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-emerald-500">{home}</span>
        <span className="font-medium">{label}</span>
        <span className="font-medium text-emerald-500">{away}</span>
      </div>
      <div className="flex h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${homePercent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-emerald-500"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${awayPercent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-emerald-500/50"
        />
      </div>
    </div>
  );
} 