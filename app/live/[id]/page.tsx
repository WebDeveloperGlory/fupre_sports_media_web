'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { Timeline } from '@/components/live/Timeline';
import { BlurFade } from '@/components/ui/blur-fade';
import { BackButton } from '@/components/ui/back-button';
import { motion } from 'framer-motion';
import { Trophy, Clock, Activity, Target, Flag, Users, PieChart, Goal } from 'lucide-react';
import { getLiveFixtureDetails } from '@/lib/requests/liveAdminPage/requests';
import { LiveFixture } from '@/utils/requestDataTypes';
import { teamLogos } from '@/constants';

function QuickStat({ icon, label, home, away }: { icon: React.ReactNode; label: string; home: number; away: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50 transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold text-emerald-500">{home}</span>
        <span className="text-xl font-semibold text-emerald-500">{away}</span>
      </div>
    </motion.div>
  );
}

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away;
  const homePercent = total === 0 ? 50 : (home / total) * 100;
  const awayPercent = total === 0 ? 50 : (away / total) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
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
    </motion.div>
  );
}

function PossessionBar({ home, away }: { home: number; away: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-border/20"
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-medium text-white">Possession</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-emerald-500 font-medium">{home}%</span>
        <div className="flex-1 h-1.5 bg-muted/20 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${home}%` }}
            />
            <div 
              className="h-full bg-emerald-500/50 transition-all duration-500"
              style={{ width: `${away}%` }}
            />
          </div>
        </div>
        <span className="text-emerald-500 font-medium">{away}%</span>
      </div>
    </motion.div>
  );
}

function CardsBar({ home, away }: { home: { yellow: number; red: number }; away: { yellow: number; red: number } }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-border/20"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-white">Cards</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-4 bg-yellow-500 rounded-sm" />
            <span className="text-white font-medium">{home.yellow}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-4 bg-red-500 rounded-sm" />
            <span className="text-white font-medium">{home.red}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-4 bg-yellow-500 rounded-sm" />
            <span className="text-white font-medium">{away.yellow}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-4 bg-red-500 rounded-sm" />
            <span className="text-white font-medium">{away.red}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LiveMatchPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params);

  const [ loading, setLoading ] = useState<boolean>( true );
  const [ liveFixture, setLiveFixture ] = useState<LiveFixture | null>( null );

  useEffect( () => {
    const fetchData = async () => {
      const data = await getLiveFixtureDetails( resolvedParams.id );
      if( data && data.code === '00' ) {
        setLiveFixture( data.data );
        console.log( data );
      };
      setLoading( false );
    }
    
    if( loading ) fetchData();
  }, [ loading, resolvedParams.id ])

  // Calculate total elapsed game time
  const totalElapsedGameTime = liveFixture ? liveFixture.statistics.home.possessionTime + liveFixture.statistics.away.possessionTime : 0;
  const homePossession = totalElapsedGameTime > 0 ? ( liveFixture!.statistics.home.possessionTime / totalElapsedGameTime ) * 100 : 50;
  const awayPossession = 100 - homePossession; // Ensures total is always 100%

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="fixed top-6 left-4 md:left-8 z-10">
        <BackButton />
      </div>

      <div className="pt-12 pb-4 px-3 md:pt-0 md:pb-6 md:px-6">
        <BlurFade>
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {
              liveFixture && (
                <>
                  {/* Match Header */}
                  <div className="relative bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
                    
                    <div className="relative">
                      <div className="text-center mb-3 md:mb-4">
                        <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-2.5 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                          <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          <span>{ liveFixture.competition?.name || 'Friendly' }</span>
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
                              src={ teamLogos[ liveFixture.homeTeam.name ] || '/images/team_logos/default.jpg' }
                              alt={ liveFixture.homeTeam.name }
                              fill
                              className="object-contain rounded-full"
                            />
                          </motion.div>
                          <span className="text-xs md:text-base font-medium text-center">
                            { liveFixture.homeTeam.name }
                          </span>
                        </div>

                        {/* Score */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="bg-card shadow-xl rounded-lg md:rounded-xl p-2 md:p-3 border border-border min-w-[90px] md:min-w-[120px] text-center">
                            <div className="text-2xl md:text-4xl font-bold tracking-tighter">
                              <span className="text-emerald-500">{ liveFixture.result.homeScore }</span>
                              <span className="mx-2 md:mx-3 text-muted-foreground">-</span>
                              <span className="text-emerald-500">{ liveFixture.result.awayScore }</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 md:gap-1.5 mt-0.5 md:mt-1 text-[10px] md:text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                              <span>{ ( liveFixture.time < 2700 ) ? 'First Half' : 'Second Half' } • { Math.floor( liveFixture.time / 60 ) }'</span>
                            </div>
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
                              src={ teamLogos[ liveFixture.awayTeam.name ] || '/images/team_logos/default.jpg' }
                              alt={ liveFixture.awayTeam.name }
                              fill
                              className="object-contain rounded-full"
                            />
                          </motion.div>
                          <span className="text-xs md:text-base font-medium text-center">
                            { liveFixture.awayTeam.name }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Goalscorers */}
                  <div className="col-span-2 md:col-span-4">
                      <Goalscorers fixtureData={ liveFixture } />
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                    <QuickStat
                      icon={<Activity className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />}
                      label="Total Shots"
                      home={ liveFixture.statistics.home.shotsOnTarget +  liveFixture.statistics.home.shotsOffTarget }
                      away={ liveFixture.statistics.away.shotsOnTarget + liveFixture.statistics.away.shotsOffTarget }
                    />
                    <QuickStat
                      icon={<Target className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />}
                      label="On Target"
                      home={ liveFixture.statistics.home.shotsOnTarget }
                      away={ liveFixture.statistics.away.shotsOnTarget }
                    />
                    <QuickStat
                      icon={<Flag className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />}
                      label="Corners"
                      home={ liveFixture.statistics.home.corners }
                      away={ liveFixture.statistics.away.corners }
                    />
                    <QuickStat
                      icon={<Users className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />}
                      label="Offsides"
                      home={ liveFixture.statistics.home.offsides }
                      away={ liveFixture.statistics.away.offsides }
                    />
                    <QuickStat
                      icon={<Users className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />}
                      label="Fouls"
                      home={ liveFixture.statistics.home.fouls }
                      away={ liveFixture.statistics.away.fouls }
                    />
                  </div>
                  <div className="col-span-2 md:col-span-4">
                    <PossessionBar
                      home={ Number( homePossession.toFixed( 2 ) ) }
                      away={ Number( awayPossession.toFixed( 2 ) ) }
                    />
                  </div>
                  <div className="col-span-2 md:col-span-4">
                    <CardsBar 
                      home={{ 
                        yellow: liveFixture.statistics.home.yellowCards, 
                        red: liveFixture.statistics.home.redCards 
                      }} 
                      away={{ 
                        yellow: liveFixture.statistics.away.yellowCards, 
                        red: liveFixture.statistics.away.redCards 
                      }} 
                    />
                  </div>

                  {/* Match Timeline */}
                  <div className="bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border">
                    <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-500" />
                      Match Timeline
                    </h2>
                    <Timeline 
                      events={ liveFixture.matchEvents } 
                      homeTeamId={ liveFixture.homeTeam._id }
                      awayTeamId={ liveFixture.awayTeam._id }
                      homeLineups={ liveFixture.homeLineup }
                      awayLineups={ liveFixture.awayLineup }
                    />
                  </div>
                </>
              )
            }
            {
              !liveFixture && (
                <div>Fixture Not Live</div>
              )
            }
          </div>
        </BlurFade>
      </div>
    </main>
  );
}

function Goalscorers({ fixtureData }: { fixtureData: LiveFixture }) {
  // Get goalscorers from matchEvents for live matches
  const goalscorersFromEvents = fixtureData.matchEvents
    .filter(event => event.eventType === 'goal')
    .map(event => ({
      team: event.team!._id,
      id: {
        _id: event.player?._id,
        name: event.player?.name
      },
      time: event.time,
      _id: event.id.toString()
    }));

  // Use goalScorers array for completed matches, matchEvents for live matches
  const goalscorers = goalscorersFromEvents;

  // Separate goalscorers by team
  const homeTeamScorers = goalscorers.filter(scorer => scorer.team === fixtureData.homeTeam._id);
  const awayTeamScorers = goalscorers.filter(scorer => scorer.team === fixtureData.awayTeam._id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-border/20"
    >
      <div className="flex items-center gap-2 mb-4">
        <Goal className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-medium text-white">Goalscorers</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Home Team Scorers */}
        <div>
          <h3 className="text-sm text-emerald-500 mb-2">{fixtureData.homeTeam.name}</h3>
          {homeTeamScorers.length > 0 ? (
            <div className="space-y-2">
              {homeTeamScorers.map(( scorer, index ) => (
                <div key={ scorer._id || index } className="text-sm text-white flex items-center gap-2">
                  <span>{scorer.id.name || 'Unknown' }</span>
                  <span className="text-muted-foreground">{scorer.time}'</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No goals</p>
          )}
        </div>

        {/* Away Team Scorers */}
        <div>
          <h3 className="text-sm text-emerald-500 mb-2">{fixtureData.awayTeam.name}</h3>
          {awayTeamScorers.length > 0 ? (
            <div className="space-y-2">
              {awayTeamScorers.map(( scorer, index ) => (
                <div key={ scorer._id || index } className="text-sm text-white flex items-center gap-2">
                  <span>{scorer.id.name || 'Unknown' }</span>
                  <span className="text-muted-foreground">{scorer.time}'</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No goals</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}