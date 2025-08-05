'use client'

import { Loader } from '@/components/ui/loader';
import { IGroupTable, IKnockoutRounds, ILeagueStandings, IPopKnockoutRounds, IV2FootballCompetition } from '@/utils/V2Utils/v2requestData.types';
import { Award, Calendar, Crown, Info, Shield, Target, Trophy, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import LeagueTable from '@/components/competition/LeagueTable';
import { KnockoutBracket } from '@/components/competition/KnockoutBracket';
import { CompetitionStatus, CompetitionTeamForm, CompetitionTypes, FixtureStatus } from '@/utils/V2Utils/v2requestData.enums';

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



const mockCompetitions: IV2FootballCompetition[] = [
  {
    _id: "comp-league-001",
    name: "Campus Premier League",
    shorthand: "CPL",
    type: CompetitionTypes.LEAGUE,
    logo: "https://example.com/logos/cpl.png",
    coverImage: "https://example.com/covers/cpl.jpg",
    description: "A season-long league for departmental teams.",
    status: CompetitionStatus.ONGOING,
    format: {
      leagueStage: {
        matchesPerTeam: 18,
        pointsSystem: {
          win: 3,
          draw: 1,
          loss: 0
        }
      }
    },
    season: "2024/2025",
    startDate: new Date("2024-10-01"),
    endDate: new Date("2025-03-30"),
    currentStage: "League Stage",
    teams: [
        {
            "team": {_id: 'team1', name: "team1", shorthand: 'T1'},
            "squad": [
                { "player": "team1-p1", "jerseyNumber": 7, "isCaptain": true, "position": "forward" },
                { "player": "team1-p2", "jerseyNumber": 10, "isCaptain": false, "position": "midfielder" },
                { "player": "team1-p3", "jerseyNumber": 1, "isCaptain": false, "position": "goalkeeper" }
            ]
        },
        {
            "team": {_id: 'team2', name: "team2", shorthand: 'T2'},
            "squad": [
                { "player": "team2-p1", "jerseyNumber": 7, "isCaptain": true, "position": "forward" },
                { "player": "team2-p2", "jerseyNumber": 10, "isCaptain": false, "position": "midfielder" },
                { "player": "team2-p3", "jerseyNumber": 1, "isCaptain": false, "position": "goalkeeper" }
            ]
        },
        {
            "team": {_id: 'team3', name: "team3", shorthand: 'T3'},
            "squad": [
                { "player": "team3-p1", "jerseyNumber": 7, "isCaptain": true, "position": "forward" },
                { "player": "team3-p2", "jerseyNumber": 10, "isCaptain": false, "position": "midfielder" },
                { "player": "team3-p3", "jerseyNumber": 1, "isCaptain": false, "position": "goalkeeper" }
            ]
        },
        {
            "team": {_id: 'team6', name: "team6", shorthand: 'T6'},
            "squad": [
                { "player": "team6-p1", "jerseyNumber": 7, "isCaptain": true, "position": "forward" },
                { "player": "team6-p2", "jerseyNumber": 10, "isCaptain": false, "position": "midfielder" },
                { "player": "team6-p3", "jerseyNumber": 1, "isCaptain": false, "position": "goalkeeper" }
            ]
        }
    ],
    stats: {
      averageGoalsPerMatch: 2.4,
      averageAttendance: 120,
      cleanSheets: 15,
      topScorers: [],
      topAssists: [],
      bestDefenses: []
    },
    leagueTable: [],
    knockoutRounds: [],
    groupStage: [],
    awards: { player: [], team: [] },
    rules: {
      substitutions: { allowed: true, maximum: 5 },
      extraTime: false,
      penalties: false,
      matchDuration: { normal: 90, extraTime: 30 },
      squadSize: { min: 15, max: 25 }
    },
    extraRules: [],
    sponsors: [],
    prizeMoney: { champion: 100000, runnerUp: 50000 },
    isActive: true,
    isFeatured: true,
    admin: "admin-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "comp-knockout-001",
    name: "Campus Champions Cup",
    shorthand: "CCC",
    type: CompetitionTypes.KNOCKOUT,
    logo: "https://example.com/logos/ccc.png",
    coverImage: "https://example.com/covers/ccc.jpg",
    description: "Knockout format tournament among faculty teams.",
    status: CompetitionStatus.UPCOMING,
    format: {
      knockoutStage: {
        hasTwoLegs: false,
        awayGoalsRule: false
      }
    },
    season: "2024",
    startDate: new Date("2024-08-15"),
    endDate: new Date("2024-09-15"),
    registrationDeadline: new Date("2024-08-01"),
    teams: [
        {
            "team": {_id: 'team1', name: "team1", shorthand: 'T1'},
            "squad": [
                { "player": "team1-p1", "jerseyNumber": 7, "isCaptain": true, "position": "forward" },
                { "player": "team1-p2", "jerseyNumber": 10, "isCaptain": false, "position": "midfielder" },
                { "player": "team1-p3", "jerseyNumber": 1, "isCaptain": false, "position": "goalkeeper" }
            ]
        },
        {
            "team": {_id: 'team2', name: "team2", shorthand: 'T2'},
            "squad": [
                { "player": "team2-p1", "jerseyNumber": 7, "isCaptain": true, "position": "forward" },
                { "player": "team2-p2", "jerseyNumber": 10, "isCaptain": false, "position": "midfielder" },
                { "player": "team2-p3", "jerseyNumber": 1, "isCaptain": false, "position": "goalkeeper" }
            ]
        },
        {
            "team": {_id: 'team3', name: "team3", shorthand: 'T3'},
            "squad": [
                { "player": "team3-p1", "jerseyNumber": 7, "isCaptain": true, "position": "forward" },
                { "player": "team3-p2", "jerseyNumber": 10, "isCaptain": false, "position": "midfielder" },
                { "player": "team3-p3", "jerseyNumber": 1, "isCaptain": false, "position": "goalkeeper" }
            ]
        },
        {
            "team": {_id: 'team6', name: "team6", shorthand: 'T6'},
            "squad": [
                { "player": "team6-p1", "jerseyNumber": 7, "isCaptain": true, "position": "forward" },
                { "player": "team6-p2", "jerseyNumber": 10, "isCaptain": false, "position": "midfielder" },
                { "player": "team6-p3", "jerseyNumber": 1, "isCaptain": false, "position": "goalkeeper" }
            ]
        }
    ],
    stats: {
      averageGoalsPerMatch: 0,
      averageAttendance: 0,
      cleanSheets: 0,
      topScorers: [],
      topAssists: [],
      bestDefenses: []
    },
    leagueTable: [],
    knockoutRounds: [],
    groupStage: [],
    awards: { player: [], team: [] },
    rules: {
      substitutions: { allowed: true, maximum: 3 },
      extraTime: true,
      penalties: true,
      matchDuration: { normal: 90, extraTime: 30 },
      squadSize: { min: 14, max: 22 }
    },
    extraRules: [],
    sponsors: [],
    isActive: false,
    isFeatured: false,
    admin: "admin-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "comp-hybrid-001",
    name: "University Football Cup",
    shorthand: "UFC",
    type: CompetitionTypes.HYBRID,
    logo: "https://example.com/logos/ufc.png",
    coverImage: "https://example.com/covers/ufc.jpg",
    description: "Hybrid competition with groups and knockouts.",
    status: CompetitionStatus.ONGOING,
    format: {
      groupStage: {
        numberOfGroups: 4,
        teamsPerGroup: 4,
        advancingPerGroup: 2
      },
      knockoutStage: {
        hasTwoLegs: false,
        awayGoalsRule: true
      }
    },
    season: "2024/2025",
    startDate: new Date("2024-09-10"),
    endDate: new Date("2025-01-20"),
    currentStage: "Group Stage",
    teams: [],
    stats: {
      averageGoalsPerMatch: 3.1,
      averageAttendance: 200,
      cleanSheets: 10,
      topScorers: [],
      topAssists: [],
      bestDefenses: []
    },
    leagueTable: [],
    knockoutRounds: [],
    groupStage: [],
    awards: { player: [], team: [] },
    rules: {
      substitutions: { allowed: true, maximum: 5 },
      extraTime: true,
      penalties: true,
      matchDuration: { normal: 90, extraTime: 30 },
      squadSize: { min: 16, max: 26 }
    },
    extraRules: [],
    sponsors: [],
    prizeMoney: { champion: 200000, runnerUp: 100000 },
    isActive: true,
    isFeatured: true,
    admin: "admin-user-id",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockLeagueTable: ILeagueStandings[] = [
  {
    "_id": "lt1",
    "team": { "_id": "team1", "name": "Engineering Eagles", "shorthand": "ENG" },
    "played": 6,
    "points": 18,
    "disciplinaryPoints": 0,
    "wins": 6,
    "losses": 0,
    "draws": 0,
    "goalsFor": 10,
    "goalsAgainst": 5,
    "goalDifference": 5,
    "form": [CompetitionTeamForm.WIN, CompetitionTeamForm.WIN, CompetitionTeamForm.WIN, CompetitionTeamForm.WIN, CompetitionTeamForm.WIN],
    "position": 1
  },
  {
    "_id": "lt2",
    "team": { "_id": "team2", "name": "Engineering", "shorthand": "ENG" },
    "played": 6,
    "points": 15,
    "disciplinaryPoints": 0,
    "wins": 5,
    "losses": 1,
    "draws": 0,
    "goalsFor": 10,
    "goalsAgainst": 5,
    "goalDifference": 5,
    "form": [CompetitionTeamForm.WIN, CompetitionTeamForm.WIN, CompetitionTeamForm.WIN, CompetitionTeamForm.WIN, CompetitionTeamForm.WIN],
    "position": 2
  },
  {
    "_id": "lt3",
    "team": { "_id": "team3", "name": "Engineering Eaglets", "shorthand": "ENG" },
    "played": 6,
    "points": 12,
    "disciplinaryPoints": 0,
    "wins": 4,
    "losses": 2,
    "draws": 0,
    "goalsFor": 10,
    "goalsAgainst": 5,
    "goalDifference": 5,
    "form": [CompetitionTeamForm.LOSS, CompetitionTeamForm.LOSS, CompetitionTeamForm.WIN, CompetitionTeamForm.WIN, CompetitionTeamForm.DRAW],
    "position": 3
  },
  {
    "_id": "lt4",
    "team": { "_id": "team4", "name": "Engineering Eaglets4", "shorthand": "ENG" },
    "played": 6,
    "points": 9,
    "disciplinaryPoints": 0,
    "wins": 3,
    "losses": 3,
    "draws": 0,
    "goalsFor": 10,
    "goalsAgainst": 5,
    "goalDifference": 5,
    "form": [CompetitionTeamForm.LOSS, CompetitionTeamForm.WIN, CompetitionTeamForm.WIN, CompetitionTeamForm.LOSS, CompetitionTeamForm.LOSS],
    "position": 4
  },
  {
    "_id": "lt5",
    "team": { "_id": "team5", "name": "Eaglets", "shorthand": "ENG" },
    "played": 6,
    "points": 5,
    "disciplinaryPoints": -1,
    "wins": 2,
    "losses": 4,
    "draws": 0,
    "goalsFor": 10,
    "goalsAgainst": 5,
    "goalDifference": 5,
    "form": [CompetitionTeamForm.WIN, CompetitionTeamForm.LOSS, CompetitionTeamForm.WIN, CompetitionTeamForm.LOSS, CompetitionTeamForm.LOSS],
    "position": 5
  },
  {
    "_id": "lt6",
    "team": { "_id": "team6", "name": "Business Bulls", "shorthand": "BUS" },
    "played": 6,
    "points": 3,
    "disciplinaryPoints": 5,
    "wins": 1,
    "losses": 5,
    "draws": 0,
    "goalsFor": 15,
    "goalsAgainst": 10,
    "goalDifference": -5,
    "form": [CompetitionTeamForm.WIN,CompetitionTeamForm.LOSS,CompetitionTeamForm.LOSS,CompetitionTeamForm.LOSS,CompetitionTeamForm.LOSS],
    "position": 6
  }
]

const mockKnockoutRounds: IPopKnockoutRounds[] = [
  {
    _id: "k1",
    name: "Quarter Finals",
    fixtures: [
        {
            _id: "f1",
            homeTeam: {
                _id: "team1",
                name: "Engineering Eagles",
                shorthand: "ENG",
                logo: "https://example.com/logos/eng.png"
            },
            awayTeam: {
                _id: "team2",
                name: "Law Lions",
                shorthand: "LAW",
                logo: "https://example.com/logos/law.png"
            },
            stadium: "Main Stadium",
            scheduledDate: new Date("2024-10-20T16:00:00"),
            status: FixtureStatus.COMPLETED,
            result: {
                homeScore: 2,
                awayScore: 1,
                halftimeHomeScore: 1,
                halftimeAwayScore: 1,
                homePenalty: null,
                awayPenalty: null,
                winner: "home"
            },
            rescheduledDate: null,
            postponedReason: null
        },
        {
            "_id": "kf4",
            "homeTeam": { "_id": "team1", "name": "Engineering Eagles", "shorthand": "ENG" },
            "awayTeam": { "_id": "team2", "name": "Law Lions", "shorthand": "LAW" },
            "stadium": "Main Arena",
            "scheduledDate": new Date("2024-11-10T16:00:00.000Z"),
            "status": FixtureStatus.SCHEDULED,
            "result": null,
            "rescheduledDate": null,
            "postponedReason": null
        },
        {
            "_id": "kf2",
            "homeTeam": { "_id": "team2", "name": "Law Lions", "shorthand": "LAW" },
            "awayTeam": { "_id": "team3", "name": "Medical Mavericks", "shorthand": "MED" },
            "stadium": "Main Arena",
            "scheduledDate": new Date("2024-11-11T16:00:00.000Z"),
            "status": FixtureStatus.SCHEDULED,
            "result": null,
            "rescheduledDate": null,
            "postponedReason": null
        },
        {
            "_id": "kf3",
            "homeTeam": { "_id": "team3", "name": "Medical Mavericks", "shorthand": "MED" },
            "awayTeam": { "_id": "team4", "name": "Science Sharks", "shorthand": "SCI" },
            "stadium": "Main Arena",
            "scheduledDate": new Date("2024-11-12T16:00:00.000Z"),
            "status": FixtureStatus.SCHEDULED,
            "result": null,
            "rescheduledDate": null,
            "postponedReason": null
        }
    ],
    completed: false
  },
  {
    _id: "k2",
    name: "Semi Finals",
    fixtures: [],
    completed: false
  }
];

const mockGroupStages: IGroupTable[] = [
    {
        _id: "g1",
        name: "Group A",
        standings: mockLeagueTable,
        fixtures: [],
        qualificationRules: [
            {
                position: 1,
                destination: "knockout",
                knockoutRound: "k2",
                isBestLoserCandidate: false
            },
            {
                position: 2,
                destination: "knockout",
                knockoutRound: "k2",
                isBestLoserCandidate: false
            },
            {
                position: 3,
                destination: "playoffs",
                knockoutRound: "k2",
                isBestLoserCandidate: false
            },
            {
                position: 4,
                destination: "eliminated",
                knockoutRound: "k2",
                isBestLoserCandidate: false
            },
            {
                position: 5,
                destination: "eliminated",
                knockoutRound: "k2",
                isBestLoserCandidate: false
            }
        ],
        qualifiedTeams: [
            {
                team: "team1",
                originalPosition: 1,
                qualifiedAs: "winner",
                destination: "k2"
            },
            {
                team: "team2",
                originalPosition: 2,
                qualifiedAs: "runner-up",
                destination: "k2"
            },
        ]
    },
    {
        "_id": "group2",
        "name": "Group B",
        "standings": [ /* Next 3 teams from league table */ ],
        "fixtures": ["gf3", "gf4"],
        "qualificationRules": [
            {
                position: 1,
                destination: "knockout",
                knockoutRound: "k2",
                isBestLoserCandidate: false
            },
            {
                position: 2,
                destination: "knockout",
                knockoutRound: "k2",
                isBestLoserCandidate: false
            }
        ],
        "qualifiedTeams": [
            { "team": "team4", "originalPosition": 1, "qualifiedAs": "winner", "destination": "k2" },
            { "team": "team5", "originalPosition": 2, "qualifiedAs": "runner-up", "destination": "k2" }
        ]
    }
];





const SingleCompetitionPage = () => {
    // States //
    const [loading, setLoading] = useState<boolean>(true);
    const [competition, setCompetition] = useState<IV2FootballCompetition | null>(null);
    const [leagueTable, setLeagueTable] = useState<ILeagueStandings[]>([]);
    const [knockoutRounds, setKnockoutRounds] = useState<IPopKnockoutRounds[]>([]);
    const [groupStages, setGroupStages] = useState<IGroupTable[]>([]);
    const [activeTab, setActiveTab] = useState<LeagueTabs | KnockoutTabs | HybridTabs >(LeagueTabs.INFO);
    // End of States //

    // On Load //
    useEffect( () => {
        const fetchData = async () => {
            // const competitionData = await getTeamById( resolvedParams.id );

            // if( competitionData && competitionData.data ) {
            //     setCompetition( competitionData.data );
            // }
            const rand = Math.floor(Math.random()*3)
            // setCompetition(mockCompetitions[rand]);
            setCompetition(mockCompetitions[rand]);
            if(mockCompetitions[rand].type === CompetitionTypes.LEAGUE) {
                setLeagueTable(mockLeagueTable);
                setActiveTab(LeagueTabs.TABLES);
            }
            if(mockCompetitions[rand].type === CompetitionTypes.KNOCKOUT) {
                setKnockoutRounds(mockKnockoutRounds);
                setActiveTab(KnockoutTabs.KNOCKOUT);
            }
            if(mockCompetitions[rand].type === CompetitionTypes.HYBRID) {
                setGroupStages(mockGroupStages);
                setKnockoutRounds(mockKnockoutRounds);
                setActiveTab(HybridTabs.GROUPS);
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
          <div className="flex items-center gap-1 overflow-x-auto">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {groupStages.length > 0 && groupStages.map(group => (
                <div key={group._id} className="bg-background border-l-4 border-l-emerald-500">
                  <div className="p-6">
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