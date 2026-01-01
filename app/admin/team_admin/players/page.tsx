'use client'

import React, { useEffect, useState } from 'react'
import { BackButton } from '@/components/ui/back-button';
import { Trash, User, UserPlus, X } from 'lucide-react';
import { Players, Team } from '@/utils/stateTypes';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import { Loader } from '@/components/ui/loader';
import PopUpModal from '@/components/modal/PopUpModal';
import PlayerCard from '@/components/admin/teamAdmin/PlayerCard';
import { createTeamPlayer, deleteTeamPlayer, getTeamPlayerList, updateTeamPlayer } from '@/lib/requests/v1/adminPage/requests';
import { sub } from 'date-fns';

type ErrorType = {
    name?: string,
    position?: string,
    number?: string
}
type FormData = {
    name: string,
    position: string,
    number: string | undefined
}
type SubmittedEditData = {
    name: string | undefined,
    position: string | undefined,
    number: string | undefined
}

const initialFormData = {
    name: '',
    position: '',
    number: '',
}

const PlayerList = () => {
    const router = useRouter();

    const { jwt } = useAuthStore();

    const [ loading, setLoading ] = useState<boolean>( true );
    const [ isAddOpen, setIsAddOpen ] = useState<boolean>( false );
    const [ isEditOpen, setIsEditOpen ] = useState<boolean>( false );
    const [ isDeleteOpen, setIsDeleteOpen ] = useState<boolean>( false );
    const [ players, setPlayers ] = useState<Players[]>( [] );
    const [ team, setTeam ] = useState<Team | null>( null );
    const [ selectedPlayer, setSelectedPlayer ] = useState<Players | null>( null );
    const [ formData, setFormData ] = useState<FormData>({ ...initialFormData });
    const [ errors, setErrors ] = useState<ErrorType>({});

    useEffect( () => {
        const fetchData = async () => {
            const data = await getTeamPlayerList( jwt! )
            if( data && data.code === '00' ) {
                setPlayers( data.data.players )
                setTeam( data.data.team )
            }
            console.log( data )
            setLoading( false );
        }

        if( !jwt ) {
            toast.error('Please Login First');
            setTimeout(() => router.push( '/admin' ), 1000);
        } else {
            if( loading ) fetchData();
        }
    }, [ loading ])

    const validateForm = () => {
        const newErrors: ErrorType = {};
        if ( !formData.name.trim() ) newErrors.name = 'Name is required';
        if ( !formData.position.trim() ) newErrors.position = 'Position is required';
        
        setErrors( newErrors );
        return Object.keys( newErrors ).length === 0;
    };
    const resetForm = () => {
        setFormData({ ...initialFormData });
        setErrors({});
    };

    const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [ name ]: value
        }));
        if (errors[ name as keyof ErrorType ]) {
            setErrors(prev => ({
                ...prev,
                [ name ]: ''
            }));
        }
    };

    const handleEditPlayer = async () => {
        if ( !validateForm() ) return;
        const { name, number, position } = formData;

        const data = await updateTeamPlayer( 
            jwt!, 
            selectedPlayer!._id, 
            { 
                name, position,
                number: number === 'undefined' ? null : Number(number)
            }
        )
        if( data && data.code === '00' ) {
            toast.success( data.message );
            setTimeout( () => setLoading( true ), 1000 );
        } else {
            toast.error( data?.message )
        }
    
        setIsEditOpen( false );
        resetForm();
        setSelectedPlayer( null );
    };
    const handleDeletePlayer = async () => {
        if( selectedPlayer ) {
            const data = await deleteTeamPlayer( jwt!, selectedPlayer._id );
            if( data && data.code === '00' ) {
                toast.success( data.message );
                setTimeout( () => setLoading( true ), 1000 );
            } else {
                toast.error( data?.message )
            }
        }
        setIsDeleteOpen( false );
        setSelectedPlayer( null );
    };
    const handleAddPlayer = async () => {
        if (!validateForm()) return;
        const { name, number, position } = formData;

        if( team ) {
            const data = await createTeamPlayer( 
                jwt!, 
                team._id, 
                { 
                    name, position,
                    number: number === 'undefined' ? null : Number(number)
                }
            )
            if( data && data.code === '00' ) {
                toast.success( data.message );
                setTimeout( () => setLoading( true ), 1000 );
            } else {
                toast.error( data?.message )
            }
        }

        setIsAddOpen( false );
        resetForm();
    };

    const toggleAddOpen = () => setIsAddOpen( !isAddOpen );
    const toggleEditOpen = () => setIsEditOpen( !isEditOpen );
    const toggleDeleteOpen = () => setIsDeleteOpen( !isDeleteOpen );

  return (
    <div>
        {/* Back Button */}
        <div className="fixed top-6 left-4 md:left-8 z-10">
            <BackButton />
        </div>

        <div className='pt-12 md:pt-0'>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-2xl font-bold">Team Roster</h1>
                <p className="text-muted-foreground mt-1">Manage your team's players and their information</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsAddOpen( true );
                    }}
                    className='bg-popover border border-border px-4 py-2 rounded-sm flex items-center justify-center gap-2 hover:shadow-md transition-shadow'
                >
                    <UserPlus className="h-4 w-4" />
                    Add Player
                </button>
            </div>

            {/* Loader */}
            {
                loading && <div className='h-screen flex items-center justify-center'><Loader /></div>
            }

            {/* Player List */}
            {
                players.length === 0 ? (
                    <div className="text-center py-12 bg-popover rounded-lg shadow mt-4">
                        <User className="h-12 w-12 mx-auto" />
                        <h3 className="mt-4 text-lg font-medium">No players found</h3>
                        <p className="mt-1 text-muted-foreground">Get started by adding a new player to the team.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4 mb-6">
                        {
                            players.map( player => (
                                <PlayerCard
                                    key={ player._id }
                                    player={ player }
                                    onEdit={
                                        ( player ) => {
                                            setSelectedPlayer( player );
                                            setFormData({ 
                                                ...player,
                                                number: String( player.number )
                                            });
                                            toggleEditOpen();
                                        }
                                    }
                                    onDelete={
                                        ( player ) => {
                                            setSelectedPlayer( player );
                                            toggleDeleteOpen();
                                        }
                                    }
                                />
                            ))
                        }
                    </div>
                )
            }
        </div>

        {/* Edit Modal */}
        <EditModal 
            modalOpen={ isEditOpen }
            toggleModal={ toggleEditOpen }
            handleEditPlayer={ handleEditPlayer }
            formData={ formData }
            setFormData={ setFormData }
            errors={ errors }
            handleInputChange={ handleInputChange }
        />
        {/* Add Modal */}
        <AddModal
            modalOpen={ isAddOpen }
            toggleModal={ toggleAddOpen }
            handleAddPlayer={ handleAddPlayer }
            formData={ formData }
            setFormData={ setFormData }
            errors={ errors }
            handleInputChange={ handleInputChange }
        />
        {/* Delete Modal */}
        <DeleteModal
            modalOpen={ isDeleteOpen }
            toggleModal={ toggleDeleteOpen }
            handleDeletePlayer={ handleDeletePlayer }
            selectedPlayer={ selectedPlayer }
        />
    </div>
  )
}

const EditModal = (
    { modalOpen, toggleModal, handleEditPlayer, formData, setFormData, errors, handleInputChange }:
    {
        toggleModal: () => void,
        modalOpen: boolean,
        handleEditPlayer: () => void,
        formData: FormData,
        setFormData: ( formData: FormData ) => void,
        errors: ErrorType,
        handleInputChange: ( e: React.ChangeEvent<HTMLInputElement> ) => void
    }
) => {
        const disabledOptions = () => {
            return !formData.name.trim() || !formData.position.trim();
        }
    return (
        <PopUpModal
            open={ modalOpen }
            onClose={ toggleModal }
        >
            <h3 className="text-xl lg:text-lg font-bold text-orange-500 mb-4">Edit Player</h3>

            <div className='space-y-4 text-left mt-4'>
                {/* PlayerForm */}
                <PlayerForm 
                    formData={ formData }
                    setFormData={ setFormData }
                    errors={ errors }
                    handleInputChange={ handleInputChange }
                />

                {/* Buttons */}
                <div className='grid grid-cols-2 gap-2'>
                    <button
                        className='bg-red-500 hover:bg-red-600 text-white rounded' 
                        onClick={ toggleModal }
                    >
                        Cancel
                    </button>
                    <button
                        onClick={ handleEditPlayer }
                        className="w-full bg-orange-600 text-white p-3 rounded hover:bg-orange-700 transition-colors flex items-center justify-center disabled:opacity-50"
                        disabled={ disabledOptions() }
                    >
                        <User className="mr-2" /> Save Changes
                    </button>
                </div>
            </div>
        </PopUpModal>
    )
}

const DeleteModal = (
    { modalOpen, toggleModal, handleDeletePlayer, selectedPlayer }:
    {
        toggleModal: () => void,
        modalOpen: boolean,
        handleDeletePlayer: () => void,
        selectedPlayer: Players | null
    }
) => {
    return (
        <PopUpModal
            open={ modalOpen }
            onClose={ toggleModal }
        >
            <p className="text-gray-600">
                Are you sure you want to delete { selectedPlayer?.name }? This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className='grid grid-cols-2 gap-2 mt-4'>
                <button
                    className='border border-red-500 hover:border-red-600 text-red-500 rounded' 
                    onClick={ toggleModal }
                >
                    Cancel
                </button>
                <button
                    onClick={ handleDeletePlayer }
                    className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                    <Trash className="mr-2" /> Delete Player
                </button>
            </div>
        </PopUpModal>
    )
}

const AddModal = (
    { modalOpen, toggleModal, handleAddPlayer, formData, setFormData, errors, handleInputChange }:
    {
        toggleModal: () => void,
        modalOpen: boolean,
        handleAddPlayer: () => void,
        formData: FormData,
        setFormData: ( formData: FormData ) => void,
        errors: ErrorType,
        handleInputChange: ( e: React.ChangeEvent<HTMLInputElement> ) => void
    }
) => {
    const disabledOptions = () => {
        return !formData.name.trim() || !formData.position.trim();
    }
    return (
        <PopUpModal
            open={ modalOpen }
            onClose={ toggleModal }
        >
            <h3 className="text-xl lg:text-lg font-bold text-orange-500 mb-4">Add Player</h3>

            <div className='space-y-4 text-left mt-4'>
                {/* PlayerForm */}
                <PlayerForm 
                    formData={ formData }
                    setFormData={ setFormData }
                    errors={ errors }
                    handleInputChange={ handleInputChange }
                />

                {/* Buttons */}
                <div className='grid grid-cols-2 gap-2'>
                    <button
                        className='bg-red-500 hover:bg-red-600 text-white rounded' 
                        onClick={ toggleModal }
                    >
                        Cancel
                    </button>
                    <button
                        onClick={ handleAddPlayer }
                        className="w-full bg-orange-600 text-white p-3 rounded hover:bg-orange-700 transition-colors flex items-center justify-center disabled:opacity-50"
                        disabled={ disabledOptions() }
                    >
                        <User className="mr-2" /> Add Player
                    </button>
                </div>
            </div>
        </PopUpModal>
    )
}

const PlayerForm = (
    { formData, setFormData, errors, handleInputChange }:
    { formData: FormData, setFormData: ( formData: FormData ) => void, errors: ErrorType, handleInputChange: ( e: React.ChangeEvent<HTMLInputElement> ) => void }
) => {
        const positions = [ 
            'CB', 'LB', 'RB', 'WB', 'GK',
            'CMF', 'DMF', 'AMF',
            'LW', 'RW', 'ST'
        ]
    return (
        <div className="space-y-4">
            <div>
                <label className="block font-semibold mb-1.5">Player Name</label>
                <input
                    type="text"
                    name="name"
                    value={ formData.name }
                    onChange={ handleInputChange }
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter player name"
                />
                {
                    errors.name && (
                        <span className="text-sm text-red-500 mt-1">{errors.name}</span>
                    )
                }
            </div>

            <div>
                <label className="block font-semibold mb-1.5">Position</label>
                <select 
                    title='position'
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 cursor-pointer text-black"
                    value={ formData.position }
                    onChange={ 
                        (e) => setFormData({ 
                            ...formData, 
                            position: e.target.value 
                        }) 
                    }
                >
                    <option value="">Select Position</option>
                    {
                        positions.map( position => (
                            <option key={ position } value={ position }>{ position }</option>
                    ))}
                </select>
                {
                    errors.position && (
                        <span className="text-sm text-red-500 mt-1">{errors.position}</span>
                    )
                }
            </div>

            <div>
                <label className="block font-semibold mb-1.5">Jersey Number</label>
                <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black ${
                        errors.number ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter jersey number"
                />
                {
                    errors.number && (
                        <span className="text-sm text-red-500 mt-1">{errors.number}</span>
                    )
                }
            </div>
        </div>
    );
}

export default PlayerList