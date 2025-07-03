import { ArrowRight, Award, Bell, Calendar, ChartBarStacked, Clock, File, Shield, Trophy, UserCheck, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const SuperAdminDashboardPage = () => {
    const dashboardData = {
        totalTeams: 24,
        totalCompetitions: 30,
        totalPlayers: 400,
        totalFixtures: 289,
        totalLiveFixtures: 2,
        totalUnverifiedPlayers: 12,
        totalActiveCompetitions: 4,
        totalAdminCount: 10,
        auditLogs: [
            {
                _id: '11111111111',
                userId: '546362167216827',
                message: 'New User Created',
                createdAt: new Date('23-05-2024T01:21:00')
            },
            {
                _id: '11111111dsfknsd11',
                userId: '546362167216827',
                message: 'New User Login',
                createdAt: new Date('23-05-2024T12:23:54')
            },
            {
                _id: '1111111qw11',
                userId: '546362167216827',
                message: 'New Team Created',
                createdAt: new Date('23-05-2024T23:00:00')
            },
        ]
    }
  return (
    <div className='space-y-6 md:space-y-4'>
        {/* Header */}
        <div className=' flex items-center justify-between md:px-4 md:py-4 md:border md:rounded-lg'>
            <div>
                <h1 className='text-2xl font-bold'>Super Admin Dashboard</h1>
                <p>Manage all aspects of the football management system</p>
            </div>
            <span className='text-sm px-2 py-1 rounded-xl bg-green-500/50 hidden md:block'>System Online</span>
        </div>

        {/* Info Cards */}
        <div>
            <h2 className='text-xl font-bold mb-4 md:mb-2'>Information Modules</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Total Teams</p>
                        <span className='text-lg font-bold'>{ dashboardData.totalTeams }</span>
                    </div>
                    <Users className='w-5 h-5 text-emerald-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Total Competitions</p>
                        <span className='text-lg font-bold'>{ dashboardData.totalCompetitions }</span>
                    </div>
                    <Trophy className='w-5 h-5 text-emerald-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Total Fixtures</p>
                        <span className='text-lg font-bold'>{ dashboardData.totalFixtures }</span>
                    </div>
                    <Calendar className='w-5 h-5 text-emerald-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-emerald-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Total Players</p>
                        <span className='text-lg font-bold'>{ dashboardData.totalPlayers }</span>
                    </div>
                    <UserCheck className='w-5 h-5 text-emerald-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-red-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Pending Player Approvals</p>
                        <span className='text-lg font-bold'>{ dashboardData.totalUnverifiedPlayers }</span>
                    </div>
                    <Clock className='w-5 h-5 text-red-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-red-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Live Fixtures</p>
                        <span className='text-lg font-bold'>{ dashboardData.totalLiveFixtures }</span>
                    </div>
                    <Clock className='w-5 h-5 text-red-500' />
                </div>
                <div className='px-4 py-2 md:py-4 flex justify-between items-center border border-red-500 rounded-lg'>
                    <div>
                        <p className='text-muted-foreground'>Admin Count</p>
                        <span className='text-lg font-bold'>{ dashboardData.totalAdminCount }</span>
                    </div>
                    <Clock className='w-5 h-5 text-red-500' />
                </div>
            </div>
        </div>

        {/* Admin Modules */}
        <div>
            <h2 className='text-xl font-bold mb-4 md:mb-2'>Administration Modules</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <AdminModule 
                    title='Team Management' 
                    content='Create, edit and manage all teams' 
                    link='teams'
                    statLabel='teams'
                    bg='bg-green-500'
                    stat={ dashboardData.totalTeams.toString() } 
                    Icon={ <Users className='w-8 h-8' /> }
                />
                <AdminModule 
                    title='Live Fixture' 
                    content='Manage ongoing matches and live updates' 
                    link='live-management'
                    statLabel='live'
                    bg='bg-orange-500'
                    stat={ dashboardData.totalLiveFixtures.toString() } 
                    Icon={ <Trophy className='w-8 h-8' /> }
                />
                <AdminModule 
                    title='Fixture Management' 
                    content='Schedule and manage all fixtures' 
                    link='fixtures'
                    statLabel='fixtures'
                    bg='bg-red-500'
                    stat={ dashboardData.totalTeams.toString() } 
                    Icon={ <Calendar className='w-8 h-8' /> }
                />
                <AdminModule 
                    title='Competition Management' 
                    content='Create and manage competitions' 
                    link='teams'
                    statLabel='teams'
                    bg='bg-blue-500'
                    stat={ dashboardData.totalCompetitions.toString() } 
                    Icon={ <Award className='w-8 h-8' /> }
                />
                <AdminModule 
                    title='Player Management' 
                    content='Verify and manage all players' 
                    link='players'
                    statLabel='players'
                    bg='bg-orange-500'
                    stat={ dashboardData.totalPlayers.toString() } 
                    Icon={ <UserCheck className='w-8 h-8' /> }
                />
                <AdminModule 
                    title='Seasonal Team/Player' 
                    content='Manage seasonal awards and recognition' 
                    link='live-management'
                    statLabel='season'
                    bg='bg-red-500'
                    stat={ '2024/2025' } 
                    Icon={ <Shield className='w-8 h-8' /> }
                />
                <AdminModule 
                    title='Analytics and Report' 
                    content='View system analytics and generate reports' 
                    link='analytics'
                    statLabel='data'
                    bg='bg-blue-500'
                    stat={ 'live' } 
                    Icon={ <Calendar className='w-8 h-8' /> }
                />
                <AdminModule 
                    title='Audit Logs' 
                    content='Monitor system activities and changes' 
                    link='logs'
                    statLabel='activities'
                    bg='bg-green-500'
                    stat={ 'all' } 
                    Icon={ <File className='w-8 h-8' /> }
                />
                <AdminModule 
                    title='Notifications' 
                    content='Manage system wide notifications' 
                    link='notifications'
                    statLabel='pending'
                    bg='bg-red-500'
                    stat={ '' } 
                    Icon={ <Bell className='w-8 h-8' /> }
                />
                <AdminModule 
                    title='Department and Faculty' 
                    content='Create, edit and manage all deartments and faculties' 
                    link='faculty'
                    statLabel=''
                    bg='bg-blue-500'
                    stat={ 'faculty' } 
                    Icon={ <ChartBarStacked className='w-8 h-8' /> }
                />
            </div>
        </div>

        {/* Audit Logs */}
        <div>
            <h2 className='text-xl font-bold mb-4 md:mb-2'>System Activities</h2>
            <div className='space-y-2'>
                {
                    dashboardData.auditLogs.map( (log,i) => (
                        <div
                            key={ log._id }
                            className='px-4 py-2 bg-muted rounded-md border flex gap-4 items-center'
                        >
                            <div className={`
                                w-3 h-3 rounded-full ${
                                    i % 2 === 0
                                        ? 'bg-emerald-500'
                                        : 'bg-orange-500'
                                }
                            `}></div>
                            <div>
                                <p>{ log.message }</p>
                                <span className='text-sm text-muted-foreground italic'>{ log.createdAt.toLocaleString() }</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

const AdminModule = (
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

export default SuperAdminDashboardPage