import { apiClient } from "@/lib/config/client";
import { AwardPlayerDto, CreatePlayerContract, CreatePlayerDto, UpdateCareerStatsDto, UpdatePlayerDto, UpdateSeasonStatsDto } from "@/lib/types/v1.payload.types";
import { FootballPlayerContractResponse, FootballPlayerResponse, PlayerCareerStatResponse, PlayerSeasonStatResponse } from "@/lib/types/v1.response.types";
import { FootballPlayerCareerStats } from "@/types/v1.football-player.types";

export const footballPlayerApi = {
    getAll: (page: number, limit: number) => apiClient.getPaginated<FootballPlayerResponse>(`/v1/football/player${page && limit ? `?page=${page}&limit=${limit}` : ''}`),
    getById: (id: string) => apiClient.get<FootballPlayerResponse>(`/v1/football/player/${id}`),

    getPlayerCareerStats: (id: string) => apiClient.get<FootballPlayerCareerStats>(`/v1/football/player/${id}/stat/career`),
    getPlayerSeasonStats: (id: string, season: string) => apiClient.get<FootballPlayerCareerStats>(`/v1/football/player/${id}/stat/season?season=${season}`),
    getPlayerFriendlyStats: (id: string, season?: string) => apiClient.get<FootballPlayerCareerStats>(`/v1/football/player/${id}/stat/friendly${season ? `?season=${season}` : ''}`),
    getPlayerCompetitionStats: (id: string, competition: string, season?: string) => apiClient.get<FootballPlayerCareerStats>(`/v1/football/player/${id}/stat/competition?competition=${competition}${season ? `&season=${season}` : ''}`),
    getPlayerContracts: (id: string, page: number, limit: number) => apiClient.getPaginated<FootballPlayerContractResponse>(`/${id}/contract${page && limit ? `?page=${page}&limit=${limit}` : ''}`),

    createPlayer: (payload: CreatePlayerDto) => apiClient.post<FootballPlayerResponse, CreatePlayerDto>('/v1/football/player', payload),
    updatePlayer: (id: string, payload: UpdatePlayerDto) => apiClient.put<FootballPlayerResponse, UpdatePlayerDto>(`/v1/football/player/${id}`, payload),
    deletePlayer: (id: string) => apiClient.delete<void>(`/v1/football/player/${id}`),
    uploadTeamLogo: (id: string, file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        return apiClient.put<FootballPlayerResponse, FormData>(`/v1/football/player/${id}/photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    awardPlayer: (id: string, payload: AwardPlayerDto) => apiClient.put<FootballPlayerResponse, AwardPlayerDto>(`/v1/football/player/${id}/award`, payload),
    signContract: (id: string, payload: CreatePlayerContract) => apiClient.put<FootballPlayerContractResponse, CreatePlayerContract>(`/v1/football/player/${id}/contract`, payload),
    updateCareerStats: (id: string, payload: UpdateCareerStatsDto) => apiClient.put<PlayerCareerStatResponse, UpdateCareerStatsDto>(`/v1/football/player/${id}/stat/career`, payload), // Overrides Career Stats
    updateSeasonStats: (id: string, payload: UpdateSeasonStatsDto) => apiClient.put<PlayerSeasonStatResponse, UpdateSeasonStatsDto>(`/v1/football/player/${id}/stat/season`, payload), // Increments Season Stats
}