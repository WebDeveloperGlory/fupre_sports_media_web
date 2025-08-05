'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { Trophy, Calendar, AlertCircle, ArrowRight, Activity, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { teamLogos } from "@/constants";
import { Loader } from "@/components/ui/loader";
import { format } from "date-fns";
import RecentGames from "@/components/football/RecentGames";
import { getAllLiveFixtures, getLiveFixtureById } from "@/lib/requests/v2/admin/super-admin/live-management/requests";
import { IV2FootballLiveFixture, PopIV2FootballFixture } from "@/utils/V2Utils/v2requestData.types";
import { getRecentFixtures } from "@/lib/requests/v2/public/requests";

const FootballHomePage: FC = () => {
  const [ loading, setLoading ] = useState<boolean>( true );
  const [ liveFixture, setLiveFixture ] = useState<IV2FootballLiveFixture | null>( null );
  const [ recentFixtures, setRecentFixtures ] = useState<PopIV2FootballFixture[]>( [] );
  const [ recentLoading, setRecentLoading ] = useState<boolean>( true );

  useEffect(() => {
    const fetchData = async() => {
      try {
        // Fetch live fixture
        const liveData = await getAllLiveFixtures();
        if( liveData && liveData.code === '00' && liveData.data && liveData.data.length > 0 ) {
          try {
            const data = await getLiveFixtureById( liveData.data[ 0 ].fixture );
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

        // Fetch recent fixtures
        const recentData = await getRecentFixtures();
        if( recentData && recentData.code === '00' ) {
          setRecentFixtures( recentData.data || [] );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLiveFixture(null);
        setRecentFixtures([]);
      } finally {
        setLoading( false );
        setRecentLoading( false );
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

  const totalTime = liveFixture ? liveFixture.currentMinute : 0;
  console.log( liveFixture )

  if( loading ) {
    return <Loader />;
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <BlurFade>
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-emerald-500">Football</span> at FUPRE
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Stay updated with live matches and recent results
            </p>
          </div>

          {/* Live Match Section */}
          <div className="relative bg-gradient-to-br from-emerald-500/10 via-background to-background rounded-xl sm:rounded-2xl border border-border/50 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
            <div className="relative p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-lg sm:text-xl font-semibold">Live Match</h2>
                  </div>
                  {liveFixture && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE
                    </div>
                  )}
                </div>
                {liveFixture && (
                  <Link
                    href={`/live/${liveFixture.fixture}`}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    Watch Live
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {liveFixture ? (
                <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-border/50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
                        <Image
                          src={teamLogos[liveFixture.homeTeam.name] || '/images/team_logos/default.jpg'}
                          alt={liveFixture.homeTeam.name}
                          fill
                          className="object-contain rounded-full"
                        />
                      </div>
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-center leading-tight">
                        {liveFixture.homeTeam.name}
                      </span>
                    </div>

                    {/* Score and Time */}
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                        <span>{liveFixture.result.homeScore}</span>
                        <span className="text-muted-foreground mx-2 sm:mx-4">-</span>
                        <span>{liveFixture.result.awayScore}</span>
                      </div>
                      {liveFixture.result.homePenalty !== null && liveFixture.result.awayPenalty !== null && (
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          ({liveFixture.result.homePenalty} - {liveFixture.result.awayPenalty})
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{liveFixture.currentMinute}'</span>
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
                        <Image
                          src={teamLogos[liveFixture.awayTeam.name] || '/images/team_logos/default.jpg'}
                          alt={liveFixture.awayTeam.name}
                          fill
                          className="object-contain rounded-full"
                        />
                      </div>
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-center leading-tight">
                        {liveFixture.awayTeam.name}
                      </span>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate max-w-40 sm:max-w-none">{liveFixture.competition?.name || 'Friendly'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Live Match</h3>
                  <p className="text-muted-foreground">Check back later for live coverage</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Games Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-semibold">Recent Games</h2>
              </div>
            </div>

            <RecentGames fixtures={recentFixtures} loading={recentLoading} />
          </div>

          {/* TOTS Promotional Section */}
          <div className="pt-4 sm:pt-6">
            <Link href="/sports/football/tots">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600/90 to-emerald-800/90 p-4 sm:p-6 hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300 group">
                <div className="absolute -right-6 -top-6 sm:-right-8 sm:-top-8 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/30 transition-all duration-300"></div>
                <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/30 transition-all duration-300"></div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm flex-shrink-0">
                      <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-white truncate">Team of the Season</h3>
                      <p className="text-xs sm:text-sm text-emerald-100 truncate">Vote for your favorite players</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                </div>
              </div>
            </Link>
          </div>

          {/* Competitions Access Button */}
          <div className="text-center pt-2 sm:pt-4">
            <Link
              href="/sports/football/competitions"
              className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg w-full sm:w-auto"
            >
              <Trophy className="w-5 h-5" />
              <span>View All Competitions</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </BlurFade>
    </main>
  );
};

export default FootballHomePage;
