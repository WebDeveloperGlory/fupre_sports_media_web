"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X, Users, Clock, Check, ChevronDown, ArrowRight } from "lucide-react";
import { FixtureTeamType } from "@/types/v1.football-fixture.types";

interface SubstitutionModalProps {
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
    onPitch?: boolean;
  }>;
}

export default function SubstitutionModal({
  isOpen,
  onClose,
  onSubmit,
  homeTeamName,
  awayTeamName,
  currentMinute,
  players,
}: SubstitutionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    team: FixtureTeamType.HOME,
    playerOut: "",
    playerIn: "",
    minute: currentMinute,
    injury: false,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        team: FixtureTeamType.HOME,
        playerOut: "",
        playerIn: "",
        minute: currentMinute,
        injury: false,
      });
    }
  }, [isOpen, currentMinute]);

  // Filter players based on team selection and pitch status
  const teamPlayers = players.filter((player) => {
    // This is a simplified filter - you might need to adjust based on your actual data structure
    return true;
  });

  const playersOnPitch = teamPlayers.filter(
    (player) => player.onPitch !== false,
  );
  const playersOnBench = teamPlayers.filter(
    (player) => player.onPitch === false,
  );

  const handleSubmit = async () => {
    if (!formData.playerOut) {
      toast.error("Please select player going out");
      return;
    }

    if (!formData.playerIn) {
      toast.error("Please select player coming in");
      return;
    }

    if (formData.playerOut === formData.playerIn) {
      toast.error("Cannot substitute player with themselves");
      return;
    }

    if (formData.minute < 0 || formData.minute > 120) {
      toast.error("Please enter a valid minute (0-120)");
      return;
    }

    try {
      setLoading(true);

      const playerOut = players.find((p) => p.id === formData.playerOut);
      const playerIn = players.find((p) => p.id === formData.playerIn);

      await onSubmit({
        team: formData.team,
        playerOut: formData.playerOut,
        playerIn: formData.playerIn,
        minute: formData.minute,
        injury: formData.injury,
        temporaryPlayerOutName: playerOut?.name,
        temporaryPlayerInName: playerIn?.name,
      });

      toast.success("Substitution recorded successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to record substitution");
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
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Make Substitution
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Team Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Team
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      team: FixtureTeamType.HOME,
                      playerOut: "",
                      playerIn: "",
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
                      playerOut: "",
                      playerIn: "",
                    })
                  }
                  className={`flex-1 px-4 py-3 rounded-lg transition-colors ${formData.team === FixtureTeamType.AWAY ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
                >
                  {awayTeamName}
                </button>
              </div>
            </div>

            {/* Player Out */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Player Out
              </label>
              <div className="relative">
                <select
                  value={formData.playerOut}
                  onChange={(e) =>
                    setFormData({ ...formData, playerOut: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                  disabled={loading}
                >
                  <option value="">Select player to substitute out...</option>
                  {playersOnPitch.filter(player => player.team === formData.team).map((player) => (
                    <option key={player.id} value={player.id}>
                      #{player.shirtNumber} - {player.name} ({player.position})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Player In */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Player In
              </label>
              <div className="relative">
                <select
                  value={formData.playerIn}
                  onChange={(e) =>
                    setFormData({ ...formData, playerIn: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                  disabled={loading}
                >
                  <option value="">Select substitute coming in...</option>
                  {playersOnBench.filter(player => player.team === formData.team).map((player) => (
                    <option key={player.id} value={player.id}>
                      #{player.shirtNumber} - {player.name} ({player.position})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Time and Injury */}
            <div className="grid grid-cols-2 gap-4">
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
                    value={formData.minute}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minute: parseInt(e.target.value) || 0,
                      })
                    }
                    className="flex-1 px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  &nbsp;
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, injury: !formData.injury })
                  }
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${formData.injury ? "bg-amber-500 text-white" : "bg-muted hover:bg-accent"}`}
                >
                  <span>Injury Substitution</span>
                </button>
              </div>
            </div>

            {/* Visual Substitution Arrow */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="font-medium text-foreground">
                  {players.find((p) => p.id === formData.playerOut)?.name ||
                    "Player Out"}
                </div>
                <div className="text-xs text-muted-foreground">
                  #
                  {players.find((p) => p.id === formData.playerOut)
                    ?.shirtNumber || ""}
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <div className="text-center">
                <div className="font-medium text-foreground">
                  {players.find((p) => p.id === formData.playerIn)?.name ||
                    "Player In"}
                </div>
                <div className="text-xs text-muted-foreground">
                  #
                  {players.find((p) => p.id === formData.playerIn)
                    ?.shirtNumber || ""}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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
                disabled={loading || !formData.playerOut || !formData.playerIn}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Make Substitution
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
