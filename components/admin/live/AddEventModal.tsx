"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  X,
  Flag,
  Clock,
  Check,
  ChevronDown,
  AlertTriangle,
  Ban,
} from "lucide-react";
import { FixtureTeamType } from "@/types/v1.football-fixture.types";
import {
  FixtureTimelineType,
  FixtureTimelineCardType,
} from "@/types/v1.football-fixture.types";

interface AddEventModalProps {
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

export default function AddEventModal({
  isOpen,
  onClose,
  onSubmit,
  homeTeamName,
  awayTeamName,
  currentMinute,
  players,
}: AddEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: FixtureTimelineType.YELLOWCARD,
    team: FixtureTeamType.HOME,
    player: "",
    relatedPlayer: "",
    minute: currentMinute,
    injuryTime: false,
    description: "",
    cardType: FixtureTimelineCardType.FIRSTYELLOW,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: FixtureTimelineType.YELLOWCARD,
        team: FixtureTeamType.HOME,
        player: "",
        relatedPlayer: "",
        minute: currentMinute,
        injuryTime: false,
        description: "",
        cardType: FixtureTimelineCardType.FIRSTYELLOW,
      });
    }
  }, [isOpen, currentMinute]);

  const eventTypes = [
    {
      value: FixtureTimelineType.YELLOWCARD,
      label: "Yellow Card",
      icon: "🟨",
      color: "bg-yellow-500",
    },
    {
      value: FixtureTimelineType.REDCARD,
      label: "Red Card",
      icon: "🟥",
      color: "bg-red-500",
    },
    {
      value: FixtureTimelineType.CORNER,
      label: "Corner",
      icon: "↩️",
      color: "bg-blue-500",
    },
    {
      value: FixtureTimelineType.OFFSIDE,
      label: "Offside",
      icon: "🚩",
      color: "bg-orange-500",
    },
    {
      value: FixtureTimelineType.PENALTYAWARDED,
      label: "Penalty",
      icon: "⚖️",
      color: "bg-purple-500",
    },
    {
      value: FixtureTimelineType.VARDECISION,
      label: "VAR",
      icon: "📺",
      color: "bg-green-500",
    },
    {
      value: FixtureTimelineType.INJURY,
      label: "Injury",
      icon: "🏥",
      color: "bg-rose-500",
    },
  ];

  const cardTypes = [
    {
      value: FixtureTimelineCardType.FIRSTYELLOW,
      label: "First Yellow",
      icon: "🟨",
    },
    {
      value: FixtureTimelineCardType.SECONDYELLOW,
      label: "Second Yellow",
      icon: "🟨🟨",
    },
    {
      value: FixtureTimelineCardType.STRAIGHTRED,
      label: "Straight Red",
      icon: "🟥",
    },
  ];

  const requiresPlayer = [
    FixtureTimelineType.YELLOWCARD,
    FixtureTimelineType.REDCARD,
    FixtureTimelineType.INJURY,
    FixtureTimelineType.PENALTYAWARDED,
  ].includes(formData.type);

  const requiresCardType = [
    FixtureTimelineType.YELLOWCARD,
    FixtureTimelineType.REDCARD,
  ].includes(formData.type);

  const getDefaultDescription = () => {
    const playerName =
      players.find((p) => p.id === formData.player)?.name || "Player";

    switch (formData.type) {
      case FixtureTimelineType.YELLOWCARD:
        return `${playerName} receives a yellow card`;
      case FixtureTimelineType.REDCARD:
        return `${playerName} receives a red card`;
      case FixtureTimelineType.CORNER:
        return "Corner kick awarded";
      case FixtureTimelineType.OFFSIDE:
        return "Offside detected";
      case FixtureTimelineType.PENALTYAWARDED:
        return "Penalty awarded";
      case FixtureTimelineType.VARDECISION:
        return "VAR check in progress";
      case FixtureTimelineType.INJURY:
        return `${playerName} goes down injured`;
      default:
        return "Match event";
    }
  };

  const handleSubmit = async () => {
    if (requiresPlayer && !formData.player) {
      toast.error("Please select a player for this event");
      return;
    }

    if (formData.minute < 0 || formData.minute > 120) {
      toast.error("Please enter a valid minute (0-120)");
      return;
    }

    try {
      setLoading(true);
      const selectedPlayer = players.find((p) => p.id === formData.player);

      const payload: any = {
        type: formData.type,
        team: formData.team,
        minute: formData.minute,
        injuryTime: formData.injuryTime,
        description: formData.description || getDefaultDescription(),
      };

      if (formData.player) {
        payload.player = formData.player;
        payload.temporaryPlayerName = selectedPlayer?.name;
      }

      if (requiresCardType) {
        payload.cardType = formData.cardType;
      }

      await onSubmit(payload);

      toast.success("Event added successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Flag className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Add Match Event
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
            {/* Event Type Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Event Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {eventTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: type.value as FixtureTimelineType,
                      })
                    }
                    disabled={loading}
                    className={`px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${formData.type === type.value ? `${type.color} text-white` : "bg-muted hover:bg-accent"}`}
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

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
            </div>

            {/* Player Selection (if required) */}
            {requiresPlayer && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Player
                </label>
                <div className="relative">
                  <select
                    value={formData.player}
                    onChange={(e) =>
                      setFormData({ ...formData, player: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                    disabled={loading}
                  >
                    <option value="">Select player...</option>
                    {players.filter(player => player.team === formData.team).map((player) => (
                      <option key={player.id} value={player.id}>
                        #{player.shirtNumber} - {player.name} ({player.position}
                        )
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            )}

            {/* Card Type (for cards) */}
            {requiresCardType && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Card Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {cardTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          cardType: type.value as FixtureTimelineCardType,
                        })
                      }
                      disabled={loading}
                      className={`px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${formData.cardType === type.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
                    >
                      <span className="text-lg">{type.icon}</span>
                      <span className="text-xs">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Time */}
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
                    setFormData({
                      ...formData,
                      injuryTime: !formData.injuryTime,
                    })
                  }
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${formData.injuryTime ? "bg-amber-500 text-white" : "bg-muted hover:bg-accent"}`}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Injury Time</span>
                </button>
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
                placeholder={getDefaultDescription()}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={3}
                disabled={loading}
              />
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
                disabled={loading || (requiresPlayer && !formData.player)}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Add Event
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
