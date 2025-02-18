import useLiveStore, { Event } from '@/stores/liveStore';
import { LiveStatState, Players, Team } from '@/utils/stateTypes';
import { ChevronDown, ChevronUp, Clock, Edit2, MessageSquare, Save, User, X } from 'lucide-react';
import React, { useState } from 'react'

const getEventIcon = ( event: Event ) => {
    switch ( event.eventType ) {
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
}

const getEventText = ( event: Event, players: Players[] ) => {
    const player = players.find( p => p._id === event.player?._id )?.name || '';
    switch ( event.eventType ) {
        case 'goal':
            return `Goal scored by ${ event.team!.name }( ${ player } )`;
        case 'assist':
            return `Assisted by ${ event.team!.name }( ${ player } )`;
        case 'yellowCard':
            return `Yellow card shown to ${ event.team!.name }( ${ player } )`;
        case 'redCard':
            return `Red card shown to ${ event.team!.name }( ${ player } )`;
        case 'substitution':
            const subbed = players.find( p => p._id === event.substitutedFor?._id )?.name || '';
            return `${ event.team!.name }( ${ player } replaces ${ subbed } )`;
        case 'foul': 
            return `Foul by ${ event.team!.name }`
        case 'corner': 
            return `Corner awarded to ${ event.team!.name }`
        case 'offside': 
            return `Offside by ${ event.team!.name }`
        case 'shotOffTarget': 
            return `Shot missed ${ event.team!.name }`
        case 'shotOnTarget': 
            return `Shot on target ${ event.team!.name }`
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

const EXCLUDED_PLAYER_EVENT_TYPE = ['foul', 'corner', 'offside', 'kickoff', 'halftime', 'fulltime']

const LogCard = (
    { event, onDelete, onEdit, homePlayers, awayPlayers, homeTeam, awayTeam }:
    { event: Event, onDelete: ( id: number ) => void, onEdit: ( id: number, updatedEvent: Event ) => void, homePlayers: Players[] | [], awayPlayers: Players[] | [], homeTeam: Team, awayTeam: Team }
) => {
    const [ isEditing, setIsEditing ] = useState( false );
    const [ isExpanded, setIsExpanded ] = useState( false );
    const [ editedEvent, setEditedEvent ] = useState({
        time: event.time,
        player: event.player,
        commentary: event.commentary || ''
    });
    const playerList = event.team !== null
        ? event.team._id === homeTeam._id
            ? homePlayers
            : event.team._id === awayTeam._id
                ? awayPlayers
                : []
        : []

    const handleSave = () => {
        onEdit( event.id, {
            ...event,
            ...editedEvent
        });
        setIsEditing( false );
    };
    const handlePlayerSelect = ( e: any ) => {
        const player = playerList.find( p => p._id === e.target.value ) || null;
        setEditedEvent({
            ...editedEvent,
            player
        })
    }
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-2 overflow-hidden">
        <div className="p-3 hover:bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-grow">
                    <div className="text-lg">
                        { getEventIcon( event ) }
                    </div>
                    <div className="font-mono text-sm text-gray-500">
                        { event.time }'
                    </div>
                    <div className="text-gray-900">
                        { getEventText( event, playerList ) }
                    </div>
                </div>
                
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={ () => setIsExpanded( !isExpanded ) }
                        className="p-1 hover:bg-gray-200 rounded"
                    >
                        {
                            isExpanded 
                                ? <ChevronUp className="w-4 h-4 text-gray-500" /> 
                                : <ChevronDown className="w-4 h-4 text-gray-500" />
                        }
                    </button>
                    <button 
                        onClick={ () => setIsEditing( true ) }
                        className="p-1 hover:bg-blue-100 rounded text-blue-600"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={ () => onDelete( event.id ) }
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
    
            {
                isExpanded && !isEditing && event.commentary && (
                    <div className="mt-2 pl-12 text-sm text-gray-600">
                        { event.commentary }
                    </div>
                )
            }
    
            {
                isEditing && (
                    <div className="mt-3 space-y-3 pl-12">
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                value={ editedEvent.time }
                                onChange={ 
                                    ( e ) => setEditedEvent({
                                        ...editedEvent,
                                        time: Number( e.target.value )
                                    })
                                }
                                className="border rounded px-2 py-1 w-20 text-black"
                                min="0"
                                max="120"
                            />
                            <span className="text-sm text-gray-500">minutes</span>
                        </div>
            
                        {
                            playerList.length > 0 && !EXCLUDED_PLAYER_EVENT_TYPE.includes( event.eventType ) && (
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <select
                                        value={ editedEvent.player?._id }
                                        onChange= { handlePlayerSelect }
                                        className="border rounded px-2 py-1 text-black cursor-pointer"
                                    >
                                        {
                                            playerList?.map( player => (
                                                <option key={ player._id } value={ player._id }>
                                                    { player.name }
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            )
                        }
            
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={ editedEvent.commentary }
                                onChange={
                                    ( e ) => setEditedEvent({
                                        ...editedEvent,
                                        commentary: e.target.value
                                    })
                                }
                                placeholder="Add commentary..."
                                className="border rounded px-2 py-1 w-full text-black"
                            />
                        </div>
            
                        <div className="flex justify-end space-x-2 pt-2">
                            <button
                                onClick={ () => setIsEditing( false ) }
                                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={ handleSave }
                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-1"
                            >
                                <Save className="w-4 h-4" />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default LogCard