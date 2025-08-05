'use client'

import { Loader } from "@/components/ui/loader";
import { getFootballCompetitionPageData } from "@/lib/requests/v2/homepage/requests";
import { IV2FootballCompetition } from "@/utils/V2Utils/v2requestData.types";
import { ArrowRight, Bolt, CalendarClock, Crown, Star, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
  const [activeTab, setActiveTab] = useState<string>('all competitions')

  useEffect(() => {
    const fetchData = async () => {
      const response = await getFootballCompetitionPageData();
      if(response?.code === '00') {
        setPageData(response.data)
      } else {
        toast.error(response?.message || 'Error Getting Analytics')
      }

      setLoading(false);
    }

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
    <div className="min-h-screen p-4 md:p-8 space-y-4">
      {/* Header */}
      <div className="text-center">
        <div>
          <div className="relative max-w-[90vw] sm:max-w-none">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-emerald-500">Football</span> Competitions
            </h1>
            <div className="absolute -top-4 -right-4 w-8 h-8 sm:w-12 sm:h-12 bg-orange-500/10 rounded-full animate-ping" />
          </div>
          <p className="text-base lg:text-xl text-muted-foreground mt-2">
            Discover all the exciting football competitions happening at FUPRE.<br/>From league championships to knockout tournaments.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="hidden md:block"></div>
          <div className="py-4 rounded-lg border border-muted-foreground">
            <p className="text-emerald-500 text-lg font-bold">{pageData?.allCompetitions.length || 0}</p>
            <span className="text-muted-foreground">Total Competitions</span>
          </div>
          <div className="py-4 rounded-lg border border-muted-foreground">
            <p className="text-blue-500 text-lg font-bold">{pageData?.liveCompetitionFixturesCount || 0}</p>
            <span className="text-muted-foreground">Live Now</span>
          </div>
          <div className="py-4 rounded-lg border border-muted-foreground">
            <p className="text-yellow-500 text-lg font-bold">{pageData?.competitionFixturesCount || 0}</p>
            <span className="text-muted-foreground">Matches Played</span>
          </div>
        </div>
      </div>

      {/* Featured Competitions */}
      <div className="mt-16">
        {/* Header */}
        <div className="flex gap-2 items-center">
          <Star className="text-yellow-500 w-6 h-6" />
          <h2 className="font-bold text-xl">Featured Competitions</h2>
        </div>

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
            >
              { tab === 'league' && <Trophy className="w-4 h-4" />  }
              { tab === 'knockout' && <Crown className="w-4 h-4" />  }
              { tab === 'hybrid' && <Bolt className="w-4 h-4" />  }
              <p>{ tab }</p>
            </div>
            ))
        }
      </div>

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
    </div>
  );
}