'use client'

import { useEffect, useState } from 'react'
import useTimerStore from '@/stores/timerStore'

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
    } = useTimerStore();

    const [ localTime, setLocalTime ] = useState<number>( time );
  
    useEffect(() => {
      let interval: any;

      if ( isRunning ) {
        interval = setInterval(() => {
            setLocalTime(( prev ) => prev + 1 );
        }, 1000);
      }

      return () => clearInterval( interval );
    }, [ isRunning ] );
  
    useEffect(() => {
        setTime( localTime );
    }, [ localTime, setTime ] );
  
    const formatTime = ( seconds: number ) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
  
    const handleMatchOver = () => {
        stopTimer(); // This will clear the timer from localStorage
    };
  
    const handleNextHalf = () => {
        stopTimer(); // Reset the timer
        setLocalTime(0); // Reset local time to 0
        setHalf(half === 'First Half' ? 'Second Half' : 'First Half'); // Update the half
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
  
    const totalTime = time + injuryTime; // Total time including injury time
  
    return (
        <div className="max-w-lg mx-auto p-6 text-card-foreground">
            {/* Timer Section */}
            <div className="bg-muted p-4 rounded-lg flex flex-col items-center mb-4">
                <p className="text-lg font-semibold">Current Half: { half }</p>
                <p className="text-3xl font-bold mt-2">{ formatTime( totalTime ) }</p>
                {
                    injuryTime > 0 && (
                        <p className="text-sm text-red-500 mt-1">+{formatTime(injuryTime)} Injury Time</p>
                    )
                }
                {
                    isPenaltyShootout && <p className="text-yellow-500 mt-2">Penalty Shootout in Progress</p>
                }
            </div>

            {/* Button Section */}
            <div className="grid grid-cols-2 gap-3">
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