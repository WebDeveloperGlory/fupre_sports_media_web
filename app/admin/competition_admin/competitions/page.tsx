'use client'

import React, { useEffect, useState } from 'react';
import useAuthStore from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getAdminCompetitions } from '@/lib/requests/adminPage/requests';
import { AdminCompetition } from '@/utils/requestDataTypes';
import { Calendar, ChevronRight, Filter, Trophy } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';
import Link from 'next/link';
import { format } from 'date-fns';

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

const CompetitionAdminCompetitionsPage = () => {
    const router = useRouter();

    const { jwt } = useAuthStore();
    
    const [ loading, setLoading ] = useState<boolean>( true );
    const [ competitions, setCompetitions ] = useState<AdminCompetition[] | null>( null );
    const [ searchQuery, setSearchQuery ] = useState<string>('');
    const [ typeFilter, setTypeFilter ] = useState('all');
    const [ statusFilter, setStatusFilter ] = useState<'ongoing' | 'completed' | 'pending' | 'all'>('all');

    useEffect( () => {
        const fetchData = async () => {
          const data = await getAdminCompetitions( jwt! );
          if( data && data.data ) {
            setCompetitions( data.data )
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
        <Trophy size={16} />
        Competitions
      </h1>

      {/* Competitions List */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
        {
          competitions && competitions.map( comp => (
            <div
              key={ comp._id }
              className="overflow-hidden shadow-md transition-shadow duration-200 rounded-sm relative border border-border bg-popover"
            >
              <div className="flex flex-col">
                <div className="flex-grow p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{ comp.name }</h3>
                    <div className={`${getStatusColor(comp.status)} text-white px-2 py-1 rounded-lg text-sm`}>
                      {comp.status}
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-1 gap-y-2 gap-x-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">Type:</span> { comp.type }
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="font-medium">
                        { comp.startDate ? format( comp.startDate, 'MMMM dd, yyyy' ) : 'Unknown' } - { comp.endDate ? format( comp.endDate, 'MMMM dd, yyyy' ) : 'Unknown' }
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">Teams:</span> {comp.teams.length}
                    </div>
                  </div>
                </div>
                
                <Link
                  href={`/admin/competition_admin/competitions/${ comp._id }`}
                  className="flex items-center justify-between border-t md:border-t-0 md:border-l p-4 bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>{ comp.fixtures.length }</span>
                    <span>Fixtures</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </Link>
              </div>
            </div>
          ))
        }
        {
          !competitions || competitions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-3">
                <Filter size={ 48 } className="mx-auto text-gray-300" />
              </div>
              <h3 className="text-lg font-medium mb-1">No matching competitions found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default CompetitionAdminCompetitionsPage