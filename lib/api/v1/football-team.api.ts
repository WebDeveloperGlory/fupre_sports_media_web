import { apiClient } from "@/lib/config/client";
import { CreateFootballTeamDto, RequestTeamPlayerStatsDto, UpdateFootballTeamDto } from "@/lib/types/v1.payload.types";
import { FootballTeamResponse, PlayerSeasonStatResponse } from "@/lib/types/v1.response.types";

export const footballTeamApi = {
    getAll: (page: number, limit: number) => apiClient.getPaginated<FootballTeamResponse>(`/v1/football/team?page=${page}&limit=${limit}`),
    getByID: (id: string) => apiClient.get<FootballTeamResponse>(`/v1/football/team/${id}`),
    getTeamPlayersContracts: (id: string, page: number, limit: number) => apiClient.get<FootballTeamResponse>(`/v1/football/team/${id}/player/contracts?page=${page}&limit=${limit}`),
    getTeamPlayerStats: (id: string, payload: RequestTeamPlayerStatsDto) => apiClient.post<PlayerSeasonStatResponse[], RequestTeamPlayerStatsDto>(`/v1/football/team/${id}/player/stats`, payload),

    createTeam: (payload: CreateFootballTeamDto) => apiClient.post<FootballTeamResponse, CreateFootballTeamDto>(`/v1/football/team`, payload),
    updateTeam: (id: string, payload: UpdateFootballTeamDto) => apiClient.put<FootballTeamResponse, UpdateFootballTeamDto>(`/v1/football/team/${id}`, payload),
    deleteTeam: (id: string) => apiClient.delete<void>(`/v1/football/team/${id}`),
    uploadTeamLogo: (id: string, file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        return apiClient.post<FootballTeamResponse, FormData>(`/v1/football/team/${id}/logo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
}