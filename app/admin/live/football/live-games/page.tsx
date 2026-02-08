"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { footballLiveApi } from "@/lib/api/v1/football-live.api";
import { LiveFixtureResponse } from "@/lib/types/v1.response.types";
import { LiveStatus } from "@/types/v1.football-live.types";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Target,
  Radio,
  AlertCircle,
  RefreshCw,
  Zap,
  TrendingUp,
  Trophy as TrophyIcon,
  Video,
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { LiveFixtureDetailsModal } from "@/components/admin/super/LiveFixtureDetailsModal";
import { CreateLiveFixtureModal } from "@/components/admin/super/CreateLiveFixtureModal";
import { ManageLiveFixtureModal } from "@/components/admin/super/ManageLiveFixtureModal";
import { useRouter } from "next/navigation";

const LIVE_STATUS_OPTIONS = [
  {
    value: LiveStatus.PREMATCH,
    label: "Pre-match",
    color: "bg-slate-500",
    icon: Calendar,
  },
  {
    value: LiveStatus.FIRSTHALF,
    label: "1st Half",
    color: "bg-blue-500",
    icon: Clock,
  },
  {
    value: LiveStatus.HALFTIME,
    label: "Half-time",
    color: "bg-amber-500",
    icon: Clock,
  },
  {
    value: LiveStatus.SECONDHALF,
    label: "2nd Half",
    color: "bg-blue-500",
    icon: Clock,
  },
  {
    value: LiveStatus.EXTRATIME,
    label: "Extra Time",
    color: "bg-purple-500",
    icon: Clock,
  },
  {
    value: LiveStatus.PENALTIES,
    label: "Penalties",
    color: "bg-purple-500",
    icon: Target,
  },
  {
    value: LiveStatus.FINISHED,
    label: "Finished",
    color: "bg-emerald-500",
    icon: CheckCircle,
  },
  {
    value: LiveStatus.POSTPONED,
    label: "Postponed",
    color: "bg-amber-500",
    icon: AlertCircle,
  },
  {
    value: LiveStatus.ABANDONED,
    label: "Abandoned",
    color: "bg-rose-500",
    icon: XCircle,
  },
];

export default function LiveFixturesPage() {
  const router = useRouter();

  // State
  const [liveFixtures, setLiveFixtures] = useState<LiveFixtureResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeOnly, setActiveOnly] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedFixture, setSelectedFixture] =
    useState<LiveFixtureResponse | null>(null);

  // Load initial data
  useEffect(() => {
    fetchLiveFixtures();
  }, [page, limit]);

  const fetchLiveFixtures = async () => {
    try {
      setLoading(true);
      const response = await footballLiveApi.getAll(page, limit);
      if (response.success) {
        setLiveFixtures(response.data);
        setTotal(response.total);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch live fixtures");
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveFixtures = async () => {
    try {
      setLoading(true);
      const response = await footballLiveApi.getActive();
      if (response.success) {
        setLiveFixtures(response.data);
        setTotal(response.data.length);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch active fixtures");
    } finally {
      setLoading(false);
    }
  };

  // Filter live fixtures
  const filteredFixtures = useMemo(() => {
    let fixtures = liveFixtures;

    if (activeOnly) {
      const activeStatuses = [
        LiveStatus.PREMATCH,
        LiveStatus.FIRSTHALF,
        LiveStatus.HALFTIME,
        LiveStatus.SECONDHALF,
        LiveStatus.EXTRATIME,
        LiveStatus.PENALTIES,
      ];
      fixtures = fixtures.filter((f) => activeStatuses.includes(f.status));
    }

    return fixtures.filter((fixture) => {
      const homeName =
        fixture.homeTeam?.name || fixture.temporaryHomeTeamName || "";
      const awayName =
        fixture.awayTeam?.name || fixture.temporaryAwayTeamName || "";
      const competitionName = fixture.competition?.name || "";

      const matchesSearch =
        homeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        awayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fixture.stadium.toLowerCase().includes(searchQuery.toLowerCase()) ||
        competitionName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || fixture.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [liveFixtures, searchQuery, statusFilter, activeOnly]);

  // Handlers
  const handleViewDetails = (fixture: LiveFixtureResponse) => {
    setSelectedFixture(fixture);
    setShowDetailsModal(true);
  };

  const handleManageFixture = (fixture: LiveFixtureResponse) => {
    setSelectedFixture(fixture);
    setShowManageModal(true);
  };

  const handleDeleteFixture = async (fixture: LiveFixtureResponse) => {
    if (!confirm(`Are you sure you want to delete this live fixture?`)) return;

    try {
      const response = await footballLiveApi.delete(fixture.id);
      toast.success(response.message || "Live fixture deleted successfully");
      fetchLiveFixtures();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete live fixture");
    }
  };

  const handleEndFixture = async (fixture: LiveFixtureResponse) => {
    if (!confirm(`Are you sure you want to end this fixture?`)) return;

    try {
      const response = await footballLiveApi.endFixture(fixture.id);
      toast.success(response.message || "Fixture ended successfully");
      fetchLiveFixtures();
    } catch (error: any) {
      toast.error(error.message || "Failed to end fixture");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchLiveFixtures();
  };

  const handleUpdateSuccess = () => {
    setShowManageModal(false);
    fetchLiveFixtures();
  };

  // Stats
  const globalStats = useMemo(() => {
    const total = liveFixtures.length;
    const active = liveFixtures.filter((f) =>
      [
        LiveStatus.PREMATCH,
        LiveStatus.FIRSTHALF,
        LiveStatus.HALFTIME,
        LiveStatus.SECONDHALF,
        LiveStatus.EXTRATIME,
        LiveStatus.PENALTIES,
      ].includes(f.status),
    ).length;
    const prematch = liveFixtures.filter(
      (f) => f.status === LiveStatus.PREMATCH,
    ).length;
    const inProgress = liveFixtures.filter((f) =>
      [
        LiveStatus.FIRSTHALF,
        LiveStatus.SECONDHALF,
        LiveStatus.EXTRATIME,
      ].includes(f.status),
    ).length;
    const finished = liveFixtures.filter(
      (f) => f.status === LiveStatus.FINISHED,
    ).length;
    const withStreams = liveFixtures.filter(
      (f) => f.streamLinks && f.streamLinks.length > 0,
    ).length;

    return {
      total,
      active,
      prematch,
      inProgress,
      finished,
      withStreams,
    };
  }, [liveFixtures]);

  const isMatchActive = (status: LiveStatus): boolean => {
    const activeStatuses = [
      LiveStatus.PREMATCH,
      LiveStatus.FIRSTHALF,
      LiveStatus.HALFTIME,
      LiveStatus.SECONDHALF,
      LiveStatus.EXTRATIME,
      LiveStatus.PENALTIES,
    ];
    return activeStatuses.includes(status);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Fixtures</h1>
          <p className="text-muted-foreground">
            Manage live matches, track scores, and update statistics in
            real-time
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchActiveFixtures}
            className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
          >
            <Zap className="h-4 w-4" />
            Active Only
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Live
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {globalStats.total}
                </p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Radio className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-foreground">
                  {globalStats.active}
                </p>
              </div>
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Zap className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pre-match</p>
                <p className="text-2xl font-bold text-foreground">
                  {globalStats.prematch}
                </p>
              </div>
              <div className="p-2 bg-slate-500/10 rounded-lg">
                <Clock className="h-4 w-4 text-slate-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-foreground">
                  {globalStats.inProgress}
                </p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Finished</p>
                <p className="text-2xl font-bold text-foreground">
                  {globalStats.finished}
                </p>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">With Streams</p>
                <p className="text-2xl font-bold text-foreground">
                  {globalStats.withStreams}
                </p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Video className="h-4 w-4 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by team, stadium, or competition..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeOnly}
                    onChange={(e) => setActiveOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                  <span className="text-sm">Active Only</span>
                </label>

                <button
                  onClick={fetchLiveFixtures}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Live Status
                </label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                  >
                    <option value="all">All Status</option>
                    {LIVE_STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Fixtures Table */}
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Live Fixtures
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredFixtures.length} of {total} live fixtures
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-input bg-background rounded-lg text-sm"
                >
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">
                  Loading live fixtures...
                </p>
              </div>
            </div>
          ) : filteredFixtures.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <Radio className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">
                No live fixtures found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" || activeOnly
                  ? "Try adjusting your search or filters"
                  : "No live fixtures scheduled yet"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create First Live Fixture
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Match
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Competition
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Time & Status
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Score
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Live Stats
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredFixtures.map((fixture) => {
                    const isActive = isMatchActive(fixture.status);
                    const statusOption = LIVE_STATUS_OPTIONS.find(
                      (s) => s.value === fixture.status,
                    );
                    const homeName =
                      fixture.homeTeam?.name ||
                      fixture.temporaryHomeTeamName ||
                      "TBD";
                    const awayName =
                      fixture.awayTeam?.name ||
                      fixture.temporaryAwayTeamName ||
                      "TBD";

                    return (
                      <tr
                        key={fixture.id}
                        className={`hover:bg-accent/50 transition-colors ${isActive ? "bg-red-50 dark:bg-red-950/10" : ""}`}
                      >
                        {/* Match Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-12 w-12 rounded-lg ${isActive ? "bg-red-500/10" : "bg-primary/10"} flex items-center justify-center`}
                            >
                              {fixture.homeTeam?.logo ? (
                                <img
                                  src={fixture.homeTeam.logo}
                                  alt={homeName}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs font-bold">
                                    {fixture.homeTeam?.shorthand ||
                                      homeName.substring(0, 2) ||
                                      "HT"}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">
                                VS
                              </div>
                              {isActive && (
                                <div className="mt-1">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 text-xs">
                                    <Zap className="h-3 w-3" />
                                    LIVE
                                  </span>
                                </div>
                              )}
                            </div>
                            <div
                              className={`h-12 w-12 rounded-lg ${isActive ? "bg-red-500/10" : "bg-secondary/10"} flex items-center justify-center`}
                            >
                              {fixture.awayTeam?.logo ? (
                                <img
                                  src={fixture.awayTeam.logo}
                                  alt={awayName}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs font-bold">
                                    {fixture.awayTeam?.shorthand ||
                                      awayName.substring(0, 2) ||
                                      "AT"}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground truncate">
                                {homeName}
                              </div>
                              <div className="text-sm text-muted-foreground truncate">
                                {awayName}
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span className="text-xs text-muted-foreground">
                                  {fixture.stadium}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Competition */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {fixture.competition?.logo ? (
                              <img
                                src={fixture.competition.logo}
                                alt={fixture.competition.name}
                                className="h-6 w-6 rounded"
                              />
                            ) : (
                              <Trophy className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-sm">
                              {fixture.competition?.name || "Friendly"}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(new Date(fixture.matchDate), "MMM d")}
                          </div>
                        </td>

                        {/* Time & Status */}
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="text-sm font-medium text-foreground">
                                  {format(
                                    new Date(fixture.kickoffTime),
                                    "h:mm a",
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {statusOption && (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusOption.color}/10 text-${statusOption.color.split("-")[1]}-600`}
                                >
                                  <statusOption.icon className="h-3 w-3" />
                                  {statusOption.label}
                                </span>
                              )}
                              {isActive && fixture.currentMinute > 0 && (
                                <span className="text-sm font-bold">
                                  {fixture.currentMinute}'
                                  {fixture.injuryTime > 0 &&
                                    `+${fixture.injuryTime}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Score */}
                        <td className="py-4 px-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-foreground">
                              {fixture.result.homeScore} -{" "}
                              {fixture.result.awayScore}
                            </div>
                            {fixture.result.halftimeHomeScore !== null && (
                              <div className="text-xs text-muted-foreground">
                                HT: {fixture.result.halftimeHomeScore}-
                                {fixture.result.halftimeAwayScore}
                              </div>
                            )}
                            {fixture.goalScorers.length > 0 && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                {fixture.goalScorers.length} goal
                                {fixture.goalScorers.length !== 1 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Live Stats */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                Possession
                              </span>
                              <span className="font-medium">
                                {fixture.statistics.home.possessionTime}% -{" "}
                                {fixture.statistics.away.possessionTime}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                Shots on Target
                              </span>
                              <span className="font-medium">
                                {fixture.statistics.home.shotsOnTarget} -{" "}
                                {fixture.statistics.away.shotsOnTarget}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                Corners
                              </span>
                              <span className="font-medium">
                                {fixture.statistics.home.corners} -{" "}
                                {fixture.statistics.away.corners}
                              </span>
                            </div>
                            {fixture.streamLinks &&
                              fixture.streamLinks.length > 0 && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-xs">
                                    <Video className="h-3 w-3" />
                                    {fixture.streamLinks.length} stream
                                    {fixture.streamLinks.length !== 1
                                      ? "s"
                                      : ""}
                                  </span>
                                </div>
                              )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewDetails(fixture)}
                                className="p-2 hover:bg-accent rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => handleManageFixture(fixture)}
                                className="p-2 hover:bg-accent rounded-lg transition-colors"
                                title="Manage Live"
                              >
                                <Edit2 className="h-4 w-4 text-blue-500" />
                              </button>
                              {isActive && (
                                <button
                                  onClick={() => handleManageFixture(fixture)}
                                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                                  title="Live Control"
                                >
                                  <Zap className="h-4 w-4 text-red-500" />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  router.push(
                                    `/admin/live/football/match-events/${fixture.id}`,
                                  )
                                }
                                className="p-2 hover:bg-accent rounded-lg transition-colors"
                                title="Manage Live"
                              >
                                <Calendar className="h-4 w-4 text-blue-500" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              {isActive ? (
                                <button
                                  onClick={() => handleEndFixture(fixture)}
                                  className="text-xs px-2 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                                >
                                  End Match
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDeleteFixture(fixture)}
                                  className="text-xs px-2 py-1 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredFixtures.length > 0 && (
            <div className="p-6 border-t border-border flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total} live fixtures
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-input rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-3 py-1 text-sm font-medium">
                  Page {page} of {Math.ceil(total / limit)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / limit)}
                  className="p-2 border border-input rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {showCreateModal && (
        <CreateLiveFixtureModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showDetailsModal && selectedFixture && (
        <LiveFixtureDetailsModal
          fixture={selectedFixture}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showManageModal && selectedFixture && (
        <ManageLiveFixtureModal
          fixture={selectedFixture}
          isOpen={showManageModal}
          onClose={() => setShowManageModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
