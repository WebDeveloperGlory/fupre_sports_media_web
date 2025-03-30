import { Statistics } from "@/utils/requestDataTypes";
import { EventTypes } from "@/utils/stateTypes";

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