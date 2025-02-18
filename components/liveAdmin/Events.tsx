import React, { useState } from 'react'
import { EventTypes, LiveStatState } from '@/utils/stateTypes';
import useLiveStore from '@/stores/liveStore';
import { EVENT_TYPES } from '@/constants';
import useTimerStore from '@/stores/timerStore';
import { MinusCircle, PlusCircle } from 'lucide-react';
import PossessionTracker from '../admin/PossessionTracker';

const LiveEvents = (
  { statValues, hasPenalties, setStatValues, setHasPenalties }: 
  { statValues: LiveStatState, hasPenalties: boolean, setStatValues: any, setHasPenalties: any }
) => {
    const { matchEvents, hasMatchEvents, currentEventId, setMatchEvents, setHasMatchEvents } = useLiveStore();
    const { time, half } = useTimerStore();

    const updateStats = ( type: keyof EventTypes, team: 'home' | 'away', value: number | null ) => {
      const teamDetails = team === 'home' 
        ? statValues.homeTeam 
        : team === 'away'
            ? statValues.awayTeam
            : { name: '', _id: '' };
      
      let currentTime = Math.floor( time / 60 )

      if( hasMatchEvents ) {
        setMatchEvents(
          {
            time: currentTime,
            eventType: EVENT_TYPES[ type ],
            player: null,
            team: teamDetails,
            substitutedFor: null,
            commentary: null,
            id: currentEventId
          }
        );
        console.log( matchEvents )
      }
      
      setStatValues( ( prev: LiveStatState ) => ({
        ...prev,
        [ team ]: {
          ...prev[ team ],
          [ type ]: value
        }
      }))
    }
    const updateGoals = ( team: 'home' | 'away', value: number ) => {
      const teamDetails = team === 'home' 
        ? statValues.homeTeam 
        : team === 'away'
            ? statValues.awayTeam
            : { name: '', _id: '' };

      let currentTime = Math.floor( time / 60 )

      setStatValues( ( prev: LiveStatState ) => {
        const homeScore = team === 'home' ? value : prev.homeScore;
        const awayScore = team === 'away' ? value : prev.awayScore;

        return ({
          ...prev,
          homeScore,
          awayScore
        })
      })

      const score = team === 'home' ? statValues.homeScore : statValues.awayScore
      if( hasMatchEvents && value > score ) {
        setMatchEvents(
          {
            time: currentTime,
            eventType: EVENT_TYPES.goal,
            player: null,
            team: teamDetails,
            substitutedFor: null,
            commentary: null,
            id: currentEventId
          }
        );
        setMatchEvents(
          {
            time: currentTime,
            eventType: EVENT_TYPES.assist,
            player: null,
            team: teamDetails,
            substitutedFor: null,
            commentary: null,
            id: currentEventId + 2000
          }
        )
        console.log( matchEvents )
      }
    }

    const handlePenaltyChange = ( checked: boolean ) => {
      setHasPenalties( checked );
      if ( checked ) {
        setStatValues( ( prev: LiveStatState ) => ({
          ...prev,
          homePenalty: 0,
          awayPenalty: 0
        }));
      } else {
        setStatValues( ( prev: LiveStatState ) => ({
          ...prev,
          homePenalty: null,
          awayPenalty: null
        }));
      }
    };

    const handleMatchEventsChange = ( checked: boolean ) => {
      setHasMatchEvents( checked );
    }
  return (
    <div>
      <div className='py-4 pb-3 w-full tracking-wide'>
        {/* Penalty Checkbox */}
        { 
          statValues.competition?.type === 'knockout' && (
            <div className="my-2 flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="penalties"
                checked={hasPenalties}
                onChange={(e) => handlePenaltyChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 cursor-pointer"
              />
              <label htmlFor="penalties" className="ml-2 text-muted-foreground cursor-pointer">
                Match went to penalties
              </label>
            </div>
          )
        }

        {/* Match Events Checkbox */}
        <div className="my-2 flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="matchEvents"
            checked={ hasMatchEvents }
            onChange={ ( e ) => handleMatchEventsChange( e.target.checked ) }
            className="w-4 h-4 text-blue-600 cursor-pointer"
          />
          <label htmlFor="matchEvents" className="ml-2 text-muted-foreground cursor-pointer">
            Enable Match Events
          </label>
        </div>

        <div className='p-4 pt-2'>
          <PossessionTracker />
          
          <StatDisplay
            label='Goals'
            homeValue={ statValues.homeScore }
            awayValue={ statValues.awayScore }
            onChange={ ( team, value ) => updateGoals( team, value ) }
          />
          {
            hasPenalties && (
              <StatDisplay
                label="Penalties"
                homeValue={ statValues.homePenalty }
                awayValue={ statValues.awayPenalty }
                onChange={
                  ( team, value ) => {
                    setStatValues( ( prev: LiveStatState ) => ({
                      ...prev,
                      [`${team}Penalty`]: value
                    }));
                  }
                }
              />
          )}
          <StatDisplay
            label='Total Shots'
            homeValue={ statValues.home.shotsOffTarget + statValues.home.shotsOnTarget }
            awayValue={ statValues.away.shotsOffTarget + statValues.away.shotsOnTarget }
            onChange={ () => {} }
          />
          <StatDisplay
            label='Shots On Target'
            homeValue={ statValues.home.shotsOnTarget }
            awayValue={ statValues.away.shotsOnTarget }
            onChange={ ( team, value ) => updateStats( 'shotsOnTarget', team, value ) }
          />
          <StatDisplay
            label='Shots Off Target'
            homeValue={ statValues.home.shotsOffTarget }
            awayValue={ statValues.away.shotsOffTarget }
            onChange={ ( team, value ) => updateStats( 'shotsOffTarget', team, value ) }
          />
          <StatDisplay
            label='Offside'
            homeValue={ statValues.home.offsides }
            awayValue={ statValues.away.offsides }
            onChange={ ( team, value ) => updateStats( 'offsides', team, value ) }
          />
          <StatDisplay
            label='Corners'
            homeValue={ statValues.home.corners }
            awayValue={ statValues.away.corners }
            onChange={ ( team, value ) => updateStats( 'corners', team, value ) }
          />
          <StatDisplay
            label='Fouls'
            homeValue={ statValues.home.fouls }
            awayValue={ statValues.away.fouls }
            onChange={ ( team, value ) => updateStats( 'fouls', team, value ) }
          />
          <StatDisplay
            label='Yellow Cards'
            homeValue={ statValues.home.yellowCards }
            awayValue={ statValues.away.yellowCards }
            onChange={ ( team, value ) => updateStats( 'yellowCards', team, value ) }
          />
          <StatDisplay
            label='Red Cards'
            homeValue={ statValues.home.redCards }
            awayValue={ statValues.away.redCards }
            onChange={ ( team, value ) => updateStats( 'redCards', team, value ) }
          />
        </div>
      </div>
    </div>
  )
}

const StatDisplay = (
  { label, homeValue, awayValue, onChange }: 
  { label: string, homeValue: number | null, awayValue: number | null, onChange: ( team: 'home' | 'away', value: number ) => void }
) => {
  return (
    <div className='p-2 border-b flex items-center justify-between'>
        <span className='text-bold'>{ label }</span>

        <div className='flex items-center'>
            <div className='pr-2 md:pr-4 border-r flex items-center'>
                <button
                    onClick={ () => onChange( 'home', homeValue! - 1 ) }
                    className={`
                        text-red-500 disabled:opacity-50 ${
                            label === 'Total Shots' 
                                ? 'opacity-50' 
                                : '' 
                            } 
                    `}
                    disabled={ homeValue === 0 }
                >
                    <MinusCircle className='w-5 h-5' />
                </button>
                <p className='text-center mx-2 w-8 md:w-10'>{ homeValue }</p>
                <button
                    onClick={ () => onChange( 'home', homeValue! + 1 ) }
                    className={`
                        text-green-500 disabled:opacity-50 ${ 
                            label === 'Total Shots' 
                                ? 'opacity-50' 
                                : '' 
                            } 
                    `}
                >
                    <PlusCircle className='w-5 h-5' />
                </button>
            </div>
            <div className='pl-2 md:pl-4 border-l flex items-center'>
                <button
                    onClick={ () => onChange( 'away', awayValue! - 1 ) }
                    className={`
                        text-red-500 disabled:opacity-50 ${
                            label === 'Total Shots' 
                                ? 'opacity-50' 
                                : '' 
                            } 
                    `}
                    disabled={ awayValue === 0 }
                >
                    <MinusCircle className='w-5 h-5' />
                </button>
                <p className='text-center mx-2 w-8 md:w-10'>{ awayValue }</p>
                <button
                    onClick={ () => onChange( 'away', awayValue! + 1 ) }
                    className={`
                        text-green-500 disabled:opacity-50 ${
                            label === 'Total Shots' 
                                ? 'opacity-50' 
                                : '' 
                            } 
                    `}
                >
                    <PlusCircle className='w-5 h-5' />
                </button>
            </div>
        </div>
    </div>
  )
}

export default LiveEvents