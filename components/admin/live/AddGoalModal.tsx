"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  X,
  Target,
  User,
  Clock,
  Award,
  Check,
  ChevronDown,
} from "lucide-react";
import { FixtureTeamType } from "@/types/v1.football-fixture.types";
import { FixtureTimelineGoalType } from "@/types/v1.football-fixture.types";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  homeTeamName: string;
  awayTeamName: string;
  currentMinute: number;
  players: Array<{
    id: string;
    name: string;
    shirtNumber: number;
    position: string;
    team: FixtureTeamType;
  }>;
}

export default function AddGoalModal({
  isOpen,
  onClose,
  onSubmit,
  homeTeamName,
  awayTeamName,
  currentMinute,
  players,
}: AddGoalModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    team: FixtureTeamType.HOME,
    player: "",
    time: currentMinute,
    assist: "",
    goalType: FixtureTimelineGoalType.REGULAR,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        team: FixtureTeamType.HOME,
        player: "",
        time: currentMinute,
        assist: "",
        goalType: FixtureTimelineGoalType.REGULAR,
      });
    }
  }, [isOpen, currentMinute]);

  const handleSubmit = async () => {
    if (!formData.player) {
      toast.error("Please select a player");
      return;
    }

    if (formData.time < 0 || formData.time > 120) {
      toast.error("Please enter a valid minute (0-120)");
      return;
    }

    try {
      setLoading(true);
      const selectedPlayer = players.find((p) => p.id === formData.player);

      await onSubmit({
        player: formData.player,
        team: formData.team,
        time: formData.time,
        assist: formData.assist || undefined,
        goalType: formData.goalType,
        temporaryPlayerName: selectedPlayer?.name,
      });

      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to add goal");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Add Goal
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    team: FixtureTeamType.HOME,
                    player: "",
                  })
                }
                className={`flex-1 px-4 py-3 rounded-lg transition-colors ${formData.team === FixtureTeamType.HOME ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
              >
                {homeTeamName}
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    team: FixtureTeamType.AWAY,
                    player: "",
                  })
                }
                className={`flex-1 px-4 py-3 rounded-lg transition-colors ${formData.team === FixtureTeamType.AWAY ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
              >
                {awayTeamName}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Scorer
              </label>
              <div className="relative">
                <select
                  value={formData.player}
                  onChange={(e) =>
                    setFormData({ ...formData, player: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring"
                  disabled={loading}
                >
                  <option value="">Select player...</option>
                  {players.filter(player => player.team === formData.team).map((player) => (
                    <option key={player.id} value={player.id}>
                      #{player.shirtNumber} - {player.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Assist (Optional)
              </label>
              <div className="relative">
                <select
                  value={formData.assist}
                  onChange={(e) =>
                    setFormData({ ...formData, assist: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring"
                  disabled={loading}
                >
                  <option value="">No assist</option>
                  {players
                    .filter((p) => p.id !== formData.player && p.team === formData.team)
                    .map((player) => (
                      <option key={player.id} value={player.id}>
                        #{player.shirtNumber} - {player.name}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Minute
              </label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      time: parseInt(e.target.value) || 0,
                    })
                  }
                  className="flex-1 px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  value: FixtureTimelineGoalType.REGULAR,
                  label: "Regular",
                  icon: "⚽",
                },
                {
                  value: FixtureTimelineGoalType.PENALTY,
                  label: "Penalty",
                  icon: "🎯",
                },
                {
                  value: FixtureTimelineGoalType.FREEKICK,
                  label: "Free Kick",
                  icon: "🎯",
                },
                {
                  value: FixtureTimelineGoalType.HEADER,
                  label: "Header",
                  icon: "👤",
                },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      goalType: type.value as FixtureTimelineGoalType,
                    })
                  }
                  disabled={loading}
                  className={`px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${formData.goalType === type.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-input rounded-lg hover:bg-accent transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.player}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Add Goal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
