'use client'

import { Loader } from '@/components/ui/loader';
import { BackButton } from '@/components/ui/back-button';
import { IGroupTable, IKnockoutRounds, ILeagueStandings, IPopKnockoutRounds, IV2FootballCompetition, PopIV2FootballFixture } from '@/utils/V2Utils/v2requestData.types';
import { Award, Calendar, Crown, Info, Shield, Target, Trophy, Users, ChevronDown, ChevronUp } from 'lucide-react';
import React, { use, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import LeagueTable from '@/components/competition/LeagueTable';
import { KnockoutBracket } from '@/components/competition/KnockoutBracket';
import { CompetitionStatus, CompetitionTeamForm, CompetitionTypes, FixtureStatus } from '@/utils/V2Utils/v2requestData.enums';
import { getCompetitionById, getCompetitionFixtures, getCompetitionGroups, getCompetitionKnockout, getCompetitionLeagueTable, getCompetitionStats, getCompetitionTeams } from '@/lib/requests/v2/competition/requests';
import Link from 'next/link';
import { format } from 'date-fns';
import Timeline from '@/components/newLive/Timeline';

enum LeagueTabs {
    TABLES = 'tables',
    FIXTURES = 'fixtures',
    STATISTICS = 'statistics',
    TEAMS = 'teams',
    AWARDS = 'awards',
    INFO = 'info',
}

enum KnockoutTabs {
    KNOCKOUT = 'knockout',
    STATISTICS = 'statistics',
    TEAMS = 'teams',
    AWARDS = 'awards',
    INFO = 'info',
}

enum HybridTabs {
    GROUPS = 'groups',
    KNOCKOUT = 'knockout',
    FIXTURES = 'fixtures',
    STATISTICS = 'statistics',
    TEAMS = 'teams',
    AWARDS = 'awards',
    INFO = 'info',
}

const SingleCompetitionPage = ({
params 
}: { 
  params: Promise<{ id: string }> 
}) => {
    // Basic Setup //
    const resolvedParams = use(params);
    // End of Basic Setup //    
    
    // States //
    const [loading, setLoading] = useState<boolean>(true);
    const [competition, setCompetition] = useState<IV2FootballCompetition | null>(null);
    const [leagueTable, setLeagueTable] = useState<ILeagueStandings[]>([]);
    const [knockoutRounds, setKnockoutRounds] = useState<IPopKnockoutRounds[]>([]);
    const [groupStages, setGroupStages] = useState<IGroupTable[]>([]);
    const [fixtures, setFixtures] = useState<PopIV2FootballFixture[]>([]);
    const [fixturesFilter, setFixturesFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
    const [teams, setTeams] = useState<IV2FootballCompetition['teams']>([]);
    const [stats, setStats] = useState<IV2FootballCompetition['stats'] | null>(null);
    const [activeTab, setActiveTab] = useState<LeagueTabs | KnockoutTabs | HybridTabs >(LeagueTabs.INFO);
    const [expandedLiveMatches, setExpandedLiveMatches] = useState<Set<string>>(new Set());
    // End of States //

    // On Load //
    useEffect( () => {
      const fetchData = async () => {
        const competitionData = await getCompetitionById( resolvedParams.id );
        const leagueTableData = await getCompetitionLeagueTable( resolvedParams.id );
        const knockoutData = await getCompetitionKnockout( resolvedParams.id );
        const groupData = await getCompetitionGroups( resolvedParams.id );
        const fixtureData = await getCompetitionFixtures( resolvedParams.id );
        const statData = await getCompetitionStats( resolvedParams.id );
        const teamData = await getCompetitionTeams( resolvedParams.id );

        if( competitionData && competitionData.data ) {
          setCompetition( competitionData.data );

          if(competitionData.data.type === CompetitionTypes.LEAGUE && leagueTableData && leagueTableData.data) {
            setLeagueTable(leagueTableData.data);
            setActiveTab(LeagueTabs.TABLES);
          }
          if(competitionData.data.type === CompetitionTypes.KNOCKOUT && knockoutData && knockoutData.data) {
            setKnockoutRounds(knockoutData.data);
            setActiveTab(KnockoutTabs.KNOCKOUT);
          }
          if(competitionData.data.type === CompetitionTypes.HYBRID && knockoutData && knockoutData.data && groupData && groupData.data) {
            setGroupStages(groupData.data);
            setKnockoutRounds(knockoutData.data);
            setActiveTab(HybridTabs.GROUPS);
          }

          if(teamData && teamData.data) {
            setTeams(teamData.data)
          }
          if(fixtureData && fixtureData.data) {
            setFixtures(fixtureData.data)
          }
          if(statData && statData.data) {
            setStats(statData.data)
          }
        }

        setLoading( false );
      }

      if( loading ) fetchData();
    }, [ loading ]);

    if( loading ) {
        return <Loader />
    };
    if( !loading && !competition ) {
        return <div className='flex justify-center items-center'>Uh Oh! Competition does not exist. Wonder how you got here anyways.</div>
    }
    // End of On Load //


  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="fixed top-8 md:top-24 left-4 md:left-8 z-40">
        <BackButton />
      </div>
      {/* Header Section */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Competition Info */}
            <div className="flex-1 space-y-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                      {competition?.name || 'Unknown Competition'}
                    </h1>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium uppercase tracking-wide">
                      {competition?.type || 'Unknown'}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium uppercase tracking-wide">
                      {competition?.status || 'Unknown'}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
                    {competition?.description || 'Competition description not available.'}
                  </p>

                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Season {competition?.season || '2024/25'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{competition?.teams.length || 0} Teams</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>{competition?.currentStage || 'In Progress'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:w-64">
              <div className="text-center lg:text-right">
                <div className="text-2xl font-bold text-emerald-600">
                  {String(Math.ceil(Number(competition?.stats?.averageGoalsPerMatch || 0) * 12))}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Total Goals</div>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {String(competition?.stats?.averageGoalsPerMatch || 0)}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Goals/Match</div>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {String(competition?.stats?.averageAttendance || 0)}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Avg Attendance</div>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Remaining</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {competition && Object.values(
              competition.type === CompetitionTypes.LEAGUE
                ? LeagueTabs
                : competition.type === CompetitionTypes.KNOCKOUT
                  ? KnockoutTabs
                  : HybridTabs
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab
                      ? 'text-emerald-600 border-emerald-600'
                      : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
                  }
                `}
              >
                {tab === 'tables' && <Trophy className="w-4 h-4" />}
                {tab === 'fixtures' && <Calendar className="w-4 h-4" />}
                {tab === 'statistics' && <Target className="w-4 h-4" />}
                {tab === 'teams' && <Users className="w-4 h-4" />}
                {tab === 'awards' && <Award className="w-4 h-4" />}
                {tab === 'info' && <Info className="w-4 h-4" />}
                {tab === 'knockout' && <Crown className="w-4 h-4" />}
                {tab === 'groups' && <Shield className="w-4 h-4" />}
                <span className="capitalize">{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* League Table */}
        {activeTab === LeagueTabs.TABLES && competition?.type === CompetitionTypes.LEAGUE && (
          <div className="bg-background">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">League Table</h2>
              <p className="text-muted-foreground">Current standings and team performance</p>
            </div>
            <LeagueTable table={leagueTable} />
          </div>
        )}

        {/* Knockout Bracket */}
        {(activeTab === KnockoutTabs.KNOCKOUT || activeTab === HybridTabs.KNOCKOUT) && (
          <div className="bg-background">
            <div className="mb-6">
              {competition && competition.type === CompetitionTypes.KNOCKOUT && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Tournament Bracket</h2>
                  <p className="text-muted-foreground">Knockout stage progression and results</p>
                </div>
              )}
              {competition && competition.type === CompetitionTypes.HYBRID && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Knockout Stage</h2>
                  <p className="text-muted-foreground">Elimination rounds following group stage</p>
                </div>
              )}
            </div>

            <KnockoutBracket knockoutRounds={knockoutRounds} />
          </div>
        )}

        {/* Group Tables */}
        {competition && competition.type === CompetitionTypes.HYBRID && activeTab === HybridTabs.GROUPS && (
          <div className="bg-background">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Group Stage</h2>
              <p className="text-muted-foreground">Group standings and qualification status</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {groupStages.length > 0 && groupStages.map(group => (
                <div key={group._id} className="bg-background md:border-l-4 md:border-l-emerald-500">
                  <div className="md:p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      {group.name}
                    </h3>
                    <LeagueTable table={group.standings} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics */}
        {(activeTab === LeagueTabs.STATISTICS || activeTab === KnockoutTabs.STATISTICS || activeTab === HybridTabs.STATISTICS) && (
          <div className="bg-background">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Competition Statistics</h2>
              <p className="text-muted-foreground">Key aggregates and leaderboards for this competition</p>
            </div>

            {!stats ? (
              <div className="text-sm text-muted-foreground">No statistics available yet.</div>
            ) : (
              <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-500" />
                      Average Goals/Match
                    </div>
                    <div className="text-2xl font-bold text-foreground">{Number(stats.averageGoalsPerMatch ?? 0)}</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-500" />
                      Average Attendance
                    </div>
                    <div className="text-2xl font-bold text-foreground">{Number(stats.averageAttendance ?? 0)}</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      Clean Sheets
                    </div>
                    <div className="text-2xl font-bold text-foreground">{Number(stats.cleanSheets ?? 0)}</div>
                  </div>
                </div>

                {/* Leaderboards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Top Scorers */}
                  <div className="rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                    <div className="p-4 border-b border-border flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-emerald-500" />
                      <h3 className="text-sm font-semibold">Top Scorers</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {stats.topScorers && stats.topScorers.length > 0 ? (
                        stats.topScorers.map((s, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div className="min-w-0">
                              <div className="font-medium truncate">{(s.player as any)?.name ?? 'Unknown'}</div>
                              <div className="text-muted-foreground truncate">{(s.team as any)?.name ?? 'Unknown Team'}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-emerald-500">{s.goals}</span>
                              <span className="text-muted-foreground">goals</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No scorers yet.</div>
                      )}
                    </div>
                  </div>

                  {/* Top Assists */}
                  <div className="rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                    <div className="p-4 border-b border-border flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-500" />
                      <h3 className="text-sm font-semibold">Top Assists</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {stats.topAssists && stats.topAssists.length > 0 ? (
                        stats.topAssists.map((a, i) => {
                          const playerName = (a as any)?.player?.name ?? (a as any)?.team?.name ?? 'Unknown';
                          const teamName = (a as any)?.team?.name ?? (a as any)?.player?.team?.name ?? 'Unknown Team';
                          return (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <div className="min-w-0">
                                <div className="font-medium truncate">{playerName}</div>
                                <div className="text-muted-foreground truncate">{teamName}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-emerald-500">{(a as any)?.assists ?? 0}</span>
                                <span className="text-muted-foreground">assists</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-sm text-muted-foreground">No assists yet.</div>
                      )}
                    </div>
                  </div>

                  {/* Best Defenses */}
                  <div className="rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                    <div className="p-4 border-b border-border flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      <h3 className="text-sm font-semibold">Best Defenses</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {stats.bestDefenses && stats.bestDefenses.length > 0 ? (
                        stats.bestDefenses.map((b, i) => {
                          const teamName = (b as any)?.team?.name ?? 'Unknown Team';
                          const cleanSheets = (b as any)?.cleanSheets ?? 0;
                          const conceded = (b as any)?.goalsConceded ?? 0;
                          return (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <div className="min-w-0">
                                <div className="font-medium truncate">{teamName}</div>
                                <div className="text-muted-foreground truncate">Conceded: {conceded}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-emerald-500">{cleanSheets}</span>
                                <span className="text-muted-foreground">CS</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-sm text-muted-foreground">No defensive stats yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fixtures */}
        {((activeTab === LeagueTabs.FIXTURES) || (activeTab === HybridTabs.FIXTURES)) && (
          <div className="bg-background">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Fixtures</h2>
              <p className="text-muted-foreground">Browse all fixtures by status. Live matches are highlighted.</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide">
              {(() => {
                const safeFixtures = Array.isArray(fixtures) ? fixtures : [];
                const counts = safeFixtures.reduce(
                  (acc, fx) => {
                    if (fx.status === FixtureStatus.LIVE) acc.live += 1;
                    if (fx.status === FixtureStatus.COMPLETED) acc.completed += 1;
                    if (fx.status === FixtureStatus.SCHEDULED) acc.upcoming += 1;
                    acc.all += 1;
                    return acc;
                  },
                  { all: 0, upcoming: 0, live: 0, completed: 0 }
                );
                const items: { key: typeof fixturesFilter; label: string; count: number }[] = [
                  { key: 'all', label: 'All', count: counts.all },
                  { key: 'upcoming', label: 'Upcoming', count: counts.upcoming },
                  { key: 'live', label: 'Live', count: counts.live },
                  { key: 'completed', label: 'Completed', count: counts.completed },
                ];
                return items.map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFixturesFilter(key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
                      fixturesFilter === key
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-card/40 text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ));
              })()}
            </div>

            {/* List */}
            {(!Array.isArray(fixtures) || fixtures.length === 0) ? (
              <div className="text-sm text-muted-foreground">No fixtures available.</div>
            ) : (
              <div className="space-y-3">
                {(Array.isArray(fixtures) ? fixtures : [])
                  .filter((fx) => {
                    if (fixturesFilter === 'all') return true;
                    if (fixturesFilter === 'upcoming') return fx.status === FixtureStatus.SCHEDULED;
                    if (fixturesFilter === 'live') return fx.status === FixtureStatus.LIVE;
                    if (fixturesFilter === 'completed') return fx.status === FixtureStatus.COMPLETED;
                    return true;
                  })
                  .sort((a, b) => {
                    const aTime = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
                    const bTime = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
                    return aTime - bTime;
                  })
                  .map((fx) => {
                    const isLive = fx.status === FixtureStatus.LIVE;
                    const isCompleted = fx.status === FixtureStatus.COMPLETED;
                    const isExpanded = expandedLiveMatches.has(fx._id);
                    const hasTimeline = fx.timeline && fx.timeline.length > 0;

                    const toggleExpanded = () => {
                      const newExpanded = new Set(expandedLiveMatches);
                      if (isExpanded) {
                        newExpanded.delete(fx._id);
                      } else {
                        newExpanded.add(fx._id);
                      }
                      setExpandedLiveMatches(newExpanded);
                    };

                    return (
                      <div
                        key={fx._id}
                        className={`rounded-xl border backdrop-blur-sm transition-colors ${
                          isLive
                            ? 'border-red-300/50 bg-red-50/40 dark:bg-red-900/10'
                            : 'border-border bg-card/40'
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{fx.scheduledDate ? format(fx.scheduledDate, 'EEE, MMM d') : 'Unknown date'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>{fx.scheduledDate ? format(fx.scheduledDate, 'HH:mm') : '--:--'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isLive && (
                                <span className="flex items-center gap-1 text-red-600">
                                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                                  LIVE
                                </span>
                              )}
                              {isCompleted && (
                                <span className="text-emerald-600">Completed</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <div className="font-medium truncate">
                              <span className="mr-2 truncate">{(fx as any)?.homeTeam?.name ?? 'Home'}</span>
                              <span className="text-muted-foreground">vs</span>
                              <span className="ml-2 truncate">{(fx as any)?.awayTeam?.name ?? 'Away'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {isCompleted && fx.result && (
                                <span className="text-sm font-semibold">
                                  {fx.result.homeScore} - {fx.result.awayScore}
                                </span>
                              )}
                              {isLive && fx.result && (
                                <span className="text-sm font-semibold text-red-600">
                                  {fx.result.homeScore} - {fx.result.awayScore}
                                </span>
                              )}
                              {isLive && hasTimeline && (
                                <button
                                  onClick={toggleExpanded}
                                  className="text-sm text-emerald-600 hover:text-emerald-500 flex items-center gap-1"
                                >
                                  Timeline
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              )}
                              <Link href={`/fixtures/${fx._id}/stats`} className="text-sm text-emerald-600 hover:text-emerald-500">
                                {isLive ? 'Open live' : 'View details'}
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Timeline Section for Live Matches */}
                        {isLive && hasTimeline && isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-border/50 p-4"
                          >
                            <Timeline
                              events={fx.timeline}
                              homeTeamName={fx.homeTeam.name}
                              awayTeamName={fx.awayTeam.name}
                              isLive={true}
                            />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* Teams */}
        {(activeTab === LeagueTabs.TEAMS || activeTab === KnockoutTabs.TEAMS || activeTab === HybridTabs.TEAMS) && (
          <div className="bg-background">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Teams</h2>
              <p className="text-muted-foreground">All participating teams</p>
            </div>

            {teams.length === 0 ? (
              <div className="text-sm text-muted-foreground">No teams registered.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((entry, idx) => (
                  <Link key={idx} href={`/teams/${entry.team._id}`} className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                        {(entry.team.name || '?').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{entry.team.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{entry.team.shorthand || '—'}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Awards */}
        {(activeTab === LeagueTabs.AWARDS || activeTab === KnockoutTabs.AWARDS || activeTab === HybridTabs.AWARDS) && (
          <div className="bg-background">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Awards</h2>
              <p className="text-muted-foreground">Competition recognitions and winners</p>
            </div>

            {(!competition?.awards || (competition.awards.player.length === 0 && competition.awards.team.length === 0)) ? (
              <div className="text-sm text-muted-foreground">No awards available.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Awards */}
                <div className="rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                  <div className="p-4 border-b border-border flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-sm font-semibold">Team Awards</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {competition.awards.team.length > 0 ? (
                      competition.awards.team.map((aw, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="font-medium">{aw.name}</div>
                          <div className="text-muted-foreground">{aw.winner ? aw.winner.name : 'TBD'}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">No team awards.</div>
                    )}
                  </div>
                </div>

                {/* Player Awards */}
                <div className="rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                  <div className="p-4 border-b border-border flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-sm font-semibold">Player Awards</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {competition.awards.player.length > 0 ? (
                      competition.awards.player.map((aw, i) => (
                        <div key={i} className="text-sm">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{aw.name}</div>
                            <div className="text-muted-foreground">{aw.winner ? aw.winner.player : 'TBD'}</div>
                          </div>
                          {aw.winner && (
                            <div className="text-xs text-muted-foreground">Team: {aw.winner.team}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">No player awards.</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        {(activeTab === LeagueTabs.INFO || activeTab === KnockoutTabs.INFO || activeTab === HybridTabs.INFO) && (
          <div className="bg-background">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Competition Information</h2>
              <p className="text-muted-foreground">Format, rules and other details</p>
            </div>

            {competition && (
              <div className="space-y-6">
                {/* Basics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                    <div className="text-xs text-muted-foreground mb-1">Type</div>
                    <div className="font-semibold capitalize">{competition.type}</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                    <div className="text-xs text-muted-foreground mb-1">Season</div>
                    <div className="font-semibold">{competition.season}</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                    <div className="text-xs text-muted-foreground mb-1">Stage</div>
                    <div className="font-semibold">{competition.currentStage || '—'}</div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                    <div className="text-xs text-muted-foreground mb-1">Start Date</div>
                    <div className="font-semibold">{competition.startDate ? format(competition.startDate, 'PPP') : 'Unknown'}</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                    <div className="text-xs text-muted-foreground mb-1">End Date</div>
                    <div className="font-semibold">{competition.endDate ? format(competition.endDate, 'PPP') : 'Unknown'}</div>
                  </div>
                </div>

                {/* Format Details */}
                <div className="rounded-lg border border-border bg-card/40 backdrop-blur-sm p-4 space-y-3">
                  <div className="font-semibold">Format</div>
                  {competition.format.leagueStage && (
                    <div className="text-sm text-muted-foreground">
                      <div>League: {competition.format.leagueStage.matchesPerTeam} matches per team</div>
                      <div>Points: W {competition.format.leagueStage.pointsSystem.win} / D {competition.format.leagueStage.pointsSystem.draw} / L {competition.format.leagueStage.pointsSystem.loss}</div>
                    </div>
                  )}
                  {competition.format.groupStage && (
                    <div className="text-sm text-muted-foreground">
                      <div>Groups: {competition.format.groupStage.numberOfGroups} groups of {competition.format.groupStage.teamsPerGroup}</div>
                      <div>Advancing per group: {competition.format.groupStage.advancingPerGroup}</div>
                    </div>
                  )}
                  {competition.format.knockoutStage && (
                    <div className="text-sm text-muted-foreground">
                      <div>Knockout: {competition.format.knockoutStage.hasTwoLegs ? 'Two-legged ties' : 'Single-leg ties'}</div>
                      <div>Away goals rule: {competition.format.knockoutStage.awayGoalsRule ? 'Yes' : 'No'}</div>
                    </div>
                  )}
                </div>

                {/* Rules */}
                <div className="rounded-lg border border-border bg-card/40 backdrop-blur-sm p-4 space-y-3">
                  <div className="font-semibold">Rules</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <div>Substitutions: {competition.rules.substitutions.allowed ? `Up to ${competition.rules.substitutions.maximum}` : 'Not allowed'}</div>
                    <div>Extra time: {competition.rules.extraTime ? 'Yes' : 'No'}</div>
                    <div>Penalties: {competition.rules.penalties ? 'Yes' : 'No'}</div>
                    <div>Match duration: {competition.rules.matchDuration.normal}' (+{competition.rules.matchDuration.extraTime}')</div>
                    <div>Squad size: {competition.rules.squadSize.min} - {competition.rules.squadSize.max}</div>
                  </div>
                </div>

                {/* Sponsors & Prize */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border bg-card/40 backdrop-blur-sm p-4">
                    <div className="font-semibold mb-2">Sponsors</div>
                    {competition.sponsors.length > 0 ? (
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {competition.sponsors.map((s, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span>{s.name}</span>
                            <span className="uppercase text-xs">{s.tier}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No sponsors listed.</div>
                    )}
                  </div>
                  <div className="rounded-lg border border-border bg-card/40 backdrop-blur-sm p-4">
                    <div className="font-semibold mb-2">Prize Money</div>
                    {competition.prizeMoney ? (
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Champion: ₦{competition.prizeMoney.champion}</div>
                        <div>Runner-up: ₦{competition.prizeMoney.runnerUp}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Not specified.</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other sections can be added here */}

      </div>
    </div>
  );
}

export default SingleCompetitionPage