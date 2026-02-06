import { PlayerPosition } from "./v1.football-player.types";

export interface FixturePlayerStatProps {
    id?: string;
    fixture: string;
    liveFixture: string | null;
    player: string | null;
    team: string | null;
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
    createdAt?: Date;
    updatedAt?: Date;
}

export type OfficialRating = {
    rating: number;
    ratedBy: string;
}

export type FanRating = {
    average: number;
    count: number;
    distribution: {
        '1': number;
        '2': number;
        '3': number;
        '4': number;
        '5': number;
        '6': number;
        '7': number;
        '8': number;
        '9': number;
        '10': number;
    };
}

export type OffensiveMetrics = {
    goals: number;
    assists: number;
    shots: number;
    shotsOnTarget: number;
    shotsOffTarget: number;
    shotsBlocked: number;
}

export type PassingMetrics = {
    passes: number;
    passesCompleted: number;
    keyPasses: number;
    crosses: number;
    crossesCompleted: number;
}

export type DefensiveMetrics = {
    tackles: number;
    tacklesWon: number;
    interceptions: number;
    clearances: number;
    blockedShots: number;
}

export type DuelMetrics = {
    duels: number;
    duelsWon: number;
    aerialDuels: number;
    aerialDuelsWon: number;
}

export type DisciplineMetrics = {
    foulsCommitted: number;
    foulsDrawn: number;
    yellowCards: number;
    redCards: number;
    offsides: number;
}

export type KeeperMetrics = {
    saves: number | null;
    penaltySaves: number | null;
    goalsConceded: number | null;
    cleanSheet: boolean | null;
}

export type DribblingMetrics = {
    dribbles: number;
    dribblesSuccessful: number;
    dispossessed: number;
    ballRecoveries: number;
}

export type AdvancedMetrics = {
    touchesInBox: number;
    bigChancesCreated: number;
    bigChancesMissed: number;
}