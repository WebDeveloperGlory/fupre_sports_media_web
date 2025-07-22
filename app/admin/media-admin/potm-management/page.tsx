import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getHeadMediaAdminFixturesForRating } from '@/lib/requests/v2/admin/media-admin/dashboard/requests';
import { IV2FootballLiveFixture, PopIV2FootballFixture } from '@/utils/V2Utils/v2requestData.types';
import { AlertCircle, Calendar, Clock, HeartPulse, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

type DashboardData = {
    pendingLivePOTM: IV2FootballLiveFixture[];
    pendingFixturePOTM: PopIV2FootballFixture[];
}

const POTMManagementPage = async () => {
    const cookieStore = cookies();
    const authToken = (await cookieStore).get('authToken');

    const request = await getHeadMediaAdminFixturesForRating( authToken?.value );
    if( request?.code === '99' ) {
        if( request.message === 'Invalid or Expired Token' || request.message === 'Login Required' ) {
            redirect('/auth/login')
        } else if ( request.message === 'Invalid User Permissions' ) {
            redirect('/sports');
        } else {
            redirect('/');
        }   
    };
    const POTMData = request?.data as DashboardData;

  return (
    <div className='space-y-6 md:space-y-4'>
        {/* Header */}
        <div className=' flex items-center justify-between md:px-4 md:py-4 md:border md:rounded-lg'>
            <div>
                <h1 className='text-2xl font-bold'>Rating & POTM Management</h1>
                <p>Rate and set POTM players</p>
            </div>
        </div>

        {/* Info Cards */}
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Total Live Pending POTM</p>
                        <span className='text-lg font-bold'>{ POTMData.pendingLivePOTM.length }</span>
                    </div>
                    <HeartPulse className='w-5 h-5 text-emerald-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Last 7 Days Pending POTM</p>
                        <span className='text-lg font-bold'>{ POTMData.pendingFixturePOTM.length }</span>
                    </div>
                    <Users className='w-5 h-5 text-emerald-500' />
                </div>
            </div>
        </div>

        {/* Live POTM */}
        <div className='space-y-4'>
            <h2>Pending Live POTM</h2>
            {
                POTMData.pendingLivePOTM && POTMData.pendingLivePOTM.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-2'>
                        {
                            POTMData.pendingLivePOTM.map(fixture => (
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
                                                { fixture.matchDate.toLocaleString() }
                                            </p>
                                            <p className='flex gap-1 items-center'>
                                                <Clock className='w-3 h-3' />
                                                Done
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
                                    <div className='w-full text-right'>
                                        <Link 
                                            className='w-full text-center py-2 bg-emerald-500 hover:bg-emerald-500/50 px-4 rounded-lg text-sm mt-4' 
                                            href={`potm-management/${fixture.fixture}`}
                                        >Go To POTM</Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
            {
                !POTMData.pendingLivePOTM || POTMData.pendingLivePOTM.length === 0 && (
                    <div className='flex justify-center items-center flex-col gap-4 border border-emerald-500 p-8 rounded-lg'>No Pending Live POTM</div>
                )
            }
        </div>
        
        {/* Last 7 Days POTM */}
        <div className='space-y-4'>
            <h2>Pending Last 7 Days POTM</h2>
            {
                POTMData.pendingFixturePOTM && POTMData.pendingFixturePOTM.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-2'>
                        {
                            POTMData.pendingFixturePOTM.map(fixture => (
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
                                </div>
                            ))
                        }
                    </div>
                )
            }
            {
                !POTMData.pendingFixturePOTM || POTMData.pendingFixturePOTM.length === 0 && (
                    <div className='flex justify-center items-center flex-col gap-4 border border-emerald-500 p-8 rounded-lg'>No Pending Last 7 Days POTM</div>
                )
            }
        </div>
    </div>
  )
}

export default POTMManagementPage