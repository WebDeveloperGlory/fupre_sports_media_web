import useLiveStore from '@/stores/liveStore'
import useTimerStore from '@/stores/timerStore'
import { Players, Team } from '@/utils/stateTypes'
import { ArrowLeftRight, UserPlus2 } from 'lucide-react'
import React, { useState } from 'react'

type CurrentLineups = {
  home: Players[],
  away: Players[]
}
type Substitutions = {
  home: {
    in: Players,
    out: Players,
    time: number
  }[],
  away: {
    in: Players,
    out: Players,
    time: number    
  }[]
}


const LineUps = (
  { 
    homePlayers, awayPlayers, 
    homeTeam, awayTeam,
    currentLineups, setCurrentLineups,
    substitutions, setSubstitutions,
  }: 
  {
    homePlayers: Players[], awayPlayers: Players[], 
    homeTeam: Team, awayTeam: Team
    currentLineups: CurrentLineups, setCurrentLineups: ( lineup: CurrentLineups ) => void,
    substitutions: Substitutions, setSubstitutions: ( substitutions: Substitutions ) => void,
  }
) => {
    const { time } = useTimerStore();
    const { setMatchEvents, currentEventId } = useLiveStore();
    
    const [ selectedPlayer, setSelectedPlayer ] = useState<Players | null>( null );
    const [ activeTeam, setActiveTeam ] = useState<'home' | 'away'>('home');

    const getAvailablePlayers = ( team: 'home' | 'away' ) => {
      const allPlayers = team === 'home' ? homePlayers : awayPlayers;
      const currentLineupIds = currentLineups[ team ].map( p => p._id );
      const subIds = substitutions[ team ].map( p => p.in._id );
      return allPlayers.filter( p => !currentLineupIds.includes( p._id ) && !subIds.includes( p._id ) );
    };
  
    const handleSubstitution = ( playerOut: Players ) => {
      if ( !selectedPlayer ) return;
  
      const newSubs = [ ...substitutions[ activeTeam ], {
        in: selectedPlayer,
        out: playerOut,
        time: time
      }];
  
      setSubstitutions({
        ...substitutions,
        [ activeTeam ]: newSubs
      });

      setMatchEvents({
        eventType: 'substitution',
        time,
        player: selectedPlayer,
        substitutedFor: playerOut,
        id: currentEventId,
        team: activeTeam === 'home' ? homeTeam : awayTeam,
        commentary: ''
      })
  
      const newLineup = currentLineups[ activeTeam ].map(p => 
        p._id === playerOut._id ? selectedPlayer : p
      );
  
      setCurrentLineups({
        ...currentLineups,
        [ activeTeam ]: newLineup
      });
  
      setSelectedPlayer( null );
    };
  return (
    <div>
      {/* Tabs Section */}
      <div className="grid grid-cols-2 gap-1 p-2 bg-muted rounded-lg mt-4">
        <button
          onClick={ () => setActiveTeam( 'home' ) }
          className={`
            rounded-lg py-2 px-4 ${
              activeTeam === 'home'
                ? 'bg-orange-500 text-white'
                : ''
            }  
          `}
        >
          { homeTeam.name }
        </button>
        <button
          onClick={ () => setActiveTeam( 'away' ) }
          className={`
            rounded-lg py-2 px-4 ${
              activeTeam === 'away'
                ? 'bg-orange-500 text-white'
                : ''
            }  
          `}
        >
          { awayTeam.name }
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        {/* Current Lineup */}
        {
          activeTeam === 'away' && <div className='hidden md:block'></div>
        }
        <div className="rounded-xl p-4 bg-muted">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">11</span>
            Current Lineup
          </h3>
          <div className="space-y-2">
            {
              currentLineups[activeTeam] && currentLineups[ activeTeam ].map(( player ) => (
                <div 
                  key={ player._id }
                  onClick={ () => selectedPlayer && handleSubstitution(player) }
                  className={`
                    flex items-center justify-between p-3 rounded-lg ${
                      selectedPlayer 
                        ? 'cursor-pointer hover:bg-popover-foreground transition-colors hover:text-primary-foreground' 
                        : 'bg-popover'
                    }
                    border shadow-sm
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{player.position}</span>
                    <span className="font-semibold">{player.name}</span>
                  </div>
                  {selectedPlayer && (
                    <span className="text-red-500 text-sm">Click to substitute</span>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Available Players */}
      <div className="rounded-xl p-4 bg-muted mt-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UserPlus2 className="w-8 h-8 p-1.5 bg-green-600 text-white rounded-full" />
          Available Players
        </h3>

        <div className="space-y-2">
          {
            getAvailablePlayers(activeTeam).map((player) => (
              <div 
                key={player._id}
                onClick={() => setSelectedPlayer(player)}
                className={`
                  flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                    selectedPlayer?._id === player._id 
                      ? 'bg-popover-foreground text-primary-foreground border-green-500' 
                      : 'bg-popover'
                  }
                  shadow-sm transition-colors
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">{player.position}</span>
                  <span className="font-semibold">{player.name}</span>
                </div>
                {selectedPlayer?._id === player._id && (
                  <span className="text-green-600 text-sm">Selected</span>
                )}
              </div>
            ))
          }
        </div>
      </div>

      {/* Substitutions */}
      <div className="md:col-span-2 rounded-xl p-4 bg-muted mt-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ArrowLeftRight className="w-8 h-8 p-1.5 bg-green-600 text-white rounded-full" />
          Substitutions Made
        </h3>

        <div className="space-y-2">
          {
            substitutions[activeTeam].map((sub, index) => (
              <div key={index} className="bg-popover p-3 rounded-lg border shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-medium">{ sub.out.name }</span>
                      <ArrowLeftRight className="h-4 w-4 text-gray-400" />
                      <span className="text-green-600 font-medium">{ sub.in.name }</span>
                    </div>
                  </div>

                  <span className="text-sm text-gray-500">
                    { sub.time }
                  </span>
                </div>
              </div>
            ))
          }
          {
            substitutions[activeTeam].length === 0 && (
              <div className="text-center py-8 text-white bg-popover rounded-lg border border-dashed border-gray-300">
                No substitutions made yet
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default LineUps