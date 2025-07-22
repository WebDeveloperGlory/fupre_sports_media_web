'use client'

import { use, useEffect, useState } from 'react'
import { LiveFixData, LiveFixPlayerData } from '@/utils/V2Utils/getRequests';
import { checkHeadMediaAdminStatus } from '@/lib/requests/v2/authentication/requests';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getLiveFixtureById, getLiveFixtureTeamPlayers, updateOfficialPlayerRatings, updateOfficialPOTM } from '@/lib/requests/v2/admin/super-admin/live-management/requests';
import { Loader } from '@/components/ui/loader';
import { BarChart3, Check, Star, Timer, Trophy, Users, X } from 'lucide-react';
import { LivFixPlayerRatingOfficial, LivFixPOTMOfficial } from '@/utils/V2Utils/formData';
import { set } from 'lodash';
import { TeamType } from '@/utils/V2Utils/v2requestData.enums';
import { countPOTMVotes } from '@/constants';

const POTMMangementPage = (
    { params }:
    { params: Promise<{ id: string }> }
) => {
    const resolvedParams = use( params );
    const router = useRouter();

    // States //
    const [loading, setLoading] = useState( true );
    const [currentTime, setCurrentTime] = useState<Date>( new Date() );
    const [fixture, setFixture] = useState<LiveFixData | null>( null );
    const [teamPlayers, setTeamPlayers] = useState<LiveFixPlayerData | null>( null );
    const [activeTab, setActiveTab] = useState<string>('player ratings');
    const [team, setTeam] = useState<keyof LiveFixData['lineups']>('home');
    const [ratingFormData, setRatingFormData] = useState<LivFixPlayerRatingOfficial>({
        playerId: '',
        isHomePlayer: true,
        rating: 1, // 0-10
        stats: {
            goals: 0,
            assists: 0,
            shots: 0,
            passes: 0,
            tackles: 0,
            saves: 0,
        },
    });
    const [potmFormData, setPotmFormData] = useState<LivFixPOTMOfficial>({ playerId: '' })
    // End of States //

    // On Load //
    useEffect( () => {
        const fetchData = async () => {
        const request = await checkHeadMediaAdminStatus();
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

    // Button Clicks //
    const handleSaveRating = async () => {
        if( !ratingFormData.playerId ) {
            toast.error('Please select a player to rate');
            return;
        }

        const response = await updateOfficialPlayerRatings(fixture!._id, ratingFormData);
        if(response?.code === '00') {
            toast.success(response.message || 'Rating saved successfully');
            setRatingFormData({
                playerId: '',
                isHomePlayer: true,
                rating: 1,
                stats: {
                    goals: 0,
                    assists: 0,
                    shots: 0,
                    passes: 0,
                    tackles: 0,
                    saves: 0,
                },
            });
            setLoading(true);
        } else {
            toast.error(response?.message || 'Failed to save rating');
        }
    } 
    const handleSavePOTM = async () => {
        if( potmFormData.playerId === '' ) {
            toast.error('Please select a player to rate');
            return;
        }

        const response = await updateOfficialPOTM(fixture!._id, potmFormData);
        if(response?.code === '00') {
            toast.success(response.message || 'POTM saved successfully');
            setPotmFormData({ playerId: '' });
            setLoading(true);
        } else {
            toast.error(response?.message || 'Failed to save POTM');
        }
    } 
    // End of Button Clicks // 

    // Others //
    const playerInRatings = fixture?.playerRatings.find(player => player.player._id === potmFormData.playerId);
    const POTMVotes = countPOTMVotes( fixture?.playerOfTheMatch.userVotes || [] );
    // End of Others //

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
            <p className='text-xl font-bold'>{ fixture?.playerRatings.length }</p>
            <p className='text-muted-foreground'>Rated Players</p>
            </div>
            <div className='flex items-center justify-center py-6 flex-col border border-muted-foreground bg-card rounded-lg'>
            <p className='text-xl font-bold'>{ 
                fixture && fixture.playerOfTheMatch.official 
                    ?  <Check className='w-6 h-6' />
                    : <X className='w-6 h-6' />
                }</p>
            <p className='text-muted-foreground'>Official POTM</p>
            </div>
        </div>

        {/* Accordition Tabs */}
        <div className='w-full overflow-x-scroll scrollbar-hide border rounded-lg flex md:grid md:grid-cols-2 items-center gap-2 bg-primary-foreground text-center'>
            {
                ['player ratings', 'player of the match'].map( tab => (
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

        {/* Player Ratings */}
        {
            activeTab === 'player ratings' && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Rate Player */}
                    <div className='px-4 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
                        {/* Title */}
                        <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
                            <Star className='w-5 h-5' />
                            Rate Player
                        </h2>

                        {/* Form body */}
                        <div className='space-y-4 mt-4'>
                            {/* Team */}
                            <div>
                                <label className="block font-semibold mb-1.5">Select Team</label>
                                <select 
                                    className="w-full p-2 border rounded cursor-pointer bg-input"
                                    value={ team }
                                    onChange={ (e) => {
                                        setTeam(e.target.value as keyof LiveFixData['lineups']);
                                        setRatingFormData({
                                            ...ratingFormData, 
                                            isHomePlayer: e.target.value === 'home',
                                            playerId: ''
                                        });
                                    } }
                                >
                                    {
                                        ['home', 'away'].map( team => (
                                            <option 
                                                key={ team } 
                                                value={ team } 
                                                className='flex flex-col'
                                            >
                                                { team }
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Player */}
                            <div>
                                <label className="block font-semibold mb-1.5">Select Player</label>
                                <select 
                                    className="w-full p-2 border rounded cursor-pointer bg-input"
                                    value={ ratingFormData.playerId }
                                    onChange={ (e) => setRatingFormData({ 
                                        ...ratingFormData, 
                                        playerId: e.target.value
                                    }) }
                                >
                                    <option value="" disabled>Select Player</option>
                                    {
                                        fixture && [...fixture.lineups[team].startingXI, ...fixture.lineups[team].substitutes].map( player => (
                                            <option 
                                                key={ player.player._id } 
                                                value={ player.player._id } 
                                                className='flex flex-col'
                                            >
                                                { player.player.name }
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Rating Slider */}
                            <div>
                                <div className="flex justify-between items-center">
                                    <p className='text-sm'>Your rating:</p>
                                    <div className='bg-muted px-2 py-1 flex gap-1 items-center text-sm font-bold rounded-lg'>
                                        <Star className='w-4 h-4 text-emerald-500' />
                                        { ratingFormData.rating }
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
                                        value={ ratingFormData.rating }
                                        onChange={ (e) => setRatingFormData({ 
                                            ...ratingFormData, 
                                            rating: parseFloat(e.target.value)
                                        }) } 
                                        className='w-full cursor-pointer' 
                                    />
                                    <p>10</p>
                                </div>
                            </div>

                            {/* Goals and Assists */}
                            <div className='grid grid-cols-2 gap-4'>
                                {/* Goals */}
                                <div>
                                    <label className="block font-semibold mb-1.5">Goals</label>
                                    <input
                                        type='number'
                                        placeholder='0'
                                        min={ 0 }
                                        value={ ratingFormData.stats!.goals }
                                        onChange={
                                            ( e ) => setRatingFormData({
                                                ...ratingFormData,
                                                stats: {
                                                    ...ratingFormData.stats,
                                                    goals: Number(e.target.value)
                                                }
                                            })
                                        }
                                        className='w-full p-2 border rounded bg-input'
                                    />
                                </div>
                                {/* Assists */}
                                <div>
                                    <label className="block font-semibold mb-1.5">Assists</label>
                                    <input
                                        type='number'
                                        placeholder='0'
                                        min={ 0 }
                                        value={ ratingFormData.stats!.assists }
                                        onChange={
                                            ( e ) => setRatingFormData({
                                                ...ratingFormData,
                                                stats: {
                                                    ...ratingFormData.stats,
                                                    assists: Number(e.target.value)
                                                }
                                            })
                                        }
                                        className='w-full p-2 border rounded bg-input'
                                    />
                                </div>
                            </div>

                            {/* Shots and Passes */}
                            <div className='grid grid-cols-2 gap-4'>
                                {/* Shots */}
                                <div>
                                    <label className="block font-semibold mb-1.5">Shots</label>
                                    <input
                                        type='number'
                                        placeholder='0'
                                        min={ 0 }
                                        value={ ratingFormData.stats!.shots }
                                        onChange={
                                            ( e ) => setRatingFormData({
                                                ...ratingFormData,
                                                stats: {
                                                    ...ratingFormData.stats,
                                                    shots: Number(e.target.value)
                                                }
                                            })
                                        }
                                        className='w-full p-2 border rounded bg-input'
                                    />
                                </div>
                                {/* Passes */}
                                <div>
                                    <label className="block font-semibold mb-1.5">Passes</label>
                                    <input
                                        type='number'
                                        placeholder='0'
                                        min={ 0 }
                                        value={ ratingFormData.stats!.passes }
                                        onChange={
                                            ( e ) => setRatingFormData({
                                                ...ratingFormData,
                                                stats: {
                                                    ...ratingFormData.stats,
                                                    passes: Number(e.target.value)
                                                }
                                            })
                                        }
                                        className='w-full p-2 border rounded bg-input'
                                    />
                                </div>
                            </div>

                            {/* Tackles and Saves */}
                            <div className='grid grid-cols-2 gap-4'>
                                {/* Tackles */}
                                <div>
                                    <label className="block font-semibold mb-1.5">Tackles</label>
                                    <input
                                        type='number'
                                        placeholder='0'
                                        min={ 0 }
                                        value={ ratingFormData.stats!.tackles }
                                        onChange={
                                            ( e ) => setRatingFormData({
                                                ...ratingFormData,
                                                stats: {
                                                    ...ratingFormData.stats,
                                                    tackles: Number(e.target.value)
                                                }
                                            })
                                        }
                                        className='w-full p-2 border rounded bg-input'
                                    />
                                </div>
                                {/* Saves */}
                                <div>
                                    <label className="block font-semibold mb-1.5">Saves</label>
                                    <input
                                        type='number'
                                        placeholder='0'
                                        min={ 0 }
                                        value={ ratingFormData.stats!.saves }
                                        onChange={
                                            ( e ) => setRatingFormData({
                                                ...ratingFormData,
                                                stats: {
                                                    ...ratingFormData.stats,
                                                    saves: Number(e.target.value)
                                                }
                                            })
                                        }
                                        className='w-full p-2 border rounded bg-input'
                                    />
                                </div>
                            </div>

                            {/* Save Rating */}
                            <div className='w-full'>
                                <button
                                    onClick={handleSaveRating}
                                    className='w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                                    disabled={!ratingFormData.playerId || ratingFormData.rating < 1 || ratingFormData.rating > 10}
                                >
                                    Save Rating
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Official Ratings */}
                    <div className='px-4 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
                        {/* Title */}
                        <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
                            <BarChart3 className='w-5 h-5' />
                            Current Official Ratings
                        </h2>

                        {/* Ratings List */}
                        <div className='space-y-4 mt-4'>
                            {
                                fixture && fixture.playerRatings.map((player, i) => (
                                    <div 
                                        key={ player.player._id }
                                        className='border border-muted-foreground bg-card p-4 rounded-lg space-y-4'
                                    >
                                        <div className='flex justify-between items-center'>
                                            {/* Player Details */}
                                            <div className='flex items-center gap-3'>
                                                <div className='flex items-center justify-center w-8 h-8 rounded-full border border-muted-foreground bg-card'>{ i+1 }</div>
                                                <div>
                                                    <p>{ player.player.name }</p>
                                                    <span className='text-muted-foreground text-sm'>{ player.team === TeamType.HOME ? fixture.homeTeam.name : fixture.awayTeam.name }</span>
                                                </div>
                                            </div>
                                            {/* Official Rating */}
                                            <div className='bg-muted px-2 py-1 flex gap-1 items-center text-sm font-bold rounded-lg'>
                                                <Star className='w-4 h-4 text-emerald-500' />
                                                { player.official ? player.official.rating : 'Not Rated Yet'  }
                                            </div>
                                        </div>
                                        {
                                            player.stats && (
                                                <div className='grid grid-cols-4 gap-2 text-sm text-muted-foreground'>
                                                    <p>Goals: {player.stats.goals}</p>
                                                    <p>Assists: {player.stats.assists}</p>
                                                    <p>Shots: {player.stats.shots}</p>
                                                    <p>Passes: {player.stats.passes}</p>
                                                    <p>Tackles: {player.stats.tackles}</p>
                                                    <p>Saves: {player.stats.saves}</p>
                                                </div>
                                            )
                                        }
                                        <div className='text-sm'>
                                            <p>Fan Rating: {player.fanRatings.average} ({player.fanRatings.count} votes)</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )
        }
        
        {/* POTM */}
        {
            activeTab === 'player of the match' && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Set POTM */}
                    <div className='px-4 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
                        {/* Title */}
                        <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
                            <Trophy className='w-5 h-5' />
                            Set Official POTM
                        </h2>

                        {/* Form body */}
                        <div className='space-y-4 mt-4'>
                            {/* Team */}
                            <div>
                                <label className="block font-semibold mb-1.5">Select Team</label>
                                <select 
                                    className="w-full p-2 border rounded cursor-pointer bg-input"
                                    value={ team }
                                    onChange={ (e) => {
                                        setTeam(e.target.value as keyof LiveFixData['lineups']);
                                        setPotmFormData({ playerId: '' });
                                    } }
                                >
                                    {
                                        ['home', 'away'].map( team => (
                                            <option 
                                                key={ team } 
                                                value={ team } 
                                                className='flex flex-col'
                                            >
                                                { team }
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Player */}
                            <div>
                                <label className="block font-semibold mb-1.5">Select Player</label>
                                <select 
                                    className="w-full p-2 border rounded cursor-pointer bg-input"
                                    value={ potmFormData.playerId }
                                    onChange={ 
                                        (e) => setPotmFormData({ 
                                            playerId: e.target.value
                                        }) 
                                    }
                                >
                                    <option value="" disabled>Select Player</option>
                                    {
                                        fixture && [...fixture.lineups[team].startingXI, ...fixture.lineups[team].substitutes].map( player => (
                                            <option 
                                                key={ player.player._id } 
                                                value={ player.player._id } 
                                                className='flex flex-col'
                                            >
                                                { player.player.name }
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Show Currently Selected */}
                            {
                                fixture && potmFormData.playerId !== '' && playerInRatings && (
                                    <div className='p-4 border border-yellow-400 bg-yellow-200/20 rounded-lg text-yellow-500 mt-4 flex items-center gap-4'>
                                        <Trophy className='w-5 h-5' />
                                        <div>
                                            <p className='font-bold text-lg'>{playerInRatings.player.name}</p>
                                            <span className='text-muted-foreground text-sm'>{ playerInRatings.team === TeamType.HOME ? fixture.homeTeam.name : fixture.awayTeam.name }</span>
                                            <p className='text-yellow-500'>Official Rating: {playerInRatings.official ? playerInRatings.official.rating : 'Not Rated Yet'}</p>
                                        </div>
                                    </div>
                                )
                            }

                            {/* Save POTM */}
                            <div className='w-full'>
                                <button
                                    onClick={handleSavePOTM}
                                    className='w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                                    disabled={ potmFormData.playerId === '' }
                                >
                                    Save Official POTM
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Fan Results */}
                    <div className='px-4 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
                        {/* Title */}
                        <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
                            <Users className='w-5 h-5' />
                            Fan Voting Results
                        </h2>

                        {/* Voting List */}
                        <div className='space-y-4 mt-4'>
                            <p>Total Fan Votes: {POTMVotes.totalVotes || 0}</p>
                            {
                                POTMVotes.players.map((player, i) => (
                                    <div 
                                        key={player._id}
                                        className='border border-muted-foreground bg-card p-4 rounded-lg space-y-4'
                                    >
                                        <div className='flex justify-between items-center'>
                                            {/* Player Details */}
                                            <div className='flex items-center gap-3'>
                                                <div className='flex items-center justify-center w-8 h-8 rounded-full border border-muted-foreground bg-card'>{i+1}</div>
                                                <div>
                                                    <p>{player.name}</p>
                                                    <span className='text-muted-foreground text-sm'>Unknown</span>
                                                </div>
                                            </div>
                                            {/* Fan Votes */}
                                            <div>
                                                <p>{player.totalVotes} votes</p>
                                                <span className='text-sm text-muted-foreground'>{(player.totalVotes / POTMVotes.totalVotes * 100).toFixed(2)}%</span>
                                            </div>
                                        </div>
                                        <div className='text-sm'>
                                            <p>Fan Rating</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        {/* Official POTM */}
                        {
                            fixture && fixture.playerOfTheMatch.official && (
                                <div className='p-4 border border-yellow-400 bg-yellow-200/20 rounded-lg text-yellow-500 mt-4'>
                                    <p className='flex items-center gap-2'>
                                        <Trophy className='w-5 h-5' />
                                        Official Player of the Match
                                    </p>
                                    <p className='font-bold text-lg'>{fixture.playerOfTheMatch.official.name}</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default POTMMangementPage