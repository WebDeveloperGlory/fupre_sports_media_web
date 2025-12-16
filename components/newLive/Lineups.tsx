'use client'

import { TeamType } from '@/utils/V2Utils/v2requestData.enums';
import { FixtureLineup, FixtureSubstitutions } from '@/utils/V2Utils/v2requestSubData.types'
import { ArrowLeft, ArrowRight, ChevronDown, Users } from 'lucide-react'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ILineups {
    home: string;
    away: string;
    homeLineup: FixtureLineup;
    awayLineup: FixtureLineup;
    subs: FixtureSubstitutions[];
}

const Lineups = ({ homeLineup, awayLineup, home, away, subs }: ILineups) => {
    const sortedSubs = [...subs].sort((a, b) => b.minute - a.minute);
    const [homeOpen, setHomeOpen] = useState(false);
    const [awayOpen, setAwayOpen] = useState(false);

    return (
        <div className='space-y-3 sm:space-y-4'>
            {/* Lineups Section */}
            <div className='bg-card/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-border transition-all duration-300 space-y-3 sm:space-y-4'>
                {/* Header */}
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                    <div className='flex gap-2 items-center font-bold'>
                        <Users className='text-emerald-500 w-5 h-5 sm:w-6 sm:h-6' />
                        <h2 className='text-sm sm:text-base'>Lineups</h2>
                    </div>
                    <div className='flex items-center gap-3 sm:gap-4 text-xs sm:text-sm'>
                        <div className='flex items-center gap-1'>
                            <div className='bg-emerald-500 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full'></div>
                            <p>Starting XI</p>
                        </div>
                        <div className='flex items-center gap-1'>
                            <div className='bg-muted w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full'></div>
                            <p>Substitutes</p>
                        </div>
                    </div>
                </div>

                {/* Team Dropdowns */}
                <div className='space-y-2 sm:space-y-3'>
                    {/* Home Team Dropdown */}
                    <div className='border border-border rounded-xl overflow-hidden'>
                        <button
                            onClick={() => setHomeOpen(!homeOpen)}
                            className='w-full flex items-center justify-between p-3 sm:p-4 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors'
                        >
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/20 flex items-center justify-center'>
                                    <Users className='w-4 h-4 sm:w-5 sm:h-5 text-emerald-500' />
                                </div>
                                <div className='text-left'>
                                    <h3 className='font-semibold text-sm sm:text-base'>{home}</h3>
                                    <p className='text-xs text-muted-foreground'>Formation: {homeLineup.formation}</p>
                                </div>
                            </div>
                            <motion.div
                                animate={{ rotate: homeOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className='w-5 h-5 text-muted-foreground' />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {homeOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className='overflow-hidden'
                                >
                                    <div className='p-3 sm:p-4 space-y-3 bg-background/50'>
                                        {/* Starting XI */}
                                        <div>
                                            <p className='text-xs sm:text-sm text-emerald-500 font-medium mb-2'>Starting XI</p>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2'>
                                                {homeLineup.startingXI.map((player, i) => (
                                                    <div
                                                        key={i}
                                                        className='px-2.5 sm:px-3 py-1.5 sm:py-2 border border-emerald-500/30 rounded-lg flex gap-2 items-center bg-emerald-500/5'
                                                    >
                                                        <div className='w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium'>{i + 1}</div>
                                                        <div className='min-w-0 flex-1'>
                                                            <p className='text-xs sm:text-sm truncate'>{player.player.name}</p>
                                                            <span className='text-[10px] sm:text-xs text-muted-foreground'>{player.position}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Substitutes */}
                                        <div>
                                            <p className='text-xs sm:text-sm text-muted-foreground font-medium mb-2'>Substitutes</p>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2'>
                                                {homeLineup.substitutes.map((player, i) => (
                                                    <div
                                                        key={i}
                                                        className='px-2.5 sm:px-3 py-1.5 sm:py-2 border border-border rounded-lg flex gap-2 items-center'
                                                    >
                                                        <div className='w-5 h-5 sm:w-6 sm:h-6 bg-muted rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium'>{i + 1}</div>
                                                        <div className='min-w-0 flex-1'>
                                                            <p className='text-xs sm:text-sm truncate'>{player.player.name}</p>
                                                            <span className='text-[10px] sm:text-xs text-muted-foreground'>{player.position}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Coach */}
                                        <p className='text-xs sm:text-sm text-muted-foreground'>Coach: {homeLineup.coach}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Away Team Dropdown */}
                    <div className='border border-border rounded-xl overflow-hidden'>
                        <button
                            onClick={() => setAwayOpen(!awayOpen)}
                            className='w-full flex items-center justify-between p-3 sm:p-4 bg-purple-500/5 hover:bg-purple-500/10 transition-colors'
                        >
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/20 flex items-center justify-center'>
                                    <Users className='w-4 h-4 sm:w-5 sm:h-5 text-purple-500' />
                                </div>
                                <div className='text-left'>
                                    <h3 className='font-semibold text-sm sm:text-base'>{away}</h3>
                                    <p className='text-xs text-muted-foreground'>Formation: {awayLineup.formation}</p>
                                </div>
                            </div>
                            <motion.div
                                animate={{ rotate: awayOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className='w-5 h-5 text-muted-foreground' />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {awayOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className='overflow-hidden'
                                >
                                    <div className='p-3 sm:p-4 space-y-3 bg-background/50'>
                                        {/* Starting XI */}
                                        <div>
                                            <p className='text-xs sm:text-sm text-purple-500 font-medium mb-2'>Starting XI</p>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2'>
                                                {awayLineup.startingXI.map((player, i) => (
                                                    <div
                                                        key={i}
                                                        className='px-2.5 sm:px-3 py-1.5 sm:py-2 border border-purple-500/30 rounded-lg flex gap-2 items-center bg-purple-500/5'
                                                    >
                                                        <div className='w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium'>{i + 1}</div>
                                                        <div className='min-w-0 flex-1'>
                                                            <p className='text-xs sm:text-sm truncate'>{player.player.name}</p>
                                                            <span className='text-[10px] sm:text-xs text-muted-foreground'>{player.position}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Substitutes */}
                                        <div>
                                            <p className='text-xs sm:text-sm text-muted-foreground font-medium mb-2'>Substitutes</p>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2'>
                                                {awayLineup.substitutes.map((player, i) => (
                                                    <div
                                                        key={i}
                                                        className='px-2.5 sm:px-3 py-1.5 sm:py-2 border border-border rounded-lg flex gap-2 items-center'
                                                    >
                                                        <div className='w-5 h-5 sm:w-6 sm:h-6 bg-muted rounded-full flex items-center justify-center text-[10px] sm:text-xs font-medium'>{i + 1}</div>
                                                        <div className='min-w-0 flex-1'>
                                                            <p className='text-xs sm:text-sm truncate'>{player.player.name}</p>
                                                            <span className='text-[10px] sm:text-xs text-muted-foreground'>{player.position}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Coach */}
                                        <p className='text-xs sm:text-sm text-muted-foreground'>Coach: {awayLineup.coach}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Substitutions Section */}
            {sortedSubs.length > 0 && (
                <div className='bg-card/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-border transition-all duration-300 space-y-3'>
                    <div className='flex gap-2 items-center font-bold'>
                        <ArrowRight className='text-green-500 w-4 h-4 sm:w-5 sm:h-5' />
                        <ArrowLeft className='text-red-500 w-4 h-4 sm:w-5 sm:h-5 -ml-1' />
                        <h2 className='text-sm sm:text-base'>Substitutions</h2>
                    </div>
                    <div className='space-y-2'>
                        {sortedSubs.map((sub, i) => (
                            <div
                                key={i}
                                className='px-3 sm:px-4 py-2 sm:py-2.5 border border-emerald-500/30 rounded-lg flex gap-3 sm:gap-4 items-center bg-emerald-500/5'
                            >
                                <p className='text-xs sm:text-sm font-medium text-emerald-500 w-8'>{sub.minute}'</p>
                                <div className='flex-1 min-w-0'>
                                    <h3 className='text-xs sm:text-sm font-medium'>{sub.team === TeamType.HOME ? home : away}</h3>
                                    <div className='flex flex-wrap gap-x-2 gap-y-0.5 items-center text-xs text-muted-foreground'>
                                        <div className='flex items-center gap-1'>
                                            <ArrowRight className='w-3 h-3 text-green-500 flex-shrink-0' />
                                            <p className='truncate'>{sub.playerIn.name}</p>
                                        </div>
                                        <span className='hidden sm:inline'>|</span>
                                        <div className='flex items-center gap-1'>
                                            <ArrowLeft className='w-3 h-3 text-red-500 flex-shrink-0' />
                                            <p className='truncate'>{sub.playerOut.name}</p>
                                        </div>
                                    </div>
                                    {sub.injury && <p className='text-[10px] sm:text-xs text-red-400 italic'>Injured</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Lineups