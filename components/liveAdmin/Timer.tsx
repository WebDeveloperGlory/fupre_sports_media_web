'use client'

import { useEffect, useState } from 'react'
import useTimerStore from '@/stores/timerStore'
import useLiveStore from '@/stores/liveStore';
import { EVENT_TYPES } from '@/constants';

const Timer = () => {
    const {
      time,
      isRunning,
      isPaused,
      half,
      injuryTime,
      isPenaltyShootout,
      startTimer,
      stopTimer,
      pauseTimer,
      setTime,
      setHalf,
      setInjuryTime,
      startPenaltyShootout,
      handleGameOver,
    } = useTimerStore();
    const { currentEventId, kickOffClicked, setMatchEvents, setKickOffClicked } = useLiveStore();

    const handleMatchOver = () => {
        stopTimer(); // This will clear the timer from localStorage
        if( half === 'Second Half' ) {
            setMatchEvents({
                time: Math.floor( time / 60 ),
                eventType: EVENT_TYPES.fulltime,
                player: null,
                team: null,
                substitutedFor: null,
                commentary: null,
                id: currentEventId
            })
        };
        handleGameOver();
    };
  
    const handleNextHalf = () => {
        stopTimer(); // Reset the timer
        if( half === 'First Half' ) {
            setHalf( 'Second Half' ); // Update the half
            setMatchEvents({
                time: Math.floor( time / 60 ),
                eventType: EVENT_TYPES.halftime,
                player: null,
                team: null,
                substitutedFor: null,
                commentary: null,
                id: currentEventId
            })
        }
        setInjuryTime( 0 ); // Reset injury time for the new half
        startTimer(); // Start the timer for the next half
    };
  
    const handleAddInjuryTime = () => {
        const additionalTime = parseInt( prompt('Enter injury time in minutes: ') || '5', 10 );
        if ( !isNaN( additionalTime ) && additionalTime > 0 ) {
            setInjuryTime( additionalTime * 60 ); // Convert minutes to seconds
        }
    };
  
    const handleStartPenalties = () => {
        startPenaltyShootout(); // Transition to penalty shootout
    };

    const handleKickoff = () => {
        setMatchEvents({
            time: 0,
            eventType: EVENT_TYPES.kickoff,
            player: null,
            team: null,
            substitutedFor: null,
            commentary: null,
            id: currentEventId
        });
        startTimer();
        setKickOffClicked();
    }
  
    const totalTime = time + injuryTime; // Total time including injury time
  
    return (
        <div className="max-w-lg mx-auto p-6 text-card-foreground">
            {/* Button Section */}
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={ handleKickoff }
                    className="col-span-2 bg-gray-800 text-white py-2 rounded-lg disabled:opacity-50"
                    disabled={ kickOffClicked || time !== 0 }
                >
                    KickOff
                </button>
                <button 
                    onClick={ startTimer } 
                    disabled={ isRunning || isPenaltyShootout }
                    className="bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
                >
                    Start
                </button>
                <button 
                    onClick={ pauseTimer }
                    disabled={ !isRunning || isPaused || isPenaltyShootout } 
                    className="bg-yellow-500 text-white py-2 rounded-lg disabled:opacity-50"
                >
                    Pause
                </button>
                <button 
                    onClick={ stopTimer }
                    disabled={ ( !isRunning && !isPaused ) || isPenaltyShootout }
                    className="bg-red-500 text-white py-2 rounded-lg disabled:opacity-50"
                >
                    Stop
                </button>
                <button 
                    onClick={ handleNextHalf }
                    disabled={ isRunning || isPenaltyShootout }
                    className="bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50"
                >
                    Next Half
                </button>
                <button 
                    onClick={ handleAddInjuryTime }
                    disabled={ isPenaltyShootout }
                    className="bg-orange-500 text-white py-2 rounded-lg disabled:opacity-50"
                >
                    Add Injury Time
                </button>
                <button 
                    onClick={ handleStartPenalties }
                    disabled={ isPenaltyShootout || half !== 'Second Half' } 
                    className="bg-purple-600 text-white py-2 rounded-lg disabled:opacity-50"
                >
                    Start Penalties
                </button>
                <button 
                    onClick={ handleMatchOver }
                    className="col-span-2 bg-gray-800 text-white py-2 rounded-lg"
                >
                    Match Over
                </button>
            </div>
        </div>
    );
};

export default Timer