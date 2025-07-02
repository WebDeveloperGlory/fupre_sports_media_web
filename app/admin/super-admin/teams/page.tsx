'use client'

import PopUpModal from '@/components/modal/PopUpModal'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'
import { CoachRoles, TeamTypes } from '@/utils/V2Utils/v2requestData.enums'
import { IV2FootballTeam } from '@/utils/V2Utils/v2requestData.types'
import { CalendarCheck, ChevronDown, ChevronUp, Plus, Search, Trash, Trophy, Users, X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const sampleTeamsArr: IV2FootballTeam[] = [
    {
    _id: 'team1',
    name: 'Computer Science 100L',
    shorthand: 'CS100L',
    type: TeamTypes.DEPARTMENT_LEVEL,
    academicYear: '2024/2025',
    department: { _id: 'dept1', name: 'Computer Science' },
    coaches: [
      { name: 'Coach Ayo', role: CoachRoles.HEAD },
      { name: 'Coach Lara', role: CoachRoles.FITNESS },
    ],
    players: ['player1', 'player2', 'player3'],
    friendlyRequests: [],
    competitionPerformance: [],
    stats: {
      matchesPlayed: 10,
      wins: 6,
      draws: 2,
      losses: 2,
      goalsFor: 18,
      goalsAgainst: 10,
      cleanSheets: 3,
    },
    logo: 'https://example.com/logos/cs100l.png',
    colors: { primary: '#1E3A8A', secondary: '#3B82F6' },
    admin: { _id: 'admin1', name: 'John Doe', email: 'john@example.com' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'team2',
    name: 'Engineering Faculty',
    shorthand: 'ENG',
    type: TeamTypes.FACULTY_GENERAL,
    academicYear: '2024/2025',
    faculty: { _id: 'faculty1', name: 'Engineering' },
    coaches: [
      { name: 'Coach Emeka', role: CoachRoles.HEAD },
    ],
    players: ['player4', 'player5'],
    friendlyRequests: [
      {
        requestId: 'fr1',
        team: 'team1',
        status: 'pending',
        proposedDate: new Date('2025-07-01'),
        message: 'Let’s play a friendly match.',
        type: 'recieved',
        createdAt: new Date(),
      },
    ],
    competitionPerformance: [],
    stats: {
      matchesPlayed: 5,
      wins: 2,
      draws: 1,
      losses: 2,
      goalsFor: 7,
      goalsAgainst: 9,
      cleanSheets: 1,
    },
    logo: 'https://example.com/logos/eng.png',
    colors: { primary: '#047857', secondary: '#10B981' },
    admin: { _id: 'admin2', name: 'Chinedu Okafor', email: 'chinedu@school.edu' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'team3',
    name: 'University FC',
    shorthand: 'UFC',
    type: TeamTypes.SCHOOL_GENERAL,
    academicYear: '2024/2025',
    coaches: [
      { name: 'Coach Tina', role: CoachRoles.HEAD },
      { name: 'Coach Mike', role: CoachRoles.ASSISTANT },
    ],
    players: ['player6', 'player7', 'player8', 'player9'],
    friendlyRequests: [],
    competitionPerformance: [
      {
        competition: 'Inter-University League',
        season: '2024',
        stats: {
          played: 12,
          wins: 8,
          draws: 2,
          losses: 2,
          goalsFor: 22,
          goalsAgainst: 11,
          cleanSheets: 5,
        },
        achievements: ['Semi-Finalist'],
      },
    ],
    stats: {
      matchesPlayed: 12,
      wins: 8,
      draws: 2,
      losses: 2,
      goalsFor: 22,
      goalsAgainst: 11,
      cleanSheets: 5,
    },
    logo: 'https://example.com/logos/ufc.png',
    colors: { primary: '#DC2626', secondary: '#F87171' },
    admin: { _id: 'admin3', name: 'Ngozi Bello', email: 'ngozi@uni.edu' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'team4',
    name: 'Science Club FC',
    shorthand: 'SCFC',
    type: TeamTypes.CLUB,
    academicYear: '2024/2025',
    department: { _id: 'dept2', name: 'Biochemistry' },
    coaches: [{ name: 'Coach Salisu', role: CoachRoles.GOALKEEPING }],
    players: ['player10', 'player11'],
    friendlyRequests: [],
    competitionPerformance: [],
    stats: {
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      cleanSheets: 0,
    },
    logo: 'https://example.com/logos/scfc.png',
    colors: { primary: '#4B5563', secondary: '#9CA3AF' },
    admin: { _id: 'admin4', name: 'Fatima Yusuf', email: 'fatima@school.edu' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'team5',
    name: 'CS Department',
    shorthand: 'CSDept',
    type: TeamTypes.DEPARTMENT_GENERAL,
    academicYear: '2024/2025',
    department: { _id: 'dept1', name: 'Computer Science' },
    coaches: [
      { name: 'Coach Kelvin', role: CoachRoles.HEAD },
    ],
    players: ['player12', 'player13', 'player14'],
    friendlyRequests: [],
    competitionPerformance: [
      {
        competition: 'Faculty Cup',
        season: '2024',
        stats: {
          played: 6,
          wins: 4,
          draws: 1,
          losses: 1,
          goalsFor: 13,
          goalsAgainst: 5,
          cleanSheets: 3,
        },
        achievements: ['Finalist'],
      },
    ],
    stats: {
      matchesPlayed: 6,
      wins: 4,
      draws: 1,
      losses: 1,
      goalsFor: 13,
      goalsAgainst: 5,
      cleanSheets: 3,
    },
    logo: 'https://example.com/logos/csdept.png',
    colors: { primary: '#6D28D9', secondary: '#A78BFA' },
    admin: { _id: 'admin5', name: 'Aliyu Musa', email: 'aliyu@school.edu' },
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]
const sampleDepartments = [
    { _id: 'comp1223', name: 'Computer Science' },
    { _id: 'elec1323', name: 'Electrical/Electronics Engineering' },
    { _id: 'comp1323', name: 'Computer Engineering' },
]
const sampleFaculties = [
    { _id: 'comp13', name: 'College of Computing' },
    { _id: 'elec12', name: 'College of Engineering' },
]

type NewTeamFormData = {
    name: string;
    shorthand: string;
    type: TeamTypes;
    academicYear: string;
    department: string;
    faculty: string;
}

const SuperAdminTeamPage = () => {
    const [loading, setLoading] = useState<boolean>( true );
    const [query, setQuery] = useState<string>("");
    const [filter, setFilter] = useState<string>("all-types");
    const [teams, setTeams] = useState<IV2FootballTeam[]>( sampleTeamsArr );
    const [faculties, setFaculties] = useState<{_id: string, name: string}[]>([]);
    const [departments, setDepartments] = useState<{_id: string, name: string}[]>([]);
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
            setTimeout(() => {
                setTeams( sampleTeamsArr );
                setFaculties( sampleFaculties );
                setDepartments( sampleDepartments );

                setLoading( false );
            }, 2000);
        }

        if( loading ) fetchData();

        // if( !jwt ) {
        //     toast.error('Please Login First');
        //     setTimeout(() => router.push( '/admin' ), 1000);
        // } else {
        //     if( loading ) fetchData();
        // }
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
    const handleTeamDelete = () => {

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
                                            onClick={ handleTeamDelete }
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
                                        departments.map( dept => (
                                            <option key={ dept._id } value={ dept._id }>{ dept.name }</option>
                                        ))
                                    }
                                </select>
                            </div>
                        ) 
                    }
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
                </div>
            </PopUpModal>
        </div>
    </div>
  )
}

export default SuperAdminTeamPage