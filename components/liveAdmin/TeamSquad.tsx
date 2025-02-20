import { FixtureTeamPlayers } from '@/utils/requestDataTypes';
import { Players } from '@/utils/stateTypes';
import { UserMinus2 } from 'lucide-react';
import React from 'react'

const TeamSquad = (
    { players, title, onRemove, maxPlayers, team, teamPlayers }:
    { players: string[] | [], title: string, onRemove: ( player: Players ) => void, maxPlayers: number, team: keyof FixtureTeamPlayers, teamPlayers: FixtureTeamPlayers | null }
  ) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">{ title }</h3>
          <span className="text-sm text-muted-foreground">
            { players.length }/{ maxPlayers }
          </span>
        </div>
        <div className="space-y-2">
          {
            players.map(( p, index ) => {
              const player = teamPlayers![ team ].players.find( pl => pl._id === p );
              return (
                <div
                  key={ player ? player._id : index }
                  className="flex items-center justify-between p-2 bg-card hover:bg-card/80 rounded-lg border border-border transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-emerald-500 text-white rounded-full text-sm">
                      { index }
                    </span>
                    <span className="font-medium">{ player ? player.name : '' }</span>
                    <span className="text-sm text-muted-foreground">{ player ? player.position : '' }</span>
                  </div>
                  <button
                    onClick={ () => onRemove( player! ) }
                    className="p-1 hover:text-red-500 transition-colors"
                    title="Remove player"
                  >
                    <UserMinus2 size={ 16 } />
                  </button>
                </div>
              )
            })
          }
        </div>
      </div>
    )
}

export default TeamSquad