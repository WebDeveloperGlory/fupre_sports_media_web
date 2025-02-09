'use client'

import React, { useState } from 'react'
import { liveFixtureInitialStateData } from '@/constants'
import { LiveStatState } from '@/utils/stateTypes';
import Timer from '@/components/liveAdmin/Timer';

const IndividualLivePage = () => {
    const [ statValues, setStatValues ] = useState<LiveStatState>( liveFixtureInitialStateData );
    const [ activeTab, setActiveTab ] = useState<string>( 'timer' );

  return (
    <div>
        {/* Header */}
        <div className='py-6 pb-2 px-4 flex items-center justify-center text-primary flex-col'>
            <p>{ statValues.competition?.name || 'Friendly' }</p>

            <div className='flex items-center justify-center gap-6'>
                <div className='text-right'>
                    <h2 className='text-lg'>{ statValues.homeTeam.name || 'Unknown Team' }</h2>
                    <h2 className='text-2xl text-orange-500 font-bold'>{ statValues.homeScore }</h2>
                </div>
                <h2 className='text-lg md:text-xl'>vs</h2>
                <div className='text-left'>
                    <h2 className='text-lg'>{ statValues.awayTeam.name || 'Unknown Team' }</h2>
                    <h2 className='text-2xl text-orange-500 font-bold'>{ statValues.awayScore }</h2>
                </div>
            </div>
        </div>

        {/* Tabs Navigation */}
        <div className='sticky top-0 border-b z-10'>
            <div className='flex overflow-x-scroll scrollbar-hide'>
                {
                    [ 'timer', 'events', 'stats', 'log' ].map( tab => (
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
        </div>
    </div>
  )
}

export default IndividualLivePage