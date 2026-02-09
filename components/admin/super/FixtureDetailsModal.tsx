"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { FixtureResponse } from "@/lib/types/v1.response.types";
import {
  FixtureStatus,
  FixtureTeamType,
  FixtureTimelineType,
} from "@/types/v1.football-fixture.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/v1/dialogue";
import { Badge } from "@/components/ui/v1/badge";
import {
  Calendar,
  MapPin,
  Users,
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
  Sparkles,
  Award,
  Watch,
  Ticket,
} from "lucide-react";

interface FixtureDetailsModalProps {
  fixture: FixtureResponse;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

const STATUS_COLORS: Record<FixtureStatus, string> = {
  [FixtureStatus.SCHEDULED]: "bg-blue-500/10 text-blue-600",
  [FixtureStatus.LIVE]: "bg-red-500/10 text-red-600",
  [FixtureStatus.COMPLETED]: "bg-emerald-500/10 text-emerald-600",
  [FixtureStatus.POSTPONED]: "bg-amber-500/10 text-amber-600",
  [FixtureStatus.CANCELED]: "bg-gray-500/10 text-gray-600",
};

const STATUS_ICONS: Record<FixtureStatus, React.ReactNode> = {
  [FixtureStatus.SCHEDULED]: <Calendar className="h-4 w-4" />,
  [FixtureStatus.LIVE]: <Clock className="h-4 w-4" />,
  [FixtureStatus.COMPLETED]: <CheckCircle className="h-4 w-4" />,
  [FixtureStatus.POSTPONED]: <AlertCircle className="h-4 w-4" />,
  [FixtureStatus.CANCELED]: <XCircle className="h-4 w-4" />,
};

export function FixtureDetailsModal({
  fixture,
  isOpen,
  onClose,
  onEdit,
}: FixtureDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "events" | "lineup" | "stats"
  >("overview");

  const homeName =
    fixture.homeTeam?.name || fixture.temporaryHomeTeamName || "TBD";
  const awayName =
    fixture.awayTeam?.name || fixture.temporaryAwayTeamName || "TBD";

  const getTimelineIcon = (type: FixtureTimelineType) => {
    switch (type) {
      case FixtureTimelineType.GOAL:
        return <Goal className="h-4 w-4 text-emerald-500" />;
      case FixtureTimelineType.YELLOWCARD:
        return <Watch className="h-4 w-4 text-yellow-500" />;
      case FixtureTimelineType.REDCARD:
        return <Ticket className="h-4 w-4 text-red-500" />;
      case FixtureTimelineType.SUBSTITUTION:
        return <Repeat className="h-4 w-4 text-blue-500" />;
      case FixtureTimelineType.INJURY:
        return <Flag className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {homeName} vs {awayName}
              </DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(
                      new Date(fixture.scheduledDate),
                      "EEEE, MMMM d, yyyy",
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(fixture.scheduledDate), "h:mm a")}
                  </span>
                </div>
              </DialogDescription>
            </div>
            <Badge className={STATUS_COLORS[fixture.status]}>
              <span className="flex items-center gap-1">
                {STATUS_ICONS[fixture.status]}
                {fixture.status.charAt(0).toUpperCase() +
                  fixture.status.slice(1)}
              </span>
            </Badge>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === "overview"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === "events"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab("lineup")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === "lineup"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Lineup
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === "stats"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Statistics
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6 py-4">
            {/* Match Header */}
            <div className="flex items-center justify-between">
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                      {fixture.homeTeam?.logo ? (
                        <img
                          src={fixture.homeTeam.logo}
                          alt={homeName}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-gray-200 flex items-center justify-center">
                          <span className="text-lg font-bold">
                            {fixture.homeTeam?.shorthand ||
                              homeName.substring(0, 2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {homeName}
                    </h3>
                    {fixture.homeTeam?.department && (
                      <p className="text-xs text-muted-foreground">
                        {fixture.homeTeam.department.name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    {fixture.status !== FixtureStatus.SCHEDULED ? (
                      <>
                        <div className="text-4xl font-bold text-foreground mb-2">
                          {fixture.result.homeScore} -{" "}
                          {fixture.result.awayScore}
                        </div>
                        {fixture.result.halftimeHomeScore !== null && (
                          <div className="text-sm text-muted-foreground">
                            HT: {fixture.result.halftimeHomeScore}-
                            {fixture.result.halftimeAwayScore}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-muted-foreground">
                        VS
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-lg bg-secondary/10 flex items-center justify-center mb-2">
                      {fixture.awayTeam?.logo ? (
                        <img
                          src={fixture.awayTeam.logo}
                          alt={awayName}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-gray-200 flex items-center justify-center">
                          <span className="text-lg font-bold">
                            {fixture.awayTeam?.shorthand ||
                              awayName.substring(0, 2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {awayName}
                    </h3>
                    {fixture.awayTeam?.department && (
                      <p className="text-xs text-muted-foreground">
                        {fixture.awayTeam.department.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

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
                        Match Type
                      </span>
                      <Badge variant="outline" className="capitalize">
                        {fixture.matchType}
                      </Badge>
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
                        <Watch className="h-4 w-4" />
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
                          : "Not recorded"}
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

              {/* Goal Scorers */}
              <div className="space-y-4">
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
                                ? typeof scorer.player === "string" ? scorer.player : scorer.player?.name
                                : scorer.temporaryPlayerName || "Unknown"}
                            </div>
                            {scorer.assist || scorer.temporaryAssistName ? (
                              <div className="text-xs text-muted-foreground">
                                Assist:{" "}
                                {typeof scorer.assist === "string" ? scorer.assist : scorer.assist?.name || scorer.temporaryAssistName}
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

                {/* Derby Badge */}
                {fixture.isDerby && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/20 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium text-amber-800 dark:text-amber-300">
                          Derby Match
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Special rivalry match between {homeName} and{" "}
                          {awayName}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="py-4">
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
          </div>
        )}

        {/* Lineup Tab */}
        {activeTab === "lineup" && (
          <div className="py-4">
            {fixture.lineups ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Home Team Lineup */}
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-foreground">
                        {homeName}
                      </h4>
                      <Badge variant="outline">
                        {fixture.lineups.home.formation}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-muted-foreground">
                        Starting XI
                      </div>
                      <div className="space-y-2">
                        {fixture.lineups.home.startingXI.map(
                          (playerId, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50"
                            >
                              <span className="text-sm">{playerId}</span>
                              <span className="text-xs text-muted-foreground">
                                #{index + 1}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground mt-4">
                        Substitutes
                      </div>
                      <div className="space-y-2">
                        {fixture.lineups.home.substitutes.map(
                          (playerId, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50"
                            >
                              <span className="text-sm">{playerId}</span>
                              <span className="text-xs text-muted-foreground">
                                Sub
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground">
                        Coach: {fixture.lineups.home.coach}
                      </div>
                    </div>
                  </div>

                  {/* Away Team Lineup */}
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-foreground">
                        {awayName}
                      </h4>
                      <Badge variant="outline">
                        {fixture.lineups.away.formation}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-muted-foreground">
                        Starting XI
                      </div>
                      <div className="space-y-2">
                        {fixture.lineups.away.startingXI.map(
                          (playerId, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50"
                            >
                              <span className="text-sm">{playerId}</span>
                              <span className="text-xs text-muted-foreground">
                                #{index + 1}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground mt-4">
                        Substitutes
                      </div>
                      <div className="space-y-2">
                        {fixture.lineups.away.substitutes.map(
                          (playerId, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50"
                            >
                              <span className="text-sm">{playerId}</span>
                              <span className="text-xs text-muted-foreground">
                                Sub
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground">
                        Coach: {fixture.lineups.away.coach}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h4 className="font-semibold text-foreground mb-1">
                  Lineups Not Set
                </h4>
                <p className="text-sm text-muted-foreground">
                  Team lineups will appear here once they are submitted
                </p>
              </div>
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === "stats" && (
          <div className="py-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Statistics */}
                <div className="rounded-lg border border-border p-4">
                  <h4 className="font-semibold text-foreground mb-4">
                    Match Statistics
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

                {/* Additional Info */}
                <div className="space-y-4">
                  {/* Substitutions */}
                  {fixture.substitutions.length > 0 && (
                    <div className="rounded-lg border border-border p-4">
                      <h4 className="font-semibold text-foreground mb-3">
                        Substitutions
                      </h4>
                      <div className="space-y-2">
                        {fixture.substitutions.map((sub, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {sub.playerOut || sub.temporaryPlayerOutName} →{" "}
                                {sub.playerIn || sub.temporaryPlayerInName}
                              </span>
                              <span className="text-muted-foreground">
                                {sub.minute}'
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {sub.team === FixtureTeamType.HOME
                                ? homeName
                                : awayName}
                              {sub.injury && " • Injury substitution"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stream Links */}
                  {fixture.highlights && fixture.highlights.length > 0 && (
                    <div className="rounded-lg border border-border p-4">
                      <h4 className="font-semibold text-foreground mb-3">
                        Stream Links
                      </h4>
                      <div className="space-y-2">
                        {fixture.highlights.map((stream, index) => (
                          <a
                            key={index}
                            href={stream.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
                          >
                            <Video className="h-4 w-4" />
                            <span className="text-sm">{stream.platform}</span>
                            {stream.isOfficial && (
                              <Badge variant="outline" className="text-xs">
                                Official
                              </Badge>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Edit Fixture
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
