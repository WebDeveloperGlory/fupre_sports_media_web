"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  X,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Circle,
  Save,
} from "lucide-react";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { CompetitionResponse } from "@/lib/types/v1.response.types";
import {
  KnockoutRoundDto,
  KnockoutRoundCompletionDto,
} from "@/lib/types/v1.payload.types";
import { KnockoutRound } from "@/types/v1.football-competition.types";

interface ManageKnockoutRoundsModalProps {
  competition: CompetitionResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ManageKnockoutRoundsModal({
  competition,
  isOpen,
  onClose,
  onSuccess,
}: ManageKnockoutRoundsModalProps) {
  const [loading, setLoading] = useState(false);
  const [rounds, setRounds] = useState<KnockoutRound[]>(
    competition.knockoutRounds || [],
  );
  const [editingRound, setEditingRound] = useState<KnockoutRound | null>(null);
  const [showAddRound, setShowAddRound] = useState(false);
  const [newRound, setNewRound] = useState<KnockoutRoundDto>({
    name: "",
    roundNumber: (competition.knockoutRounds?.length || 0) + 1,
    fixtures: [],
    completed: false,
  });

  useEffect(() => {
    if (isOpen) {
      setRounds(competition.knockoutRounds || []);
    }
  }, [isOpen, competition.knockoutRounds]);

  const handleAddRound = async () => {
    if (!newRound.name.trim()) {
      toast.error("Please enter a round name");
      return;
    }

    try {
      setLoading(true);
      const response = await footballCompetitionApi.addKnockoutRound(
        competition.id,
        newRound,
      );

      if (response.success) {
        toast.success("Round added successfully");
        setNewRound({
          name: "",
          roundNumber: newRound.roundNumber + 1,
          fixtures: [],
          completed: false,
        });
        setShowAddRound(false);
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add round");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRound = async (roundId: string) => {
    try {
      setLoading(true);
      const payload: KnockoutRoundCompletionDto = { roundId };
      const response = await footballCompetitionApi.completeKnockoutRound(
        competition.id,
        payload,
      );

      if (response.success) {
        toast.success("Round marked as completed");
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update round");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRound = async (roundId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this round? This action cannot be undone.",
      )
    )
      return;

    toast.info(
      "Delete functionality would be implemented with proper backend endpoint",
    );
  };

  const handleSaveRound = async (round: KnockoutRound) => {
    try {
      setLoading(true);
      // Note: This would require an update endpoint for knockout rounds
      toast.info(
        "Update functionality would be implemented with proper backend endpoint",
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to save round");
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
                Manage Knockout Rounds
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
            {/* Add New Round */}
            {showAddRound ? (
              <div className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Add New Round
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Round Name
                    </label>
                    <input
                      type="text"
                      value={newRound.name}
                      onChange={(e) =>
                        setNewRound({ ...newRound, name: e.target.value })
                      }
                      placeholder="e.g., Quarter Finals, Semi Finals"
                      className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Round Number
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newRound.roundNumber}
                      onChange={(e) =>
                        setNewRound({
                          ...newRound,
                          roundNumber: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="completed"
                      checked={newRound.completed}
                      onChange={(e) =>
                        setNewRound({
                          ...newRound,
                          completed: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-input"
                    />
                    <label
                      htmlFor="completed"
                      className="text-sm text-muted-foreground"
                    >
                      Mark as completed
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowAddRound(false)}
                      className="px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddRound}
                      disabled={loading || !newRound.name.trim()}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Adding..." : "Add Round"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddRound(true)}
                className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add New Round
              </button>
            )}

            {/* Rounds List */}
            <div className="space-y-4">
              {rounds.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                  <Circle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Knockout Rounds
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Add knockout rounds to start the elimination stage
                  </p>
                  <button
                    onClick={() => setShowAddRound(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Create First Round
                  </button>
                </div>
              ) : (
                rounds
                  .sort((a, b) => a.roundNumber - b.roundNumber)
                  .map((round) => (
                    <div
                      key={round.id}
                      className="border border-border rounded-lg overflow-hidden hover:border-ring transition-colors"
                    >
                      <div className="p-4 bg-muted/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              round.completed
                                ? "bg-emerald-500/10"
                                : "bg-blue-500/10"
                            }`}
                          >
                            {round.completed ? (
                              <CheckCircle className="h-5 w-5 text-emerald-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {round.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Round {round.roundNumber} •{" "}
                              {round.fixtures.length} fixtures
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCompleteRound(round.id)}
                            disabled={round.completed || loading}
                            className={`px-3 py-1 rounded-full text-sm ${
                              round.completed
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                            } disabled:opacity-50`}
                          >
                            {round.completed ? "Completed" : "Mark Complete"}
                          </button>
                          <button
                            onClick={() => setEditingRound(round)}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            disabled={loading}
                          >
                            <Edit2 className="h-4 w-4 text-blue-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteRound(round.id)}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4 text-rose-500" />
                          </button>
                        </div>
                      </div>

                      {round.fixtures.length > 0 && (
                        <div className="p-4">
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">
                            Fixtures ({round.fixtures.length})
                          </h4>
                          <div className="space-y-2">
                            {round.fixtures
                              .slice(0, 5)
                              .map((fixtureId, index) => (
                                <div
                                  key={fixtureId}
                                  className="flex items-center justify-between p-2 border border-border rounded hover:bg-accent/50 transition-colors"
                                >
                                  <div className="text-sm">
                                    Match {index + 1}: {fixtureId.slice(0, 8)}
                                    ...
                                  </div>
                                </div>
                              ))}
                            {round.fixtures.length > 5 && (
                              <div className="text-center py-2 text-sm text-muted-foreground">
                                +{round.fixtures.length - 5} more fixtures
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
              Close
            </button>
          </div>

          {/* Edit Round Modal */}
          {editingRound && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
              <div className="relative w-full max-w-md bg-card rounded-lg shadow-lg border border-border">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Edit Round
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Round Name
                      </label>
                      <input
                        type="text"
                        value={editingRound.name}
                        onChange={(e) =>
                          setEditingRound({
                            ...editingRound,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-input bg-background rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Round Number
                      </label>
                      <input
                        type="number"
                        value={editingRound.roundNumber}
                        onChange={(e) =>
                          setEditingRound({
                            ...editingRound,
                            roundNumber: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full px-3 py-2 border border-input bg-background rounded-lg"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="edit-completed"
                        checked={editingRound.completed}
                        onChange={(e) =>
                          setEditingRound({
                            ...editingRound,
                            completed: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-input"
                      />
                      <label
                        htmlFor="edit-completed"
                        className="text-sm text-muted-foreground"
                      >
                        Mark as completed
                      </label>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-border flex items-center justify-end gap-3">
                  <button
                    onClick={() => setEditingRound(null)}
                    className="px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleSaveRound(editingRound);
                      setEditingRound(null);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
