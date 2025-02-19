import { Event } from '@/stores/liveStore';
import { LineUp, Players } from '@/utils/stateTypes';
import { motion } from 'framer-motion';

const getEventIcon = (event: Event) => {
  switch (event.eventType) {
    case 'goal':
      return '⚽';
    case 'assist':
      return '👟';
    case 'yellowCard':
      return '🟨';
    case 'redCard':
      return '🟥';
    case 'substitution':
      return '🔄';
    case 'shotOnTarget':
      return '🎯';
    case 'shotOffTarget':
      return '📌';
    case 'corner':
      return '🚩';
    case 'offside':
      return '🚫';
    case 'kickoff':
      return '▶️';
    case 'halftime':
      return '⏸️';
    case 'fulltime':
      return '⏹️';
    default:
      return '●';
  }
};

const getEventText = (event: Event, players: Players[]) => {
  const player = players.find(p => p._id === event.player?._id)?.name || '';
  switch (event.eventType) {
    case 'goal':
      return `Goal scored by ${event.team!.name} (${player})`;
    case 'assist':
      return `Assisted by ${event.team!.name} (${player})`;
    case 'yellowCard':
      return `Yellow card shown to ${event.team!.name} (${player})`;
    case 'redCard':
      return `Red card shown to ${event.team!.name} (${player})`;
    case 'substitution':
      const subbed = players.find(p => p._id === event.substitutedFor?._id)?.name || '';
      return `${event.team!.name} (${player} replaces ${subbed})`;
    case 'foul':
      return `Foul by ${event.team!.name}`;
    case 'corner':
      return `Corner awarded to ${event.team!.name}`;
    case 'offside':
      return `Offside by ${event.team!.name}`;
    case 'shotOffTarget':
      return `Shot missed ${event.team!.name}`;
    case 'shotOnTarget':
      return `Shot on target ${event.team!.name}`;
    case 'kickoff':
      return 'Kick Off';
    case 'halftime':
      return 'Half Time';
    case 'fulltime':
      return 'Full Time';
    default:
      return event.eventType.replace(/([A-Z])/g, ' $1').trim();
  }
};

interface TimelineProps {
  events: Event[],
  homeTeamId: string,
  awayTeamId: string,
  homeLineups: LineUp,
  awayLineups: LineUp,
}

export function Timeline({ events, homeTeamId, awayTeamId, homeLineups, awayLineups }: TimelineProps) {
  const homeLineup = homeLineups ? homeLineups.startingXI : [];
  const awayLineup = awayLineups ? awayLineups.startingXI : [];

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No events yet
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

          {/* Events */}
          <div className="space-y-4">
            {[...events].reverse().map((event) => {
              const playerList = event.team !== null
                ? event.team._id === homeTeamId
                  ? homeLineup
                  : event.team._id === awayTeamId
                    ? awayLineup
                    : []
                : [];

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative pl-12"
                >
                  {/* Event icon */}
                  <div className="absolute left-2 -translate-x-1/2 flex items-center justify-center w-4 h-4 rounded-full bg-card border border-border">
                    <span className="text-xs">
                      {getEventIcon(event)}
                    </span>
                  </div>

                  {/* Event content */}
                  <div className="bg-card rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-muted-foreground">
                        {event.time}'
                      </span>
                      <span className="text-sm">
                        {getEventText(event, playerList)}
                      </span>
                    </div>
                    {event.commentary && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {event.commentary}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 