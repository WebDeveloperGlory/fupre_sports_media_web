import { Home, Plane, Save } from 'lucide-react'
import React, { useState } from 'react'
import PossessionTracker from '../../PossessionTracker'
import { FixtureStat } from '@/utils/V2Utils/v2requestSubData.types'
import { updateLiveFixtureStatistics } from '@/lib/requests/v2/admin/super-admin/live-management/requests'
import { toast } from 'react-toastify'

const Statistics = (
  { liveId, homeName, awayName, homeStats, awayStats, saveStats }:
  {
    liveId: string,
    homeName: string, awayName: string, 
    homeStats: FixtureStat, awayStats: FixtureStat, 
    saveStats: ( homeStats: FixtureStat, awayStats: FixtureStat ) => void 
  }
) => {
  const [stats, setStats] = useState({
    home: homeStats,
    away: awayStats
  })

  const updateStats = async () => {
    const response = await updateLiveFixtureStatistics( liveId, { stats } );
    if(response?.code === '00') {
        toast.success(response.message);
        saveStats( stats.home, stats.away );
    } else {
        toast.error(response?.message || 'An Error Occurred');
    }
  }
  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Possesion Buttons */}
        <div className='col-span-1 md:col-span-2'>
            <PossessionTracker
                homeTeamTime={ stats.home.possessionTime || 0 }
                awayTeamTime={ stats.away.possessionTime || 0 }
                setHomeTeamTime={
                ( timeDiff: number ) => setStats( 
                    ( prev ) => ({
                    ...prev,
                    home: {
                        ...prev.home,
                        possessionTime: prev.home.possessionTime + timeDiff
                    }
                    })
                )
                }
                setAwayTeamTime={
                ( timeDiff: number ) => setStats( 
                    ( prev ) => ({
                    ...prev,
                    away: {
                        ...prev.away,
                        possessionTime: prev.away.possessionTime + timeDiff
                    }
                    })
                )
                }
            />
        </div>

        {/* Home Stats */}
        <div className='px-6 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
            {/* Title */}
            <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
                <Home className='w-5 h-5' />
                { homeName } Statistics
            </h2>

            {/* Form body */}
            <div className='space-y-4 mt-4'>
                {/* Shots */}
                <div className='grid grid-cols-2 gap-4'>
                    {/* On Target */}
                    <div>
                        <label className="block font-semibold mb-1.5">Shots On Target</label>
                        <input
                            type='number'
                            placeholder='0'
                            min={0}
                            value={ stats.home.shotsOnTarget }
                            onChange={
                                ( e ) => setStats({
                                    ...stats,
                                    home: {
                                    ...stats.home,
                                    shotsOnTarget: Number(e.target.value)
                                    }
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                    {/* Off Target */}
                    <div>
                        <label className="block font-semibold mb-1.5">Shots Off Target</label>
                        <input
                            type='number'
                            placeholder='0'
                            min={0}
                            value={ stats.home.shotsOffTarget }
                            onChange={
                                ( e ) => setStats({
                                    ...stats,
                                    home: {
                                    ...stats.home,
                                    shotsOffTarget: Number(e.target.value)
                                    }
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                </div>
                {/* Fouls And Corners */}
                <div className='grid grid-cols-2 gap-4'>
                    {/* Fouls */}
                    <div>
                        <label className="block font-semibold mb-1.5">Fouls</label>
                        <input
                            type='number'
                            placeholder='0'
                            min={0}
                            value={ stats.home.fouls }
                            onChange={
                                ( e ) => setStats({
                                    ...stats,
                                    home: {
                                    ...stats.home,
                                    fouls: Number(e.target.value)
                                    }
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                    {/* Corners */}
                    <div>
                        <label className="block font-semibold mb-1.5">Corners</label>
                        <input
                            type='number'
                            placeholder='0'
                            min={0}
                            value={ stats.home.corners }
                            onChange={
                                ( e ) => setStats({
                                    ...stats,
                                    home: {
                                    ...stats.home,
                                    corners: Number(e.target.value)
                                    }
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                </div>
                {/* Cards */}
                <div className='grid grid-cols-2 gap-4'>
                    {/* Yellow */}
                    <div>
                        <label className="block font-semibold mb-1.5">Yellow Cards</label>
                        <input
                            type='number'
                            placeholder='0'
                            min={0}
                            value={ stats.home.yellowCards }
                            onChange={
                                ( e ) => setStats({
                                    ...stats,
                                    home: {
                                    ...stats.home,
                                    yellowCards: Number(e.target.value)
                                    }
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                    {/* Red */}
                    <div>
                        <label className="block font-semibold mb-1.5">Red</label>
                        <input
                            type='number'
                            placeholder='0'
                            min={0}
                            value={ stats.home.redCards }
                            onChange={
                                ( e ) => setStats({
                                    ...stats,
                                    home: {
                                        ...stats.home,
                                        redCards: Number(e.target.value)
                                    }
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                </div>
                {/* Button */}
                <button
                    onClick={ updateStats }
                    className='w-full text-center py-2 bg-emerald-500 hover:bg-emerald-500/50 rounded-lg flex items-center gap-2 justify-center'
                >
                    <Save className='w-5 h-5' />
                    Update Home Stats
                </button>
            </div>
        </div>
        
        {/* Away Stats */}
        <div className='px-6 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
            {/* Title */}
            <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
                <Plane className='w-5 h-5' />
                { awayName } Statistics
            </h2>

            {/* Form body */}
            <div className='space-y-4 mt-4'>
                {/* Shots */}
                <div className='grid grid-cols-2 gap-4'>
                    {/* On Target */}
                    <div>
                        <label className="block font-semibold mb-1.5">Shots On Target</label>
                        <input
                            type='number'
                            placeholder='0'
                            min={0}
                            value={ stats.away.shotsOnTarget }
                            onChange={
                                ( e ) => setStats({
                                    ...stats,
                                    away: {
                                    ...stats.away,
                                    shotsOnTarget: Number(e.target.value)
                                    }
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                    {/* Off Target */}
                    <div>
                        <label className="block font-semibold mb-1.5">Shots Off Target</label>
                        <input
                            type='number'
                            placeholder='0'
                            min={0}
                            value={ stats.away.shotsOffTarget }
                            onChange={
                                ( e ) => setStats({
                                    ...stats,
                                    away: {
                                    ...stats.away,
                                    shotsOffTarget: Number(e.target.value)
                                    }
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                </div>
                {/* Fouls And Corners */}
                <div className='grid grid-cols-2 gap-4'>
                    {/* Fouls */}
                    <div>
                        <label className="block font-semibold mb-1.5">Fouls</label>
                        <input
                            type='number'
                            placeholder='0'
                            min={0}
                            value={ stats.away.fouls }
                            onChange={
                                ( e ) => setStats({
                                    ...stats,
                                    away: {
                                    ...stats.away,
                                    fouls: Number(e.target.value)
                                    }
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                    {/* Corners */}
                    <div>
                        <label className="block font-semibold mb-1.5">Corners</label>
                        <input
                            type='number'
                            placeholder='0'
                            min={0}
                            value={ stats.away.corners }
                            onChange={
                                ( e ) => setStats({
                                    ...stats,
                                    away: {
                                    ...stats.away,
                                    corners: Number(e.target.value)
                                    }
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                </div>
                {/* Cards */}
                <div className='grid grid-cols-2 gap-4'>
                    {/* Yellow */}
                    <div>
                        <label className="block font-semibold mb-1.5">Yellow Cards</label>
                        <input
                            type='number'
                            placeholder='0'
                            min={0}
                            value={ stats.away.yellowCards }
                            onChange={
                                ( e ) => setStats({
                                    ...stats,
                                    away: {
                                    ...stats.away,
                                    yellowCards: Number(e.target.value)
                                    }
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                    {/* Red */}
                    <div>
                        <label className="block font-semibold mb-1.5">Red</label>
                        <input
                            type='number'
                            placeholder='0'
                            min={0}
                            value={ stats.away.redCards }
                            onChange={
                                ( e ) => setStats({
                                    ...stats,
                                    away: {
                                        ...stats.away,
                                        redCards: Number(e.target.value)
                                    }
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                </div>
                {/* Button */}
                <button
                    onClick={ updateStats }
                    className='w-full text-center py-2 bg-emerald-500 hover:bg-emerald-500/50 rounded-lg flex items-center gap-2 justify-center'
                >
                    <Save className='w-5 h-5' />
                    Update Away Stats
                </button>
            </div>
        </div>
      </div>
    </>
  )
}

export default Statistics