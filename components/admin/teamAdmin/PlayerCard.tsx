import React, { useState } from 'react'
import { Players } from '@/utils/stateTypes';
import { MoreVertical, Pencil, Trash2, User } from 'lucide-react';

const PlayerCard = (
    { player, onEdit, onDelete }:
    { player: Players, onEdit: ( player: Players ) => void, onDelete: ( player: Players ) => void }

) => {
    const [ showDropdown, setShowDropdown ] = useState<boolean>( false );
  
    return (
        <div className="bg-popover rounded-lg shadow p-6 relative">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg">{ player.name }</h3>
                        <p className="text-muted-foreground">#{ player.number || 'Not Set' } • { player.position }</p>
                    </div>
                </div>
            
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="p-2 hover:bg-primary hover:text-secondary rounded-lg"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                        <button
                            onClick={() => {
                                onEdit( player );
                                setShowDropdown( false );
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                onDelete( player );
                                setShowDropdown( false );
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerCard