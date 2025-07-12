'use client'

import PopUpModal from '@/components/modal/PopUpModal'
import { Loader } from '@/components/ui/loader'
import { createTeam, deleteTeam, getAllDepartments, getAllFaculties, getAllTeams } from '@/lib/requests/v2/admin/super-admin/team/requests'
import { checkSuperAdminStatus } from '@/lib/requests/v2/authentication/requests'
import { CoachRoles, TeamTypes } from '@/utils/V2Utils/v2requestData.enums'
import { IV2FootballTeam } from '@/utils/V2Utils/v2requestData.types'
import { CalendarCheck, ChevronDown, ChevronUp, Plus, Save, Search, Trash, Trophy, Users, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type Faculty = {
    _id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
type Department = {
    _id: string;
    name: string;
    faculty: {
        _id: string;
        name: string;
    }
    createdAt: Date;
    updatedAt: Date;
}

type NewTeamFormData = {
    name: string;
    shorthand: string;
    type: TeamTypes;
    academicYear: string;
    department: string;
    faculty: string;
}

const SuperAdminTeamPage = () => {
    const router = useRouter();
    
    const [loading, setLoading] = useState<boolean>( true );
    const [query, setQuery] = useState<string>("");
    const [filter, setFilter] = useState<string>("all-types");
    const [teams, setTeams] = useState<IV2FootballTeam[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [filterOpen, setFilterOpen] = useState<boolean>( false );
    const [modalOpen, setModalOpen] = useState<boolean>( false );
    const [newTeamFormData, setNewTeamFormData] = useState<NewTeamFormData>({
        name: '',
        shorthand: '',
        type: TeamTypes.DEPARTMENT_LEVEL,
        academicYear: '',
        department: '',
        faculty: '',
    })

    // On Load //
    useEffect( () => {
        const fetchData = async () => {
            const request = await checkSuperAdminStatus();
            if( request?.code === '99' ) {
                if( request.message === 'Invalid or Expired Token' || request.message === 'Login Required' ) {
                toast.error('Please Login First')
                router.push('/auth/login')
                } else if ( request.message === 'Invalid User Permissions' ) {
                toast.error('Unauthorized')
                router.push('/sports');
                } else {
                toast.error('Unknown')
                router.push('/');
                }   
            }

            const teamData = await getAllTeams()
            const facultyData = await getAllFaculties();
            const departmentData = await getAllDepartments();

            if( teamData && teamData.data ) {
                setTeams( teamData.data );
            }
            if( facultyData && facultyData.data ) {
                setFaculties( facultyData.data );
            }
            if( departmentData && departmentData.data ) {
                setDepartments( departmentData.data );
            }
            
            setLoading( false );
        }

        if( loading ) fetchData();
    }, [ loading ]);
    
    if( loading ) {
        return <Loader />
    };
    // End of On Load //

    // Search Bar Handlers //
    const handleClear = () => {
        setQuery("");
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Search for:", query);
    };

    // Button Clicks //
    const handleTeamCreateButtonClick = () => {
        setModalOpen( true );
    }
    const handleTeamCreate = async () => {
        const response = await createTeam( newTeamFormData );
        if( response?.code === '99' ) {
            toast.error(response.message)
        } else if( response?.code === '00' ) {
            toast.success(response.message);
            setTeams([ ...teams, response.data ])
        } else {
            toast.error('Error Creating Faculty')
        }
        setModalOpen(false);
        setNewTeamFormData({
            name: '',
            shorthand: '',
            type: TeamTypes.DEPARTMENT_LEVEL,
            academicYear: '',
            department: '',
            faculty: '',
        })
    }
    const handleTeamDelete = async ( teamId: string ) => {
        const confirmed = window.confirm('Are you sure you want to delete this faculty?');
        
        if( confirmed ) {
            const response = await deleteTeam( teamId );
            if( response?.code === '99' ) {
                toast.error(response.message)
            } else if( response?.code === '00' ) {
                const filteredTeams = [...teams].filter(team => team._id !== teamId);
                toast.success(response.message);
                setTeams(filteredTeams);
            } else {
                toast.error('Error Deleting Faculty')
            }
        } else {
            toast.error('Action Cancelled');
        }
    }
    const handleFilterClick = ( type: string ) => {
        setFilter( type );
        setFilterOpen( false );
    }

    // Others //
    const filteredTeams = teams.filter( team => {
        if( filter === 'all-types' ) {
            return true
        } else {
            return team.type === filter
        }
    })
    const disabledButton = newTeamFormData.name === '' || newTeamFormData.shorthand === '' || newTeamFormData.academicYear === '' || ( ( newTeamFormData.type === TeamTypes.FACULTY_GENERAL || newTeamFormData.type.includes('department') ) && newTeamFormData.faculty === '' ) || ( newTeamFormData.type.includes('department')   && newTeamFormData.department === '')
  return (
    <div className='space-y-6 md:space-y-4'>
        {/* Header */}
        <div className=' flex items-center justify-between md:px-4 md:py-4 md:border md:rounded-lg'>
            <div>
                <h1 className='text-2xl font-bold'>Team Management</h1>
                <p>Manage all teams, players and assignments in the system</p>
            </div>
            <button
                onClick={ handleTeamCreateButtonClick }
                className='px-4 py-2 text-center rounded-lg bg-emerald-500 md:flex gap-2 items-center hover:bg-emerald-500/50 hidden'
            >
                <Plus className='w-5 h-5' />
                Create Team
            </button>
        </div>

        {/* Search bar */}
        <div className='grid grid-cols-2 md:grid-cols-12 gap-4'>
            <form
                onSubmit={handleSubmit}
                className="flex items-center w-full px-4 py-2 border shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 col-span-2 md:col-span-9 rounded-md"
            >
                <Search className="w-5 h-5 text-muted-foreground mr-2" />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search teams..."
                    className="flex-grow outline-none text-sm placeholder-muted-foreground bg-transparent"
                />

                {query && (
                    <button
                    type="button"
                    onClick={handleClear}
                    className="text-gray-400 hover:text-gray-600"
                    >
                    <X className="w-4 h-4" />
                    </button>
                )}
            </form>
            <div
                onClick={ () => setFilterOpen(!filterOpen) } 
                className='px-4 py-2 border border-emerald-500 flex justify-between items-center rounded-lg col-span-1 md:col-span-3 cursor-pointer capitalize'
            >
                { filter.replace('-', ' ') }
                { !filterOpen && <ChevronDown className='w-4 h-4 text-green-500' /> }
                { filterOpen && <ChevronUp className='w-4 h-4 text-green-500' /> }
            </div>
            <button
                onClick={ handleTeamCreateButtonClick }
                className='px-4 py-2 text-center rounded-lg bg-emerald-500 flex gap-2 items-center justify-center hover:bg-emerald-500/50 md:hidden col-span-1'
            >
                <Plus className='w-5 h-5' />
                Create Team
            </button>
            {
                filterOpen && (
                    <>
                        <div className='hidden md:block md:col-span-9'></div>
                        <div className='col-span-2 md:col-span-3'>
                            {
                                ['all-types', ...Object.values( TeamTypes )].map( type => (
                                    <p 
                                        key={type}
                                        onClick={ () => handleFilterClick( type ) }
                                        className={`
                                            px-4 py-1 my-2 cursor-pointer hover:text-green-500 ${
                                                filter === type && 'text-green-500'
                                            }
                                        `}
                                    >
                                        { type }
                                    </p>
                                ))
                            }
                        </div>                    
                    </>
                )
            }
        </div>

        {
            filteredTeams && filteredTeams.length > 0
                ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {/* Team List */}
                        {
                            filteredTeams.map( team => (
                                <div 
                                    key={ team._id }
                                    className='border border-emerald-500 rounded-lg p-4'
                                >
                                    <div className='pb-4 border-b border-muted-foreground'>
                                        <div className='flex justify-between items-center'>
                                            <div className='flex gap-2 items-center'>
                                                <div className='w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold'>{ team.name.slice(0,1) }</div>
                                                <div>
                                                    <p className='font-bold'>{ team.name }</p>
                                                    <span className='text-muted-foreground'>{ team.department?.name || 'Unknown' }</span>
                                                </div>
                                            </div>
                                            <p>...</p>
                                        </div>
                                        <p className='mt-2'>Admin: { team.admin.name }</p>
                                    </div>
                                    <div className='pt-4'>
                                        <div className='grid grid-cols-3 gap-4'>
                                            <div className='text-center flex flex-col items-center gap-1'>
                                                <Users className='w-6 h-6 text-emerald-500' />
                                                <p className='font-bold'>{ team.players.length }</p>
                                                <span>Players</span>
                                            </div>
                                            <div className='text-center flex flex-col items-center gap-1'>
                                                <Trophy className='w-6 h-6 text-emerald-500' />
                                                <p className='font-bold'>{ team.stats.wins }</p>
                                                <span>Wins</span>
                                            </div>
                                            <div className='text-center flex flex-col items-center gap-1'>
                                                <CalendarCheck className='w-6 h-6 text-emerald-500' />
                                                <p className='font-bold'>{ team.stats.matchesPlayed }</p>
                                                <span>Fixtures</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-2 mt-4'>
                                        <Link href={`/teams/${ team._id }`} className='w-full py-2 border hover:border-muted-foreground text-center rounded-lg col-span-5'>View Team</Link>
                                        <Link href={`teams/${ team._id }`} className='w-full py-2 bg-emerald-500 hover:bg-emerald-500/50 text-center rounded-lg col-span-5'>Manage</Link>
                                        <button
                                            onClick={ () => handleTeamDelete( team._id ) }
                                            className='flex items-center justify-center py-2 col-span-2 border border-muted-foreground hover:border-muted rounded-lg'
                                        >
                                            <Trash className='w-5 h-5 text-red-500' />
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ) : (
                    <div className='border border-emerald-500 rounded-lg flex justify-center items-center flex-col gap-4 py-10'>
                        {/* No Teams */}
                        <Users className='w-8 h-8' />
                        <p className='font-bold'>No Teams Found</p>
                        <span className='text-sm text-muted-foreground'>Get started by creating your first team</span>
                        <button
                            onClick={ handleTeamCreateButtonClick }
                            className='px-4 py-2 text-center rounded-lg bg-emerald-500 md:flex gap-2 items-center hover:bg-emerald-500/50 hidden'
                        >
                            <Plus className='w-5 h-5' />
                            Create Team
                        </button>
                    </div>
                )
        }

        {/* PopUp Modal */}
        <div>
            <PopUpModal open={ modalOpen } onClose={ () => setModalOpen( false ) }>
                <h2 className='text-lg font-bold mb-6'>Create New Team</h2>
                <div className='space-y-4 text-left'>
                    <div>
                        <label className="block font-semibold mb-1.5">Team Name</label>
                        <input
                            type='text'
                            placeholder='e.g. Computer Science 2024/2025'
                            value={ newTeamFormData.name }
                            onChange={
                                ( e ) => setNewTeamFormData({
                                    ...newTeamFormData,
                                    name: e.target.value
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1.5">Shorthand</label>
                        <input
                            type='text'
                            placeholder='e.g. CSC24/25'
                            value={ newTeamFormData.shorthand }
                            onChange={
                                ( e ) => setNewTeamFormData({
                                    ...newTeamFormData,
                                    shorthand: e.target.value
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1.5">Academic Year</label>
                        <input
                            type='text'
                            placeholder='e.g. 2024/2025'
                            value={ newTeamFormData.academicYear }
                            onChange={
                                ( e ) => setNewTeamFormData({
                                    ...newTeamFormData,
                                    academicYear: e.target.value
                                })
                            }
                            className='w-full p-2 border rounded bg-input'
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1.5">Team Type</label>
                        <select 
                            className="w-full p-2 border rounded cursor-pointer bg-input"
                            value={ newTeamFormData.type }
                            onChange={ (e) => setNewTeamFormData({ 
                                ...newTeamFormData,
                                department: '',
                                faculty: '',
                                type: e.target.value as TeamTypes
                            }) }
                        >
                            {
                                Object.values( TeamTypes ).map( type => (
                                    <option key={ type } value={ type }>{ type }</option>
                                ))
                            }
                        </select>
                    </div>
                    { 
                        faculties && ( newTeamFormData.type === TeamTypes.FACULTY_GENERAL || newTeamFormData.type.includes('department') ) && (
                            <div>
                                <label className="block font-semibold mb-1.5">Faculty</label>
                                <select 
                                    className="w-full p-2 border rounded cursor-pointer bg-input"
                                    value={ newTeamFormData.faculty }
                                    onChange={ (e) => setNewTeamFormData({ 
                                        ...newTeamFormData, 
                                        faculty: e.target.value
                                    }) }
                                >
                                    <option value={''}>Select a faculty</option>
                                    {
                                        faculties.map( faculty => (
                                            <option key={ faculty._id } value={ faculty._id }>{ faculty.name }</option>
                                        ))
                                    }
                                </select>
                            </div>
                        ) 
                    }
                    { 
                        departments && newTeamFormData.type.includes('department') && (
                            <div>
                                <label className="block font-semibold mb-1.5">Department</label>
                                <select 
                                    className="w-full p-2 border rounded cursor-pointer bg-input"
                                    value={ newTeamFormData.department }
                                    onChange={ (e) => setNewTeamFormData({ 
                                        ...newTeamFormData, 
                                        department: e.target.value
                                    }) }
                                >
                                    <option value={''}>Select a department</option>
                                    {
                                        departments.filter(dept => dept.faculty._id === newTeamFormData.faculty).map( dept => (
                                            <option key={ dept._id } value={ dept._id }>{ dept.name }</option>
                                        ))
                                    }
                                </select>
                            </div>
                        ) 
                    }
                    <button 
                        onClick={handleTeamCreate}
                        className='py-2 rounded-lg flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-500/50 text-white w-full disabled:opacity-50 disabled:line-through'
                        disabled={ disabledButton }
                    >
                        <Save className='w-5 h-5' />
                        Create Team
                    </button>
                </div>
            </PopUpModal>
        </div>
    </div>
  )
}

export default SuperAdminTeamPage