import useLiveStore, { Event } from '@/stores/liveStore'
import React from 'react'
import LogCard from './LogCard';
import { LiveStatState, Players } from '@/utils/stateTypes';

const Log = (
    { statValues, homeLineup, awayLineup }: 
    { statValues: LiveStatState, homeLineup: Players[] | [], awayLineup: Players[] | [] }
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
                    awayPlayers={ awayLineup }
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