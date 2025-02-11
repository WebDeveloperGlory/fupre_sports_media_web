import useTimerStore from '@/stores/timerStore';
import React, { useEffect, useState } from 'react'

const Time = () => {
    const {
        time,
        isRunning,
        half,
        injuryTime,
        isPenaltyShootout,
        setTime,
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

    const totalTime = time + injuryTime; // Total time including injury time
  return (
    <div>
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
    </div>
  )
}

export default Time