'use client'

import { Loader } from "@/components/ui/loader";
import { getFootballCompetitionPageData } from "@/lib/requests/v2/homepage/requests";
import { IV2FootballCompetition, IV2Blog, PopIV2FootballFixture } from "@/utils/V2Utils/v2requestData.types";
import { ArrowRight, Bolt, CalendarClock, Crown, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUpcomingFixtures } from "@/lib/requests/v2/fixtures/requests";
import { getAllBlogs } from "@/lib/requests/v2/admin/media-admin/news-management/requests";
import { cn } from "@/utils/cn";
import { CompetitionTypes } from "@/utils/V2Utils/v2requestData.enums";
import { format } from "date-fns";

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
  const [upcomingFixtures, setUpcomingFixtures] = useState<PopIV2FootballFixture[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<IV2Blog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, fixturesRes, blogsRes] = await Promise.all([
          getFootballCompetitionPageData(),
          getUpcomingFixtures(5),
          getAllBlogs()
        ]);

        if (compRes?.code === '00') {
          setPageData(compRes.data);
        } else if (compRes) {
          toast.error(compRes?.message || 'Error getting competitions');
        }

        if (fixturesRes?.code === '00') {
          setUpcomingFixtures(fixturesRes.data?.slice(0, 5) || []);
        }

        if (blogsRes?.code === '00') {
          const published = (blogsRes.data as IV2Blog[]).filter(b => b.isPublished);
          const sorted = published.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setLatestBlogs(sorted.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching competitions page data:', error);
        toast.error('Failed to load page data');
      } finally {
        setLoading(false);
      }
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



      {/* Highlights: Upcoming Matches + News */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Matches */}
          <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Upcoming Matches</h2>
              <Link href="/sports/football/fixtures" className="text-sm text-emerald-600 hover:text-emerald-500">View all</Link>
            </div>
            <div className="space-y-3">
              {upcomingFixtures.length > 0 ? (
                upcomingFixtures.slice(0, 3).map((fx) => (
                  <Link
                    key={fx._id}
                    href={`/fixtures/${fx._id}/stats`}
                    className="group block rounded-lg border border-transparent hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {format(fx.scheduledDate, 'EEE, MMM d • HH:mm') || 'Unknown'}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="mt-1 font-medium text-foreground">
                      {fx.homeTeam.name} <span className="text-muted-foreground">vs</span> {fx.awayTeam.name}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No upcoming fixtures.</div>
              )}
            </div>
          </div>

          {/* Latest News */}
          <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Latest News</h2>
              <Link href="/news" className="text-sm text-emerald-600 hover:text-emerald-500">View all</Link>
            </div>
            <div className="space-y-3">
              {latestBlogs.length > 0 ? (
                latestBlogs.slice(0, 3).map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/news/${blog._id}`}
                    className="group block rounded-lg border border-transparent hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-emerald-600/80 px-2 py-0.5 rounded-full bg-emerald-500/10">
                        {blog.category}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="mt-2 font-medium text-foreground line-clamp-1">{blog.title}</div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{blog.content.slice(0, 100)}...</p>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No news articles yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-xl font-semibold text-foreground">Browse by Type</h2>
          <div className="text-sm text-muted-foreground">
            {activeTab === 'all competitions' ? 'All' : activeTab} competitions
          </div>
        </div>

        <div className="flex items-center gap-1 mt-4 overflow-x-auto scrollbar-hide">
          {['all competitions', 'league', 'knockout', 'hybrid'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
                activeTab === tab
                  ? 'text-emerald-600 border-emerald-600'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
              )}
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

      {/* Competition List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-px bg-muted/30">
          {
            filteredCompetitions.length > 0 
              ? filteredCompetitions.map(comp => (
                <Link
                  key={comp._id}
                  href={`/sports/football/competitions/${comp._id}`}
                  className="group block bg-background hover:bg-muted/50 transition-colors"
                >
                  {
                    comp.type === CompetitionTypes.LEAGUE && (
                      <div className="px-6 py-8 border-l-4 border-emerald-500">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                          {/* Left Section */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center">
                                <Trophy className="w-8 h-8 text-emerald-600" />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                                    {comp.name}
                                  </h3>
                                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium uppercase tracking-wide">
                                    {comp.type}
                                  </span>
                                  {
                                    comp.status === 'ongoing' && (
                                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium uppercase tracking-wide">
                                        {comp.status}
                                      </span>
                                    )
                                  }
                                  {
                                    comp.status === 'upcoming' && (
                                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium uppercase tracking-wide">
                                        {comp.status}
                                      </span>
                                    )
                                  }
                                  {
                                    comp.status === 'completed' && (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium uppercase tracking-wide">
                                        {comp.status}
                                      </span>
                                    )
                                  }
                                </div>

                                <p className="text-muted-foreground mb-4 max-w-2xl">
                                  {comp.description}
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <div className="font-semibold text-foreground">{comp.teams.length}</div>
                                    <div className="text-muted-foreground">Teams</div>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-foreground">12/28</div>
                                    <div className="text-muted-foreground">Matches</div>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-foreground">{comp.currentStage || 'registration'}</div>
                                    <div className="text-muted-foreground">Current Stage</div>
                                  </div>
                                  {
                                    comp.leagueTable.length > 0 && (
                                      <div>
                                        <div className="font-semibold text-emerald-600">{comp.leagueTable[0].team.name}</div>
                                        <div className="text-muted-foreground">League Leaders</div>
                                      </div>
                                    )
                                  }
                                  {/* <div>
                                    <div className="font-semibold text-emerald-600">Prince Okafor</div>
                                    <div className="text-muted-foreground">Top Scorer (9 goals)</div>
                                  </div> */}
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
                    )
                  }
                  {
                    comp.type === CompetitionTypes.KNOCKOUT && (
                      <div className="px-6 py-8 border-l-4 border-purple-500">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-purple-100 flex items-center justify-center">
                                <Crown className="w-8 h-8 text-purple-600" />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h3 className="text-xl font-bold text-foreground group-hover:text-purple-600 transition-colors">
                                    {comp.name}
                                  </h3>
                                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium uppercase tracking-wide">
                                    {comp.type}
                                  </span>
                                  {
                                    comp.status === 'ongoing' && (
                                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium uppercase tracking-wide">
                                        {comp.status}
                                      </span>
                                    )
                                  }
                                  {
                                    comp.status === 'upcoming' && (
                                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium uppercase tracking-wide">
                                        {comp.status}
                                      </span>
                                    )
                                  }
                                  {
                                    comp.status === 'completed' && (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium uppercase tracking-wide">
                                        {comp.status}
                                      </span>
                                    )
                                  }
                                </div>

                                <p className="text-muted-foreground mb-4 max-w-2xl">
                                  {comp.description}
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <div className="font-semibold text-foreground">{comp.teams.length}</div>
                                    <div className="text-muted-foreground">Teams</div>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-foreground">{comp.currentStage || 'registration'}</div>
                                    <div className="text-muted-foreground">Stage Reached</div>
                                  </div>
                                  {
                                    comp.status === 'completed' && comp.awards.team.find(award => award.name === 'Champions' ) 
                                      ? (
                                        <div>
                                          <div className="font-semibold text-yellow-600 flex items-center gap-1">
                                            <Trophy className="w-4 h-4" />
                                            {comp.awards.team.find(award => award.name === 'Champions')?.winner?.name}
                                          </div>
                                          <div className="text-muted-foreground">Champions</div>
                                        </div>
                                      )
                                      : (
                                        <div>
                                          <div className="font-semibold text-foreground">12/28</div>
                                          <div className="text-muted-foreground">Matches</div>
                                        </div>
                                      )
                                  }
                                  
                                  <div>
                                    <div className="font-semibold text-foreground">{comp.season}</div>
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
                    )
                  }
                  {
                    comp.type === CompetitionTypes.HYBRID && (
                      <div className="px-6 py-8 border-l-4 border-orange-500">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-orange-100 flex items-center justify-center">
                                <CalendarClock className="w-8 h-8 text-orange-600" />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h3 className="text-xl font-bold text-foreground group-hover:text-orange-600 transition-colors">
                                    {comp.name}
                                  </h3>
                                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium uppercase tracking-wide">
                                    {comp.type}
                                  </span>
                                  {
                                    comp.status === 'ongoing' && (
                                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium uppercase tracking-wide">
                                        {comp.status}
                                      </span>
                                    )
                                  }
                                  {
                                    comp.status === 'upcoming' && (
                                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium uppercase tracking-wide">
                                        {comp.status}
                                      </span>
                                    )
                                  }
                                  {
                                    comp.status === 'completed' && (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium uppercase tracking-wide">
                                        {comp.status}
                                      </span>
                                    )
                                  }
                                </div>

                                <p className="text-muted-foreground mb-4 max-w-2xl">
                                  {comp.description}
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <div className="font-semibold text-foreground">{comp.teams.length}</div>
                                    <div className="text-muted-foreground">Teams</div>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-foreground">{format(comp.startDate, 'MMMM yyy')}</div>
                                    <div className="text-muted-foreground">Start Date</div>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-foreground">{format(comp.endDate, 'MMMM yyy')}</div>
                                    <div className="text-muted-foreground">End Date</div>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-foreground">{comp.currentStage || 'registration'}</div>
                                    <div className="text-muted-foreground">Current Phase</div>
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
                    )
                  }
                </Link>
              ))
            : (
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
            )
          }
        </div>
      </div>
    </div>
  );
}