'use client'

import React, { useEffect, useState } from 'react';
import useAuthStore from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Fixture, LiveAdmins } from '@/utils/requestDataTypes';
import { getAllLiveAdmins, getAllUpcomingFixturesAdmin, initializeLiveFixture } from '@/lib/requests/liveAdminPage/requests';
import { format } from 'date-fns';
import { AlertCircle, Calendar, Clock, Users, X } from 'lucide-react';
import Link from 'next/link';
import { BackButton } from '@/components/ui/back-button';

const FixtureListPage = () => {
    const router = useRouter();

    const { jwt, userProfile } = useAuthStore();

    const [ loading, setLoading ] = useState<boolean>( true );
    const [ modalOpen, setModalOpen ] = useState<boolean>( false );
    const [ fixtures, setFixtures ] = useState<Fixture[] | null>( null );
    const [ liveAdmins, setLiveAdmins ] = useState<LiveAdmins[]>( [] );
    const [ selectedAdmin, setSelectedAdmin ] = useState<LiveAdmins | null>( null );
    const [ selectedFixture, setSelectedFixture ] = useState<string | null>( null );

    useEffect( () => {
        const fetchData = async () => {
          const data = await getAllUpcomingFixturesAdmin( jwt! );
          if( data && data.code === '00' ) {
            setFixtures( data.data );
          }

          const liveAdminData = await getAllLiveAdmins( jwt! );
          if( liveAdminData && liveAdminData.data ) {
            setLiveAdmins( liveAdminData.data );
          }
          setLoading( false );

          console.log({ data, liveAdminData })
        }

        if( !jwt ) {
            toast.error('Please Login First');
            setTimeout(() => router.push( '/admin' ), 1000);
        } else {
            if( loading ) fetchData();
        }
    }, [ loading ]);

    const handleAction = async () => {
      if ( selectedAdmin && selectedFixture ) {
        // Perform your action here with selectedUser.id
        const data = await initializeLiveFixture( selectedFixture, selectedAdmin._id,  jwt! );
        if( data && data.code === '00' ) {
          toast.success( data.message );
          console.log( data.data );
          handleModalClose();
          setTimeout(() => setLoading( true ), 1000);
        } else {
          toast.error( data?.message );
          handleModalClose();
        }
      }
    };
    const handleModalOpen = ( fixtureId: string ) => {
      setModalOpen( true );
      setSelectedFixture( fixtureId );
    }
    const handleModalClose = () => {
      setModalOpen( false );
      setSelectedFixture( null );
      setSelectedAdmin( null );
    }
  return (
    <div className='pt-12 md:pt-0'>
      {/* Back Button */}
      <div className="fixed top-6 left-4 md:left-8 z-10">
        <BackButton />
      </div>

      <h1 className='text-2xl mb-1'>Upcoming Fixtures</h1>
      <h2 className='mb-4 text-muted-foreground'>Manage Upcoming Sports Events</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {
          fixtures && fixtures.map( ( fixture ) => {
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
                  {
                    fixture.status === 'live' && <span className='text-sm rounded-md px-3 py-1 bg-red-500 text-white'>{ fixture.status }</span>
                  }
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
                  </div>

                  <div className="pt-4 flex gap-3 justify-end">
                    <Link
                      href={`/admin/competition_admin/live_matches/${ fixture._id }/formation`}
                      className='flex items-center gap-2 border px-4 py-2 rounded'
                    >
                      <Users className="w-4 h-4" />
                      Set Lineup
                    </Link>
                    {
                      fixture.status === 'upcoming' && (
                        <button
                          onClick={ () => handleModalOpen( fixture._id ) }
                          className='flex items-center gap-2 px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white'
                        >
                          Set As Live
                        </button>
                      )
                    }
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>

      {/* Modal */}
      <PopUpModal
        isModalOpen={ modalOpen }
        users={ liveAdmins }
        selectedUser={ selectedAdmin }
        setSelectedUser={ setSelectedAdmin }
        handleAction={ handleAction }
        handleModalClose={ handleModalClose }
      />
    </div>
  )
}

const PopUpModal = (
  { isModalOpen, handleModalClose, users, selectedUser, setSelectedUser, handleAction }: 
  { isModalOpen: boolean, handleModalClose: () => void, users: LiveAdmins[], selectedUser: LiveAdmins | null, setSelectedUser: ( user: LiveAdmins | null ) => void, handleAction: () => void }
) => {
  return (
    <>
      {/* Modal Overlay */}
      {
        isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          {/* Modal Content */}
          <div className="bg-card rounded-lg md:w-2/6 w-5/6 p-6 shadow-xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select a User</h2>
              <button
                onClick={ handleModalClose }
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* User List */}
            <div className="mb-6">
              {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                  <AlertCircle size={48} className="mb-2" />
                  <p className="text-center">No users available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={ user._id }
                      onClick={() => setSelectedUser( user )}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedUser?._id === user._id
                          ? 'border-2 border-blue-500'
                          : 'hover:border-blue-500 border-2 border-transparent'
                      }`}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={ handleAction }
              disabled={!selectedUser}
              className={`w-full py-2 px-4 rounded-lg transition-colors ${
                selectedUser
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Perform Action
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default FixtureListPage