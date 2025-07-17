import { CompetitionSponsors, CompetitionStatus, CompetitionTypes, FavoriteFoot, FixtureStatus, FixtureTimelineCardType, FixtureTimelineGoalType, FixtureTimelineType, LiveStatus, PlayerClubStatus, PlayerRole, TeamType } from "./v2requestData.enums"
import { FixtureLineup, FixtureLineupUnPop, FixtureStat, FixtureStreamLinks } from "./v2requestSubData.types";

export type FixtureTimeline = {
    _id?: string,
    type: FixtureTimelineType,
    team: TeamType,
    player: string,
    relatedPlayer?: string,
    minute: number,
    injuryTime?: boolean,
    description: string,
    goalType?: FixtureTimelineGoalType,
    cardType?: FixtureTimelineCardType
}

// Competition Admin //

// Create competition
export type CompFormRegisterCometition = {
    name: string;
    shorthand: string;
    type: CompetitionTypes; 
    season: string;
    startDate: Date;
    endDate: Date;
    registrationDeadline?: Date;
    description: string;
}
// Update competition status
export type CompFormStatus = { status: CompetitionStatus }
// Update competition info
export type CompFormInfo = {
    name?: string;
    shorthand?: string;
    season?: string;
    startDate?: Date;
    endDate?: Date;
    prizeMoney?: {
        champion: number,
        runnerUp: number,
    };
    substitutions?: {
        allowed: boolean;
        maximum: number;
    },
    extraTime?: boolean;
    penalties?: boolean;
    matchDuration?: {
        normal: number;
        extraTime: number;
    },
    squadSize?: {
        min: number;
        max: number;
    },
}
// Create competition fixture
export type CompFormFixture = {
    homeTeam: string;
    awayTeam: string;
    stadium: string;
    scheduledDate: Date;
    referee: string;
    isDerby?: boolean;
    isKnockoutRound?: boolean;
    isGroupFixture?: boolean;
    knockoutId?: string;
    groupId?: string;
}
// Update fixture
export type CompFormUpdateFixture = {
    fixtureId: string;
    scheduledDate?: Date;
    status?: FixtureStatus;
    postponedReason?: string;
    rescheduledDate?: Date;
}
// Register team
export type CompFormTeam = { teamId: string }
// Register team squad
export type CompFormSquadList = {
    player: string, // playerID
    jerseyNumber: number,
    isCaptain: boolean,
    position: string
}[];
// Set competition as active
export type CompFormActiveStatus = { isActive: boolean }
// Add player award
export type CompFormPlayerAward = { name: string }
// Add team award
export type CompFormTeamAward = { name: string }
// Set admin of competition
export type CompFormSetAdmin = { admin: string } // adminID
// Add competition sponsors
export type CompFormAddSponsor = { name: string, logo?: string, tier: CompetitionSponsors }
// Add rule
export type CompFormAddRule = { title: string, description: string }
// Update competition format
export type CompFormFormat = {
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
}

// End of Competition Admin //

// Live Fixtures Admin //

// Update live fixture status
export type LiveFixStatusForm = { status: LiveStatus };
// Update stats
export type LiveFixStatForm = { stats: { home: FixtureStat, away: FixtureStat } };
// Update lineups
export type LiveFixLineupForm = { lineups: { home: FixtureLineupUnPop, away: FixtureLineupUnPop } };
// Create timeline event
export type LiveFixTimelineCreate = { event: FixtureTimeline }
// Edit timeline event
export type LiveFixTimelineEdit = {
    eventId: string; // Id used to know which to edit
    type?: FixtureTimelineType;
    team?: TeamType;
    player?: string;
    relatedPlayer?: string; // assists
    minute?: number;
    injuryTime?: boolean;
    description?: string;
    goalType?: FixtureTimelineGoalType;
    cardType?: FixtureTimelineCardType;
}
// Add substitution
export type LiveFixSubCreate = {
    team: TeamType;
    playerOutId: string;
    playerInId: string;
    minute: number;
    injuryTime?: boolean;
    injury: boolean;
};
// Edit substitution
export type LiveFixSubEdit = { substitutionId: string; updates: Partial<LiveFixSubCreate> }
// Update score
export type LiveFixScore = {
    homeScore?: number;
    awayScore?: number;
    isHalftime?: boolean;
    homePenalty?: number | null, 
    awayPenalty?: number | null;
};
// Add goal scorer
export type LivFixGoalScorer = {
    playerId: string;
    teamId: string;
    time: number;
    goalType?: FixtureTimelineGoalType;
};
// Update official potm
export type LivFixPOTMOfficial = { playerId: string }
// Update official player ratings
export type LivFixPlayerRatingOfficial = {
    playerId: string;
    isHomePlayer: boolean;
    rating: number; // 0-10
    stats?: {
        goals?: number;
        assists?: number;
        shots?: number;
        passes?: number;
        tackles?: number;
        saves?: number;
    };
}[];
// Perform genera updates
export type LivFixGeneralUpdates = { 
    weather?: { condition: string, temperature: number, humidity: number },
    attendance?: number,
    referee?: string,
    kickoff?: Date | string,
    stream?: FixtureStreamLinks
}
// Perform time updates
export type LivFixTimeUpdates = { regularTime: number, injuryTime?: number }
// Submit user player rating
export type UserPlayerRating = {
    playerId: string;
    isHomePlayer: boolean;
    rating: number; // 1-10
}
// Submit team cheer
export type Cheer = { team: TeamType, isOfficial: boolean }

// End of Live Fixtures Admin //

// Team Admin //

// Register player(super-admin)
export type PlayerCreateFormDetails = {
    name: string;
    department: string;
    admissionYear: string;
    preferredFoot?: FavoriteFoot;
    height?: string;
    weight?: string;
}
// Register player(team-admin)
export type UnverifiedPlayerReg = { name: string; department: string; admissionYear: string };
// Update player details
export type PlayerUpdateDetails = {
    name?: string;
    admissionYear?: string;
    preferredFoot?: FavoriteFoot;
    height?: string;
    weight?: string;
    clubStatus?: PlayerClubStatus;
    marketValue?: number;
}
// Assign player to team
export type TeamAssignmentDetails = {
    teamId: string;
    role?: PlayerRole;
    position?: string;
    jerseyNumber?: number;
}
// Verify player
export type PlayerVerificationDetails = {
    status: 'verified' | 'rejected';
    reason?: string;
}

// End of Team Admin //