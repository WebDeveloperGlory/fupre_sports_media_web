'use client'

import { FixtureStreamLinks, FixturePlayerRatings, FixtureLineup, FixtureOdds, FixturePlayerOfTheMatch } from '@/utils/V2Utils/v2requestSubData.types'
import { Star, Trophy, Video } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import PopUpModal from '../modal/PopUpModal'

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
}

const Overview = ({ stream, playerRatings, playerOfTheMatch, homeLineup, awayLineup, home, away, odds, setOpen, setModalType }: IOverview) => {
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

  return (
    <div className='space-y-4'>
        {/* LiveStream */}
        <div className='bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50  transition-all duration-300'>
            <div className='flex gap-2 items-center font-bold'>
                <Video className='text-emerald-500 w-6 h-6' />
                <h2>Live Stream</h2>
            </div>
            <div className='flex justify-center items-center bg-black/80 w-full h-[200px] md:h-[400px] my-4 rounded-xl'>
                <Link 
                    href={ choosenStream ? choosenStream.url : '' } 
                    className='px-4 py-2 bg-emerald-500/20 text-emerald-500 border-emerald-500 border'
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
                <h2>Player Ratings</h2>
            </div>
            <div className='space-y-2'>
                {
                    sortedRatings.slice(0,5).map( ( player, i ) => (
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
                                    { player.fanRatings.average }
                                </div>
                                <p className='text-sm text-muted-foreground text-center mt-0.5'>{ player.fanRatings.count } votes</p>
                            </div>                            
                        </div>
                    ))
                }
            </div>
            <button
                onClick={ onRateClick }
                className='w-full text-emerald-500 hover:border hover:border-emerald-500 py-2 rounded-lg'
            >
                Rate a player
            </button>
        </div>

        {/* POTM Voting */}
        <div className='bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50  transition-all duration-300 space-y-4'>
            <div className='flex gap-2 items-center font-bold'>
                <Trophy className='text-emerald-500 w-6 h-6' />
                <h2>Player Of The Match</h2>
            </div>

            {/* Voting List */}
            <div className='space-y-2'>
                <p>Total Fan Votes: {playerOfTheMatch.fanVotes.length || 0}</p>
                {
                    playerOfTheMatch.fanVotes.map((player, i) => (
                        <div 
                            key={ player.player._id }
                            className='border border-muted-foreground bg-card p-4 rounded-lg space-y-4'
                        >
                            <div className='flex justify-between items-center'>
                                {/* Player Details */}
                                <div className='flex items-center gap-3'>
                                    <div className='flex items-center justify-center w-8 h-8 rounded-full border border-muted-foreground bg-card'>{ i+1 }</div>
                                    <div>
                                        <p>{ player.player.name }</p>
                                        <span className='text-muted-foreground text-sm'>Unknown</span>
                                    </div>
                                </div>
                                {/* Fan Votes */}
                                <div>
                                    <p>{ player.votes } votes</p>
                                    <span className='text-sm text-muted-foreground'>{(player.votes / playerOfTheMatch.fanVotes.length * 100 ).toFixed(2)}%</span>
                                </div>
                            </div>
                            <div className='text-sm'>
                                <p>Fan Rating</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='space-y-2'>
                {
                    sortedPOTMVotes.slice(0,5).map( ( player, i ) => (
                        <div key={ i } className='gap-2 items-center flex justify-between'>
                            <div className='basis-11/12 flex gap-4 items-center'>
                                <div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center'>{ i + 1 }</div>
                                <div className=''>
                                    <h3 className=''>{ player.player.name }</h3>
                                    <span className='text-sm text-muted-foreground'>{ player.votes } votes</span>
                                </div>
                            </div>
                        </div>
                    ) )
                }
            </div>
            <button
                onClick={ onVoteClick }
                className='w-full bg-emerald-500/20 text-sm hover:bg-emerald-500/40 text-emerald-500 border border-emerald-500 py-2 rounded-lg'
            >
                Vote for Player Of The Match
            </button>
        </div>

        {/* Odds */}
        {
            odds && (
                <div className='bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50  transition-all duration-300 space-y-4'>
                    <div className='flex gap-2 items-center font-bold'>
                        <h2>Live Betting Odds</h2>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4 justify-center'>
                        <div className='bg-muted rounded-lg text-center py-4'>
                            <h3>{ home } Win</h3>
                            <p className='text-lg font-bold text-emerald-500'>{ odds.live.homeWin }</p>
                        </div>
                        <div className='bg-muted rounded-lg text-center py-4'>
                            <h3>Draw</h3>
                            <p className='text-lg font-bold text-emerald-500'>{ odds.live.draw }</p>
                        </div>
                        <div className='bg-muted rounded-lg text-center py-4'>
                            <h3>{ away } Win</h3>
                            <p className='text-lg font-bold text-emerald-500'>{ odds.live.awayWin }</p>
                        </div>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default Overview