import useLiveStore, { Event } from '@/stores/liveStore'
import React from 'react'
import LogCard from './LogCard';
import { LiveStatState, Players } from '@/utils/stateTypes';

const Log = (
    { statValues, homeLineup, awayLineup, homeSubs, awaySubs }: 
    { statValues: LiveStatState, homeLineup: Players[], awayLineup: Players[], homeSubs: Players[], awaySubs: Players[] }
) => {
    const { matchEvents, deleteMatchEvents, updateMatchEvents } = useLiveStore();

    const handleDeleteEvent = ( id: number ) => {
        deleteMatchEvents( id );
    };
    const handleEditEvent = ( id: number, updatedEvent: Event ) => {
        updateMatchEvents( id, updatedEvent );
    };
  return (
    <div className='py-4 pb-3 w-full'>
        {
            matchEvents.length > 0 && matchEvents.map( ( event ) => (
                <LogCard
                    key={ event.id }
                    event={ event }
                    homePlayers={ homeLineup }
                    homeSubs={ homeSubs }
                    awayPlayers={ awayLineup }
                    awaySubs={ awaySubs }
                    homeTeam={ statValues.homeTeam }
                    awayTeam={ statValues.awayTeam }
                    onEdit={ handleEditEvent }
                    onDelete={ handleDeleteEvent }
                />
            ))
        }
        {
            matchEvents.length === 0 && (
                <div>No Events Yet</div>
            )
        }
    </div>
  )
}

export default Log