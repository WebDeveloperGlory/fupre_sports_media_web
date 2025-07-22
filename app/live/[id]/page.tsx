'use client';

import { use, useEffect, useState } from 'react';
import useFixtureSocket from '@/lib/socket/useFixtureSocket';
import Image from 'next/image';
import { BlurFade } from '@/components/ui/blur-fade';
import { BackButton } from '@/components/ui/back-button';
import { motion } from 'framer-motion';
import { Trophy, Clock, Goal, CloudRain, User, MapPin, Clock12, ThumbsUp, Star } from 'lucide-react';
import { LiveFixture } from '@/utils/requestDataTypes';
import { teamLogos } from '@/constants';
import { IV2FootballLiveFixture } from '@/utils/V2Utils/v2requestData.types';
import Overview from '@/components/newLive/Overview';
import PopUpModal from '@/components/modal/PopUpModal';
import Timeline from '@/components/newLive/Timeline';
import Statistics from '@/components/newLive/Statistics';
import Commentary from '@/components/newLive/Commentary';
import Lineups from '@/components/newLive/Lineups';
import { getLiveFixtureById, submitUnofficialCheer, submitUserPlayerRating } from '@/lib/requests/v2/admin/super-admin/live-management/requests';
import { TeamType } from '@/utils/V2Utils/v2requestData.enums';
import { toast } from 'react-toastify';

const templateStats = {
  home: {
      shotsOnTarget: 1,
      shotsOffTarget: 1,
      fouls: 1,
      yellowCards: 1,
      redCards: 1,
      offsides: 1,
      corners: 1,
      possessionTime: 1
  },
  away: {
    shotsOnTarget: 1,
    shotsOffTarget: 1,
    fouls: 1,
    yellowCards: 1,
    redCards: 1,
    offsides: 1,
    corners: 1,
    possessionTime: 1
  }
}
const templateCheerMeter = {
  official: {
    home: 1,
    away: 1
  },
  unofficial: {
    home: 1,
    away: 1
  },
  userVotes: []
};

enum Tabs {
  OVERVIEW = 'overview',
  TIMELINE = 'timeline',
  STATS = 'stats',
  LINEUPS = 'lineups',
  COMMENTARY = 'commentary',
}

export default function LiveMatchPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params);

  const { 
    isConnected,
    minute,
    score,
    timeline,
    statistics,
    status,
    generalInfo,
    cheerMeter,
    playerOfTheMatch,
    liveWatchers,
    substitution,
    goalScorers,
  } = useFixtureSocket(resolvedParams.id)

  const [ loading, setLoading ] = useState<boolean>( true );
  const [ liveFixture, setLiveFixture ] = useState<IV2FootballLiveFixture | null>( null );
  const [ activeTab, setActiveTab ] = useState<Tabs>( Tabs.OVERVIEW );
  const [open, setOpen] = useState<boolean>( false );
  const [modalType, setModalType] = useState<'rate' | 'vote' | null>( null );
  const [activeModalTab, setActiveModalTab] = useState<string | null>( null );
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>( null );
  const [ratingValue, setRatingValue] = useState<number>(5.0);

  useEffect( () => {
    const fetchData = async () => {
      const fixtureData = await getLiveFixtureById( resolvedParams.id );

      if( fixtureData && fixtureData.data ) {
        setLiveFixture( fixtureData.data );
        setActiveModalTab( fixtureData.data.homeTeam.name )
      }

      setLoading( false );
    }
    
    if( loading ) fetchData();
  }, [ loading, resolvedParams.id ])

  // On Click Functions
  const onModalClose = () => {
    setOpen( false );
    setModalType( null );
    setRatingValue( 5.0 );
  }
  const handleSubmitVote = async () => {

  }
  const handleRatePlayer = async () => {
    if(liveFixture && selectedPlayer) {
      const response = await submitUserPlayerRating( 
        liveFixture._id, 
        { 
          playerId: selectedPlayer,
          rating: ratingValue,
          isHomePlayer: activeModalTab === liveFixture.homeTeam.name
        } 
      );
      if(response?.code === '00') {
        toast.success(response.message || 'Rating Submitted');
        onModalClose();
      } else {
        toast.error(response?.message || 'Error Submitting Rating');
      }
    }
  }

  // Define possible first half statuses
  const possibleFirstHalfStatuses = ['pre-match', '1st-half', 'postponed'];

  // Get player fan rating
  const getPlayerFanRating = ( playerId: string ) => {
    const foundPlayer = liveFixture?.playerRatings.find( player => player.player._id === playerId );
    return foundPlayer ? foundPlayer.fanRatings.average : 0;
  }

  // Derived States //
  const currentMinute = minute?.minute ?? liveFixture?.currentMinute ?? 0;
  const injuryTime = minute?.injuryTime ?? liveFixture?.injuryTime ?? 0;
  const currentStatus = status ?? liveFixture?.status ?? 'SCHEDULED';
  const currentCheerMeter = cheerMeter ?? liveFixture?.cheerMeter ?? templateCheerMeter;

  const homeScore = score?.homeScore ?? liveFixture?.result.homeScore ?? 0;
  const awayScore = score?.awayScore ?? liveFixture?.result.awayScore ?? 0;
  // const timelineEvents = timeline.length > 0 ? timeline : liveFixture?.timeline ?? [];
  const stats = statistics ?? liveFixture?.statistics ?? templateStats;
  // const streamLinks = streamUpdate?.streams ?? liveFixture?.streamLinks ?? [];
  const referee = generalInfo?.referee ?? liveFixture?.referee;
  const kickoffTime = generalInfo?.kickoffTime ?? liveFixture?.kickoffTime ?? '';
  const weather = generalInfo?.weather ?? liveFixture?.weather ?? {condition: '', temperature: -10, humidity: -10};
  // End of Derived States //

  // Calculate total elapsed game time
  const totalElapsedGameTime = liveFixture ? stats.home.possessionTime + stats.away.possessionTime : 0;
  const homePossession = totalElapsedGameTime > 0 ? ( liveFixture!.statistics.home.possessionTime / totalElapsedGameTime ) * 100 : 50;
  const awayPossession = 100 - homePossession; // Ensures total is always 100%


  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="fixed top-6 left-4 md:left-8 z-10">
        <BackButton />
      </div>

      <div className="pt-12 pb-4 px-3 md:pt-0 md:pb-6 md:px-6">
        <BlurFade>
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            <h1 className='text-center'>Live Viewers: {liveWatchers}</h1>
            {
              liveFixture && (
                <>
                  {/* Match Header */}
                  <div className="relative bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
                    
                    <div className="relative">
                      <div className="text-center mb-3 md:mb-4">
                        <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-2.5 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                          <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          <span>{ liveFixture.competition?.name || 'Friendly' }</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 md:gap-8">
                        {/* Home Team */}
                        <div className="flex flex-col items-center gap-2 md:gap-3 w-1/3">
                          <motion.div 
                            className="relative w-12 h-12 md:w-20 md:h-20"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Image
                              src={ teamLogos[ liveFixture.homeTeam.name ] || '/images/team_logos/default.jpg' }
                              alt={ liveFixture.homeTeam.name }
                              fill
                              className="object-contain rounded-full"
                            />
                          </motion.div>
                          <span className="text-xs md:text-base font-medium text-center">
                            { liveFixture.homeTeam.name }
                          </span>
                        </div>

                        {/* Score */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="bg-card shadow-xl rounded-lg md:rounded-xl p-2 md:p-3 border border-border min-w-[90px] md:min-w-[120px] text-center">
                            <h2 className='text-sm'>{ currentStatus }</h2>
                            <div className="text-2xl md:text-4xl font-bold tracking-tighter">
                              <span className="text-emerald-500">{ homeScore }</span>
                              <span className="mx-2 md:mx-3 text-muted-foreground">-</span>
                              <span className="text-emerald-500">{ awayScore }</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2 text-sm text-green-500">
                              <Clock className="h-4 w-4" />
                              <span>{ currentMinute }'</span>
                              {injuryTime > 0 && <span>+{injuryTime}</span>}
                            </div>
                            {
                              !possibleFirstHalfStatuses.includes( liveFixture.status ) ? (
                                <div className="mt-2 text-xs text-gray-400">
                                  HT: {liveFixture.result.halftimeHomeScore} - {liveFixture.result.halftimeAwayScore}
                                </div>
                              ) : (
                                <></>
                              )
                            }
                          </div>
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center gap-2 md:gap-3 w-1/3">
                          <motion.div 
                            className="relative w-12 h-12 md:w-20 md:h-20"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Image
                              src={ teamLogos[ liveFixture.awayTeam.name ] || '/images/team_logos/default.jpg' }
                              alt={ liveFixture.awayTeam.name }
                              fill
                              className="object-contain rounded-full"
                            />
                          </motion.div>
                          <span className="text-xs md:text-base font-medium text-center">
                            { liveFixture.awayTeam.name }
                          </span>
                        </div>
                      </div>
                      {/* Minor Details */}
                      <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{liveFixture.stadium}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-1 text-gray-400" />
                          <span>Ref: {referee || 'Unknown'}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="flex items-center text-sm">
                          <CloudRain className="h-4 w-4 mr-1 text-gray-400" />
                          <span>
                            {weather.condition || 'Unknown'}, {weather.temperature || 'Unknown'}°C
                          </span>
                        </div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="flex items-center text-sm">
                          <Clock12 className="h-4 w-4 mr-1 text-gray-400" />
                          <span>
                            {kickoffTime.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Goalscorers */}
                  <div className="col-span-2 md:col-span-4">
                      {/* <Goalscorers fixtureData={ liveFixture } /> */}
                  </div>

                  {/* Quick Stats */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50 transition-all duration-300 grid grid-cols-3 gap-4"
                  >
                    <div className="col-span-3 md:col-span-1">
                      <StatBar
                        home={ stats.home.shotsOffTarget + stats.home.shotsOnTarget }
                        away={ stats.away.shotsOffTarget + stats.away.shotsOnTarget }
                        label='Total Shots'
                        className='bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-border/20 h-full'
                      />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <PossessionBar
                        home={ Number( homePossession.toFixed( 2 ) ) }
                        away={ Number( awayPossession.toFixed( 2 ) ) }
                        name='Possession'
                      />
                    </div>
                    <div className="col-span-3 md:col-span-1">
                      <CardsBar 
                        home={{ 
                          yellow: stats.home.yellowCards, 
                          red: stats.home.redCards 
                        }} 
                        away={{ 
                          yellow: stats.away.yellowCards, 
                          red: stats.away.redCards 
                        }} 
                      />
                    </div>
                  </motion.div>

                  {/* Fan Support */}
                  <div>
                    <CheerBar
                      home={ currentCheerMeter.unofficial.home }
                      away={ currentCheerMeter.unofficial.away }
                      homeShorthand={ liveFixture.homeTeam.shorthand || 'HOM' }
                      awayShorthand={ liveFixture.awayTeam.shorthand || 'AWA' }
                      homeTeam={ liveFixture.homeTeam.name }
                      awayTeam={ liveFixture.awayTeam.name }
                      liveId={ liveFixture._id }
                    />
                  </div>

                  {/* Accordition Tabs */}
                  <div className='w-full overflow-x-scroll scrollbar-hide border rounded-lg flex md:grid md:grid-cols-5 items-center gap-2 bg-primary-foreground text-center'>
                      {
                        Object.values( Tabs ).map( tab => (
                          <div
                            key={ tab }
                            onClick={ () => setActiveTab( tab ) }
                            className={`
                              cursor-pointer px-6 py-2 capitalize text-sm font-medium ${
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

                  <div className='mt-4'>
                    {/* Overview Section */}
                    { activeTab === Tabs.OVERVIEW && 
                      <Overview 
                        stream={ liveFixture.streamLinks }
                        playerRatings={ liveFixture.playerRatings }
                        homeLineup={ liveFixture.lineups.home } 
                        awayLineup={ liveFixture.lineups.away } 
                        home={ liveFixture.homeTeam.name }
                        away={ liveFixture.awayTeam.name }
                        odds={ liveFixture.odds }
                        playerOfTheMatch={ liveFixture.playerOfTheMatch }
                        setOpen={ setOpen }
                        setModalType={ setModalType }
                      /> 
                    }

                    {/* Timeline Section */}
                    { activeTab === Tabs.TIMELINE && 
                      <Timeline
                      />
                    }

                    {/* Statistics Section */}
                    { activeTab === Tabs.STATS &&
                      <Statistics
                        homeStat={ stats.home }
                        awayStat={ stats.away }
                        ratings={ liveFixture.playerRatings }
                        home={ liveFixture.homeTeam.name }
                        away={ liveFixture.awayTeam.name }
                      />
                    }

                    {/* Lineups Section */}
                    { activeTab === Tabs.LINEUPS &&
                      <Lineups
                        home={ liveFixture.homeTeam.name }
                        away={ liveFixture.awayTeam.name }
                        homeLineup={ liveFixture.lineups.home }
                        awayLineup={ liveFixture.lineups.away }
                        subs={ liveFixture.substitutions }
                      />
                    }
                    
                    {/* Commentary Section */}
                    { activeTab === Tabs.COMMENTARY &&
                      <Commentary
                        commentary={ liveFixture.commentary }
                      />
                    }
                  </div>
                </>
              )
            }
            {
              !liveFixture && (
                <div>Fixture Not Live</div>
              )
            }
          </div>
        </BlurFade>
      </div>

      {/* PopUp Modal */}
        <div className='relative'>
          <PopUpModal
              open={ open }
              onClose={ onModalClose }
          >
            {
              liveFixture && (
                <div className='space-y-4'>
                  {/* Header */}
                  <div className='text-left'>
                    {
                      modalType === 'vote' ? (
                        <>
                          <h2>Vote for Player of the Match</h2>
                          <p className='text-sm text-muted-foreground'>Select the player you think deserves to be player of the match</p>
                        </>
                      ) : (
                        <>
                          <h2>Rate A Player</h2>
                          <p className='text-sm text-muted-foreground'>Select a player and give them a rating from 1 to 10</p>
                        </>
                      )
                    }
                  </div>

                  {/* Accordition Tabs */}
                  <div className='w-full overflow-x-scroll scrollbar-hide border rounded-lg flex md:grid md:grid-cols-2 items-center gap-2 bg-primary-foreground text-center'>
                      {
                        [ liveFixture.homeTeam.name, liveFixture.awayTeam.name ].map( tab => (
                          <div
                              key={ tab }
                              onClick={ () => { 
                                setActiveModalTab( tab );
                                setSelectedPlayer( null );
                              } }
                              className={`
                              cursor-pointer px-6 py-2 capitalize text-sm font-medium basis-1/2 h-full ${
                                  activeModalTab === tab
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

                  {/* Player List */}
                  <div className='space-y-2'>
                    {
                      activeModalTab === liveFixture.homeTeam.name && (
                        [ ...liveFixture.lineups.home.startingXI, ...liveFixture.lineups.home.substitutes ].map( (player, i) => (
                          <div 
                            key={ i }
                            onClick={ () => setSelectedPlayer( player.player._id ) } 
                            className={`
                              py-1 px-2 border rounded-md text-sm text-left cursor-pointer hover:border-emerald-500 flex justify-between items-center ${
                                selectedPlayer === player.player._id
                                  ? 'border-emerald-500 text-emerald-500'
                                  : ''
                              }
                            `}
                          >
                            <div>
                              <p>{ player.player.name }</p>
                              <span className='text-xs text-muted-foreground'>{ player.player.position }</span>
                            </div>
                            {
                              modalType === 'vote' && (
                                <div className='flex items-center gap-1 text-sm'>
                                  <Star className='w-4 h-4 text-emerald-500' />
                                  <p>{ getPlayerFanRating( player.player._id ) }</p>
                                </div>
                              )
                            }
                          </div>
                        ))
                      )
                    }
                    {
                      activeModalTab === liveFixture.awayTeam.name && (
                        [ ...liveFixture.lineups.away.startingXI, ...liveFixture.lineups.away.substitutes ].map( (player, i) => (
                          <div 
                            key={ i }
                            onClick={ () => setSelectedPlayer( player.player._id ) } 
                            className={`
                              py-1 px-2 border rounded-md text-sm text-left cursor-pointer hover:border-emerald-500 flex justify-between items-center ${
                                selectedPlayer === player.player._id
                                  ? 'border-emerald-500 text-emerald-500'
                                  : ''
                              }
                            `}
                          >
                            <div>
                              <p>{ player.player.name }</p>
                              <span className='text-xs text-muted-foreground'>{ player.player.position }</span>
                            </div>
                            {
                              modalType === 'vote' && (
                                <div className='flex items-center gap-1 text-sm'>
                                  <Star className='w-4 h-4 text-emerald-500' />
                                  <p>{ getPlayerFanRating( player.player._id ) }</p>
                                </div>
                              )
                            }                          
                          </div>
                        ))
                      )
                    }
                  </div>

                  {/* Rate Slider */}
                  {
                    modalType === 'rate' && (
                      <div>
                        <div className="flex justify-between items-center">
                          <p className='text-sm'>Your rating:</p>
                          <div className='bg-muted px-2 py-1 flex gap-1 items- text-sm font-bold rounded-lg'>
                            <Star className='w-4 h-4 text-emerald-500' />
                            { ratingValue }
                          </div>
                        </div>
                        <div className='flex gap-2 items-center w-full mt-2 font-bold'>
                          <p>1</p>
                          <input 
                            type="range" 
                            id="range"
                            min={ 1 }
                            max={ 10 }
                            step={ 0.1 }
                            value={ ratingValue }
                            onChange={ (e) => setRatingValue( parseFloat(e.target.value) ) } 
                            className='w-full cursor-pointer' 
                          />
                          <p>10</p>
                        </div>
                      </div>
                    )
                  }

                  {/* Vote Button */}
                  <button
                    onClick={ modalType === 'vote' ? handleSubmitVote : handleRatePlayer }
                    className='bg-emerald-500 py-2 px-4 rounded-lg w-full disabled:opacity-50'
                    disabled={ selectedPlayer === null }
                  >
                    { modalType === 'vote' ? 'Submit Vote' : 'Submit Rating'}
                  </button>
                </div>
              )
            }
              
          </PopUpModal>
      </div>
    </main>
  );
}

function QuickStat({ icon, label, home, away }: { icon: React.ReactNode; label: string; home: number; away: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50 transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold text-emerald-500">{home}</span>
        <span className="text-xl font-semibold text-emerald-500">{away}</span>
      </div>
    </motion.div>
  );
}

function StatBar({ label, home, away, className }: { label: string; home: number; away: number, className?: string }) {
  const total = home + away;
  const homePercent = total === 0 ? 50 : (home / total) * 100;
  const awayPercent = total === 0 ? 50 : (away / total) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${ className }`}
    >
      <div className="flex justify-between text-sm">
        <span className="font-medium text-emerald-500">{home}</span>
        <span className="font-medium">{label}</span>
        <span className="font-medium text-emerald-500">{away}</span>
      </div>
      <div className="flex h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${homePercent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-emerald-500"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${awayPercent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-emerald-500/50"
        />
      </div>
    </motion.div>
  );
}

function PossessionBar({ name='Possession', home, away }: { name?: string, home: number; away: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-border/20"
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-medium text-white">{ name }</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-emerald-500 font-medium">{home}%</span>
        <div className="flex-1 h-1.5 bg-muted/20 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${home}%` }}
            />
            <div 
              className="h-full bg-emerald-500/50 transition-all duration-500"
              style={{ width: `${away}%` }}
            />
          </div>
        </div>
        <span className="text-emerald-500 font-medium">{away}%</span>
      </div>
    </motion.div>
  );
}

function CardsBar({ home, away }: { home: { yellow: number; red: number }; away: { yellow: number; red: number } }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-border/20"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-white">Cards</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-4 bg-yellow-500 rounded-sm" />
            <span className="text-white font-medium">{home.yellow}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-4 bg-red-500 rounded-sm" />
            <span className="text-white font-medium">{home.red}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-4 bg-yellow-500 rounded-sm" />
            <span className="text-white font-medium">{away.yellow}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-4 bg-red-500 rounded-sm" />
            <span className="text-white font-medium">{away.red}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CheerBar(
  { home, away, homeTeam, awayTeam, homeShorthand, awayShorthand, liveId }: 
  { home: number, away: number, homeTeam: string, awayTeam: string, homeShorthand: string, awayShorthand: string, liveId: string }
) {
  const total = home + away;
  const homePercent = total === 0 ? 50 : (home / total) * 100;
  const awayPercent = total === 0 ? 50 : (away / total) * 100;

  const handleCheer = async ( team: TeamType ) => {
    const response = await submitUnofficialCheer(liveId, {team, isOfficial: false});
    if(response?.code === '00') {
      toast.success(response.message);
    } else {
      toast.error(response?.message || 'An Error Occurred');
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border hover:bg-accent/50 transition-all duration-300 space-y-4"
    >
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='font-bold'>Fan Support</h1>
        <span className='text-muted-foreground text-sm'>{ total } votes</span>
      </div>
      {/* Bar */}
      <div className="flex items-center">
        <span className="text-sm font-medium w-16 text-right pr-2">{ homeShorthand }</span>
        <div className="flex-1 mx-2">
          {/* <div className="h-3 bg-gray-800 rounded-full overflow-hidden"> */}
            <div className="flex h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${homePercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-emerald-500"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${awayPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-emerald-500/50"
              />
            </div>
          {/* </div> */}
        </div>
        <span className="text-sm font-medium w-16 pl-2">{ awayShorthand }</span>
      </div>
      {/* Buttons */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <button
          onClick={() => handleCheer(TeamType.HOME)}
          className='px-4 py-2 rounded-xl flex gap-2 items-center hover:scale-105 transition border border-foreground disabled:opacity-50'
          // disabled
        >
          <ThumbsUp className='w-5 h-5 text-emerald-500' />
          Support <span className='md:hidden'>{ homeShorthand }</span><span className='hidden md:block'>{ homeTeam }</span>
        </button>
        <button
          onClick={() => handleCheer(TeamType.AWAY)}
          className='px-4 py-2 rounded-xl flex gap-2 items-center hover:scale-105 transition border border-foreground disabled:opacity-50'
          // disabled
        >
          <ThumbsUp className='w-5 h-5 text-emerald-500/50' />
          Support <span className='md:hidden'>{ awayShorthand }</span><span className='hidden md:block'>{ awayTeam }</span>
        </button>
      </div>
    </motion.div>
  )
}

function Goalscorers({ fixtureData }: { fixtureData: LiveFixture }) {
  // Get goalscorers from matchEvents for live matches
  const goalscorersFromEvents = fixtureData.matchEvents
    .filter(event => event.eventType === 'goal')
    .map(event => ({
      team: event.team!._id,
      id: {
        _id: event.player?._id,
        name: event.player?.name
      },
      time: event.time,
      _id: event.id.toString()
    }));

  // Use goalScorers array for completed matches, matchEvents for live matches
  const goalscorers = goalscorersFromEvents;

  // Separate goalscorers by team
  const homeTeamScorers = goalscorers.filter(scorer => scorer.team === fixtureData.homeTeam._id);
  const awayTeamScorers = goalscorers.filter(scorer => scorer.team === fixtureData.awayTeam._id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-border/20"
    >
      <div className="flex items-center gap-2 mb-4">
        <Goal className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-medium text-white">Goalscorers</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Home Team Scorers */}
        <div>
          <h3 className="text-sm text-emerald-500 mb-2">{fixtureData.homeTeam.name}</h3>
          {homeTeamScorers.length > 0 ? (
            <div className="space-y-2">
              {homeTeamScorers.map(( scorer, index ) => (
                <div key={ scorer._id || index } className="text-sm text-white flex items-center gap-2">
                  <span>{scorer.id.name || 'Unknown' }</span>
                  <span className="text-muted-foreground">{scorer.time}'</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No goals</p>
          )}
        </div>

        {/* Away Team Scorers */}
        <div>
          <h3 className="text-sm text-emerald-500 mb-2">{fixtureData.awayTeam.name}</h3>
          {awayTeamScorers.length > 0 ? (
            <div className="space-y-2">
              {awayTeamScorers.map(( scorer, index ) => (
                <div key={ scorer._id || index } className="text-sm text-white flex items-center gap-2">
                  <span>{scorer.id.name || 'Unknown' }</span>
                  <span className="text-muted-foreground">{scorer.time}'</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No goals</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}