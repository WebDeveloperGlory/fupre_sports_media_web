'use client'

import PopUpModal from '@/components/modal/PopUpModal';
import { Loader } from '@/components/ui/loader';
import { getAllTodayFixtures, getLiveFixtureAdmins, initiateLiveFixture, rescheduleFixture } from '@/lib/requests/v2/admin/super-admin/live-management/requests';
import { checkSuperAdminStatus } from '@/lib/requests/v2/authentication/requests';
import { AllTodayFix } from '@/utils/V2Utils/getRequests';
import { CompetitionType, FixtureStatus } from '@/utils/V2Utils/v2requestData.enums';
import { Activity, Calendar, ChevronDown, ChevronUp, Clock, MapPin, PlayIcon, Save, Search, Settings, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

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
    const [selectedFixture, setSelectedFixture] = useState<AllTodayFix | null>( null );
    const [selectedAdmin, setSelectedAdmin] = useState<{ id: string }>({
      id: ''
    });
    const [postponeData, setPostponeData] = useState({
      postponedReason: '',
      postponedDate: ''
    });
    const [query, setQuery] = useState<string>("");
    const [filter, setFilter] = useState<string>("all-status");
    const [filterOpen, setFilterOpen] = useState<boolean>( false );
    const [modalOpen, setModalOpen] = useState<boolean>( false );
    const [postponeModalOpen, setPostponeModalOpen] = useState<boolean>( false );

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
        
        const liveAdminData = await getLiveFixtureAdmins()
        const todayFixtureData = await getAllTodayFixtures();

        if( liveAdminData && liveAdminData.data ) {
          setAdmins( liveAdminData.data );
        }
        if( todayFixtureData && todayFixtureData.data ) {
          setFixtures( todayFixtureData.data );
        }
        
        setLoading( false );
      }

      if( loading ) fetchData();
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
    const handlePostponeModalOpen = ( fixture: AllTodayFix ) => {
      setSelectedFixture(fixture);
      setPostponeModalOpen(true);
    }
    const handleAdminSelect = async () => {
      if(selectedFixture) {
        const response = await initiateLiveFixture( selectedFixture._id, selectedAdmin.id );
        if(response?.code === '00') {
          toast.success( response.message );
          setSelectedAdmin({id: ''});
          setSelectedFixture(null);
          setModalOpen(false);
          setLoading(true);
        } else {
          toast.error(response?.message || 'An Error Occurred');
          setSelectedAdmin({id: ''});
          setSelectedFixture(null);
          setModalOpen(false);
        }
      }
    }
    const handlePostponeMatch = async () => {
      if( selectedFixture ) {
        const response = await rescheduleFixture( selectedFixture._id, postponeData.postponedReason, postponeData.postponedDate );
        if( response?.code === '00' ) {
          toast.success(response.message);
          setPostponeData({
            postponedDate: '',
            postponedReason: ''
          });
          setPostponeModalOpen(false);
          setLoading(true);
        } else {
          toast.error(response?.message || 'An Error Occurred');
          setSelectedFixture(null);
          setPostponeData({
            postponedDate: '',
            postponedReason: ''
          });
          setPostponeModalOpen(false);
        }
      }
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
    const handleFormationButtonClick = ( fixtureId: string ) => {
      router.push(`live-management/${fixtureId}/formation`)
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
                  <p>{ fixture.awayTeam.name }</p>
                  <p className='uppercase text-sm text-muted-foreground'>{ fixture.awayTeam.shorthand }</p>
                </div>
              </div>
              {/* Info */}
              <div className='text-sm'>
                <div className='flex justify-between items-center'>
                  <p className='flex gap-1 items-center'>
                    <Calendar className='w-3 h-3' />
                    { fixture.status === 'postponed' ? fixture.rescheduledDate!.toLocaleString() : fixture.scheduledDate.toLocaleString() }
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
                    { fixture.competition ? fixture.competition.name : 'Friendly' }
                  </p>
                </div>
              </div>
              {/* Buttons */}
              <div className='flex gap-2'>
                {/* Main Button */}
                <button
                  onClick={() => handleFixtureButtonClick( fixture )}
                  className={`
                    flex-1 text-center py-2 text-white font-bold flex gap-2 items-center justify-center capitalize rounded-lg transition-colors ${
                      fixture.status === 'live'
                        ? 'bg-emerald-500 hover:bg-emerald-500/50'
                        : 'bg-blue-500 hover:bg-blue-500/50'
                    }
                  `}
                >
                  { fixture.status === 'live' ? <Activity className='w-4 h-4' /> : <PlayIcon className='w-4 h-4' /> }
                  { fixture.status === 'live' ? 'Manage Fixture' : 'Initiate Live' }
                </button>
                
                {/* Settings/Postpone Button - Only for non-live fixtures */}
                {fixture.status !== 'live' && (
                  <button
                    onClick={() => handlePostponeModalOpen(fixture)}
                    className='px-3 py-2 bg-gray-500 hover:bg-gray-500/50 text-white rounded-lg transition-colors'
                    title='Settings/Postpone Match'
                  >
                    <Settings className='w-4 h-4' />
                  </button>
                )}
                {/* Formation Button - Only for live fixtures */}
                {fixture.status === 'live' && (
                  <button
                    onClick={() => handleFormationButtonClick(fixture._id)}
                    className='px-3 py-2 bg-gray-500 hover:bg-gray-500/50 text-white rounded-lg transition-colors flex gap-2 items-center justify-center'
                  >
                    <Users className='w-4 h-4' />
                    Set Formattion
                  </button>
                )}
              </div>
            </div>
          ))
        }
      </div>

      {/* Pop Up Modal */}
      <PopUpModal 
        open={ modalOpen } 
        onClose={ 
          () => {
            setModalOpen( false )
            setSelectedAdmin({id: ''});  
          } 
        }
      >
        <>
          <h2 className='text-left text-emerald-500 font-bold text-lg mb-6'>Initiate Live Coverage</h2>
          <div className='space-y-4 text-left'>
            <div>
              <label className="block font-semibold mb-1.5">Select Admin</label>
              <select 
                  className="w-full p-2 border rounded cursor-pointer bg-input"
                  value={ selectedAdmin.id }
                  onChange={ (e) => setSelectedAdmin({ 
                      ...selectedAdmin,
                      id: e.target.value
                  }) }
              >
                <option value=''>Select An Admin</option>
                {
                  admins.map( admin => (
                    <option key={ admin._id } value={ admin._id }>{ admin.email }</option>
                  ))
                }
              </select>
            </div>
            <button 
              onClick={handleAdminSelect}
              className='py-2 rounded-lg flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-500/50 text-white w-full disabled:opacity-50 disabled:line-through'
              disabled={ selectedAdmin.id === '' }
            >
              <Save className='w-5 h-5' />
              Initialize
            </button>
          </div>
        </>
      </PopUpModal>

      {/* Postpone Match Modal */}
      <PopUpModal 
        open={ postponeModalOpen } 
        onClose={ 
          () => {
            setPostponeModalOpen( false )
            setSelectedFixture(null);
            setPostponeData({
              postponedReason: '',
              postponedDate: ''
            });
          } 
        }
      >
        <>
          <h2 className='text-left text-orange-500 font-bold text-lg mb-6'>Postpone Match</h2>
          <div className='space-y-4 text-left'>
            {selectedFixture && (
              <div className='bg-card border border-muted-foreground p-3 rounded-lg mb-4'>
                <p className='font-semibold'>
                  {selectedFixture.homeTeam.name} vs {selectedFixture.awayTeam.name}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {selectedFixture.scheduledDate.toLocaleString()}
                </p>
              </div>
            )}
            
            <div>
              <label className="block font-semibold mb-1.5">Reason for Postponement</label>
              <textarea 
                className="w-full p-2 border rounded bg-input resize-none"
                placeholder="Enter reason for postponement..."
                rows={3}
                value={postponeData.postponedReason}
                onChange={(e) => setPostponeData({
                  ...postponeData,
                  postponedReason: e.target.value
                })}
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-1.5">New Date & Time</label>
              <input 
                type="datetime-local"
                className="w-full p-2 border rounded bg-input"
                value={postponeData.postponedDate}
                onChange={(e) => setPostponeData({
                  ...postponeData,
                  postponedDate: e.target.value
                })}
              />
            </div>
            
            <button 
              onClick={handlePostponeMatch}
              className='py-2 rounded-lg flex justify-center items-center gap-2 bg-orange-500 hover:bg-orange-500/50 text-white w-full disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={!postponeData.postponedReason.trim() || !postponeData.postponedDate}
            >
              <Clock className='w-5 h-5' />
              Postpone Match
            </button>
          </div>
        </>
      </PopUpModal>
    </div>
  )
}

export default LiveFixturesPage