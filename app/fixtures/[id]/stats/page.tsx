'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import Image from "next/image";
import { Trophy, Calendar, Clock, Users, History, Swords } from "lucide-react";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { getFixtureData, getFixtureTeamFormAndMatchData } from "@/lib/requests/fixturePage/requests";
import { Fixture } from "@/utils/requestDataTypes";
import { Loader } from "@/components/ui/loader";
import { teamLogos } from "@/constants";
import { format } from "date-fns";
import { Head2Head, LastFixture, LineUp, TeamForm } from "@/utils/stateTypes";
import Stats from "@/components/fixturepage/Stats";
import Details from "@/components/fixturepage/Details";
import Lineups from "@/components/fixturepage/Lineups";

export default function MatchStatsPage({ 
  params 
}: { 
  params: Promise<{ type: string; id: string }> 
}) {
  const resolvedParams = use( params );

  const [ loading, setLoading ] = useState<boolean>( true );
  const [ fixtureData, setFixtureData ] = useState<Fixture | null >( null );
  const [ teamForm, setTeamForm ] = useState<TeamForm | null>( null );
  const [ lastFixtures, setLastFixtures ] = useState<LastFixture | null>( null );
  const [ head2head, setHead2head ] = useState<Head2Head | null>( null );
  const [ activeTab, setActiveTab ] = useState<'details' | 'lineups' | 'stats'>('details');
  const [ activeTeamFixturesTab, setActiveTeamFixturesTab ] = useState<string>('home');

  useEffect( () => {
    const fetchData = async () => {
      const fixtData = await getFixtureData( resolvedParams.id );
      if( fixtData && fixtData.code === '00' ) {
        setFixtureData( fixtData.data );
        setActiveTab( fixtData.data.status === 'upcoming' ? 'details' : 'stats' );
        console.log( fixtData.data );
      }

      const teamFormAndMatchData = await getFixtureTeamFormAndMatchData(
         resolvedParams.id );
      if( teamFormAndMatchData && teamFormAndMatchData.code === '00' ) {
        const { homeLastFixtures, awayLastFixtures, awayTeamForm, homeTeamForm, head2head } = teamFormAndMatchData.data;

        setTeamForm({ 
          awayTeamForm,
          homeTeamForm
        });
        setLastFixtures({
          awayLastFixtures,
          homeLastFixtures
        });
        setHead2head({
          homeWins: head2head.homeWins,
          awayWins: head2head.awayWins,
          draws: head2head.draws,
          fixtures: head2head.fixtures
        });
        console.log( teamFormAndMatchData.data );
      }
      setLoading( false );
    }

    if( loading ) fetchData();
  }, [ loading ]);

  if( loading ) {
    return <Loader />
  }

  const formattedDate = fixtureData ? format( fixtureData.date, "yyyy-MM-dd HH:mm" ) : null;
  const date = formattedDate ? formattedDate.split(' ')[ 0 ] : null;
  const time = formattedDate ? formattedDate.split(' ')[ 1 ] : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Back Button */}
      <div className="fixed top-4 left-3 md:top-8 md:left-8 z-10">
        <BackButton />
      </div>

      <div className="pt-12 pb-4 md:pt-4 md:pb-6">
        <BlurFade>
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {/* Match Header */}
            <div className="relative bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
              
              <div className="relative">
                <div className="text-center mb-3 md:mb-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-2.5 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                    <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    <span>{ fixtureData?.competition?.name || 'Friendly' }</span>
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
                        src={ teamLogos[ fixtureData!.homeTeam.name ] || '/images/team_logos/default.jpg' }
                        alt={ fixtureData?.homeTeam.name || 'Home Logo' }
                        fill
                        className="object-contain rounded-full"
                      />
                    </motion.div>
                    <span className="text-xs md:text-base font-medium text-center">
                      { fixtureData?.homeTeam.name || 'Unknown' }
                    </span>
                  </div>

                  {
                    fixtureData && fixtureData.status === 'upcoming' && (
                      <>
                        {/* VS */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="bg-card shadow-xl rounded-lg md:rounded-xl p-2 md:p-3 border border-border min-w-[90px] md:min-w-[120px]">
                            <div className="text-2xl md:text-4xl font-bold tracking-tighter text-center">
                              <span className="text-muted-foreground">VS</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 md:gap-1.5 mt-0.5 md:mt-1 text-[10px] md:text-xs text-muted-foreground capitalize">
                              <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                              <span>{ fixtureData?.status }</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  }
                  {
                    fixtureData && fixtureData.status === 'completed' && (
                      <>
                        {/* Score */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="bg-card shadow-xl rounded-lg md:rounded-xl p-2 md:p-3 border border-border min-w-[90px] md:min-w-[120px] text-center">
                            <div className="text-2xl md:text-4xl font-bold tracking-tighter">
                              <span className="text-emerald-500">{ fixtureData.result.homeScore }</span>
                              <span className="mx-2 md:mx-3 text-muted-foreground">-</span>
                              <span className="text-emerald-500">{ fixtureData.result.awayScore }</span>
                            </div>
                            <div className="flex items-center justify-center gap-1 md:gap-1.5 mt-0.5 md:mt-1 text-[10px] md:text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                              <span>Full Time</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  }

                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-2 md:gap-3 w-1/3">
                    <motion.div 
                      className="relative w-12 h-12 md:w-20 md:h-20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src={ teamLogos[ fixtureData!.awayTeam.name ] || '/images/team_logos/default.jpg' }
                        alt={ fixtureData?.awayTeam.name || 'Home Logo' }
                        fill
                        className="object-contain rounded-full"
                      />
                    </motion.div>
                    <span className="text-xs md:text-base font-medium text-center">
                      { fixtureData?.awayTeam.name || 'Unknown' }
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mt-3 md:mt-4">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{ fixtureData?.competition?.name || 'Friendly' }</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{ date }</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{ time }</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              {
                fixtureData && fixtureData.status === 'upcoming' && (
                  <button
                    onClick={() => setActiveTab('details')}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors",
                      activeTab === 'details'
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Details
                  </button>
                )
              }
              {
                fixtureData && fixtureData.status === 'completed' && (
                  <button
                    onClick={() => setActiveTab('stats')}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors",
                      activeTab === 'stats'
                        ? "text-emerald-500 border-b-2 border-emerald-500"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Stats
                  </button>
                )
              }
              <button
                onClick={() => setActiveTab('lineups')}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  activeTab === 'lineups'
                    ? "text-emerald-500 border-b-2 border-emerald-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Lineups
              </button>
            </div>

            {
              fixtureData && fixtureData.status === 'upcoming' && activeTab === 'details' && (
                <Details
                  fixtureData={ fixtureData }
                  teamForm={ teamForm }
                  head2head={ head2head }
                  lastFixtures={ lastFixtures }
                  activeTeamFixturesTab={ activeTeamFixturesTab }
                  setActiveTeamFixturesTab={ setActiveTeamFixturesTab }
                />
              )
            }
            {
              fixtureData && fixtureData.status === 'completed' && activeTab === 'stats' && (
                <Stats 
                  home={ fixtureData.statistics!.home }
                  away={ fixtureData.statistics!.away }
                  fixtureData={ fixtureData }
                />
              )
            }
            {
              activeTab === 'lineups' && (
                <Lineups
                  fixtureData={ fixtureData }
                />
              )
            }
          </div>
        </BlurFade>
      </div>
    </main>
  );
}