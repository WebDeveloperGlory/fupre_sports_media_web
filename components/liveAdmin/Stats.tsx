import { FixtureStats } from '@/utils/stateTypes'
import React from 'react'

const Stats = ({ homeStats, awayStats }: { homeStats: FixtureStats, awayStats: FixtureStats }) => {
  return (
    <div className='px-4 lg:px-6 py-4 pb-3 w-full'>
        <div className="bg-muted rounded-lg p-6">
            <h3 className="text-center text-sm font-semibold mb-4">Match Stats</h3>
            <div>
                <StatCard
                    label='Shots'
                    homeStat={ homeStats.shotsOnTarget + homeStats.shotsOffTarget }
                    awayStat={ awayStats.shotsOnTarget + awayStats.shotsOffTarget }
                />
                <StatCard 
                    label='Shots On Target'
                    homeStat={ homeStats.shotsOnTarget }
                    awayStat={ awayStats.shotsOnTarget }
                />
                <StatCard
                    label='Fouls'
                    homeStat={ homeStats.fouls }
                    awayStat={ awayStats.fouls }
                />
                <StatCard
                    label='Yellow Cards'
                    homeStat={ homeStats.yellowCards }
                    awayStat={ awayStats.yellowCards }
                />
                <StatCard
                    label='Red Cards'
                    homeStat={ homeStats.redCards }
                    awayStat={ awayStats.redCards }
                />
                <StatCard
                    label='Offsides'
                    homeStat={ homeStats.offsides }
                    awayStat={ awayStats.offsides }
                />
                <StatCard
                    label='Corners'
                    homeStat={ homeStats.corners }
                    awayStat={ awayStats.corners }
                />
            </div>
        </div>
    </div>
  )
}

const StatCard = (
    { label, homeStat, awayStat }: 
    { label: string, homeStat: number, awayStat: number }
) => {
    return (
        <div className='flex justify-between items-center py-2 border-b dark:border-b-white'>
            <p className='font-bold text-orange-500'>{ homeStat }</p>
            <p>{ label }</p>
            <p className='font-bold text-orange-500'>{ awayStat }</p>
        </div>
    )
}

export default Stats