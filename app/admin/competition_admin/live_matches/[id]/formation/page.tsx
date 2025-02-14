'use client'

import { getFixtureTeamPlayerData } from '@/lib/requests/fixturePage/requests';
import { updateFixtureFormation } from '@/lib/requests/liveAdminPage/requests';
import useAuthStore from '@/stores/authStore';
import { Fixture, FixtureTeamPlayers } from '@/utils/requestDataTypes';
import { Players } from '@/utils/stateTypes';
import { ChevronDown, UserMinus2, UserPlus2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

type Formation = {
  formation: string,
  startingXI: string[],
  subs: string[]
}

const formations = [
  { name: "4-4-2", value: "442" },
  { name: "4-3-3", value: "433" },
  { name: "4-2-3-1", value: "4231" },
  { name: "3-5-2", value: "352" },
  { name: "5-3-2", value: "532" },
  { name: "3-4-3", value: "343" }
]

type PlayerMoveFunc = ( player: Players, team: 'homeTeam' | 'awayTeam', destinationSquad: 'starting' | 'substitutes' | 'available' ) => void;

const FormationPage = (
  { params }:
    { params: Promise<{ id: string }> }
) => {
  const resolvedParams = use( params );
  const router = useRouter();

  const { jwt } = useAuthStore();

  const [ loading, setLoading ] = useState<boolean>( true );
  const [ teamPlayers, setTeamPlayers ] = useState<FixtureTeamPlayers | null>( null );
  const [ homeLineup, setHomeLineup ] = useState<Formation>({
    formation: '',
    startingXI: [],
    subs: []
  });
  const [ awayLineup, setAwayLineup ] = useState<Formation>({
    formation: '',
    startingXI: [],
    subs: []
  });
  const [ homeDropdownOpen, setHomeDropdownOpen ] = useState<boolean>( false );
  const [ awayDropdownOpen, setAwayDropdownOpen ] = useState<boolean>( false );

  useEffect( () => {
    const fetchData = async () => {
      const data = await getFixtureTeamPlayerData( resolvedParams.id );
      if( data && data.code === '00' ) {
        setTeamPlayers( data.data );
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

  const updateFormation = async () => {
    const data = await updateFixtureFormation( resolvedParams.id, homeLineup, awayLineup, jwt! );
    if( data && data.code === '00' ) {
      toast.success( data.message )
      console.log( data.data )
    } else {
      toast.error( data?.message );
    }
  };
  const handleDropDownToggle = ( team: 'homeTeam' | 'awayTeam' ) => {
    if( team === 'homeTeam' ) {
      setHomeDropdownOpen( !homeDropdownOpen );
    } else {
      setAwayDropdownOpen( !awayDropdownOpen );
    }
  }
  const handleFormationChange = ( team: 'homeTeam' | 'awayTeam', formationValue: string ) => {
    if ( team === 'homeTeam' ) {
      setHomeLineup({ ...homeLineup, formation: formationValue });
      setHomeDropdownOpen(false);
    } else {
      setAwayLineup({ ...awayLineup, formation: formationValue });
      setAwayDropdownOpen( false );
    }
  };
  const handlePlayerMove: PlayerMoveFunc = ( player, team, destinationSquad ) => {
    const targetTeam = team === 'homeTeam' ? homeLineup : awayLineup;
    const setTeam = team === 'homeTeam' ? setHomeLineup : setAwayLineup;
    
    // Remove player from current position if already in a squad
    const newStarting = targetTeam.startingXI.filter( p => p !== player._id );
    const newSubstitutes = targetTeam.subs.filter( p => p !== player._id );
    
    // Add to destination squad if space available
    if ( destinationSquad === 'starting' && newStarting.length < 11 ) {
      setTeam( ( prev ) => ({
        ...prev,
        startingXI: [ ...newStarting, player._id ],
        subs: newSubstitutes
      }));
    } else if (destinationSquad === 'substitutes' && newSubstitutes.length < 7) {
      setTeam(( prev ) => ({
        ...prev,
        startingXI: newStarting,
        subs: [ ...newSubstitutes, player._id ]
      }));
    } else if (destinationSquad === 'available') {
      setTeam( ( prev ) => ({
        ...prev,
        startingXI: newStarting,
        subs: newSubstitutes
      }));
    }
  };
  return (
    <div className="">
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-4">Team Selection</h2>
      
      {/* Save Button */}
      <div className='w-full flex justify-center items-center mb-2'>
        <button
          onClick={ updateFormation }
          className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-50'
          disabled={ homeLineup.startingXI.length !== 11 || awayLineup.startingXI.length !== 11 }
        >
          Save Formation
        </button>
      </div>

      {/* Team Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <TeamSection
          team={ homeLineup }
          availablePlayers={ teamPlayers }
          title={`${ teamPlayers?.homeTeam.name }( Home )`}
          onPlayerMove={ handlePlayerMove }
          side="homeTeam"
          handleFormationChange={ handleFormationChange }
          dropdownOpen={ homeDropdownOpen }
          handleDropDownToggle={ handleDropDownToggle }
        />
        <TeamSection
          team={ awayLineup }
          availablePlayers={ teamPlayers }
          title={`${ teamPlayers?.awayTeam.name }( Away )`}
          onPlayerMove={ handlePlayerMove }
          side="awayTeam"
          handleFormationChange={ handleFormationChange }
          dropdownOpen={ awayDropdownOpen }
          handleDropDownToggle={ handleDropDownToggle }
        />
      </div>
    </div>
  )
}

const TeamSection = (
  { team, availablePlayers, title, onPlayerMove, side, handleFormationChange, handleDropDownToggle, dropdownOpen }:
  { team: Formation, availablePlayers: FixtureTeamPlayers | null, title: string, onPlayerMove: PlayerMoveFunc, side: keyof FixtureTeamPlayers, handleFormationChange: ( team: "homeTeam" | "awayTeam", formationValue: string ) => void, handleDropDownToggle: ( team: 'homeTeam' | 'awayTeam' ) => void, dropdownOpen: boolean }
) => {
  const isPlayerInSquad = ( playerId: string ) => {
    return team.startingXI.some( p => p === playerId ) ||
           team.subs.some( p => p === playerId );
  };

  return (
    <div className='bg-card/40 backdrop-blur-sm'>
      <h2 className='font-bold'>{ title }</h2>

      {/* Formation */}
      <div className="w-full max-w-xs my-2">
        <label className="block text-sm font-medium mb-1">Formation</label>
        <FormationDropdown 
          team={ side }
          value={ team.formation }
          isOpen={ dropdownOpen }
          setIsOpen={ handleDropDownToggle }
          handleFormationChange={ handleFormationChange }
        />
      </div>

      <div className='space-y-6'>
        {/* Selected Squads */}
        <div className="space-y-6">
          <TeamSquad
            players={ team.startingXI }
            title="Starting XI"
            onRemove={( player ) => onPlayerMove( player, side, 'available' ) }
            maxPlayers={ 11 }
            team={ side }
            teamPlayers={ availablePlayers }
          />
          <TeamSquad
            players={ team.subs }
            title="Substitutes"
            onRemove={( player ) => onPlayerMove( player, side, 'available' ) }
            maxPlayers={ 7 }
            team={ side }
            teamPlayers={ availablePlayers }
          />
        </div>

        {/* Available Players */}
        <div className="space-y-2">
            <h3 className="font-medium text-sm">Available Players</h3>
            <div className="space-y-2">
              {
                availablePlayers && availablePlayers[ side ].players.filter(player => !isPlayerInSquad(player._id)).map(( player, index ) => (
                <div
                  key={player._id}
                  className="flex items-center justify-between p-2 bg-card hover:bg-card/80 rounded-lg border border-border transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-emerald-500 text-white rounded-full text-sm">
                      { index }
                    </span>
                    <span className="font-medium">{player.name}</span>
                    <span className="text-sm text-muted-foreground">{player.position}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onPlayerMove(player, side, 'starting')}
                      disabled={team.startingXI.length >= 11}
                      className="flex items-center space-x-1 px-2 py-1 text-sm rounded-md hover:bg-emerald-500 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit transition-colors"
                      title="Add to Starting XI"
                    >
                      <span>Starting</span>
                      <UserPlus2 size={16} />
                    </button>
                    <button
                      onClick={ () => onPlayerMove( player, side, 'substitutes' ) }
                      disabled={ team.subs.length >= 7 }
                      className="flex items-center space-x-1 px-2 py-1 text-sm rounded-md hover:bg-emerald-500 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit transition-colors"
                      title="Add to Substitutes"
                    >
                      <span>Sub</span>
                      <UserPlus2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  )
}

const TeamSquad = (
  { players, title, onRemove, maxPlayers, team, teamPlayers }:
  { players: string[] | [], title: string, onRemove: ( player: Players ) => void, maxPlayers: number, team: keyof FixtureTeamPlayers, teamPlayers: FixtureTeamPlayers | null }
) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-sm">{ title }</h3>
        <span className="text-sm text-muted-foreground">
          { players.length }/{ maxPlayers }
        </span>
      </div>
      <div className="space-y-2">
        {
          players.map(( p, index ) => {
            const player = teamPlayers![ team ].players.find( pl => pl._id === p );
            return (
              <div
                key={ player ? player._id : index }
                className="flex items-center justify-between p-2 bg-card hover:bg-card/80 rounded-lg border border-border transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 flex items-center justify-center bg-emerald-500 text-white rounded-full text-sm">
                    { index }
                  </span>
                  <span className="font-medium">{ player ? player.name : '' }</span>
                  <span className="text-sm text-muted-foreground">{ player ? player.position : '' }</span>
                </div>
                <button
                  onClick={ () => onRemove( player! ) }
                  className="p-1 hover:text-red-500 transition-colors"
                  title="Remove player"
                >
                  <UserMinus2 size={ 16 } />
                </button>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

const FormationDropdown = (
  { team, value, isOpen, setIsOpen, handleFormationChange }: 
  { team: 'homeTeam' | 'awayTeam', value: string, isOpen: boolean, setIsOpen: ( team: 'homeTeam' | 'awayTeam' ) => void, handleFormationChange: ( team: "homeTeam" | "awayTeam", formationValue: string ) => void }
) => {
  const currentFormation = formations.find(f => f.value === value)?.name || "Select Formation";
  
  return (
    <div className="relative">
      <button
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-card rounded-md border border-border"
        onClick={ () => setIsOpen( team ) }
      >
        <span>{ currentFormation }</span>
        <ChevronDown size={ 16 } className={ `transition-transform ${ isOpen ? 'rotate-180' : '' }` } />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-card rounded-md border border-border shadow-lg">
          <ul className="py-1">
            {formations.map(( formation ) => (
              <li 
                key={formation.value}
                className="px-3 py-2 text-sm hover:bg-emerald-500 hover:text-white cursor-pointer transition-colors"
                onClick={() => handleFormationChange( team, formation.value )}
              >
                {formation.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FormationPage