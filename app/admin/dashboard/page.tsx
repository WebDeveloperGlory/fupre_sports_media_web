'use client'

import React, { useEffect, useState } from 'react'
import { getUserProfile, logoutUser } from '@/lib/requests/auth/requests';
import useAuthStore from '@/stores/authStore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/ui/loader';
import { AlertCircle, Calendar, Clock, LogOut, PlayCircle, Shield, Trophy, User, Users } from 'lucide-react';
import NavButton from '@/components/admin/NavButton';
import { format } from 'date-fns';

const getNavLinks = ( role: string ) => {
    switch ( role ) {
      case 'team-admin':
        return [
            { icon: Shield, label: 'My Team', href: '/admin/team_admin/team' },
            { icon: Users, label: 'Players', href: '/admin/team_admin/players' },
            { icon: Calendar, label: 'Fixtures', href: '/admin/team_admin/fixtures' },
            { icon: Trophy, label: 'Competitions', href: '/admin/team_admin/competitions' },
        ];
      case 'super-admin':
        return [
            { icon: Shield, label: 'All Teams', href: '/admin/super_admin/teams' },
            { icon: Users, label: 'All Users', href: '/admin/super_admin/users' },
            { icon: Calendar, label: 'All Fixtures', href: '/admin/super_admin/fixtures' },
            { icon: Users, label: 'All Players', href: '/admin/super_admin/players' },
            { icon: Trophy, label: 'All Competitions', href: '/admin/super_admin/competitions' },
            { icon: PlayCircle, label: 'Live Matches', href: '/admin/super_admin/live_matches' },
        ];
      case 'competition-admin':
        return [
            { icon: Trophy, label: 'My Competitions', href: '/admin/competition_admin/competitions' },
            { icon: PlayCircle, label: 'Live Matches', href: '/admin/super_admin/live_matches' },
        ];
      case 'live-match-admin':
        return [
            { icon: Calendar, label: 'Fixtures', href: '/admin/live_match_admin/fixtures' },
        ];
      default:
        return [];
    }
};

const GenralDashboardPage = () => {
    const router = useRouter();

    const { jwt, userProfile, setUserProfile, clearUserData } = useAuthStore();

    const [ loading, setLoading ] = useState<boolean>( true );

    useEffect( () => {
        const fetchData = async () => {
            const data = await getUserProfile( jwt! );
            if( data && data.code === '00' ) {
                setUserProfile( data.data );
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
    
    if( loading ) {
        return <Loader />
    }

    const navLinks = getNavLinks( userProfile ? userProfile.role : '' );

    const handleLogout = async () => {
        const data = await logoutUser();
        if( data ) {
            if( data.code === '00' ) {
                toast.success( data.message );
                clearUserData();
                setTimeout(() => router.push( '/admin' ), 1000)
            } else {
                toast.error( data.message );
            }
        }
    }
  return (
    <div className='space-y-4'>
        {/* Profile Section */}
        <div className='w-full border border-border bg-popover rounded-lg p-6 md:p-8'>
            <div className="flex flex-col items-center justify-center gap-4">
                <div className=''>
                    <User className='w-12 h-12' />
                </div>
                <div className='text-center'>
                    <h2 className='text-2xl mb-1'>{ userProfile?.name || 'No Name' }</h2>
                    <div className="text-sm text-muted-foreground">{ userProfile?.email || 'No Email' }</div>
                    <div className="flex gap-2 items-center justify-center mt-2">
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium">
                            { userProfile?.role || 'No Role' }
                        </span>
                        <span 
                            className={`
                                inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                    userProfile?.status === 'active' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-yellow-100 text-yellow-700'
                                }
                            `}
                        >
                            { userProfile?.status }
                        </span>
                    </div>

                    {/* Logout Button */}
                    <div className='flex items-center justify-center mt-2'>
                        <button 
                            className="flex gap-2 items-center px-4 py-2 bg-destructive text-white rounded-sm hover:scale-105 transition"
                            onClick={ handleLogout }
                        >
                            Logout
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full">
            <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
                <Trophy className="w-6 h-6 text-emerald-500 mb-2" />
                <div className="text-2xl font-bold">{ userProfile?.competitions?.length || 'Unknown' }</div>
                <div className="text-sm text-muted-foreground">Total Competitions</div>
            </div>
            <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
                <Calendar className="w-6 h-6 text-emerald-500 mb-2" />
                <div className="text-2xl font-bold">{ userProfile?.nextFixtures.length || 'Unknown' }</div>
                <div className="text-sm text-muted-foreground">Upcoming Fixtures</div>
            </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Quick Navigation Section */}
            <div className='w-full border border-border bg-popover rounded-lg p-6'>
                <h2 className='font-bold mb-4 text-lg'>Quick Navigation</h2>
                <div className='flex flex-col gap-2'>
                    {
                        navLinks.map(( link, index ) => (
                            <NavButton
                                key={ index }
                                icon={ link.icon }
                                label={ link.label }
                                href={ link.href }
                            />
                        ))
                    }
                </div>
            </div>

            {/* Current Competitions */}
            <div className='w-full border border-border bg-popover rounded-lg p-6 h-full'>
                <h2 className='font-bold mb-4 text-lg'>Current Competitions</h2>
                <div className='space-y-4'>
                    {
                        userProfile && userProfile.competitions && userProfile.competitions.map(( comp, index ) => (
                            <div
                                key={ comp._id } 
                                className='flex flex-col gap-1'
                            >
                                <div className='flex items-center justify-between'>
                                    <p className='font-bold'>Name:</p>
                                    <h3>{ comp.name }</h3>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <p className='font-bold'>Status:</p>
                                    <h3>{ comp.status }</h3>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <p className='font-bold'>Teams:</p>
                                    <h3>{ comp.teams }</h3>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <p className='font-bold'>Fixtures:</p>
                                    <h3>{ comp.fixtures }</h3>
                                </div>
                                
                            </div>
                        ))
                    }
                    {
                        userProfile && ( !userProfile.competitions || userProfile.competitions.length === 0 ) && (
                            <div className="flex justify-center items-center flex-col gap-2 mb-2 mt-4 md:mt-2">
                                <AlertCircle className="w-10 h-10" />
                                <p>No Available Competitions</p>
                            </div>
                        )
                    }
                </div>
            </div>

            {/* Upcoming Fixtures */}
            <div className='w-full border border-border bg-popover rounded-lg p-6 h-full'>
                <h2 className='font-bold mb-4 text-lg'>Upcoming Fixtures</h2>
                <div>
                    {
                        userProfile && userProfile.nextFixtures.map( ( fixture ) => {
                            const formattedDate = fixture ? format( fixture.date, "yyyy-MM-dd HH:mm" ) : null;
                            const date = formattedDate ? formattedDate.split(' ')[ 0 ] : null;
                            const time = formattedDate ? formattedDate.split(' ')[ 1 ] : null;
                            
                            return (
                                <div 
                                    key={ fixture._id }
                                    className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{ date }</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{ time }</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium basis-5/12 text-left">{ fixture.homeTeam.name }</span>
                                        {fixture.status === 'completed' && fixture.result ? (
                                            <div className="flex items-center gap-2 basis-2/12 justify-center">
                                                <span className="font-bold">{ fixture.result.homeScore }</span>
                                                <span className="text-muted-foreground">-</span>
                                                <span className="font-bold">{ fixture.result.awayScore }</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground basis-2/12 text-center">vs</span>
                                        )}
                                        <span className="font-medium basis-5/12 text-right">{ fixture.awayTeam.name }</span>
                                    </div>
                                    <div className="mt-2 text-xs text-center text-muted-foreground">
                                        { fixture.stadium }
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        userProfile && ( !userProfile.nextFixtures || userProfile.nextFixtures.length === 0 ) && (
                            <div className="flex justify-center items-center flex-col gap-2 mb-2 mt-4 md:mt-2">
                                <AlertCircle className="w-10 h-10" />
                                <p>No Upcoming Fixtures</p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default GenralDashboardPage