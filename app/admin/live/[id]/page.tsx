'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation';
import { liveFixtureInitialStateData } from '@/constants'
import { LiveStatState, Players } from '@/utils/stateTypes';
import Timer from '@/components/liveAdmin/Timer';
import Events from '@/components/liveAdmin/Events';
import Stats from '@/components/liveAdmin/Stats';
import Log from '@/components/liveAdmin/Log';
import LineUps from '@/components/liveAdmin/LineUps';
import Time from '@/components/liveAdmin/Time';
import ShareButton from '@/components/share/ShareButton';

const homeLineup: Players[] | [] = [
    { name: 'John Bull', position: 'LB', _id: '123456' },
    { name: 'John Doe', position: 'CB', _id: '123457' },
    { name: 'John Wick', position: 'CB', _id: '123458' },
];
const awayLineup: Players[] | [] = [

];

const IndividualLivePage = () => {
    const params = useParams();

    const [ statValues, setStatValues ] = useState<LiveStatState>( liveFixtureInitialStateData );
    const [ hasPenalties, setHasPenalties ] = useState<boolean>( false );
    const [ activeTab, setActiveTab ] = useState<string>( 'timer' );

  return (
    <div>
        {/* Header */}
        <div className='py-6 pb-2 px-4 flex items-center justify-center text-primary flex-col'>
            <ShareButton />

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
                homeLineup={ homeLineup }
                awayLineup={ awayLineup }
            /> }
            { activeTab === 'lineups' && <LineUps /> }
        </div>
    </div>
  )
}

export default IndividualLivePage