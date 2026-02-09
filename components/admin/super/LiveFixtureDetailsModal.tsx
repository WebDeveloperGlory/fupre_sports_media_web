"use client";

import { useState } from "react";
import { format } from "date-fns";
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
import { Badge } from "@/components/ui/v1/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/v1/tabs";
import {
  Calendar,
  MapPin,
  Target,
  Cloud,
  Thermometer,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Goal,
  Repeat,
  Flag,
  Video,
  Award,
  Zap,
  Radio,
  Heart,
  MessageSquare,
  PlayCircle,
  Square,
  Volume2,
} from "lucide-react";
import {
  FixtureTeamType,
  FixtureTimelineType,
} from "@/types/v1.football-fixture.types";
import { Button } from "@/components/ui/v1/button";

interface LiveFixtureDetailsModalProps {
  fixture: LiveFixtureResponse;
  isOpen: boolean;
  onClose: () => void;
  onManage?: () => void;
}

const STATUS_COLORS: Record<LiveStatus, string> = {
  [LiveStatus.PREMATCH]: "bg-slate-500/10 text-slate-600",
  [LiveStatus.FIRSTHALF]: "bg-blue-500/10 text-blue-600",
  [LiveStatus.HALFTIME]: "bg-amber-500/10 text-amber-600",
  [LiveStatus.SECONDHALF]: "bg-blue-500/10 text-blue-600",
  [LiveStatus.EXTRATIME]: "bg-purple-500/10 text-purple-600",
  [LiveStatus.PENALTIES]: "bg-purple-500/10 text-purple-600",
  [LiveStatus.FINISHED]: "bg-emerald-500/10 text-emerald-600",
  [LiveStatus.POSTPONED]: "bg-amber-500/10 text-amber-600",
  [LiveStatus.ABANDONED]: "bg-rose-500/10 text-rose-600",
};

const STATUS_ICONS: Record<LiveStatus, React.ReactNode> = {
  [LiveStatus.PREMATCH]: <Clock className="h-4 w-4" />,
  [LiveStatus.FIRSTHALF]: <PlayCircle className="h-4 w-4" />,
  [LiveStatus.HALFTIME]: <Clock className="h-4 w-4" />,
  [LiveStatus.SECONDHALF]: <PlayCircle className="h-4 w-4" />,
  [LiveStatus.EXTRATIME]: <Clock className="h-4 w-4" />,
  [LiveStatus.PENALTIES]: <Target className="h-4 w-4" />,
  [LiveStatus.FINISHED]: <CheckCircle className="h-4 w-4" />,
  [LiveStatus.POSTPONED]: <AlertCircle className="h-4 w-4" />,
  [LiveStatus.ABANDONED]: <XCircle className="h-4 w-4" />,
};

export function LiveFixtureDetailsModal({
  fixture,
  isOpen,
  onClose,
  onManage,
}: LiveFixtureDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "live" | "events" | "stats" | "streams"
  >("overview");

  const homeName =
    fixture.homeTeam?.name || fixture.temporaryHomeTeamName || "TBD";
  const awayName =
    fixture.awayTeam?.name || fixture.temporaryAwayTeamName || "TBD";
  const isActive = liveFixtureHelpers.isMatchActive(fixture.status);
  const matchPhase = liveFixtureHelpers.getMatchPhase(
    fixture.status,
    fixture.currentMinute,
  );
  const matchProgress = liveFixtureHelpers.getMatchProgress(
    fixture.status,
    fixture.currentMinute,
  );

  const getTimelineIcon = (type: FixtureTimelineType) => {
    switch (type) {
      case FixtureTimelineType.GOAL:
        return <Goal className="h-4 w-4 text-emerald-500" />;
      case FixtureTimelineType.YELLOWCARD:
        return <Square className="h-4 w-4 text-yellow-500" />;
      case FixtureTimelineType.REDCARD:
        return <Square className="h-4 w-4 text-red-500" />;
      case FixtureTimelineType.SUBSTITUTION:
        return <Repeat className="h-4 w-4 text-blue-500" />;
      case FixtureTimelineType.INJURY:
        return <Flag className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderLiveMatchHeader = () => (
    <div className="space-y-6">
      {/* Live Status Bar */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${isActive ? "bg-red-500/10" : "bg-slate-500/10"}`}
          >
            {isActive ? (
              <Zap className="h-5 w-5 text-red-500" />
            ) : (
              <Radio className="h-5 w-5 text-slate-500" />
            )}
          </div>
          <div>
            <div className="font-semibold text-foreground">{matchPhase}</div>
            <div className="text-sm text-muted-foreground">
              {isActive ? "Match in progress" : "Match not active"}
            </div>
          </div>
        </div>
        <Badge className={STATUS_COLORS[fixture.status]}>
          <span className="flex items-center gap-1">
            {STATUS_ICONS[fixture.status]}
            {fixture.status.charAt(0).toUpperCase() +
              fixture.status.slice(1).replace("-", " ")}
          </span>
        </Badge>
      </div>

      {/* Match Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Match Progress</span>
          <span className="font-medium">{matchProgress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${matchProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0'</span>
          <span>45'</span>
          <span>90'</span>
          <span>120'</span>
        </div>
      </div>

      {/* Live Score */}
      <div className="p-6 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center flex-1">
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
              {fixture.homeTeam?.logo ? (
                <img
                  src={fixture.homeTeam.logo}
                  alt={homeName}
                  className="h-14 w-14 rounded-lg object-cover"
                />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {fixture.homeTeam?.shorthand || homeName.substring(0, 2)}
                  </span>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-foreground mb-1">{homeName}</h3>
            {fixture.homeTeam?.department && (
              <p className="text-xs text-muted-foreground">
                {fixture.homeTeam.department.name}
              </p>
            )}
            {fixture.cheerMeter && (
              <div className="mt-2 flex items-center justify-center gap-1">
                <Heart className="h-3 w-3 text-rose-500" />
                <span className="text-xs">{fixture.cheerMeter.home}</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="text-5xl font-bold text-foreground mb-2">
              {fixture.result.homeScore} - {fixture.result.awayScore}
            </div>
            <div className="text-lg font-bold text-red-600 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {fixture.currentMinute}'
              {fixture.injuryTime > 0 && (
                <span className="text-sm">+{fixture.injuryTime}</span>
              )}
            </div>
            {fixture.result.halftimeHomeScore !== null && (
              <div className="text-sm text-muted-foreground mt-1">
                HT: {fixture.result.halftimeHomeScore}-
                {fixture.result.halftimeAwayScore}
              </div>
            )}
          </div>

          <div className="text-center flex-1">
            <div className="h-16 w-16 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-3">
              {fixture.awayTeam?.logo ? (
                <img
                  src={fixture.awayTeam.logo}
                  alt={awayName}
                  className="h-14 w-14 rounded-lg object-cover"
                />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {fixture.awayTeam?.shorthand || awayName.substring(0, 2)}
                  </span>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-foreground mb-1">{awayName}</h3>
            {fixture.awayTeam?.department && (
              <p className="text-xs text-muted-foreground">
                {fixture.awayTeam.department.name}
              </p>
            )}
            {fixture.cheerMeter && (
              <div className="mt-2 flex items-center justify-center gap-1">
                <Heart className="h-3 w-3 text-rose-500" />
                <span className="text-xs">{fixture.cheerMeter.away}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <span>
                  {homeName} vs {awayName}
                </span>
                {isActive && (
                  <Badge className="bg-red-500 text-white">
                    <Zap className="h-3 w-3 mr-1" />
                    LIVE
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(fixture.matchDate), "EEEE, MMMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(fixture.kickoffTime), "h:mm a")}
                  </span>
                </div>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger
              value="overview"
              setActiveTab={() => setActiveTab("overview")}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="live"
              setActiveTab={() => setActiveTab("overview")}
            >
              Live Match
            </TabsTrigger>
            <TabsTrigger
              value="events"
              setActiveTab={() => setActiveTab("events")}
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              setActiveTab={() => setActiveTab("stats")}
            >
              Statistics
            </TabsTrigger>
            <TabsTrigger
              value="streams"
              setActiveTab={() => setActiveTab("streams")}
            >
              Streams
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {renderLiveMatchHeader()}

            {/* Match Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="rounded-lg border border-border p-4">
                  <h4 className="font-semibold text-foreground mb-3">
                    Match Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Competition
                      </span>
                      <div className="flex items-center gap-2">
                        {fixture.competition?.logo && (
                          <img
                            src={fixture.competition.logo}
                            alt={fixture.competition.name}
                            className="h-5 w-5 rounded"
                          />
                        )}
                        <span className="font-medium">
                          {fixture.competition?.name || "Friendly"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Stadium
                      </span>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{fixture.stadium}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Referee
                      </span>
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        <span className="font-medium">{fixture.referee}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Attendance
                      </span>
                      <span className="font-medium">
                        {fixture.attendance > 0
                          ? fixture.attendance.toLocaleString()
                          : "TBD"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Weather */}
                <div className="rounded-lg border border-border p-4">
                  <h4 className="font-semibold text-foreground mb-3">
                    Weather Conditions
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Cloud className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {fixture.weather.condition}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Thermometer className="h-3 w-3" />
                          {fixture.weather.temperature}°C
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal Scorers & Recent Events */}
              <div className="space-y-4">
                {/* Goal Scorers */}
                <div className="rounded-lg border border-border p-4">
                  <h4 className="font-semibold text-foreground mb-3">
                    Goal Scorers
                  </h4>
                  {fixture.goalScorers.length > 0 ? (
                    <div className="space-y-2">
                      {fixture.goalScorers.map((scorer, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50"
                        >
                          <div>
                            <div className="font-medium">
                              {scorer.player
                                ? typeof scorer.player === "string"
                                  ? scorer.player
                                  : scorer.player?.name
                                : scorer.temporaryPlayerName || "Unknown"}
                            </div>
                            {scorer.assist || scorer.temporaryAssistName ? (
                              <div className="text-xs text-muted-foreground">
                                Assist:{" "}
                                {typeof scorer.assist === "string"
                                  ? scorer.assist
                                  : scorer.assist?.name ||
                                    scorer.temporaryAssistName}
                              </div>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2">
                            <Goal className="h-4 w-4 text-emerald-500" />
                            <span className="font-semibold">
                              {scorer.time}'
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No goals scored yet
                    </p>
                  )}
                </div>

                {/* Recent Timeline Events */}
                {fixture.timeline.length > 0 && (
                  <div className="rounded-lg border border-border p-4">
                    <h4 className="font-semibold text-foreground mb-3">
                      Recent Events
                    </h4>
                    <div className="space-y-2">
                      {fixture.timeline
                        .slice(-3)
                        .reverse()
                        .map((event, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50"
                          >
                            {getTimelineIcon(event.type)}
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {event.description}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {event.team === FixtureTeamType.HOME
                                  ? homeName
                                  : awayName}
                              </div>
                            </div>
                            <span className="text-sm font-semibold">
                              {event.minute}'
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Live Match Tab */}
          <TabsContent value="live" className="space-y-6">
            {renderLiveMatchHeader()}

            {/* Live Commentary */}
            {fixture.commentary.length > 0 && (
              <div className="rounded-lg border border-border p-4">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Live Commentary
                </h4>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {fixture.commentary
                    .slice()
                    .reverse()
                    .map((comment, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {comment.minute}'
                          </span>
                          {comment.injuryTime && (
                            <span className="text-xs text-amber-600">
                              +{comment.injuryTime}
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
                        <p className="text-sm text-foreground">
                          {comment.text}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            {fixture.timeline.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  Match Timeline
                </h4>
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-6">
                    {fixture.timeline.map((event, index) => (
                      <div key={index} className="relative">
                        <div className="absolute left-5 top-2.5">
                          <div className="h-3 w-3 rounded-full bg-border border-2 border-background" />
                        </div>
                        <div className="ml-12">
                          <div className="rounded-lg border border-border p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getTimelineIcon(event.type)}
                                <span className="font-medium capitalize">
                                  {event.type.replace("-", " ")}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {event.team === FixtureTeamType.HOME
                                    ? homeName
                                    : awayName}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 text-sm font-medium">
                                <Clock className="h-3 w-3" />
                                {event.minute}'
                                {event.injuryTime && (
                                  <span className="text-xs text-muted-foreground">
                                    +
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-foreground">
                              {event.description}
                            </p>
                            {event.player && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                Player: {event.player}
                              </div>
                            )}
                            {event.relatedPlayer && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                Related: {event.relatedPlayer}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h4 className="font-semibold text-foreground mb-1">
                  No Events Recorded
                </h4>
                <p className="text-sm text-muted-foreground">
                  Match events will appear here once the match begins
                </p>
              </div>
            )}
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Live Statistics */}
              <div className="rounded-lg border border-border p-4">
                <h4 className="font-semibold text-foreground mb-4">
                  Live Statistics
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      label: "Shots on Target",
                      home: fixture.statistics.home.shotsOnTarget,
                      away: fixture.statistics.away.shotsOnTarget,
                    },
                    {
                      label: "Shots off Target",
                      home: fixture.statistics.home.shotsOffTarget,
                      away: fixture.statistics.away.shotsOffTarget,
                    },
                    {
                      label: "Fouls",
                      home: fixture.statistics.home.fouls,
                      away: fixture.statistics.away.fouls,
                    },
                    {
                      label: "Yellow Cards",
                      home: fixture.statistics.home.yellowCards,
                      away: fixture.statistics.away.yellowCards,
                    },
                    {
                      label: "Red Cards",
                      home: fixture.statistics.home.redCards,
                      away: fixture.statistics.away.redCards,
                    },
                    {
                      label: "Corners",
                      home: fixture.statistics.home.corners,
                      away: fixture.statistics.away.corners,
                    },
                    {
                      label: "Possession",
                      home: fixture.statistics.home.possessionTime,
                      away: fixture.statistics.away.possessionTime,
                      isPercent: true,
                    },
                  ].map((stat, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{stat.label}</span>
                        <span className="text-muted-foreground">
                          {stat.home} - {stat.away}
                        </span>
                      </div>
                      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="bg-blue-500"
                          style={{ width: `${stat.home}%` }}
                        />
                        <div
                          className="bg-red-500"
                          style={{ width: `${stat.away}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Player Statistics */}
              <div className="space-y-4">
                {/* Player of the Match */}
                {fixture.playerOfTheMatch && (
                  <div className="rounded-lg border border-border p-4">
                    <h4 className="font-semibold text-foreground mb-3">
                      Player of the Match
                    </h4>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-amber-500/5">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Award className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {fixture.playerOfTheMatch.official ||
                            fixture.playerOfTheMatch.temporaryOfficialName ||
                            "Not selected"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Official Selection
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fan Votes */}
                {fixture.playerOfTheMatch?.fanVotes &&
                  fixture.playerOfTheMatch.fanVotes.length > 0 && (
                    <div className="rounded-lg border border-border p-4">
                      <h4 className="font-semibold text-foreground mb-3">
                        Fan Votes
                      </h4>
                      <div className="space-y-2">
                        {fixture.playerOfTheMatch.fanVotes
                          .sort((a, b) => b.votes - a.votes)
                          .slice(0, 3)
                          .map((vote, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm">
                                {vote.player || vote.temporaryPlayerName}
                              </span>
                              <Badge variant="outline">
                                {vote.votes} votes
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </TabsContent>

          {/* Streams Tab */}
          <TabsContent value="streams" className="space-y-6">
            <div className="rounded-lg border border-border p-4">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Video className="h-4 w-4" />
                Stream Links
              </h4>
              {fixture.streamLinks && fixture.streamLinks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fixture.streamLinks.map((stream, index) => (
                    <a
                      key={index}
                      href={stream.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-lg border border-input hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`p-2 rounded-lg ${
                            stream.isOfficial
                              ? "bg-blue-500/10"
                              : "bg-gray-500/10"
                          }`}
                        >
                          <Video
                            className={`h-5 w-5 ${
                              stream.isOfficial
                                ? "text-blue-500"
                                : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div>
                          <h5 className="font-medium text-foreground">
                            {stream.platform}
                          </h5>
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
                      <p className="text-sm text-muted-foreground truncate">
                        {stream.url}
                      </p>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-1">
                    No Streams Available
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Stream links will appear here once they are added
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          {onManage && (
            <Button
              onClick={onManage}
              variant={isActive ? "default" : "outline"}
              className={isActive ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {isActive ? (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Manage Live Match
                </>
              ) : (
                "Edit Fixture"
              )}
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
