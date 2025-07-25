'use client'

import { Loader } from '@/components/ui/loader';
import { addPlayerToTeam, createPlayer, getTeamSuggestedPlayers } from '@/lib/requests/v2/admin/super-admin/player-management/requests';
import { getAllDepartments, getTeamById, getTeamPlayers, updateTeamCoaches } from '@/lib/requests/v2/admin/super-admin/team/requests';
import { checkSuperAdminStatus } from '@/lib/requests/v2/authentication/requests';
import { CoachRoles, FavoriteFoot, PlayerRole } from '@/utils/V2Utils/v2requestData.enums';
import { IV2FootballTeam, TeamPlayerDetails } from '@/utils/V2Utils/v2requestData.types';
import { MessageSquare, Plus, Star, Trash2, UserCog, UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

type Department = {
    _id: string;
    name: string;
    faculty: {
      _id: string;
      name: string;
    }
    createdAt: Date;
    updatedAt: Date;
}
type PossiblePlayers = { 
  _id: string, 
  name: string, 
  academicYear: string, 
  department?: { _id: string, name: string }
}
const IndividualSuperAdminTeamPage = (
  { params }:
  { params: Promise<{ id: string }> }
) => {
    const resolvedParams = use( params );
    const router = useRouter();

    // States //
    const [loading, setLoading] = useState<boolean>( true );
    const [team, setTeam] = useState<IV2FootballTeam | null>( null );
    const [players, setPlayers] = useState<TeamPlayerDetails[]>([]);
    const [possiblePlayers, setPossiblePlayers] = useState<PossiblePlayers[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'coaches' | 'settings'>('overview');
    // End of States //

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

        const teamData = await getTeamById( resolvedParams.id );
        const departmentData = await getAllDepartments();
        const teamPlayerData = await getTeamPlayers( resolvedParams.id );
        const possiblePlayersData = await getTeamSuggestedPlayers( resolvedParams.id );

        if( teamData && teamData.data ) {
          setTeam( teamData.data );
        }
        if( departmentData && departmentData.data ) {
          setDepartments( departmentData.data );
        }
        if( teamPlayerData && teamPlayerData.data ) {
          setPlayers( teamPlayerData.data.players );
        }
        if( possiblePlayersData && possiblePlayersData.data ) {
          setPossiblePlayers( possiblePlayersData.data.suggestedPlayers );
        }

        setLoading( false );
      }

      if( loading ) fetchData();
    }, [ loading ]);
    
    if( loading ) {
      return <Loader />
    };
    if( !loading && !team ) {
      return <div className='flex justify-center items-center'>Uh Oh! Team Does Not Exists</div>
    }
    // End of On Load //

    // Updates //
    const updateCoachList = ( coach: { name: string, role: CoachRoles } ) => {
      if( team ) {
        setTeam({
          ...team, 
          coaches: [...team.coaches, coach]
        });
      }
    }
    // End of Updates //
  return (
    <div>
      <div className='space-y-6 md:space-y-4'>
        {/* Header */}
        <div className=' flex items-center justify-between md:px-4 md:py-4 md:border md:rounded-lg'>
          <div className='flex gap-2 items-center'>
            <div className='w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold'>{ team?.name.slice(0,1) || 'U' }</div>
            <div>
              <p className='font-bold'>{ team?.name || 'Unknown' }</p>
              <div className='flex gap-2 items-center text-muted-foreground'>
                <span className=''>{ team?.department?.name || 'Unknown' }</span>
                <span className='w-1 h-1 bg-muted-foreground rounded-full'></span>
                <span className=''>{ team?.academicYear || '1998/1999' }</span>
              </div>
            </div>
          </div>          
          <span className='text-sm px-2 py-1 rounded-xl bg-blue-500/50 hidden md:block'>Team Admin</span>
        </div>

        {/* Accordition Tabs */}
        <div className='w-full overflow-x-scroll scrollbar-hide border rounded-lg flex md:grid md:grid-cols-4 items-center gap-2 bg-primary-foreground text-center'>
            {
              [ 'overview', 'players', 'coaches', 'settings' ].map( tab => (
                <div
                    key={ tab }
                    onClick={ () => { 
                      setActiveTab( tab as typeof activeTab );
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

        {/* Tabs Section */}
        { activeTab === 'overview' && 
          <Overview
            stats={ team?.stats }
            playerNumber={ players.length }
            captain={ players.find( player => player.role === 'captain' ) }
            viceCaptain={ players.find( player => player.role === 'vice-captain' ) }
            coaches={ team?.coaches || [] }
          /> 
        }
        { activeTab === 'players' && 
          <Players
            teamPlayers={ players }
            possiblePlayers={ possiblePlayers }
            departments={ departments }
            teamId={resolvedParams.id}
            setLoading={setLoading}
          /> 
        }
        { activeTab === 'coaches' && 
          <Coaches
            teamId={ team!._id }
            coaches={ team?.coaches || [] }
            updateCoach={ updateCoachList }
          /> 
        }
        { activeTab === 'settings' && 
          <Settings 
          /> 
        }
      </div>
    </div>
  )
}

const Overview = (
  { stats, playerNumber, captain, viceCaptain, coaches }:
  { 
    stats: { matchesPlayed: number; wins: number; draws: number; losses: number; goalsFor: number; goalsAgainst: number; cleanSheets: number; } | undefined,
    playerNumber: number | undefined,
    captain?: TeamPlayerDetails,
    viceCaptain?: TeamPlayerDetails,
    coaches: { name: string; role: CoachRoles }[]
  }
) => {
  return (
    <>
      {/* Team Stats */}
      <div className='grid grid-cols-12 gap-6'>
        <div className='col-span-12 md:col-span-8 space-y-4'>
          <div>
            <h2 className='text-xl font-bold mb-4 md:mb-2'>Team Statistics</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='text-center border border-blue-500 py-6 rounded-lg'>
                <span className='font-bold text-lg'>{ stats?.matchesPlayed || '0' }</span>
                <p>Fixtures</p>
              </div>
              <div className='text-center border border-emerald-500 py-6 rounded-lg'>
                <span className='font-bold text-lg'>{ stats?.wins || '0' }</span>
                <p>Wins</p>
              </div>
              <div className='text-center border border-muted-foreground py-6 rounded-lg'>
                <span className='font-bold text-lg'>{ stats?.draws || '0' }</span>
                <p>Draws</p>
              </div>
              <div className='text-center border border-red-500 py-6 rounded-lg'>
                <span className='font-bold text-lg'>{ stats?.losses || '0' }</span>
                <p>Losses</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className='text-xl font-bold mb-4 md:mb-2'>Team Information</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div className='px-6 py-4 rounded-lg space-y-4 border border-muted-foreground'>
                <p className='flex gap-2 font-bold text-lg items-center'>
                  <Users className='w-5 h-5' />
                  Squad
                </p>
                <div>
                  <p className='text-blue-500'>{ playerNumber }</p>
                  <span className='text-muted-foreground'>Registered Players</span>
                </div>
                <div>
                  <div className='flex justify-between items-center'>
                    <p>Captain:</p>
                    <span className='font-bold'>{ captain?.name || 'Not Set' }</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <p>Vice Captain:</p>
                    <span className='font-bold'>{ viceCaptain?.name || 'Not Set' }</span>
                  </div>
                </div>
              </div>
              <div className='px-6 py-4 rounded-lg space-y-4 border border-muted-foreground'>
                <p className='flex gap-2 font-bold text-lg items-center'>
                  <Users className='w-5 h-5' />
                  Coaching Staff
                </p>
                <div>
                  <p className='text-blue-500'>{ coaches.length }</p>
                  <span className='text-muted-foreground'>Active Coaches</span>
                </div>
                <div>
                  {
                    coaches.map( coach => <p key={ coach.name + coach.role }>{ coach.name } <span className='italic text-muted-foreground'>{`(${ coach.role } coach)`}</span></p> )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='hidden md:col-span-4 space-y-4 md:block'>
          <div className='p-4'>
            <h2 className='text-xl font-bold mb-4'>Quick Actions</h2>
            <div className='space-y-4'>
              <button
                onClick={() => {}}
                className='px-4 py-1 rounded-md border border-muted-foreground flex items-center gap-4 hover:text-emerald-500 hover:border-emerald-500 transition w-full'
              >
                <UserCog className='w-4 h-4' />
                Set Team Admin
              </button>
              <button
                onClick={() => {}}
                className='px-4 py-1 rounded-md border border-muted-foreground flex items-center gap-4 hover:text-emerald-500 hover:border-emerald-500 transition w-full'
              >
                <UserPlus className='w-4 h-4' />
                Register New Player
              </button>
              <button
                onClick={() => {}}
                className='px-4 py-1 rounded-md border border-muted-foreground flex items-center gap-4 hover:text-emerald-500 hover:border-emerald-500 transition w-full'
              >
                <Plus className='w-4 h-4' />
                Add Coach
              </button>
              <button
                onClick={() => {}}
                className='px-4 py-1 rounded-md border border-muted-foreground flex items-center gap-4 hover:text-emerald-500 hover:border-emerald-500 transition w-full'
              >
                <MessageSquare className='w-4 h-4' />
                Send Friendly Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

type PlayerRegistrationForm = {
  playerId: string;
  jerseyNumber: number;
  position: string;
  role: PlayerRole
}
type NewPlayerForm = {
  name: string;
  department: string;
  admissionYear: string;
  preferredFoot?: FavoriteFoot;
  weight?: string;
  height?: string;
}
const Players = (
  { teamPlayers, possiblePlayers, departments, teamId, setLoading }:
  { 
    teamPlayers: TeamPlayerDetails[], 
    possiblePlayers: PossiblePlayers[],
    departments: { _id: string, name: string }[],
    teamId: string,
    setLoading: (value: boolean) => void
  }
) => {
  const [formData, setFormData] = useState<PlayerRegistrationForm>({
    playerId: '',
    role: PlayerRole.PLAYER,
    jerseyNumber: 0,
    position: ''
  });
  const [createFormData, setCreateFormData] = useState<NewPlayerForm>({
    name: '',
    department: '',
    admissionYear: '',
    preferredFoot: FavoriteFoot.RIGHT,
    weight: '',
    height: ''
  });

  const handleCreatePlayer = async () => {
    const response = await createPlayer( createFormData );
    if(response?.code === '00') {
      toast.success(response.message);
      setCreateFormData({
        name: '', department: '', admissionYear: '', preferredFoot: FavoriteFoot.RIGHT,
        weight: '', height: ''
      });
    } else {
      toast.error(response?.message || 'An Error Occurred');
    }
  }
  const handleAddPlayerToTeam = async () => {
    const response = await addPlayerToTeam( 
      formData.playerId, 
      {
        ...formData,
        teamId
      } 
    );
    if(response?.code === '00') {
      toast.success(response.message);
      setCreateFormData({
        name: '', department: '', admissionYear: '', preferredFoot: FavoriteFoot.RIGHT,
        weight: '', height: ''
      });
    } else {
      toast.error(response?.message || 'An Error Occurred');
    }
    setLoading(true);
  }
  return (
    <>
      <div className='grid grid-cols-2 gap-4'>
        {/* Player Registration */}
        <div className='border border-muted-foreground p-4 col-span-2 md:col-span-1 rounded-lg'>
          <h2 className='text-xl font-bold mb-4'>Register Player</h2>
          <div className='space-y-4'>
            <div>
              <label className="block font-semibold mb-1.5">Select Player</label>
              <select 
                className="w-full p-2 border rounded cursor-pointer bg-input"
                value={ formData.playerId }
                onChange={ (e) => setFormData({ 
                    ...formData, 
                    playerId: e.target.value
                }) }
              >
                  <option value={''}>Select a Player</option>
                  {
                      possiblePlayers.map( player => (
                          <option key={ player._id } value={ player._id } className='flex flex-col'>
                            { player.name }
                            {`(${ player.academicYear })`}
                            {`(${ player.department?.name })`}
                          </option>
                      ))
                  }
              </select>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className="block font-semibold mb-1.5">Position</label>
                <select 
                  className="w-full p-2 border rounded cursor-pointer bg-input"
                  value={ formData.position }
                  onChange={ (e) => setFormData({ 
                      ...formData, 
                      position: e.target.value
                  }) }
                >
                    <option value={''}>Select a Position</option>
                    {
                        ['GK', 'CB', 'LB', 'RB', 'WB', 'DMF', 'AMF', 'CMF', 'ST', 'LW'].map( pos => (
                            <option key={ pos } value={ pos } className='flex flex-col'>
                              { pos }
                            </option>
                        ))
                    }
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1.5">Jersey Number</label>
                <input
                    type='number'
                    placeholder='1-99'
                    min={ 0 }
                    max={ 99 }
                    value={ formData.jerseyNumber }
                    onChange={
                      ( e ) => setFormData({
                        ...formData,
                        jerseyNumber: Number(e.target.value)
                    })
                  }
                  className='w-full p-2 border rounded bg-input'
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1.5">Role</label>
              <select 
                className="w-full p-2 border rounded cursor-pointer bg-input"
                value={ formData.role }
                onChange={ (e) => setFormData({ 
                    ...formData, 
                    role: e.target.value as PlayerRole
                }) }
              >
                  {
                      Object.values( PlayerRole ).map( role => (
                          <option key={ role } value={ role } className='flex flex-col'>
                            { role }
                          </option>
                      ))
                  }
              </select>
            </div>
            <button
              onClick={handleAddPlayerToTeam}
              className='w-full text-center py-2 bg-emerald-500 hover:bg-emerald-500/50 flex gap-2 items-center justify-center'
            >
              <UserPlus className='w-4 h-4' />
              <p>Register Player <span className='italic'>(add to team)</span></p>
            </button>
          </div>
        </div>
        {/* Player Creation */}
        <div className='border border-muted-foreground p-4 col-span-2 md:col-span-1 rounded-lg'>
          <h2 className='text-xl font-bold mb-4'>Create Player</h2>
          <div className='space-y-4'>
            <div>
              <label className="block font-semibold mb-1.5">Name</label>
              <input
                  type='text'
                  placeholder='e.g Thomas Muller'
                  value={ createFormData.name }
                  onChange={
                    ( e ) => setCreateFormData({
                      ...createFormData,
                      name: e.target.value
                  })
                }
                className='w-full p-2 border rounded bg-input'
              />
            </div>
            <div>
              <label className="block font-semibold mb-1.5">Department</label>
              <select 
                className="w-full p-2 border rounded cursor-pointer bg-input"
                value={ createFormData.department }
                onChange={ (e) => setCreateFormData({ 
                    ...createFormData, 
                    department: e.target.value as FavoriteFoot
                }) }
              >
                <option value={''}>Choose a department</option>
                {
                  departments.map( dept => (
                    <option key={ dept._id } value={ dept._id } className='flex flex-col'>
                      { dept.name }
                    </option>
                  ))
                }
              </select>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className="block font-semibold mb-1.5">Admission Year</label>
                <input
                    type='text'
                    placeholder='e.g 2024/2025'
                    value={ createFormData.admissionYear }
                    onChange={
                      ( e ) => setCreateFormData({
                        ...createFormData,
                        admissionYear: e.target.value
                    })
                  }
                  className='w-full p-2 border rounded bg-input'
                />
              </div>
              <div>
                <label className="block font-semibold mb-1.5">Preferred Foot</label>
                <select 
                  className="w-full p-2 border rounded cursor-pointer bg-input"
                  value={ createFormData.preferredFoot }
                  onChange={ (e) => setCreateFormData({ 
                      ...createFormData, 
                      preferredFoot: e.target.value as FavoriteFoot
                  }) }
                >
                  {
                    Object.values( FavoriteFoot ).map( foot => (
                      <option key={ foot } value={ foot } className='flex flex-col'>
                        { foot }
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className="block font-semibold mb-1.5">Weight(kg)</label>
                <input
                    type='text'
                    placeholder='e.g 75'
                    value={ createFormData.weight }
                    onChange={
                      ( e ) => setCreateFormData({
                        ...createFormData,
                        weight: e.target.value
                    })
                  }
                  className='w-full p-2 border rounded bg-input'
                />
              </div>
              <div>
                <label className="block font-semibold mb-1.5">Height(cm)</label>
                <input
                    type='text'
                    placeholder='e.g 183'
                    value={ createFormData.height }
                    onChange={
                      ( e ) => setCreateFormData({
                        ...createFormData,
                        height: e.target.value
                    })
                  }
                  className='w-full p-2 border rounded bg-input'
                />
              </div>
            </div>
            <button
              onClick={handleCreatePlayer}
              className='w-full text-center py-2 bg-emerald-500 hover:bg-emerald-500/50 flex gap-2 items-center justify-center'
            >
              <Plus className='w-4 h-4' />
              <p>Create Player <span className='italic'>(verified)</span></p>
            </button>
          </div>
        </div>
      </div>
      <div>
        {/* Current Squad */}
        <div>
          <h2 className='text-xl font-bold mb-4'>Current Squad <span>{`(${ teamPlayers.length } Players)`}</span></h2>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {
              teamPlayers.map( (player, i) => (
                <div
                  key={ player._id + player.name }
                  className='border border-emerald-500 p-4 rounded-md'
                >
                  <div className='flex gap-4 items-center'>
                    <div className='w-8 h-8 bg-blue-700 flex justify-center items-center rounded-full'>{ player.name.slice(0,1) }</div>
                    <div>
                      <div className='flex gap-2 items-center'>
                        <p>{ player.name }</p>
                        { player.role === PlayerRole.CAPTAIN && <Star className='w-4 h-4 text-emerald-500' /> }
                      </div>
                      <div className='flex gap-1 items-center text-muted-foreground'>
                        <span className=''>{ player.position }</span>
                        <span className='w-1 h-1 rounded-full bg-muted-foreground'></span>
                        <span className=''>{ player.admissionYear }</span>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}

type Coach = {
  name: string;
  role: CoachRoles;
}
const Coaches = (
  { teamId, coaches, updateCoach }: 
  {
    teamId: string, 
    coaches: { name: string, role: CoachRoles }[],
    updateCoach: ( coach: Coach ) => void,
  }
) => {
  const [formData, setFormData] = useState<{ name: string, role: string }>({
    name: '',
    role: ''
  });

  const handleAddCoach = async () => {
    const response = await updateTeamCoaches( teamId, formData.name, formData.role );
    if( response?.code === '00' ) {
      toast.success(response.data);
      updateCoach({ name: formData.name, role: formData.role as CoachRoles });
    } else {
      toast.error(response?.message || 'Error Adding Coach');
    }
  }
  const handleDeleteCoach = async ( name: string ) => {
    toast.error('Unimplemented')
  }
  return (
    <>
      <div className='grid grid-cols-2 gap-4'>
        <div className='border border-muted-foreground p-4 col-span-2 md:col-span-1 rounded-lg'>
          <h2 className='text-xl font-bold mb-4'>Add Coach</h2>
          <div className='space-y-4'>
            <div>
              <label className="block font-semibold mb-1.5">Name</label>
              <input
                  type='text'
                  placeholder='e.g Pep Guardiola'
                  value={ formData.name }
                  onChange={
                    ( e ) => setFormData({
                      ...formData,
                      name: e.target.value
                  })
                }
                className='w-full p-2 border rounded bg-input'
              />
            </div>
            <div>
              <label className="block font-semibold mb-1.5">Role</label>
              <select 
                className="w-full p-2 border rounded cursor-pointer bg-input"
                value={ formData.role }
                onChange={ (e) => setFormData({ 
                    ...formData, 
                    role: e.target.value
                }) }
              >
                <option value={''}>Select Role</option>
                {
                  Object.values( CoachRoles ).map( role => (
                    <option key={ role } value={ role } className='flex flex-col'>
                      { role }
                    </option>
                  ))
                }
              </select>
            </div>
            <button
              onClick={handleAddCoach}
              className='w-full text-center py-2 bg-emerald-500 hover:bg-emerald-500/50 flex gap-2 items-center justify-center disabled:opacity-50'
              disabled={formData.name === '' || formData.role === ''}
            >
              <Plus className='w-4 h-4' />
              <p>Add Coach</p>
            </button>
          </div>
        </div>
        <div className='border border-muted-foreground p-4 col-span-2 md:col-span-1 rounded-lg'>
          <h2 className='text-xl font-bold mb-4'>Coaching Staff ({ coaches.length })</h2>
          <div className='space-y-4'>
              {
                coaches.map( coach => (
                  <div
                    key={ coach.name } 
                    className='flex justify-between items-center px-4 py-2 border border-muted-foreground rounded-lg'
                  >
                    <div className='flex items-center gap-2'>
                      <div className='w-8 h-8 bg-blue-700 flex justify-center items-center rounded-full'>{ coach.name.slice(0,1) }</div>
                      <div>
                        <p>{ coach.name }</p>
                        <span className='text-muted-foreground text-sm capitalize'>{ coach.role } coach</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCoach( coach.name )}
                      className='text-red-500 bg-secondary/50 p-2 rounded-lg'
                    >
                      <Trash2 className='w-5 h-5' />
                    </button>
                  </div>
                ))
              }
          </div>
        </div>
      </div>
    </>
  )
}
const Settings = () => {
  return (
    <div>Settings</div>
  )
}

export default IndividualSuperAdminTeamPage