"use client";

import {
  X,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Target,
  TrendingUp,
  Shield,
  BarChart3,
  Edit2,
  Upload,
  FileText,
} from "lucide-react";
import type { FootballTeamResponse } from "@/lib/types/v1.response.types";
import { format } from "date-fns";

interface TeamDetailsModalProps {
  team: FootballTeamResponse;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onUploadLogo: () => void;
  onViewContracts: () => void;
  onViewStats: () => void;
}

export default function TeamDetailsModal({
  team,
  isOpen,
  onClose,
  onEdit,
  onUploadLogo,
  onViewContracts,
  onViewStats,
}: TeamDetailsModalProps) {
  if (!isOpen) return null;

  const calculateStats = () => {
    const played = team.stats.played;
    const wins = team.stats.wins;
    const draws = team.stats.draws;
    const loses = team.stats.loses;
    const goalsFor = team.stats.goalsFor;
    const goalsAgainst = team.stats.goalsAgainst;

    const winRate = played > 0 ? ((wins / played) * 100).toFixed(1) : "0.0";
    const goalDifference = goalsFor - goalsAgainst;
    const avgGoalsFor = played > 0 ? (goalsFor / played).toFixed(1) : "0.0";
    const avgGoalsAgainst =
      played > 0 ? (goalsAgainst / played).toFixed(1) : "0.0";

    return {
      winRate,
      goalDifference,
      avgGoalsFor,
      avgGoalsAgainst,
      points: wins * 3 + draws,
    };
  };

  const stats = calculateStats();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-background rounded-lg shadow-lg">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background p-6 rounded-t-lg">
            <div className="flex items-center gap-4">
              {team.logo ? (
                <img
                  src={team.logo}
                  alt={team.name}
                  className="h-12 w-12 rounded-full border-2 border-border"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center border-2 border-border">
                  <span className="text-white font-bold text-lg">
                    {team.shorthand.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  {team.name}
                  <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                    {team.shorthand}
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  {team.faculty?.name ||
                    team.department?.name ||
                    "General Team"}
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                    {team.type.replace(/-/g, " ").toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                title="Edit Team"
              >
                <Edit2 className="h-4 w-4 text-blue-500" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3" />
                    Academic Year
                  </div>
                  <div className="font-medium text-foreground">
                    {team.academicYear}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Users className="h-3 w-3" />
                    Faculty/Dept
                  </div>
                  <div className="font-medium text-foreground">
                    {team.faculty?.name || team.department?.name || "N/A"}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-3 w-3" />
                    Type
                  </div>
                  <div className="font-medium text-foreground">
                    {team.type.replace(/-/g, " ").toUpperCase()}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Trophy className="h-3 w-3" />
                    Created
                  </div>
                  <div className="font-medium text-foreground">
                    {format(new Date(team.createdAt), "MMM d, yyyy")}
                  </div>
                </div>
              </div>

              {/* Team Colors */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Team Colors
                </h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg border-2 border-border"
                      style={{ backgroundColor: team.colors.primary }}
                    />
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        Primary
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {team.colors.primary}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg border-2 border-border"
                      style={{ backgroundColor: team.colors.secondary }}
                    />
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        Secondary
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {team.colors.secondary}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Performance Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {team.stats.played}
                    </div>
                    <div className="text-xs text-muted-foreground">Matches</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {team.stats.wins}
                    </div>
                    <div className="text-xs text-muted-foreground">Wins</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {team.stats.draws}
                    </div>
                    <div className="text-xs text-muted-foreground">Draws</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-rose-600">
                      {team.stats.loses}
                    </div>
                    <div className="text-xs text-muted-foreground">Losses</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-amber-600">
                      {team.stats.goalsFor}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Goals For
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {team.stats.goalsAgainst}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Goals Against
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <TrendingUp className="h-3 w-3" />
                      Win Rate
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {stats.winRate}%
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Target className="h-3 w-3" />
                      Goal Difference
                    </div>
                    <div
                      className={`text-lg font-bold ${stats.goalDifference >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {stats.goalDifference > 0 ? "+" : ""}
                      {stats.goalDifference}
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Shield className="h-3 w-3" />
                      Points
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {stats.points}
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <BarChart3 className="h-3 w-3" />
                      Avg Goals/Match
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {stats.avgGoalsFor} : {stats.avgGoalsAgainst}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coaching Staff */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Coaching Staff
                </h3>
                {team.coaches.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No coaching staff assigned
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {team.coaches.map((coach, index) => (
                      <div
                        key={index}
                        className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="font-medium text-foreground">
                          {coach.name}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 capitalize">
                          {coach.role}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={onUploadLogo}
                    className="flex items-center gap-2 px-4 py-3 border border-input rounded-lg hover:bg-accent transition-colors"
                  >
                    <Upload className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Upload Logo</span>
                  </button>
                  <button
                    onClick={onViewContracts}
                    className="flex items-center gap-2 px-4 py-3 border border-input rounded-lg hover:bg-accent transition-colors"
                  >
                    <FileText className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">View Contracts</span>
                  </button>
                  <button
                    onClick={onViewStats}
                    className="flex items-center gap-2 px-4 py-3 border border-input rounded-lg hover:bg-accent transition-colors"
                  >
                    <BarChart3 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Player Stats</span>
                  </button>
                  <button
                    onClick={onEdit}
                    className="flex items-center gap-2 px-4 py-3 border border-input rounded-lg hover:bg-accent transition-colors"
                  >
                    <Edit2 className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Edit Team</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
