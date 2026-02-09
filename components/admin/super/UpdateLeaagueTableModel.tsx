"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  X,
  Save,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { CompetitionResponse } from "@/lib/types/v1.response.types";
import {
  LeagueTableUpdateDto,
  LeagueStandingUpdateDto,
} from "@/lib/types/v1.payload.types";
import {
  LeagueStanding,
  CompetitionTeamForm,
} from "@/types/v1.football-competition.types";

interface UpdateLeagueTableModalProps {
  competition: CompetitionResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdateLeagueTableModal({
  competition,
  isOpen,
  onClose,
  onSuccess,
}: UpdateLeagueTableModalProps) {
  const [loading, setLoading] = useState(false);
  const [standings, setStandings] = useState<LeagueStanding[]>(
    competition.leagueTable || [],
  );
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStandings(competition.leagueTable || []);
      setHasChanges(false);
    }
  }, [isOpen, competition.leagueTable]);

  const handleUpdateStanding = (
    index: number,
    field: keyof LeagueStanding,
    value: any,
  ) => {
    const newStandings = [...standings];
    const standing = newStandings[index];

    // Update the field
    if (field === "form") {
      standing[field] = value
        .split("")
        .filter((char: string) =>
          ["W", "D", "L"].includes(char),
        ) as CompetitionTeamForm[];
    } else if (typeof standing[field] === "number") {
    //   standing[field] = parseInt(value) || 0;
    } else {
    //   standing[field] = value;
    }

    // Recalculate derived fields
    standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
    standing.points =
      standing.wins * 3 + standing.draws + (standing.bonusPoints || 0);

    setStandings(newStandings);
    setHasChanges(true);
  };

  const handleRecalculateTable = async () => {
    try {
      setLoading(true);
      const response = await footballCompetitionApi.recalculateLeagueTable(
        competition.id,
      );
      if (response.success) {
        toast.success("Table recalculated successfully");
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to recalculate table");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload: LeagueTableUpdateDto = {
        table: standings.map((standing) => ({
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
      };

      const response = await footballCompetitionApi.updateLeagueTable(
        competition.id,
        payload,
      );
      if (response.success) {
        toast.success("League table updated successfully");
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update league table");
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
                Update League Table
              </h2>
              <p className="text-sm text-muted-foreground">
                {competition.name} - Edit standings and statistics
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
            {/* Table Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                {standings.length} teams in table
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRecalculateTable}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Recalculate Table
                </button>
              </div>
            </div>

            {/* League Table Editor */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Pos
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Team
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      P
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      W
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      D
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      L
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      GF
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      GA
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      GD
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Pts
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Form
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {standings.map((standing, index) => {
                    const teamName =
                      typeof standing.team === "string"
                        ? competition.teams.find((t) => t.id === standing.team)
                            ?.name || standing.team
                        : standing.team.name;

                    return (
                      <tr
                        key={standing.id}
                        className="hover:bg-accent/50 transition-colors"
                      >
                        {/* Position */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={standing.position}
                              onChange={(e) =>
                                handleUpdateStanding(
                                  index,
                                  "position",
                                  e.target.value,
                                )
                              }
                              className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                            />
                            {standing.positionChange !== 0 && (
                              <div
                                className={`flex items-center ${standing.positionChange > 0 ? "text-emerald-500" : "text-rose-500"}`}
                              >
                                {standing.positionChange > 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                <span className="text-xs">
                                  {Math.abs(standing.positionChange)}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Team */}
                        <td className="py-3 px-4">
                          <div
                            className="text-sm font-medium truncate max-w-[200px]"
                            title={teamName}
                          >
                            {teamName}
                          </div>
                        </td>

                        {/* Stats Inputs */}
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            value={standing.played}
                            onChange={(e) =>
                              handleUpdateStanding(
                                index,
                                "played",
                                e.target.value,
                              )
                            }
                            className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            value={standing.wins}
                            onChange={(e) =>
                              handleUpdateStanding(
                                index,
                                "wins",
                                e.target.value,
                              )
                            }
                            className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            value={standing.draws}
                            onChange={(e) =>
                              handleUpdateStanding(
                                index,
                                "draws",
                                e.target.value,
                              )
                            }
                            className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            value={standing.losses}
                            onChange={(e) =>
                              handleUpdateStanding(
                                index,
                                "losses",
                                e.target.value,
                              )
                            }
                            className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            value={standing.goalsFor}
                            onChange={(e) =>
                              handleUpdateStanding(
                                index,
                                "goalsFor",
                                e.target.value,
                              )
                            }
                            className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            value={standing.goalsAgainst}
                            onChange={(e) =>
                              handleUpdateStanding(
                                index,
                                "goalsAgainst",
                                e.target.value,
                              )
                            }
                            className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                          />
                        </td>
                        <td className="py-3 px-4">
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
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              value={standing.points}
                              onChange={(e) =>
                                handleUpdateStanding(
                                  index,
                                  "points",
                                  e.target.value,
                                )
                              }
                              className="w-16 px-2 py-1 text-sm border border-input rounded bg-background text-center font-bold"
                            />
                            <input
                              type="number"
                              min="0"
                              value={standing.bonusPoints || 0}
                              onChange={(e) =>
                                handleUpdateStanding(
                                  index,
                                  "bonusPoints",
                                  e.target.value,
                                )
                              }
                              className="w-12 px-2 py-1 text-sm border border-input rounded bg-background text-center"
                              placeholder="Bonus"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={standing.form.join("")}
                            onChange={(e) =>
                              handleUpdateStanding(
                                index,
                                "form",
                                e.target.value.toUpperCase(),
                              )
                            }
                            placeholder="WLDWW"
                            maxLength={5}
                            className="w-24 px-2 py-1 text-sm border border-input rounded bg-background uppercase text-center"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {hasChanges ? "You have unsaved changes" : "No changes made"}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !hasChanges}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  hasChanges
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <Save className="h-4 w-4" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
