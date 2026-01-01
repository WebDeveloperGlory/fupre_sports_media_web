'use client'

import React, { use, useEffect, useState } from 'react';
import useAuthStore from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/ui/back-button'
import { Competition, CompetitionAdminCreateFixtureRequestBody, Fixture } from '@/utils/requestDataTypes';
import { toast } from 'react-toastify';
import { createCompetitionFixture, getAdminCompetitionDetails, getAdminCompetitionFixtures } from '@/lib/requests/v1/adminPage/requests';
import { format } from 'date-fns';
import Link from 'next/link';
import { Team } from '@/utils/stateTypes';
import { Calendar, Clock, LocateIcon, Plus, Trophy, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import PopUpModal from '@/components/modal/PopUpModal';

const getStatusColor = ( status: string ) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'ongoing':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
};

const initialFormState: CompetitionAdminCreateFixtureRequestBody = {
    homeTeam: '',
    awayTeam: '',
    date: '',
    referee: '',
    stadium: '',
    round: ''
}

const CompetitionAdminFixturesPage = ({ 
    params 
  }: { 
    params: Promise<{ id: string }> 
  }) => {
    const resolvedParams = use(params);
    const router = useRouter();

    const { jwt } = useAuthStore();

    const [ loading, setLoading ] = useState<boolean>( true );
    const [ modalOpen, setModalOpen ] = useState<boolean>( false );
    const [ fixtures, setFixtures ] = useState<Fixture[] | null>( null );
    const [ competition, setCompetition ] = useState<Competition | null>( null );
    const [ teams, setTeams ] = useState<Team[] | null>( null );
    const [ rounds, setRounds ] = useState<string[] | null>( null );
    const [ fixturesFilter, setFixturesFilter ] = useState<string>( 'all' );
    const [ formData, setFormData ] = useState<CompetitionAdminCreateFixtureRequestBody>({ ...initialFormState });
  
    useEffect( () => {
        const fetchData = async () => {
            const data = await getAdminCompetitionFixtures( jwt!, resolvedParams.id );
            if( data && data.data ) {
                setFixtures( data.data.fixtures );
                setTeams( data.data.teams );
                setRounds( data.data.rounds );
                setCompetition( data.data.currentCompetition );
            }
            console.log({ data });
            setLoading( false );
        }

        if( !jwt ) {
            toast.error('Please Login First');
            setTimeout(() => router.push( '/admin' ), 1000);
        } else {
            if( loading ) fetchData();
        }
    }, [ loading, resolvedParams.id ]);

    const filteredFixtures = fixtures ? fixtures.filter( fixture => {
        if ( fixturesFilter === 'upcoming' ) return fixture.status === 'upcoming';
        if ( fixturesFilter === 'completed' ) return fixture.status === 'completed';
        if ( fixturesFilter === 'live' ) return fixture.status === 'live';
        return true; // 'all' tab
    }) : null;
    const toogleModal = () => {
        setModalOpen( !modalOpen );
    }
    const handleFixtureCreate = async () => {
        const homeId = teams?.find( t => t.name === formData.homeTeam )?._id;
        const awayId = teams?.find( t => t.name === formData.awayTeam )?._id;

        const fixture = {
            homeTeam: homeId,
            awayTeam: awayId,
            date: formData.date, 
            stadium: formData.stadium,
            referee: formData.referee, 
            round: formData.round
        }

        const data = await createCompetitionFixture( jwt!, resolvedParams.id, fixture )
        if( data && data.code === '00' ) {
            toast.success( data.message );
            setFormData({ ...initialFormState });
            setModalOpen( false );
            setTimeout( () => setLoading( true ), 1000 );
        } else {
            toast.error( data?.message );
        }
    }
  return (
    <div>
        {/* Back Button */}
        <div className="fixed top-6 left-4 md:left-8 z-10">
            <BackButton />
        </div>
        <div className='pt-12 md:pt-0'>
            {/* Title */}
            <div className="flex items-center justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar size={16} />
                        Fixtures
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage Competition Fixtures</p>
                </div>
                
                <button
                    onClick={ toogleModal }
                    className='bg-popover border border-border px-4 py-2 rounded-sm flex items-center justify-center gap-2 hover:shadow-md transition-shadow'
                >
                    <Plus className='w-5 h-5' />
                    New Fixture
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border mb-4 md:mb-6 mt-2">
                {
                    [ 'all', 'live', 'upcoming', 'completed' ].map( ( str ) => (
                        <button
                            key={ str }
                            onClick={ () => setFixturesFilter( str ) }
                            className={cn(
                                "px-4 py-2 text-sm font-medium transition-colors capitalize",
                                fixturesFilter === str
                                ? "text-emerald-500 border-b-2 border-emerald-500"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            { str }
                        </button>
                    ))
                }
            </div>

            {/* Fixtures List */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {
                    filteredFixtures && filteredFixtures.map( ( fixture ) => {
                        const formattedDate = fixture ? format( fixture.date, "yyyy-MM-dd HH:mm" ) : null;
                        const date = formattedDate ? formattedDate.split(' ')[ 0 ] : null;
                        const time = formattedDate ? formattedDate.split(' ')[ 1 ] : null;

                        return (
                            <div
                                key={ fixture._id } 
                                className='w-full border border-border bg-popover rounded-lg p-6 md:p-8'
                            >
                                <div className="flex justify-between items-center">
                                    <span className='rounded-md px-4 py-1 bg-muted text-sm '>{ fixture.competition?.name || 'Friendly' }</span>
                                    <span className={`text-sm rounded-md px-3 py-1 ${ getStatusColor( fixture.status ) } text-white`}>{ fixture.status }</span>
                                </div>

                                <div className='mt-6 space-y-2'>
                                    <div className="flex justify-between items-center">
                                        <div className="text-xl font-semibold">
                                            { fixture.homeTeam.name } vs { fixture.awayTeam.name }
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            { date }
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            { time }
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            { fixture.referee || 'Unknown' }
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <LocateIcon className="w-4 h-4" />
                                            { fixture.stadium }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    !filteredFixtures || filteredFixtures.length === 0 && (
                        <p>No Fixtures For Selected Filter</p>
                    )
                }
            </div>
        </div>

        {/* Modal */}
        <NewFixtureModal
            toogleModal={ toogleModal }
            modalOpen={ modalOpen }
            currentCompetition={ competition }
            formData={ formData }
            setFormData={ setFormData }
            currentRounds={ rounds }
            currentTeams={ teams }
            handleFixtureCreate={ handleFixtureCreate }
        />
    </div>
  )
}

const NewFixtureModal = (
    { toogleModal, modalOpen, currentCompetition, formData, setFormData, currentTeams, currentRounds, handleFixtureCreate }: 
    { 
        toogleModal: () => void, setFormData: ( data: CompetitionAdminCreateFixtureRequestBody ) => void,
        modalOpen: boolean, 
        currentCompetition: Competition | null, formData: CompetitionAdminCreateFixtureRequestBody,
        currentTeams: Team[] | null, currentRounds: string[] | null,
        handleFixtureCreate: () => void,
    }
) => {
    const disabledOptions = (): boolean => formData.homeTeam === '' || formData.awayTeam === '' || formData.date === '' || formData.homeTeam === formData.awayTeam;

    return (
        <PopUpModal
            onClose={ toogleModal }
            open={ modalOpen }
        >
            <h3 className="text-xl lg:text-lg font-bold text-orange-500 mb-4">Create Fixture</h3>

            <div className='space-y-4 text-left mt-4'>
                {/* Competition */}
                <div className='space-y-1.5'>
                    <h4 className='font-bold text-lg lg:text-base'>Competition</h4>
                    <p className='italic'>{ currentCompetition?.name || "Friendly" }</p>
                </div>

                <div className='grid grid-cols-2 items-center gap-4'>
                    {/* Home Team */}
                    <div>
                        <label className="block font-semibold mb-1.5">Home Team</label>
                        <select 
                            title='home'
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 cursor-pointer text-black"
                            value={ formData.homeTeam }
                            onChange={ (e) => setFormData({ 
                                ...formData, 
                                homeTeam: e.target.value 
                            }) }
                        >
                            <option value="" className='cursor-pointer'>Select Home Team</option>
                            {
                                currentTeams && currentTeams.map( team => (
                                    <option key={ team._id } value={ team.name }>{ team.name }</option>
                                ))
                            }
                        </select>
                        { ( ( formData.homeTeam !== '' ) && ( formData.homeTeam === formData.awayTeam ) ) && <p className='text-red-500 text-sm'>Home and Away Team Cannot Be The Same</p> }
                    </div>
                        
                    {/* Away Team */}
                    <div>
                        <label className="block font-semibold mb-1.5">Away Team</label>
                        <select 
                            title='away'
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 cursor-pointer text-black"
                            value={ formData.awayTeam }
                            onChange={ 
                                (e) => setFormData({ 
                                    ...formData, 
                                    awayTeam: e.target.value 
                                }) 
                            }
                        >
                            <option value="">Select Away Team</option>
                            {
                                currentTeams && currentTeams.filter( t => t.name !== formData.homeTeam ).map( team => (
                                    <option key={ team._id } value={ team.name }>{ team.name }</option>
                            ))}
                        </select>
                        { ( ( formData.awayTeam !== '' ) && ( formData.homeTeam === formData.awayTeam ) ) && <p className='text-red-500 text-sm'>Home and Away Team Cannot Be The Same</p> }
                    </div>

                    {/* Date Time */}
                    <div className="space-y-2">
                        <label className="block font-semibold">Match Date & Time</label>
                        <input 
                            placeholder=''
                            title='date'
                            type="datetime-local" 
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
                            value={ formData.date }
                            onChange={
                                (e) => setFormData({ 
                                    ...formData, 
                                    date: e.target.value 
                                })
                            }
                        />
                    </div>

                    {/* Round */}
                    <div>
                        <label className="block font-semibold mb-1.5">Round</label>
                        <select 
                            title='round'
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 cursor-pointer text-black"
                            value={ formData.round }
                            onChange={ 
                                (e) => setFormData({ 
                                    ...formData, 
                                    round: e.target.value 
                                }) 
                            }
                        >
                            <option value="">Select Round</option>
                            {
                                currentRounds && currentRounds.map( round => (
                                    <option key={ round } value={ round }>{ round }</option>
                            ))}
                        </select>
                    </div>

                    {/* Referee */}
                    <div>
                        <label className="block font-semibold mb-1.5">Referee</label>
                        <input
                            placeholder='John'
                            type='text'
                            value={ formData.referee }
                            onChange={
                                ( e ) => setFormData({
                                    ...formData,
                                    referee: e.target.value
                                })
                            }
                            className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black'
                        />
                    </div>
                    
                    {/* Venue */}
                    <div>
                        <label className="block font-semibold mb-1.5">Venue</label>
                        <input
                            placeholder='Stade et Fupre'
                            type='text'
                            value={ formData.stadium }
                            onChange={
                                ( e ) => setFormData({
                                    ...formData,
                                    stadium: e.target.value
                                })
                            }
                            className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black'
                        />
                    </div>
                </div>

                <button
                    onClick={ handleFixtureCreate }
                    className="w-full bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center disabled:opacity-50"
                    disabled={ disabledOptions() }
                >
                    <Trophy className="mr-2" /> Create Fixture
                </button>
            </div>
        </PopUpModal>
    )
}

export default CompetitionAdminFixturesPage