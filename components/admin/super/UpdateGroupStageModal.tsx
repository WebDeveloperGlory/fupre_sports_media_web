"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X, Save, Plus, Trash2, Users } from "lucide-react";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { CompetitionResponse } from "@/lib/types/v1.response.types";
import {
  GroupStageUpdateDto,
  GroupTableDto,
} from "@/lib/types/v1.payload.types";
import {
  GroupTable,
  LeagueStanding,
} from "@/types/v1.football-competition.types";

interface UpdateGroupStageModalProps {
  competition: CompetitionResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdateGroupStageModal({
  competition,
  isOpen,
  onClose,
  onSuccess,
}: UpdateGroupStageModalProps) {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<GroupTable[]>(
    competition.groupStage || [],
  );
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroup, setNewGroup] = useState<GroupTableDto>({
    name: "",
    groupNumber: (competition.groupStage?.length || 0) + 1,
    standings: [],
    fixtures: [],
    qualificationRules: [],
    qualifiedTeams: [],
    completed: false,
    matchesPlayed: 0,
    totalMatches: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setGroups(competition.groupStage || []);
    }
  }, [isOpen, competition.groupStage]);

  const handleAddGroup = async () => {
    if (!newGroup.name.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    try {
      setLoading(true);
      const response = await footballCompetitionApi.addGroupStage(
        competition.id,
        newGroup,
      );

      if (response.success) {
        toast.success("Group added successfully");
        setNewGroup({
          name: "",
          groupNumber: newGroup.groupNumber + 1,
          standings: [],
          fixtures: [],
          qualificationRules: [],
          qualifiedTeams: [],
          completed: false,
          matchesPlayed: 0,
          totalMatches: 0,
        });
        setShowAddGroup(false);
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add group");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGroup = (
    groupIndex: number,
    updates: Partial<GroupTable>,
  ) => {
    const newGroups = [...groups];
    newGroups[groupIndex] = { ...newGroups[groupIndex], ...updates };
    setGroups(newGroups);
  };

  const handleUpdateStanding = (
    groupIndex: number,
    standingIndex: number,
    updates: Partial<LeagueStanding>,
  ) => {
    const newGroups = [...groups];
    const group = newGroups[groupIndex];
    const standings = [...group.standings];

    standings[standingIndex] = { ...standings[standingIndex], ...updates };

    // Recalculate goal difference and points
    if (updates.goalsFor !== undefined || updates.goalsAgainst !== undefined) {
      const standing = standings[standingIndex];
      standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
    }

    if (
      updates.wins !== undefined ||
      updates.draws !== undefined ||
      updates.bonusPoints !== undefined
    ) {
      const standing = standings[standingIndex];
      standing.points =
        standing.wins * 3 + standing.draws + (standing.bonusPoints || 0);
    }

    group.standings = standings;
    setGroups(newGroups);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload: GroupStageUpdateDto = {
        groups: groups.map((group) => ({
          name: group.name,
          groupNumber: group.groupNumber,
          standings: group.standings.map((standing) => ({
            team:
              typeof standing.team === "string"
                ? standing.team
                : standing.team.id,
            played: standing.played,
            wins: standing.wins,
            draws: standing.draws,
            losses: standing.losses,
            goalsFor: standing.goalsFor,
            goalsAgainst: standing.goalsAgainst,
            points: standing.points,
            disciplinaryPoints: standing.disciplinaryPoints || 0,
            bonusPoints: standing.bonusPoints || 0,
            form: standing.form,
            position: standing.position,
            yellowCards: standing.yellowCards || 0,
            redCards: standing.redCards || 0,
          })),
          fixtures: group.fixtures,
          qualificationRules: group.qualificationRules,
          qualifiedTeams: group.qualifiedTeams || [],
          completed: group.completed,
          matchesPlayed: group.matchesPlayed || 0,
          totalMatches: group.totalMatches || 0,
        })),
      };

      const response = await footballCompetitionApi.updateGroupStage(
        competition.id,
        payload,
      );
      if (response.success) {
        toast.success("Group stage updated successfully");
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update group stage");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative w-full max-w-6xl bg-card rounded-lg shadow-lg border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Update Group Stage
              </h2>
              <p className="text-sm text-muted-foreground">
                {competition.name} - Manage groups and standings
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-6">
            {/* Add Group */}
            {showAddGroup ? (
              <div className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Add New Group
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Group Name
                    </label>
                    <input
                      type="text"
                      value={newGroup.name}
                      onChange={(e) =>
                        setNewGroup({ ...newGroup, name: e.target.value })
                      }
                      placeholder="e.g., Group A, Group B"
                      className="w-full px-3 py-2 border border-input bg-background rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Group Number
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newGroup.groupNumber}
                      onChange={(e) =>
                        setNewGroup({
                          ...newGroup,
                          groupNumber: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3 py-2 border border-input bg-background rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowAddGroup(false)}
                      className="px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddGroup}
                      disabled={loading || !newGroup.name.trim()}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {loading ? "Adding..." : "Add Group"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddGroup(true)}
                className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add New Group
              </button>
            )}

            {/* Groups List */}
            <div className="space-y-6">
              {groups.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Groups
                  </h3>
                  <p className="text-muted-foreground">
                    Add groups to organize teams
                  </p>
                </div>
              ) : (
                groups.map((group, groupIndex) => (
                  <div
                    key={group.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <input
                            type="number"
                            min="0"
                            value={group.matchesPlayed || 0}
                            onChange={(e) =>
                              handleUpdateGroup(groupIndex, {
                                matchesPlayed: parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="Matches Played"
                            className="w-32 px-2 py-1 text-sm border border-input rounded bg-background"
                          />
                          <span className="text-sm text-muted-foreground">
                            /
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={group.totalMatches || 0}
                            onChange={(e) =>
                              handleUpdateGroup(groupIndex, {
                                totalMatches: parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="Total Matches"
                            className="w-32 px-2 py-1 text-sm border border-input rounded bg-background"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`completed-${group.id}`}
                              checked={group.completed}
                              onChange={(e) =>
                                handleUpdateGroup(groupIndex, {
                                  completed: e.target.checked,
                                })
                              }
                              className="h-4 w-4 rounded border-input"
                            />
                            <label
                              htmlFor={`completed-${group.id}`}
                              className="text-sm text-muted-foreground"
                            >
                              Completed
                            </label>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newGroups = [...groups];
                          newGroups.splice(groupIndex, 1);
                          setGroups(newGroups);
                        }}
                        className="p-2 hover:bg-accent rounded-lg transition-colors text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Standings Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                              Pos
                            </th>
                            <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                              Team
                            </th>
                            <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                              P
                            </th>
                            <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                              W
                            </th>
                            <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                              D
                            </th>
                            <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                              L
                            </th>
                            <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                              GF
                            </th>
                            <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                              GA
                            </th>
                            <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                              GD
                            </th>
                            <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                              Pts
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.standings.map((standing, standingIndex) => {
                            const teamName =
                              typeof standing.team === "string"
                                ? competition.teams.find(
                                    (t) => t.id === standing.team,
                                  )?.name || standing.team
                                : standing.team.name;

                            return (
                              <tr
                                key={standing.id}
                                className="border-b border-border last:border-0 hover:bg-accent/50"
                              >
                                <td className="py-2 px-4">
                                  <input
                                    type="number"
                                    min="1"
                                    value={standing.position}
                                    onChange={(e) =>
                                      handleUpdateStanding(
                                        groupIndex,
                                        standingIndex,
                                        {
                                          position:
                                            parseInt(e.target.value) || 1,
                                        },
                                      )
                                    }
                                    className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                                  />
                                </td>
                                <td className="py-2 px-4">
                                  <div
                                    className="text-sm truncate max-w-[150px]"
                                    title={teamName}
                                  >
                                    {teamName}
                                  </div>
                                </td>
                                <td className="py-2 px-4">
                                  <input
                                    type="number"
                                    min="0"
                                    value={standing.played}
                                    onChange={(e) =>
                                      handleUpdateStanding(
                                        groupIndex,
                                        standingIndex,
                                        {
                                          played: parseInt(e.target.value) || 0,
                                        },
                                      )
                                    }
                                    className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                                  />
                                </td>
                                <td className="py-2 px-4">
                                  <input
                                    type="number"
                                    min="0"
                                    value={standing.wins}
                                    onChange={(e) =>
                                      handleUpdateStanding(
                                        groupIndex,
                                        standingIndex,
                                        { wins: parseInt(e.target.value) || 0 },
                                      )
                                    }
                                    className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                                  />
                                </td>
                                <td className="py-2 px-4">
                                  <input
                                    type="number"
                                    min="0"
                                    value={standing.draws}
                                    onChange={(e) =>
                                      handleUpdateStanding(
                                        groupIndex,
                                        standingIndex,
                                        {
                                          draws: parseInt(e.target.value) || 0,
                                        },
                                      )
                                    }
                                    className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                                  />
                                </td>
                                <td className="py-2 px-4">
                                  <input
                                    type="number"
                                    min="0"
                                    value={standing.losses}
                                    onChange={(e) =>
                                      handleUpdateStanding(
                                        groupIndex,
                                        standingIndex,
                                        {
                                          losses: parseInt(e.target.value) || 0,
                                        },
                                      )
                                    }
                                    className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                                  />
                                </td>
                                <td className="py-2 px-4">
                                  <input
                                    type="number"
                                    min="0"
                                    value={standing.goalsFor}
                                    onChange={(e) =>
                                      handleUpdateStanding(
                                        groupIndex,
                                        standingIndex,
                                        {
                                          goalsFor:
                                            parseInt(e.target.value) || 0,
                                        },
                                      )
                                    }
                                    className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                                  />
                                </td>
                                <td className="py-2 px-4">
                                  <input
                                    type="number"
                                    min="0"
                                    value={standing.goalsAgainst}
                                    onChange={(e) =>
                                      handleUpdateStanding(
                                        groupIndex,
                                        standingIndex,
                                        {
                                          goalsAgainst:
                                            parseInt(e.target.value) || 0,
                                        },
                                      )
                                    }
                                    className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                                  />
                                </td>
                                <td className="py-2 px-4">
                                  <span
                                    className={`font-medium text-center block ${
                                      standing.goalDifference > 0
                                        ? "text-emerald-600"
                                        : standing.goalDifference < 0
                                          ? "text-rose-600"
                                          : ""
                                    }`}
                                  >
                                    {standing.goalDifference > 0 ? "+" : ""}
                                    {standing.goalDifference}
                                  </span>
                                </td>
                                <td className="py-2 px-4">
                                  <input
                                    type="number"
                                    min="0"
                                    value={standing.points}
                                    onChange={(e) =>
                                      handleUpdateStanding(
                                        groupIndex,
                                        standingIndex,
                                        {
                                          points: parseInt(e.target.value) || 0,
                                        },
                                      )
                                    }
                                    className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center font-bold"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
