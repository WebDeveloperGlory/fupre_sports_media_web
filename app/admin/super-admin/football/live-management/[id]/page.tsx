'use client'

import Events from '@/components/admin/super-admin/live-management/Events';
import General from '@/components/admin/super-admin/live-management/General';
import Lineups from '@/components/admin/super-admin/live-management/Lineups';
import Overview from '@/components/admin/super-admin/live-management/Overview';
import Statistics from '@/components/admin/super-admin/live-management/Statistics';
import { Loader } from '@/components/ui/loader';
import { liveMatchSample } from '@/constants';
import { getLiveFixtureTeamPlayerList } from '@/lib/requests/liveAdminPage/requests';
import { getLiveFixtureById, getLiveFixtureTeamPlayers } from '@/lib/requests/v2/admin/super-admin/live-management/requests';
import { checkSuperAdminStatus } from '@/lib/requests/v2/authentication/requests';
import { LiveFixSubCreate } from '@/utils/V2Utils/formData';
import { LiveFixData, LiveFixPlayerData } from '@/utils/V2Utils/getRequests';
import { LiveStatus } from '@/utils/V2Utils/v2requestData.enums';
import { FixtureStat } from '@/utils/V2Utils/v2requestSubData.types';
import { Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

enum TabsEnum {
  OVERVIEW = 'overview',
  EVENTS = 'events',
  STATISTICS = 'statistics',
  LINEUPS = 'lineups',
  GENERAL = 'general',
}

type SaveScoreLine = { homeScore: number, awayScore: number, homePenalty?: number, awayPenalty?: number };

const SuperAdminLivePage = ({ params }:
    { params: Promise<{ id: string }> }
) => {
    const resolvedParams = use( params );
    const router = useRouter();

    // States //
    const [loading, setLoading] = useState( true );
    const [currentTime, setCurrentTime] = useState<Date>( new Date() );
    const [fixture, setFixture] = useState<LiveFixData | null>( null );
    const [teamPlayers, setTeamPlayers] = useState<LiveFixPlayerData | null>( null );
    const [kickoff, setKickoff] = useState<Date | null>( null );
    const [activeTab, setActiveTab] = useState<TabsEnum>(TabsEnum.OVERVIEW)
    // End of States //

    // Timer effect //
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date())
      }, 1000)

      return () => clearInterval(timer)
    }, [])

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

        const fixtureData = await getLiveFixtureById( resolvedParams.id );
        const playerData = await getLiveFixtureTeamPlayers( resolvedParams.id );

        if( fixtureData && fixtureData.data ) {
          setFixture( fixtureData.data )
        }
        if( playerData && playerData.data ) {
          setTeamPlayers( playerData.data )
        }

        setLoading( false );
      }

      if( loading ) fetchData();
    }, [ loading ]);
    
    if( loading ) {
      return <Loader />
    };
    if( !loading && !fixture ) {
      return <div className='flex justify-center items-center'>Uh Oh! Fixture Ain't Live</div>
    }
    // End of On Load //

    // Save Events //
    const saveScoreline = (
      { homeScore, awayScore, homePenalty, awayPenalty }: SaveScoreLine
    ) => {
      if ( fixture ) {
        setFixture(prev => {
          if(prev === null) return prev;

          return {
            ...prev,
            result: {
              ...prev.result,
              homeScore,
              awayScore,
              homePenalty: homePenalty ? homePenalty : null,
              awayPenalty: awayPenalty ? awayPenalty : null
            }
          }
        })
      }
    }
    const saveGeneralData = ( status: LiveStatus, currentMinute: number ) => {
      if( fixture ) {
        setFixture(prev => {
          if(prev === null) return prev;

          return {
            ...prev,
            status,
            currentMinute
          }
        });
      }
    }
    const saveStatData = ( homeStats: FixtureStat, awayStats: FixtureStat ) => {
      if( fixture ) {
        setFixture(prev => {
          if( prev === null ) return prev;

          return {
            ...prev,
            statistics: {
              home: homeStats,
              away: awayStats
            }
          }
        })
      }
    }
    const addSubstitution = ( sub: LiveFixSubCreate ) => {
      const playerOut = sub.playerOutId;
      const playerIn = sub.playerInId;

      if( fixture ) {
       setFixture(prev => {
          if( prev === null ) return prev;

          return {
            ...prev,
            substitutions: [
              ...prev.substitutions,
              // sub
            ]
          }
        })
      }
    }
    // End of Save Events //
  return (
    <div className='space-y-6 md:space-y-4'>
      {/* Header */}
      <div className=' flex items-center justify-between md:px-4 md:py-4 md:border md:rounded-lg'>
        <div>
          <p className='font-bold text-xl'>Live Match Admin</p>
          <div className='flex gap-2 items-center text-muted-foreground'>
            <span className=''>{ fixture?.homeTeam.name || 'Unknown' }</span>
            <span className=''>vs</span>
            <span className=''>{ fixture?.awayTeam.name || 'Unknown' }</span>
          </div>
        </div>
        <div className="md:flex items-center space-x-2 bg-gray-900 px-4 py-2 rounded-lg hidden">
          <Timer className="h-5 w-5 text-blue-400" />
          <span className="font-mono text-lg">{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 w-fit bg-gray-900 px-4 py-2 rounded-lg md:hidden">
        <Timer className="h-5 w-5 text-blue-400" />
        <span className="font-mono text-lg">{currentTime.toLocaleTimeString()}</span>
      </div>

      {/* Stat Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='flex items-center justify-center py-6 flex-col border border-muted-foreground bg-card rounded-lg'>
          <p className='text-xl font-bold'>{ fixture?.result.homeScore } - { fixture?.result.awayScore }</p>
          <p className='text-muted-foreground'>Current Score</p>
        </div>
        <div className='flex items-center justify-center py-6 flex-col border border-muted-foreground bg-card rounded-lg'>
          <p className='text-xl font-bold'>{`${ fixture?.currentMinute }' ${ fixture?.injuryTime ? `+ ${fixture.injuryTime}` : '' }`}</p>
          <p className='text-muted-foreground'>Match Time</p>
        </div>
        <div className='flex items-center justify-center py-6 flex-col border border-muted-foreground bg-card rounded-lg'>
          <p className='text-xl font-bold'>{ fixture?.timeline.length }</p>
          <p className='text-muted-foreground'>Events</p>
        </div>
        <div className='flex items-center justify-center py-6 flex-col border border-muted-foreground bg-card rounded-lg'>
          <p className='text-xl font-bold'>{ fixture?.commentary.length }</p>
          <p className='text-muted-foreground'>Comments</p>
        </div>
      </div>

      {/* Accordition Tabs */}
      <div className='w-full overflow-x-scroll scrollbar-hide border rounded-lg flex md:grid md:grid-cols-5 items-center gap-2 bg-primary-foreground text-center'>
        {
          Object.values(TabsEnum).map( tab => (
            <div
              key={ tab }
              onClick={ () => { 
                setActiveTab( tab );
              } }
              className={`
                cursor-pointer px-6 py-2 capitalize text-sm font-medium basis-1/2 h-full ${
                  activeTab === tab
                    ? 'text-emerald-500 border border-emerald-500 rounded-sm'
                    : ''
                }  
              `}
            >
              <p>{ tab }</p>
            </div>
          ))
        }
      </div>
      
      {/* Overview Section */}
      {
        activeTab === TabsEnum.OVERVIEW && <Overview
          liveId={ fixture!._id }
          homeName={ fixture!.homeTeam.name || 'Unknown' }
          awayName={ fixture!.awayTeam.name || 'Unknown' }
          status={ fixture!.status as LiveStatus }
          currentMin={ fixture!.currentMinute }
          injuryTime={ fixture!.injuryTime }
          homeScore={ fixture!.result.homeScore }
          awayScore={ fixture!.result.awayScore }
          homePenalty={ fixture!.result.homePenalty }
          awayPenalty={ fixture!.result.awayPenalty }
          saveScore={ saveScoreline }
          saveData={ saveGeneralData }
        />
      }
      {/* Events Section */}
      {
        activeTab === TabsEnum.EVENTS && <Events
          liveId={ fixture!._id }
          events={ fixture!.timeline }
          currentTime={ currentTime }
          currentMinute={ fixture!.currentMinute }
          lineups={ fixture!.lineups }
        />
      }
      {/* Statistics Section */}
      {
        activeTab === TabsEnum.STATISTICS && <Statistics
          liveId={ fixture!._id }
          homeName={ fixture!.homeTeam.name }
          awayName={ fixture!.awayTeam.name }
          homeStats={ fixture!.statistics.home }
          awayStats={ fixture!.statistics.away }
          saveStats={ saveStatData }
        />
      }
      {/* Lineup Section */}
      {
        activeTab === TabsEnum.LINEUPS && <Lineups
          liveId={ fixture!._id }
          homeName={ fixture!.homeTeam.name }
          awayName={ fixture!.awayTeam.name }
          homeLineup={ fixture!.lineups.home }
          awayLineup={ fixture!.lineups.away }
          currentMinute={ fixture!.currentMinute }
          substitutions={ fixture!.substitutions }
          saveSubs={ addSubstitution }
        />
      }
      {/* General Section */}
      {
        activeTab === TabsEnum.GENERAL && <General
          liveId={ fixture!._id }
          referee={ fixture!.referee }
          weather={ fixture!.weather }
          attendance={ fixture!.attendance }
          kickoff={ fixture!.kickoffTime }
        />
      }
    </div>
  )
}

export default SuperAdminLivePage