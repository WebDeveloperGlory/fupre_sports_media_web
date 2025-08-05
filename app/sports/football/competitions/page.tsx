'use client'

import { Loader } from "@/components/ui/loader";
import { getFootballCompetitionPageData } from "@/lib/requests/v2/homepage/requests";
import { IV2FootballCompetition } from "@/utils/V2Utils/v2requestData.types";
import { ArrowRight, Bolt, CalendarClock, Crown, Star, Trophy, Filter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CompetitionBadge from "@/components/competitions/CompetitionBadge";
import { cn } from "@/utils/cn";

type CompetitionPageData = {
  competitionFixturesCount: number;
  liveCompetitionFixturesCount: number;
  allCompetitions: IV2FootballCompetition[];
  allActiveCompetitions: IV2FootballCompetition[];
  featuredCompetitions: IV2FootballCompetition[];
}

export default function FootballCompetitionsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [pageData, setPageData] = useState<CompetitionPageData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all competitions');

  useEffect(() => {
    const fetchData = async () => {
      const response = await getFootballCompetitionPageData();
      if(response?.code === '00') {
        setPageData(response.data);
      } else {
        toast.error(response?.message || 'Error Getting Analytics');
      }
<<<<<<< HEAD

      setLoading(false);
    }
=======
      setLoading(false);
    };
>>>>>>> adcd7581505090143593a626bfd54578816be270

    if(loading) fetchData();
  }, [loading]);

  const filteredCompetitions = pageData?.allCompetitions.filter((competition) => {
    if(activeTab === 'all competitions') return true;
    if(activeTab === 'league') return competition.type === 'league';
    if(activeTab === 'knockout') return competition.type === 'knockout';
    if(activeTab === 'hybrid') return competition.type === 'hybrid';
    return false;
  }) || [];

  if(loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-emerald-500"></div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                  Football Competitions
                </h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Explore all football competitions at FUPRE
              </p>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{pageData?.allCompetitions.length || 0}</div>
                <div className="text-muted-foreground uppercase tracking-wide">Total</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{pageData?.liveCompetitionFixturesCount || 0}</div>
                <div className="text-muted-foreground uppercase tracking-wide">Live</div>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{pageData?.competitionFixturesCount || 0}</div>
                <div className="text-muted-foreground uppercase tracking-wide">Matches</div>
              </div>
            </div>
          </div>
        </div>
      </div>


<<<<<<< HEAD
        {/* Featured Competitions */}
        {
          pageData && pageData.featuredCompetitions.length > 0 && pageData.featuredCompetitions.map((competition) => (
            <div
              key={competition._id} 
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
            >
              <div className="border border-muted-foreground rounded-lg">
                {/* Top Section */}
                <div className="px-4 py-4 h-32 relative">
                  {/* Background decoration */}
                  <div className={`absolute top-10 right-10 w-24 h-24 text-emerald-500 opacity-5 transform rotate-12 translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500`}>
                    <Trophy className="w-full h-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 rounded-full border border-muted-foreground bg-card text-sm text-center">{competition.status}</span>
                    <div className="bg-primary-foreground p-1.5 rounded-full">
                      { <Trophy className="w-5 h-5 text-yellow-500" /> }
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="px-4 py-4 relative space-y-4 border-t border-t-muted-foreground">
                  {/* Name and Description */}
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-lg bg-primary-foreground"></div>
                    <div>
                      <p className="text-lg font-bold">{competition.name}</p>
                      <span className="text-muted-foreground">{competition.description}</span>
                    </div>
                  </div>

                  {/* Minor details */}
                  <div className="grid grid-cols-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Current Stage</span>
                      <p>{competition.currentStage || 'unknown'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Teams</span>
                      <p>{competition.teams.length}</p>
                    </div>
                  </div>

                  {/* Top goalscorer */}
                  {
                    competition.stats.topScorers.length > 0 && (    
                      <div className="px-4 py-2 border rounded-md bg-primary-foreground">
                        <span className="text-muted-foreground text-sm">Top Scorer</span>
                        <div className="flex justify-between items-center">
                          <p>{competition.stats.topScorers[0].player.name}</p>
                          <p className="text-green-500 font-bold">{competition.stats.topScorers[0].goals} goals</p>
                        </div>
                        <span className="text-muted-foreground text-sm">{competition.stats.topScorers[0].team.name}</span>
                      </div>
                    )
                  }

                  {/* Bottom section */}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">{4}/{4} matches played</span>
                    <Link
                      href={`competition/${'1234'}`}
                      className="text-emerald-500"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        }

        {/* No Featured Competitions */}
        {
          pageData && pageData.featuredCompetitions.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 p-8 border border-muted-foreground rounded-lg text-center mt-4">
              <Star className="w-16 h-16" />
              <div>
                <p>No Featured Competitions</p>
                <span className="text-sm">Now we await the next one.</span>
              </div>
            </div>
          )
        }
      </div>

      {/* Accordition Tabs */}
      <div className='w-full overflow-x-scroll scrollbar-hide border rounded-lg flex md:grid md:grid-cols-4 items-center gap-2 bg-primary-foreground text-center'>
        {
          [ 'all competitions', 'league', 'knockout', 'hybrid' ].map( tab => (
            <div
                key={ tab }
                onClick={ () => { 
                  setActiveTab( tab as typeof activeTab );
                } }
                className={`
                  flex gap-2 items-center justify-center cursor-pointer px-6 py-2 capitalize text-sm font-medium basis-1/2 h-full ${
                    activeTab === tab
                    ? 'text-emerald-500 border border-emerald-500 rounded-sm'
                    : ''
                }  
                `}
=======

      {/* Filter Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-xl font-semibold text-foreground">Browse by Type</h2>
          <div className="text-sm text-muted-foreground">
            {activeTab === 'all competitions' ? 'All' : activeTab} competitions
          </div>
        </div>

        <div className="flex items-center gap-1 mt-4 overflow-x-auto">
          {['all competitions', 'league', 'knockout', 'hybrid'].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
                activeTab === tab
                  ? 'text-emerald-600 border-emerald-600'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
              )}
>>>>>>> adcd7581505090143593a626bfd54578816be270
            >
              {tab === 'league' && <Trophy className="w-4 h-4" />}
              {tab === 'knockout' && <Crown className="w-4 h-4" />}
              {tab === 'hybrid' && <Bolt className="w-4 h-4" />}
              {tab === 'all competitions' && <CalendarClock className="w-4 h-4" />}
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </div>
      </div>

<<<<<<< HEAD
      {/* Competition list */}
      {
        filteredCompetitions.length > 0 && (  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {
              filteredCompetitions.map((competition) => (  
                <div
                  key={competition._id} 
                  className="bg-primary-foreground border p-4 rounded-lg space-y-4"
                >
                  <div className="flex justify-between">
                    <div className="w-12 h-12 rounded-lg bg-primary"></div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`
                          border rounded-full px-2 py-1 capitalize text-xs  
                        `}
                      >
                        {competition.status}
                      </span>
                      { activeTab === 'league' && <Trophy className="w-5 h-5  text-emerald-500" />  }
                      { activeTab === 'knockout' && <Crown className="w-5 h-5 text-purple-500" />  }
                      { activeTab === 'hybrid' && <Bolt className="w-5 h-5 text-yellow-500" />  }
                    </div>
                  </div>
                  <p className="font-bold">{competition.name}</p>
                  <span className="text-muted-foreground">{competition.description}</span>
                  <div className="grid grid-cols-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Stage:</span>
                      <p>{competition.currentStage || 'awards'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Teams:</span>
                      <p>{competition.teams.length || 0}</p>
                    </div>
                  </div>
                  {
                    competition.stats.topScorers.length > 0 && (
                      <div className="px-2 py-2 border rounded-md bg-secondary">
                        <span className="text-muted-foreground text-sm">Top Scorer</span>
                        <div className="flex justify-between items-center">
                          <p>{competition.stats.topScorers[0].player.name}</p>
                          <p className="text-green-500 font-bold">{competition.stats.topScorers[0].goals} goals</p>
                        </div>
                        <span className="text-muted-foreground text-sm">{competition.stats.topScorers[0].team.name}</span>
                      </div>
                    )
                  }
                  {
                    competition.type === 'league' && competition.leagueTable.length > 0 && (
                      <div className="px-2 py-2 border rounded-md bg-secondary">
                        <span className="text-muted-foreground text-sm">Current Leader</span>
                        <div className="flex justify-between items-center">
                          <p>{competition.leagueTable[0].team.name}</p>
                          <p className="text-yellow-500 font-bold">{competition.leagueTable[0].points} pts</p>
                        </div>
                      </div>
                    )
                  }
                  {
                    competition.awards.team.find(
                      (award) => award.name === 'Champions'
                    ) && (
                      <div className="px-2 py-2 border rounded-md border-yellow-500 bg-yellow-500/20">
                        <span className="text-yellow-500 text-sm">Champion</span>
                        <div className="flex gap-2 items-center">
                          <Trophy className="w-5 h-5 text-yellow-500" />
                          <p className="font-bold">{competition.awards.team.find((award) => award.name === 'Champions')?.winner?.name}</p>
                        </div>
                      </div>
                    )
                  }
                  <div className="border-t border-t-muted-foreground pt-2 flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">{4}/{4} matches played</span>
                    <Link
                      href={`competition/${competition._id}`}
                      className="text-emerald-500"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))
            }
          </div>
        )
      }
      {
        filteredCompetitions.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 p-8 border border-muted-foreground rounded-lg text-center">
            { activeTab === 'all competitions' && <CalendarClock className="w-16 h-16" /> }
            { activeTab === 'league' && <Trophy className="w-16 h-16" /> }
            { activeTab === 'knockout' && <Crown className="w-16 h-16" /> }
            { activeTab === 'hybrid' && <Bolt className="w-16 h-16" /> }
            <div>
              <p>No Valid Competitions</p>
              <span className="text-sm">Await more competitions or contact FSM to register one of your own</span>
            </div>
          </div>
        )
      }
=======
      {/* Competition List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-px bg-muted/30">
          {/* Sample Competition 1 */}
          <Link
            href={`/sports/football/competitions/1234`}
            className="group block bg-background hover:bg-muted/50 transition-colors"
          >
            <div className="px-6 py-8 border-l-4 border-emerald-500">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-emerald-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                          FUPRE Super League
                        </h3>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium uppercase tracking-wide">
                          League
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium uppercase tracking-wide">
                          Ongoing
                        </span>
                      </div>

                      <p className="text-muted-foreground mb-4 max-w-2xl">
                        The premier football competition at FUPRE featuring the best teams from across all faculties
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-semibold text-foreground">8</div>
                          <div className="text-muted-foreground">Teams</div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">12/28</div>
                          <div className="text-muted-foreground">Matches</div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">League Phase</div>
                          <div className="text-muted-foreground">Current Stage</div>
                        </div>
                        <div>
                          <div className="font-semibold text-emerald-600">Prince Okafor</div>
                          <div className="text-muted-foreground">Top Scorer (9 goals)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center">
                  <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-2 transition-all" />
                </div>
              </div>
            </div>
          </Link>

          {/* Sample Competition 2 */}
          <Link
            href={`/sports/football/competitions/5678`}
            className="group block bg-background hover:bg-muted/50 transition-colors"
          >
            <div className="px-6 py-8 border-l-4 border-purple-500">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-purple-100 flex items-center justify-center">
                      <Crown className="w-8 h-8 text-purple-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-purple-600 transition-colors">
                          Unity Cup Championship
                        </h3>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium uppercase tracking-wide">
                          Knockout
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium uppercase tracking-wide">
                          Completed
                        </span>
                      </div>

                      <p className="text-muted-foreground mb-4 max-w-2xl">
                        Annual knockout tournament bringing together teams from all departments
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-semibold text-foreground">16</div>
                          <div className="text-muted-foreground">Teams</div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Final</div>
                          <div className="text-muted-foreground">Stage Reached</div>
                        </div>
                        <div>
                          <div className="font-semibold text-yellow-600 flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            Matadors FC
                          </div>
                          <div className="text-muted-foreground">Champions</div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">2024</div>
                          <div className="text-muted-foreground">Season</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-purple-600 group-hover:translate-x-2 transition-all" />
                </div>
              </div>
            </div>
          </Link>

          {/* Sample Competition 3 */}
          <Link
            href={`/sports/football/competitions/9012`}
            className="group block bg-background hover:bg-muted/50 transition-colors"
          >
            <div className="px-6 py-8 border-l-4 border-orange-500">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-orange-100 flex items-center justify-center">
                      <CalendarClock className="w-8 h-8 text-orange-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-orange-600 transition-colors">
                          Inter-Faculty Championship
                        </h3>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium uppercase tracking-wide">
                          League
                        </span>
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium uppercase tracking-wide">
                          Upcoming
                        </span>
                      </div>

                      <p className="text-muted-foreground mb-4 max-w-2xl">
                        Annual competition between different faculties showcasing academic rivalry on the pitch
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-semibold text-foreground">12</div>
                          <div className="text-muted-foreground">Teams</div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">March 2025</div>
                          <div className="text-muted-foreground">Start Date</div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">Registration</div>
                          <div className="text-muted-foreground">Current Phase</div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">6 weeks</div>
                          <div className="text-muted-foreground">Duration</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-orange-600 group-hover:translate-x-2 transition-all" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
      {/* Empty State - Show when no competitions match filter */}
      {false && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto bg-muted flex items-center justify-center">
              {activeTab === 'all competitions' && <CalendarClock className="w-12 h-12 text-muted-foreground" />}
              {activeTab === 'league' && <Trophy className="w-12 h-12 text-muted-foreground" />}
              {activeTab === 'knockout' && <Crown className="w-12 h-12 text-muted-foreground" />}
              {activeTab === 'hybrid' && <Bolt className="w-12 h-12 text-muted-foreground" />}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">No competitions found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {activeTab === 'all competitions'
                  ? "No competitions are currently available. Check back later for updates."
                  : `No ${activeTab} competitions are currently running. Try a different filter.`
                }
              </p>
            </div>
          </div>
        </div>
      )}
>>>>>>> adcd7581505090143593a626bfd54578816be270
    </div>
  );
}