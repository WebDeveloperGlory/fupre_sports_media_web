import { PlayerContractType, PlayerFavoriteFoot, PlayerPosition, PlayerSeasonStatType, PlayerVerificationStatus } from "@/types/v1.football-player.types";
import { UserPermissions, UserRole } from "@/types/v1.user.types";
import {
    CompetitionType,
    CompetitionStatus,
    CompetitionSponsor,
    CompetitionTeamForm,
} from "@/types/v1.football-competition.types";
import {
    FixtureType,
    FixtureStatus,
    FixtureTeamType,
    FixtureTimelineType,
    FixtureTimelineGoalType,
    FixtureTimelineCardType,
    FixtureCommentaryType,
    FixtureResult,
    FixtureStatistics,
    FixtureWeather
} from "@/types/v1.football-fixture.types";
import { LiveStatus } from "@/types/v1.football-live.types";

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
}

export interface CreateAdminDto {
    name: string;
    email: string;
    role: UserRole;
    permissions: UserPermissions[];
    password: string;
}

export interface UserUpdateDto {
    username: string;
    name: string;
    preferences: {
        notifications: {
            inApp: boolean;
            email: boolean;
            fantasyUpdates: boolean;
        };
    };
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface VerifyOTPDto {
    email: string;
    otp: string;
}

export interface RequestOTPDto {
    email: string;
}

export interface UpdatePlayerDto {
    name?: string,
    admissionYear?: string,
    weight?: number,
    height?: number,
    nationality?: string,
    preferredFoot?: PlayerFavoriteFoot,
    naturalPosition?: PlayerPosition,
    marketValue?: number,
}

export interface CreatePlayerDto {
    name: string;
    department: string;
    admissionYear: string;
    nationality: string;
    preferredFoot: PlayerFavoriteFoot;
    naturalPosition: PlayerPosition;
    verificationStatus: PlayerVerificationStatus;
    weight?: number;
    height?: number;
    marketValue?: number;
}

export interface AwardPlayerDto {
    title: string;
    season: string;
    description: string;
}

export interface CreatePlayerContract {
    team: string;
    startDate: Date;
    endDate: Date | null;
    contractType: PlayerContractType;
    position: PlayerPosition;
    jerseyNumber: number;
}

export interface UpdateCareerStatsDto {
    appearances?: number;
    totalGoals?: number;
    totalAssists?: number;
    totalCleanSheets?: number;
    totalYellowCards?: number;
    totalRedCards?: number;
    totalMOTM?: number;
    minutesPlayed?: number;
}

export interface UpdateSeasonStatsDto {
    team: string;
    season: string;
    competition: string | null;
    type: PlayerSeasonStatType;
    minutesPlayed: number;
    goals: number;
    assists: number;
    cleanSheets: number;
    yellowCards: number;
    redCards: number;
    MOTM: number;
}

export interface RequestTeamPlayerStatsDto {
    players: string[];
    season?: string;
}

export interface CreateFootballTeamDto {

}

export interface UpdateFootballTeamDto {
    name?: string;
    shorthand?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

export interface CreateCompetitionDto {
    name: string;
    shorthand: string;
    type: CompetitionType;
    logo?: string;
    coverImage?: string;
    description: string;
    season: string;
    startDate: Date;
    endDate: Date;
    registrationDeadline?: Date;
    rules: {
        substitutions: {
            allowed: boolean;
            maximum: number;
        };
        extraTime: boolean;
        penalties: boolean;
        matchDuration: {
            normal: number;
            extraTime: number;
        };
        squadSize: {
            min: number;
            max: number;
        };
    };
}

// Update Competition
export interface UpdateCompetitionDto {
    name?: string;
    shorthand?: string;
    logo?: string;
    coverImage?: string;
    description?: string;
    status?: CompetitionStatus;
    season?: string;
    startDate?: Date;
    endDate?: Date;
    registrationDeadline?: Date;
    currentMatchWeek?: number;
    currentStage?: string;
    isActive?: boolean;
    isFeatured?: boolean;
}

// Team Registration
export interface TeamRegistrationDto {
    team: string;
    squad: Array<{
        player: string;
        jerseyNumber: number;
        isCaptain: boolean;
        position: PlayerPosition;
    }>;
}

// Team Management
export interface AddTeamDto {
    teamId: string;
}

export interface RemoveTeamDto {
    teamId: string;
}

// Extra Rule
export interface ExtraRuleDto {
    title: string;
    description: string;
}

// Sponsor
export interface SponsorDto {
    name: string;
    logo?: string;
    tier: CompetitionSponsor;
}

// Stage Update
export interface StageUpdateDto {
    stage: string;
}

// Featured Update
export interface FeaturedUpdateDto {
    featured: boolean;
}

// Sponsor Removal
export interface SponsorRemovalDto {
    sponsorName: string;
}

// Rule Removal
export interface RuleRemovalDto {
    ruleTitle: string;
}

// Knockout Round
export interface KnockoutRoundDto {
    name: string;
    roundNumber: number;
    fixtures?: string[];
    completed?: boolean;
}

// Knockout Round Completion
export interface KnockoutRoundCompletionDto {
    roundId: string;
}

// Group Table
export interface GroupTableDto {
    name: string;
    groupNumber: number;
    standings?: Array<{
        team: string;
        played?: number;
        wins?: number;
        draws?: number;
        losses?: number;
        goalsFor?: number;
        goalsAgainst?: number;
        points?: number;
        disciplinaryPoints?: number;
        bonusPoints?: number;
        form?: CompetitionTeamForm[];
        position?: number;
        yellowCards?: number;
        redCards?: number;
    }>;
    fixtures?: string[];
    qualificationRules?: Array<{
        position: number;
        destination: 'knockout' | 'playoffs' | 'eliminated';
        description: string;
        isBestLoserCandidate: boolean;
    }>;
    qualifiedTeams?: Array<{
        team: string;
        originalPosition: number;
        qualifiedAs: string;
        destination: string;
    }>;
    completed?: boolean;
    matchesPlayed?: number;
    totalMatches?: number;
}

// League Standing Update
export interface LeagueStandingUpdateDto {
    teamId: string;
    update: {
        played?: number;
        wins?: number;
        draws?: number;
        losses?: number;
        goalsFor?: number;
        goalsAgainst?: number;
        points?: number;
        disciplinaryPoints?: number;
        bonusPoints?: number;
        form?: CompetitionTeamForm[];
        position?: number;
        yellowCards?: number;
        redCards?: number;
    };
}

// League Table Update
export interface LeagueTableUpdateDto {
    table: Array<{
        team: string;
        played?: number;
        wins?: number;
        draws?: number;
        losses?: number;
        goalsFor?: number;
        goalsAgainst?: number;
        points?: number;
        disciplinaryPoints?: number;
        bonusPoints?: number;
        form?: CompetitionTeamForm[];
        position?: number;
        yellowCards?: number;
        redCards?: number;
    }>;
}

// Group Stage Update
export interface GroupStageUpdateDto {
    groups: GroupTableDto[];
}

// Search Query
export interface SearchCompetitionsDto {
    q: string;
    page?: number;
    limit?: number;
}

// Status Filter
export interface StatusFilterDto {
    status: CompetitionStatus;
    page?: number;
    limit?: number;
}

// Pagination
export interface PaginationDto {
    page: number;
    limit: number;
}

// File Upload
export interface FileUploadDto {
    file: File;
}

// Create Fixture
export interface CreateFixtureDto {
    homeTeam?: string;
    awayTeam?: string;
    isTemporaryMatch: boolean;
    temporaryHomeTeamName?: string;
    temporaryAwayTeamName?: string;
    competition?: string;
    scheduledDate: Date;
    stadium: string;
    matchType: FixtureType;
    referee: string;
    isDerby: boolean;
}

// Update Fixture
export interface UpdateFixtureDto {
    scheduledDate?: Date;
    status?: FixtureStatus;
    stadium?: string;
    referee?: string;
    attendance?: number;
    weather?: FixtureWeather;
    postponedReason?: string;
    rescheduledDate?: Date;
    result?: Partial<FixtureResult>;
    statistics?: Partial<FixtureStatistics>;
    isDerby?: boolean;
}

// Update Statistics
export interface UpdateFixtureStatisticsDto {
    statistics: FixtureStatistics;
}

// Search Fixtures
export interface SearchFixturesDto {
    team?: string;
    competition?: string;
    dateFrom?: Date;
    dateTo?: Date;
    status?: FixtureStatus;
    page?: number;
    limit?: number;
}

// Fixtures by Date
export interface FixturesByDateDto {
    date: Date;
    competition?: string;
    page?: number;
    limit?: number;
}

// Fixtures by Team
export interface FixturesByTeamDto {
    team: string;
    competition?: string;
    page?: number;
    limit?: number;
}

// Pagination
export interface PaginationDto {
    page: number;
    limit: number;
}

// Goal Scorer
export interface AddGoalScorerDto {
    player?: string;
    temporaryPlayerName?: string;
    team?: string;
    temporaryTeamName?: string;
    time: number;
    assist?: string;
    temporaryAssistName?: string;
    goalType: FixtureTimelineGoalType;
}

// Timeline Event
export interface AddTimelineDto {
    type: FixtureTimelineType;
    team: FixtureTeamType;
    player?: string;
    temporaryPlayerName?: string;
    relatedPlayer?: string;
    temporaryRelatedPlayerName?: string;
    minute: number;
    injuryTime: boolean;
    description: string;
    goalType?: FixtureTimelineGoalType;
    cardType?: FixtureTimelineCardType;
}

// Substitution
export interface AddSubstitutionDto {
    team: FixtureTeamType;
    playerOut?: string;
    playerIn?: string;
    temporaryPlayerOutName?: string;
    temporaryPlayerInName?: string;
    minute: number;
    injury: boolean;
}

// Commentary
export interface AddCommentaryDto {
    minute: number;
    injuryTime: boolean;
    type: FixtureCommentaryType;
    text: string;
}

// Stream Link
export interface AddStreamLinkDto {
    platform: string;
    url: string;
    isOfficial: boolean;
    requiresSubscription: boolean;
}

// Lineup Update
export interface UpdateTeamLineupDto {
    team: FixtureTeamType;
    startingXI: string[];
    substitutes: string[];
    formation: string;
    coach: string;
}

// Player of the Match
export interface OfficialPOTMDto {
    player?: string;
    temporaryPlayerName?: string;
}

// Score Update
export interface UpdateScoreDto {
    homeScore: number;
    awayScore: number;
    halftimeHomeScore?: number;
    halftimeAwayScore?: number;
    homePenalty?: number;
    awayPenalty?: number;
}

// Create Live Fixture
export interface CreateLiveFixtureDto {
    fixture: string;
    kickoffTime: Date;
}

// Update Live Fixture Status
export interface UpdateLiveFixtureStatusDto {
    status?: LiveStatus;
    currentMinute: number;
    injuryTime: number;
}

// Update Score
export interface UpdateScoreDto {
    homeScore: number;
    awayScore: number;
    halftimeHomeScore?: number;
    halftimeAwayScore?: number;
    homePenalty?: number;
    awayPenalty?: number;
}

// Goal Scorer
export interface AddScorerDto {
    player?: string;
    temporaryPlayerName?: string;
    team?: string;
    temporaryTeamName?: string;
    time: number;
    assist?: string;
    temporaryAssistName?: string;
    goalType: FixtureTimelineGoalType;
}

// Timeline Event
export interface AddTimelineEventDto {
    type: FixtureTimelineType;
    team: FixtureTeamType;
    player?: string;
    temporaryPlayerName?: string;
    relatedPlayer?: string;
    temporaryRelatedPlayerName?: string;
    minute: number;
    injuryTime: boolean;
    description: string;
    goalType?: FixtureTimelineGoalType;
    cardType?: FixtureTimelineCardType;
}

// Substitution Event
export interface AddSubEventDto {
    team: FixtureTeamType;
    playerOut?: string;
    playerIn?: string;
    temporaryPlayerOutName?: string;
    temporaryPlayerInName?: string;
    minute: number;
    injury: boolean;
}

// Commentary
export interface AddCommentaryDto {
    minute: number;
    injuryTime: boolean;
    type: FixtureCommentaryType;
    text: string;
}

// Team Statistics Update
export interface UpdateTeamStatDto {
    team: FixtureTeamType;
    statistics: {
        shotsOnTarget: number;
        shotsOffTarget: number;
        foul: number;
        yellowCards: number;
        redCards: number;
        offsides: number;
        corners: number;
        possessionTime: number;
    };
}

// Stream Link
export interface AddStreamLinkDto {
    platform: string;
    url: string;
    isOfficial: boolean;
    requiresSubscription: boolean;
}

// Team Lineup Update
export interface UpdateTeamLineupDto {
    team: FixtureTeamType;
    startingXI: string[];
    substitutes: string[];
    formation: string;
    coach: string;
}

// Official Player of the Match
export interface SetOfficialPOTMDto {
    player?: string;
    temporaryPlayerName?: string;
}

// Cheer Team
export interface CheerTeamDto {
    team: FixtureTeamType;
}

// Fan Vote for POTM
export interface FanVoteDto {
    playerId?: string;
    temporaryPlayerName?: string;
}

// Create Fixture Player Stats
export interface CreateFixturePlayerStatDto {
    players: Array<{
        player: string | null;
        isTemporary: boolean;
        temporaryPlayerName: string | null;
        team: string | null;
        temporaryTeamName: string | null;
        position: PlayerPosition;
        shirtNumber: number | null;
        starter: boolean;
        isCaptain: boolean;
    }>;
}

// Update Player Stat
export interface UpdatePlayerStatDto {
    minutesPlayed?: number;
    onPitch?: boolean;
    offensiveMetrics?: {
        goals: number;
        assists: number;
        shots: number;
        shotsOnTarget: number;
        shotsOffTarget: number;
        shotsBlocked: number;
    };
    passingMetrics?: {
        passes: number;
        passesCompleted: number;
        keyPasses: number;
        crosses: number;
        crossesCompleted: number;
    };
    defensiveMetrics?: {
        tackles: number;
        tacklesWon: number;
        interceptions: number;
        clearances: number;
        blockedShots: number;
    };
    duelMetrics?: {
        duels: number;
        duelsWon: number;
        aerialDuels: number;
        aerialDuelsWon: number;
    };
    disciplineMetrics?: {
        foulsCommitted: number;
        foulsDrawn: number;
        yellowCards: number;
        redCards: number;
        offsides: number;
    };
    keeperMetrics?: {
        saves: number | null;
        penaltySaves: number | null;
        goalsConceded: number | null;
        cleanSheet: boolean | null;
    };
    dribblingMetrics?: {
        dribbles: number;
        dribblesSuccessful: number;
        dispossessed: number;
        ballRecoveries: number;
    };
    advancedMetrics?: {
        touchesInBox: number;
        bigChancesCreated: number;
        bigChancesMissed: number;
    };
}

// Player Rating
export interface PlayerRatingDto {
    rating: number; // 1-10
}

// Bulk Update Stats
export interface BulkUpdateStatsDto {
    stats: Array<{
        statId: string;
        dto: UpdatePlayerStatDto;
    }>;
}