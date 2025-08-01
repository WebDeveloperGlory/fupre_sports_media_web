'use client'

import { Loader } from '@/components/ui/loader';
import { IGroupTable, IKnockoutRounds, ILeagueStandings, IPopKnockoutRounds, IV2FootballCompetition } from '@/utils/V2Utils/v2requestData.types';
import { Award, Calendar, Crown, Info, Shield, Star, Target, Trophy, Users } from 'lucide-react';
import React, { use, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import LeagueTable from '@/components/competition/LeagueTable';
import { CompetitionStatus, CompetitionTeamForm, CompetitionTypes, FixtureStatus } from '@/utils/V2Utils/v2requestData.enums';
import { FixtureResult } from '@/utils/V2Utils/v2requestSubData.types';
import Link from 'next/link';
import Image from 'next/image';
import { teamLogos } from '@/constants';

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

type QualificationRules = {
    position: number,
    destination: 'knockout' | 'playoffs' | 'eliminated',
    knockoutRound: string,
    isBestLoserCandidate: boolean
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

export const mockKnockoutRounds: IPopKnockoutRounds[] = [
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
export const mockGroupStages: IGroupTable[] = [
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



const SingleCompetitionPage = (
    { params }:
    { params: Promise<{ id: string }> }
) => {
    const resolvedParams = use( params );

    // States //
    const [loading, setLoading] = useState<boolean>(true);
    const [competition, setCompetition] = useState<IV2FootballCompetition | null>(null);
    const [leagueTable, setLeagueTable] = useState<ILeagueStandings[]>([]);
    const [knockoutRounds, setKnockoutRounds] = useState<IPopKnockoutRounds[]>([]);
    const [groupStages, setGroupStages] = useState<IGroupTable[]>([]);
    const [statistics, setStatistics] = useState(null);
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

    // Helper Functions //
    const checkFixtureWinner = (result: FixtureResult) => {
        if(result.winner) return result.winner;
        if(result.homeScore === result.awayScore) {
            if(result.homePenalty && result.awayPenalty) {
                if(result.homePenalty > result.awayPenalty) return "home";
                if(result.awayPenalty > result.homePenalty) return "away";
            }
            return "draw";
        }
        if(result.homeScore > result.awayScore) return "home";
        if(result.awayScore > result.homeScore) return "away";
        return "draw";
    }
    const checkTableFate = (pos: number, qualificationRules: QualificationRules[]) => {
        let textColor = 'border-l-gray-500';
        
        if(competition) {
            qualificationRules.forEach(rule => {
                if(pos === rule.position) {
                    if(rule.destination === 'knockout') return textColor = 'border-l-emerald-500';
                    if(rule.destination === 'playoffs') return textColor = 'border-l-orange-500';
                    if(rule.destination === 'eliminated') return textColor = 'border-l-red-500';
                } else {
                    return;
                }
            });
        }
        
        return textColor;
    }
    // End of Helper Functions //
  return (
    <div className='space-y-4'>
        {/* Header */}
        <div className='flex gap-4 items-center'>
            <div className='w-36 h-24 rounded-lg bg-primary-foreground hidden md:block'></div>
            <div className='space-y-1'>
                <div className='flex items-center gap-4 text-emerald-500'>
                    <h1 className='font-bold text-2xl'>{competition?.name || 'Unknown'}</h1>
                    <span className='px-2 py-1 text-sm rounded-full capitalize border bg-primary-foreground'>{competition?.type || 'Unknown'}</span>
                </div>
                <p className='text-lg'>{competition?.description || 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam quae, blanditiis iusto doloribus eum temporibus quod quo est ut beatae officiis nemo sed, reprehenderit tenetur iure tempore harum atque corrupti.'}</p>
                <div className='flex gap-4 items-center text-sm'>
                    <span className='flex gap-2 items-center text-muted-foreground'>
                        <Calendar className='w-5 h-5' />
                        {competition?.season || '2098/2099'}
                    </span>
                    <span className='flex gap-2 items-center text-muted-foreground'>
                        <Users className='w-5 h-5' />
                        {competition?.teams.length || 0} teams
                    </span>
                </div>
            </div>
        </div>

        {/* Mini Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-primary-foreground border py-4 text-center rounded-lg'>
                <p className='text-lg text-emerald-500 font-bold'>{String(Math.ceil(Number(competition!.stats.averageGoalsPerMatch) * 12))}</p>
                <span className='text-muted-foreground'>Total Goals</span>
            </div>
            <div className='bg-primary-foreground border py-4 text-center rounded-lg'>
                <p className='text-lg text-blue-500 font-bold'>{String(competition?.stats.averageGoalsPerMatch || 0)}</p>
                <span className='text-muted-foreground'>Goals Per Match</span>
            </div>
            <div className='bg-primary-foreground border py-4 text-center rounded-lg'>
                <p className='text-lg text-orange-500 font-bold'>{String(competition?.stats.averageAttendance || 0)}</p>
                <span className='text-muted-foreground'>Average Attendance</span>
            </div>
            <div className='bg-primary-foreground border py-4 text-center rounded-lg'>
                <p className='text-lg text-purple-500 font-bold'>{12}</p>
                <span className='text-muted-foreground'>Remaining Fixtures</span>
            </div>
        </div>

        {/* Accordition Tabs */}
        <div 
            className={`
                w-full overflow-x-scroll scrollbar-hide border rounded-lg flex items-center gap-2 bg-primary-foreground text-center ${
                    competition?.type === CompetitionTypes.LEAGUE
                        ? 'md:grid md:grid-cols-6'
                        : competition?.type === CompetitionTypes.KNOCKOUT
                            ? 'md:grid md:grid-cols-5'
                            : 'md:grid md:grid-cols-7'
                }
            `}
        >
            {
                competition && Object.values(
                    competition.type === CompetitionTypes.LEAGUE
                        ? LeagueTabs
                        : competition.type === CompetitionTypes.KNOCKOUT
                            ? KnockoutTabs
                            : HybridTabs
                ).map( tab => (
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
                        <p>{ tab }</p>
                    </div>
                ))
            }
        </div>

        {/* League Table */}
        {
            activeTab === LeagueTabs.TABLES && competition?.type === CompetitionTypes.LEAGUE && (
                <div className="bg-card rounded-xl border border-border overflow-hidden scrollbar-hide">
                    <AnimatePresence>
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 md:p-6 border-t border-border overflow-x-auto">
                                <LeagueTable table={ leagueTable } />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )
        }

        {/* Knockout Bracket */}
        {
            (activeTab === KnockoutTabs.KNOCKOUT || activeTab === HybridTabs.KNOCKOUT) && (
                <div className='space-y-4 bg-primary-foreground border rounded-lg px-4 py-4'>
                    {/* Titles */}
                    {
                        competition && competition.type === CompetitionTypes.KNOCKOUT && (
                            <h2 className='flex gap-2 items-center text-emerald-500 font-bold text-lg'>
                                <Trophy className='w-5 h-5' />
                                Tournament Bracket
                            </h2>
                        )
                    }
                    {
                        competition && competition.type === CompetitionTypes.HYBRID && (
                            <h2 className='flex gap-2 items-center text-emerald-500 font-bold text-lg'>
                                <Crown className='w-5 h-5' />
                                Knockout Stage Bracket
                            </h2>
                        )
                    }

                    {/* No Knockout Rounds */}
                    {
                        competition && competition.type === CompetitionTypes.KNOCKOUT && knockoutRounds.length === 0 && (
                            <div className='flex flex-col justify-center items-center gap-4 py-8'>
                                <Trophy className='w-16 h-16' />
                                <div className='text-center'>
                                    <p className='text-lg'>Knockout Stage Not Started</p>
                                    <span className='text-muted-foreground'>The knockout stage will begin shortly</span>
                                </div>
                            </div>
                        )
                    }
                    {
                        competition && competition.type === CompetitionTypes.HYBRID && knockoutRounds.length === 0 && (
                            <div className='flex flex-col justify-center items-center gap-4 py-8'>
                                <Trophy className='w-16 h-16' />
                                <div className='text-center'>
                                    <p className='text-lg'>Knockout Stage Not Started</p>
                                    <span className='text-muted-foreground'>The knockout stage will begin after the group stage is completed</span>
                                </div>
                                <div className='py-4 px-8 bg-secondary border rounded-lg'>
                                    <p className='font-bold text-center'>Qualified Teams So Far</p>
                                    <div className='text-sm text-left mt-4'>
                                        {
                                            groupStages.map(group => {
                                                const hasQualifiedTeams = group.qualifiedTeams.length > 0;
                                                const endProduct = hasQualifiedTeams ? group.qualifiedTeams.map( team => (
                                                    <p
                                                        key={`${group._id} + ${team.team}`}
                                                    >{team.team} ({group.name})</p>
                                                )) : null;

                                                return endProduct;
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* Knockout Rounds */}
                    {
                        competition && ( competition.type === CompetitionTypes.KNOCKOUT || competition.type === CompetitionTypes.HYBRID ) && knockoutRounds.length > 0 && (
                            <div className='space-y-4'>
                                {
                                    knockoutRounds.map(round => (
                                        <div
                                            key={round._id} 
                                            className='space-y-2'
                                        >
                                            <p className='font-bold text-center'>{round.name}</p>
                                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                                                {
                                                    round.fixtures.map(fixture => (
                                                        <div
                                                            key={fixture._id}
                                                            className='p-3 py-4 bg-secondary border rounded-lg space-y-4'
                                                        >
                                                            <span className='border rounded-full px-2 py-1 border-muted-foreground text-xs'>{fixture.status}</span>
                                                            <div className='space-y-2'>
                                                                <div className={`
                                                                    rounded-md p-2 border flex items-center justify-between font-bold gap-2 ${
                                                                        fixture.status === FixtureStatus.COMPLETED
                                                                            ? checkFixtureWinner(fixture.result!) === "home" 
                                                                                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'  
                                                                                : 'border-muted-foreground'
                                                                            : 'border-muted-foreground'
                                                                    }
                                                                `}>
                                                                    <p className='basis-11/12 text-left'>{fixture.homeTeam.name}</p>
                                                                    { fixture.result && <p className='basis-1/12 text-right'>{fixture.result.homeScore}</p> }
                                                                </div>
                                                                <div className={`
                                                                    rounded-md p-2 border flex items-center justify-between font-bold gap-2 ${
                                                                        fixture.status === FixtureStatus.COMPLETED
                                                                            ? checkFixtureWinner(fixture.result!) === "away"
                                                                                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' 
                                                                                : 'border-muted-foreground'
                                                                            : 'border-muted-foreground'
                                                                    }
                                                                `}>
                                                                    <p className='basis-11/12 text-left'>{fixture.awayTeam.name}</p>
                                                                    { fixture.result && <p className='basis-1/12 text-right'>{fixture.result.awayScore}</p> }
                                                                </div>
                                                            </div>
                                                            <div className='text-center font-bold text-sm'>
                                                                <Link className='text-emerald-500 hover:underline hover:underline-offset-4' href={`/sports/football/fixtures/${fixture._id}`}>
                                                                    View Details
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            )
        }

        {/* Group Tables */}
        {
            competition && competition.type === CompetitionTypes.HYBRID && activeTab === HybridTabs.GROUPS && (
                <div className='grid grid-cols-1 gap-4'>
                    {
                        groupStages.length > 0 && groupStages.map(group => (
                            <div
                                key={group._id}
                                className='p-4 rounded-lg bg-primary-foreground border md:p-6 overflow-x-auto'
                            >
                                {/* Title */}
                                <h2 className='text-emerald-500 flex gap-2 items-center text-lg font-bold'>
                                    <Trophy className='w-5 h-5' />
                                    {group.name}
                                </h2>

                                {/* Table */}
                                <div className='my-4'>
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
                                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">DP</th>
                                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Pts</th>
                                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Form</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                group.standings.map(( entry, index ) => (
                                                    <tr 
                                                        key={ entry.team._id } 
                                                        className="border-b border-border hover:bg-accent/50 transition-colors"
                                                    >
                                                        <td className={`py-4 px-3 text-sm border-l-4 ${checkTableFate(index+1, group.qualificationRules)}`}>{ index + 1 }</td>
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
                                                        <td className={`text-center py-4 px-3 text-sm ${entry.goalDifference > 0 ? 'text-emerald-500' : 'text-red-500'}`}>{ entry.goalDifference }</td>
                                                        <td className="text-center py-4 px-3 text-sm">{ entry.disciplinaryPoints || 0 }</td>
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

                                {/* Keys */}
                                <div className='flex gap-4 items-center'>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-5 h-5 rounded-md bg-emerald-500'></span>
                                        <span className='text-muted-foreground text-sm'>Qualified</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-5 h-5 rounded-md bg-orange-500'></span>
                                        <span className='text-muted-foreground text-sm'>Playoffs</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-5 h-5 rounded-md bg-red-500'></span>
                                        <span className='text-muted-foreground text-sm'>Eliminated</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-5 h-5 rounded-md bg-gray-500'></span>
                                        <span className='text-muted-foreground text-sm'>Pending</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )
        }

        {/* Statistics */}
        {
            (activeTab === LeagueTabs.STATISTICS || activeTab === KnockoutTabs.STATISTICS || activeTab === HybridTabs.STATISTICS) && (
                <div className='space-y-4'>
                    {/* Basic Stats */}
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                        <div className='py-6 border bg-primary-foreground rounded-lg text-center'>
                            <p className='text-emerald-500 font-bold text-xl'>{competition?.stats.averageGoalsPerMatch.toFixed(2) || '0'}</p>
                            <span className='text-muted-foreground'>Goals Per Game</span>
                        </div>
                        <div className='py-6 border bg-primary-foreground rounded-lg text-center'>
                            <p className='text-blue-500 font-bold text-xl'>{competition?.stats.averageAttendance.toFixed(2) || '0'}</p>
                            <span className='text-muted-foreground'>Average Attendance</span>
                        </div>
                        <div className='py-6 border bg-primary-foreground rounded-lg text-center'>
                            <p className='text-orange-500 font-bold text-xl'>{competition?.stats.cleanSheets || '0'}</p>
                            <span className='text-muted-foreground'>Clean Sheets</span>
                        </div>
                    </div>

                    {/* Goal And Assist Leaders */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Top Scorers */}
                        <div className='p-4 border bg-primary-foreground rounded-lg'>
                            {/* Title */}
                            <h2 className='text-lg font-bold flex items-center gap-2 mb-4'>
                                <Target className='w-5 h-5' />
                                Top Scorers
                            </h2>

                            {/* Cards */}
                            <div className='space-y-2'>
                                {
                                    (
                                        <div className='p-2 border bg-secondary flex justify-between items-center rounded-md'>
                                            <div className='flex items-center gap-2'>
                                                <div className='font-bold flex items-center justify-center rounded-full bg-emerald-500 w-8 h-8'>{1}</div>
                                                <div className=''>
                                                    <p>{'Test Name'}</p>
                                                    <span className='text-muted-foreground text-sm'>{'Matadors FC'}</span>
                                                </div>
                                            </div>
                                            <p className='text-emerald-500 text-lg font-bold'>{10}</p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        
                        {/* Top Assists */}
                        <div className='p-4 border bg-primary-foreground rounded-lg'>
                            {/* Title */}
                            <h2 className='text-lg font-bold flex items-center gap-2 mb-4'>
                                <Star className='w-5 h-5' />
                                Top Assists
                            </h2>

                            {/* Cards */}
                            <div className='space-y-2'>
                                {
                                    (
                                        <div className='p-2 border bg-secondary flex justify-between items-center rounded-md'>
                                            <div className='flex items-center gap-2'>
                                                <div className='font-bold flex items-center justify-center rounded-full bg-blue-500 w-8 h-8'>{1}</div>
                                                <div className=''>
                                                    <p>{'Test Name'}</p>
                                                    <span className='text-muted-foreground text-sm'>{'Matadors FC'}</span>
                                                </div>
                                            </div>
                                            <p className='text-blue-500 text-lg font-bold'>{10}</p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    {/* Best Defense */}
                    <div className='p-4 border bg-primary-foreground rounded-lg'>
                        {/* Title */}
                        <h2 className='text-lg font-bold flex items-center gap-2 mb-4'>
                            <Shield className='w-5 h-5' />
                            Best Defenses
                        </h2>

                        {/* Cards */}
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {
                                (
                                    <div className='bg-secondary rounded-lg py-4 border flex items-center justify-center flex-col gap-4 text-center'>
                                        <span className='text-lg font-bold'>{1}</span>
                                        <div className='space-y-1'>
                                            <p className='font-bold'>{'Matadors FC'}</p>
                                            <span className='text-sm text-muted-foreground'>{5} clean sheets</span>
                                            <p className='text-lg font-bold text-orange-500'>{1} goal conceeded</p>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            )
        }

        {/* Statistics */}
        {
            (activeTab === LeagueTabs.TEAMS || activeTab === KnockoutTabs.TEAMS || activeTab === HybridTabs.TEAMS) && (
                <div className='p-4 bg-primary-foreground rounded-lg border'>
                    {/* Title */}
                    <h2 className='text-lg font-bold flex items-center gap-2 mb-4'>
                        <Users className='w-5 h-5' />
                        Participating Teams
                    </h2>

                    {/* Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {
                            competition && competition.teams.length > 0 && competition.teams.map(team => (
                                <div className='p-4 border bg-secondary rounded-md hover:bg-accent/50 transition-colors'>
                                    <Link
                                        key={ team.team._id }
                                        href={`/sports/football/teams/${ team.team._id}`}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="relative w-10 h-10">
                                            <Image
                                                src={ teamLogos[ team.team.name ] || '/images/team_logos/default.jpg' }
                                                alt={ team.team.name }
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{team.team.name}</h3>
                                            <p>{team.team.shorthand || ''}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        }
                        {
                            competition && competition.teams.length === 0 && (
                                <div className='md:col-span-2 lg:col-span-3 flex justify-center items-center gap-4 flex-col'>
                                    <Users className='w-12 h-12' />
                                    <div className='text-center'>
                                        <p>No Registered Teams Yet</p>
                                        <span className='text-sm text-muted-foreground'>Come back later to see all registered teams</span>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            )
        }
            
        {/* AWARDS */}
        {
            (activeTab === LeagueTabs.AWARDS || activeTab === KnockoutTabs.AWARDS || activeTab === HybridTabs.AWARDS) && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Player Awards */}
                    <div className='p-4 bg-primary-foreground rounded-lg border space-y-4'>
                        {/* Title */}
                        <h2 className='text-lg font-bold flex items-center gap-2'>
                            <Award className='w-5 h-5' />
                            Player Awards
                        </h2>
                    </div>
                    
                    {/* Team Awards */}
                    <div className='p-4 bg-primary-foreground rounded-lg border space-y-4'>
                        {/* Title */}
                        <h2 className='text-lg font-bold flex items-center gap-2'>
                            <Trophy className='w-5 h-5' />
                            Team Awards
                        </h2>
                    </div>
                </div>
            )
        }
            
        {/* Info */}
        {
            (activeTab === LeagueTabs.INFO || activeTab === KnockoutTabs.INFO || activeTab === HybridTabs.INFO) && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Rules */}
                    <div className='p-4 bg-primary-foreground rounded-lg border space-y-4'>
                        {/* Title */}
                        <h2 className='text-lg font-bold flex items-center gap-2'>
                            <Info className='w-5 h-5' />
                            Competition Rules
                        </h2>

                        {/* Match Related Info */}
                        <div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className='text-sm text-muted-foreground'>Match Duration:</span>
                                    <p>{competition?.rules.matchDuration.normal || 80} mins</p>
                                </div>
                                <div>
                                    <span className='text-sm text-muted-foreground'>Substitutions:</span>
                                    <p>{competition?.rules.substitutions.maximum || 5} allowed</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className='text-sm text-muted-foreground'>Sqaud Size:</span>
                                    <p>{competition?.rules.squadSize.min || 15} - {competition?.rules.squadSize.max || 20} players</p>
                                </div>
                                <div>
                                    <span className='text-sm text-muted-foreground'>Extra Time:</span>
                                    <p>{competition?.rules.extraTime ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Points System */}
                        <div>
                            <h2 className='font-bold mb-2'>Points System</h2>
                            <div>
                                <p>Win: 3 points</p>
                                <p>Draw: 1 point</p>
                                <p>Loss: 0 points</p>
                            </div>
                        </div>
                    </div>

                    {/* Sponsors */}
                    <div className='p-4 bg-primary-foreground rounded-lg border space-y-4'>
                        {/* Title */}
                        <h2 className='text-lg font-bold flex items-center gap-2'>
                            <Info className='w-5 h-5' />
                            Sponsors & Prizes
                        </h2>

                        {/* Official Sponsors */}
                        <div>
                            <p className='font-bold'>Official Sponsors</p>
                            <div className='space-y-2'>
                                {
                                    competition && competition.sponsors.map(sponsor => (
                                        <div
                                            key={sponsor.name}
                                            className='p-2 border bg-secondary flex justify-between items-center rounded-md'
                                        >
                                            <div className='flex gap-2 items-center'>
                                                <div className='w-5 h-5 rounded-md bg-card'></div>
                                                <p>{sponsor.name}</p>
                                            </div>
                                            <span className='px-2 py-1 text-xs'>{sponsor.tier}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        
                        {/* Prize Money */}
                        <div>
                            <p className='font-bold'>Prize Money</p>
                            <div>
                                <div className='flex items-center justify-between'>
                                    <p>Champions:</p>
                                    <span className='text-yellow-500'>#{competition?.prizeMoney?.champion || 'unknown'}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <p>Runner-up:</p>
                                    <span className=''>#{competition?.prizeMoney?.runnerUp || 'unknown'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default SingleCompetitionPage