"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  ArrowLeft,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Plus,
  Minus,
  AlertTriangle,
  ChevronDown,
  User,
  Shirt,
  Target,
  Zap,
  Radio,
  Trophy,
  MapPin,
  Calendar,
  MessageSquare,
  Users as UsersIcon,
  Flag,
  Award as AwardIcon,
  Edit,
  Trash2,
  Circle,
} from "lucide-react";
import { footballLiveApi } from "@/lib/api/v1/football-live.api";
import { LiveFixtureResponse } from "@/lib/types/v1.response.types";
import { LiveStatus } from "@/types/v1.football-live.types";
import { FixtureTeamType } from "@/types/v1.football-fixture.types";
import { FixturePlayerStatResponse } from "@/lib/types/v1.response.types";
import {
  AddScorerDto,
  AddTimelineEventDto,
  AddSubEventDto,
} from "@/lib/types/v1.payload.types";
import { footballPlayerStatApi } from "@/lib/api/v1/football-live-player-stat.api";
import AddGoalModal from "@/components/admin/live/AddGoalModal";
import GoalScorersModal, { GoalScorer } from "@/components/admin/live/GoalScorersModel";
import AddEventModal from "@/components/admin/live/AddEventModal";
import SubstitutionModal from "@/components/admin/live/SubstitutionModal";

type VariantClasses = {
  default: string;
  secondary: string;
  destructive: string;
  success: string;
  outline: string;
};
type Variant = {
  default: string;
  warning: string;
  danger: string;
};
// Helper components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2 text-muted-foreground">Loading...</span>
  </div>
);

const StatButton = ({
  onClick,
  icon: Icon,
  label,
  value,
  color = "bg-blue-500/10 text-blue-600",
  disabled = false,
}: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center p-3 rounded-lg ${color} hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    <Icon className="h-5 w-5 mb-1" />
    <span className="text-sm font-medium">{label}</span>
    <span className="text-xl font-bold">{value}</span>
  </button>
);

const IncrementButton = ({ onClick, children, variant = "default" }: any) => {
  const variantClasses: VariantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${variantClasses[variant as keyof VariantClasses]}`}
    >
      {children}
    </button>
  );
};

export default function LiveFixtureManagementPage() {
  const params = useParams();
  const router = useRouter();
  const fixtureId = params.id as string;

  // State
  const [fixture, setFixture] = useState<LiveFixtureResponse | null>(null);
  const [playerStats, setPlayerStats] = useState<FixturePlayerStatResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "stats" | "events" | "lineup" | "settings"
  >("overview");
  const [editing, setEditing] = useState(false);
  const [expandedPlayers, setExpandedPlayers] = useState<Set<string>>(
    new Set(),
  );
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<Map<string, any>>(
    new Map(),
  );
  const [showGoalScorersModal, setShowGoalScorersModal] = useState(false);
  const [editingGoalScorer, setEditingGoalScorer] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Load fixture data
  const loadFixtureData = useCallback(async () => {
    try {
      setLoading(true);

      // Load live fixture
      const fixtureResponse = await footballLiveApi.getById(fixtureId);
      if (fixtureResponse.success) {
        setFixture(fixtureResponse.data);

        // Load player stats
        const statsResponse = await footballPlayerStatApi.getFixtureStats(
          fixtureResponse.data.fixture as string,
        );
        if (statsResponse.success) {
          setPlayerStats(statsResponse.data);
        } else {
          toast.warning("No player stats found. Create them first.");
        }
      } else {
        toast.error("Fixture not found");
        router.push("/admin/live-fixtures");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load fixture data");
    } finally {
      setLoading(false);
    }
  }, [fixtureId, router]);

  useEffect(() => {
    if (fixtureId) {
      loadFixtureData();
    }
  }, [fixtureId, loadFixtureData]);

  // Fixture control handlers
  const handleUpdateStatus = async (status: LiveStatus) => {
    try {
      setSaving(true);
      const response = await footballLiveApi.updateStatus(fixtureId, {
        status,
        currentMinute: fixture?.currentMinute || 0,
        injuryTime: fixture?.injuryTime || 0,
      });

      if (response.success) {
        setFixture(response.data);
        toast.success(`Status updated to ${status}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMinute = async (minute: number) => {
    try {
      const response = await footballLiveApi.updateStatus(fixtureId, {
        status: fixture?.status || LiveStatus.PREMATCH,
        currentMinute: minute,
        injuryTime: fixture?.injuryTime || 0,
      });

      if (response.success) {
        setFixture(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update minute");
    }
  };

  const handleUpdateScore = async (homeScore: number, awayScore: number) => {
    try {
      setSaving(true);
      const response = await footballLiveApi.updateScore(fixtureId, {
        homeScore,
        awayScore,
        halftimeHomeScore: fixture?.result.halftimeHomeScore || undefined,
        halftimeAwayScore: fixture?.result.halftimeAwayScore || undefined,
        homePenalty: fixture?.result.homePenalty || undefined,
        awayPenalty: fixture?.result.awayPenalty || undefined,
      });

      if (response.success) {
        setFixture(response.data);
        toast.success("Score updated");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update score");
    } finally {
      setSaving(false);
    }
  };

  const handleAddGoal = async (payload: AddScorerDto) => {
    try {
      const response = await footballLiveApi.addGoalScorer(fixtureId, payload);
      if (response.success) {
        setFixture(response.data);
        toast.success("Goal added");
        setShowAddGoalModal(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add goal");
    }
  };

  const handleAddEvent = async (payload: AddTimelineEventDto) => {
    try {
      const response = await footballLiveApi.addTimelineEvent(
        fixtureId,
        payload,
      );
      if (response.success) {
        setFixture(response.data);
        toast.success("Event added");
        setShowAddEventModal(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add event");
    }
  };

  const handleSubstitution = async (payload: AddSubEventDto) => {
    try {
      const response = await footballLiveApi.addSubstitution(
        fixtureId,
        payload,
      );
      if (response.success) {
        setFixture(response.data);
        toast.success("Substitution made");
        setShowSubstitutionModal(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to make substitution");
    }
  };

  const handleDeleteGoalScorer = async (scorerId: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      const response = await footballLiveApi.deleteGoalScorer(
        fixtureId,
        scorerId,
      );
      if (response.success) {
        toast.success("Goal deleted successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete goal");
    }
  };

  const handleDeleteTimelineEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await footballLiveApi.deleteTimelineEvent(
        fixtureId,
        eventId,
      );
      if (response.success) {
        toast.success("Event deleted successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete event");
    }
  };

  const handleDeleteSubstitution = async (subId: string) => {
    if (!confirm("Are you sure you want to delete this substitution?")) return;

    try {
      const response = await footballLiveApi.deleteSubstitution(
        fixtureId,
        subId,
      );
      if (response.success) {
        toast.success("Substitution deleted successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete substitution");
    }
  };

  const handleEditGoalScorer = (scorer: any) => {
    setEditingGoalScorer(scorer);
    setShowAddGoalModal(true);
  };

  // Player stat handlers
  const handleUpdatePlayerStat = async (statId: string, updates: any) => {
    try {
      const response = await footballPlayerStatApi.update(statId, updates);
      if (response.success) {
        setPlayerStats((prev) =>
          prev.map((stat) =>
            stat.id === statId ? { ...stat, ...updates } : stat,
          ),
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update player stats");
    }
  };

  const handleIncrementMetric = (
    statId: string,
    category: string,
    metric: string,
  ) => {
    const stat = playerStats.find((s) => s.id === statId);
    if (!stat) return;

    let update: any = {};

    switch (category) {
      case "offensiveMetrics":
        update = {
          offensiveMetrics: {
            ...stat.offensiveMetrics,
            [metric]: ((stat.offensiveMetrics as any)[metric] || 0) + 1,
          },
        };
        break;

      case "defensiveMetrics":
        update = {
          defensiveMetrics: {
            ...stat.defensiveMetrics,
            [metric]: ((stat.defensiveMetrics as any)[metric] || 0) + 1,
          },
        };
        break;

      case "passingMetrics":
        update = {
          passingMetrics: {
            ...stat.passingMetrics,
            [metric]: ((stat.passingMetrics as any)[metric] || 0) + 1,
          },
        };
        break;

      case "duelMetrics":
        update = {
          duelMetrics: {
            ...stat.duelMetrics,
            [metric]: ((stat.duelMetrics as any)[metric] || 0) + 1,
          },
        };
        break;

      case "disciplineMetrics":
        update = {
          disciplineMetrics: {
            ...stat.disciplineMetrics,
            [metric]: ((stat.disciplineMetrics as any)[metric] || 0) + 1,
          },
        };
        break;

      case "keeperMetrics":
        // Check if it's a goalkeeper
        if (stat.position === "gk") {
          update = {
            keeperMetrics: {
              ...(stat.keeperMetrics || {}),
              [metric]: ((stat.keeperMetrics as any)?.[metric] || 0) + 1,
            },
          };
        }
        break;

      case "dribblingMetrics":
        update = {
          dribblingMetrics: {
            ...stat.dribblingMetrics,
            [metric]: ((stat.dribblingMetrics as any)[metric] || 0) + 1,
          },
        };
        break;

      case "advancedMetrics":
        update = {
          advancedMetrics: {
            ...stat.advancedMetrics,
            [metric]: ((stat.advancedMetrics as any)[metric] || 0) + 1,
          },
        };
        break;

      case "minutesPlayed":
        // Direct update for minutes
        update = {
          minutesPlayed: (stat.minutesPlayed || 0) + 1,
        };
        break;

      default:
        console.warn(`Unknown category: ${category}`);
        return;
    }

    handleUpdatePlayerStat(statId, update);
  };

  const handleDecrementMetric = (
    statId: string,
    category: string,
    metric: string,
  ) => {
    const stat = playerStats.find((s) => s.id === statId);
    if (!stat) return;

    let update: any = {};
    let currentValue = 0;

    switch (category) {
      case "offensiveMetrics":
        currentValue = (stat.offensiveMetrics as any)[metric] || 0;
        if (currentValue > 0) {
          update = {
            offensiveMetrics: {
              ...stat.offensiveMetrics,
              [metric]: currentValue - 1,
            },
          };
        }
        break;

      case "defensiveMetrics":
        currentValue = (stat.defensiveMetrics as any)[metric] || 0;
        if (currentValue > 0) {
          update = {
            defensiveMetrics: {
              ...stat.defensiveMetrics,
              [metric]: currentValue - 1,
            },
          };
        }
        break;

      case "passingMetrics":
        currentValue = (stat.passingMetrics as any)[metric] || 0;
        if (currentValue > 0) {
          update = {
            passingMetrics: {
              ...stat.passingMetrics,
              [metric]: currentValue - 1,
            },
          };
        }
        break;

      case "duelMetrics":
        currentValue = (stat.duelMetrics as any)[metric] || 0;
        if (currentValue > 0) {
          update = {
            duelMetrics: {
              ...stat.duelMetrics,
              [metric]: currentValue - 1,
            },
          };
        }
        break;

      case "disciplineMetrics":
        currentValue = (stat.disciplineMetrics as any)[metric] || 0;
        if (currentValue > 0) {
          update = {
            disciplineMetrics: {
              ...stat.disciplineMetrics,
              [metric]: currentValue - 1,
            },
          };
        }
        break;

      case "keeperMetrics":
        // Check if it's a goalkeeper
        if (stat.position === "gk" && stat.keeperMetrics) {
          currentValue = (stat.keeperMetrics as any)[metric] || 0;
          if (currentValue > 0) {
            update = {
              keeperMetrics: {
                ...stat.keeperMetrics,
                [metric]: currentValue - 1,
              },
            };
          }
        }
        break;

      case "dribblingMetrics":
        currentValue = (stat.dribblingMetrics as any)[metric] || 0;
        if (currentValue > 0) {
          update = {
            dribblingMetrics: {
              ...stat.dribblingMetrics,
              [metric]: currentValue - 1,
            },
          };
        }
        break;

      case "advancedMetrics":
        currentValue = (stat.advancedMetrics as any)[metric] || 0;
        if (currentValue > 0) {
          update = {
            advancedMetrics: {
              ...stat.advancedMetrics,
              [metric]: currentValue - 1,
            },
          };
        }
        break;

      case "minutesPlayed":
        // Direct update for minutes
        if (stat.minutesPlayed > 0) {
          update = {
            minutesPlayed: stat.minutesPlayed - 1,
          };
        }
        break;

      default:
        console.warn(`Unknown category: ${category}`);
        return;
    }

    // Only update if we have a valid update object
    if (Object.keys(update).length > 0) {
      handleUpdatePlayerStat(statId, update);
    }
  };

  // Get players by team
  const homePlayers = useMemo(
    () => playerStats.filter((stat) => stat.team?.id === fixture?.homeTeam?.id),
    [playerStats, fixture],
  );

  const awayPlayers = useMemo(
    () => playerStats.filter((stat) => stat.team?.id === fixture?.awayTeam?.id),
    [playerStats, fixture],
  );

  // Helper functions
  const isMatchActive = () => {
    if (!fixture) return false;
    const activeStatuses = [
      LiveStatus.FIRSTHALF,
      LiveStatus.HALFTIME,
      LiveStatus.SECONDHALF,
      LiveStatus.EXTRATIME,
      LiveStatus.PENALTIES,
    ];
    return activeStatuses.includes(fixture.status);
  };

  const getStatusColor = (status: LiveStatus) => {
    switch (status) {
      case LiveStatus.PREMATCH:
        return "bg-slate-500";
      case LiveStatus.FIRSTHALF:
        return "bg-blue-500";
      case LiveStatus.HALFTIME:
        return "bg-amber-500";
      case LiveStatus.SECONDHALF:
        return "bg-blue-500";
      case LiveStatus.EXTRATIME:
        return "bg-purple-500";
      case LiveStatus.PENALTIES:
        return "bg-purple-500";
      case LiveStatus.FINISHED:
        return "bg-emerald-500";
      case LiveStatus.POSTPONED:
        return "bg-amber-500";
      case LiveStatus.ABANDONED:
        return "bg-rose-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (!fixture) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Fixture Not Found
        </h2>
        <p className="text-muted-foreground mb-4">
          The requested live fixture could not be found.
        </p>
        <button
          onClick={() => router.push("/admin/live/football/live-games")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Live Fixtures
        </button>
      </div>
    );
  }

  const isActive = isMatchActive();
  const homeName =
    fixture.homeTeam?.name || fixture.temporaryHomeTeamName || "Home";
  const awayName =
    fixture.awayTeam?.name || fixture.temporaryAwayTeamName || "Away";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/admin/live-fixtures")}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Live Match Management
                </h1>
                <p className="text-sm text-muted-foreground">
                  {homeName} vs {awayName} • {fixture.stadium}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 rounded-full ${getStatusColor(fixture.status)} text-white text-sm font-medium`}
              >
                {fixture.status.replace("-", " ").toUpperCase()}
              </div>
              {isActive && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-sm font-medium">
                  <Zap className="h-3 w-3" />
                  LIVE
                </div>
              )}
              <button
                onClick={loadFixtureData}
                disabled={saving}
                className="p-2 hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-5 w-5 ${saving ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Match Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Match Header */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
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
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">VS</div>
                    </div>
                    <div className="h-16 w-16 rounded-lg bg-secondary/10 flex items-center justify-center">
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
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {homeName}
                    </h2>
                    <p className="text-muted-foreground">vs</p>
                    <h2 className="text-xl font-bold text-foreground">
                      {awayName}
                    </h2>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-bold text-foreground">
                    {fixture.result.homeScore} - {fixture.result.awayScore}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {format(
                      new Date(fixture.kickoffTime),
                      "MMM d, yyyy • h:mm a",
                    )}
                  </div>
                </div>
              </div>

              {/* Match Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {fixture.stadium}
                    </p>
                    <p className="text-xs text-muted-foreground">Stadium</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {fixture.competition?.name || "Friendly"}
                    </p>
                    <p className="text-xs text-muted-foreground">Competition</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {fixture.referee}
                    </p>
                    <p className="text-xs text-muted-foreground">Referee</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Controls */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Match Controls
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Minute:</span>
                  <div className="flex items-center gap-2">
                    <IncrementButton
                      onClick={() =>
                        handleUpdateMinute(
                          Math.max(0, (fixture.currentMinute || 0) - 1),
                        )
                      }
                      variant="outline"
                    >
                      <Minus className="h-4 w-4" />
                    </IncrementButton>
                    <span className="w-12 text-center text-lg font-bold">
                      {fixture.currentMinute}'
                      {fixture.injuryTime > 0 && `+${fixture.injuryTime}`}
                    </span>
                    <IncrementButton
                      onClick={() =>
                        handleUpdateMinute((fixture.currentMinute || 0) + 1)
                      }
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </IncrementButton>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Status Controls */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  <button
                    onClick={() => handleUpdateStatus(LiveStatus.PREMATCH)}
                    disabled={saving || fixture.status === LiveStatus.PREMATCH}
                    className={`p-3 rounded-lg text-center ${fixture.status === LiveStatus.PREMATCH ? "bg-slate-500 text-white" : "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20"}`}
                  >
                    <Calendar className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Pre-match</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(LiveStatus.FIRSTHALF)}
                    disabled={saving || fixture.status === LiveStatus.FIRSTHALF}
                    className={`p-3 rounded-lg text-center ${fixture.status === LiveStatus.FIRSTHALF ? "bg-blue-500 text-white" : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"}`}
                  >
                    <PlayCircle className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">1st Half</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(LiveStatus.HALFTIME)}
                    disabled={saving || fixture.status === LiveStatus.HALFTIME}
                    className={`p-3 rounded-lg text-center ${fixture.status === LiveStatus.HALFTIME ? "bg-amber-500 text-white" : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"}`}
                  >
                    <PauseCircle className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Half-time</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(LiveStatus.SECONDHALF)}
                    disabled={
                      saving || fixture.status === LiveStatus.SECONDHALF
                    }
                    className={`p-3 rounded-lg text-center ${fixture.status === LiveStatus.SECONDHALF ? "bg-blue-500 text-white" : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"}`}
                  >
                    <PlayCircle className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">2nd Half</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(LiveStatus.FINISHED)}
                    disabled={saving || fixture.status === LiveStatus.FINISHED}
                    className={`p-3 rounded-lg text-center ${fixture.status === LiveStatus.FINISHED ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"}`}
                  >
                    <StopCircle className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">End Match</span>
                  </button>
                </div>

                {/* Score Controls */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      {homeName} Score
                    </label>
                    <div className="flex items-center gap-3">
                      <IncrementButton
                        onClick={() =>
                          handleUpdateScore(
                            Math.max(0, fixture.result.homeScore - 1),
                            fixture.result.awayScore,
                          )
                        }
                        variant="outline"
                      >
                        <Minus className="h-4 w-4" />
                      </IncrementButton>
                      <input
                        type="number"
                        value={fixture.result.homeScore}
                        onChange={(e) =>
                          handleUpdateScore(
                            parseInt(e.target.value) || 0,
                            fixture.result.awayScore,
                          )
                        }
                        className="w-20 text-center text-2xl font-bold border border-input rounded-lg px-3 py-2 bg-card"
                      />
                      <IncrementButton
                        onClick={() =>
                          handleUpdateScore(
                            fixture.result.homeScore + 1,
                            fixture.result.awayScore,
                          )
                        }
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                      </IncrementButton>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      {awayName} Score
                    </label>
                    <div className="flex items-center gap-3">
                      <IncrementButton
                        onClick={() =>
                          handleUpdateScore(
                            fixture.result.homeScore,
                            Math.max(0, fixture.result.awayScore - 1),
                          )
                        }
                        variant="outline"
                      >
                        <Minus className="h-4 w-4" />
                      </IncrementButton>
                      <input
                        type="number"
                        value={fixture.result.awayScore}
                        onChange={(e) =>
                          handleUpdateScore(
                            fixture.result.homeScore,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-20 text-center text-2xl font-bold border border-input rounded-lg px-3 py-2 bg-card"
                      />
                      <IncrementButton
                        onClick={() =>
                          handleUpdateScore(
                            fixture.result.homeScore,
                            fixture.result.awayScore + 1,
                          )
                        }
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                      </IncrementButton>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setShowAddGoalModal(true)}
                    className="flex items-center justify-center gap-2 p-3 bg-blue-500/10 text-blue-600 rounded-lg hover:bg-blue-500/20 transition-colors"
                  >
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-medium">Add Goal</span>
                  </button>
                  <button
                    onClick={() => setShowAddEventModal(true)}
                    className="flex items-center justify-center gap-2 p-3 bg-amber-500/10 text-amber-600 rounded-lg hover:bg-amber-500/20 transition-colors"
                  >
                    <Flag className="h-4 w-4" />
                    <span className="text-sm font-medium">Add Event</span>
                  </button>
                  <button
                    onClick={() => setShowSubstitutionModal(true)}
                    className="flex items-center justify-center gap-2 p-3 bg-purple-500/10 text-purple-600 rounded-lg hover:bg-purple-500/20 transition-colors"
                  >
                    <UsersIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Substitution</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Player Statistics Section */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Player Statistics
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedPlayers(new Set())}
                    className="px-3 py-1 text-sm border border-input rounded-lg hover:bg-accent"
                  >
                    Collapse All
                  </button>
                  <button
                    onClick={() => {
                      const allIds = new Set(playerStats.map((p) => p.id));
                      setExpandedPlayers(allIds);
                    }}
                    className="px-3 py-1 text-sm border border-input rounded-lg hover:bg-accent"
                  >
                    Expand All
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Home Team Players */}
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${fixture.homeTeam?.colors?.primary || "bg-primary"}`}
                    />
                    {homeName} Players ({homePlayers.length})
                  </h4>
                  {homePlayers.map((player) => (
                    <PlayerStatCard
                      key={player.id}
                      player={player}
                      isExpanded={expandedPlayers.has(player.id)}
                      onToggle={() => {
                        const newSet = new Set(expandedPlayers);
                        if (newSet.has(player.id)) {
                          newSet.delete(player.id);
                        } else {
                          newSet.add(player.id);
                        }
                        setExpandedPlayers(newSet);
                      }}
                      onIncrement={(category: any, metric: any) =>
                        handleIncrementMetric(player.id, category, metric)
                      }
                      onDecrement={(category: any, metric: any) =>
                        handleDecrementMetric(player.id, category, metric)
                      }
                    />
                  ))}
                </div>

                {/* Away Team Players */}
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${fixture.awayTeam?.colors?.primary || "bg-secondary"}`}
                    />
                    {awayName} Players ({awayPlayers.length})
                  </h4>
                  {awayPlayers.map((player) => (
                    <PlayerStatCard
                      key={player.id}
                      player={player}
                      isExpanded={expandedPlayers.has(player.id)}
                      onToggle={() => {
                        const newSet = new Set(expandedPlayers);
                        if (newSet.has(player.id)) {
                          newSet.delete(player.id);
                        } else {
                          newSet.add(player.id);
                        }
                        setExpandedPlayers(newSet);
                      }}
                      onIncrement={(category: any, metric: any) =>
                        handleIncrementMetric(player.id, category, metric)
                      }
                      onDecrement={(category: any, metric: any) =>
                        handleDecrementMetric(player.id, category, metric)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Match Info & Quick Stats */}
          <div className="space-y-6">
            {/* Match Statistics */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Match Statistics
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Possession
                    </span>
                    <span className="font-medium">
                      {fixture.statistics.home.possessionTime}% -{" "}
                      {fixture.statistics.away.possessionTime}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${fixture.statistics.home.possessionTime}%`,
                      }}
                    />
                  </div>
                </div>

                <StatItem
                  label="Shots on Target"
                  homeValue={fixture.statistics.home.shotsOnTarget}
                  awayValue={fixture.statistics.away.shotsOnTarget}
                />
                <StatItem
                  label="Shots off Target"
                  homeValue={fixture.statistics.home.shotsOffTarget}
                  awayValue={fixture.statistics.away.shotsOffTarget}
                />
                <StatItem
                  label="Corners"
                  homeValue={fixture.statistics.home.corners}
                  awayValue={fixture.statistics.away.corners}
                />
                <StatItem
                  label="Fouls"
                  homeValue={fixture.statistics.home.fouls}
                  awayValue={fixture.statistics.away.fouls}
                />
                <StatItem
                  label="Yellow Cards"
                  homeValue={fixture.statistics.home.yellowCards}
                  awayValue={fixture.statistics.away.yellowCards}
                />
                <StatItem
                  label="Red Cards"
                  homeValue={fixture.statistics.home.redCards}
                  awayValue={fixture.statistics.away.redCards}
                />
                <StatItem
                  label="Offsides"
                  homeValue={fixture.statistics.home.offsides}
                  awayValue={fixture.statistics.away.offsides}
                />
              </div>
            </div>

            {/* Quick Stats Actions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <StatButton
                  icon={Target}
                  label="Total Goals"
                  value={fixture.goalScorers.length}
                  color="bg-blue-500/10 text-blue-600"
                  onClick={() => setShowAddGoalModal(true)}
                />
                <StatButton
                  icon={Flag}
                  label="Events"
                  value={fixture.timeline?.length || 0}
                  color="bg-amber-500/10 text-amber-600"
                  onClick={() => setShowAddEventModal(true)}
                />
                <StatButton
                  icon={UsersIcon}
                  label="Substitutions"
                  value={fixture.substitutions?.length || 0}
                  color="bg-purple-500/10 text-purple-600"
                  onClick={() => setShowSubstitutionModal(true)}
                />
                <StatButton
                  icon={MessageSquare}
                  label="Commentary"
                  value={fixture.commentary?.length || 0}
                  color="bg-green-500/10 text-green-600"
                  onClick={() => {
                    /* Navigate to commentary tab */
                  }}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Recent Events
                </h3>
                <span className="text-sm text-muted-foreground">
                  {fixture.timeline?.length || 0} events
                </span>
              </div>
              <div className="space-y-3">
                {fixture.timeline && fixture.timeline.length > 0 ? (
                  fixture.timeline
                    .slice(-5)
                    .reverse()
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg group"
                      >
                        <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium flex-shrink-0">
                          {event.minute}'
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-foreground truncate">
                              {event.description}
                            </p>
                            <button
                              onClick={() =>
                                handleDeleteTimelineEvent(event.id)
                              }
                              className="p-1 hover:bg-accent rounded transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete event"
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.team === FixtureTeamType.HOME
                              ? homeName
                              : awayName}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Radio className="h-8 w-8 mx-auto mb-2" />
                    <p>No events yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Goal Scorers */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Goal Scorers
                </h3>
                <button
                  onClick={() => setShowGoalScorersModal(true)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  View All ({fixture.goalScorers.length})
                </button>
              </div>

              <div className="space-y-3">
                {fixture.goalScorers.slice(0, 3).map((scorer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Circle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {scorer.player?.name ||
                            scorer.temporaryPlayerName ||
                            "Unknown"}
                          {scorer.assist && (
                            <span className="text-xs text-muted-foreground ml-1">
                              (assist:{" "}
                              {scorer.assist?.name ||
                                scorer.temporaryAssistName}
                              )
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{scorer.time}'</span>
                          <span>•</span>
                          <span
                            className={
                              scorer.team === FixtureTeamType.HOME
                                ? "text-primary"
                                : "text-secondary"
                            }
                          >
                            {scorer.team === FixtureTeamType.HOME
                              ? homeName
                              : awayName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDeleteGoalScorer(scorer.id)}
                        className="p-1 hover:bg-accent rounded transition-colors"
                        title="Delete goal"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}

                {fixture.goalScorers.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Circle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No goals yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddGoalModal && fixture && (
        <AddGoalModal
          isOpen={showAddGoalModal}
          onClose={() => setShowAddGoalModal(false)}
          onSubmit={handleAddGoal}
          homeTeamName={homeName}
          awayTeamName={awayName}
          currentMinute={fixture.currentMinute || 0}
          players={[...homePlayers, ...awayPlayers].map((stat) => ({
            id: stat.player?.id || stat.id,
            name:
              stat.player?.name || stat.temporaryPlayerName || "Unknown Player",
            shirtNumber: stat.shirtNumber || 0,
            position: stat.position || "Unknown",
            team:
              stat.team?.name === fixture.homeTeam?.name ||
              stat.temporaryTeamName === fixture.awayTeam
                ? FixtureTeamType.HOME
                : FixtureTeamType.AWAY,
          }))}
        />
      )}

      {showAddEventModal && fixture && (
        <AddEventModal
          isOpen={showAddEventModal}
          onClose={() => setShowAddEventModal(false)}
          onSubmit={handleAddEvent}
          homeTeamName={homeName}
          awayTeamName={awayName}
          currentMinute={fixture.currentMinute || 0}
          players={[...homePlayers, ...awayPlayers].map((stat) => ({
            id: stat.player?.id || stat.id,
            name:
              stat.player?.name || stat.temporaryPlayerName || "Unknown Player",
            shirtNumber: stat.shirtNumber || 0,
            position: stat.position || "Unknown",
            team:
              stat.team?.name === fixture.homeTeam?.name ||
              stat.temporaryTeamName === fixture.awayTeam
                ? FixtureTeamType.HOME
                : FixtureTeamType.AWAY,
          }))}
        />
      )}

      {showSubstitutionModal && fixture && (
        <SubstitutionModal
          isOpen={showSubstitutionModal}
          onClose={() => setShowSubstitutionModal(false)}
          onSubmit={handleSubstitution}
          homeTeamName={homeName}
          awayTeamName={awayName}
          currentMinute={fixture.currentMinute || 0}
          players={[...homePlayers, ...awayPlayers].map((stat) => ({
            id: stat.player?.id || stat.id,
            name:
              stat.player?.name || stat.temporaryPlayerName || "Unknown Player",
            shirtNumber: stat.shirtNumber || 0,
            position: stat.position || "Unknown",
            team:
              stat.team?.name === fixture.homeTeam?.name ||
              stat.temporaryTeamName === fixture.awayTeam
                ? FixtureTeamType.HOME
                : FixtureTeamType.AWAY,
          }))}
        />
      )}

      {showGoalScorersModal && fixture && (
        <GoalScorersModal
          isOpen={showGoalScorersModal}
          onClose={() => setShowGoalScorersModal(false)}
          goalScorers={fixture.goalScorers as any}
          homeTeamName={homeName}
          awayTeamName={awayName}
          onDeleteGoal={handleDeleteGoalScorer}
          onEditGoal={(scorer) => {
            setEditingGoalScorer(scorer);
            setShowGoalScorersModal(false);
            setShowAddGoalModal(true);
          }}
        />
      )}
    </div>
  );
}

// Helper Components
const StatItem = ({ label, homeValue, awayValue }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="font-medium">
      {homeValue} - {awayValue}
    </span>
  </div>
);

const PlayerStatCard = ({
  player,
  isExpanded,
  onToggle,
  onIncrement,
  onDecrement,
}: any) => {
  // Helper function to handle stat updates
  const handleDirectInput = (value: string) => {
    const numValue = parseInt(value) || 0;
    // You can implement direct input handling here
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4 hover:bg-accent/50 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {player.player?.photo ? (
              <img
                src={player.player.photo}
                alt={player.player?.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <Shirt className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="font-medium text-foreground truncate">
              {player.player?.name ||
                player.temporaryPlayerName ||
                "Unknown Player"}
            </h5>
            <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
              <span>#{player.shirtNumber}</span>
              <span>•</span>
              <span className="truncate">{player.position}</span>
              {player.isCaptain && (
                <>
                  <span>•</span>
                  <span className="text-amber-600 font-medium truncate">
                    Captain
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <div className="text-sm font-medium">{player.minutesPlayed}'</div>
            <div className="text-xs text-muted-foreground">Minutes</div>
          </div>
          <ChevronDown
            className={`h-5 w-5 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-border bg-muted/30">
          {/* Quick Stats Grid - Fixed with better responsiveness */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {/* Offensive Stats */}
            <div className="space-y-2">
              <h6 className="text-xs font-semibold text-muted-foreground truncate">
                Offensive
              </h6>
              <StatControl
                label="Goals"
                value={player.offensiveMetrics.goals}
                onIncrement={() => onIncrement("offensiveMetrics", "goals")}
                onDecrement={() => onDecrement("offensiveMetrics", "goals")}
                icon="⚽"
              />
              <StatControl
                label="Assists"
                value={player.offensiveMetrics.assists}
                onIncrement={() => onIncrement("offensiveMetrics", "assists")}
                onDecrement={() => onDecrement("offensiveMetrics", "assists")}
                icon="🎯"
              />
              <StatControl
                label="Shots"
                value={player.offensiveMetrics.shots}
                onIncrement={() => onIncrement("offensiveMetrics", "shots")}
                onDecrement={() => onDecrement("offensiveMetrics", "shots")}
                icon="🔫"
              />
            </div>

            {/* Passing Stats */}
            <div className="space-y-2">
              <h6 className="text-xs font-semibold text-muted-foreground truncate">
                Passing
              </h6>
              <StatControl
                label="Passes"
                value={player.passingMetrics.passes}
                onIncrement={() => onIncrement("passingMetrics", "passes")}
                onDecrement={() => onDecrement("passingMetrics", "passes")}
                icon="📍"
              />
              <StatControl
                label="Completed"
                value={player.passingMetrics.passesCompleted}
                onIncrement={() =>
                  onIncrement("passingMetrics", "passesCompleted")
                }
                onDecrement={() =>
                  onDecrement("passingMetrics", "passesCompleted")
                }
                icon="✓"
              />
              <StatControl
                label="Key Passes"
                value={player.passingMetrics.keyPasses}
                onIncrement={() => onIncrement("passingMetrics", "keyPasses")}
                onDecrement={() => onDecrement("passingMetrics", "keyPasses")}
                icon="🔑"
              />
            </div>

            {/* Defensive Stats */}
            <div className="space-y-2">
              <h6 className="text-xs font-semibold text-muted-foreground truncate">
                Defensive
              </h6>
              <StatControl
                label="Tackles"
                value={player.defensiveMetrics.tackles}
                onIncrement={() => onIncrement("defensiveMetrics", "tackles")}
                onDecrement={() => onDecrement("defensiveMetrics", "tackles")}
                icon="🛡️"
              />
              <StatControl
                label="Interceptions"
                value={player.defensiveMetrics.interceptions}
                onIncrement={() =>
                  onIncrement("defensiveMetrics", "interceptions")
                }
                onDecrement={() =>
                  onDecrement("defensiveMetrics", "interceptions")
                }
                icon="🚫"
              />
              <StatControl
                label="Clearances"
                value={player.defensiveMetrics.clearances}
                onIncrement={() =>
                  onIncrement("defensiveMetrics", "clearances")
                }
                onDecrement={() =>
                  onDecrement("defensiveMetrics", "clearances")
                }
                icon="🔄"
              />
            </div>

            {/* Discipline Stats */}
            <div className="space-y-2">
              <h6 className="text-xs font-semibold text-muted-foreground truncate">
                Discipline
              </h6>
              <StatControl
                label="Fouls"
                value={player.disciplineMetrics.foulsCommitted}
                onIncrement={() =>
                  onIncrement("disciplineMetrics", "foulsCommitted")
                }
                onDecrement={() =>
                  onDecrement("disciplineMetrics", "foulsCommitted")
                }
                icon="⚠️"
                variant="warning"
              />
              <StatControl
                label="Yellow Cards"
                value={player.disciplineMetrics.yellowCards}
                onIncrement={() =>
                  onIncrement("disciplineMetrics", "yellowCards")
                }
                onDecrement={() =>
                  onDecrement("disciplineMetrics", "yellowCards")
                }
                icon="🟨"
                variant="warning"
              />
              <StatControl
                label="Red Cards"
                value={player.disciplineMetrics.redCards}
                onIncrement={() => onIncrement("disciplineMetrics", "redCards")}
                onDecrement={() => onDecrement("disciplineMetrics", "redCards")}
                icon="🟥"
                variant="danger"
              />
            </div>
          </div>

          {/* Advanced Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-muted-foreground">
                Minutes Played
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDecrement("minutesPlayed", "minutesPlayed")}
                  className="px-2 py-1 border border-input rounded hover:bg-accent transition-colors"
                  title="Decrease minutes"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={player.minutesPlayed}
                  onChange={(e) => handleDirectInput(e.target.value)}
                  className="flex-1 min-w-0 text-center border border-input rounded px-2 py-1 bg-background"
                  min="0"
                  max="120"
                />
                <button
                  onClick={() => onIncrement("minutesPlayed", "minutesPlayed")}
                  className="px-2 py-1 border border-input rounded hover:bg-accent transition-colors"
                  title="Increase minutes"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-muted-foreground">
                Status
              </label>
              <div className="flex gap-2">
                <button
                  className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${player.onPitch ? "bg-green-500 text-white" : "bg-muted hover:bg-accent"}`}
                  onClick={() => {
                    /* Toggle on pitch status */
                  }}
                  title="Toggle playing status"
                >
                  {player.onPitch ? "On Pitch" : "Subbed"}
                </button>
                <button
                  className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${player.starter ? "bg-blue-500 text-white" : "bg-muted hover:bg-accent"}`}
                  onClick={() => {
                    /* Toggle starter status */
                  }}
                  title="Toggle starter status"
                >
                  {player.starter ? "Starter" : "Substitute"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatControl = ({
  label,
  value,
  onIncrement,
  onDecrement,
  icon,
  variant = "default",
}: any) => {
  const variantClasses: Variant = {
    default: "bg-background border border-border",
    warning: "bg-yellow-500/10 border border-yellow-200/50",
    danger: "bg-red-500/10 border border-red-200/50",
  };

  return (
    <div
      className={`p-2 rounded-lg ${variantClasses[variant as keyof Variant]}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-lg flex-shrink-0">{icon}</span>
          <span className="text-xs text-muted-foreground truncate">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onDecrement}
            className="p-1 hover:bg-accent rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[24px] flex items-center justify-center"
            disabled={value <= 0}
            title={`Decrease ${label}`}
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="font-bold min-w-[28px] text-center">{value}</span>
          <button
            onClick={onIncrement}
            className="p-1 hover:bg-accent rounded transition-colors min-w-[24px] flex items-center justify-center"
            title={`Increase ${label}`}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
