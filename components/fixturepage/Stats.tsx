import React from 'react'
import { motion } from 'framer-motion';
import { Fixture, Statistics } from '@/utils/requestDataTypes';
import { Activity, Flag, Target, Users, Clock, Goal } from 'lucide-react';
import { Timeline } from '../live/Timeline';

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

function Goalscorers({ fixtureData }: { fixtureData: Fixture }) {
  // Get goalscorers from goalScorers array for completed matches
  const goalscorersFromArray = fixtureData.goalScorers || [];

  // Use goalScorers array for completed matches, matchEvents for live matches
  const goalscorers = goalscorersFromArray;

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
              {homeTeamScorers.map((scorer, index) => (
                <div key={scorer?._id || index} className="text-sm text-white flex items-center gap-2">
                  <span>{scorer?.id.name || 'Unknown'}</span>
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
              {awayTeamScorers.map((scorer, index) => (
                <div key={scorer?._id || index} className="text-sm text-white flex items-center gap-2">
                  <span>{scorer?.id.name || 'Unknown'}</span>
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

const Stats = (
    { home, away, fixtureData }: 
    { home: Statistics | undefined, away: Statistics | undefined, fixtureData: Fixture }
) => {
  // Calculate total elapsed game time
  const totalElapsedGameTime = ( home && away ) ? home.possessionTime + away.possessionTime : 0;
  const homePossession = totalElapsedGameTime > 0 ? ( home!.possessionTime / totalElapsedGameTime ) * 100 : 50;
  const awayPossession = 100 - homePossession; // Ensures total is always 100%

  return (
    <div className='space-y-4 md:space-y-6'>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <QuickStat
                icon={<Activity className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />}
                label="Total Shots"
                home={home ? home.shotsOnTarget + home.shotsOffTarget : 0}
                away={away ? away.shotsOnTarget + away.shotsOffTarget : 0}
            />
            <QuickStat
                icon={<Target className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />}
                label="On Target"
                home={home ? home.shotsOnTarget : 0}
                away={away ? away.shotsOnTarget : 0}
            />
            <QuickStat
                icon={<Flag className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />}
                label="Corners"
                home={home ? home.corners : 0}
                away={away ? away.corners : 0}
            />
            <QuickStat
                icon={<Users className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />}
                label="Offsides"
                home={home ? home.offsides : 0}
                away={away ? away.offsides : 0}
            />
            <QuickStat
              icon={<Users className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />}
              label="Fouls"
              home={ home ? home.fouls : 0 }
              away={ away ? away.fouls : 0 }
            />
        </div>

        {/* Possession Bar */}
        <div className="col-span-2 md:col-span-4">
            <PossessionBar
                home={ Number( homePossession.toFixed( 2 ) ) }
                away={ Number( awayPossession.toFixed( 2 ) ) }
            />
        </div>

        {/* Goalscorers */}
        <div className="col-span-2 md:col-span-4">
            <Goalscorers fixtureData={ fixtureData } />
        </div>

        {/* Cards Bar */}
        <div className="col-span-2 md:col-span-4">
            <CardsBar
                home={{
                    yellow: home ? home.yellowCards : 0,
                    red: home ? home.redCards : 0
                }}
                away={{
                    yellow: away ? away.yellowCards : 0,
                    red: away ? away.redCards : 0
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
                events={fixtureData.matchEvents} 
                homeLineups={fixtureData.homeLineup} 
                awayLineups={fixtureData.awayLineup}
                homeTeamId={fixtureData.homeTeam._id}
                awayTeamId={fixtureData.awayTeam._id}
            />
        </div>
    </div>
  )
}

export default Stats