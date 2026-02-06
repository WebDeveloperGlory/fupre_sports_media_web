import { apiClient } from "@/lib/config/client";
import {
    CreateFixtureDto,
    UpdateFixtureDto,
    UpdateFixtureStatisticsDto,
    SearchFixturesDto,
    FixturesByDateDto,
    FixturesByTeamDto,
    AddGoalScorerDto,
    AddTimelineDto,
    AddSubstitutionDto,
    AddCommentaryDto,
    AddStreamLinkDto,
    UpdateTeamLineupDto,
    OfficialPOTMDto,
    UpdateScoreDto
} from "@/lib/types/v1.payload.types";
import { FixtureResponse, LiveFixtureResponse } from "@/lib/types/v1.response.types";

export const footballFixtureApi = {
    // Basic CRUD Operations
    getAll: (page: number = 1, limit: number = 10) =>
        apiClient.getPaginated<FixtureResponse>(
            `/v1/football/fixture?page=${page}&limit=${limit}`
        ),

    getById: (id: string) =>
        apiClient.get<FixtureResponse>(`/v1/football/fixture/${id}`),

    create: (payload: CreateFixtureDto) =>
        apiClient.post<FixtureResponse, CreateFixtureDto>(
            "/v1/football/fixture",
            payload
        ),

    update: (id: string, payload: UpdateFixtureDto) =>
        apiClient.put<FixtureResponse, UpdateFixtureDto>(
            `/v1/football/fixture/${id}`,
            payload
        ),

    delete: (id: string) =>
        apiClient.delete<void>(`/v1/football/fixture/${id}`),

    // Search and Filter Operations
    search: (payload: SearchFixturesDto) => {
        const params = new URLSearchParams();

        if (payload.team) params.append('team', payload.team);
        if (payload.competition) params.append('competition', payload.competition);
        if (payload.dateFrom) params.append('dateFrom', payload.dateFrom.toISOString());
        if (payload.dateTo) params.append('dateTo', payload.dateTo.toISOString());
        if (payload.status) params.append('status', payload.status);
        if (payload.page) params.append('page', payload.page.toString());
        if (payload.limit) params.append('limit', payload.limit.toString());

        return apiClient.getPaginated<FixtureResponse>(
            `/v1/football/fixture/search?${params.toString()}`
        );
    },

    getByDate: (payload: FixturesByDateDto) => {
        const params = new URLSearchParams();
        params.append('date', payload.date.toISOString());
        if (payload.competition) params.append('competition', payload.competition);
        if (payload.page) params.append('page', payload.page.toString());
        if (payload.limit) params.append('limit', payload.limit.toString());

        return apiClient.getPaginated<FixtureResponse>(
            `/v1/football/fixture/date?${params.toString()}`
        );
    },

    getByTeam: (payload: FixturesByTeamDto) => {
        const params = new URLSearchParams();
        params.append('team', payload.team);
        if (payload.competition) params.append('competition', payload.competition);
        if (payload.page) params.append('page', payload.page.toString());
        if (payload.limit) params.append('limit', payload.limit.toString());

        return apiClient.getPaginated<FixtureResponse>(
            `/v1/football/fixture/team?${params.toString()}`
        );
    },

    // Special Queries
    getUpcoming: (page: number = 1, limit: number = 10) =>
        apiClient.getPaginated<FixtureResponse>(
            `/v1/football/fixture/upcoming?page=${page}&limit=${limit}`
        ),

    getLive: () =>
        apiClient.get<LiveFixtureResponse[]>("/v1/football/fixture/live"),

    getRecentResults: (page: number = 1, limit: number = 10) =>
        apiClient.getPaginated<FixtureResponse>(
            `/v1/football/fixture/results?page=${page}&limit=${limit}`
        ),

    // Statistics Operations
    updateStatistics: (id: string, payload: UpdateFixtureStatisticsDto) =>
        apiClient.put<FixtureResponse, UpdateFixtureStatisticsDto>(
            `/v1/football/fixture/${id}/statistics`,
            payload
        ),

    // Match Events Operations (these would typically be in a more detailed controller)
    addGoalScorer: (fixtureId: string, payload: AddGoalScorerDto) =>
        apiClient.post<FixtureResponse, AddGoalScorerDto>(
            `/v1/football/fixture/${fixtureId}/goals`,
            payload
        ),

    addTimeline: (fixtureId: string, payload: AddTimelineDto) =>
        apiClient.post<FixtureResponse, AddTimelineDto>(
            `/v1/football/fixture/${fixtureId}/timeline`,
            payload
        ),

    addSubstitution: (fixtureId: string, payload: AddSubstitutionDto) =>
        apiClient.post<FixtureResponse, AddSubstitutionDto>(
            `/v1/football/fixture/${fixtureId}/substitutions`,
            payload
        ),

    addCommentary: (fixtureId: string, payload: AddCommentaryDto) =>
        apiClient.post<FixtureResponse, AddCommentaryDto>(
            `/v1/football/fixture/${fixtureId}/commentary`,
            payload
        ),

    addStreamLink: (fixtureId: string, payload: AddStreamLinkDto) =>
        apiClient.post<FixtureResponse, AddStreamLinkDto>(
            `/v1/football/fixture/${fixtureId}/streams`,
            payload
        ),

    updateLineup: (fixtureId: string, payload: UpdateTeamLineupDto) =>
        apiClient.put<FixtureResponse, UpdateTeamLineupDto>(
            `/v1/football/fixture/${fixtureId}/lineup`,
            payload
        ),

    setOfficialPOTM: (fixtureId: string, payload: OfficialPOTMDto) =>
        apiClient.post<FixtureResponse, OfficialPOTMDto>(
            `/v1/football/fixture/${fixtureId}/potm/official`,
            payload
        ),

    updateScore: (fixtureId: string, payload: UpdateScoreDto) =>
        apiClient.put<FixtureResponse, UpdateScoreDto>(
            `/v1/football/fixture/${fixtureId}/score`,
            payload
        ),

    // File Upload (for highlights, etc.)
    uploadHighlight: (fixtureId: string, file: File) => {
        const formData = new FormData();
        formData.append("video", file);
        return apiClient.post<FixtureResponse, FormData>(
            `/v1/football/fixture/${fixtureId}/highlights`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },
};

// Helper function for date queries
export const formatDateForAPI = (date: Date): string => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};