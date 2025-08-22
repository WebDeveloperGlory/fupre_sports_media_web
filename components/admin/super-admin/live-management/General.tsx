import { endLiveFixture, generalUpdates } from '@/lib/requests/v2/admin/super-admin/live-management/requests'
import { LivFixGeneralUpdates } from '@/utils/V2Utils/formData'
import { Cog, Plus, Save, Signal } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const General = (
    { liveId, referee, attendance, kickoff, weather }:
    {
        liveId: string,
        referee: string, 
        attendance: number, 
        kickoff: Date,
        weather: { condition: string, temperature: number, humidity: number } 
    }
) => {
    const [generalData, setGeneralData] = useState<LivFixGeneralUpdates>({
        weather: {
            condition: weather.condition,
            temperature: weather.temperature,
            humidity: weather.humidity
        },
        attendance: attendance ? attendance : 0,
        referee: referee ? referee : '',
        kickoff: kickoff ? kickoff : '',
    });
    const [streamData, setStreamData] = useState({
        platform: '',
        url: '',
        requiresSubscription: false,
        isOfficial: false
    })

    const handleInfoUpdate = async () => {
        const response = await generalUpdates( liveId, generalData );
        if(response?.code === '00') {
            toast.success(response.message);
        } else {
            toast.error(response?.message || 'An Error Occurred');
        }
    }
    const handleStreamLinkUpdate = async () => {
        const response = await generalUpdates( liveId, { stream: streamData } );
        if(response?.code === '00') {
            toast.success(response.message);
        } else {
            toast.error(response?.message || 'An Error Occurred');
        }
    }
    const handleEndFixture = async () => {
        const canEndFixture = window.confirm('Are You Sure You Want To End Fixture?(Confirm Player Ratings and POTM if applicable)');

        if(canEndFixture) {
            const response = await endLiveFixture( liveId );
            if(response?.code === '00') {
                toast.success(response.message);
            } else {
                toast.error(response?.message || 'An Error Occurred');
            }
        } else {
            toast.error('Action Cancelled');
        }
    }
  return (
    <>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* General Details */}
            <div className='px-4 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
                {/* Title */}
                <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
                    <Cog className='w-5 h-5' />
                    Match Details
                </h2>

                {/* Form body */}
                <div className='space-y-4 mt-4'>
                    {/* Referee */}
                    <div>
                        <label className="block font-semibold mb-1.5">Referee</label>
                        <input
                            type='text'
                            placeholder='Referee Name'
                            value={ generalData.referee }
                            onChange={
                                ( e ) => setGeneralData({
                                    ...generalData,
                                    referee: e.target.value
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>

                    {/* Attendance */}
                    <div>
                        <label className="block font-semibold mb-1.5">Attendance</label>
                        <input
                            type='number'
                            placeholder='Attendance Number'
                            min={0}
                            value={ generalData.attendance }
                            onChange={
                                ( e ) => setGeneralData({
                                    ...generalData,
                                    attendance: Number(e.target.value)
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>

                    {/* Others */}
                    <div className='grid grid-cols-2 gap-4'>
                        {/* Kickoff */}
                        <div>
                            <label className="block font-semibold mb-1.5">Kickoff</label>
                            <input
                                type='datetime-local'
                                placeholder='Kickoff Name'
                                min={0}
                                value={ generalData.kickoff?.toLocaleString() }
                                onChange={
                                    ( e ) => setGeneralData({
                                        ...generalData,
                                        kickoff: e.target.value
                                    })
                                }
                                className='w-full p-2 border rounded bg-input'
                            />
                        </div>
                        {/* Weather Condition */}
                        <div>
                            <label className="block font-semibold mb-1.5">Weather Condition</label>
                            <input
                                type='text'
                                placeholder='Referee Name'
                                value={ generalData.weather!.condition }
                                onChange={
                                    ( e ) => setGeneralData({
                                        ...generalData,
                                        weather: {
                                            ...weather,
                                            condition: e.target.value
                                        }
                                    })
                                }
                                className='w-full p-2 border rounded bg-input'
                            />
                        </div>
                    </div>
                    
                    {/* Others */}
                    <div className='grid grid-cols-2 gap-4'>
                        {/* Humidity */}
                        <div>
                            <label className="block font-semibold mb-1.5">Humidity</label>
                            <input
                                type='number'
                                placeholder='Referee Name'
                                value={ generalData.weather!.humidity }
                                onChange={
                                    ( e ) => setGeneralData({
                                        ...generalData,
                                        weather: {
                                            ...weather,
                                            humidity: Number(e.target.value)
                                        }
                                    })
                                }
                                className='w-full p-2 border rounded bg-input'
                            />
                        </div>
                        {/* Weather Temperature */}
                        <div>
                            <label className="block font-semibold mb-1.5">Temperature(celsius)</label>
                            <input
                                type='number'
                                placeholder='Referee Name'
                                value={ generalData.weather!.temperature }
                                onChange={
                                    ( e ) => setGeneralData({
                                        ...generalData,
                                        weather: {
                                            ...weather,
                                            temperature: Number(e.target.value)
                                        }
                                    })
                                }
                                className='w-full p-2 border rounded bg-input'
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleInfoUpdate}
                        className='py-2 rounded-lg flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-500/50 text-white w-full'
                    >
                        <Save className='w-5 h-5' />
                        Update General Info
                    </button>
                </div>
            </div>

            {/* Stream */}
            <div className='px-4 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
                {/* Title */}
                <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
                    <Signal className='w-5 h-5' />
                    Stream Links
                </h2>

                {/* Form body */}
                <div className='space-y-4 mt-4'>
                    {/* Platform */}
                    <div>
                        <label className="block font-semibold mb-1.5">Platform</label>
                        <input
                            type='text'
                            placeholder='e.g, YouTube, Facebook'
                            value={ streamData.platform }
                            onChange={
                                ( e ) => setStreamData({
                                    ...streamData,
                                    platform: e.target.value
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>

                    {/* Url */}
                    <div>
                        <label className="block font-semibold mb-1.5">Url</label>
                        <input
                            type='text'
                            placeholder='https://...'
                            value={ streamData.url }
                            onChange={
                                ( e ) => setStreamData({
                                    ...streamData,
                                    url: e.target.value
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>

                    {/* Official Stream Selector */}
                    <div
                        onClick={
                            () => setStreamData({ 
                                ...streamData,
                                isOfficial: !streamData.isOfficial 
                            }) 
                        }
                        className='flex gap-2 items-center cursor-pointer w-fit'
                    >
                        <div
                            className={`
                                w-4 h-4 rounded-sm ${
                                    streamData.isOfficial
                                    ? 'bg-emerald-500'
                                    : 'bg-white'
                                }
                            `}
                        ></div>
                        <p className={`${ streamData.isOfficial ? 'text-green-500' : '' }`}>Official Stream</p>
                    </div>
                    
                    {/* Subscription Requirements Selector */}
                    <div
                        onClick={
                            () => setStreamData({ 
                                ...streamData,
                                requiresSubscription: !streamData.requiresSubscription 
                            }) 
                        }
                        className='flex gap-2 items-center cursor-pointer w-fit'
                    >
                        <div
                            className={`
                                w-4 h-4 rounded-sm ${
                                    streamData.requiresSubscription
                                    ? 'bg-emerald-500'
                                    : 'bg-white'
                                }
                            `}
                        ></div>
                        <p className={`${ streamData.requiresSubscription ? 'text-green-500' : '' }`}>Requires Subscription</p>
                    </div>

                    <button 
                        onClick={handleStreamLinkUpdate}
                        className='py-2 rounded-lg flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-500/50 text-white w-full'
                    >
                        <Plus className='w-5 h-5' />
                        Add Stream Link
                    </button>
                </div>
            </div>

            {/* End Fixture */}
            <div className='px-4 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
                {/* Title */}
                <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
                    <Save className='w-5 h-5' />
                    End Fixture
                </h2>

                <div className='space-y-4 mt-4'>
                    <button
                        onClick={handleEndFixture}
                        className='flex gap-2 items-center py-2 justify-center w-full bg-red-600 hover:bg-red-500 transition rounded-lg'
                    >
                        Calculate Results
                    </button>
                </div>
            </div>
        </div>
    </>
  )
}

export default General