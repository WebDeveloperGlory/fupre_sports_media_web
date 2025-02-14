import React from 'react'
import { motion } from 'framer-motion';
import { Fixture, Statistics } from '@/utils/requestDataTypes';
import { Activity, Flag, Target, Users } from 'lucide-react';
import { Timeline } from '../live/Timeline';

const Stats = (
    { home, away, fixtureData }: 
    { home: Statistics | undefined, away: Statistics | undefined, fixtureData: Fixture }
) => {
  return (
    <div className='space-y-4 md:space-y-6'>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <QuickStat
                icon={ <Activity className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" /> }
                label="Total Shots"
                home={ home ? home.shotsOnTarget + home.shotsOffTarget : 0 }
                away={ away ? away.shotsOnTarget + away.shotsOffTarget : 0 }
            />
            <QuickStat
                icon={ <Target className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" /> }
                label="On Target"
                home={ home ? home.shotsOnTarget : 0 }
                away={ away ? away.shotsOnTarget : 0 }
            />
            <QuickStat
                icon={ <Flag className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" /> }
                label="Corners"
                home={ home ? home.corners : 0 }
                away={ away ? away.corners : 0 }
            />
            <QuickStat
                icon={ <Users className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" /> }
                label="Offsides"
                home={ home ? home.offsides : 0 }
                away={ away ? away.offsides : 0 }
            />
        </div>

        {/* Match Timeline */}
        <div className="bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border">
            <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                Match Timeline
            </h2>
            <Timeline 
                events={ fixtureData.matchEvents } 
                homeLineups={ fixtureData.homeLineup } 
                awayLineups={ fixtureData.awayLineup }
                homeTeamId={ fixtureData.homeTeam._id }
                awayTeamId={ fixtureData.awayTeam._id }
            />
        </div>

        {/* Detailed Stats */}
        <div className="bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border">
            <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                Match Statistics
            </h2>

            <div className="space-y-4 md:space-y-6">
                <StatBar
                    label="Shots"
                    home={ home ? home.shotsOnTarget + home.shotsOffTarget : 0 }
                    away={ away ? away.shotsOnTarget + away.shotsOffTarget : 0 }
                />
                <StatBar
                    label="Shots on Target"
                    home={ home ? home.shotsOnTarget : 0 }
                    away={ away ? away.shotsOnTarget : 0 }
                />
                <StatBar
                    label="Corners"
                    home={ home ? home.corners : 0 }
                    away={ away ? away.corners : 0 }
                />
                <StatBar
                    label="Fouls"
                    home={ home ? home.fouls : 0 }
                    away={ away ? away.fouls : 0 }
                />

                {/* Cards Section */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="space-y-3">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-6 bg-yellow-500 rounded-sm" />
                                <span className="text-sm">Yellow Cards</span>
                            </div>
                            <span className="font-semibold">{ home ? home.yellowCards : 0 }</span>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-6 bg-red-500 rounded-sm" />
                                <span className="text-sm">Red Cards</span>
                            </div>
                            <span className="font-semibold">{ home ? home.redCards : 0 }</span>
                        </motion.div>
                        </div>
                        <div className="space-y-3">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between"
                        >
                            <span className="font-semibold">{ away ? away.yellowCards : 0 }</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm">Yellow Cards</span>
                                <div className="w-4 h-6 bg-yellow-500 rounded-sm" />
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center justify-between"
                        >
                            <span className="font-semibold">{ away ? away.redCards : 0 }</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm">Red Cards</span>
                                <div className="w-4 h-6 bg-red-500 rounded-sm" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>

        {/* Match Details */}
        <div className="bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border">
            <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                Match Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <div className="p-3 md:p-4 bg-card/40 backdrop-blur-sm rounded-lg md:rounded-xl border border-border">
                <div className="text-xs md:text-sm text-muted-foreground">Referee</div>
                <div className="text-sm md:text-base font-medium">{ fixtureData?.referee || 'Unknown' }</div>
                </div>
                <div className="p-3 md:p-4 bg-card/40 backdrop-blur-sm rounded-lg md:rounded-xl border border-border">
                <div className="text-xs md:text-sm text-muted-foreground">Venue</div>
                <div className="text-sm md:text-base font-medium">{ fixtureData?.stadium }</div>
                </div>
                <div className="p-3 md:p-4 bg-card/40 backdrop-blur-sm rounded-lg md:rounded-xl border border-border">
                <div className="text-xs md:text-sm text-muted-foreground">Status</div>
                <div className="text-sm md:text-base font-medium capitalize">{ fixtureData?.status }</div>
                </div>
            </div>
        </div>
    </div>
  )
}

function QuickStat(
    { icon, label, home, away }: 
    { icon: React.ReactNode; label: string; home: number; away: number }
) {
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

function StatBar(
    { label, home, away }: 
    { label: string; home: number; away: number }
) {
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
          <span className="font-medium text-emerald-500">{ home }</span>
          <span className="font-medium">{label}</span>
          <span className="font-medium text-emerald-500">{ away }</span>
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

export default Stats