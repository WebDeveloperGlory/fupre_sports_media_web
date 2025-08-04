'use client'

import { FixtureStreamLinks, FixturePlayerRatings, FixtureLineup, FixtureOdds, FixturePlayerOfTheMatch } from '@/utils/V2Utils/v2requestSubData.types'
import { Star, Trophy, Video } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import PopUpModal from '../modal/PopUpModal'
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
    setOpen: ( value: boolean ) => void;
    setModalType: ( value: 'vote' | 'rate' | null ) => void;
    isLoggedIn: boolean;
    minute: number;
}

const Overview = ({ stream, playerRatings, playerOfTheMatch, homeLineup, awayLineup, home, away, odds, setOpen, setModalType, isLoggedIn, minute }: IOverview) => {
    // Button Click Functions
    const onVoteClick = () => {
        setOpen( true );
        setModalType( 'vote' );
    }
    const onRateClick = () => {
        setOpen( true );
        setModalType( 'rate' );
    }

    // Others
    const choosenStream = stream ? stream[0] : null;
    const sortedRatings = [ ...playerRatings ].sort((a,b) => b.fanRatings.average - a.fanRatings.average);
    const sortedPOTMVotes = [ ...playerOfTheMatch.fanVotes ].sort((a,b) => b.votes - a.votes);
    const playerStatString = ( 
        position: string, 
        stats: { goals: number, assists: number, shots: number, passes: number, tackles: number, saves: number } 
    ) => {
        if( position && position.toLowerCase() === 'gk' ) {
            return `Goals: ${ stats.goals }, Assists: ${ stats.assists }, Saves: ${ stats.saves }`
        } else {
            return `Goals: ${ stats.goals }, Assists: ${ stats.assists }, Shots: ${ stats.shots }`
        }
    }
    const POTMVotes = countPOTMVotes( playerOfTheMatch.userVotes );
    const playerInRatings = (playerId: string) => playerRatings.find(player => player.player._id === playerId);

  return (
    <div className='space-y-4'>
        {/* LiveStream */}
        <div className='bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50  transition-all duration-300'>
            <div className='flex gap-2 items-center font-bold'>
                <Video className='text-emerald-500 w-6 h-6' />
                <h2>Live Stream</h2>
            </div>
            <div className='flex justify-center items-center bg-black/80 w-full h-[180px] sm:h-[240px] md:h-[320px] lg:h-[400px] my-4 rounded-xl'>
                <Link
                    href={ choosenStream ? choosenStream.url : '' }
                    className='px-3 py-2 sm:px-4 sm:py-2.5 bg-emerald-500/20 text-emerald-500 border-emerald-500 border rounded-lg text-sm sm:text-base font-medium hover:bg-emerald-500/30 transition-colors'
                >
                    { choosenStream ? `Watch On ${ choosenStream.platform }` : 'No Streaming Platform' }
                </Link>
            </div>
            <div className='flex gap-1 items-center text-muted-foreground text-sm'>
                <span className=''>{ choosenStream?.isOfficial ? 'Official' : 'Fan' } Stream</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span className=''>Free To Watch</span>
            </div>
        </div>

        {/* Match Events */}
        <div className='bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50  transition-all duration-300 space-y-4'>
            <h1 className='font-bold'>Recent Events</h1>
        </div>

        {/* Player Ratings */}
        <div className='bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50  transition-all duration-300 space-y-4'>
            <div className='flex gap-2 items-center font-bold'>
                <Star className='text-emerald-500 w-6 h-6' />
                <h2>Fan Player Ratings</h2>
            </div>
            <div className='space-y-3'>
                {
                    sortedRatings.slice(0,5).map( ( player, i ) => (
                        <div key={ i } className='flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors'>
                            <div className='flex items-center gap-3 flex-1 min-w-0'>
                                <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center text-sm sm:text-base font-medium flex-shrink-0'>
                                    { player.player.name.slice(0,1) }
                                </div>
                                <div className='min-w-0 flex-1'>
                                    <h3 className='font-medium truncate text-sm sm:text-base'>{ player.player.name }</h3>
                                    <p className='uppercase text-xs sm:text-sm text-muted-foreground'>{ player.team === 'home' ? home : away }</p>
                                    {
                                        player.stats && (
                                            <span className='text-xs text-muted-foreground hidden sm:block'>{ playerStatString( player.player.position, player.stats ) }</span>
                                        )
                                    }
                                </div>
                            </div>
                            <div className='flex-shrink-0 text-center'>
                                <div className='bg-muted rounded-lg px-2 py-1 flex items-center justify-center gap-1 sm:gap-2 min-w-[60px] sm:min-w-[70px]'>
                                    <Star className='w-4 h-4 sm:w-5 sm:h-5 text-emerald-500' />
                                    <span className='text-sm sm:text-base font-medium'>{ player.fanRatings.average }</span>
                                </div>
                                <p className='text-xs text-muted-foreground mt-0.5'>{ player.fanRatings.count } votes</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <button
                onClick={ onRateClick }
                className='w-full text-emerald-500 hover:border hover:border-emerald-500 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors hover:bg-emerald-500/10'
            >
                Rate a player
            </button>
        </div>

        {/* POTM Voting */}
        <div className='bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50 transition-all duration-300 space-y-4'>
            <div className='flex gap-2 items-center font-bold'>
                <Trophy className='text-emerald-500 w-6 h-6' />
                <h2>Player Of The Match</h2>
            </div>

            {/* Check if match has progressed enough */}
            {minute < 70 ? (
                <div className='text-center py-8 space-y-2'>
                    <div className='w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3'>
                        <Trophy className='w-6 h-6 text-muted-foreground' />
                    </div>
                    <p className='text-muted-foreground'>POTM voting will be available after 70 minutes</p>
                    <p className='text-sm text-muted-foreground'>Current time: {minute} minutes</p>
                </div>
            ) : (
                <>
                    {/* Official Vote */}
                    {
                        playerOfTheMatch.official && (
                            <div className='p-4 border border-yellow-400 bg-yellow-200/20 rounded-lg text-yellow-500 mt-4 flex items-center gap-4'>
                                <Trophy className='w-5 h-5' />
                                <div>
                                    <p className='font-bold text-lg'>{playerOfTheMatch.official.name}</p>
                                    <span className='text-muted-foreground text-sm'>
                                        { 
                                            playerInRatings(playerOfTheMatch.official._id)?.team === TeamType.HOME ? home : away }</span>
                                    <p className='text-yellow-500'>Official Rating: {playerInRatings(playerOfTheMatch.official._id)?.official.rating || 'Not Rated Yet'}</p>
                                </div>
                            </div>
                        )
                    }
                    {/* Voting List */}
                    <div className='space-y-3'>
                        <p className='text-sm sm:text-base font-medium'>Total Fan Votes: <span className='text-emerald-500'>{POTMVotes.totalVotes || 0}</span></p>
                        {
                            POTMVotes.players.map((player, i) => (
                                <div
                                    key={player._id}
                                    className='border border-border bg-card/50 p-3 sm:p-4 rounded-lg hover:bg-accent/50 transition-colors'
                                >
                                    <div className='flex justify-between items-center gap-3'>
                                        {/* Player Details */}
                                        <div className='flex items-center gap-2 sm:gap-3 flex-1 min-w-0'>
                                            <div className='flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-muted-foreground bg-card text-xs sm:text-sm font-medium flex-shrink-0'>
                                                {i+1}
                                            </div>
                                            <div className='min-w-0 flex-1'>
                                                <p className='font-medium text-sm sm:text-base truncate'>{player.name}</p>
                                                <span className='text-muted-foreground text-xs sm:text-sm'>Unknown</span>
                                            </div>
                                        </div>
                                        {/* Fan Votes */}
                                        <div className='text-right flex-shrink-0'>
                                            <p className='font-medium text-sm sm:text-base'>{player.totalVotes} votes</p>
                                            <span className='text-xs sm:text-sm text-muted-foreground'>
                                                {(player.totalVotes / POTMVotes.totalVotes * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className='text-xs sm:text-sm mt-2 pt-2 border-t border-border/50'>
                                        <p className='text-muted-foreground'>Fan Rating</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    
                    {/* Voting Button or Login Prompt */}
                    {isLoggedIn ? (
                        <button
                            onClick={onVoteClick}
                            className='w-full bg-emerald-500/20 text-sm sm:text-base hover:bg-emerald-500/40 text-emerald-500 border border-emerald-500 py-2.5 sm:py-3 rounded-lg transition-colors duration-200 font-medium'
                        >
                            Vote for Player Of The Match
                        </button>
                    ) : (
                        <div className='w-full border border-dashed border-muted-foreground/50 py-3 sm:py-4 rounded-lg bg-muted/20 text-center space-y-1'>
                            <p className='text-sm sm:text-base text-muted-foreground'>Login required to vote</p>
                            <p className='text-xs sm:text-sm text-muted-foreground'>Sign in to participate in POTM voting</p>
                        </div>
                    )}
                </>
            )}
        </div>

        {/* Odds */}
        {
            odds && (
                <div className='bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50 transition-all duration-300 space-y-4'>
                    <div className='flex gap-2 items-center font-bold'>
                        <h2>Live Betting Odds</h2>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4'>
                        <div className='bg-muted rounded-lg text-center py-3 sm:py-4 px-2 min-w-0'>
                            <h3 className='text-xs sm:text-sm font-medium mb-1 truncate px-1' title={`${home} Win`}>
                                { home } Win
                            </h3>
                            <p className='text-base sm:text-lg font-bold text-emerald-500'>{ odds.live.homeWin }</p>
                        </div>
                        <div className='bg-muted rounded-lg text-center py-3 sm:py-4 px-2 min-w-0 md:col-span-1 col-span-2'>
                            <h3 className='text-xs sm:text-sm font-medium mb-1'>Draw</h3>
                            <p className='text-base sm:text-lg font-bold text-emerald-500'>{ odds.live.draw }</p>
                        </div>
                        <div className='bg-muted rounded-lg text-center py-3 sm:py-4 px-2 min-w-0 md:col-span-1 col-span-2'>
                            <h3 className='text-xs sm:text-sm font-medium mb-1 truncate px-1' title={`${away} Win`}>
                                { away } Win
                            </h3>
                            <p className='text-base sm:text-lg font-bold text-emerald-500'>{ odds.live.awayWin }</p>
                        </div>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default Overview