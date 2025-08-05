import { teamLogos } from '@/constants'
import { ILeagueStandings } from '@/utils/V2Utils/v2requestData.types'
import Image from 'next/image'
import React from 'react'
import { Trophy } from 'lucide-react'

const LeagueTable = ({ table }: { table: ILeagueStandings[] }) => {
    if ( !table || table.length === 0 ) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium">No table data available</p>
                <p className="text-sm">League standings will appear here once matches are played</p>
            </div>
        );
    }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b-2 border-border">
            <th className="text-left py-4 px-4 text-sm font-semibold text-foreground uppercase tracking-wide">Pos</th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-foreground uppercase tracking-wide">Team</th>
            <th className="text-center py-4 px-3 text-sm font-semibold text-foreground uppercase tracking-wide">P</th>
            <th className="text-center py-4 px-3 text-sm font-semibold text-foreground uppercase tracking-wide">W</th>
            <th className="text-center py-4 px-3 text-sm font-semibold text-foreground uppercase tracking-wide">D</th>
            <th className="text-center py-4 px-3 text-sm font-semibold text-foreground uppercase tracking-wide">L</th>
            <th className="text-center py-4 px-3 text-sm font-semibold text-foreground uppercase tracking-wide">GF</th>
            <th className="text-center py-4 px-3 text-sm font-semibold text-foreground uppercase tracking-wide">GA</th>
            <th className="text-center py-4 px-3 text-sm font-semibold text-foreground uppercase tracking-wide">GD</th>
            <th className="text-center py-4 px-3 text-sm font-semibold text-foreground uppercase tracking-wide">Pts</th>
            <th className="text-center py-4 px-3 text-sm font-semibold text-foreground uppercase tracking-wide">Form</th>
          </tr>
        </thead>
        <tbody>
          {table.map((entry, index) => {
            const isTopPosition = index < 3;
            const isRelegationZone = index >= table.length - 3;

            return (
              <tr
                key={entry.team._id}
                className={`
                  border-b border-border hover:bg-muted/30 transition-colors
                  ${isTopPosition ? 'border-l-4 border-l-emerald-500' : ''}
                  ${isRelegationZone ? 'border-l-4 border-l-red-500' : ''}
                  ${!isTopPosition && !isRelegationZone ? 'border-l-4 border-l-transparent' : ''}
                `}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`
                      w-6 h-6 flex items-center justify-center text-xs font-bold
                      ${isTopPosition ? 'bg-emerald-100 text-emerald-800' : ''}
                      ${isRelegationZone ? 'bg-red-100 text-red-800' : ''}
                      ${!isTopPosition && !isRelegationZone ? 'text-muted-foreground' : ''}
                    `}>
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <Image
                        src={teamLogos[entry.team.name] || '/images/team_logos/default.jpg'}
                        alt={`${entry.team.name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-medium text-foreground">{entry.team.name}</span>
                  </div>
                </td>
                <td className="text-center py-4 px-3 text-sm font-medium">{entry.played}</td>
                <td className="text-center py-4 px-3 text-sm font-medium">{entry.wins}</td>
                <td className="text-center py-4 px-3 text-sm font-medium">{entry.draws}</td>
                <td className="text-center py-4 px-3 text-sm font-medium">{entry.losses}</td>
                <td className="text-center py-4 px-3 text-sm font-medium">{entry.goalsFor}</td>
                <td className="text-center py-4 px-3 text-sm font-medium">{entry.goalsAgainst}</td>
                <td className={`text-center py-4 px-3 text-sm font-medium ${
                  entry.goalDifference > 0 ? 'text-emerald-600' :
                  entry.goalDifference < 0 ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  {entry.goalDifference > 0 ? '+' : ''}{entry.goalDifference}
                </td>
                <td className="text-center py-4 px-3 text-sm font-bold text-foreground">{entry.points}</td>
                <td className="text-center py-4 px-3">
                  <div className="flex items-center justify-center gap-1">
                    {[...entry.form].reverse().slice(0, 5).map((result, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${
                          result === 'W'
                            ? 'bg-emerald-500 text-white'
                            : result === 'D'
                            ? 'bg-orange-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-emerald-500"></div>
          <span>Top 3 positions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-red-500"></div>
          <span>Relegation zone</span>
        </div>
      </div>
    </div>
  )
}

export default LeagueTable