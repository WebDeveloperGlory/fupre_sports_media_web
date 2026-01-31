"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { footballPlayerApi } from "@/lib/api/v1/football-player.api";
import { FootballPlayerResponse } from "@/lib/types/v1.response.types";
import { UpdateCareerStatsDto } from "@/lib/types/v1.payload.types";
import { X, BarChart3, Loader2 } from "lucide-react";

interface UpdateCareerStatsModalProps {
  player: FootballPlayerResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdateCareerStatsModal({
  player,
  isOpen,
  onClose,
  onSuccess,
}: UpdateCareerStatsModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateCareerStatsDto>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await footballPlayerApi.updateCareerStats(
        player.id,
        formData,
      );
      toast.success(response.message || "Career stats updated successfully");
      onSuccess();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to update career stats");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Update Career Statistics
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Update overall career stats for {player.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Career Statistics
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Appearances */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Appearances
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.appearances || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appearances: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              {/* Goals */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Total Goals
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalGoals || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalGoals: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              {/* Assists */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Assists
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalAssists || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalAssists: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              {/* Clean Sheets */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Clean Sheets
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalCleanSheets || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalCleanSheets: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              {/* Yellow Cards */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Yellow Cards
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalYellowCards || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalYellowCards: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              {/* Red Cards */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Red Cards
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalRedCards || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalRedCards: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              {/* MOTM */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Man of the Match
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalMOTM || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalMOTM: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              {/* Minutes Played */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Minutes Played
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minutesPlayed || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minutesPlayed: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Stats"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
