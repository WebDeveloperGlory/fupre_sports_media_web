'use client'

import React, { useEffect, useState } from 'react';
import useAuthStore from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Fixture, LiveFixture } from '@/utils/requestDataTypes';
import { getAllPossibleAdminLiveFixtures } from '@/lib/requests/liveAdminPage/requests';
import { BackButton } from '@/components/ui/back-button';
import { Calendar, Clock, LocateIcon, User } from 'lucide-react';
import Link from 'next/link';

const LiveGamesList = () => {
    const router = useRouter();

    const { jwt } = useAuthStore();
    
    const [ loading, setLoading ] = useState<boolean>( true );
    const [ fixtures, setFixtures ] = useState<LiveFixture[] | null>( null );

    useEffect( () => {
      const fetchData = async () => {
        const data = await getAllPossibleAdminLiveFixtures( jwt! );
        if( data && data.data ) {
          setFixtures( data.data )
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
    }, [ loading ]);
  return (
    <div>
      {/* Back Button */}
      <div className="fixed top-6 left-4 md:left-8 z-10">
        <BackButton />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold flex items-center gap-2 pt-12 md:pt-0">
        <Calendar size={16} />
        Fixtures
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
        {
          fixtures && fixtures.length > 0 && fixtures.map(( fixture ) => {
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

                <div className='w-full mt-6 flex justify-end'>
                  <Link
                    href={`/admin/live/${ fixture.fixtureId }`}
                    className='px-4 py-2 border border-border'
                  >
                    Go To Update
                  </Link>
                </div>
              </div>
            )
          })
        }
        {
          !fixtures || fixtures.length === 0 && (
            <p>No Fixtures</p>
          )
        }
      </div>
    </div>
  )
}

export default LiveGamesList