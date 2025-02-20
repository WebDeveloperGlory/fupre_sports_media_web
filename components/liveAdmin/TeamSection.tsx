import { FixtureTeamPlayers } from "@/utils/requestDataTypes";
import { Players } from "@/utils/stateTypes";
import { UserPlus2 } from "lucide-react";
import TeamSquad from "./TeamSquad";
import FormationDropdown from "./FormationDropDown";

type Formation = {
    formation: string,
    startingXI: string[],
    subs: string[]
}
type PlayerMoveFunc = ( player: Players, team: 'homeTeam' | 'awayTeam', destinationSquad: 'starting' | 'substitutes' | 'available' ) => void;

const TeamSection = (
    { team, availablePlayers, title, onPlayerMove, side, handleFormationChange, handleDropDownToggle, dropdownOpen }:
    { team: Formation, availablePlayers: FixtureTeamPlayers | null, title: string, onPlayerMove: PlayerMoveFunc, side: keyof FixtureTeamPlayers, handleFormationChange: ( team: "homeTeam" | "awayTeam", formationValue: string ) => void, handleDropDownToggle: ( team: 'homeTeam' | 'awayTeam' ) => void, dropdownOpen: boolean }
  ) => {
    const isPlayerInSquad = ( playerId: string ) => {
      return team.startingXI.some( p => p === playerId ) ||
             team.subs.some( p => p === playerId );
    };
  
    return (
      <div className='bg-card/40 backdrop-blur-sm'>
        <h2 className='font-bold'>{ title }</h2>
  
        {/* Formation */}
        <div className="w-full max-w-xs my-2">
          <label className="block text-sm font-medium mb-1">Formation</label>
          <FormationDropdown 
            team={ side }
            value={ team.formation }
            isOpen={ dropdownOpen }
            setIsOpen={ handleDropDownToggle }
            handleFormationChange={ handleFormationChange }
          />
        </div>
  
        <div className='space-y-6'>
          {/* Selected Squads */}
          <div className="space-y-6">
            <TeamSquad
              players={ team.startingXI }
              title="Starting XI"
              onRemove={( player ) => onPlayerMove( player, side, 'available' ) }
              maxPlayers={ 11 }
              team={ side }
              teamPlayers={ availablePlayers }
            />
            <TeamSquad
              players={ team.subs }
              title="Substitutes"
              onRemove={( player ) => onPlayerMove( player, side, 'available' ) }
              maxPlayers={ 7 }
              team={ side }
              teamPlayers={ availablePlayers }
            />
          </div>
  
          {/* Available Players */}
          <div className="space-y-2">
              <h3 className="font-medium text-sm">Available Players</h3>
              <div className="space-y-2">
                {
                  availablePlayers && availablePlayers[ side ].players.filter(player => !isPlayerInSquad(player._id)).map(( player, index ) => (
                  <div
                    key={player._id}
                    className="flex items-center justify-between p-2 bg-card hover:bg-card/80 rounded-lg border border-border transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-emerald-500 text-white rounded-full text-sm">
                        { index }
                      </span>
                      <span className="font-medium">{player.name}</span>
                      <span className="text-sm text-muted-foreground">{player.position}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onPlayerMove(player, side, 'starting')}
                        disabled={team.startingXI.length >= 11}
                        className="flex items-center space-x-1 px-2 py-1 text-sm rounded-md hover:bg-emerald-500 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit transition-colors"
                        title="Add to Starting XI"
                      >
                        <span>Starting</span>
                        <UserPlus2 size={16} />
                      </button>
                      <button
                        onClick={ () => onPlayerMove( player, side, 'substitutes' ) }
                        disabled={ team.subs.length >= 7 }
                        className="flex items-center space-x-1 px-2 py-1 text-sm rounded-md hover:bg-emerald-500 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit transition-colors"
                        title="Add to Substitutes"
                      >
                        <span>Sub</span>
                        <UserPlus2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    )
}

export default TeamSection