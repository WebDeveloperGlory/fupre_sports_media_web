'use client'

import React, { useEffect, useState } from 'react';
import useAuthStore from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Fixture } from '@/utils/requestDataTypes';
import { getAllTodayFixturesAdmin, initializeLiveFixture } from '@/lib/requests/liveAdminPage/requests';
import { format } from 'date-fns';
import { Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';

const fixturesArr: Fixture[] = [
  {
    "result": {
      "homeScore": null,
      "awayScore": null,
      "homePenalty": null,
      "awayPenalty": null
    },
    "homeLineup": {
      "formation": null,
      "startingXI": [],
      "subs": []
    },
    "awayLineup": {
      "formation": null,
      "startingXI": [],
      "subs": []
    },
    _id: "678220108afb07cd44ca3e65",
    "homeTeam": {
      "_id": "6781bc4cf161889b9a4b00d9",
      "name": "Dragonborn Drifters"
    },
    "awayTeam": {
      "_id": "6781bbeef161889b9a4b00d1",
      "name": "Neo’s Chosen Ones"
    },
    "type": "competition",
    "competition": {
      "_id": "678211a1a04cd7922ac448b6",
      "name": "Fupre Super League"
    },
    "date": new Date("2025-01-10T22:00:00.000Z"),
    "stadium": "Stade et Fupre",
    "status": "upcoming",
    "goalScorers": [],
    "matchEvents": []
  },
  {
    "result": {
      "homeScore": null,
      "awayScore": null,
      "homePenalty": null,
      "awayPenalty": null
    },
    "homeLineup": {
      "formation": null,
      "startingXI": [],
      "subs": []
    },
    "awayLineup": {
      "formation": null,
      "startingXI": [],
      "subs": []
    },
    "_id": "678220108afb07cd44ca3e66",
    "homeTeam": {
      "_id": "6781bb42f161889b9a4b00c6",
      "name": "Master Chiefs United"
    },
    "awayTeam": {
      "_id": "6781bc29f161889b9a4b00d7",
      "name": "Kratos’ Fury"
    },
    "type": "competition",
    "date": new Date('2025-01-11T00:00:00.000Z'),
    "stadium": "Stade et Fupre",
    "status": "live",
    "goalScorers": [],
    "matchEvents": []
  },
]
const FixtureListPage = () => {
    const router = useRouter();

    const { jwt, userProfile } = useAuthStore();

    const [ loading, setLoading ] = useState<boolean>( true );
    const [ fixtures, setFixtures ] = useState<Fixture[] | null>( null );

    useEffect( () => {
        const fetchData = async () => {
          const data = await getAllTodayFixturesAdmin( jwt! );
          if( data && data.code === '00' ) {
            setFixtures( data.data );
            console.log( data.data )
          }
          setLoading( false );
        }

        if( !jwt ) {
            toast.error('Please Login First');
            setTimeout(() => router.push( '/admin' ), 1000);
        } else {
            if( loading ) fetchData();
        }
    }, [ loading ]);

    const handleGoLiveClick = async ( fixtureId: string ) => {
      const data = await initializeLiveFixture( fixtureId, jwt! );
      if( data && data.code === '00' ) {
        toast.success( data.message );
        console.log( data.data );
        setTimeout(() => setLoading( true ), 1000);
      } else {
        toast.error( data?.message )
      }
    }
  return (
    <div>
      <h1 className='text-2xl mb-1'>Upcoming Fixtures</h1>
      <h2 className='mb-4 text-muted-foreground'>Manage Upcoming Sports Events</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {
          fixturesArr && fixturesArr.map( ( fixture ) => {
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
                    <button
                      onClick={ () => handleGoLiveClick( fixture._id ) }
                      className='flex items-center gap-2 px-4 py-2 rounded bg-primary-foreground'
                    >
                      Set As Live
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default FixtureListPage