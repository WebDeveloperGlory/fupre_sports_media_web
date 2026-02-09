"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  X,
  BarChart3,
  Check,
  Target,
  Flag,
  User,
  Clock,
} from "lucide-react";
import { FixtureTeamType } from "@/types/v1.football-fixture.types";

interface UpdateStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  currentStats: {
    home: {
      shotsOnTarget: number;
      shotsOffTarget: number;
      fouls: number;
      yellowCards: number;
      redCards: number;
      offsides: number;
      corners: number;
      possessionTime: number;
    };
    away: {
      shotsOnTarget: number;
      shotsOffTarget: number;
      fouls: number;
      yellowCards: number;
      redCards: number;
      offsides: number;
      corners: number;
      possessionTime: number;
    };
  };
  homeTeamName: string;
  awayTeamName: string;
}

export default function UpdateStatsModal({
  isOpen,
  onClose,
  onSubmit,
  currentStats,
  homeTeamName,
  awayTeamName,
}: UpdateStatsModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTeam, setActiveTeam] = useState<FixtureTeamType>(
    FixtureTeamType.HOME,
  );
  const [formData, setFormData] = useState({
    home: { ...currentStats.home },
    away: { ...currentStats.away },
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await onSubmit({
        home: formData.home,
        away: formData.away,
      });

      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update statistics");
    } finally {
      setLoading(false);
    }
  };

  const updateStat = (team: FixtureTeamType, stat: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [team]: {
        ...prev[team],
        [stat]: Math.max(0, value),
      },
    }));
  };

  const incrementStat = (team: FixtureTeamType, stat: string) => {
    updateStat(
      team,
      stat,
      formData[team][stat as keyof (typeof formData)[typeof team]] + 1,
    );
  };

  const decrementStat = (team: FixtureTeamType, stat: string) => {
    updateStat(
      team,
      stat,
      formData[team][stat as keyof (typeof formData)[typeof team]] - 1,
    );
  };

  if (!isOpen) return null;

  const currentTeamStats = formData[activeTeam];
  const isHomeTeam = activeTeam === FixtureTeamType.HOME;

  const statCategories = [
    {
      label: "Shots",
      stats: [
        {
          key: "shotsOnTarget",
          label: "Shots on Target",
          icon: Target,
          color: "text-green-500",
        },
        {
          key: "shotsOffTarget",
          label: "Shots off Target",
          icon: Target,
          color: "text-red-500",
        },
      ],
    },
    {
      label: "Set Pieces",
      stats: [
        {
          key: "corners",
          label: "Corners",
          icon: Flag,
          color: "text-blue-500",
        },
      ],
    },
    {
      label: "Discipline",
      stats: [
        { key: "fouls", label: "Fouls", icon: User, color: "text-amber-500" },
        {
          key: "yellowCards",
          label: "Yellow Cards",
          icon: Flag,
          color: "text-yellow-500",
        },
        {
          key: "redCards",
          label: "Red Cards",
          icon: Flag,
          color: "text-red-500",
        },
        {
          key: "offsides",
          label: "Offsides",
          icon: Clock,
          color: "text-purple-500",
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Update Match Statistics
                </h3>
                <p className="text-sm text-muted-foreground">
                  Adjust team statistics
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {/* Team Selection */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setActiveTeam(FixtureTeamType.HOME)}
                className={`flex-1 px-4 py-3 rounded-lg transition-colors ${isHomeTeam ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
              >
                {homeTeamName}
              </button>
              <button
                type="button"
                onClick={() => setActiveTeam(FixtureTeamType.AWAY)}
                className={`flex-1 px-4 py-3 rounded-lg transition-colors ${!isHomeTeam ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
              >
                {awayTeamName}
              </button>
            </div>

            {/* Current Team Stats */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={`h-3 w-3 rounded-full ${isHomeTeam ? "bg-primary" : "bg-secondary"}`}
                />
                <h4 className="font-medium text-foreground">
                  {isHomeTeam ? homeTeamName : awayTeamName} Statistics
                </h4>
              </div>

              {/* Stats Grid */}
              <div className="space-y-4">
                {statCategories.map((category) => (
                  <div key={category.label}>
                    <h5 className="text-sm font-medium text-muted-foreground mb-3">
                      {category.label}
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      {category.stats.map((stat) => (
                        <div
                          key={stat.key}
                          className="p-3 bg-background border border-border rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            <span className="text-xs font-medium text-muted-foreground">
                              {stat.label}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">
                              {
                                currentTeamStats[
                                  stat.key as keyof typeof currentTeamStats
                                ]
                              }
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  decrementStat(activeTeam, stat.key)
                                }
                                disabled={
                                  currentTeamStats[
                                    stat.key as keyof typeof currentTeamStats
                                  ] <= 0 || loading
                                }
                                className="px-2 py-1 border border-input rounded hover:bg-accent transition-colors disabled:opacity-50 text-xs"
                              >
                                -
                              </button>
                              <button
                                onClick={() =>
                                  incrementStat(activeTeam, stat.key)
                                }
                                disabled={loading}
                                className="px-2 py-1 border border-input rounded hover:bg-accent transition-colors disabled:opacity-50 text-xs"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Summary */}
            <div className="p-4 bg-muted/50 rounded-lg mb-6">
              <h5 className="text-sm font-medium text-foreground mb-3">
                Statistics Summary
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Shots
                    </span>
                    <span className="font-medium">
                      {formData.home.shotsOnTarget +
                        formData.home.shotsOffTarget}{" "}
                      -{" "}
                      {formData.away.shotsOnTarget +
                        formData.away.shotsOffTarget}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Corners
                    </span>
                    <span className="font-medium">
                      {formData.home.corners} - {formData.away.corners}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Fouls
                    </span>
                    <span className="font-medium">
                      {formData.home.fouls} - {formData.away.fouls}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Cards
                    </span>
                    <span className="font-medium">
                      {formData.home.yellowCards + formData.home.redCards} -{" "}
                      {formData.away.yellowCards + formData.away.redCards}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Offsides
                    </span>
                    <span className="font-medium">
                      {formData.home.offsides} - {formData.away.offsides}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Possession
                    </span>
                    <span className="font-medium">
                      {formData.home.possessionTime}% -{" "}
                      {formData.away.possessionTime}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-input rounded-lg hover:bg-accent transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Update Statistics
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
