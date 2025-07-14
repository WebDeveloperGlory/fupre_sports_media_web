import { FixtureTeamPlayers } from '@/utils/requestDataTypes';
import { Players } from '@/utils/stateTypes';
import { PlayerRole } from '@/utils/V2Utils/v2requestData.enums';
import { UserMinus2 } from 'lucide-react';
import React from 'react'

interface LiveFixTeamPlayers {
  homePlayers: {
    _id: string;
    name: string;
    admissionYear: string;
    role: PlayerRole;
    position: string;
    jerseyNumber: number;
  }[];
  awayPlayers: {
    _id: string;
    name: string;
    admissionYear: string;
    role: PlayerRole;
    position: string;
    jerseyNumber: number;
  }[];
}
type Player = {
  player: string;
  position: string;
  shirtNumber: number;
  isCaptain?: boolean;
}

const TeamSquad = (
    { players, title, onRemove, maxPlayers, team, teamPlayers }:
    { 
      players: Player[], 
      title: string, 
      onRemove: ( player: Player ) => void, 
      maxPlayers: number, team: keyof LiveFixTeamPlayers, 
      teamPlayers: LiveFixTeamPlayers | null 
    }
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
              const player = teamPlayers![ team ].find( pl => pl._id === p.player );
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
                    onClick={ 
                      () => onRemove(
                        {
                          player: player!._id,
                          position: player!.position,
                          shirtNumber: player!.jerseyNumber,
                          isCaptain: player!.role === PlayerRole.CAPTAIN ? true : false
                        }
                      ) 
                    }
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