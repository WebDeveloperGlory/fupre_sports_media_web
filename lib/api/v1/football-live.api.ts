// src/lib/api/football-live.api.ts
import { apiClient } from "@/lib/config/client";
import {
    CreateLiveFixtureDto,
    UpdateLiveFixtureStatusDto,
    UpdateScoreDto,
    AddScorerDto,
    AddTimelineEventDto,
    AddSubEventDto,
    AddCommentaryDto,
    AddStreamLinkDto,
    UpdateTeamLineupDto,
    SetOfficialPOTMDto,
    CheerTeamDto,
    UpdateTeamStatDto,
    FanVoteDto
} from "@/lib/types/v1.payload.types";
import {
    LiveFixtureResponse,
    VoteDistributionResponse,
    POTMWinnerResponse,
    POTMResultsResponse,
    UserVoteResponse,
    UserVotingHistoryResponse

} from "@/lib/types/v1.response.types";
import { LiveStatus } from "@/types/v1.football-live.types";

export const footballLiveApi = {
    // Basic Live Fixture CRUD Operations
    getAll: (page: number = 1, limit: number = 10) =>
        apiClient.getPaginated<LiveFixtureResponse>(
            `/v1/football/live-fixture?page=${page}&limit=${limit}`
        ),

    getById: (id: string) =>
        apiClient.get<LiveFixtureResponse>(`/v1/football/live-fixture/${id}`),

    create: (payload: CreateLiveFixtureDto) =>
        apiClient.post<LiveFixtureResponse, CreateLiveFixtureDto>(
            "/v1/football/live-fixture",
            payload
        ),

    delete: (id: string) =>
        apiClient.delete<void>(`/v1/football/live-fixture/${id}`),

    // Live Fixture Status and Control
    updateStatus: (id: string, payload: UpdateLiveFixtureStatusDto) =>
        apiClient.put<LiveFixtureResponse, UpdateLiveFixtureStatusDto>(
            `/v1/football/live-fixture/${id}/status`,
            payload
        ),

    updateScore: (id: string, payload: UpdateScoreDto) =>
        apiClient.put<LiveFixtureResponse, UpdateScoreDto>(
            `/v1/football/live-fixture/${id}/score`,
            payload
        ),

    endFixture: (id: string) =>
        apiClient.post<LiveFixtureResponse, void>(
            `/v1/football/live-fixture/${id}/end`,
            undefined
        ),

    // Match Events
    addGoalScorer: (id: string, payload: AddScorerDto) =>
        apiClient.post<LiveFixtureResponse, AddScorerDto>(
            `/v1/football/live-fixture/${id}/goal`,
            payload
        ),

    deleteGoalScorer: (id: string, scorerID: string) =>
        apiClient.delete<LiveFixtureResponse>(
            `/v1/football/live-fixture/${id}/goal/${scorerID}`
        ),

    addTimelineEvent: (id: string, payload: AddTimelineEventDto) =>
        apiClient.post<LiveFixtureResponse, AddTimelineEventDto>(
            `/v1/football/live-fixture/${id}/timeline`,
            payload
        ),

    deleteTimelineEvent: (id: string, timelineID: string) =>
        apiClient.delete<LiveFixtureResponse>(
            `/v1/football/live-fixture/${id}/timeline/${timelineID}`
        ),

    addSubstitution: (id: string, payload: AddSubEventDto) =>
        apiClient.post<LiveFixtureResponse, AddSubEventDto>(
            `/v1/football/live-fixture/${id}/substitution`,
            payload
        ),

    deleteSubstitution: (id: string, subID: string) =>
        apiClient.delete<LiveFixtureResponse>(
            `/v1/football/live-fixture/${id}/substitution/${subID}`
        ),

    addCommentary: (id: string, payload: AddCommentaryDto) =>
        apiClient.post<LiveFixtureResponse, AddCommentaryDto>(
            `/v1/football/live-fixture/${id}/commentary`,
            payload
        ),

    deleteCommentary: (id: string, commentaryID: string) =>
        apiClient.delete<LiveFixtureResponse>(
            `/v1/football/live-fixture/${id}/commentary/${commentaryID}`
        ),

    // Statistics and Lineups
    updateStatistics: (id: string, payload: UpdateTeamStatDto) =>
        apiClient.put<LiveFixtureResponse, UpdateTeamStatDto>(
            `/v1/football/live-fixture/${id}/statistics`,
            payload
        ),

    setTeamLineup: (id: string, payload: UpdateTeamLineupDto) =>
        apiClient.put<LiveFixtureResponse, UpdateTeamLineupDto>(
            `/v1/football/live-fixture/${id}/lineup`,
            payload
        ),

    // Streaming and Media
    addStreamLink: (id: string, payload: AddStreamLinkDto) =>
        apiClient.post<LiveFixtureResponse, AddStreamLinkDto>(
            `/v1/football/live-fixture/${id}/stream`,
            payload
        ),

    // Player of the Match
    setOfficialPOTM: (id: string, payload: SetOfficialPOTMDto) =>
        apiClient.put<LiveFixtureResponse, SetOfficialPOTMDto>(
            `/v1/football/live-fixture/${id}/potm`,
            payload
        ),

    cheerTeam: (id: string, payload: CheerTeamDto) =>
        apiClient.post<LiveFixtureResponse, CheerTeamDto>(
            `/v1/football/live-fixture/${id}/cheer`,
            payload
        ),

    // Special Queries
    getActive: () =>
        apiClient.get<LiveFixtureResponse[]>("/v1/football/live-fixture/active"),

    getByStatus: (status: LiveStatus) =>
        apiClient.get<LiveFixtureResponse[]>(
            `/v1/football/live-fixture/status?status=${status}`
        ),

    getByFixture: (fixtureId: string) =>
        apiClient.get<LiveFixtureResponse>(
            `/v1/football/live-fixture/fixture/${fixtureId}`
        ),

    // Player of the Match Voting
    voteForPOTM: (liveFixtureId: string, payload: FanVoteDto) =>
        apiClient.post<void, FanVoteDto>(
            `/v1/football/potm-vote/${liveFixtureId}/vote`,
            payload
        ),

    getUserVote: (liveFixtureId: string) =>
        apiClient.get<UserVoteResponse>(
            `/v1/football/potm-vote/${liveFixtureId}/my-vote`
        ),

    removeVote: (liveFixtureId: string) =>
        apiClient.delete<void>(`/v1/football/potm-vote/${liveFixtureId}/vote`),

    getVoteDistribution: (liveFixtureId: string) =>
        apiClient.get<VoteDistributionResponse[]>(
            `/v1/football/potm-vote/${liveFixtureId}/distribution`
        ),

    getWinningFanPOTM: (liveFixtureId: string) =>
        apiClient.get<POTMWinnerResponse>(
            `/v1/football/potm-vote/${liveFixtureId}/winner`
        ),

    getFixturePOTMResults: (fixtureId: string) =>
        apiClient.get<POTMResultsResponse>(
            `/v1/football/potm-vote/fixture/${fixtureId}/results`
        ),

    getUserVotingHistory: () =>
        apiClient.get<UserVotingHistoryResponse[]>(
            "/v1/football/potm-vote/history"
        ),
};

// Helper functions for live fixture management
export const liveFixtureHelpers = {
    // Check if match is currently active
    isMatchActive: (status: LiveStatus): boolean => {
        const activeStatuses = [
            LiveStatus.FIRSTHALF,
            LiveStatus.HALFTIME,
            LiveStatus.SECONDHALF,
            LiveStatus.EXTRATIME,
            LiveStatus.PENALTIES
        ];
        return activeStatuses.includes(status);
    },

    // Get match phase description
    getMatchPhase: (status: LiveStatus, minute: number): string => {
        switch (status) {
            case LiveStatus.PREMATCH:
                return "Pre-match";
            case LiveStatus.FIRSTHALF:
                return `1st Half - ${minute}'`;
            case LiveStatus.HALFTIME:
                return "Half-time";
            case LiveStatus.SECONDHALF:
                return `2nd Half - ${minute - 45}'`;
            case LiveStatus.EXTRATIME:
                return `Extra Time - ${minute - 90}'`;
            case LiveStatus.PENALTIES:
                return "Penalties";
            case LiveStatus.FINISHED:
                return "Full Time";
            case LiveStatus.POSTPONED:
                return "Postponed";
            case LiveStatus.ABANDONED:
                return "Abandoned";
            default:
                return "Unknown";
        }
    },

    // Calculate match progress percentage
    getMatchProgress: (status: LiveStatus, minute: number): number => {
        switch (status) {
            case LiveStatus.PREMATCH:
                return 0;
            case LiveStatus.FIRSTHALF:
                return Math.min((minute / 45) * 50, 50);
            case LiveStatus.HALFTIME:
                return 50;
            case LiveStatus.SECONDHALF:
                return 50 + Math.min(((minute - 45) / 45) * 40, 40);
            case LiveStatus.EXTRATIME:
                return 90 + Math.min(((minute - 90) / 30) * 5, 5);
            case LiveStatus.PENALTIES:
                return 95;
            case LiveStatus.FINISHED:
                return 100;
            default:
                return 0;
        }
    },

    // Format score for display
    formatScore: (result: {
        homeScore: number;
        awayScore: number;
        homePenalty?: number | null;
        awayPenalty?: number | null;
    }): string => {
        const baseScore = `${result.homeScore} - ${result.awayScore}`;
        if (result.homePenalty !== null && result.awayPenalty !== null) {
            return `${baseScore} (${result.homePenalty}-${result.awayPenalty} pens)`;
        }
        return baseScore;
    }
};