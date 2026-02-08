"use client";

import { useState } from "react";
import {
  X,
  Trash2,
  Edit,
  Clock,
  Award,
  Target,
  Circle,
} from "lucide-react";
import { FixtureTeamType } from "@/types/v1.football-fixture.types";

export interface GoalScorer {
  id: string;
  player?: { name: string };
  temporaryPlayerName?: string;
  team: FixtureTeamType;
  time: number;
  assist?: { name: string };
  temporaryAssistName?: string;
  goalType?: string;
}

interface GoalScorersModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalScorers: GoalScorer[];
  homeTeamName: string;
  awayTeamName: string;
  onDeleteGoal: (scorerId: string) => Promise<void>;
  onEditGoal: (scorer: GoalScorer) => void;
}

export default function GoalScorersModal({
  isOpen,
  onClose,
  goalScorers,
  homeTeamName,
  awayTeamName,
  onDeleteGoal,
  onEditGoal,
}: GoalScorersModalProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (scorerId: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      setDeletingId(scorerId);
      await onDeleteGoal(scorerId);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  const homeGoals = goalScorers.filter((g) => g.team === FixtureTeamType.HOME);
  const awayGoals = goalScorers.filter((g) => g.team === FixtureTeamType.AWAY);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Goal Scorers
                </h3>
                <p className="text-sm text-muted-foreground">
                  {goalScorers.length} goal{goalScorers.length !== 1 ? "s" : ""}{" "}
                  recorded
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="p-6">
            {/* Home Team Goals */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <h4 className="font-semibold text-foreground">
                  {homeTeamName}
                </h4>
                <span className="text-sm text-muted-foreground">
                  ({homeGoals.length})
                </span>
              </div>

              {homeGoals.length > 0 ? (
                <div className="space-y-3">
                  {homeGoals.map((scorer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Circle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {scorer.player?.name ||
                              scorer.temporaryPlayerName ||
                              "Unknown Player"}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {scorer.time}'
                            </span>
                            {scorer.assist || scorer.temporaryAssistName ? (
                              <span className="flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                Assist:{" "}
                                {scorer.assist?.name ||
                                  scorer.temporaryAssistName}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditGoal(scorer)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="Edit goal"
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(scorer.id)}
                          disabled={deletingId === scorer.id}
                          className="p-2 hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
                          title="Delete goal"
                        >
                          {deletingId === scorer.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Circle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No goals yet</p>
                </div>
              )}
            </div>

            {/* Away Team Goals */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-secondary"></div>
                <h4 className="font-semibold text-foreground">
                  {awayTeamName}
                </h4>
                <span className="text-sm text-muted-foreground">
                  ({awayGoals.length})
                </span>
              </div>

              {awayGoals.length > 0 ? (
                <div className="space-y-3">
                  {awayGoals.map((scorer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                          <Circle className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {scorer.player?.name ||
                              scorer.temporaryPlayerName ||
                              "Unknown Player"}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {scorer.time}'
                            </span>
                            {scorer.assist || scorer.temporaryAssistName ? (
                              <span className="flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                Assist:{" "}
                                {scorer.assist?.name ||
                                  scorer.temporaryAssistName}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditGoal(scorer)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="Edit goal"
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(scorer.id)}
                          disabled={deletingId === scorer.id}
                          className="p-2 hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
                          title="Delete goal"
                        >
                          {deletingId === scorer.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Circle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No goals yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
