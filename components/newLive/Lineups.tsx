'use client'

import { TeamType } from '@/utils/v2requestData.enums';
import { FixtureLineup, FixtureSubstitutions } from '@/utils/v2requestSubData.types'
import { ArrowLeft, ArrowRight, Users } from 'lucide-react'
import React from 'react'

interface ILineups {
    home: string;
    away: string;
    homeLineup: FixtureLineup;
    awayLineup: FixtureLineup;
    subs: FixtureSubstitutions[];
}

const Lineups = ({ homeLineup, awayLineup, home, away, subs }: ILineups) => {
    const sortedSubs = [ ...subs ].sort((a,b) => b.minute - a.minute);

  return (
        <div className='space-y-4'>
            {/* Commentary */}
            <div className='bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50  transition-all duration-300 space-y-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-2 items-center font-bold'>
                        <Users className='text-emerald-500 w-6 h-6' />
                        <h2>Lineups</h2>
                    </div>
                    <div className='flex items-center gap-4 text-sm'>
                        <div className='flex items-center gap-1'>
                            <div className='bg-emerald-500 w-3 h-3 rounded-full'></div>
                            <p>Starting XI</p>
                        </div>
                        <div className='flex items-center gap-1'>
                            <div className='bg-muted w-3 h-3 rounded-full'></div>
                            <p>Substitutes</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col md:flex-row md:justify-between gap-4'>
                    <div className="basis-full md:basis-1/2">
                        <h2 className=''>{ home }</h2>
                        <p className='text-sm text-muted-foreground'>Formation: { homeLineup.formation }</p>
                        <p className='text-sm text-muted-foreground my-2'>Starting XI</p>
                        <div className='space-y-2'>
                            {
                                homeLineup.startingXI.map( (player, i) => (
                                    <div
                                        key={ i }
                                        className='px-4 py-2 border border-emerald-500 rounded-lg flex gap-2 items-center'
                                    >
                                        <div className='w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-sm'>{ i + 1 }</div>
                                        <div>
                                            <p>{ player.player.name }</p>
                                            <span className='text-sm text-muted-foreground'>{ player.position }</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <p className='text-sm text-muted-foreground my-2'>Substitutes</p>
                        <div className='space-y-2'>
                            {
                                homeLineup.substitutes.map( (player, i) => (
                                    <div
                                        key={ i }
                                        className='px-4 py-2 border border-muted-foreground rounded-lg flex gap-2 items-center'
                                    >
                                        <div className='w-6 h-6 bg-muted-foreground rounded-full flex items-center justify-center text-sm'>{ i + 1 }</div>
                                        <div>
                                            <p>{ player.player.name }</p>
                                            <span className='text-sm text-muted-foreground'>{ player.position }</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <p className='text-sm text-muted-foreground my-2'>Coach: { homeLineup.coach }</p>
                    </div>
                    <div className="basis-full md:basis-1/2">
                        <h2 className=''>{ away }</h2>
                        <p className='text-sm text-muted-foreground'>Formation: { awayLineup.formation }</p>
                        <p className='text-sm text-muted-foreground my-2'>Starting XI</p>
                        <div className='space-y-2'>
                            {
                                awayLineup.startingXI.map( (player, i) => (
                                    <div
                                        key={ i }
                                        className='px-4 py-2 border border-emerald-500 rounded-lg flex gap-2 items-center'
                                    >
                                        <div className='w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-sm'>{ i + 1 }</div>
                                        <div>
                                            <p>{ player.player.name }</p>
                                            <span className='text-sm text-muted-foreground'>{ player.position }</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <p className='text-sm text-muted-foreground my-2'>Substitutes</p>
                        <div className='space-y-2'>
                            {
                                awayLineup.substitutes.map( (player, i) => (
                                    <div
                                        key={ i }
                                        className='px-4 py-2 border border-muted-foreground rounded-lg flex gap-2 items-center'
                                    >
                                        <div className='w-6 h-6 bg-muted-foreground rounded-full flex items-center justify-center text-sm'>{ i + 1 }</div>
                                        <div>
                                            <p>{ player.player.name }</p>
                                            <span className='text-sm text-muted-foreground'>{ player.position }</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <p className='text-sm text-muted-foreground my-2'>Coach: { awayLineup.coach }</p>
                    </div>
                </div>
            </div>
             {/* Commentary */}
            <div className='bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50  transition-all duration-300 space-y-4'>
                <div className='flex gap-2 items-center font-bold'>
                    {/* <MessageSquare className='text-emerald-500 w-6 h-6' /> */}
                    <h2>Substitutions</h2>
                </div>
                <div className='space-y-2'>
                    {
                        sortedSubs.map( ( sub, i ) => (
                            <div
                                key={ i }
                                className='px-4 py-2 border border-emerald-500 rounded-lg flex gap-4 items-center'
                            >
                                <p className='text-sm'>{ sub.minute }'</p>
                                <div>
                                    <h3>{ sub.team === TeamType.HOME ? home : away }</h3>
                                    <div className='flex gap-1 items-center text-sm text-muted-foreground'>
                                        <ArrowRight className='w-4 h-4 text-green-500' />
                                        <p>{ sub.playerIn.name }</p>
                                        <p className='mx-2'>|</p>
                                        <ArrowLeft className='w-4 h-4 text-red-500' />
                                        <p>{ sub.playerOut.name }</p>
                                    </div>
                                    { sub.injury && <p className='text-muted-foreground italics'>Injured</p>}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
  )
}

export default Lineups