import React from 'react'
import { LineUp } from '@/utils/stateTypes';
import { Users } from 'lucide-react';
import { Fixture } from '@/utils/requestDataTypes';

const Lineups = (
    { fixtureData }:
    { fixtureData: Fixture | null }
) => {
  return (
    <div className="bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border">
        <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
            <Users className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
            <span>Team Lineups</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <LineupSection 
                lineUp={ fixtureData!.homeLineup } 
                teamName={ fixtureData!.homeTeam.name }
            />
            <LineupSection 
                lineUp={ fixtureData!.awayLineup } 
                teamName={ fixtureData!.awayTeam.name } 
            />
        </div>
    </div>
  )
}

const LineupSection = ({ lineUp, teamName }: { lineUp: LineUp, teamName: string }) => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{ teamName }</h3>
          <span className="text-sm text-muted-foreground">Formation: { lineUp.formation || 'Not Set' }</span>
        </div>
  
        {/* Starting XI */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Starting XI</h4>
          <div className="space-y-2">
            {
              lineUp.startingXI.length > 0 && lineUp.startingXI.map(( player, index ) => (
                <div 
                  key={ player._id }
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-secondary rounded-full text-xs">
                    { index }
                  </span>
                  <span className="flex-1">{ player.name }</span>
                  <span className="text-sm text-muted-foreground">{ player.position }</span>
                </div>
              ))
            }
            {
              lineUp.startingXI.length === 0 && <span>No Starting 11 Data</span>
            }
          </div>
        </div>
  
        {/* Substitutes */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Substitutes</h4>
          <div className="space-y-2">
            {
              lineUp.subs.length > 0 && lineUp.subs.map(( player, index ) => (
                <div 
                  key={ player._id }
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-secondary rounded-full text-xs">
                    { index }
                  </span>
                  <span className="flex-1">{ player.name }</span>
                  <span className="text-sm text-muted-foreground">{ player.position }</span>
                </div>
              ))
            }
            {
              lineUp.subs.length === 0 && <span>No Substitutes Data</span>
            }
          </div>
        </div>
      </div>
    );
};

export default Lineups