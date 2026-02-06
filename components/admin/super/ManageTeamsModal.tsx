"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { CompetitionResponse } from "@/lib/types/v1.response.types";
import { FootballTeamResponse } from "@/lib/types/v1.response.types";
import { AddTeamDto, RemoveTeamDto } from "@/lib/types/v1.payload.types";
import {
  X,
  Users,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { footballTeamApi } from "@/lib/api/v1/football-team.api";

interface ManageTeamsModalProps {
  competition: CompetitionResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ManageTeamsModal({
  competition,
  isOpen,
  onClose,
  onSuccess,
}: ManageTeamsModalProps) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableTeams, setAvailableTeams] = useState<FootballTeamResponse[]>(
    [],
  );
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetchAvailableTeams();
    }
  }, [isOpen, competition]);

  const fetchAvailableTeams = async () => {
    try {
      setLoading(true);
      const teams = await footballTeamApi.getAll(1, 100);
      
      // Filter out teams already in competition
      const registeredTeamIds = competition.teams.map((team) => team.id);
      const filteredTeams = teams.data.filter(
        (team) => !registeredTeamIds.includes(team.id),
      );
      setAvailableTeams(filteredTeams);
    } catch (error: any) {
      toast.error("Failed to load available teams");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = async () => {
    if (!selectedTeamId) {
      toast.error("Please select a team to add");
      return;
    }

    try {
      setLoading(true);
      const payload: AddTeamDto = {
        teamId: selectedTeamId,
      };
      const response = await footballCompetitionApi.addTeam(
        competition.id,
        payload,
      );
      toast.success(response.message || "Team added successfully");
      setSelectedTeamId("");
      onSuccess();
      fetchAvailableTeams(); // Refresh available teams
    } catch (error: any) {
      toast.error(error.message || "Failed to add team");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTeam = async (teamId: string) => {
    if (
      !confirm(
        "Are you sure you want to remove this team from the competition?",
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const payload: RemoveTeamDto = {
        teamId,
      };
      const response = await footballCompetitionApi.removeTeam(
        competition.id,
        payload,
      );
      toast.success(response.message || "Team removed successfully");
      onSuccess();
      fetchAvailableTeams(); // Refresh available teams
    } catch (error: any) {
      toast.error(error.message || "Failed to remove team");
    } finally {
      setLoading(false);
    }
  };

  const filteredAvailableTeams = availableTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.shorthand.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Manage Teams - {competition.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add or remove teams from the competition
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add Team Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Team
            </h3>

            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search available teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>

                {filteredAvailableTeams.length > 0 ? (
                  <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                    {filteredAvailableTeams.map((team) => (
                      <div
                        key={team.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedTeamId === team.id
                            ? "border-primary bg-primary/10"
                            : "border-input hover:bg-accent"
                        }`}
                        onClick={() => setSelectedTeamId(team.id)}
                      >
                        <div
                          className="h-8 w-8 rounded-full"
                          style={{
                            backgroundColor: team.colors?.primary || "#000",
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {team.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {team.shorthand}
                          </div>
                        </div>
                        {selectedTeamId === team.id ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 text-center py-4">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {searchQuery
                        ? "No teams match your search"
                        : "No teams available to add"}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center">
                <button
                  onClick={handleAddTeam}
                  disabled={!selectedTeamId || loading}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Team
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Registered Teams Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Registered Teams ({competition.teams.length})
            </h3>

            {competition.teams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competition.teams.map((team) => (
                  <div
                    key={team.id}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-full"
                          style={{
                            backgroundColor: team.colors?.primary || "#000",
                          }}
                        />
                        <div>
                          <div className="font-medium text-foreground">
                            {team.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {team.shorthand}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveTeam(team.id)}
                        disabled={loading}
                        className="p-2 hover:bg-accent rounded-lg transition-colors text-rose-500 disabled:opacity-50"
                        title="Remove Team"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Teams Registered
                </h3>
                <p className="text-muted-foreground">
                  Add teams to this competition using the form above
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
