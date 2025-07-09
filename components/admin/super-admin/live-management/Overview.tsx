import { LiveFixScore } from '@/utils/V2Utils/formData';
import { LiveStatus } from '@/utils/V2Utils/v2requestData.enums';
import { BarChart, Clock, RefreshCcw, Save } from 'lucide-react';
import React, { useState } from 'react'

type SaveScoreLine = { homeScore: number, awayScore: number, homePenalty?: number, awayPenalty?: number };
type StatusAndTime = {
  status: LiveStatus;
  regularTime: number;
  injuryTime?: number | null;
}

const Overview = (
  { status, currentMin, injuryTime, homeName, homeScore, awayName, awayScore, homePenalty, awayPenalty, saveScore }:
  { 
    status: LiveStatus, 
    currentMin: number, injuryTime: number | null, 
    homeName: string, awayName: string,
    homeScore: number, awayScore: number, 
    homePenalty: number | null, awayPenalty: number | null,
    saveScore: ( payload: SaveScoreLine ) => void,
    saveData: ( status: LiveStatus, currentMinute: number, injuryTime: number ) => void,
  }
) => {
  const [statusAndTimeData, setStatusAndTimeData] = useState<StatusAndTime>({
    status: status,
    regularTime: currentMin,
    injuryTime: injuryTime
  });
  const [scoreData, setScoreData] = useState<LiveFixScore>({
    homeScore,
    awayScore,
    homePenalty,
    awayPenalty
  });
  const [isPenaltyShootout, setIsPenaltyShootout] = useState<boolean>( false );
  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Status 'n' Time */}
        <div className='px-6 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
          {/* Title */}
          <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
            <Clock className='w-5 h-5' />
            Match Status and Time
          </h2>

          {/* Form body */}
          <div className='space-y-4 mt-4'>
            <div className='grid grid-cols-2 gap-4'>
              {/* Status */}
              <div>
                <label className="block font-semibold mb-1.5">Status</label>
                <select 
                  className="w-full p-2 border rounded cursor-pointer bg-input"
                  value={ statusAndTimeData.status }
                  onChange={ (e) => setStatusAndTimeData({ 
                      ...statusAndTimeData, 
                      status: e.target.value as LiveStatus
                  }) }
                >
                  {
                    Object.values( LiveStatus ).map( status => (
                      <option key={ status } value={ status } className='flex flex-col'>
                        { status }
                      </option>
                    ))
                  }
                </select>
              </div>
              {/* Regular Time */}
              <div>
                <label className="block font-semibold mb-1.5">Current Minute</label>
                <input
                    type='number'
                    placeholder='0'
                    value={ statusAndTimeData.regularTime }
                    onChange={
                      ( e ) => setStatusAndTimeData({
                        ...statusAndTimeData,
                        regularTime: Number(e.target.value)
                    })
                  }
                  className='w-full p-2 border rounded bg-input'
                />
              </div>
            </div>
            {/* Injury Time */}
            <div>
              <label className="block font-semibold mb-1.5">Injury Time( minutes )</label>
              <input
                  type='number'
                  placeholder='0'
                  value={ statusAndTimeData.injuryTime ? statusAndTimeData.injuryTime : 0 }
                  onChange={
                    ( e ) => setStatusAndTimeData({
                      ...statusAndTimeData,
                      injuryTime: Number(e.target.value)
                  })
                }
                className='w-full p-2 border rounded bg-input'
              />
            </div>
            {/* Buttons */}
            <div className='grid grid-cols-2 gap-4'>
              <button 
                onClick={() => {}}
                className='py-2 rounded-lg flex justify-center items-center gap-2 bg-card hover:border-emerald-500 border border-muted-foreground'
              >
                <RefreshCcw className='w-5 h-5' />
                Refresh Time
              </button>
              <button 
                onClick={() => {}}
                className='py-2 rounded-lg flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-500/50 text-white'
              >
                <Save className='w-5 h-5' />
                Update Status 'n' Time
              </button>
            </div>
          </div>
        </div>

        {/* Score */}
        <div className='px-6 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
          {/* Title */}
          <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
            <BarChart className='w-5 h-5' />
            Score Control
          </h2>

          {/* Form body */}
          <div className='space-y-4 mt-4'>
            <div className='grid grid-cols-2 gap-4'>
              {/* Regular Time */}
              <div>
                <label className="block font-semibold mb-1.5">{ homeName } score</label>
                <input
                  type='number'
                  placeholder='0'
                  min={0}
                  value={ scoreData.homeScore }
                  onChange={
                    ( e ) => setScoreData({
                      ...scoreData,
                      homeScore: Number(e.target.value)
                    })
                  }
                  className='w-full p-2 border rounded bg-input'
                />
              </div>
              {/* Regular Time */}
              <div>
                <label className="block font-semibold mb-1.5">{ awayName } score</label>
                <input
                  type='number'
                  placeholder='0'
                  min={0}
                  value={ scoreData.awayScore }
                  onChange={
                    ( e ) => setScoreData({
                      ...scoreData,
                      awayScore: Number(e.target.value)
                    })
                  }
                  className='w-full p-2 border rounded bg-input'
                />
              </div>
            </div>
            {/* Penalty Shootout Selector */}
            <div
              onClick={() => setIsPenaltyShootout( !isPenaltyShootout ) }
              className='flex gap-2 items-center cursor-pointer w-fit'>
              <div
                className={`
                  w-4 h-4 rounded-sm ${
                    isPenaltyShootout
                      ? 'bg-emerald-500'
                      : 'bg-white'
                  }
                `}
              ></div>
              <p className={`${ isPenaltyShootout ? 'text-green-500' : '' }`}>Is Penalty Shootout?</p>
            </div>
            {/* Penalty Shhotout Form */}
            {
              isPenaltyShootout && (
                <div className='grid grid-cols-2 gap-4'>
                  {/* Penalties */}
                  <div>
                    <label className="block font-semibold mb-1.5">{ homeName } penalties</label>
                    <input
                      type='number'
                      placeholder='0'
                      min={0}
                      value={ scoreData.homePenalty ? scoreData.homePenalty : 0 }
                      onChange={
                        ( e ) => setScoreData({
                          ...scoreData,
                          homePenalty: Number(e.target.value)
                        })
                      }
                      className='w-full p-2 border rounded bg-input'
                    />
                  </div>
                  {/* Regular Time */}
                  <div>
                    <label className="block font-semibold mb-1.5">{ awayName } penalties</label>
                    <input
                      type='number'
                      placeholder='0'
                      min={0}
                      value={ scoreData.awayPenalty ? scoreData.awayPenalty : 0 }
                      onChange={
                        ( e ) => setScoreData({
                          ...scoreData,
                          awayPenalty: Number(e.target.value)
                        })
                      }
                      className='w-full p-2 border rounded bg-input'
                    />
                  </div>
                </div>
              )
            }
            {/* Button */}
            <div className='w-full' >
              <button 
                onClick={() => {}}
                className='py-2 rounded-lg flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-500/50 text-white w-full'
              >
                <Save className='w-5 h-5' />
                Update Score
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Overview