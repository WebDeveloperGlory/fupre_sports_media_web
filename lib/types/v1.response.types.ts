import { CompetitionStatus, CompetitionTeamReg, CompetitionType, ExtraRule, GroupTable, KnockoutRound, LeagueStanding, Rules, Sponsor } from "@/types/v1.football-competition.types";
import { FixtureCommentary, FixtureGoalScorers, FixtureLineups, FixtureOdds, FixturePlayerOfTheMatch, FixtureResult, FixtureStatistics, FixtureStatus, FixtureStreamLinks, FixtureSubstitutions, FixtureTimeline, FixtureType, FixtureWeather } from "@/types/v1.football-fixture.types";
import { LiveFixtureCheerMeter, LiveStatus } from "@/types/v1.football-live.types";
import { AdvancedMetrics, DefensiveMetrics, DisciplineMetrics, DribblingMetrics, DuelMetrics, FanRating, KeeperMetrics, OffensiveMetrics, OfficialRating, PassingMetrics } from "@/types/v1.football-player-stat.types";
import { PlayerContractType, PlayerFavoriteFoot, PlayerPosition, PlayerSeasonStatType, PlayerVerificationStatus, Stats } from "@/types/v1.football-player.types";
import { CoachRoles, PerformanceStats, TeamColor, TeamTypes } from "@/types/v1.football-team.types";
import { SportType, UserPermissions, UserPreference, UserRole, UserStatus } from "@/types/v1.user.types";

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface APIResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface DeleteAPIResponse {
    success: boolean;
    message: string;
}

export interface LoginResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
        permissions: UserPermissions[];
    };
    token: string;
}

export interface UserResponse {
    id: string;
    name: string;
    username: string | undefined;
    email: string;
    role: UserRole;
    avatar: string;
    permissions: UserPermissions[];
    sport: SportType;
    status: UserStatus;
    lastLogin: Date | null;
    passwordChangedAt: Date | null;
    preferences: UserPreference;
    isFantasyRegistered: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface FootballPlayerResponse {
    id: string;
    name: string;
    department: {
        _id: string;
        name: string;
        code: string;
    };
    admissionYear: number;
    weight?: number;
    height?: number;
    nationality: string;
    preferredFoot: PlayerFavoriteFoot;
    naturalPosition: PlayerPosition;
    photo: string | null;
    marketValue: number | null;
    awards: {
        title: string,
        season: string,
        date: Date,
        description: string
    }[];
    verificationStatus: PlayerVerificationStatus;
    createdAt: Date;
}

export interface FootballPlayerContractResponse {
    id: string;
    player: { name: string; photo: string; _id: string; };
    team: { name: string; shorthand: string; logo: string; };
    startDate: Date;
    endDate: Date | null;
    contractType: PlayerContractType;
    position: PlayerPosition;
    jerseyNumber: number;
    isActive: boolean;
    createdAt: Date;
}

export interface PlayerSeasonStatResponse {
    id: string;
    player: {
        _id: string;
        name: string;
        department: {
            name: string;
            code: string;
        };
        nationality: string;
        photo: string | null;
    };
    team: {
        _id: string;
        name: string;
        shorthand: string;
        logo: string;
    };
    season: string;
    type: PlayerSeasonStatType;
    competition: {

    } | null;
    stats: Stats;
    createdAt: Date;
}

export interface PlayerCareerStatResponse {
    id: string;
    player: string;
    appearances: number;
    totalGoals: number;
    totalAssists: number;
    totalCleanSheets: number;
    totalYellowCards: number;
    totalRedCards: number;
    totalMOTM: number;
    minutesPlayed: number;
    createdAt: Date;
}

export interface DepartmentResponse {
    id: string;
    name: string;
    code: string;
    faculty: string; // Faculty ID
    createdAt: Date;
}

export interface FacultyResponse {
    id: string;
    name: string;
    code: string;
    createdAt: Date;
}

export interface FootballTeamResponse {
    id: string;
    name: string;
    shorthand: string;
    logo: string | null;
    faculty: {
        _id: string;
        name: string;
        code: string;
    } | null;
    department: {
        _id: string;
        name: string;
        code: string;
    } | null;
    type: TeamTypes;
    colors: TeamColor;
    academicYear: string;
    stats: PerformanceStats;
    coaches: {
        name: string;
        role: CoachRoles;
    }[];
    admin: string | null;
    createdAt: Date;
}

export interface CompetitionResponse {
    id: string;
    name: string;
    shorthand: string;
    type: CompetitionType;
    logo: string | null;
    coverImage: string | null;
    description: string;
    status: CompetitionStatus;
    teams: FootballTeamResponse[];
    teamRegistrations: CompetitionTeamReg[];
    leagueTable: LeagueStanding[] | null;
    knockoutRounds: KnockoutRound[] | null;
    groupStage: GroupTable[] | null;
    season: string;
    startDate: Date;
    endDate: Date;
    registrationDeadline: Date | null;
    currentMatchWeek: number;
    currentStage: string | null;
    rules: Rules;
    extraRules: ExtraRule[];
    sponsors: Sponsor[];
    isActive: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CompetitionStatsResponse {
    basicInfo: {
        name: string;
        type: CompetitionType;
        status: CompetitionStatus;
        season: string;
        teamsCount: number;
        registeredTeamsCount: number;
    };
    timeline: {
        startDate: Date;
        endDate: Date;
        daysRemaining: number;
        matchWeek: number;
        currentStage: string;
    };
    leagueStats: {
        totalMatches: number;
        completedMatches: number;
        completionPercentage: number;
        topScorer: { team: string; goals: number } | null;
        bestDefense: { team: string; goalsConceded: number } | null;
        averageGoalsPerMatch: number;
        totalYellowCards: number;
        totalRedCards: number;
    } | null;
    groupStats: {
        totalGroups: number;
        completedGroups: number;
        completionPercentage: number;
        qualifiedTeams: number;
        matchesPlayed: number;
        totalMatches: number;
    } | null;
    knockoutStats: {
        totalRounds: number;
        completedRounds: number;
        completionPercentage: number;
        totalFixtures: number;
    } | null;
    registration: {
        isRegistrationOpen: boolean;
        registrationDeadline: Date | null;
        daysUntilDeadline: number | null;
    };
    calculatedAt: Date;
}

export interface FixturesResponse {
    competitionId: string;
    totalFixtures: number;
    fixtures: Array<{
        homeTeam: string;
        awayTeam: string;
        round: number;
        isHomeGame?: boolean;
        isKnockout?: boolean;
    }>;
    generatedAt: Date;
}

export interface QualificationsResponse {
    competitionId: string;
    groups: Array<{
        groupName: string;
        qualifiedTeams: Array<{
            team: string;
            position: number;
            qualifiedAs: string;
            destination: string;
            isBestLoserCandidate: boolean;
        }>;
        bestLoserCandidates: Array<{
            team: string;
            position: number;
            points: number;
            goalDifference: number;
        }>;
    }>;
    bestLosers: Array<{
        team: string;
        position: number;
        points: number;
        goalDifference: number;
    }>;
    totalQualified: number;
    calculatedAt: Date;
}

export interface FixtureResponse {
    id: string;
    competition: {
        id: string;
        name: string;
        shorthand: string;
        logo: string | null;
    } | null;
    homeTeam: FootballTeamResponse | null;
    awayTeam: FootballTeamResponse | null;
    isTemporaryMatch: boolean;
    temporaryHomeTeamName: string | null;
    temporaryAwayTeamName: string | null;
    matchType: FixtureType;
    stadium: string;
    scheduledDate: Date;
    status: FixtureStatus;
    postponedReason: string | null;
    rescheduledDate: Date | null;
    result: FixtureResult;
    goalScorers: FixtureGoalScorers[];
    statistics: FixtureStatistics;
    playerStats: string[];
    lineups: FixtureLineups;
    substitutions: FixtureSubstitutions[];
    timeline: FixtureTimeline[];
    commentary: FixtureCommentary[];
    playerOfTheMatch: FixturePlayerOfTheMatch;
    referee: string;
    attendance: number;
    weather: FixtureWeather;
    highlights: FixtureStreamLinks[];
    isDerby: boolean;
    odds: FixtureOdds;
    createdAt: Date;
    updatedAt: Date;
}

export interface LiveFixtureResponse {
    id: string;
    fixture: FixtureResponse | string;
    competition: {
        id: string;
        name: string;
        shorthand: string;
        logo: string | null;
    } | null;
    homeTeam: FootballTeamResponse | null;
    awayTeam: FootballTeamResponse | null;
    isTemporaryMatch: boolean;
    temporaryHomeTeamName: string | null;
    temporaryAwayTeamName: string | null;
    matchType: FixtureType;
    stadium: string;
    matchDate: Date;
    kickoffTime: Date;
    referee: string;
    status: LiveStatus;
    currentMinute: number;
    injuryTime: number;
    result: FixtureResult;
    goalScorers: FixtureGoalScorers[];
    statistics: FixtureStatistics;
    playerStats: string[];
    lineups: FixtureLineups;
    substitutions: FixtureSubstitutions[];
    timeline: FixtureTimeline[];
    commentary: FixtureCommentary[];
    streamLinks: FixtureStreamLinks[];
    cheerMeter: LiveFixtureCheerMeter;
    playerOfTheMatch: FixturePlayerOfTheMatch;
    odds: FixtureOdds;
    attendance: number;
    weather: FixtureWeather;
    createdAt: Date;
    updatedAt: Date;
}

export interface VoteDistributionResponse {
    playerId: string | null;
    temporaryPlayerName: string | null;
    count: number;
    percentage?: number;
}

export interface POTMWinnerResponse {
    playerId: string | null;
    temporaryPlayerName: string | null;
    count: number;
}

export interface POTMResultsResponse {
    officialPOTM: {
        playerId: string | null;
        temporaryPlayerName: string | null;
    } | null;
    voteDistribution: VoteDistributionResponse[];
    totalVotes: number;
    winningFanPOTM: POTMWinnerResponse | null;
}

export interface UserVoteResponse {
    playerId: string | null;
    temporaryPlayerName: string | null;
    timestamp: Date;
}

export interface UserVotingHistoryResponse {
    liveFixtureId: string;
    fixtureId: string;
    fixture: {
        homeTeam: FootballTeamResponse | null;
        awayTeam: FootballTeamResponse | null;
        date: Date;
    };
    playerId: string | null;
    temporaryPlayerName: string | null;
    timestamp: Date;
}

export interface FixturePlayerStatResponse {
    id: string;
    fixture: string | FixtureResponse;
    liveFixture: string | null;
    player: {
        id: string;
        name: string;
        photo: string | null;
        position: PlayerPosition;
    } | null;
    team: FootballTeamResponse | null;
    isTemporary: boolean;
    temporaryPlayerName: string | null;
    temporaryTeamName: string | null;
    minutesPlayed: number;
    position: PlayerPosition;
    shirtNumber: number | null;
    starter: boolean;
    onPitch: boolean;
    isCaptain: boolean;
    offensiveMetrics: OffensiveMetrics;
    passingMetrics: PassingMetrics;
    defensiveMetrics: DefensiveMetrics;
    duelMetrics: DuelMetrics;
    disciplineMetrics: DisciplineMetrics;
    keeperMetrics: KeeperMetrics;
    dribblingMetrics: DribblingMetrics;
    advancedMetrics: AdvancedMetrics;
    officialRating: OfficialRating | null;
    fanRating: FanRating | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface BulkUpdateStatsResponse {
    success: number;
    failed: number;
    errors?: Array<{
        statId: string;
        error: string;
    }>;
}