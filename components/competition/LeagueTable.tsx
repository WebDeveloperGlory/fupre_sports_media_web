import { teamLogos } from '@/constants'
import { ExtendedLeagueTableEntry } from '@/utils/requestDataTypes'
import Image from 'next/image'
import React from 'react'

const LeagueTable = ({ table }: { table: ExtendedLeagueTableEntry[] }) => {
    if ( !table || table.length === 0 ) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No table data
            </div>
        );
    }
  return (
    <table className="w-full">
        <thead>
            <tr className="border-b border-border">
            <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Pos</th>
            <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Team</th>
            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">P</th>
            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">W</th>
            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">D</th>
            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">L</th>
            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">GF</th>
            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">GA</th>
            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">GD</th>
            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">DP</th>
            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Pts</th>
            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Form</th>
            </tr>
        </thead>
        <tbody>
            {
                table.map(( entry, index ) => (
                    <tr 
                        key={ entry.team._id } 
                        className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                        <td className="py-4 px-3 text-sm">{ index + 1 }</td>
                        <td className="py-4 px-3">
                            <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8">
                                <Image
                                    src={ teamLogos[ entry.team.name ] || '/images/team_logos/default.jpg' }
                                    alt={`${ entry.team.name } logo`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-medium text-sm md:text-base">
                                { entry.team.name }
                            </span>
                            </div>
                        </td>
                        <td className="text-center py-4 px-3 text-sm">{ entry.played }</td>
                        <td className="text-center py-4 px-3 text-sm">{ entry.wins }</td>
                        <td className="text-center py-4 px-3 text-sm">{ entry.draws }</td>
                        <td className="text-center py-4 px-3 text-sm">{ entry.losses }</td>
                        <td className="text-center py-4 px-3 text-sm">{ entry.goalsFor }</td>
                        <td className="text-center py-4 px-3 text-sm">{ entry.goalsAgainst }</td>
                        <td className="text-center py-4 px-3 text-sm">{ entry.goalDifference }</td>
                        <td className="text-center py-4 px-3 text-sm">{ entry.disciplinaryPoints || 0 }</td>
                        <td className="text-center py-4 px-3 text-sm font-semibold">{ entry.points }</td>
                        <td className="text-center py-4 px-3">
                            <div className="flex items-center justify-center gap-1">
                                { 
                                    [ ...entry.form ].reverse().map((result, i) => (
                                        <span
                                            key={i}
                                            className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium ${
                                            result === 'W' 
                                                ? 'bg-emerald-500/10 text-emerald-500' 
                                                : result === 'D'
                                                ? 'bg-orange-500/10 text-orange-500'
                                                : 'bg-red-500/10 text-red-500'
                                            }`}
                                        >
                                            {result}
                                        </span>
                                    ))
                                }
                            </div>
                        </td>
                    </tr>
                ))
            }
        </tbody>
    </table>
  )
}

export default LeagueTable