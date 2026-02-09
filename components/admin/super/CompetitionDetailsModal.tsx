"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { CompetitionResponse } from "@/lib/types/v1.response.types";
import {
  X,
  Trophy,
  Calendar,
  Users,
  Target,
  Award,
  FileText,
  BarChart3,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  Edit2,
  ChevronRight,
} from "lucide-react";
import { CompetitionStatus } from "@/types/v1.football-competition.types";

interface CompetitionDetailsModalProps {
  competition: CompetitionResponse;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const STATUS_CONFIG = {
  [CompetitionStatus.UPCOMING]: {
    label: "Upcoming",
    color: "bg-blue-500",
    icon: Clock,
  },
  [CompetitionStatus.ONGOING]: {
    label: "Ongoing",
    color: "bg-emerald-500",
    icon: TrendingUp,
  },
  [CompetitionStatus.COMPLETED]: {
    label: "Completed",
    color: "bg-gray-500",
    icon: CheckCircle,
  },
  [CompetitionStatus.CANCELLED]: {
    label: "Cancelled",
    color: "bg-rose-500",
    icon: XCircle,
  },
};

export function CompetitionDetailsModal({
  competition,
  isOpen,
  onClose,
  onEdit,
}: CompetitionDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen, competition.id]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await footballCompetitionApi.getStats(competition.id);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch competition stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const status = STATUS_CONFIG[competition.status];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Competition Details
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage competition information
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Competition Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center">
              {competition.logo ? (
                <img
                  src={competition.logo}
                  alt={competition.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
              ) : (
                <Trophy className="h-10 w-10 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground">
                      {competition.name}
                    </h1>
                    {competition.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 text-sm">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      <Target className="h-3 w-3" />
                      {competition.shorthand}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-3 w-3" />
                      {competition.type}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {competition.season}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-1 px-6">
            {["overview", "teams", "standings", "rules", "sponsors"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium capitalize transition-colors relative ${
                    activeTab === tab
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Competition Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium capitalize">
                          {competition.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Season</p>
                        <p className="font-medium">{competition.season}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status.color}/10 text-${status.color.split("-")[1]}-600`}
                        >
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Teams</p>
                        <p className="font-medium">
                          {competition.teams.length} registered
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Timeline
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Start Date
                        </p>
                        <p className="font-medium">
                          {format(new Date(competition.startDate), "PPP")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          End Date
                        </p>
                        <p className="font-medium">
                          {format(new Date(competition.endDate), "PPP")}
                        </p>
                      </div>
                    </div>
                    {competition.registrationDeadline && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Registration Deadline
                          </p>
                          <p className="font-medium">
                            {format(
                              new Date(competition.registrationDeadline),
                              "PPP",
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Current Stage
                        </p>
                        <p className="font-medium">
                          {competition.currentStage || "Not started"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Description
                </h3>
                <div className="bg-accent/50 rounded-lg p-4">
                  <p className="text-foreground">{competition.description}</p>
                </div>
              </div>

              {/* Stats */}
              {stats && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Statistics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.leagueStats && (
                      <>
                        <div className="bg-card border border-border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">
                            Matches
                          </p>
                          <p className="text-2xl font-bold mt-1">
                            {stats.leagueStats.completedMatches}/
                            {stats.leagueStats.totalMatches}
                          </p>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">
                            Avg. Goals
                          </p>
                          <p className="text-2xl font-bold mt-1">
                            {stats.leagueStats.averageGoalsPerMatch.toFixed(1)}
                          </p>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Cards</p>
                          <p className="text-2xl font-bold mt-1">
                            {stats.leagueStats.totalYellowCards}Y /{" "}
                            {stats.leagueStats.totalRedCards}R
                          </p>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">
                            Progress
                          </p>
                          <p className="text-2xl font-bold mt-1">
                            {stats.leagueStats.completionPercentage.toFixed(0)}%
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "teams" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Registered Teams ({competition.teams.length})
              </h3>
              {competition.teams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {competition.teams.map((team) => (
                    <div
                      key={team.id}
                      className="bg-card border border-border rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-full"
                          style={{
                            backgroundColor: team.colors?.primary || "#000",
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">
                            {team.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {team.shorthand}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Teams Registered
                  </h3>
                  <p className="text-muted-foreground">
                    Teams will appear here once registered
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "standings" && (
            <div className="space-y-4">
              {competition.leagueTable && competition.leagueTable.length > 0 ? (
                <>
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    League Table
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-2 px-4 text-left text-sm font-medium text-muted-foreground">
                            Pos
                          </th>
                          <th className="py-2 px-4 text-left text-sm font-medium text-muted-foreground">
                            Team
                          </th>
                          <th className="py-2 px-4 text-center text-sm font-medium text-muted-foreground">
                            P
                          </th>
                          <th className="py-2 px-4 text-center text-sm font-medium text-muted-foreground">
                            W
                          </th>
                          <th className="py-2 px-4 text-center text-sm font-medium text-muted-foreground">
                            D
                          </th>
                          <th className="py-2 px-4 text-center text-sm font-medium text-muted-foreground">
                            L
                          </th>
                          <th className="py-2 px-4 text-center text-sm font-medium text-muted-foreground">
                            GF
                          </th>
                          <th className="py-2 px-4 text-center text-sm font-medium text-muted-foreground">
                            GA
                          </th>
                          <th className="py-2 px-4 text-center text-sm font-medium text-muted-foreground">
                            GD
                          </th>
                          <th className="py-2 px-4 text-center text-sm font-medium text-muted-foreground">
                            Pts
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {competition.leagueTable.map((standing) => (
                          <tr
                            key={standing.id}
                            className="border-b border-border hover:bg-accent/50"
                          >
                            <td className="py-3 px-4 font-semibold">
                              {standing.position}
                            </td>
                            <td className="py-3 px-4">
                              {typeof standing.team === "string"
                                ? standing.team
                                : standing.team.name}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {standing.played}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {standing.wins}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {standing.draws}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {standing.losses}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {standing.goalsFor}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {standing.goalsAgainst}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {standing.goalDifference > 0 ? "+" : ""}
                              {standing.goalDifference}
                            </td>
                            <td className="py-3 px-4 text-center font-bold">
                              {standing.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Standings Available
                  </h3>
                  <p className="text-muted-foreground">
                    League table will appear here once matches start
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "rules" && (
            <div className="space-y-6">
              {/* Basic Rules */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Competition Rules
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground">
                      Substitutions
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {competition.rules.substitutions.allowed
                        ? `Maximum ${competition.rules.substitutions.maximum} allowed`
                        : "Not allowed"}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground">
                      Extra Time
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {competition.rules.extraTime ? "Allowed" : "Not allowed"}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground">
                      Penalties
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {competition.rules.penalties ? "Allowed" : "Not allowed"}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground">
                      Match Duration
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {competition.rules.matchDuration.normal} minutes
                      {competition.rules.matchDuration.extraTime > 0 &&
                        ` + ${competition.rules.matchDuration.extraTime} minutes extra`}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground">
                      Squad Size
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {competition.rules.squadSize.min} -{" "}
                      {competition.rules.squadSize.max} players
                    </p>
                  </div>
                </div>
              </div>

              {/* Extra Rules */}
              {competition.extraRules.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Additional Rules
                  </h3>
                  <div className="space-y-3">
                    {competition.extraRules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="bg-card border border-border rounded-lg p-4"
                      >
                        <h4 className="font-medium text-foreground">
                          {rule.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rule.description}
                        </p>
                        {rule.lastUpdated && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Last updated:{" "}
                            {format(new Date(rule.lastUpdated), "PP")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "sponsors" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Sponsors ({competition.sponsors.length})
              </h3>
              {competition.sponsors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {competition.sponsors.map((sponsor, idx) => (
                    <div
                      key={idx}
                      className="bg-card border border-border rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        {sponsor.logo ? (
                          <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Award className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">
                            {sponsor.name}
                          </h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {sponsor.tier} Sponsor
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Sponsors
                  </h3>
                  <p className="text-muted-foreground">
                    Sponsors will appear here once added
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
