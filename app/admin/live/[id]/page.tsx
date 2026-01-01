'use client'

import React, { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { liveFixtureInitialStateData } from '@/constants'
import { LiveStatState, Players } from '@/utils/stateTypes';
import Timer from '@/components/liveAdmin/Timer';
import Events from '@/components/liveAdmin/Events';
import Stats from '@/components/liveAdmin/Stats';
import Log from '@/components/liveAdmin/Log';
import LineUps from '@/components/liveAdmin/LineUps';
import Time from '@/components/liveAdmin/Time';
import ShareButton from '@/components/share/ShareButton';
import useAuthStore from '@/stores/authStore';
import { toast } from 'react-toastify';
import { Loader } from '@/components/ui/loader';
import { endLiveFixture, getLiveFixtureDetails, getLiveFixtureTeamPlayerList, updateLiveFixture } from '@/lib/requests/v1/liveAdminPage/requests';
import { BackButton } from '@/components/ui/back-button';
import useLiveStore from '@/stores/liveStore';
import useTimerStore from '@/stores/timerStore';
import { LiveFixtureTeamPlayerLists } from '@/utils/requestDataTypes';

type CurrentLineups = {
    home: Players[],
    away: Players[]
}
type Substitutions = {
    home: {
        in: Players,
        out: Players,
        time: number
    }[],
    away: {
        in: Players,
        out: Players,
        time: number    
    }[]
}

const IndividualLivePage = (
    { params }:
    { params: Promise<{ id: string }> }
) => {
    const resolvedParams = use( params );
    const router = useRouter();

    const { jwt } = useAuthStore();
    const { matchEvents, setServerMatchEvents } = useLiveStore();
    const { time, isGameOver, setTime } = useTimerStore();

    const [ loading, setLoading ] = useState<boolean>( true );
    const [ statValues, setStatValues ] = useState<LiveStatState>( liveFixtureInitialStateData );
    const [ players, setPlayers ] = useState<LiveFixtureTeamPlayerLists | null>( null );
    const [ hasPenalties, setHasPenalties ] = useState<boolean>( true );
    const [ activeTab, setActiveTab ] = useState<string>( 'timer' );
    const [ currentLineups, setCurrentLineups ] = useState<CurrentLineups>({
        home: [],
        away: [],
    });
    const [ substitutions, setSubstitutions ] = useState<Substitutions>({
        home: [],
        away: []
    });

    useEffect( () => {
        const fetchData = async () => {
            const data = await getLiveFixtureDetails( resolvedParams.id );
            if( data && data.data ) {
                const { homeTeam, awayTeam, homeLineup, awayLineup, competition, statistics, result, matchEvents, time } = data.data;

                setStatValues({
                    homeLineup, awayLineup,
                    homeTeam, awayTeam,
                    competition,
                    home: statistics.home,
                    away: statistics.away,
                    homeScore: result.homeScore,
                    awayScore: result.awayScore,
                    homePenalty: result.homePenalty,
                    awayPenalty: result.awayPenalty
                });
                setCurrentLineups({
                    home: homeLineup.startingXI,
                    away: awayLineup.startingXI
                })
                setServerMatchEvents( matchEvents );
                setTime( time );
            }

            const playerData = await getLiveFixtureTeamPlayerList( resolvedParams.id );
            if( playerData && playerData.code === '00' ) {
                setPlayers( playerData.data );
            }
            console.log({ data, playerData })
            setLoading( false );
        }

        if( !jwt ) {
            toast.error('Please Login First');
            setTimeout(() => router.push( '/admin' ), 1000);
        } else {
            if( loading ) fetchData();
        }
    }, [ loading, resolvedParams.id ]);

    if( loading ) {
        return <Loader />
    };

    const handleStatUpload = async () => {
        const homeSubs = matchEvents
            .filter( event => event.eventType === 'substitution' )
            .map( event => event.team?._id === statValues.homeTeam._id ? event.player : null )
            .filter( player => player !== null );
        const awaySubs = matchEvents
            .filter( event => event.eventType === 'substitution' )
            .map( event => event.team?._id === statValues.awayTeam._id ? event.player : null )
            .filter( player => player !== null );

        const currentHomeSubs = statValues.homeLineup ? statValues.homeLineup.subs : [];
        const currentAwaySubs = statValues.awayLineup ? statValues.awayLineup.subs : [];

        const requestBodyData = {
            result: {
                homeScore: statValues.homeScore,
                awayScore: statValues.awayScore,
                homePenalty: statValues.homePenalty,
                awayPenalty: statValues.awayPenalty,
            },
            statistics: {
                home: statValues.home,
                away: statValues.away
            },
            matchEvents,
            time,
            homeLineup: {
                formation: statValues.homeLineup ? statValues.homeLineup.formation : null,
                startingXI: statValues.homeLineup ? statValues.homeLineup.startingXI : [],
                subs: [ ...currentHomeSubs, ...homeSubs ]
            },
            awayLineup: {
                formation: statValues.awayLineup ? statValues.awayLineup.formation : null,
                startingXI: statValues.awayLineup ? statValues.awayLineup.startingXI : [],
                subs: [ ...currentAwaySubs, ...awaySubs ]
            },
        }

        if( window.confirm( 'Save To Database?' ) ) {
            const data = await updateLiveFixture( jwt!, resolvedParams.id, requestBodyData );
            if( data && data.code === '00' ) {
                toast.success( data.message )
            } else {
                toast.error( data?.message || 'An Error Occurred' );
            }
        } else {
            toast.error( 'Save Cancelled' );
        }
    }
    const handleLiveEnd = async () => {
        if( window.confirm( 'End Game?' ) ) {
            const data = await endLiveFixture( resolvedParams.id, jwt! );
            if( data && data.code === '00' ) {
                toast.success( data.message );
                router.push('/admin/live');
            } else {
                toast.error( data?.message || 'An Error Occurred' );
            }
        } else {
            toast.error( 'End Cancelled' );
        }
    }
  return (
    <div>
        {/* Back Button */}
        <div className="fixed top-6 left-4 md:left-8 z-10">
            <BackButton />
        </div>

        {/* Header */}
        <div className='py-10 md:py-0 pb-2 flex items-center justify-center text-primary flex-col'>
            {/* Buttons */}
            <div className='flex gap-2 items-center flex-wrap justify-center'>
                {/* Update Backend Button */}
                <button
                    onClick={ handleStatUpload }
                    className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded mb-4'
                >
                    Upload Data
                </button>

                {/* Share Button */}
                <ShareButton statValues={ statValues } />

                {/* End Game Button */}
                <button
                    onClick={ handleLiveEnd }
                    className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded mb-4 disabled:opacity-50'
                    disabled={ !isGameOver }
                >
                    End Live
                </button>
            </div>

            {/* Time Display */}
            <Time />

            <p>{ statValues.competition?.name || 'Friendly' }</p>

            <div className='flex items-center justify-center gap-6 mt-2'>
                <div className='text-right basis-5/12'>
                    <h2 className='text-lg'>{ statValues.homeTeam.name || 'Unknown Team' }</h2>
                    <div className='flex gap-2 justify-end items-center w-full text-right'>
                        { statValues.competition?.type === 'knockout' && hasPenalties && statValues.homePenalty !== null && (
                            <p className="text-xl">({ statValues.homePenalty })</p>
                        )}
                        <h2 className='text-2xl text-orange-500 font-bold'>{ statValues.homeScore }</h2>
                    </div>
                </div>
                <h2 className='text-lg md:text-xl basis-1/12 text-center'>vs</h2>
                <div className='text-left basis-5/12'>
                    <h2 className='text-lg'>{ statValues.awayTeam.name || 'Unknown Team' }</h2>
                    <div className='flex gap-2 justify-start items-center w-full text-left'>
                        <h2 className='text-2xl text-orange-500 font-bold'>{ statValues.awayScore }</h2>
                        { 
                            statValues.competition?.type === 'knockout' && hasPenalties && statValues.awayPenalty !== null && (
                                <p className="text-xl">({ statValues.awayPenalty })</p>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>

        {/* Tabs Navigation */}
        <div className='sticky top-0 border-b z-10 bg-primary-foreground'>
            <div className='flex overflow-x-scroll scrollbar-hide'>
                {
                    [ 'timer', 'events', 'stats', 'log', 'lineups' ].map( tab => (
                        <div
                            key={ tab }
                            onClick={ () => setActiveTab( tab ) }
                            className={` 
                                cursor-pointer px-6 py-2 capitalize text-sm font-medium ${
                                activeTab === tab
                                    ? 'text-orange-600 border-b-2 border-orange-600'
                                    : 'muted'
                                }
                            `}
                        >
                            { tab }
                        </div>
                    ))
                }    
            </div>
        </div>

        {/* Body */}
        <div>
            { activeTab === 'timer' && <Timer /> }
            { activeTab === 'events' && <Events 
                statValues={ statValues } 
                hasPenalties={ hasPenalties }
                setStatValues={ setStatValues } 
                setHasPenalties={ setHasPenalties }    
            /> }
            { activeTab === 'stats' && <Stats 
                homeStats={ statValues.home } 
                awayStats={ statValues.away }
            /> }
            { activeTab === 'log' && <Log 
                statValues={ statValues }
                homeLineup={ statValues.homeLineup ? statValues.homeLineup.startingXI : [] }
                awayLineup={ statValues.awayLineup ? statValues.awayLineup.startingXI : [] }
            /> }
            { activeTab === 'lineups' && <LineUps 
                awayPlayers={ players ? players.awayPlayers : [] }
                homePlayers={ players ? players.homePlayers : [] }
                currentLineups={ currentLineups }
                setCurrentLineups={ setCurrentLineups }
                substitutions={ substitutions }
                setSubstitutions={ setSubstitutions }
                homeTeam={ statValues.homeTeam }
                awayTeam={ statValues.awayTeam }
            /> }
        </div>
    </div>
  )
}

export default IndividualLivePage