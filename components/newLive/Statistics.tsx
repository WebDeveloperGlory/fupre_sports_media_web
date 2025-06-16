'use client'

import { FixturePlayerRatings, FixtureStat } from '@/utils/v2requestSubData.types'
import { BarChart2, Star } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from 'framer-motion';

interface IStatistics {
    homeStat: FixtureStat;
    awayStat: FixtureStat;
    ratings: FixturePlayerRatings[];
    home: string;
    away: string;
}

const Statistics = ({ homeStat, awayStat, ratings, home, away }: IStatistics ) => {
    const [showFullRatings, setShowFullRatings] = useState<boolean>( false );

    // Calculate total elapsed game time
    const totalElapsedGameTime = homeStat.possessionTime + awayStat.possessionTime;
    const homePossession = totalElapsedGameTime > 0 ? ( homeStat.possessionTime / totalElapsedGameTime ) * 100 : 50;
    const awayPossession = 100 - homePossession; // Ensures total is always 100%

    // Sort Ratings
    const sortedRatings = [ ...ratings ].sort((a,b) => b.rating - a.rating);
    const playerStatString = ( 
        position: string, 
        stats: { goals: number, assists: number, shots: number, passes: number, tackles: number, saves: number } 
    ) => {
        if( position.toLowerCase() === 'gk' ) {
            return `Goals: ${ stats.goals }, Assists: ${ stats.assists }, Saves: ${ stats.saves }`
        } else {
            return `Goals: ${ stats.goals }, Assists: ${ stats.assists }, Shots: ${ stats.shots }`
        }
    }

  return (
    <div className='space-y-4'>
        {/* Matc Stats */}
        <div className='bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50  transition-all duration-300 space-y-4'>
            <div className='flex gap-2 items-center font-bold'>
                <BarChart2 className='text-emerald-500 w-6 h-6' />
                <h2>Match Statistics</h2>
            </div>
            <div className='space-y-3'>
                <StatBar
                    label='possession'
                    home={ Number(homePossession.toFixed( 2 )) }
                    away={ Number(awayPossession.toFixed( 2 )) }
                />
                <StatBar
                    label='shots on target'
                    home={ homeStat.shotsOnTarget }
                    away={ awayStat.shotsOnTarget }
                />
                <StatBar
                    label='shots off target'
                    home={ homeStat.shotsOffTarget }
                    away={ awayStat.shotsOffTarget }
                />
                <StatBar
                    label='corners'
                    home={ homeStat.corners }
                    away={ awayStat.corners }
                />
                <StatBar
                    label='offsides'
                    home={ homeStat.offsides }
                    away={ awayStat.offsides }
                />
                <StatBar
                    label='fouls'
                    home={ homeStat.fouls }
                    away={ awayStat.fouls }
                />
                <StatBar
                    label='yellow cards'
                    home={ homeStat.yellowCards }
                    away={ awayStat.yellowCards }
                />
                <StatBar
                    label='red cards'
                    home={ homeStat.redCards }
                    away={ awayStat.redCards }
                />
            </div>
        </div>

        {/* Player Ratings */}
        <div className='bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50  transition-all duration-300 space-y-4'>
            <div className='flex gap-2 items-center font-bold'>
                <Star className='text-emerald-500 w-6 h-6' />
                <h2>Player Ratings</h2>
            </div>
            <div className='space-y-2'>
                {
                    !showFullRatings
                        ? sortedRatings.slice(0,5).map( ( player, i ) => (
                            <div key={ i } className='gap-2 items-center flex justify-between'>
                                <div className='basis-11/12 flex gap-4 items-center'>
                                    <div className='w-12 h-12 rounded-full bg-muted flex items-center justify-center'>{ player.player.name.slice(0,1) }</div>
                                    <div className=''>
                                        <h3 className=''>{ player.player.name }</h3>
                                        <p className='uppercase text-sm text-muted-foreground'>{ player.team === 'home' ? home : away }</p>
                                        {
                                            player.stats && (
                                                <span className='text-sm text-muted-foreground hidden md:block'>{ playerStatString( player.player.position, player.stats ) }</span>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className='basis-1/12'>
                                    <div className='bg-muted rounded-lg px-2 py-1 flex items-center justify-center gap-2'>
                                        <Star className='w-5 h-5 text-emerald-500' />
                                        { player.rating }
                                    </div>
                                </div>                            
                            </div>
                        )) : sortedRatings.map( ( player, i ) => (
                            <div key={ i } className='gap-2 items-center flex justify-between'>
                                <div className='basis-11/12 flex gap-4 items-center'>
                                    <div className='w-12 h-12 rounded-full bg-muted flex items-center justify-center'>{ player.player.name.slice(0,1) }</div>
                                    <div className=''>
                                        <h3 className=''>{ player.player.name }</h3>
                                        <p className='uppercase text-sm text-muted-foreground'>{ player.team === 'home' ? home : away }</p>
                                        {
                                            player.stats && (
                                                <span className='text-sm text-muted-foreground hidden md:block'>{ playerStatString( player.player.position, player.stats ) }</span>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className='basis-1/12'>
                                    <div className='bg-muted rounded-lg px-2 py-1 flex items-center justify-center gap-2'>
                                        <Star className='w-5 h-5 text-emerald-500' />
                                        { player.rating }
                                    </div>
                                </div>                            
                            </div>
                        ))
                }
            </div>
            <button
                onClick={ () => setShowFullRatings( !showFullRatings ) }
                className='w-full text-emerald-500 border border-emerald-500 hover:opacity-80 py-2 rounded-lg'
            >
                { showFullRatings ? 'Show less player ratings' : 'View all player ratings' }
            </button>
        </div>
    </div>
  )
}

function StatBar({ label, home, away, className }: { label: string; home: number; away: number, className?: string }) {
  const total = home + away;
  const homePercent = total === 0 ? 50 : (home / total) * 100;
  const awayPercent = total === 0 ? 50 : (away / total) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${ className }`}
    >
      <div className="flex justify-between text-sm">
        <span className="font-medium text-emerald-500">{home}</span>
        <span className="font-medium capitalize">{label}</span>
        <span className="font-medium text-emerald-500/50">{away}</span>
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

export default Statistics