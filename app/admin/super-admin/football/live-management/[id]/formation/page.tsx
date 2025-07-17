'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import TeamSection from '@/components/liveAdmin/TeamSection';
import { getLiveFixtureTeamPlayers, updateLiveFixtureLineup } from '@/lib/requests/v2/admin/super-admin/live-management/requests';
import { checkSuperAdminStatus } from '@/lib/requests/v2/authentication/requests';
import { Players } from '@/utils/stateTypes';
import { PlayerRole } from '@/utils/V2Utils/v2requestData.enums';
import { FixtureLineup, FixtureLineupUnPop } from '@/utils/V2Utils/v2requestSubData.types';
import { toast } from 'react-toastify';

interface LiveFixTeamPlayers {
  homePlayers: {
    _id: string;
    name: string;
    admissionYear: string;
    role: PlayerRole;
    position: string;
    jerseyNumber: number;
  }[];
  awayPlayers: {
    _id: string;
    name: string;
    admissionYear: string;
    role: PlayerRole;
    position: string;
    jerseyNumber: number;
  }[];
}
type PlayerMoveFunc = ( 
  player: {
    player: string,
    position: string,
    shirtNumber: number,
    isCaptain: boolean,
  }, 
  team: 'homePlayers' | 'awayPlayers', 
  destinationSquad: 'starting' | 'substitutes' | 'available' 
) => void;

const FormationPage = (
  { params }:
    { params: Promise<{ id: string }> }
) => {
  const resolvedParams = use( params );
  const router = useRouter();

  const [ loading, setLoading ] = useState<boolean>( true );
  const [ teamPlayers, setTeamPlayers ] = useState<LiveFixTeamPlayers | null>( null );
  const [ homeLineup, setHomeLineup ] = useState<FixtureLineupUnPop>({
    formation: '',
    startingXI: [],
    substitutes: [],
    coach: ''
  });
  const [ awayLineup, setAwayLineup ] = useState<FixtureLineupUnPop>({
    formation: '',
    startingXI: [],
    substitutes: [],
    coach: ''
  });
  const [ homeDropdownOpen, setHomeDropdownOpen ] = useState<boolean>( false );
  const [ awayDropdownOpen, setAwayDropdownOpen ] = useState<boolean>( false );

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

      const data = await getLiveFixtureTeamPlayers( resolvedParams.id );
      if( data && data.code === '00' ) {
        setTeamPlayers( data.data );
      }
      setLoading( false );
    }

    if( loading ) fetchData();
  }, [ loading ]);

  const updateFormation = async () => {
    const formData = { 
      lineups: { 
        home: homeLineup, 
        away: awayLineup 
      } 
    }
    const data = await updateLiveFixtureLineup( resolvedParams.id, formData );
    if( data && data.code === '00' ) {
      toast.success( data.message )
      setTimeout( () => router.push(`/`), 1000 )
    } else {
      toast.error( data?.message || 'An Error Occurred' );
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
    const targetTeam = team === 'homePlayers' ? homeLineup : awayLineup;
    const setTeam = team === 'homePlayers' ? setHomeLineup : setAwayLineup;
    
    // Remove player from current position if already in a squad
    const newStarting = targetTeam.startingXI.filter( p => p.player !== player.player );
    const newSubstitutes = targetTeam.substitutes.filter( p => p.player !== player.player );
    
    // Add to destination squad if space available
    if ( destinationSquad === 'starting' && newStarting.length < 11 ) {
      setTeam( ( prev ) => ({
        ...prev,
        startingXI: [ ...newStarting, player ],
        substitutes: newSubstitutes
      }));
    } else if (destinationSquad === 'substitutes' && newSubstitutes.length < 7) {
      setTeam(( prev ) => ({
        ...prev,
        startingXI: newStarting,
        substitutes: [ ...newSubstitutes, player ]
      }));
    } else if (destinationSquad === 'available') {
      setTeam( ( prev ) => ({
        ...prev,
        startingXI: newStarting,
        substitutes: newSubstitutes
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
          title={`( Home )`}
          onPlayerMove={ handlePlayerMove }
          side="homePlayers"
          handleFormationChange={ handleFormationChange }
          dropdownOpen={ homeDropdownOpen }
          handleDropDownToggle={ handleDropDownToggle }
        />
        <TeamSection
          team={ awayLineup }
          availablePlayers={ teamPlayers }
          title={`( Away )`}
          onPlayerMove={ handlePlayerMove }
          side="awayPlayers"
          handleFormationChange={ handleFormationChange }
          dropdownOpen={ awayDropdownOpen }
          handleDropDownToggle={ handleDropDownToggle }
        />
      </div>
    </div>
  )
}

export default FormationPage