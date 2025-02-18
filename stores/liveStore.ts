import { Players, EventTypes, Team } from '@/utils/stateTypes';
import { create } from 'zustand'

export type Event = {
    time: number,
    eventType: string,
    player: Players | null,
    team: Team | null,
    substitutedFor: Players | null,
    commentary: string | null,
    id: number
}

export interface LiveStore {
    matchEvents: Event[] | [],
    currentEventId: number,
    hasMatchEvents: boolean,
    kickOffClicked: boolean,
    setMatchEvents: ( event: Event ) => void,
    setServerMatchEvents: ( events: Event[] ) => void,
    deleteMatchEvents: ( eventId: number ) => void,
    updateMatchEvents: ( eventId: number, updatedEvent: Event ) => void,
    setHasMatchEvents: ( checked: boolean ) => void,
    setKickOffClicked: () => void,
}

const useLiveStore = create<LiveStore>( ( set ) => ({
    matchEvents: [],
    currentEventId: 0,
    hasMatchEvents: false,
    kickOffClicked: false,
    setMatchEvents: ( event: Event ) => set( ( state: LiveStore ) => ({ 
        matchEvents: [ ...state.matchEvents, event ],
        currentEventId: state.currentEventId + 1
    })),
    setServerMatchEvents: ( events: Event[] ) => set({ matchEvents: events }),
    deleteMatchEvents: ( eventId: number ) => set( ( state: LiveStore ) => {
        const filteredEvents = [ ...state.matchEvents ].filter( ( event: Event ) => event.id !== eventId );

        return ({ 
            matchEvents: filteredEvents 
        })
    }),
    updateMatchEvents: ( eventId: number, updatedEvent: Event ) => set( ( state: LiveStore ) => {
        const updatedEvents = [ ...state.matchEvents ].map( event => 
            event.id === eventId ? updatedEvent : event
        );

        return ({
            matchEvents: updatedEvents
        })
    }),
    setHasMatchEvents: ( checked: boolean ) => set({ hasMatchEvents: checked }),
    setKickOffClicked: () => set({ kickOffClicked: true }),
}));

export default useLiveStore;