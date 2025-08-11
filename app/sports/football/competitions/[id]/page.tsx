'use client'

import { Loader } from '@/components/ui/loader';
import { IGroupTable, IKnockoutRounds, ILeagueStandings, IPopKnockoutRounds, IV2FootballCompetition, IV2FootballFixture } from '@/utils/V2Utils/v2requestData.types';
import { Award, Calendar, Crown, Info, Shield, Target, Trophy, Users } from 'lucide-react';
import React, { use, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import LeagueTable from '@/components/competition/LeagueTable';
import { KnockoutBracket } from '@/components/competition/KnockoutBracket';
import { CompetitionStatus, CompetitionTeamForm, CompetitionTypes, FixtureStatus } from '@/utils/V2Utils/v2requestData.enums';
import { getCompetitionById, getCompetitionFixtures, getCompetitionGroups, getCompetitionKnockout, getCompetitionLeagueTable, getCompetitionStats, getCompetitionTeams } from '@/lib/requests/v2/competition/requests';

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
    const [fixtures, setFixtures] = useState<IV2FootballFixture[]>([]);
    const [teams, setTeams] = useState<IV2FootballCompetition['teams']>([]);
    const [stats, setStats] = useState<IV2FootballCompetition['stats'] | null>(null);
    const [activeTab, setActiveTab] = useState<LeagueTabs | KnockoutTabs | HybridTabs >(LeagueTabs.INFO);
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

        {/* Other sections can be added here */}

      </div>
    </div>
  );
}

export default SingleCompetitionPage