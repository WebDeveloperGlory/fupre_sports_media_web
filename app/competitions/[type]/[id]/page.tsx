'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import { Trophy, Calendar, Clock, ChevronDown, ChevronUp, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { getAllCompetitionFixtures, getIndividualCompetition, getIndividualCompetitionOverview, getLeagueTable } from "@/lib/requests/competitionPage/requests";
import { Competition, CompetitionFixtures, CompetitionOverview, ExtendedLeagueTableEntry } from "@/utils/requestDataTypes";
import { Loader } from "@/components/ui/loader";
import { format } from "date-fns";
import { teamLogos } from "@/constants";

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
  const [ table, setTable ] = useState<ExtendedLeagueTableEntry[] | []>( [] );
  const [ isTableOpen, setIsTableOpen ] = useState<boolean>( true );
  const [ isFixturesOpen, setIsFixturesOpen ] = useState<boolean>( true );
  const [ fixtureOpenType, setFixtureOpenType ] = useState<keyof CompetitionFixtures>( 'upcomingMatches' );
  const [ isScorersOpen, setIsScorersOpen ] = useState<boolean>( true );
  const [ isAssistersOpen, setIsAssistersOpen ] = useState<boolean>( true );
  const [ isTeamsOpen, setIsTeamsOpen ] = useState<boolean>( true );

  useEffect(() => {
    const fetchData = async () => {
      const competitionData = await getIndividualCompetition( resolvedParams.id );
      const overviewData = await getIndividualCompetitionOverview( resolvedParams.id );
      const leagueTableData = await getLeagueTable( resolvedParams.id );
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
      if( fixtureData && fixtureData.code === '00' ) {
        setFixtures( fixtureData.data );
      }

      console.log( competitionData, overviewData, leagueTableData, fixtureData );
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
                                {/* <p className="text-sm text-muted-foreground">
                                  {team.played} matches played
                                </p> */}
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
                      {/* Slector Buttons */} {/* NOTICE MEEEEEEEEEEEEEEE FOR UI EDITSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS */}
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
                                      <span className="text-muted-foreground basis-2/12 text-center">vs</span>
                                    )}
                                    <span className="font-medium basis-5/12 text-right">{ fixture.awayTeam.name }</span>
                                  </div>
                                  <div className="mt-2 text-xs text-center text-muted-foreground">
                                    { fixture.stadium }
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

            {/* League Table */}
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
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Pos</th>
                            <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Team</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">P</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">W</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">D</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">L</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">GF</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">GA</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">GD</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Pts</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Form</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            table.map(( entry, index ) => (
                              <tr 
                                key={ entry.team._id } 
                                className="border-b border-border hover:bg-accent/50 transition-colors"
                              >
                                <td className="py-4 px-3 text-sm">{ index + 1 }</td>
                                <td className="py-4 px-3">
                                  <div className="flex items-center gap-3">
                                    <div className="relative w-8 h-8">
                                      <Image
                                        src={ teamLogos[ entry.team.name ] || '/images/team_logos/default.jpg' }
                                        alt={`${ entry.team.name } logo`}
                                        fill
                                        className="object-contain"
                                      />
                                    </div>
                                    <span className="font-medium text-sm md:text-base">
                                      { entry.team.name }
                                    </span>
                                  </div>
                                </td>
                                <td className="text-center py-4 px-3 text-sm">{ entry.played }</td>
                                <td className="text-center py-4 px-3 text-sm">{ entry.wins }</td>
                                <td className="text-center py-4 px-3 text-sm">{ entry.draws }</td>
                                <td className="text-center py-4 px-3 text-sm">{ entry.losses }</td>
                                <td className="text-center py-4 px-3 text-sm">{ entry.goalsFor }</td>
                                <td className="text-center py-4 px-3 text-sm">{ entry.goalsAgainst }</td>
                                <td className="text-center py-4 px-3 text-sm">{ entry.goalDifference }</td>
                                <td className="text-center py-4 px-3 text-sm font-semibold">{ entry.points }</td>
                                <td className="text-center py-4 px-3">
                                  <div className="flex items-center justify-center gap-1">
                                    { 
                                      [ ...entry.form ].reverse().map((result, i) => (
                                        <span
                                          key={i}
                                          className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium ${
                                            result === 'W' 
                                              ? 'bg-emerald-500/10 text-emerald-500' 
                                              : result === 'D'
                                              ? 'bg-orange-500/10 text-orange-500'
                                              : 'bg-red-500/10 text-red-500'
                                          }`}
                                        >
                                          {result}
                                        </span>
                                      ))
                                    }
                                  </div>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Top Scorers */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setIsScorersOpen(!isScorersOpen)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <h2 className="text-xl font-semibold">Top Scorers</h2>
                {isScorersOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {isScorersOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t border-border overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-6 px-4 font-medium text-muted-foreground">Rank</th>
                            <th className="text-left py-6 px-4 font-medium text-muted-foreground">Player</th>
                            <th className="text-left py-6 px-4 font-medium text-muted-foreground">Team</th>
                            <th className="text-center py-6 px-4 font-medium text-muted-foreground">Matches</th>
                            <th className="text-center py-6 px-4 font-medium text-muted-foreground">Goals</th>
                          </tr>
                        </thead>
                        <tbody>
                          { 
                            overview.topScorers.map(( entry, index ) => (
                              <tr 
                                key={` ${entry.player._id} + ${ entry.team } + ${ index } `} 
                                className="border-b border-border hover:bg-accent/50 transition-colors"
                              >
                                <td className="py-6 px-4">{ index + 1 }</td>
                                <td className="py-6 px-4">
                                  <span className="font-medium">{ entry.player.name }</span>
                                </td>
                                <td className="py-6 px-4">
                                  <div className="flex items-center gap-4">
                                    <div className="relative w-8 h-8">
                                      <Image
                                        src={ teamLogos[ entry.team ] || '/images/team_logos/default.jpg' }
                                        alt={`${ entry.team } logo`}
                                        fill
                                        className="object-contain"
                                      />
                                    </div>
                                    <span>{ entry.team }</span>
                                  </div>
                                </td>
                                <td className="text-center py-6 px-4">{ entry.appearances }</td>
                                <td className="text-center py-6 px-4 font-semibold">{ entry.goals }</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Top Assisters */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setIsAssistersOpen( !isAssistersOpen ) }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <h2 className="text-xl font-semibold">Top Assists</h2>
                {isAssistersOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {isAssistersOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t border-border overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-6 px-4 font-medium text-muted-foreground">Rank</th>
                            <th className="text-left py-6 px-4 font-medium text-muted-foreground">Player</th>
                            <th className="text-left py-6 px-4 font-medium text-muted-foreground">Team</th>
                            <th className="text-center py-6 px-4 font-medium text-muted-foreground">Matches</th>
                            <th className="text-center py-6 px-4 font-medium text-muted-foreground">Assists</th>
                          </tr>
                        </thead>
                        <tbody>
                          { 
                            overview.topAssists.map(( entry, index ) => (
                              <tr 
                                key={` ${entry.player._id} + ${ entry.team } + ${ index } `} 
                                className="border-b border-border hover:bg-accent/50 transition-colors"
                              >
                                <td className="py-6 px-4">{ index + 1 }</td>
                                <td className="py-6 px-4">
                                  <span className="font-medium">{ entry.player.name }</span>
                                </td>
                                <td className="py-6 px-4">
                                  <div className="flex items-center gap-4">
                                    <div className="relative w-8 h-8">
                                      <Image
                                        src={ teamLogos[ 'Kalakuta FC' ] || '/images/team_logos/default.jpg' }
                                        alt={`${ entry.team } logo`}
                                        fill
                                        className="object-contain"
                                      />
                                    </div>
                                    <span>{ entry.team }</span>
                                  </div>
                                </td>
                                <td className="text-center py-6 px-4">{ entry.appearances }</td>
                                <td className="text-center py-6 px-4">{ entry.assists }</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </BlurFade>
      </div>
    </main>
  );
} 