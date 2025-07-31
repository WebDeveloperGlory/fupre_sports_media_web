import { BlogCategories, CoachRoles, CompetitionSponsors, CompetitionStatus, CompetitionTeamForm, CompetitionTypes, FixtureStatus, LogAction, SportType, TeamTypes, UserRole, UserStatus } from "./v2requestData.enums";
import { FixtureCheerMeter, FixtureCommentary, FixtureLineup, FixtureOdds, FixturePlayerOfTheMatch, FixturePlayerRatings, FixtureResult, FixtureStat, FixtureStreamLinks, FixtureSubstitutions, FixtureTimeline, ShortPopulatedCompetition, ShortPopulatedPlayer, ShortPopulatedTeam } from "./v2requestSubData.types";

export type UserPreference = {
    notifications: {
        inApp: boolean;
        email: boolean;
    }
}
export interface IV2User {
    _id: string;
    profileImage?: string;
    name: string;
    password: string;
    email: string;
    role: UserRole;
    sport: SportType;
    status: UserStatus;
    otp: string | null;
    otpExpiresAt: Date | null;
    lastLogin: Date | null;
    passwordChangedAt: Date | null;
    preferences: UserPreference;
    comparePassword: ( password: string ) => Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}
export interface IV2AuditLog {
    _id: string;
    userId: string;
    action: LogAction;
    entity: string;
    entityId: string;
    details: Object;
    previousValues: Object;
    newValues: Object;
    ipAddress: string;
    userAgent: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IV2FootballLiveFixture {
    _id: string;
    fixture: string;
    competition: ShortPopulatedCompetition;
    homeTeam: ShortPopulatedTeam;
    awayTeam: ShortPopulatedTeam;
    matchType: 'league' | 'knockout' | 'hybrid';
    stadium: string;
    matchDate: Date;
    kickoffTime: Date;
    referee: string;
    status: 'pre-match' | '1st-half' | 'half-time' | '2nd-half' | 'extra-time' | 'penalties' | 'finished' | 'postponed' | 'abandoned';
    currentMinute: number;
    injuryTime: number;
    result: FixtureResult;
    goalScorers: { player: ShortPopulatedPlayer, team: ShortPopulatedTeam, time: number }[];
    statistics: {
        home: FixtureStat,
        away: FixtureStat
    };
    lineups: {
        home: FixtureLineup,
        away: FixtureLineup
    };
    substitutions: FixtureSubstitutions[];
    timeline: FixtureTimeline[];
    commentary: FixtureCommentary[];
    streamLinks: FixtureStreamLinks[];
    cheerMeter: FixtureCheerMeter;
    playerOfTheMatch: FixturePlayerOfTheMatch;
    playerRatings: FixturePlayerRatings[];
    odds: FixtureOdds;
    attendance: number;
    weather: {
        condition: string,
        temperature: number
        humidity: number
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface IV2FootballCompetition {
    _id: string;

    name: string;
    shorthand: string;
    type: CompetitionTypes;
    logo: string;
    coverImage: string;
    description: string;
    status: CompetitionStatus;

    format: {
        groupStage?: {
            numberOfGroups: number,
            teamsPerGroup: number,
            advancingPerGroup: number
        },
        knockoutStage?: {
            hasTwoLegs: boolean,
            awayGoalsRule: boolean,
        },
        leagueStage?: {
            matchesPerTeam: number,
            pointsSystem: {
                win: number
                draw: number
                loss: number
            }
        }
    };

    season: string;
    startDate: Date;
    endDate: Date;
    registrationDeadline?: Date;
    currentStage?: string;

    teams: {
        team: string,
        squad: {
            player: string,
            jerseyNumber: number,
            isCaptain: boolean,
            position: string
        }[],
    }[],

    // Statistics (Aggregated)
    stats: {
        averageGoalsPerMatch: Number,
        averageAttendance: Number,
        cleanSheets: Number,
        topScorers: {
            player: ShortPopulatedPlayer,
            team: ShortPopulatedTeam,
            goals: Number,
            penalties: Number
        }[],
        topAssists: {
            player: ShortPopulatedTeam,
            team: ShortPopulatedPlayer,
            assists: Number
        }[],
        bestDefenses: {
            team: ShortPopulatedPlayer,
            cleanSheets: Number,
            goalsConceded: Number
        }[]
    },

    leagueTable: ILeagueStandings[],
    knockoutRounds: IKnockoutRounds[],
    groupStage: IGroupTable[],

    awards: {
        player: {
            name: string,
            winner: {
                player: string,
                team: string,
            } | null
        }[],
        team: {
            name: string,
            winner: string | null,
        }[]
    },

    rules: {
        substitutions: {
            allowed: boolean,
            maximum: number,
        },
        extraTime: boolean,
        penalties: boolean,
        matchDuration: {
            normal: number, // minutes
            extraTime: number
        },
        squadSize: {
            min: number,
            max: number
        },
    },
    extraRules: {
        title: string,
        description: string,
        lastUpdated: Date
    }[],
    sponsors: {
        name: string,
        logo: string | null,
        tier: CompetitionSponsors
    }[],

    prizeMoney?: {
        champion: number,
        runnerUp: number,
    },
    isActive: boolean
    isFeatured: boolean

    admin: string

    createdAt: Date;
    updatedAt: Date;
}

export interface IV2FootballTeam {
    _id: string;
    name: string;
    shorthand: string

    type: TeamTypes;
    academicYear: string;
    department?: { _id: string, name: string };
    faculty?: { _id: string, name: string };

    coaches: {
        name: string;
        role: CoachRoles;
    }[];
    players: string[];

    friendlyRequests: {
        requestId: string,
        team: string,
        status: 'pending' | 'accepted' | 'reqjected',
        proposedDate: Date,
        message: String,
        type: 'recieved' | 'sent',
        createdAt?: Date,
    }[];
    competitionPerformance: {
        competition: string,
        season: string,
        stats: {
            played: number,
            wins: number,
            draws: number,
            losses: number,
            goalsFor: number,
            goalsAgainst: number,
            cleanSheets: number
        },
        achievements: string[]
    }[];

    stats: {
        matchesPlayed: number;
        wins: number;
        draws: number;
        losses: number;
        goalsFor: number;
        goalsAgainst: number;
        cleanSheets: number;
    };

    logo: string;
    colors: {
        primary: string;
        secondary: string;
    }

    admin: { _id: string, name: string, email: string };

    createdAt: Date;
    updatedAt: Date;
}

export interface IV2FootballFixture {
    _id: string;
    competition: string;
    homeTeam: string; // hometeamID
    awayTeam: string; // awayTeamID
    matchType: string;
    stadium: string;
    
    scheduledDate: Date;
    status: FixtureStatus;
    postponedReason: string;
    rescheduledDate: Date;

    result: FixtureResult;
    goalScorers: { player: string, team: string, time: number }[];
    statistics: {
        home: FixtureStat,
        away: FixtureStat
    };

    lineups: {
            home: FixtureLineup,
            away: FixtureLineup
        };
    substitutions: FixtureSubstitutions[];
    
    timeline: FixtureTimeline[];
    commentary: FixtureCommentary[];

    playerOfTheMatch: FixturePlayerOfTheMatch;
    playerRatings: FixturePlayerRatings[];

    referee: string;
    attendance: number;
    weather: {
        condition: string,
        temperature: number
    };
    highlights: FixtureStreamLinks[];
    isDerby: Boolean;

    createdAt: Date;
    updatedAt: Date;
}

export interface PopIV2FootballFixture {
    _id: string;
    competition: ShortPopulatedCompetition;
    homeTeam: ShortPopulatedTeam; // hometeamID
    awayTeam: ShortPopulatedTeam; // awayTeamID
    matchType: string;
    stadium: string;
    
    scheduledDate: Date;
    status: FixtureStatus;
    postponedReason: string;
    rescheduledDate: Date;

    result: FixtureResult;
    goalScorers: { player: string, team: string, time: number }[];
    statistics: {
        home: FixtureStat,
        away: FixtureStat
    };

    lineups: {
            home: FixtureLineup,
            away: FixtureLineup
        };
    substitutions: FixtureSubstitutions[];
    
    timeline: FixtureTimeline[];
    commentary: FixtureCommentary[];

    playerOfTheMatch: FixturePlayerOfTheMatch;
    playerRatings: FixturePlayerRatings[];

    referee: string;
    attendance: number;
    weather: {
        condition: string,
        temperature: number
    };
    highlights: FixtureStreamLinks[];
    isDerby: Boolean;

    createdAt: Date;
    updatedAt: Date;
}

export interface IV2Blog {
    _id: string;

    author: { _id: string; name: string; email: string; role: UserRole };
    category: BlogCategories;
    title: string;
    content: string;
    coverImage?: string;
    isReviewed: boolean;
    isPublished: boolean;
    views: number;

    createdAt: Date;
    updatedAt: Date;
}

export interface TeamPlayerDetails {
    _id: string;
    name: string;
    admissionYear: string;
    department: string;
    clubStatus?: 'registered' | 'on-loan' | 'transferred-out';
    loanDetails?: {
        fromClub: string,
        toTeam: string,
        startDate: Date,
        endDate: Date,
        terms: string
    };
    marketValue: number;
    preferredFoot: 'left' | 'right' | 'both';
    height: string;
    weight: string;
    verificationStatus: "pending" | "verified" | "rejected";
    role: 'player' | 'captain' | 'vice-captain';
    position: string;
    jerseyNumber: number;
    joinedAt: Date;
    seasonalStats?: {
        academicYear: string;
        team: string;
        stats: {
            appearances: number,
            goals: number,
            assists: number,
            cleanSheets: number,
            yellowCards: number,
            redCards: number,
            motmAwards: number
        }
    };
    competitionStats?: {
        competition: ShortPopulatedCompetition,
        season: string,
        team: string,
        appearances: number,
        goals: number,
        assists: number,
        yellowCards: number,
        redCards: number,
        minutesPlayed: number,
    };
}

export interface ILeagueStandings {
    _id: string;

    team: ShortPopulatedTeam;
    played: number;
    points: number;
    disciplinaryPoints: number;
    wins: number;
    losses: number;
    draws: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    form: CompetitionTeamForm[],
    position: number,
}

export interface IKnockoutRounds {
    _id: string;

    name: string,
    fixtures: string[],
    completed: boolean,
}

export interface IPopKnockoutRounds {
    _id: string;

    name: string,
    fixtures: {
        _id: string;
        homeTeam: ShortPopulatedTeam;
        awayTeam: ShortPopulatedTeam;
        stadium: string;
        scheduledDate: Date;
        status: FixtureStatus;
        result: FixtureResult | null;
        rescheduledDate?: Date | null;
        postponedReason?: string | null;
    }[],
    completed: boolean,
}

export interface IGroupTable {
    _id: string;

    name: string;
    standings: ILeagueStandings[];
    fixtures: string[];
    qualificationRules: {
        position: number,
        destination: 'knockout' | 'playoffs' | 'eliminated',
        knockoutRound: string,
        isBestLoserCandidate: boolean
    }[];
    qualifiedTeams: {
        team: string,
        originalPosition: number,
        qualifiedAs: string,
        destination: string
    }[];
}