"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { footballPlayerApi } from "@/lib/api/v1/football-player.api";
import { FootballPlayerResponse } from "@/lib/types/v1.response.types";
import { AwardPlayerDto } from "@/lib/types/v1.payload.types";
import { X, Award, Calendar, Loader2 } from "lucide-react";

interface AwardPlayerModalProps {
  player: FootballPlayerResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AwardPlayerModal({
  player,
  isOpen,
  onClose,
  onSuccess,
}: AwardPlayerModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AwardPlayerDto>({
    title: "",
    season: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.season) {
      toast.error("Title and season are required");
      return;
    }

    setLoading(true);
    try {
      const response = await footballPlayerApi.awardPlayer(player.id, formData);
      toast.success(response.message || "Award added successfully");
      onSuccess();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to add award");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      season: "",
      description: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Add Award</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add an award for {player.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Award Title *
            </label>
            <div className="relative">
              <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="e.g., Player of the Month"
                required
              />
            </div>
          </div>

          {/* Season */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Season *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.season}
                onChange={(e) =>
                  setFormData({ ...formData, season: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="e.g., 2023/24"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent min-h-24"
              placeholder="Award description..."
            />
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
                  Adding...
                </>
              ) : (
                "Add Award"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
