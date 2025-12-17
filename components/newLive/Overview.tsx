'use client'

import { FixtureStreamLinks, FixturePlayerRatings, FixtureLineup, FixtureOdds, FixturePlayerOfTheMatch } from '@/utils/V2Utils/v2requestSubData.types'
import { Star, Trophy, Video, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { countPOTMVotes } from '@/constants'
import { TeamType } from '@/utils/V2Utils/v2requestData.enums'

interface IOverview {
    stream: FixtureStreamLinks[] | null;
    playerRatings: FixturePlayerRatings[];
    playerOfTheMatch: FixturePlayerOfTheMatch;
    homeLineup: FixtureLineup;
    awayLineup: FixtureLineup;
    home: string;
    away: string;
    odds: FixtureOdds;
    setOpen: (value: boolean) => void;
    setModalType: (value: 'vote' | 'rate' | null) => void;
    isLoggedIn: boolean;
    minute: number;
}

const Overview = ({ stream, playerRatings, playerOfTheMatch, homeLineup, awayLineup, home, away, odds, setOpen, setModalType, isLoggedIn, minute }: IOverview) => {
    // Button Click Functions
    const onVoteClick = () => {
        setOpen(true);
        setModalType('vote');
    }
    const onRateClick = () => {
        setOpen(true);
        setModalType('rate');
    }

    // Others
    const choosenStream = stream ? stream[0] : null;
    const sortedRatings = [...playerRatings].sort((a, b) => b.fanRatings.average - a.fanRatings.average);
    const playerStatString = (
        position: string,
        stats: { goals: number, assists: number, shots: number, passes: number, tackles: number, saves: number }
    ) => {
        if (position && position.toLowerCase() === 'gk') {
            return `Goals: ${stats.goals}, Assists: ${stats.assists}, Saves: ${stats.saves}`
        } else {
            return `Goals: ${stats.goals}, Assists: ${stats.assists}, Shots: ${stats.shots}`
        }
    }
    const POTMVotes = countPOTMVotes(playerOfTheMatch.userVotes);
    const playerInRatings = (playerId: string) => playerRatings.find(player => player.player._id === playerId);

    return (
        <div className='space-y-3'>
            {/* LiveStream */}
            <div className='border border-border rounded-lg md:rounded-xl p-4'>
                <div className='flex gap-2 items-center font-bold mb-4'>
                    <Video className='text-emerald-600 dark:text-emerald-400 w-5 h-5' />
                    <h2>Live Stream</h2>
                </div>
                <div className='flex justify-center items-center bg-secondary w-full h-[160px] sm:h-[200px] md:h-[280px] rounded-lg'>
                    <Link
                        href={choosenStream ? choosenStream.url : ''}
                        className='px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-medium transition-colors'
                    >
                        {choosenStream ? `Watch On ${choosenStream.platform}` : 'No Stream Available'}
                    </Link>
                </div>
                <div className='flex gap-2 items-center text-muted-foreground text-xs mt-3'>
                    <span>{choosenStream?.isOfficial ? 'Official' : 'Fan'} Stream</span>
                    <span>•</span>
                    <span>Free To Watch</span>
                </div>
            </div>

            {/* Player Ratings */}
            <div className='border border-border rounded-lg md:rounded-xl p-4'>
                <div className='flex gap-2 items-center font-bold mb-4'>
                    <Star className='text-emerald-600 dark:text-emerald-400 w-5 h-5' />
                    <h2>Fan Player Ratings</h2>
                </div>
                <div className='space-y-2'>
                    {sortedRatings.slice(0, 5).map((player, i) => (
                        <div key={i} className='flex items-center gap-3 py-2 border-b border-border last:border-0'>
                            <div className='flex items-center gap-3 flex-1 min-w-0'>
                                <div className='w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-medium'>
                                    {player.player.name.slice(0, 1)}
                                </div>
                                <div className='min-w-0 flex-1'>
                                    <h3 className='font-medium truncate text-sm'>{player.player.name}</h3>
                                    <p className='uppercase text-xs text-muted-foreground'>{player.team === 'home' ? home : away}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-1 bg-secondary rounded-lg px-2 py-1'>
                                <Star className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
                                <span className='text-sm font-bold'>{player.fanRatings.average}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={onRateClick}
                    className='w-full mt-4 border border-border hover:bg-secondary py-2.5 rounded-lg text-sm font-medium transition-colors'
                >
                    Rate a Player
                </button>
            </div>

            {/* POTM Voting */}
            <div className='border border-border rounded-lg md:rounded-xl p-4'>
                <div className='flex gap-2 items-center font-bold mb-4'>
                    <Trophy className='text-emerald-600 dark:text-emerald-400 w-5 h-5' />
                    <h2>Player Of The Match</h2>
                </div>

                {minute < 70 ? (
                    <div className='text-center py-8'>
                        <div className='w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3'>
                            <Trophy className='w-6 h-6 text-muted-foreground' />
                        </div>
                        <p className='text-muted-foreground text-sm'>POTM voting available after 70'</p>
                        <p className='text-xs text-muted-foreground mt-1'>Current: {minute}'</p>
                    </div>
                ) : (
                    <>
                        {/* Official Vote */}
                        {playerOfTheMatch.official && (
                            <div className='p-3 border border-amber-500/50 bg-amber-500/10 rounded-lg mb-4'>
                                <div className='flex items-center gap-3'>
                                    <Trophy className='w-5 h-5 text-amber-500' />
                                    <div>
                                        <p className='font-bold'>{playerOfTheMatch.official.name}</p>
                                        <span className='text-muted-foreground text-xs'>
                                            {playerInRatings(playerOfTheMatch.official._id)?.team === TeamType.HOME ? home : away}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Voting List */}
                        <div className='space-y-2'>
                            <p className='text-sm'>Total Votes: <span className='font-bold text-emerald-600 dark:text-emerald-400'>{POTMVotes.totalVotes || 0}</span></p>
                            {POTMVotes.players.slice(0, 5).map((player, i) => (
                                <div key={player._id} className='flex justify-between items-center py-2 border-b border-border last:border-0'>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-6 h-6 rounded-full border border-border flex items-center justify-center text-xs'>{i + 1}</span>
                                        <span className='text-sm font-medium'>{player.name}</span>
                                    </div>
                                    <div className='text-right'>
                                        <span className='text-sm font-bold'>{player.totalVotes}</span>
                                        <span className='text-xs text-muted-foreground ml-1'>({(player.totalVotes / POTMVotes.totalVotes * 100).toFixed(0)}%)</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {isLoggedIn ? (
                            <button
                                onClick={onVoteClick}
                                className='w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors'
                            >
                                Vote for POTM
                            </button>
                        ) : (
                            <div className='mt-4 border border-dashed border-border py-3 rounded-lg text-center'>
                                <p className='text-sm text-muted-foreground'>Login to vote</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Betting Odds */}
            {odds && (
                <div className='border border-border rounded-lg md:rounded-xl p-4'>
                    <div className='flex gap-2 items-center font-bold mb-4'>
                        <TrendingUp className='text-emerald-600 dark:text-emerald-400 w-5 h-5' />
                        <h2>Live Betting Odds</h2>
                    </div>
                    <div className='grid grid-cols-3 gap-2'>
                        <div className='bg-secondary rounded-lg text-center py-4 px-2'>
                            <p className='text-xs text-muted-foreground mb-1 truncate' title={home}>1</p>
                            <p className='text-xl font-bold text-emerald-600 dark:text-emerald-400'>{odds.live.homeWin}</p>
                            <p className='text-xs text-muted-foreground mt-1 truncate'>{home}</p>
                        </div>
                        <div className='bg-secondary rounded-lg text-center py-4 px-2'>
                            <p className='text-xs text-muted-foreground mb-1'>X</p>
                            <p className='text-xl font-bold text-emerald-600 dark:text-emerald-400'>{odds.live.draw}</p>
                            <p className='text-xs text-muted-foreground mt-1'>Draw</p>
                        </div>
                        <div className='bg-secondary rounded-lg text-center py-4 px-2'>
                            <p className='text-xs text-muted-foreground mb-1 truncate' title={away}>2</p>
                            <p className='text-xl font-bold text-emerald-600 dark:text-emerald-400'>{odds.live.awayWin}</p>
                            <p className='text-xs text-muted-foreground mt-1 truncate'>{away}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Overview