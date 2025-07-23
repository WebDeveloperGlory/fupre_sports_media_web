'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getHeadMediaAdminDashboard } from '@/lib/requests/v2/admin/media-admin/dashboard/requests';
import { ArrowRight, CheckCircle, Clock, Crown, Newspaper, ShieldAlert, Users, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/ui/loader';
import { toast } from 'react-toastify';

type DashboardData = {
    totalBlogs: number;
    totalHeadMediaAdmins: number;
    totalMediaAdmins: number;
    totalPublishedBlogs: number;
    totalUnverifiedBlogs: number;
    totalPendingPOTM: number;
}

const MediaAdminDashboardPage = () => {
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(true);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    
    // On Load //
    useEffect( () => {
        const fetchData = async () => {
            const request = await  getHeadMediaAdminDashboard();
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
        
            setDashboardData(request?.data);
            setLoading( false );
        }

        if( loading ) fetchData();
    }, [ loading ]);
    
    if( loading ) {
        return <Loader />
    };
    // End of On Load //
    
  return (
    <div className='space-y-6 md:space-y-4'>
        {/* Header */}
        <div className=' flex items-center justify-between md:px-4 md:py-4 md:border md:rounded-lg'>
            <div>
                <h1 className='text-2xl font-bold'>Media Dashboard</h1>
                <p>Manage news, articles and media content</p>
            </div>
            <span className='text-sm px-2 py-1 rounded-xl bg-purple-500/50 hidden md:block'>System Online</span>
        </div>

        {/* Info Cards */}
        <div>
            <h2 className='text-xl font-bold mb-4 md:mb-2'>Information Modules</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Total Articles</p>
                        <span className='text-lg font-bold'>{ dashboardData?.totalBlogs || '0' }</span>
                    </div>
                    <Newspaper className='w-5 h-5 text-emerald-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Pending Review</p>
                        <span className='text-lg font-bold'>{ dashboardData?.totalUnverifiedBlogs || '0' }</span>
                    </div>
                    <Clock className='w-5 h-5 text-emerald-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Published</p>
                        <span className='text-lg font-bold'>{ dashboardData?.totalPublishedBlogs || '0' }</span>
                    </div>
                    <CheckCircle className='w-5 h-5 text-emerald-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Pending POTM</p>
                        <span className='text-lg font-bold'>{ dashboardData?.totalPendingPOTM || '0' }</span>
                    </div>
                    <ShieldAlert className='w-5 h-5 text-emerald-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-red-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Head Admins</p>
                        <span className='text-lg font-bold'>{ dashboardData?.totalHeadMediaAdmins || '0' }</span>
                    </div>
                    <Crown className='w-5 h-5 text-red-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-red-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Media Admins</p>
                        <span className='text-lg font-bold'>{ dashboardData?.totalMediaAdmins || '0' }</span>
                    </div>
                    <Users className='w-5 h-5 text-red-500' />
                </div>
            </div>
        </div>

        {/* Admin Modules */}
        <div>
            <h2 className='text-xl font-bold mb-4 md:mb-2'>Content Modules</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <ContentModule
                    title='News Management' 
                    content='Write and publish news articles' 
                    link='news-management'
                    statLabel='articles'
                    bg='bg-green-500'
                    stat={ dashboardData?.totalBlogs.toString() || '0' } 
                    Icon={ <Newspaper className='w-8 h-8' /> }
                />
                <ContentModule
                    title='Admin Management' 
                    content='Create and manage media administrators' 
                    link='admin-management'
                    statLabel='admins'
                    bg='bg-orange-500'
                    stat={ dashboardData ? (dashboardData.totalHeadMediaAdmins+dashboardData.totalMediaAdmins).toString() : '0' } 
                    Icon={ <Users className='w-8 h-8' /> }
                />
                <ContentModule
                    title='Video Content' 
                    content='Manage video highlights and content' 
                    link='video-management'
                    statLabel='highlights'
                    bg='bg-red-500'
                    stat={ '' } 
                    Icon={ <Video className='w-8 h-8' /> }
                />
                <ContentModule
                    title='POTM and Ratings' 
                    content='Set player of the match and ratings for fixtures' 
                    link='potm-management'
                    statLabel='pending'
                    bg='bg-purple-500'
                    stat={ dashboardData?.totalPendingPOTM.toString() || '0' } 
                    Icon={ <ShieldAlert className='w-8 h-8' /> }
                />
            </div>
        </div>
    </div>
  )
}

const ContentModule = (
    { title, content, link, stat, Icon, bg, statLabel }:
    { title: string, content: string, link: string, stat: string, statLabel: string, Icon: any, bg: string }
) => {
    return (
        <div className='border p-4 rounded-lg'>
            <div className='flex gap-4 items-center'>
                <div className={ `p-2 rounded-xl flex items-center justify-center ${ bg } text-primary-foreground` }>{ Icon }</div>
                <div>
                    <p className='mb-1'>{ title }</p>
                    <span className='text-muted-foreground text-sm'>{ content }</span>
                </div>
            </div>
            <div className='mt-4 flex justify-between items-center'>
                <span className='border px-2 py-1 text-center rounded-full text-sm'>{ stat } { statLabel }</span>
                <Link href={ link } className='text-blue-500 text-sm flex gap-1 items-center hover:underline-offset-2 hover:underline'>
                    Manage
                    <ArrowRight className='w-4 h-4' />
                </Link>
            </div>
        </div>
    )
}

export default MediaAdminDashboardPage