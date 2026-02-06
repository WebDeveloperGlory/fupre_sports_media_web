'use client';

import { Loader } from '@/components/ui/loader';
import { BackButton } from '@/components/ui/back-button';
import { Calendar, Info, Shield, Target, Trophy, Users } from 'lucide-react';
import React, { use, useEffect, useMemo, useState } from 'react';
import LeagueTable, { LeagueTableEntry } from '@/components/competition/LeagueTable';
import { CompetitionResponse, CompetitionStatsResponse, FixtureResponse } from '@/lib/types/v1.response.types';
import { CompetitionType, GroupTable, LeagueStanding } from '@/types/v1.football-competition.types';
import { FixtureStatus } from '@/types/v1.football-fixture.types';
import { footballCompetitionApi } from '@/lib/api/v1/football-competition.api';
import { footballFixtureApi } from '@/lib/api/v1/football-fixture.api';
import Link from 'next/link';
import { format } from 'date-fns';


type TabKey = 'tables' | 'groups' | 'fixtures' | 'statistics' | 'teams' | 'info';

type GroupStageView = {
  id: string;
  name: string;
  standings: LeagueTableEntry[];
};

export default function SingleCompetitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  const [loading, setLoading] = useState<boolean>(true);
  const [competition, setCompetition] = useState<CompetitionResponse | null>(null);
  const [fixtures, setFixtures] = useState<FixtureResponse[]>([]);
  const [stats, setStats] = useState<CompetitionStatsResponse | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const [fixturesFilter, setFixturesFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [competitionRes, statsRes, fixturesRes] = await Promise.all([
          footballCompetitionApi.getById(resolvedParams.id),
          footballCompetitionApi.getStats(resolvedParams.id),
          footballFixtureApi.search({ competition: resolvedParams.id, page: 1, limit: 200 }),
        ]);

        if (competitionRes?.success && competitionRes.data) {
          setCompetition(competitionRes.data);
        }

        if (statsRes?.success && statsRes.data) {
          setStats(statsRes.data);
        }

        if (fixturesRes?.data) {
          setFixtures(Array.isArray(fixturesRes.data) ? fixturesRes.data : []);
        }
      } catch (error) {
        console.error('Error loading competition data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (loading) fetchData();
  }, [loading, resolvedParams.id]);

  const teamMap = useMemo(() => {
    const map = new Map<string, CompetitionResponse['teams'][number]>();
    if (competition?.teams) {
      competition.teams.forEach((team) => {
        map.set(team.id, team);
      });
    }
    return map;
  }, [competition]);

  const mapStandings = (standings?: LeagueStanding[] | null): LeagueTableEntry[] => {
    if (!standings || standings.length === 0) return [];

    return standings.map((entry) => {
      const team = teamMap.get(entry.team);
      return {
        team: {
          id: team?.id ?? entry.team,
          name: team?.name ?? 'Unknown',
          shorthand: team?.shorthand,
        },
        played: entry.played,
        wins: entry.wins,
        draws: entry.draws,
        losses: entry.losses,
        goalsFor: entry.goalsFor,
        goalsAgainst: entry.goalsAgainst,
        goalDifference: entry.goalDifference ?? entry.goalsFor - entry.goalsAgainst,
        points: entry.points,
        form: entry.form ?? [],
      };
    });
  };

  const leagueTable = useMemo(() => mapStandings(competition?.leagueTable || []), [competition, teamMap]);

  const groupStages = useMemo(() => {
    const groups: GroupTable[] = competition?.groupStage || [];
    return groups.map((group) => ({
      id: group.id,
      name: group.name || `Group ${group.groupNumber}`,
      standings: mapStandings(group.standings || []),
    }));
  }, [competition, teamMap]);

  const tabs = useMemo<TabKey[]>(() => {
    if (!competition) return [];

    if (competition.type === CompetitionType.LEAGUE && leagueTable.length > 0) {
      return ['tables', 'fixtures', 'statistics', 'teams', 'info'];
    }

    if (competition.type === CompetitionType.HYBRID && groupStages.length > 0) {
      return ['groups', 'fixtures', 'statistics', 'teams', 'info'];
    }

    return ['fixtures', 'statistics', 'teams', 'info'];
  }, [competition, leagueTable.length, groupStages.length]);

  useEffect(() => {
    if (tabs.length === 0) return;
    setActiveTab((prev) => (prev && tabs.includes(prev) ? prev : tabs[0]));
  }, [tabs]);

  if (loading) return <Loader />;
  if (!competition) {
    return <div className="flex justify-center items-center">Competition not found.</div>;
  }

  const totalTeams = competition.teams?.length ?? 0;
  const totalFixtures = fixtures.length;
  const completedFixtures = fixtures.filter((fx) => fx.status === FixtureStatus.COMPLETED).length;
  const daysRemaining = stats?.timeline?.daysRemaining ?? null;

  const filteredFixtures = fixtures.filter((fx) => {
    if (fixturesFilter === 'all') return true;
    if (fixturesFilter === 'upcoming') return fx.status === FixtureStatus.SCHEDULED;
    if (fixturesFilter === 'live') return fx.status === FixtureStatus.LIVE;
    if (fixturesFilter === 'completed') return fx.status === FixtureStatus.COMPLETED;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-8 md:top-24 left-4 md:left-8 z-40">
        <BackButton />
      </div>

      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 py-6 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1 space-y-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                      {competition.name || 'Unknown Competition'}
                    </h1>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium uppercase tracking-wide">
                      {competition.type || 'Unknown'}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium uppercase tracking-wide">
                      {competition.status || 'Unknown'}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
                    {competition.description || 'Competition description not available.'}
                  </p>

                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Season {competition.season || '2024/25'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{totalTeams} Teams</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>{competition.currentStage || 'In Progress'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:w-64">
              <div className="text-center lg:text-right">
                <div className="text-2xl font-bold text-emerald-600">{totalTeams}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Teams</div>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-2xl font-bold text-blue-600">{totalFixtures}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Matches</div>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-2xl font-bold text-orange-600">{completedFixtures}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Completed</div>
              </div>
              <div className="text-center lg:text-right">
                <div className="text-2xl font-bold text-purple-600">{daysRemaining ?? '--'}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Days Left</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8">
        <div className="border-b border-border">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
                {tab === 'info' && <Info className="w-4 h-4" />}
                {tab === 'groups' && <Shield className="w-4 h-4" />}
                <span className="capitalize">{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'tables' && competition.type === CompetitionType.LEAGUE && (
          <div className="bg-background">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">League Table</h2>
              <p className="text-muted-foreground">Current standings and team performance</p>
            </div>
            <LeagueTable table={leagueTable} />
          </div>
        )}

        {activeTab === 'groups' && competition.type === CompetitionType.HYBRID && (
          <div className="bg-background">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Group Stage</h2>
              <p className="text-muted-foreground">Group standings and qualification status</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {groupStages.length > 0 ? (
                groupStages.map((group) => (
                  <div key={group.id} className="bg-background md:border-l-4 md:border-l-emerald-500">
                    <div className="md:p-6">
                      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        {group.name}
                      </h3>
                      <LeagueTable table={group.standings} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No group data available.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="bg-background">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Competition Statistics</h2>
              <p className="text-muted-foreground">Key aggregates for this competition</p>
            </div>

            {!stats ? (
              <div className="text-sm text-muted-foreground">No statistics available yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                  <div className="text-xs text-muted-foreground mb-1">Teams</div>
                  <div className="text-2xl font-bold text-foreground">{stats.basicInfo.teamsCount}</div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                  <div className="text-xs text-muted-foreground mb-1">Matches</div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.leagueStats?.totalMatches ?? stats.groupStats?.totalMatches ?? stats.knockoutStats?.totalFixtures ?? 0}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                  <div className="text-xs text-muted-foreground mb-1">Completed</div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.leagueStats?.completedMatches ?? stats.groupStats?.matchesPlayed ?? stats.knockoutStats?.completedRounds ?? 0}
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                  <div className="text-xs text-muted-foreground mb-1">Completion</div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.leagueStats?.completionPercentage ?? stats.groupStats?.completionPercentage ?? stats.knockoutStats?.completionPercentage ?? 0}%
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'fixtures' && (
          <div className="bg-background">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Fixtures</h2>
                <p className="text-muted-foreground">All matches for this competition</p>
              </div>
              <div className="text-xs text-muted-foreground">
                {filteredFixtures.length} found
              </div>
            </div>

            <div className="flex gap-2 flex-wrap mb-6">
              {([
                ['all', 'All', fixtures.length],
                ['upcoming', 'Upcoming', fixtures.filter((fx) => fx.status === FixtureStatus.SCHEDULED).length],
                ['live', 'Live', fixtures.filter((fx) => fx.status === FixtureStatus.LIVE).length],
                ['completed', 'Completed', fixtures.filter((fx) => fx.status === FixtureStatus.COMPLETED).length],
              ] as const).map(([key, label, count]) => (
                <button
                  key={key}
                  onClick={() => setFixturesFilter(key)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                    fixturesFilter === key
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-card/40 text-muted-foreground border-border hover:text-foreground'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>

            {filteredFixtures.length === 0 ? (
              <div className="text-sm text-muted-foreground">No fixtures available.</div>
            ) : (
              <div className="space-y-3">
                {filteredFixtures
                  .sort((a, b) => {
                    const aTime = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
                    const bTime = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
                    return aTime - bTime;
                  })
                  .map((fx) => {
                    const isLive = fx.status === FixtureStatus.LIVE;
                    const isCompleted = fx.status === FixtureStatus.COMPLETED;
                    const homeName = fx.homeTeam?.name ?? fx.temporaryHomeTeamName ?? 'Home';
                    const awayName = fx.awayTeam?.name ?? fx.temporaryAwayTeamName ?? 'Away';
                    const scheduledDate = fx.scheduledDate ? new Date(fx.scheduledDate) : null;

                    return (
                      <div
                        key={fx.id}
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
                                <span>{scheduledDate ? format(scheduledDate, 'EEE, MMM d') : 'Unknown date'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>{scheduledDate ? format(scheduledDate, 'HH:mm') : '--:--'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isLive && (
                                <span className="flex items-center gap-1 text-red-600">
                                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                                  LIVE
                                </span>
                              )}
                              {isCompleted && <span className="text-emerald-600">Completed</span>}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <div className="font-medium truncate">
                              <span className="mr-2 truncate">{homeName}</span>
                              <span className="text-muted-foreground">vs</span>
                              <span className="ml-2 truncate">{awayName}</span>
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
                              <Link
                                href={`/sports/football/fixtures/${fx.id}/stats`}
                                className="text-sm text-emerald-600 hover:text-emerald-500"
                              >
                                View details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="bg-background">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Teams</h2>
              <p className="text-muted-foreground">All participating teams</p>
            </div>

            {competition.teams.length === 0 ? (
              <div className="text-sm text-muted-foreground">No teams registered.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {competition.teams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/teams/${team.id}`}
                    className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                        {(team.name || '?').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{team.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{team.shorthand || '-'}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="bg-background">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Competition Information</h2>
              <p className="text-muted-foreground">Rules and key details</p>
            </div>

            <div className="space-y-6">
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
                  <div className="font-semibold">{competition.currentStage || '-'}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                  <div className="text-xs text-muted-foreground mb-1">Start Date</div>
                  <div className="font-semibold">{competition.startDate ? format(new Date(competition.startDate), 'PPP') : 'Unknown'}</div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card/40 backdrop-blur-sm">
                  <div className="text-xs text-muted-foreground mb-1">End Date</div>
                  <div className="font-semibold">{competition.endDate ? format(new Date(competition.endDate), 'PPP') : 'Unknown'}</div>
                </div>
              </div>

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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
