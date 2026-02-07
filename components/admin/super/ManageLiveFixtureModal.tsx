"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { footballLiveApi } from "@/lib/api/v1/football-live.api";
import { LiveFixtureResponse } from "@/lib/types/v1.response.types";
import { LiveStatus } from "@/types/v1.football-live.types";
import { liveFixtureHelpers } from "@/lib/api/v1/football-live.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/v1/dialogue";
import { Button } from "@/components/ui/v1/button";
import { Input } from "@/components/ui/v1/input";
import { Label } from "@/components/ui/v1/label";
import { Badge } from "@/components/ui/v1/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Zap,
  Clock,
  Goal,
  Repeat,
  Flag,
  Video,
  BarChart3,
  MessageSquare,
  Save,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  Square,
} from "lucide-react";
import { FixtureCommentaryType, FixtureTeamType, FixtureTimelineType } from "@/types/v1.football-fixture.types";

interface ManageLiveFixtureModalProps {
  fixture: LiveFixtureResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MATCH_EVENTS = [
  {
    type: FixtureTimelineType.GOAL,
    label: "Goal",
    icon: Goal,
    color: "bg-emerald-500",
  },
  {
    type: FixtureTimelineType.YELLOWCARD,
    label: "Yellow Card",
    icon: Square,
    color: "bg-yellow-500",
  },
  {
    type: FixtureTimelineType.REDCARD,
    label: "Red Card",
    icon: Square,
    color: "bg-red-500",
  },
  {
    type: FixtureTimelineType.SUBSTITUTION,
    label: "Substitution",
    icon: Repeat,
    color: "bg-blue-500",
  },
  {
    type: FixtureTimelineType.CORNER,
    label: "Corner",
    icon: Flag,
    color: "bg-purple-500",
  },
  {
    type: FixtureTimelineType.INJURY,
    label: "Injury",
    icon: Flag,
    color: "bg-amber-500",
  },
];

export function ManageLiveFixtureModal({
  fixture,
  isOpen,
  onClose,
  onSuccess,
}: ManageLiveFixtureModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "control" | "events" | "commentary" | "stats" | "streams"
  >("control");
  const [matchData, setMatchData] = useState({
    status: fixture.status,
    currentMinute: fixture.currentMinute,
    injuryTime: fixture.injuryTime,
    homeScore: fixture.result.homeScore,
    awayScore: fixture.result.awayScore,
    halftimeHomeScore: fixture.result.halftimeHomeScore || 0,
    halftimeAwayScore: fixture.result.halftimeAwayScore || 0,
  });

  const [newEvent, setNewEvent] = useState({
    type: FixtureTimelineType.GOAL,
    team: FixtureTeamType.HOME,
    minute: fixture.currentMinute,
    injuryTime: false,
    description: "",
    player: "",
    relatedPlayer: "",
  });

  const [newCommentary, setNewCommentary] = useState({
    minute: fixture.currentMinute,
    injuryTime: false,
    type: FixtureCommentaryType.REGULAR,
    text: "",
  });

  const [newStream, setNewStream] = useState({
    platform: "",
    url: "",
    isOfficial: false,
    requiresSubscription: false,
  });

  const isActive = liveFixtureHelpers.isMatchActive(fixture.status);
  const homeName =
    fixture.homeTeam?.name || fixture.temporaryHomeTeamName || "Home";
  const awayName =
    fixture.awayTeam?.name || fixture.temporaryAwayTeamName || "Away";

  const handleMatchDataChange = (field: keyof typeof matchData, value: any) => {
    setMatchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateMatchStatus = async () => {
    try {
      setLoading(true);
      const response = await footballLiveApi.updateStatus(fixture.id, {
        status: matchData.status,
        currentMinute: matchData.currentMinute,
        injuryTime: matchData.injuryTime,
      });
      toast.success("Match status updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update match status");
    } finally {
      setLoading(false);
    }
  };

  const updateMatchScore = async () => {
    try {
      setLoading(true);
      const response = await footballLiveApi.updateScore(fixture.id, {
        homeScore: matchData.homeScore,
        awayScore: matchData.awayScore,
        halftimeHomeScore: matchData.halftimeHomeScore,
        halftimeAwayScore: matchData.halftimeAwayScore,
      });
      toast.success("Match score updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update match score");
    } finally {
      setLoading(false);
    }
  };

  const addMatchEvent = async () => {
    try {
      if (!newEvent.description.trim()) {
        toast.error("Event description is required");
        return;
      }

      const payload = {
        type: newEvent.type,
        team: newEvent.team,
        minute: newEvent.minute,
        injuryTime: newEvent.injuryTime,
        description: newEvent.description,
        player: newEvent.player || undefined,
        relatedPlayer: newEvent.relatedPlayer || undefined,
      };

      const response = await footballLiveApi.addTimelineEvent(
        fixture.id,
        payload,
      );
      toast.success("Match event added");
      setNewEvent({
        type: FixtureTimelineType.GOAL,
        team: FixtureTeamType.HOME,
        minute: fixture.currentMinute,
        injuryTime: false,
        description: "",
        player: "",
        relatedPlayer: "",
      });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to add match event");
    }
  };

  const addCommentary = async () => {
    try {
      if (!newCommentary.text.trim()) {
        toast.error("Commentary text is required");
        return;
      }

      const response = await footballLiveApi.addCommentary(
        fixture.id,
        newCommentary,
      );
      toast.success("Commentary added");
      setNewCommentary({
        minute: fixture.currentMinute,
        injuryTime: false,
        type: FixtureCommentaryType.REGULAR,
        text: "",
      });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to add commentary");
    }
  };

  const addStreamLink = async () => {
    try {
      if (!newStream.platform.trim() || !newStream.url.trim()) {
        toast.error("Platform and URL are required");
        return;
      }

      const response = await footballLiveApi.addStreamLink(
        fixture.id,
        newStream,
      );
      toast.success("Stream link added");
      setNewStream({
        platform: "",
        url: "",
        isOfficial: false,
        requiresSubscription: false,
      });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to add stream link");
    }
  };

  const endMatch = async () => {
    if (!confirm("Are you sure you want to end this match?")) return;

    try {
      setLoading(true);
      const response = await footballLiveApi.endFixture(fixture.id);
      toast.success("Match ended successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to end match");
    } finally {
      setLoading(false);
    }
  };

  const incrementMinute = () => {
    handleMatchDataChange(
      "currentMinute",
      Math.min(matchData.currentMinute + 1, 120),
    );
  };

  const decrementMinute = () => {
    handleMatchDataChange(
      "currentMinute",
      Math.max(matchData.currentMinute - 1, 0),
    );
  };

  const incrementHomeScore = () => {
    handleMatchDataChange("homeScore", matchData.homeScore + 1);
  };

  const decrementHomeScore = () => {
    handleMatchDataChange("homeScore", Math.max(matchData.homeScore - 1, 0));
  };

  const incrementAwayScore = () => {
    handleMatchDataChange("awayScore", matchData.awayScore + 1);
  };

  const decrementAwayScore = () => {
    handleMatchDataChange("awayScore", Math.max(matchData.awayScore - 1, 0));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Zap className="h-5 w-5 text-red-500" />
                Live Match Control
              </DialogTitle>
              <DialogDescription>
                {homeName} vs {awayName} • {fixture.stadium}
              </DialogDescription>
            </div>
            <Badge className="bg-red-500 text-white">
              <Zap className="h-3 w-3 mr-1" />
              LIVE
            </Badge>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs defaultValue="control" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="control">Match Control</TabsTrigger>
            <TabsTrigger value="events">Match Events</TabsTrigger>
            <TabsTrigger value="commentary">Commentary</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="streams">Streams</TabsTrigger>
          </TabsList>

          {/* Match Control Tab */}
          <TabsContent value="control" className="space-y-6">
            {/* Live Score Control */}
            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Live Score Control
              </h3>
              <div className="flex items-center justify-center gap-8">
                {/* Home Team */}
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-foreground mb-4">
                    {homeName}
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementHomeScore}
                      className="h-12 w-12"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <div className="text-5xl font-bold">
                      {matchData.homeScore}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementHomeScore}
                      className="h-12 w-12"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Score Separator */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-muted-foreground">
                    -
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Score
                  </div>
                </div>

                {/* Away Team */}
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-foreground mb-4">
                    {awayName}
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementAwayScore}
                      className="h-12 w-12"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <div className="text-5xl font-bold">
                      {matchData.awayScore}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementAwayScore}
                      className="h-12 w-12"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button onClick={updateMatchScore} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Update Score
                </Button>
              </div>
            </div>

            {/* Match Time Control */}
            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Match Time Control
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <Label>Current Minute</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementMinute}
                      className="h-12 w-12"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={matchData.currentMinute}
                        onChange={(e) =>
                          handleMatchDataChange(
                            "currentMinute",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        min="0"
                        max="120"
                        className="text-center text-2xl h-12"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementMinute}
                      className="h-12 w-12"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Injury Time (minutes)</Label>
                  <Input
                    type="number"
                    value={matchData.injuryTime}
                    onChange={(e) =>
                      handleMatchDataChange(
                        "injuryTime",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    min="0"
                    max="10"
                    className="h-12 text-center"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Match Status</Label>
                  <select
                    value={matchData.status}
                    onChange={(e) =>
                      handleMatchDataChange(
                        "status",
                        e.target.value as LiveStatus,
                      )
                    }
                    className="w-full px-3 py-3 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    {Object.values(LiveStatus).map((status) => (
                      <option key={status} value={status}>
                        {status.replace("-", " ").toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button onClick={updateMatchStatus} disabled={loading}>
                  <Clock className="h-4 w-4 mr-2" />
                  Update Match Time
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MATCH_EVENTS.map((event) => (
                  <Button
                    key={event.type}
                    variant="outline"
                    className="h-24 flex-col"
                    onClick={() => {
                      setNewEvent({
                        ...newEvent,
                        type: event.type,
                        minute: matchData.currentMinute,
                      });
                      setActiveTab("events");
                    }}
                  >
                    <event.icon
                      className={`h-6 w-6 mb-2 ${event.color.replace("bg-", "text-")}`}
                    />
                    <span className="text-sm">{event.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-500/20 p-6">
              <h3 className="font-semibold text-red-600 dark:text-red-400 mb-4">
                Danger Zone
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-red-600 dark:text-red-400">
                  These actions are irreversible. Use with caution.
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="destructive"
                    onClick={endMatch}
                    disabled={loading}
                    className="flex-1"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    End Match
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Match Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Add Match Event
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Event Type</Label>
                    <select
                      value={newEvent.type}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          type: e.target.value as FixtureTimelineType,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-lg"
                    >
                      {MATCH_EVENTS.map((event) => (
                        <option key={event.type} value={event.type}>
                          {event.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Team</Label>
                    <div className="flex gap-2 mt-1">
                      <Button
                        type="button"
                        variant={
                          newEvent.team === FixtureTeamType.HOME
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setNewEvent({
                            ...newEvent,
                            team: FixtureTeamType.HOME,
                          })
                        }
                        className="flex-1"
                      >
                        {homeName}
                      </Button>
                      <Button
                        type="button"
                        variant={
                          newEvent.team === FixtureTeamType.AWAY
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setNewEvent({
                            ...newEvent,
                            team: FixtureTeamType.AWAY,
                          })
                        }
                        className="flex-1"
                      >
                        {awayName}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Minute</Label>
                    <Input
                      type="number"
                      value={newEvent.minute}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          minute: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                      max="120"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="injuryTime"
                      checked={newEvent.injuryTime}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          injuryTime: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="injuryTime" className="cursor-pointer">
                      Injury Time Event
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Player (Optional)</Label>
                    <Input
                      value={newEvent.player}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, player: e.target.value })
                      }
                      placeholder="Player name"
                    />
                  </div>

                  <div>
                    <Label>Related Player (Optional)</Label>
                    <Input
                      value={newEvent.relatedPlayer}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          relatedPlayer: e.target.value,
                        })
                      }
                      placeholder="Assist, foul by, etc."
                    />
                  </div>

                  <div>
                    <Label>Description *</Label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the event..."
                      className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-lg min-h-[100px] resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button onClick={addMatchEvent} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Match Event
                </Button>
              </div>
            </div>

            {/* Recent Events */}
            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Recent Events
              </h3>
              {fixture.timeline.length > 0 ? (
                <div className="space-y-3">
                  {fixture.timeline
                    .slice()
                    .reverse()
                    .map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          {(() => {
                            const eventConfig = MATCH_EVENTS.find(
                              (e) => e.type === event.type,
                            );
                            return eventConfig ? (
                              <eventConfig.icon
                                className={`h-4 w-4 ${eventConfig.color.replace("bg-", "text-")}`}
                              />
                            ) : null;
                          })()}
                          <div>
                            <div className="font-medium">
                              {event.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {event.team === FixtureTeamType.HOME
                                ? homeName
                                : awayName}
                              {event.player && ` • ${event.player}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{event.minute}'</div>
                          <div className="text-xs text-muted-foreground">
                            {event.injuryTime && "Injury time"}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No events recorded yet
                </p>
              )}
            </div>
          </TabsContent>

          {/* Commentary Tab */}
          <TabsContent value="commentary" className="space-y-6">
            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Add Live Commentary
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Minute</Label>
                    <Input
                      type="number"
                      value={newCommentary.minute}
                      onChange={(e) =>
                        setNewCommentary({
                          ...newCommentary,
                          minute: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                      max="120"
                    />
                  </div>

                  <div>
                    <Label>Type</Label>
                    <select
                      value={newCommentary.type}
                      onChange={(e) =>
                        setNewCommentary({
                          ...newCommentary,
                          type: e.target.value as any,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-lg"
                    >
                      <option value={FixtureCommentaryType.REGULAR}>Regular</option>
                      <option value={FixtureCommentaryType.IMPORTANT}>Important</option>
                      <option value={FixtureCommentaryType.HIGHLIGHT}>Highlight</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="commentaryInjuryTime"
                      checked={newCommentary.injuryTime}
                      onChange={(e) =>
                        setNewCommentary({
                          ...newCommentary,
                          injuryTime: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor="commentaryInjuryTime"
                      className="cursor-pointer"
                    >
                      Injury Time
                    </Label>
                  </div>
                </div>

                <div>
                  <Label>Commentary Text *</Label>
                  <textarea
                    value={newCommentary.text}
                    onChange={(e) =>
                      setNewCommentary({
                        ...newCommentary,
                        text: e.target.value,
                      })
                    }
                    placeholder="Enter live commentary..."
                    className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-lg min-h-[120px] resize-none"
                    required
                  />
                </div>

                <Button onClick={addCommentary} className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Commentary
                </Button>
              </div>
            </div>

            {/* Recent Commentary */}
            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Recent Commentary
              </h3>
              {fixture.commentary.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {fixture.commentary
                    .slice()
                    .reverse()
                    .map((comment, index) => (
                      <div
                        key={index}
                        className="space-y-2 p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {comment.minute}'
                            </span>
                            {comment.injuryTime && (
                              <span className="text-xs text-amber-600">
                                Injury time
                              </span>
                            )}
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${
                                comment.type === "important"
                                  ? "bg-red-500/10 text-red-600"
                                  : comment.type === "highlight"
                                    ? "bg-amber-500/10 text-amber-600"
                                    : "bg-blue-500/10 text-blue-600"
                              }`}
                            >
                              {comment.type}
                            </span>
                          </div>
                        </div>
                        <p className="text-foreground">{comment.text}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No commentary yet
                </p>
              )}
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Update Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Home Team Stats */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">{homeName}</h4>
                  {Object.entries(fixture.statistics.home).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <Label className="capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </Label>
                        <Input
                          type="number"
                          defaultValue={value}
                          className="w-24"
                          min="0"
                        />
                      </div>
                    ),
                  )}
                </div>

                {/* Away Team Stats */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">{awayName}</h4>
                  {Object.entries(fixture.statistics.away).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <Label className="capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </Label>
                        <Input
                          type="number"
                          defaultValue={value}
                          className="w-24"
                          min="0"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-6">
                <Button className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Update Statistics
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Streams Tab */}
          <TabsContent value="streams" className="space-y-6">
            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Add Stream Link
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Platform *</Label>
                    <Input
                      value={newStream.platform}
                      onChange={(e) =>
                        setNewStream({ ...newStream, platform: e.target.value })
                      }
                      placeholder="YouTube, Twitch, etc."
                      required
                    />
                  </div>

                  <div>
                    <Label>URL *</Label>
                    <Input
                      value={newStream.url}
                      onChange={(e) =>
                        setNewStream({ ...newStream, url: e.target.value })
                      }
                      placeholder="https://..."
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isOfficial"
                      checked={newStream.isOfficial}
                      onChange={(e) =>
                        setNewStream({
                          ...newStream,
                          isOfficial: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="isOfficial" className="cursor-pointer">
                      Official Stream
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="requiresSubscription"
                      checked={newStream.requiresSubscription}
                      onChange={(e) =>
                        setNewStream({
                          ...newStream,
                          requiresSubscription: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor="requiresSubscription"
                      className="cursor-pointer"
                    >
                      Requires Subscription
                    </Label>
                  </div>
                </div>

                <Button onClick={addStreamLink} className="w-full">
                  <Video className="h-4 w-4 mr-2" />
                  Add Stream Link
                </Button>
              </div>
            </div>

            {/* Existing Streams */}
            <div className="rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Existing Streams
              </h3>
              {fixture.streamLinks && fixture.streamLinks.length > 0 ? (
                <div className="space-y-3">
                  {fixture.streamLinks.map((stream, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <Video className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{stream.platform}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-md">
                            {stream.url}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {stream.isOfficial && (
                              <Badge variant="default" className="text-xs">
                                Official
                              </Badge>
                            )}
                            {stream.requiresSubscription && (
                              <Badge variant="outline" className="text-xs">
                                Premium
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No streams added yet
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-between gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                // Refresh data
                onSuccess();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {isActive && (
              <Button
                variant="destructive"
                onClick={endMatch}
                disabled={loading}
              >
                <Zap className="h-4 w-4 mr-2" />
                End Match
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
