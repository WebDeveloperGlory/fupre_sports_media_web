import { CompetitionSponsors, CompetitionStatus, CompetitionTypes, FixtureStatus } from "./v2requestData.enums"

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