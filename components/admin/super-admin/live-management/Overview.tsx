import { addGoalScorer, removeGoalScorer, updateFixtureScore, updateLiveFixtureStatus, updateTime } from '@/lib/requests/v2/admin/super-admin/live-management/requests';
import { LiveFixScore } from '@/utils/V2Utils/formData';
import { LiveStatus, FixtureTimelineGoalType } from '@/utils/V2Utils/v2requestData.enums';
import { IV2FootballLiveFixture } from '@/utils/V2Utils/v2requestData.types';
import { FixtureLineup } from '@/utils/V2Utils/v2requestSubData.types';
import { BarChart, Clock, RefreshCcw, Save } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

type SaveScoreLine = { homeScore: number, awayScore: number, homePenalty?: number, awayPenalty?: number };
type StatusAndTime = {
  status: LiveStatus;
  regularTime: number;
  injuryTime?: number | null;
}
type GoalScorerForm = {
  playerId: string;
  teamId: string;
  time: number;
  goalType: FixtureTimelineGoalType;
}

const Overview = (
  { liveId, status, currentMin, injuryTime, homeName, homeScore, awayName, awayScore, homePenalty, awayPenalty, goalScorers, homeId, awayId, homePlayers, awayPlayers, saveScore, saveData }:
  {
    liveId: string, 
    status: LiveStatus, 
    currentMin: number, injuryTime: number | null, 
    homeName: string, awayName: string,
    homeScore: number, awayScore: number, 
    homePenalty: number | null, awayPenalty: number | null,
    goalScorers: IV2FootballLiveFixture['goalScorers'],
    homeId: string,
    awayId: string,
    homePlayers: FixtureLineup['substitutes']
    awayPlayers: FixtureLineup['substitutes']
    saveScore: ( payload: SaveScoreLine ) => void,
    saveData: ( status: LiveStatus, currentMinute: number ) => void,
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
  const [newGoalScorer, setNewGoalScorer] = useState<GoalScorerForm>({
    playerId: '',
    teamId: '',
    time: 0,
    goalType: FixtureTimelineGoalType.REGULAR
  });

  const handleStatusNTimeUpdate = async () => {
    const statusResponse = await updateLiveFixtureStatus( liveId, statusAndTimeData );
    const timeResponse = await updateTime( 
      liveId, 
      { 
        regularTime: statusAndTimeData.regularTime,
        injuryTime: statusAndTimeData.injuryTime ? statusAndTimeData.injuryTime : undefined
      } 
    );

    if( statusResponse?.code === '00' ) {
      toast.success(statusResponse.message);
      saveData( statusAndTimeData.status, currentMin );
    } else {
      toast.error(statusResponse?.message || 'An Error Occurred');
    }
    if( timeResponse?.code === '00' ) {
      toast.success(timeResponse.message);
      saveData( status, statusAndTimeData.regularTime );
    } else {
      toast.error(timeResponse?.message || 'An Error Occurred');
    }
  }
  const handleScoreUpdate = async () => {
    const response = await updateFixtureScore( liveId, scoreData );
    if(response?.code === '00') {
      toast.success(response.message);
      saveScore(response.data);
    } else {
      toast.error(response?.message || 'An Error Occurred');
    }
  }
  const handleAddGoalScorer = async () => {
    // Validate input
    if (!newGoalScorer.playerId || !newGoalScorer.teamId || newGoalScorer.time <= 0) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await addGoalScorer(liveId, newGoalScorer);

      if (response?.code === '00') {
        toast.success('Goal scorer added successfully');
        // setGoalScorers(response.data.goalScorers);
        setNewGoalScorer({
          playerId: '',
          teamId: '',
          time: 0,
          goalType: FixtureTimelineGoalType.REGULAR
        });
      } else {
        toast.error(response?.message || 'Failed to add goal scorer');
      }
    } catch (error) {
      toast.error('An error occurred while adding goal scorer');
      console.error(error);
    }
  };

  const handleRemoveGoalScorer = async (id: string) => {
    try {
      const response = await removeGoalScorer(liveId, {goalScorerId: id});

      if (response?.code === '00') {
        toast.success('Goal scorer removed successfully');
        // setGoalScorers(response.data);
      } else {
        toast.error(response?.message || 'Failed to remove goal scorer');
      }
    } catch (error) {
      toast.error('An error occurred while removing goal scorer');
      console.error(error);
    }
  };
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
                onClick={handleStatusNTimeUpdate}
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
                onClick={handleScoreUpdate}
                className='py-2 rounded-lg flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-500/50 text-white w-full'
              >
                <Save className='w-5 h-5' />
                Update Score
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add the new Goal Scorers section here */}
      <div className='px-6 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
        <div className='px-6 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
          {/* Title */}
          <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
            <BarChart className='w-5 h-5' />
            Goal Scorers
          </h2>

          {/* Current Goal Scorers */}
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold">Current Goal Scorers</h3>
            {goalScorers.length === 0 ? (
              <p className="text-muted-foreground text-sm">No goal scorers recorded yet</p>
            ) : (
              <div className="space-y-2">
                {goalScorers.map((scorer, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-secondary rounded">
                    <div>
                      <span className="font-medium">Player Name: {scorer.player.name}</span>
                      <span className="text-xs text-muted-foreground block">
                        {scorer.team.name} • {scorer.time}'
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveGoalScorer(scorer.player._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Goal Scorer */}
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold">Add New Goal Scorer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1.5">Player</label>
                <select
                  value={newGoalScorer.playerId}
                  onChange={(e) => setNewGoalScorer({...newGoalScorer, playerId: e.target.value})}
                  className="w-full p-2 border rounded bg-input"
                >
                  <option value="">Select Player</option>
                  {
                    newGoalScorer.teamId === homeId ? homePlayers.map((player) => (
                      <option value={player.player._id} key={player.player._id}>
                        {player.player.name}
                      </option>
                    )) : awayPlayers.map((player) => (
                      <option value={player.player._id} key={player.player._id}>
                        {player.player.name}
                      </option>
                    ))
                  }
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1.5">Team</label>
                <select
                  value={newGoalScorer.teamId}
                  onChange={(e) => setNewGoalScorer({...newGoalScorer, teamId: e.target.value})}
                  className="w-full p-2 border rounded bg-input"
                >
                  <option value="">Select Team</option>
                  {[{name: homeName, _id: homeId}, { name: awayName, _id: awayId }].map((team) => (
                    <option value={team._id} key={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1.5">Minute</label>
                <input
                  type="number"
                  min="1"
                  value={newGoalScorer.time}
                  onChange={(e) => setNewGoalScorer({...newGoalScorer, time: Number(e.target.value)})}
                  className="w-full p-2 border rounded bg-input"
                  placeholder="Minute scored"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1.5">Goal Type</label>
                <select
                  value={newGoalScorer.goalType}
                  onChange={(e) => setNewGoalScorer({...newGoalScorer, goalType: e.target.value as FixtureTimelineGoalType})}
                  className="w-full p-2 border rounded bg-input"
                >
                  {
                    Object.values(FixtureTimelineGoalType).map((type) => (
                      <option value={type} key={type}>{type}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <button
              onClick={handleAddGoalScorer}
              className="py-2 rounded-lg flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-500/50 text-white w-full mt-2"
            >
              <Save className="w-5 h-5" />
              Add Goal Scorer
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Overview