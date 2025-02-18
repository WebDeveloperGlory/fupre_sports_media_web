import React, { useState } from 'react'

const PossessionTracker = (
    { homeTeamTime, awayTeamTime, setHomeTeamTime, setAwayTeamTime }: 
    { homeTeamTime: number, awayTeamTime: number, setHomeTeamTime: ( timeDiff: number ) => void, setAwayTeamTime: ( timeDiff: number ) => void, }
) => {
    const [ startTime, setStartTime ] = useState<number | null>( null );
    const [ currentTeam, setCurrentTeam ] = useState<"home" | "away" | null>( null );

    const startPossession = ( team: "home" | "away" ) => {
        if ( currentTeam !== null ) return; // Prevent restarting while active
        setStartTime( Date.now() );
        setCurrentTeam( team );
    };
    
    const stopPossession = () => {
        if ( !startTime || !currentTeam ) return;
    
        const timeDiff = ( Date.now() - startTime ) / 1000; // Convert ms to seconds

        if ( currentTeam === "home") {
            setHomeTeamTime( timeDiff );
        } else {
            setAwayTeamTime( timeDiff );
        }

        // Reset
        setStartTime( null );
        setCurrentTeam( null );
        console.log( homeTeamTime, awayTeamTime )
    };

    // Calculate total elapsed game time
    const totalElapsedGameTime = homeTeamTime + awayTeamTime;
    const homePossession = totalElapsedGameTime > 0 ? ( homeTeamTime / totalElapsedGameTime ) * 100 : 50;
    const awayPossession = 100 - homePossession; // Ensures total is always 100%
  return (
    <div className='flex items-center flex-col md:flex-row gap-4'>
        <button 
            onClick={ () => startPossession( 'home' ) } 
            disabled={ currentTeam !== null } 
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Start Possession for Team A
        </button>
        <button 
            onClick={ stopPossession } 
            disabled={ currentTeam === null } 
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Stop Possession
        </button>
        <button 
            onClick={ () => startPossession( 'away' ) } 
            disabled={ currentTeam !== null } 
            className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Start Possession for Team B
        </button>
        <p>📊 Current Possession: Home Team { homePossession.toFixed( 2 ) }% - Away Team { awayPossession.toFixed( 2 ) }%</p>
    </div>
  )
}

export default PossessionTracker