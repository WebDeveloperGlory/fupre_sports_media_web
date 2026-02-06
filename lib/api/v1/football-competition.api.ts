import { apiClient } from "@/lib/config/client";
import {
    CreateCompetitionDto,
    UpdateCompetitionDto,
    TeamRegistrationDto,
    AddTeamDto,
    RemoveTeamDto,
    ExtraRuleDto,
    SponsorDto,
    StageUpdateDto,
    FeaturedUpdateDto,
    SponsorRemovalDto,
    RuleRemovalDto,
    KnockoutRoundDto,
    KnockoutRoundCompletionDto,
    GroupTableDto,
    LeagueStandingUpdateDto,
    LeagueTableUpdateDto,
    GroupStageUpdateDto,

} from "@/lib/types/v1.payload.types";
import { CompetitionResponse, CompetitionStatsResponse, FixturesResponse, QualificationsResponse } from "@/lib/types/v1.response.types";

export const footballCompetitionApi = {
    getAll: (page: number = 1, limit: number = 10) =>
        apiClient.getPaginated<CompetitionResponse>(
            `/v1/football/competition?page=${page}&limit=${limit}`
        ),
    getById: (id: string) =>
        apiClient.get<CompetitionResponse>(`/v1/football/competition/${id}`),
    create: (payload: CreateCompetitionDto) =>
        apiClient.post<CompetitionResponse, CreateCompetitionDto>(
            "/v1/football/competition",
            payload
        ),
    update: (id: string, payload: UpdateCompetitionDto) =>
        apiClient.put<CompetitionResponse, UpdateCompetitionDto>(
            `/v1/football/competition/${id}`,
            payload
        ),
    delete: (id: string) =>
        apiClient.delete<void>(`/v1/football/competition/${id}`),

    addTeam: (id: string, payload: AddTeamDto) =>
        apiClient.post<CompetitionResponse, AddTeamDto>(
            `/v1/football/competition/${id}/teams`,
            payload
        ),
    removeTeam: (id: string, payload: RemoveTeamDto) =>
        apiClient.delete<CompetitionResponse>(
            `/v1/football/competition/${id}/teams`,
            { data: payload }
        ),
    registerTeam: (id: string, payload: TeamRegistrationDto) =>
        apiClient.post<CompetitionResponse, TeamRegistrationDto>(
            `/v1/football/competition/${id}/teams/register`,
            payload
        ),

    activate: (id: string) =>
        apiClient.post<CompetitionResponse, void>(
            `/v1/football/competition/${id}/activate`,
            undefined
        ),
    complete: (id: string) =>
        apiClient.post<CompetitionResponse, void>(
            `/v1/football/competition/${id}/complete`,
            undefined
        ),
    cancel: (id: string) =>
        apiClient.post<CompetitionResponse, void>(
            `/v1/football/competition/${id}/cancel`,
            undefined
        ),
    advanceMatchWeek: (id: string) =>
        apiClient.post<CompetitionResponse, void>(
            `/v1/football/competition/${id}/match-week/advance`,
            undefined
        ),
    setStage: (id: string, payload: StageUpdateDto) =>
        apiClient.put<CompetitionResponse, StageUpdateDto>(
            `/v1/football/competition/${id}/stage`,
            payload
        ),

    updateLeagueTable: (id: string, payload: LeagueTableUpdateDto) =>
        apiClient.put<CompetitionResponse, LeagueTableUpdateDto>(
            `/v1/football/competition/${id}/league-table`,
            payload
        ),
    updateStanding: (id: string, payload: LeagueStandingUpdateDto) =>
        apiClient.put<CompetitionResponse, LeagueStandingUpdateDto>(
            `/v1/football/competition/${id}/standings`,
            payload
        ),
    recalculateLeagueTable: (id: string) =>
        apiClient.post<CompetitionResponse, void>(
            `/v1/football/competition/${id}/league-table/recalculate`,
            undefined
        ),

    addKnockoutRound: (id: string, payload: KnockoutRoundDto) =>
        apiClient.post<CompetitionResponse, KnockoutRoundDto>(
            `/v1/football/competition/${id}/knockout-rounds`,
            payload
        ),
    completeKnockoutRound: (id: string, payload: KnockoutRoundCompletionDto) =>
        apiClient.post<CompetitionResponse, KnockoutRoundCompletionDto>(
            `/v1/football/competition/${id}/knockout-rounds/complete`,
            payload
        ),

    addGroupStage: (id: string, payload: GroupTableDto) =>
        apiClient.post<CompetitionResponse, GroupTableDto>(
            `/v1/football/competition/${id}/group-stages`,
            payload
        ),
    updateGroupStage: (id: string, payload: GroupStageUpdateDto) =>
        apiClient.put<CompetitionResponse, GroupStageUpdateDto>(
            `/v1/football/competition/${id}/group-stages`,
            payload
        ),

    addSponsor: (id: string, payload: SponsorDto) =>
        apiClient.post<CompetitionResponse, SponsorDto>(
            `/v1/football/competition/${id}/sponsors`,
            payload
        ),
    removeSponsor: (id: string, payload: SponsorRemovalDto) =>
        apiClient.delete<CompetitionResponse>(
            `/v1/football/competition/${id}/sponsors`,
            { data: payload }
        ),

    addExtraRule: (id: string, payload: ExtraRuleDto) =>
        apiClient.post<CompetitionResponse, ExtraRuleDto>(
            `/v1/football/competition/${id}/rules`,
            payload
        ),
    removeExtraRule: (id: string, payload: RuleRemovalDto) =>
        apiClient.delete<CompetitionResponse>(
            `/v1/football/competition/${id}/rules`,
            { data: payload }
        ),

    setFeatured: (id: string, payload: FeaturedUpdateDto) =>
        apiClient.put<CompetitionResponse, FeaturedUpdateDto>(
            `/v1/football/competition/${id}/featured`,
            payload
        ),

    search: (query: string, page: number = 1, limit: number = 10) =>
        apiClient.getPaginated<CompetitionResponse>(
            `/v1/football/competition/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
        ),

    findByStatus: (status: string, page: number = 1, limit: number = 10) =>
        apiClient.getPaginated<CompetitionResponse>(
            `/v1/football/competition/status?status=${status}&page=${page}&limit=${limit}`
        ),

    // Additional Queries
    getActive: () =>
        apiClient.get<CompetitionResponse[]>("/v1/football/competition/active"),

    getUpcoming: (limit?: number) => {
        const query = limit ? `?limit=${limit}` : "";
        return apiClient.get<CompetitionResponse[]>(
            `/v1/football/competition/upcoming${query}`
        );
    },

    getFeatured: (limit?: number) => {
        const query = limit ? `?limit=${limit}` : "";
        return apiClient.get<CompetitionResponse[]>(
            `/v1/football/competition/featured${query}`
        );
    },

    // Statistics and Calculations
    getStats: (id: string) =>
        apiClient.get<CompetitionStatsResponse>(
            `/v1/football/competition/${id}/stats`
        ),

    generateFixtures: (id: string) =>
        apiClient.get<FixturesResponse>(
            `/v1/football/competition/${id}/fixtures`
        ),

    calculateQualifications: (id: string) =>
        apiClient.get<QualificationsResponse>(
            `/v1/football/competition/${id}/qualifications`
        ),

    uploadLogo: (id: string, file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        return apiClient.post<CompetitionResponse, FormData>(
            `/v1/football/competition/${id}/logo`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },

    uploadCoverImage: (id: string, file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        return apiClient.post<CompetitionResponse, FormData>(
            `/v1/football/competition/${id}/cover-image`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },
};