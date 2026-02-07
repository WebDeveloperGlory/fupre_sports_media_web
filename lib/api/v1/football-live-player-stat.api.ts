import { apiClient } from "@/lib/config/client";
import {
    CreateFixturePlayerStatDto,
    UpdatePlayerStatDto,
    PlayerRatingDto,
    BulkUpdateStatsDto
} from "@/lib/types/v1.payload.types";
import { BulkUpdateStatsResponse, FixturePlayerStatResponse } from "@/lib/types/v1.response.types";

export const footballPlayerStatApi = {
    // Create player stats for a fixture
    createFixtureStats: (fixtureId: string, payload: CreateFixturePlayerStatDto) =>
        apiClient.post<FixturePlayerStatResponse[], CreateFixturePlayerStatDto>(
            `/v1/football/player-stat/fixture/${fixtureId}`,
            payload
        ),

    // Get player stats for a fixture
    getFixtureStats: (fixtureId: string) =>
        apiClient.get<FixturePlayerStatResponse[]>(
            `/v1/football/player-stat/fixture/${fixtureId}`
        ),

    // Get player's stats history
    getPlayerStatsHistory: (playerId: string) =>
        apiClient.get<FixturePlayerStatResponse[]>(
            `/v1/football/player-stat/player/${playerId}`
        ),

    // Update individual player stat
    update: (statId: string, payload: UpdatePlayerStatDto) =>
        apiClient.put<FixturePlayerStatResponse, UpdatePlayerStatDto>(
            `/v1/football/player-stat/${statId}`,
            payload
        ),

    // Bulk update player stats
    bulkUpdate: (payload: BulkUpdateStatsDto) =>
        apiClient.post<BulkUpdateStatsResponse, BulkUpdateStatsDto>(
            "/v1/football/player-stat/bulk-update",
            payload
        ),

    // Add official rating
    addOfficialRating: (statId: string, payload: PlayerRatingDto) =>
        apiClient.put<FixturePlayerStatResponse, PlayerRatingDto>(
            `/v1/football/player-stat/${statId}/official-rating`,
            payload
        ),

    // Add fan rating
    addFanRating: (statId: string, payload: PlayerRatingDto) =>
        apiClient.put<FixturePlayerStatResponse, PlayerRatingDto>(
            `/v1/football/player-stat/${statId}/fan-rating`,
            payload
        ),
};

// Helper functions for player stats
export const playerStatHelpers = {
    // Calculate player's overall rating
    calculateOverallRating: (stat: FixturePlayerStatResponse): number => {
        const weights = {
            offensive: 0.3,
            defensive: 0.25,
            passing: 0.2,
            discipline: 0.1,
            duels: 0.1,
            dribbling: 0.05
        };

        let rating = 0;
        let totalWeight = 0;

        // Offensive rating (goals, assists, shots on target)
        if (stat.offensiveMetrics) {
            const offensiveRating = (
                stat.offensiveMetrics.goals * 10 +
                stat.offensiveMetrics.assists * 5 +
                stat.offensiveMetrics.shotsOnTarget * 2 +
                stat.offensiveMetrics.shots
            ) / 20;
            rating += offensiveRating * weights.offensive;
            totalWeight += weights.offensive;
        }

        // Passing rating
        if (stat.passingMetrics) {
            const completionRate = stat.passingMetrics.passes > 0
                ? (stat.passingMetrics.passesCompleted / stat.passingMetrics.passes) * 100
                : 0;
            const passingRating = (completionRate / 10) + (stat.passingMetrics.keyPasses * 2);
            rating += passingRating * weights.passing;
            totalWeight += weights.passing;
        }

        // Use official rating if available
        if (stat.officialRating) {
            return Math.min(stat.officialRating.rating, 10);
        }

        // Use fan rating if available and no official rating
        if (stat.fanRating && stat.fanRating.count > 0) {
            return stat.fanRating.average;
        }

        // Calculate from stats if no ratings available
        return totalWeight > 0 ? Math.min(rating / totalWeight, 10) : 6.0;
    },

    // Get player's performance summary
    getPerformanceSummary: (stat: FixturePlayerStatResponse): string => {
        const metrics = [];

        if (stat.offensiveMetrics.goals > 0) {
            metrics.push(`${stat.offensiveMetrics.goals} goal${stat.offensiveMetrics.goals > 1 ? 's' : ''}`);
        }
        if (stat.offensiveMetrics.assists > 0) {
            metrics.push(`${stat.offensiveMetrics.assists} assist${stat.offensiveMetrics.assists > 1 ? 's' : ''}`);
        }
        if (stat.passingMetrics.keyPasses > 0) {
            metrics.push(`${stat.passingMetrics.keyPasses} key pass${stat.passingMetrics.keyPasses > 1 ? 'es' : ''}`);
        }
        if (stat.defensiveMetrics.tackles > 0) {
            metrics.push(`${stat.defensiveMetrics.tackles} tackle${stat.defensiveMetrics.tackles > 1 ? 's' : ''}`);
        }

        if (metrics.length === 0) {
            return "Solid performance";
        }

        return metrics.join(", ");
    },

    // Calculate player's match impact score (0-100)
    calculateMatchImpact: (stat: FixturePlayerStatResponse): number => {
        let impact = 50; // Base impact

        // Offensive impact
        impact += stat.offensiveMetrics.goals * 15;
        impact += stat.offensiveMetrics.assists * 10;
        impact += stat.offensiveMetrics.shotsOnTarget * 3;
        impact += stat.offensiveMetrics.shotsBlocked * 2;

        // Defensive impact
        impact += stat.defensiveMetrics.tacklesWon * 3;
        impact += stat.defensiveMetrics.interceptions * 2;
        impact += stat.defensiveMetrics.clearances * 1;
        impact += stat.defensiveMetrics.blockedShots * 4;

        // Passing impact
        if (stat.passingMetrics.passes > 0) {
            const completionRate = (stat.passingMetrics.passesCompleted / stat.passingMetrics.passes) * 100;
            impact += completionRate * 0.2;
        }
        impact += stat.passingMetrics.keyPasses * 5;

        // Discipline impact (negative)
        impact -= stat.disciplineMetrics.yellowCards * 5;
        impact -= stat.disciplineMetrics.redCards * 20;
        impact -= stat.disciplineMetrics.foulsCommitted * 0.5;

        // Minutes played impact
        const minutesImpact = (stat.minutesPlayed / 90) * 10;
        impact += minutesImpact;

        // Goalkeeper specific impact
        if (stat.position === 'gk' && stat.keeperMetrics) {
            if (stat.keeperMetrics.saves) impact += stat.keeperMetrics.saves * 3;
            if (stat.keeperMetrics.penaltySaves) impact += stat.keeperMetrics.penaltySaves * 10;
            if (stat.keeperMetrics.cleanSheet) impact += 10;
            if (stat.keeperMetrics.goalsConceded) impact -= stat.keeperMetrics.goalsConceded * 5;
        }

        return Math.max(0, Math.min(100, impact));
    }
};