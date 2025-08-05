'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import { Trophy, Calendar, Clock, ChevronDown, ChevronUp, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { getAllCompetitionFixtures, getIndividualCompetition, getIndividualCompetitionOverview, getKnockoutRounds, getLeagueTable } from "@/lib/requests/competitionPage/requests";
import { Competition, CompetitionFixtures, CompetitionOverview, ExtendedLeagueTableEntry, KnockoutRoundsEntry } from "@/utils/requestDataTypes";
import { Loader } from "@/components/ui/loader";
import { format } from "date-fns";
import { teamLogos } from "@/constants";
import { KnockoutBracket } from "@/components/competition/KnockoutBracket";
import LeagueTable from "@/components/competition/LeagueTable";
import { ILeagueStandings, IPopKnockoutRounds } from "@/utils/V2Utils/v2requestData.types";

const fixtureButtons: ( keyof CompetitionFixtures )[] = [ 'upcomingMatches', 'completedMatches' ];

export default function CompetitionPage({ 
  params 
}: { 
  params: Promise<{ type: string; id: string }> 
}) {
  const resolvedParams = use(params);
  const [ loading, setLoading ] = useState(true);
  const [ competition, setCompetition ] = useState<Competition | null>( null );
  const [ overview, setOverview ] = useState<CompetitionOverview | null>( null );
  const [ fixtures, setFixtures ] = useState<CompetitionFixtures | null>( null );
  const [ table, setTable ] = useState<ILeagueStandings[]>( [] );
  const [ knockoutRounds, setKnockoutRounds ] = useState<IPopKnockoutRounds[]>( [] );
  const [ isTableOpen, setIsTableOpen ] = useState<boolean>( true );
  const [ isFixturesOpen, setIsFixturesOpen ] = useState<boolean>( true );
  const [ fixtureOpenType, setFixtureOpenType ] = useState<keyof CompetitionFixtures>( 'upcomingMatches' );
  const [ isScorersOpen, setIsScorersOpen ] = useState<boolean>( true );
  const [ isAssistersOpen, setIsAssistersOpen ] = useState<boolean>( true );
  const [ isTeamsOpen, setIsTeamsOpen ] = useState<boolean>( true );
  const [ isKnockoutOpen, setIsKnockoutOpen ] = useState<boolean>( true );

  useEffect(() => {
    const fetchData = async () => {
      const competitionData = await getIndividualCompetition( resolvedParams.id );
      const overviewData = await getIndividualCompetitionOverview( resolvedParams.id );
      const leagueTableData = await getLeagueTable( resolvedParams.id );
      const knockoutRoundsData = await getKnockoutRounds( resolvedParams.id );
      const fixtureData = await getAllCompetitionFixtures( resolvedParams.id );

      if ( competitionData && competitionData.code === '00' ) {
        setCompetition( competitionData.data );
      }
      if ( overviewData && overviewData.code === '00' ) {
        setOverview( overviewData.data );
      }
      if( leagueTableData && leagueTableData.code === '00' ) {
        setTable( leagueTableData.data );
      }
      if( knockoutRoundsData && knockoutRoundsData.code === '00' ) {
        setKnockoutRounds( knockoutRoundsData.data );
      }
      if( fixtureData && fixtureData.code === '00' ) {
        setFixtures( fixtureData.data );
      }

      console.log( competitionData, overviewData, leagueTableData, knockoutRoundsData, fixtureData );
      setLoading( false );
    };

    fetchData();
  }, [ resolvedParams.id, loading ]);

  if ( loading ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if ( !competition || !overview ) {
    notFound();
  }

  const formattedStartDate = competition.startDate ? format( competition.startDate, "yyyy-MM-dd HH:mm" ) : null;
  const formattedEndDate = competition.endDate ? format( competition.endDate, "yyyy-MM-dd HH:mm" ) : null;
  const startDate = formattedStartDate ? formattedStartDate.split(' ')[ 0 ] : null;
  const endDate = formattedEndDate ? formattedEndDate.split(' ')[ 0 ] : null;

  return (
    <main className="min-h-screen md:px-6">
      {/* Back Button */}
      <div className="fixed top-8 left-4 md:left-8 z-10">
        <BackButton />
      </div>

      <div className="pt-16 pb-6 md:pt-0 space-y-4 md:space-y-6 max-w-6xl mx-auto">
        <BlurFade>
          <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="bg-card rounded-lg p-3 md:p-4 border border-border">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-500" />
                  <h1 className="text-lg md:text-xl font-bold">{competition.name}</h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    competition.status === 'ongoing' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {competition.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    { startDate || 'Unknown' } - { endDate || 'Unknown' }
                  </span>
                </div>
              </div>
            </div>

            {/* Teams Section */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setIsTeamsOpen(!isTeamsOpen)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <h2 className="text-base md:text-lg font-semibold">Participating Teams</h2>
                </div>
                {isTeamsOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {isTeamsOpen && overview?.leagueFacts.teamList && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {
                          overview.leagueFacts.teamList && overview.leagueFacts.teamList.map(( team ) => (
                            <Link
                              key={ team._id }
                              href={`/teams/${ team._id}`}
                              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                            >
                              <div className="relative w-10 h-10">
                                <Image
                                  src={ teamLogos[ team.name ] || '/images/team_logos/default.jpg' }
                                  alt={ team.name }
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium">{team.name}</h3>
                              </div>
                            </Link>
                          ))
                        }
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Knockout Bracket Section */}
            {competition.type === 'knockout' && (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setIsKnockoutOpen(!isKnockoutOpen)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-500" />
                    <h2 className="text-base md:text-lg font-semibold">Knockout Bracket</h2>
                  </div>
                  {isKnockoutOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {isKnockoutOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border">
                        <KnockoutBracket knockoutRounds={ knockoutRounds } />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* League Table */}
            {competition.type === 'league' && (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setIsTableOpen(!isTableOpen)}
                  className="w-full px-4 md:px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
                >
                  <h2 className="text-lg md:text-xl font-semibold">League Table</h2>
                  {isTableOpen ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {isTableOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 md:p-6 border-t border-border overflow-x-auto">
                        <LeagueTable table={ table } />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Top Scorers Section */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setIsScorersOpen(!isScorersOpen)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <h2 className="text-base md:text-lg font-semibold">Top Scorers</h2>
                {isScorersOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {isScorersOpen && overview?.topScorers && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-border">
                      <div className="grid gap-3">
                        {overview.topScorers.map((scorer) => (
                          <div
                            key={scorer.player._id}
                            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                          >
                            <div>
                              <h3 className="font-medium">{scorer.player.name}</h3>
                              <p className="text-sm text-muted-foreground">{scorer.team}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-500 font-bold">{scorer.goals}</span>
                              <span className="text-sm text-muted-foreground">goals</span>
                            </div>
                          </div>
                        ))}
                        {
                          overview.topScorers.length === 0 && (
                            <div className="text-center text-muted-foreground">
                              No top scorers yet
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Top Assists Section */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setIsAssistersOpen(!isAssistersOpen)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <h2 className="text-base md:text-lg font-semibold">Top Assists</h2>
                {isAssistersOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {isAssistersOpen && overview?.topAssists && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-border">
                      <div className="grid gap-3">
                        {overview.topAssists.map((assister) => (
                          <div
                            key={assister.player._id}
                            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                          >
                            <div>
                              <h3 className="font-medium">{assister.player.name}</h3>
                              <p className="text-sm text-muted-foreground">{assister.team}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-500 font-bold">{assister.assists}</span>
                              <span className="text-sm text-muted-foreground">assists</span>
                            </div>
                          </div>
                        ))}
                        {
                          overview.topAssists.length === 0 && (
                            <div className="text-center text-muted-foreground">
                              No top assists yet
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fixtures Section */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setIsFixturesOpen(!isFixturesOpen)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <h2 className="text-base md:text-lg font-semibold">Fixtures</h2>
                {isFixturesOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {
                  isFixturesOpen && fixtures && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {/* Selector Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        {
                          fixtureButtons.map( ( entry, index ) => (
                            <button
                              key={ index }
                              onClick={ () => setFixtureOpenType( entry ) }
                              className={`px-4 py-2 w-full text-center ${ entry == fixtureOpenType ? 'text-orange-500' : '' }`}
                            >
                              { entry === 'completedMatches' ? 'Completed' : 'Upcoming' }
                            </button>
                          ))
                        }
                      </div>
                      {/* Actual List */}
                      <div className="p-4 border-t border-border">
                        <div className="grid gap-3">
                          {
                            fixtures[ fixtureOpenType ].map(( fixture ) => {
                              const formattedDate = fixture ? format( fixture.date, "yyyy-MM-dd HH:mm" ) : null;
                              const date = formattedDate ? formattedDate.split(' ')[ 0 ] : null;
                              const time = formattedDate ? formattedDate.split(' ')[ 1 ] : null;
                              
                              return (
                                <div 
                                  key={ fixture._id }
                                  className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{ date }</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{ time }</span>
                                      </div>
                                    </div>
                                    <Link
                                      href={`/fixtures/${ fixture._id }/stats`}
                                      className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                                    >
                                      View Stats
                                    </Link>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium basis-5/12 text-left">{ fixture.homeTeam.name }</span>
                                    {fixture.status === 'completed' && fixture.result ? (
                                      <div className="flex items-center gap-2 basis-2/12 justify-center">
                                        <span className="font-bold">{ fixture.result.homeScore }</span>
                                        <span className="text-muted-foreground">-</span>
                                        <span className="font-bold">{ fixture.result.awayScore }</span>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-muted-foreground basis-2/12 text-center">vs</span>
                                    )}
                                    <span className="font-medium basis-5/12 text-right">{ fixture.awayTeam.name }</span>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    </motion.div>
                  )
                }
              </AnimatePresence>
            </div>
          </div>
        </BlurFade>
      </div>
    </main>
  );
} 