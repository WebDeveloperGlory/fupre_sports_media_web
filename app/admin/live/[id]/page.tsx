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
import { getLiveFixtureDetails, updateLiveFixture } from '@/lib/requests/liveAdminPage/requests';
import { BackButton } from '@/components/ui/back-button';
import useLiveStore from '@/stores/liveStore';
import useTimerStore from '@/stores/timerStore';

const IndividualLivePage = (
    { params }:
    { params: Promise<{ id: string }> }
) => {
    const resolvedParams = use( params );
    const router = useRouter();

    const { jwt } = useAuthStore();
    const { matchEvents, setServerMatchEvents } = useLiveStore();
    const { time, setTime } = useTimerStore();

    const [ loading, setLoading ] = useState<boolean>( true );
    const [ statValues, setStatValues ] = useState<LiveStatState>( liveFixtureInitialStateData );
    const [ hasPenalties, setHasPenalties ] = useState<boolean>( false );
    const [ activeTab, setActiveTab ] = useState<string>( 'timer' );

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
                setServerMatchEvents( matchEvents );
                setTime( time );
            }
            console.log({ data })
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
            time
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
  return (
    <div>
        {/* Back Button */}
        <div className="fixed top-6 left-4 md:left-8 z-10">
            <BackButton />
        </div>

        {/* Header */}
        <div className='py-10 md:py-0 pb-2 flex items-center justify-center text-primary flex-col'>
            {/* Buttons */}
            <div className='flex gap-2 items-center'>
                {/* Update Backend Button */}
                <button
                    onClick={ handleStatUpload }
                    className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded mb-4'
                >
                    Upload Data
                </button>

                {/* Share Button */}
                <ShareButton statValues={ statValues } />
            </div>

            {/* Time Display */}
            <Time />

            <p>{ statValues.competition?.name || 'Friendly' }</p>

            <div className='flex items-center justify-center gap-6'>
                <div className='text-right'>
                    <h2 className='text-lg'>{ statValues.homeTeam.name || 'Unknown Team' }</h2>
                    <div className='flex gap-2 justify-end items-center w-full text-right'>
                        { statValues.competition?.type === 'knockout' && hasPenalties && statValues.homePenalty !== null && (
                            <p className="text-xl">({ statValues.homePenalty })</p>
                        )}
                        <h2 className='text-2xl text-orange-500 font-bold'>{ statValues.homeScore }</h2>
                    </div>
                </div>
                <h2 className='text-lg md:text-xl'>vs</h2>
                <div className='text-left'>
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
            { activeTab === 'lineups' && <LineUps /> }
        </div>
    </div>
  )
}

export default IndividualLivePage