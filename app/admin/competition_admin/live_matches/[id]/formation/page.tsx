'use client'

import FormationDropdown from '@/components/liveAdmin/FormationDropDown';
import TeamSection from '@/components/liveAdmin/TeamSection';
import TeamSquad from '@/components/liveAdmin/TeamSquad';
import { getFixtureTeamPlayerData } from '@/lib/requests/v1/fixturePage/requests';
import { updateFixtureFormation, updateLiveFixtureFormation } from '@/lib/requests/v1/liveAdminPage/requests';
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
      setTimeout( () => router.push('/admin/competition_admin/live_matches'), 1000 )
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
        {/* <TeamSection
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
        /> */}
      </div>
    </div>
  )
}

export default FormationPage