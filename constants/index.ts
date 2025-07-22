import { Statistics } from "@/utils/requestDataTypes";
import { EventTypes } from "@/utils/stateTypes";
import { CompetitionType, FixtureTimelineType, TeamType } from "@/utils/V2Utils/v2requestData.enums";
import { IV2FootballLiveFixture } from "@/utils/V2Utils/v2requestData.types";
import { FixturePlayerOfTheMatch } from "@/utils/V2Utils/v2requestSubData.types";

type VoteMapPlayers = {
    name: string;
    department: string;
    admissionYear: string;
    _id: string;
    totalVotes: number;
}
export function countPOTMVotes(userVotes: FixturePlayerOfTheMatch['userVotes']) {
    // Handle empty or invalid input
    if (!userVotes || !Array.isArray(userVotes) || userVotes.length === 0) {
        return {
            totalVotes: 0,
            players: []
        };
    }

    // Create a map to count votes per player
    const voteMap = new Map();

    // Process each vote
    userVotes.forEach(vote => {
        const playerId = vote.playerId._id;
        
        if (voteMap.has(playerId)) {
            // Player already exists, increment vote count
            voteMap.get(playerId).totalVotes += 1;
        } else {
            // New player, add to map
            voteMap.set(playerId, {
                name: vote.playerId.name,
                department: vote.playerId.department,
                admissionYear: vote.playerId.admissionYear,
                _id: vote.playerId._id,
                totalVotes: 1
            });
        }
    });

    // Convert map to array and sort by vote count (highest first)
    const players: VoteMapPlayers[] = Array.from(voteMap.values()).sort((a, b) => b.totalVotes - a.totalVotes);

    return {
        totalVotes: userVotes.length,
        players: players
    };
}

export const getCurrentDate = (): string => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String( today.getMonth() + 1 ).padStart( 2, '0' );
	const day = String( today.getDate() ).padStart( 2, '0' );

	return `${ year }-${ month }-${ day }`;
}

export const EVENT_TYPES: EventTypes = {
    goal: 'goal',
    assist: 'assist',
    yellowCards: 'yellowCard',
    redCards: 'redCard',
    substitution: 'substitution',
    shotsOnTarget: 'shotOnTarget',
    shotsOffTarget: 'shotOffTarget',
    corners: 'corner',
    offsides: 'offside',
    fouls: 'foul',
    kickoff: 'kickoff',
    halftime: 'halftime',
    fulltime: 'fulltime'
};

export const emptyStats: Statistics = {
    shotsOnTarget: 0,
    shotsOffTarget: 0,
    fouls: 0,
    yellowCards: 0,
    redCards: 0,
    offsides: 0,
    corners: 0,
    possessionTime: 0,
}

export const liveFixtureInitialStateData = {
	homeTeam: {
        name: 'Propellers',
        _id: '12'
    },
    awayTeam: {
        name: 'Rayos FC',
        _id: '23'
    },
    homeLineup: {
        formation: '',
        startingXI: [
            { name: 'B Lionz', position: 'GK', _id: '111' },
            { name: 'Clipha', position: 'GK', _id: '222' },
            { name: 'Emmanuel', position: 'GK', _id: '333' },
            { name: 'Gamer X', position: 'GK', _id: '444' },
            { name: 'Godsent', position: 'GK', _id: '555' },
            { name: 'Golden Jet', position: 'GK', _id: '66' },
            { name: 'Isaac', position: 'GK', _id: '777' },
            { name: 'Jeffrey', position: 'GK', _id: '888' },
            { name: 'Joseph', position: 'GK', _id: '999' },
            { name: 'Noble', position: 'GK', _id: '989' },
            { name: 'Pius', position: 'GK', _id: '878' },
            { name: 'Sammy', position: 'GK', _id: '767' },
            { name: 'TAO', position: 'GK', _id: '656' },
            { name: 'Uche', position: 'GK', _id: '545' },
            { name: 'Verified', position: 'GK', _id: '434' },
        ],
        subs: []
    },
    awayLineup: {
        formation: '',
        startingXI: [],
        subs: []
    },
    competition: {
        name: 'Fupre Super League',
        _id: '123',
        type: 'knockout'
    },
	home: {
        shotsOnTarget: 0,
        shotsOffTarget: 0,
        fouls: 0,
        yellowCards: 0,
        redCards: 0,
        offsides: 0,
        corners: 0,
        possessionTime: 0,
    },
    away: {
        shotsOnTarget: 0,
        shotsOffTarget: 0,
        fouls: 0,
        yellowCards: 0,
        redCards: 0,
        offsides: 0,
        corners: 0,
        possessionTime: 0,
    },
	homeScore: 0,
    awayScore: 0,
    homePenalty: null,
    awayPenalty: null
}

export const teamLogos: Record<string, string> = {
    'Red Bull FC': '/images/team_logos/red_bull_fc.jpg',
    'Citizens': '/images/team_logos/citizens.jpg',
    'Kalakuta FC': '/images/team_logos/kalakuta_fc.jpg',
    'Propellers': '/images/team_logos/propellers.jpg',
    'Rayos FC': '/images/team_logos/rayos_fc.jpg',
    'New Horizon': '/images/team_logos/new_horizon.jpg',
    'Seventeen FC': '/images/team_logos/seventeen_fc.jpg',
    'Twale FC': '/images/team_logos/twale_fc.jpg',
    'Matadors FC': '/images/team_logos/matadors_fc.jpg',
    'Electrical 500lvl (2019/2020)': '/images/team_logos/electrical.jpeg',
    'Electrical 400lvl (2020/2021)': '/images/team_logos/electrical.jpeg',
    'Electrical 300lvl (2021/2022)': '/images/team_logos/electrical.jpeg',
    'Electrical 200lvl (2023/2024)': '/images/team_logos/electrical.jpeg',
    'Electrical 100lvl (2024/2025)': '/images/team_logos/electrical.jpeg',
    'Mechanical 300lvl (2021/2022)': '/images/team_logos/mechanical.jpg',
}

export const mockInterLevelCompetition = {
    _id: 'inter-level-2025',
    name: 'Inter Level',
    type: 'knockout',
    status: 'ongoing',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-02-28'),
    description: 'Inter Level Knockout Competition 2025',
    teams: [
        {
            team: {
                _id: 'team1',
                name: 'Matadors FC',
                shorthand: 'MAT',
            },
            _id: 'team1-entry',
            squadList: []
        },
        {
            team: {
                _id: 'team2',
                name: 'Twale FC',
                shorthand: 'TWL',
            },
            _id: 'team2-entry',
            squadList: []
        },
        {
            team: {
                _id: 'team3',
                name: 'Citizens',
                shorthand: 'CIT',
            },
            _id: 'team3-entry',
            squadList: []
        },
        {
            team: {
                _id: 'team4',
                name: 'Seventeen FC',
                shorthand: 'SVT',
            },
            _id: 'team4-entry',
            squadList: []
        }
    ],
    knockoutRounds: [
        {
            name: 'Semi Finals',
            _id: 'semi-finals',
            fixtures: [
                {
                    _id: 'sf1',
                    homeTeam: {
                        _id: 'team1',
                        name: 'Matadors FC',
                        shorthand: 'MAT',
                    },
                    awayTeam: {
                        _id: 'team2',
                        name: 'Twale FC',
                        shorthand: 'TWL',
                    },
                    date: new Date('2025-02-20T15:00:00'),
                    status: 'completed',
                    result: {
                        homeScore: 3,
                        awayScore: 1,
                        homePenalty: null,
                        awayPenalty: null
                    }
                },
                {
                    _id: 'sf2',
                    homeTeam: {
                        _id: 'team3',
                        name: 'Citizens',
                        shorthand: 'CIT',
                    },
                    awayTeam: {
                        _id: 'team4',
                        name: 'Seventeen FC',
                        shorthand: 'SVT',
                    },
                    date: new Date('2025-02-20T17:00:00'),
                    status: 'completed',
                    result: {
                        homeScore: 4,
                        awayScore: 2,
                        homePenalty: null,
                        awayPenalty: null
                    }
                }
            ]
        },
        {
            name: 'Final',
            _id: 'final',
            fixtures: [
                {
                    _id: 'f1',
                    homeTeam: {
                        _id: 'team1',
                        name: 'Matadors FC',
                        shorthand: 'MAT',
                    },
                    awayTeam: {
                        _id: 'team3',
                        name: 'Citizens',
                        shorthand: 'CIT',
                    },
                    date: new Date('2025-02-25T16:00:00'),
                    status: 'upcoming',
                    result: {
                        homeScore: null,
                        awayScore: null,
                        homePenalty: null,
                        awayPenalty: null
                    }
                }
            ]
        }
    ],
    overview: {
        leagueFacts: {
            teamList: [
                {
                    _id: 'team1',
                    name: 'Matadors FC',
                    shorthand: 'MAT',
                },
                {
                    _id: 'team2',
                    name: 'Twale FC',
                    shorthand: 'TWL',
                },
                {
                    _id: 'team3',
                    name: 'Citizens',
                    shorthand: 'CIT',
                },
                {
                    _id: 'team4',
                    name: 'Seventeen FC',
                    shorthand: 'SVT',
                }
            ]
        },
        topScorers: [
            {
                player: {
                    _id: 'player1',
                    name: 'John Doe',
                    position: 'FW'
                },
                team: 'Matadors FC',
                goals: 2,
                appearances: 1
            },
            {
                player: {
                    _id: 'player2',
                    name: 'Jane Smith',
                    position: 'FW'
                },
                team: 'Citizens',
                goals: 2,
                appearances: 1
            }
        ],
        topAssists: [
            {
                player: {
                    _id: 'player3',
                    name: 'Mike Johnson',
                    position: 'MF'
                },
                team: 'Matadors FC',
                assists: 1,
                appearances: 1
            },
            {
                player: {
                    _id: 'player4',
                    name: 'Sarah Wilson',
                    position: 'MF'
                },
                team: 'Citizens',
                assists: 1,
                appearances: 1
            }
        ]
    }
};

// Sample live football match data object
export const liveMatchSample: IV2FootballLiveFixture = {
    _id: "507f1f77bcf86cd799439011",
    fixture: "507f1f77bcf86cd799439012",
    competition: {
        type: CompetitionType.LEAGUE,
        name: "Premier League",
        _id: "507f1f77bcf86cd799439013"
    },
    homeTeam: {
        name: "Arsenal",
        shorthand: "ARS",
        _id: "507f1f77bcf86cd799439014"
    },
    awayTeam: {
        name: "Manchester City",
        shorthand: "MCI",
        _id: "507f1f77bcf86cd799439015"
    },
    goalScorers: [],
    matchType: "league",
    stadium: "Emirates Stadium",
    matchDate: new Date("2025-06-13T19:00:00Z"),
    kickoffTime: new Date("2025-06-13T19:00:00Z"),
    referee: "Michael Oliver",
    status: "2nd-half",
    currentMinute: 67,
    injuryTime: 0,
    result: {
        homeScore: 2,
        awayScore: 1,
        halftimeHomeScore: 1,
        halftimeAwayScore: 0,
        homePenalty: 0,
        awayPenalty: 0
    },
    statistics: {
        home: {
            shotsOnTarget: 7,
            shotsOffTarget: 4,
            fouls: 8,
            yellowCards: 2,
            redCards: 0,
            offsides: 3,
            corners: 6,
            possessionTime: 58
        },
        away: {
            shotsOnTarget: 4,
            shotsOffTarget: 6,
            fouls: 12,
            yellowCards: 3,
            redCards: 1,
            offsides: 2,
            corners: 4,
            possessionTime: 42
        }
    },
    lineups: {
        home: {
            startingXI: [
                {
                    player: {
                        name: "Aaron Ramsdale",
                        position: "GK",
                        _id: "507f1f77bcf86cd799439020"
                    },
                    position: "GK",
                    shirtNumber: 1,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Ben White",
                        position: "RB",
                        _id: "507f1f77bcf86cd799439021"
                    },
                    position: "RB",
                    shirtNumber: 2,
                    isCaptain: false
                },
                {
                    player: {
                        name: "William Saliba",
                        position: "CB",
                        _id: "507f1f77bcf86cd799439022"
                    },
                    position: "CB",
                    shirtNumber: 4,
                    isCaptain: true
                },
                {
                    player: {
                        name: "Gabriel Magalhaes",
                        position: "CB",
                        _id: "507f1f77bcf86cd799439023"
                    },
                    position: "CB",
                    shirtNumber: 6,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Oleksandr Zinchenko",
                        position: "LB",
                        _id: "507f1f77bcf86cd799439024"
                    },
                    position: "LB",
                    shirtNumber: 3,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Thomas Partey",
                        position: "DM",
                        _id: "507f1f77bcf86cd799439025"
                    },
                    position: "DM",
                    shirtNumber: 5,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Martin Odegaard",
                        position: "CM",
                        _id: "507f1f77bcf86cd799439026"
                    },
                    position: "CM",
                    shirtNumber: 8,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Declan Rice",
                        position: "CM",
                        _id: "507f1f77bcf86cd799439027"
                    },
                    position: "CM",
                    shirtNumber: 10,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Bukayo Saka",
                        position: "RW",
                        _id: "507f1f77bcf86cd799439028"
                    },
                    position: "RW",
                    shirtNumber: 7,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Gabriel Martinelli",
                        position: "LW",
                        _id: "507f1f77bcf86cd799439029"
                    },
                    position: "LW",
                    shirtNumber: 11,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Kai Havertz",
                        position: "ST",
                        _id: "507f1f77bcf86cd799439030"
                    },
                    position: "ST",
                    shirtNumber: 9,
                    isCaptain: false
                }
            ],
            substitutes: [
                {
                    player: {
                        name: "David Raya",
                        position: "GK",
                        _id: "507f1f77bcf86cd799439031"
                    },
                    position: "GK",
                    shirtNumber: 12
                },
                {
                    player: {
                        name: "Takehiro Tomiyasu",
                        position: "CB",
                        _id: "507f1f77bcf86cd799439032"
                    },
                    position: "CB",
                    shirtNumber: 15
                },
                {
                    player: {
                        name: "Jorginho",
                        position: "CM",
                        _id: "507f1f77bcf86cd799439033"
                    },
                    position: "CM",
                    shirtNumber: 18
                },
                {
                    player: {
                        name: "Eddie Nketiah",
                        position: "ST",
                        _id: "507f1f77bcf86cd799439034"
                    },
                    position: "ST",
                    shirtNumber: 14
                }
            ],
            formation: "4-3-3",
            coach: "Mikel Arteta"
        },
        away: {
            startingXI: [
                {
                    player: {
                        name: "Ederson",
                        position: "GK",
                        _id: "507f1f77bcf86cd799439040"
                    },
                    position: "GK",
                    shirtNumber: 1,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Kyle Walker",
                        position: "RB",
                        _id: "507f1f77bcf86cd799439041"
                    },
                    position: "RB",
                    shirtNumber: 2,
                    isCaptain: false
                },
                {
                    player: {
                        name: "John Stones",
                        position: "CB",
                        _id: "507f1f77bcf86cd799439042"
                    },
                    position: "CB",
                    shirtNumber: 5,
                    isCaptain: true
                },
                {
                    player: {
                        name: "Ruben Dias",
                        position: "CB",
                        _id: "507f1f77bcf86cd799439043"
                    },
                    position: "CB",
                    shirtNumber: 4,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Josko Gvardiol",
                        position: "LB",
                        _id: "507f1f77bcf86cd799439044"
                    },
                    position: "LB",
                    shirtNumber: 3,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Rodri",
                        position: "CM",
                        _id: "507f1f77bcf86cd799439045"
                    },
                    position: "CM",
                    shirtNumber: 6,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Bernardo Silva",
                        position: "CM",
                        _id: "507f1f77bcf86cd799439046"
                    },
                    position: "CM",
                    shirtNumber: 8,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Kevin De Bruyne",
                        position: "CAM",
                        _id: "507f1f77bcf86cd799439047"
                    },
                    position: "CAM",
                    shirtNumber: 10,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Phil Foden",
                        position: "RW",
                        _id: "507f1f77bcf86cd799439048"
                    },
                    position: "RW",
                    shirtNumber: 7,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Jack Grealish",
                        position: "LW",
                        _id: "507f1f77bcf86cd799439049"
                    },
                    position: "LW",
                    shirtNumber: 11,
                    isCaptain: false
                },
                {
                    player: {
                        name: "Erling Haaland",
                        position: "ST",
                        _id: "507f1f77bcf86cd799439050"
                    },
                    position: "ST",
                    shirtNumber: 9,
                    isCaptain: false
                }
            ],
            substitutes: [
                {
                    player: {
                        name: "Stefan Ortega",
                        position: "GK",
                        _id: "507f1f77bcf86cd799439051"
                    },
                    position: "GK",
                    shirtNumber: 12
                },
                {
                    player: {
                        name: "Nathan Ake",
                        position: "DF",
                        _id: "507f1f77bcf86cd799439052"
                    },
                    position: "DF",
                    shirtNumber: 15
                },
                {
                    player: {
                        name: "Mateo Kovacic",
                        position: "MF",
                        _id: "507f1f77bcf86cd799439053"
                    },
                    position: "MF",
                    shirtNumber: 16
                }
            ],
            formation: "4-2-3-1",
            coach: "Pep Guardiola"
        }
    },
    substitutions: [
        {
            id: '1234jnsmfsjcscscs',
            team: TeamType.AWAY,
            playerOut: {
                name: "Phil Foden",
                position: "RW",
                _id: "507f1f77bcf86cd799439048"
            },
            playerIn: {
                name: "Mateo Kovacic",
                position: "MF",
                _id: "507f1f77bcf86cd799439053"
            },
            minute: 62,
            injury: false
        },
        {
            id: '1234jnsmfsjcscs34',
            team: TeamType.HOME,
            playerOut: {
                name: "William Saliba",
                position: "CB",
                _id: "507f1f77bcf86cd799439022"
            },
            playerIn: {
                name: "Takehiro Tomiyasu",
                position: "CB",
                _id: "507f1f77bcf86cd799439032"
            },
            minute: 50,
            injury: false
        },
    ],
    timeline: [
        {
            _id: 'abshadkjnajnas5',
            type: FixtureTimelineType.GOAL,
            team: TeamType.HOME,
            player: {
                name: "Kai Havertz",
                position: "ST",
                _id: "507f1f77bcf86cd799439030"
            },
            relatedPlayer: {
                name: "Declan Rice",
                position: "CM",
                _id: "507f1f77bcf86cd799439027"
            },
            minute: 23,
            injuryTime: false,
            description: "Great finish from close range after a perfect cross",
            goalType: "regular",
            cardType: null
        },
        {
            _id: 'abshadkjnajnas4',
            type: FixtureTimelineType.YELLOWCARD,
            team: TeamType.AWAY,
            player: {
                name: "Bernardo Silva",
                position: "CM",
                _id: "507f1f77bcf86cd799439046"
            },
            relatedPlayer: null,
            minute: 35,
            injuryTime: false,
            description: "Cautioned for a late tackle",
            goalType: null,
            cardType: "first-yellow"
        },
        {
            _id: 'abshadkjnajnas3',
            type: FixtureTimelineType.GOAL,
            team: TeamType.AWAY,
            player: {
                name: "Erling Haaland",
                position: "ST",
                _id: "507f1f77bcf86cd799439050"
            },
            relatedPlayer: {
                name: "Kevin De Bruyne",
                position: "CAM",
                _id: "507f1f77bcf86cd799439047"
            },
            minute: 52,
            injuryTime: false,
            description: "Penalty conversion after VAR review",
            goalType: "penalty",
            cardType: null
        },
        {
            _id: 'abshadkjnajnas2',
            type: FixtureTimelineType.GOAL,
            team: TeamType.HOME,
            player: {
                name: "Bukayo Saka",
                position: "RW",
                _id: "507f1f77bcf86cd799439028"
            },
            relatedPlayer: null,
            minute: 65,
            injuryTime: false,
            description: "Brilliant solo effort from the wing",
            goalType: "regular",
            cardType: null
        },
        {
            _id: 'abshadkjnajnas1',
            type: FixtureTimelineType.REDCARD,
            team: TeamType.AWAY,
            player: {
                name: "John Stones",
                position: "CB",
                _id: "507f1f77bcf86cd799439042"
            },
            relatedPlayer: null,
            minute: 66,
            injuryTime: false,
            description: "Second yellow card for dissent",
            goalType: null,
            cardType: "second-yellow"
        }
    ],
    commentary: [
        {
            id: '1',
            minute: 67,
            injuryTime: false,
            type: "regular",
            text: "Arsenal are now in complete control after the red card. City struggling to create chances with ten men.",
            eventId: "507f1f77bcf86cd799439060"
        },
        {
            id: '2',
            minute: 65,
            injuryTime: false,
            type: "important",
            text: "GOAL! Arsenal 2-1 Manchester City. Saka cuts inside and curls a beautiful shot into the top corner!",
            eventId: "507f1f77bcf86cd799439061"
        },
        {
            id: '3',
            minute: 66,
            injuryTime: false,
            type: "highlight",
            text: "RED CARD! Stones is shown a second yellow for arguing with the referee. City down to ten men!",
            eventId: "507f1f77bcf86cd799439062"
        }
    ],
    streamLinks: [
        {
            platform: "Sky Sports",
            url: "https://skysports.com/live-stream",
            isOfficial: true,
            requiresSubscription: true
        },
        {
            platform: "ESPN+",
            url: "https://espn.com/watch",
            isOfficial: true,
            requiresSubscription: true
        }
    ],
    cheerMeter: {
        official: {
            home: 78,
            away: 22
        },
        unofficial: {
            home: 82,
            away: 18
        },
        userVotes: [
            {
                userId: "507f1f77bcf86cd799439070",
                team: TeamType.HOME,
                isOfficial: false,
                timestamp: new Date("2025-06-13T20:05:00Z")
            },
            {
                userId: "507f1f77bcf86cd799439071",
                team: TeamType.AWAY,
                isOfficial: false,
                timestamp: new Date("2025-06-13T20:06:00Z")
            }
        ]
    },
    playerOfTheMatch: {
        official: {
            name: "Bukayo Saka",
            position: "RW",
            _id: "507f1f77bcf86cd799439028"
        },
        fanVotes: [
            {
                player: {
                    name: "Bukayo Saka",
                    position: "RW",
                    _id: "507f1f77bcf86cd799439028"
                },
                votes: 1247
            },
            {
                player: {
                    name: "Kai Havertz",
                    position: "ST",
                    _id: "507f1f77bcf86cd799439030"
                },
                votes: 892
            }
        ],
        userVotes: [
            {
                userId: "507f1f77bcf86cd799439080",
                playerId: {
                    name: "Bukayo Saka",
                    position: "RW",
                    _id: "507f1f77bcf86cd799439028",
                    department: "jnsjdakmamsdap",
                    admissionYear: '2024/2025'
                },
                timestamp: new Date("2025-06-13T20:07:00Z")
            }
        ]
    },
    playerRatings: [
        {
            player: {
                name: "Kai Havertz",
                position: "ST",
                _id: "507f1f77bcf86cd799439028"
            },
            team: TeamType.HOME,
            official: {
                rating: 7.5,
                ratedBy: 'admin123'
            },
            fanRatings: {
                average: 8,
                count: 100,
                distribution: {
                    '1': 10, '2': 1, '3': 4,
                    '4': 11, '5': 2, '6': 5,
                    '7': 8, '8': 30, '9': 3,
                    '10': 9
                }
            },
            stats: {
                goals: 0,
                assists: 1,
                shots: 2,
                passes: 31,
                tackles: 1,
                saves: 0
            }
        },
        {
            player: {
                name: "Bukayo Saka",
                position: "RW",
                _id: "507f1f77bcf86cd799439028"
            },
            team: TeamType.HOME,
            official: {
                rating: 7.5,
                ratedBy: 'admin123'
            },
            fanRatings: {
                average: 8,
                count: 100,
                distribution: {
                    '1': 10, '2': 1, '3': 4,
                    '4': 11, '5': 2, '6': 5,
                    '7': 8, '8': 30, '9': 3,
                    '10': 9
                }
            },
            stats: {
                goals: 1,
                assists: 0,
                shots: 3,
                passes: 34,
                tackles: 2,
                saves: 0
            }
        }
    ],
    odds: {
        preMatch: {
            homeWin: 2.10,
            draw: 3.40,
            awayWin: 3.20,
            overUnder: [
                {
                    line: 2.5,
                    over: 1.83,
                    under: 1.95
                },
                {
                    line: 3.5,
                    over: 2.75,
                    under: 1.42
                }
            ]
        },
        live: {
            updatedAt: new Date("2025-06-13T20:07:00Z"),
            homeWin: 1.35,
            draw: 5.50,
            awayWin: 8.00,
            overUnder: [
                {
                    line: 3.5,
                    over: 1.95,
                    under: 1.83
                }
            ]
        }
    },
    attendance: 59867,
    weather: {
        condition: "Clear",
        temperature: 18,
        humidity: 65
    },
    createdAt: new Date("2025-06-13T18:30:00Z"),
    updatedAt: new Date("2025-06-13T20:07:30Z")
};