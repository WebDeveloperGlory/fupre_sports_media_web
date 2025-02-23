import useLiveStore, { Event } from '@/stores/liveStore'
import React from 'react'
import LogCard from './LogCard';
import { LiveStatState, Players } from '@/utils/stateTypes';

const Log = (
    { statValues, homeLineup, awayLineup }: 
    { statValues: LiveStatState, homeLineup: Players[], awayLineup: Players[] }
) => {
    const { matchEvents, deleteMatchEvents, updateMatchEvents } = useLiveStore();

    const homeSubs = matchEvents
            .filter( event => event.eventType === 'substitution' )
            .map( event => event.team?._id === statValues.homeTeam._id ? event.player : null )
            .filter( player => player !== null );
    const awaySubs = matchEvents
        .filter( event => event.eventType === 'substitution' )
        .map( event => event.team?._id === statValues.awayTeam._id ? event.player : null )
        .filter( player => player !== null );

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