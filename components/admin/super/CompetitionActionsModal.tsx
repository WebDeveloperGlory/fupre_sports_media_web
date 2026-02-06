"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { CompetitionResponse } from "@/lib/types/v1.response.types";
import {
  X,
  Play,
  CheckCircle,
  XCircle,
  TrendingUp,
  RefreshCw,
  Calendar,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { CompetitionStatus } from "@/types/v1.football-competition.types";

interface CompetitionActionsModalProps {
  competition: CompetitionResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CompetitionActionsModal({
  competition,
  isOpen,
  onClose,
  onSuccess,
}: CompetitionActionsModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleActivate = async () => {
    try {
      setLoading("activate");
      const response = await footballCompetitionApi.activate(competition.id);
      toast.success(response.message || "Competition activated successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to activate competition");
    } finally {
      setLoading(null);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading("complete");
      const response = await footballCompetitionApi.complete(competition.id);
      toast.success(response.message || "Competition completed successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to complete competition");
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this competition?")) return;

    try {
      setLoading("cancel");
      const response = await footballCompetitionApi.cancel(competition.id);
      toast.success(response.message || "Competition cancelled successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel competition");
    } finally {
      setLoading(null);
    }
  };

  const handleAdvanceMatchWeek = async () => {
    try {
      setLoading("advance");
      const response = await footballCompetitionApi.advanceMatchWeek(
        competition.id,
      );
      toast.success(response.message || "Match week advanced successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to advance match week");
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateFixtures = async () => {
    try {
      setLoading("fixtures");
      const response = await footballCompetitionApi.generateFixtures(
        competition.id,
      );
      toast.success(response.message || "Fixtures generated successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate fixtures");
    } finally {
      setLoading(null);
    }
  };

  const handleRecalculateTable = async () => {
    try {
      setLoading("recalculate");
      const response = await footballCompetitionApi.recalculateLeagueTable(
        competition.id,
      );
      toast.success(
        response.message || "League table recalculated successfully",
      );
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to recalculate league table");
    } finally {
      setLoading(null);
    }
  };

  if (!isOpen) return null;

  const canActivate = competition.status === CompetitionStatus.UPCOMING;
  const canComplete = competition.status === CompetitionStatus.ONGOING;
  const canCancel = [
    CompetitionStatus.UPCOMING,
    CompetitionStatus.ONGOING,
  ].includes(competition.status);
  const canAdvance =
    competition.status === CompetitionStatus.ONGOING &&
    competition.type === "league";
  const canGenerateFixtures =
    competition.status !== CompetitionStatus.COMPLETED &&
    competition.teams.length >= 2;
  const canRecalculate =
    competition.leagueTable && competition.leagueTable.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Competition Actions
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage competition state and operations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Status Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Status Management
            </h3>

            {canActivate && (
              <button
                onClick={handleActivate}
                disabled={loading !== null}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <Play className="h-5 w-5 text-emerald-500" />
                  <div className="text-left">
                    <div className="font-medium text-foreground">
                      Activate Competition
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Start the competition
                    </div>
                  </div>
                </div>
                {loading === "activate" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-emerald-500" />
                )}
              </button>
            )}

            {canComplete && (
              <button
                onClick={handleComplete}
                disabled={loading !== null}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium text-foreground">
                      Complete Competition
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Mark as completed
                    </div>
                  </div>
                </div>
                {loading === "complete" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-blue-500" />
                )}
              </button>
            )}

            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={loading !== null}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-rose-500" />
                  <div className="text-left">
                    <div className="font-medium text-foreground">
                      Cancel Competition
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Cancel the competition
                    </div>
                  </div>
                </div>
                {loading === "cancel" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-rose-500" />
                )}
              </button>
            )}
          </div>

          {/* Match Operations */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Match Operations
            </h3>

            {canAdvance && (
              <button
                onClick={handleAdvanceMatchWeek}
                disabled={loading !== null}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                  <div className="text-left">
                    <div className="font-medium text-foreground">
                      Advance Match Week
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current: Week {competition.currentMatchWeek}
                    </div>
                  </div>
                </div>
                {loading === "advance" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-amber-500" />
                )}
              </button>
            )}

            {canGenerateFixtures && (
              <button
                onClick={handleGenerateFixtures}
                disabled={loading !== null}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div className="text-left">
                    <div className="font-medium text-foreground">
                      Generate Fixtures
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {competition.teams.length} teams
                    </div>
                  </div>
                </div>
                {loading === "fixtures" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-purple-500" />
                )}
              </button>
            )}
          </div>

          {/* Table Operations */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Table Operations
            </h3>

            {canRecalculate && (
              <button
                onClick={handleRecalculateTable}
                disabled={loading !== null}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-green-500/20 bg-green-500/10 hover:bg-green-500/20 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-green-500" />
                  <div className="text-left">
                    <div className="font-medium text-foreground">
                      Recalculate League Table
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Update standings
                    </div>
                  </div>
                </div>
                {loading === "recalculate" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-green-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-green-500" />
                )}
              </button>
            )}
          </div>

          {/* Quick Info */}
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium capitalize">
                {competition.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium capitalize">{competition.type}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Teams</span>
              <span className="font-medium">{competition.teams.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Match Week</span>
              <span className="font-medium">
                {competition.currentMatchWeek}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
