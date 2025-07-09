'use client'

import PopUpModal from '@/components/modal/PopUpModal';
import { Loader } from '@/components/ui/loader';
import { AllTodayFix } from '@/utils/V2Utils/getRequests';
import { CompetitionType, FixtureStatus } from '@/utils/V2Utils/v2requestData.enums';
import { Activity, Calendar, ChevronDown, ChevronUp, Clock, MapPin, PlayIcon, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'

const sampleFixtures: AllTodayFix[] = [
  {
    _id: '123wkndkz',
    homeTeam: {
      _id: '64fc1234567890abcdef1234',
      name: 'Eagle FC',
      shorthand: 'EAG',
      logo: 'https://example.com/logos/eagle.png'
    },
    awayTeam: {
      _id: '64fc1234567890abcdef5678',
      name: 'Lion Stars',
      shorthand: 'LNS',
      logo: 'https://example.com/logos/lionstars.png'
    },
    competition: {
      _id: '64fc1234567890abcdef9999',
      name: 'University Super League',
      shorthand: 'USL',
      type: CompetitionType.LEAGUE,
    },
    scheduledDate: new Date('2025-07-04T14:00:00Z'),
    rescheduledDate: null,
    status: FixtureStatus.SCHEDULED,
    stadium: 'Stade et Fupre'
  },
  {
    _id: 'asjnadkmsa',
    homeTeam: {
      _id: '64fcabcdef1234567890abcd1',
      name: 'Sharks United',
      shorthand: 'SHU',
      logo: 'https://example.com/logos/sharks.png'
    },
    awayTeam: {
      _id: '64fcabcdef1234567890abcd2',
      name: 'Falcons FC',
      shorthand: 'FFC',
      logo: 'https://example.com/logos/falcons.png'
    },
    competition: {
      _id: '64fcabcdef1234567890abcd9',
      name: 'Campus Champions Cup',
      shorthand: 'CCC',
      type: CompetitionType.KNOCKOUT,
    },
    scheduledDate: new Date('2025-07-04T16:30:00Z'),
    rescheduledDate: null,
    status: FixtureStatus.LIVE,
    stadium: 'Stade et Fupre'
  },
  {
    _id: 'njansmaa',
    homeTeam: {
      _id: '64fcabcdef1234567890abce1',
      name: 'Panther FC',
      shorthand: 'PFC',
      logo: 'https://example.com/logos/panther.png'
    },
    awayTeam: {
      _id: '64fcabcdef1234567890abce2',
      name: 'Tigers Academy',
      shorthand: 'TGA',
      logo: 'https://example.com/logos/tigers.png'
    },
    competition: {
      _id: '64fcabcdef1234567890abce9',
      name: 'Student Premier League',
      shorthand: 'SPL',
      type: CompetitionType.LEAGUE,
    },
    scheduledDate: new Date('2025-06-30T15:00:00Z'), // original
    rescheduledDate: new Date('2025-07-04T18:00:00Z'), // today
    status: FixtureStatus.POSTPONED,
    stadium: 'Stade et Fupre'
  }
];

const sampleLiveAdmins = [
  { _id: '123455', name: 'Live Admin 1', email: 'libeadmin1@gmail.com' },
  { _id: '123456', name: 'Live Admin 3', email: 'libeadmin1@gmail.com' },
  { _id: '123457', name: 'Live Admin 5', email: 'libeadmin5@gmail.com' },
  { _id: '123458', name: 'Sports Account', email: 'sportsadmin5@fupre.edu.ng' },
]

type Admin = {
  _id: string;
  name: string;
  email: string;
  role?: string;
}
const LiveFixturesPage = () => {
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>( true );
    const [fixtures, setFixtures] = useState<AllTodayFix[]>([]);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [selectedFixture, setSelectedFixture] = useState<AllTodayFix | null>( null )
    const [query, setQuery] = useState<string>("");
    const [filter, setFilter] = useState<string>("all-status");
    const [filterOpen, setFilterOpen] = useState<boolean>( false );
    const [modalOpen, setModalOpen] = useState<boolean>( false );

    // On Load //
    useEffect( () => {
      const fetchData = async () => {
        setTimeout(() => {
          setFixtures( sampleFixtures as AllTodayFix[] );
          setAdmins( sampleLiveAdmins );
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

    // Search Bar And Filters Handlers //
    const handleClear = () => {
      setQuery("");
    };
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Search for:", query);
    };
    const handleFilterClick = ( type: string ) => {
      setFilter( type );
      setFilterOpen( false );
    }
    // End Of Search Bar And Filters Handlers //

    // Other Button Handler //
    const handleFixtureButtonClick = ( fixture: AllTodayFix ) => {      
      if( fixture.status === 'live' ) {
        router.push(`live-management/${ fixture._id }`)
      } else {
        setModalOpen( true );
      }
      setSelectedFixture( fixture );
    }
    // End of Other Button Handlers //

    const filteredFixtures = fixtures.filter( fixture => {
        if( filter === 'all-status' ) {
            return true
        } else {
            return fixture.status === filter
        }
    })
  return (
    <div className='space-y-6 md:space-y-4'>
      {/* Header */}
      <div className=' flex items-center justify-between md:px-4 md:py-4 md:border md:rounded-lg'>
        <div>
            <h1 className='text-2xl font-bold'>Live Fixtures Management</h1>
            <p>Manage and initiate live coverage for today's fixtures</p>
        </div>
        <p className='text-sm px-4 py-2 rounded-full border hidden md:block border-emerald-500'>{ new Date().toLocaleDateString() }</p>
      </div>

      {/* Stat Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='flex items-center justify-center py-6 flex-col border border-muted-foreground bg-card rounded-lg'>
          <p className='text-xl font-bold'>{ fixtures.filter( fixture => fixture.status === 'live' ).length }</p>
          <p className='text-muted-foreground'>Live Now</p>
        </div>
        <div className='flex items-center justify-center py-6 flex-col border border-muted-foreground bg-card rounded-lg'>
          <p className='text-xl font-bold'>{ fixtures.filter( fixture => fixture.status === 'scheduled' ).length }</p>
          <p className='text-muted-foreground'>Upcoming</p>
        </div>
        <div className='flex items-center justify-center py-6 flex-col border border-muted-foreground bg-card rounded-lg'>
          <p className='text-xl font-bold'>{ fixtures.filter( fixture => fixture.status === 'postponed' ).length }</p>
          <p className='text-muted-foreground'>Postponed To Today</p>
        </div>
        <div className='flex items-center justify-center py-6 flex-col border border-muted-foreground bg-card rounded-lg'>
          <p className='text-xl font-bold'>{ admins.length }</p>
          <p className='text-muted-foreground'>Available Admins</p>
        </div>
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
            placeholder="Search fixtures..."
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
          className='px-4 py-2 border border-muted-foreground bg-card flex justify-between items-center rounded-lg col-span-1 md:col-span-3 cursor-pointer capitalize'
        >
          { filter.replace('-', ' ') }
          { !filterOpen && <ChevronDown className='w-4 h-4 text-muted-foreground' /> }
          { filterOpen && <ChevronUp className='w-4 h-4 text-muted-foreground' /> }
        </div>
        {
          filterOpen && (
            <>
              <div className='hidden md:block md:col-span-9'></div>
              <div className='col-span-2 md:col-span-3'>
                {
                  ['all-status', 'scheduled', 'live', 'postponed'].map( type => (
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

      {/* Fixtures List */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {
          filteredFixtures.map( fixture => (
            <div
              key={ fixture._id }
              className='border border-muted-foreground p-4 rounded-lg space-y-4 bg-card'
            >
              {/* Top */}
              <div className='w-full flex justify-end'>
                <p className='px-4 py-1 uppercase text-sm border border-muted-foreground bg-card rounded-full'>{ fixture.status }</p>
              </div>
              {/* Teams */}
              <div className='grid grid-cols-12 gap-2'>
                <div className='col-span-5'>
                  <p>{ fixture.homeTeam.name }</p>
                  <p className='uppercase text-sm text-muted-foreground'>{ fixture.homeTeam.shorthand }</p>
                </div>
                <div className='col-span-2 text-center'>
                  <p className='text-sm text-muted-foreground'>vs</p>
                </div>
                <div className='col-span-5 text-right'>
                  <p>{ fixture.homeTeam.name }</p>
                  <p className='uppercase text-sm text-muted-foreground'>{ fixture.homeTeam.shorthand }</p>
                </div>
              </div>
              {/* Info */}
              <div className='text-sm'>
                <div className='flex justify-between items-center'>
                  <p className='flex gap-1 items-center'>
                    <Calendar className='w-3 h-3' />
                    { fixture.status === 'postponed' ? fixture.rescheduledDate!.toLocaleTimeString() : fixture.scheduledDate.toLocaleTimeString() }
                  </p>
                  <p className='flex gap-1 items-center'>
                    <Clock className='w-3 h-3' />
                    About To Start
                  </p>
                </div>
                <div className='flex justify-between items-center'>
                  <p className='flex gap-1 items-center'>
                    <MapPin className='w-3 h-3' />
                    { fixture.stadium || 'Unknown' }
                  </p>
                  <p className='flex gap-1 items-center'>
                    { fixture.competition.name }
                  </p>
                </div>
              </div>
              {/* Button */}
              <button
                onClick={() => handleFixtureButtonClick( fixture )}
                className={`
                  text-center w-full py-2 text-white font-bold flex gap-2 items-center justify-center capitalize rounded-lg transition-colors ${
                    fixture.status === 'live'
                      ? 'bg-emerald-500 hover:bg-emerald-500/50'
                      : 'bg-blue-500 hover:bg-blue-500/50'
                  }
                `}
              >
                { fixture.status === 'live' ? <Activity className='w-4 h-4' /> : <PlayIcon className='w-4 h-4' /> }
                { fixture.status === 'live' ? 'manage live' : 'initiate live' }
              </button>
            </div>
          ))
        }
      </div>

      {/* Pop Up Modal */}
      <PopUpModal open={ modalOpen } onClose={ () => setModalOpen( false ) }>
        <>
          <h2 className='text-left text-emerald-500 font-bold text-lg'>Initiate Live Coverage</h2>
        </>
      </PopUpModal>
    </div>
  )
}

export default LiveFixturesPage