'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Trophy, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import useTimerStore from "@/stores/timerStore";
import useLiveStore from "@/stores/liveStore";
import { liveFixtureInitialStateData, teamLogos } from "@/constants";
import { getAllCompetitions, getLiveFixture } from "@/lib/requests/v1/competitionPage/requests";
import { Loader } from "@/components/ui/loader";
import { Competition, LiveFixture } from "@/utils/requestDataTypes";
import { format } from "date-fns";
import { getLiveFixtureDetails } from "@/lib/requests/v1/liveAdminPage/requests";

const FootballPage: FC = () => {
  const [ loading, setLoading ] = useState<boolean>( true );
  const [ competitions, setCompetitions ] = useState<Competition[] | null>( null );
  const [ liveFixture, setLiveFixture ] = useState<LiveFixture | null>( null );
  const [ isCompetitionsOpen, setIsCompetitionsOpen ] = useState<boolean>( false );

  useEffect(() => {
    const fetchData = async() => {
      try {
        const competitionsData = await getAllCompetitions();
        if( competitionsData && competitionsData.code === '00' ) {
          setCompetitions( competitionsData.data );
        }

        const liveData = await getLiveFixture();
        if( liveData && liveData.code === '00' && liveData.data && liveData.data.length > 0 ) {
          try {
            const data = await getLiveFixtureDetails( liveData.data[ 0 ]._id );
            if( data && data.code === '00' ) {
              setLiveFixture( data.data );
            }
          } catch (error) {
            console.error('Error fetching live fixture details:', error);
            setLiveFixture(null);
          }
        } else {
          setLiveFixture( null );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCompetitions(null);
        setLiveFixture(null);
      } finally {
        setLoading( false );
      }
    };

    if( loading ) {
      fetchData();
    }
  }, [ loading ]);

  const formatTime = (seconds: number) => {
    if( seconds === 0 ) return `0`
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalTime = liveFixture ? liveFixture.time : 0;
  console.log( liveFixture )

  if( loading ) {
    return <Loader />;
  }

  return (
    <main className="min-h-screen">
      <BlurFade>
        <div className="space-y-6">
          {/* TOTS Promotional Banner */}
          <Link href="/football/tots">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-500/20 blur-xl"></div>
              <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-emerald-500/20 blur-xl"></div>

              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Team of the Season 2023/24</h2>
                    <p className="text-sm text-emerald-100 mt-1">Vote for your favorite players and see who makes the cut!</p>
                  </div>
                </div>
                <div className="md:text-right">
                  <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/20 transition-colors">
                    Vote Now
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Hero - Live Matches */}
          <div className="relative bg-gradient-to-br from-emerald-500/20 via-background to-background rounded-xl border border-border overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background" />
            <div className="relative p-4 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-lg font-semibold text-emerald-500">LIVE NOW</h2>
                  </div>
                  {
                    liveFixture && (
                      <Link
                        href={ `/live/${ liveFixture.id }` }
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm font-medium transition-colors"
                        aria-disabled={true}
                      >
                        View Stats
                      </Link>
                    )
                  }
                </div>

                {
                  liveFixture && (
                    <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                        <div className="flex flex-col items-center gap-4 md:w-1/3">
                          <div className="relative w-16 h-16 md:w-24 md:h-24">
                            <Image
                              src={ teamLogos[ liveFixture.homeTeam.name ] || '/images/team_logos/default.jpg' }
                              alt={ liveFixture.homeTeam.name }
                              fill
                              className="object-contain rounded-full"
                            />
                          </div>
                          <span className="text-base md:text-lg font-medium text-center">{ liveFixture.homeTeam.name }</span>
                        </div>

                        <div className="flex flex-col items-center gap-2 md:w-1/6">
                          <div className="text-4xl md:text-6xl font-bold tracking-tighter">
                            <span>{ liveFixture.result.homeScore }</span>
                            <span className="text-muted-foreground mx-3">-</span>
                            <span>{ liveFixture.result.awayScore }</span>
                            { liveFixture.result.homePenalty !== null && liveFixture.result.awayPenalty !== null && (
                              <div className="text-sm text-muted-foreground text-center mt-1">
                                ({liveFixture.result.homePenalty} - {liveFixture.result.awayPenalty})
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-sm text-muted-foreground">{formatTime(totalTime)}</span>
                            {/* {injuryTime > 0 && (
                              <span className="text-xs text-red-500">+{Math.floor(injuryTime / 60)}'</span>
                            )} */}
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-4 md:w-1/3">
                          <div className="relative w-16 h-16 md:w-24 md:h-24">
                            <Image
                              src={ teamLogos[ liveFixture.awayTeam.name ] || '/images/team_logos/default.jpg' }
                              alt={ liveFixture.awayTeam.name }
                              fill
                              className="object-contain rounded-full"
                            />
                          </div>
                          <span className="text-base md:text-lg font-medium text-center">{ liveFixture.awayTeam.name }</span>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" />
                          <span>{ liveFixture.competition?.name || 'Friendly' }</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Today</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                {
                  !liveFixture && (
                    <div className="flex justify-center items-center flex-col gap-2 mb-2">
                      <AlertCircle className="w-10 h-10" />
                      <p>No Live Fixtures Now.</p>
                    </div>
                  )
                }
              </div>
            </div>
          </div>

          {/* Competitions Section */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setIsCompetitionsOpen(!isCompetitionsOpen)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-semibold">Current Competitions</h2>
              </div>
              {isCompetitionsOpen ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            <AnimatePresence>
              {isCompetitionsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 grid gap-4 border-t border-border">
                    {
                      competitions && competitions.map((competition) => {
                        const formattedStartDate = competition.startDate ? format( competition.startDate, "yyyy-MM-dd HH:mm" ) : null;
                        const formattedEndDate = competition.endDate ? format( competition.endDate, "yyyy-MM-dd HH:mm" ) : null;
                        const startDate = formattedStartDate ? formattedStartDate.split(' ')[ 0 ] : null;
                        const endDate = formattedEndDate ? formattedEndDate.split(' ')[ 0 ] : null;

                        return (
                          <Link
                            key={competition._id}
                            href={`/competitions/${competition.type}/${competition._id}`}
                            className="block p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{competition.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  { startDate || 'Unknown' } - { endDate || 'Unknown' }
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  competition.status === 'ongoing'
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-orange-500/10 text-orange-500'
                                }`}>
                                  { competition.status }
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                  { competition.type }
                                </span>
                              </div>
                            </div>
                          </Link>
                        )
                      })
                    }
                    {
                      !competitions && (
                        <div className="text-center">No competitions available</div>
                      )
                    }
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </BlurFade>
    </main>
  );
};

export default FootballPage;