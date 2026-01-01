'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import { Trophy, Users, Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";
import { getIndividualTeam, getIndividualTeamFixtures, getIndividualTeamOverview, getIndividualTeamPlayers, getIndividualTeamStats } from "@/lib/requests/v1/teamPage/requests";
import { Team } from "@/utils/stateTypes";
import { teamLogos } from "@/constants";
import { TeamFixtureType, TeamOverviewData, TeamPlayersData, TeamStatData } from "@/utils/requestDataTypes";
import { format } from "date-fns";

export default function TeamPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params);
  
  const [ loading, setLoading ] = useState<boolean>( true );
  const [ team, setTeam ] = useState<Team & { coach?: string, assistantCoach?: string } | null>( null );
  const [ teamStats, setTeamStats ] = useState<TeamStatData | null>( null );
  const [ teamOverview, setTeamOverview ] = useState<TeamOverviewData | null>( null );
  const [ teamPlayerList, setTeamPlayerList ] = useState<TeamPlayersData | null>( null );
  const [ teamFixtures, setTeamFixtures ] = useState<TeamFixtureType[] | null>( null );
  
  useEffect( () => {
      const fetchData = async () => {
        const overviewData = await getIndividualTeamOverview( resolvedParams.id );
        if( overviewData && overviewData.data ) {
          setTeamOverview( overviewData.data );
        }
        const fixtureData = await getIndividualTeamFixtures( resolvedParams.id );
        if( fixtureData && fixtureData.data ) {
          setTeamFixtures( fixtureData.data );
        }
        const playerData = await getIndividualTeamPlayers( resolvedParams.id );
        if( playerData && playerData.data ) {
          setTeamPlayerList( playerData.data );
        }
        const statData = await getIndividualTeamStats( resolvedParams.id );
        if( statData && statData.data ) {
          const summary = statData.data.find( ( d: { title: string } ) => d.title === 'Summary' );
          const attack = statData.data.find( ( d: { title: string } ) => d.title === 'Attacking' );
          const defense = statData.data.find( ( d: { title: string } ) => d.title === "Defending" );

          setTeamStats({
            attack, defense, summary
          })
        }
        const teamData = await getIndividualTeam( resolvedParams.id );
        if( teamData && teamData.data ) {
          setTeam({ 
            name: teamData.data.name,
            _id: teamData.data._id,
            coach: teamData.data.coach,
            assistantCoach: teamData.data.assistantCoach,
          })
        }
        console.log({ playerData, fixtureData, statData, overviewData, teamData })
        setLoading( false );
      }

      if( loading ) fetchData();
  }, [ loading, resolvedParams.id ]);

  if( loading ) {
    return <Loader />
  } else if ( !loading && !team ) {
    return <div>Team not found</div>;
  }

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="fixed top-8 left-4 md:left-8 z-10">
        <BackButton />
      </div>

      <div className="pt-16 md:pt-0 space-y-6 max-w-6xl mx-auto">
        <BlurFade>
          <div className="space-y-6">
            {/* Team Header */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <Image
                    src={ teamLogos[ team!.name ] || '/images/team_logos/default.jpg' }
                    alt={ team?.name || 'Team Logo' }
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{ team?.name }</h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-emerald-500" />
                      <span>Department: { teamOverview?.info.department }</span>
                    </div>
                    <span>•</span>
                    <span>{ teamOverview?.info.level } lvl</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold text-emerald-500">{ teamOverview?.competitions.length }</div>
                <div className="text-sm text-muted-foreground">Competitons Registered</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold text-emerald-500">{ teamOverview?.info.playerCount }</div>
                <div className="text-sm text-muted-foreground">Players Registered</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold text-emerald-500">{ teamStats?.summary.data.matches }</div>
                <div className="text-sm text-muted-foreground">Games Played</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold text-emerald-500">{ teamStats!.defense.data.cleanSheets }</div>
                <div className="text-sm text-muted-foreground">Clean Sheets</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold text-orange-500">{ teamStats?.summary.data.goalsScored }</div>
                <div className="text-sm text-muted-foreground">Goals Scored</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold text-red-500">{ teamStats?.summary.data.goalsConceded }</div>
                <div className="text-sm text-muted-foreground">Goals Conceded</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold">
                  { teamStats!.summary.data.goalsScored - teamStats!.summary.data.goalsConceded }
                </div>
                <div className="text-sm text-muted-foreground">Goal Difference</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold">
                  { teamStats!.attack.data.goalsPerGame }
                </div>
                <div className="text-sm text-muted-foreground">Goals Scored Per Game</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold">
                  { teamStats!.defense.data.goalsConcededPerGame }
                </div>
                <div className="text-sm text-muted-foreground">Goals Conceded Per Game</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold">
                  { teamStats!.attack.data.cornersPerGame }
                </div>
                <div className="text-sm text-muted-foreground">Corners Per Game</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold">
                  { teamStats!.attack.data.offsidesPerGame }
                </div>
                <div className="text-sm text-muted-foreground">Offsides Per Game</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold">
                  { teamStats!.defense.data.foulsPerGame }
                </div>
                <div className="text-sm text-muted-foreground">Fouls Per Game</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold">
                  { teamStats!.defense.data.yellowCardsPerGame }
                </div>
                <div className="text-sm text-muted-foreground">Yellow Cards Per Game</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold">
                  { teamStats!.defense.data.redCardsPerGame }
                </div>
                <div className="text-sm text-muted-foreground">Red Cards Per Game</div>
              </div>
            </div>

            {/* Coach Section */}
            <div className="bg-card rounded-xl p-6 border border-border space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Head Coach</h2>
                <div className="flex items-center gap-4">
                  <User className="w-10 h-10" />
                  <div>
                    <h3 className="font-medium">{ team?.coach || 'Unregistered' }</h3>
                    <p className="text-sm text-muted-foreground">Experienced: Very</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Assistant Coach</h2>
                <div className="flex items-center gap-4">
                  <User className="w-10 h-10" />
                  <div>
                    <h3 className="font-medium">{ team?.assistantCoach || 'Unregistered' }</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Squad List */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-semibold">Squad List</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {
                  teamPlayerList && teamPlayerList.players.map( ( category ) => (
                    category.players.map( ( player, index ) => (
                      <div
                        key={ player._id }
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                      >
                        <span className="w-8 h-8 flex items-center justify-center bg-secondary rounded-full text-sm font-medium">
                          { index }
                        </span>
                        <div>
                          <h3 className="font-medium">{ player.name }</h3>
                          <p className="text-sm text-muted-foreground">{ player.position }</p>
                        </div>
                      </div>
                    ))
                  ))
                }
                {
                  !teamPlayerList || teamPlayerList.players.length === 0 && (
                    <span>No Registered Players</span>
                  )
                }
              </div>
            </div>

            {/* Team Fixtures */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Fixtures</h2>
              <div className="space-y-4">
                {
                  teamFixtures && teamFixtures.map( ( category ) => (
                    <div
                      key={ category.title } 
                      className="space-y-2"
                    >
                      <h3 className="font-bold mb-1">{ category.title }</h3>
                      <div className="flex flex-col gap-2">
                        {
                          category.fixtures.map( ( fixture ) => {
                            const formattedDate = fixture ? format( fixture.date, "yyyy-MM-dd HH:mm" ) : null;
                            const date = formattedDate ? formattedDate.split(' ')[ 0 ] : null;
                            const time = formattedDate ? formattedDate.split(' ')[ 1 ] : null;
                            const isHome = fixture.homeTeam.name === team?.name;
                            
                            return (
                              <div
                                key={ fixture._id }
                                className="flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                              >
                                {/* Date and Time */}
                                <div className="flex items-center justify-center md:justify-start gap-4 mb-3 md:mb-0 basis-full md:basis-1/3">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-emerald-500" />
                                    <span>{ date }</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    <span>{ time }</span>
                                  </div>
                                </div>

                                {/* Teams */}
                                <div className="flex items-center text-base md:text-lg font-medium basis-full md:basis-1/3">
                                  <span 
                                    className={`
                                      basis-5/12 text-left ${
                                        isHome ? "text-emerald-500" : ""
                                      }
                                    `}
                                  >
                                    { fixture.homeTeam.name }
                                  </span>
                                  { 
                                    fixture.status === 'completed' && (
                                      <span className="text-sm text-muted-foreground basis-2/12 text-center">
                                        { fixture.result.homeScore } - { fixture.result.awayScore }
                                      </span>
                                    ) 
                                  }
                                  {
                                    fixture.status === 'upcoming' && (
                                      <span className="text-sm text-muted-foreground basis-2/12 text-center">
                                        vs
                                      </span>
                                    )
                                  }
                                  {
                                    fixture.status === 'live' && (
                                      <span className="text-sm text-muted-foreground basis-2/12 text-center">
                                        live
                                      </span>
                                    )
                                  }
                                  <span 
                                    className={`
                                      basis-5/12 text-right ${
                                        !isHome ? "text-emerald-500" : ""
                                      }
                                    `}
                                  >
                                    { fixture.awayTeam.name }
                                  </span>
                                </div>

                                {/* Venue */}
                                <div className="hidden md:block text-sm text-muted-foreground basis-full md:basis-1/3 text-right">
                                  { fixture.stadium }
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </main>
  );
}