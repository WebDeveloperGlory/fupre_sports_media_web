"use client";

import { useState, useEffect } from "react";
import {
  X,
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  Users,
  Award,
  Clock,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { CompetitionResponse } from "@/lib/types/v1.response.types";
import { CompetitionStatsResponse } from "@/lib/types/v1.response.types";

interface CompetitionStatsModalProps {
  competition: CompetitionResponse;
  isOpen: boolean;
  onClose: () => void;
}

export function CompetitionStatsModal({
  competition,
  isOpen,
  onClose,
}: CompetitionStatsModalProps) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<CompetitionStatsResponse | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await footballCompetitionApi.getStats(competition.id);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error("Failed to load stats:", error);
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

        <div className="relative w-full max-w-4xl bg-card rounded-lg shadow-lg border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Competition Statistics
              </h2>
              <p className="text-sm text-muted-foreground">
                {competition.name} - {competition.season}
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">
                  Loading statistics...
                </span>
              </div>
            ) : stats ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Competition
                        </p>
                        <p className="font-bold text-foreground">
                          {stats.basicInfo.name}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {stats.basicInfo.type} • {stats.basicInfo.season}
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Teams</p>
                        <p className="font-bold text-foreground">
                          {stats.basicInfo.teamsCount}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {stats.basicInfo.registeredTeamsCount} registered
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Days Remaining
                        </p>
                        <p className="font-bold text-foreground">
                          {stats.timeline.daysRemaining}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-500/10">
                        <Clock className="h-5 w-5 text-emerald-500" />
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Match Week {stats.timeline.matchWeek}
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Current Stage
                        </p>
                        <p className="font-bold text-foreground">
                          {stats.timeline.currentStage || "Not started"}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Target className="h-5 w-5 text-purple-500" />
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {stats.basicInfo.status}
                    </div>
                  </div>
                </div>

                {/* League Stats */}
                {stats.leagueStats && (
                  <div className="border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      League Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {stats.leagueStats.totalMatches}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total Matches
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">
                          {stats.leagueStats.completionPercentage}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Completion
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {stats.leagueStats.averageGoalsPerMatch.toFixed(1)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Avg. Goals/Match
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {stats.leagueStats.totalYellowCards +
                            stats.leagueStats.totalRedCards}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total Cards
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Group Stats */}
                {stats.groupStats && (
                  <div className="border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Group Stage Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {stats.groupStats.totalGroups}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total Groups
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">
                          {stats.groupStats.completionPercentage}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Completion
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {stats.groupStats.qualifiedTeams}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qualified Teams
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {stats.groupStats.matchesPlayed}/
                          {stats.groupStats.totalMatches}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Matches Played
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Knockout Stats */}
                {stats.knockoutStats && (
                  <div className="border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Knockout Stage Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {stats.knockoutStats.totalRounds}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total Rounds
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">
                          {stats.knockoutStats.completionPercentage}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Completion
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {stats.knockoutStats.totalFixtures}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total Fixtures
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timeline
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Start Date
                      </span>
                      <span className="font-medium">
                        {format(
                          new Date(stats.timeline.startDate),
                          "MMM d, yyyy",
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        End Date
                      </span>
                      <span className="font-medium">
                        {format(
                          new Date(stats.timeline.endDate),
                          "MMM d, yyyy",
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Registration Status
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          stats.registration.isRegistrationOpen
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-rose-500/10 text-rose-600"
                        }`}
                      >
                        {stats.registration.isRegistrationOpen
                          ? "Open"
                          : "Closed"}
                      </span>
                    </div>
                    {stats.registration.registrationDeadline && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Registration Deadline
                        </span>
                        <span className="font-medium">
                          {format(
                            new Date(stats.registration.registrationDeadline),
                            "MMM d, yyyy",
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Statistics Available
                </h3>
                <p className="text-muted-foreground">
                  Statistics could not be loaded for this competition
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
