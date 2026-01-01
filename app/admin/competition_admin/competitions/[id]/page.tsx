'use client'

import React, { use, useEffect, useState } from 'react';
import useAuthStore from '@/stores/authStore';
import { useRouter } from 'next/navigation';import { BackButton } from '@/components/ui/back-button'
import { AdminCompetition, ExtendedAdminCompetition } from '@/utils/requestDataTypes';
import { toast } from 'react-toastify';
import { getAdminCompetitionDetails } from '@/lib/requests/v1/adminPage/requests';
import { Trophy } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

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

const IndividualCompAdminPage = ({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) => {
    const resolvedParams = use(params);
    const router = useRouter();

    const { jwt } = useAuthStore();

    const [ loading, setLoading ] = useState<boolean>( true );
    const [ competition, setCompetition ] = useState<ExtendedAdminCompetition | null>( null );

    useEffect( () => {
        const fetchData = async () => {
            const data = await getAdminCompetitionDetails( jwt!, resolvedParams.id );
            if( data && data.data ) {
            setCompetition( data.data )
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

    const startDate = competition?.startDate ? format( competition.startDate, 'MMMM dd, yyyy' ) : null;
    const endDate = competition?.endDate ? format( competition.endDate, 'MMMM dd, yyyy' ) : null;
  return (
    <div>
        {/* Back Button */}
        <div className="fixed top-6 left-4 md:left-8 z-10">
            <BackButton />
        </div>

        {
            competition ? (
                <div className='pt-12 md:pt-0'>
                    {/* Title */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Trophy size={16} />
                                { competition.name }
                            </h1>
                            <p className="text-muted-foreground mt-1">{ competition.description }</p>
                        </div>
                        <div className="flex items-center gap-4">
                        <div className={`${getStatusColor(competition.status)} text-white px-2 py-1 text-sm rounded-lg`}>
                            {competition.status}
                        </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        <div className='border border-border bg-popover p-4 rounded-md'>
                            <h2 className="text-lg font-bold mb-4">Competition Details</h2>

                            <div>
                                <dl className="space-y-2">
                                    <div>
                                        <dt className="text-sm text-gray-500">Type</dt>
                                        <dd className="font-medium uppercase">{ competition.type }</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Start Date</dt>
                                        <dd className="font-medium">{ startDate || 'Unknown' }</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">End Date</dt>
                                        <dd className="font-medium">{ endDate || 'Unknown' }</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        <div className='border border-border bg-popover p-4 rounded-md'>
                            <h2 className="text-lg font-bold">Teams</h2>
                            <p className="mt-1 text-muted-foreground">{ competition.teams.length } teams registered</p>

                            <div className='mt-4 grid grid-cols-1 md:grid-cols-2 md:gap-1'>
                                {
                                    competition.teams.length > 0 ? competition.teams.map( ( team ) => (
                                        <div
                                            key={ team.team._id }
                                        >
                                            <p>{ team.team.name }</p>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500">No teams added yet</p>
                                    )
                                }
                            </div>
                        </div>
                        <div className='border border-border bg-popover p-4 rounded-md'>
                            <h2 className="text-lg font-bold">Fixtures</h2>
                            <p className="mt-1 text-muted-foreground">{ competition.fixtures.length } fixtures total</p>

                            <div className='my-4 md:space-y-1'>
                                {
                                    competition.fixtures.length > 0 ? competition.fixtures.splice( 0, 3 ).map( ( fixture ) => (
                                        <div
                                            key={ fixture._id }
                                        >
                                            <p>{ fixture.homeTeam.name } vs { fixture.awayTeam.name }</p>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500">No fixtures created yet</p>
                                    )
                                }
                            </div>

                            <Link
                                href={`/admin/competition_admin/competitions/${ competition._id }/fixtures`}
                                className='w-full py-2 bg-card text-center border border-border px-4 rounded-lg hover:bg-popover'
                            >
                                View All Fixtures
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='pt-12 md:pt-0'></div>
            )
        }
        
    </div>
  )
}

export default IndividualCompAdminPage