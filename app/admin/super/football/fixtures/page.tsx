"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { footballFixtureApi } from "@/lib/api/v1/football-fixture.api";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { footballTeamApi } from "@/lib/api/v1/football-team.api";
import { FixtureResponse } from "@/lib/types/v1.response.types";
import { FixtureType, FixtureStatus } from "@/types/v1.football-fixture.types";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Trophy,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  AlertCircle,
  Sparkles,
  BarChart3,
  RefreshCw,
  Download,
  Upload,
  WatchIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { FixtureDetailsModal } from "@/components/admin/super/FixtureDetailsModal";
import { CreateFixtureModal } from "@/components/admin/super/CreateFixtureModal";
import { UpdateFixtureModal } from "@/components/admin/super/UpdateFixtureModal";
import { FixtureStatisticsModal } from "@/components/admin/super/FixtureStatisticsModal";

const STATUS_OPTIONS = [
  {
    value: FixtureStatus.SCHEDULED,
    label: "Scheduled",
    color: "bg-blue-500",
    icon: Calendar,
  },
  {
    value: FixtureStatus.LIVE,
    label: "Live",
    color: "bg-red-500",
    icon: Clock,
  },
  {
    value: FixtureStatus.COMPLETED,
    label: "Completed",
    color: "bg-emerald-500",
    icon: CheckCircle,
  },
  {
    value: FixtureStatus.POSTPONED,
    label: "Postponed",
    color: "bg-amber-500",
    icon: AlertCircle,
  },
  {
    value: FixtureStatus.CANCELED,
    label: "Canceled",
    color: "bg-gray-500",
    icon: XCircle,
  },
];

export default function FootballFixturesPage() {
  // State
  const [fixtures, setFixtures] = useState<FixtureResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedFixture, setSelectedFixture] =
    useState<FixtureResponse | null>(null);

  // Data for filters
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  // Load initial data
  useEffect(() => {
    fetchFixtures();
    fetchCompetitions();
    fetchTeams();
  }, [page, limit]);

  const fetchFixtures = async () => {
    try {
      setLoading(true);
      const response = await footballFixtureApi.getAll(page, limit);
      if (response.success) {
        setFixtures(response.data);
        setTotal(response.total);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch fixtures");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompetitions = async () => {
    try {
      const response = await footballCompetitionApi.getAll(1, 50);
      if (response.success) {
        setCompetitions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch competitions:", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await footballTeamApi.getAll(1, 50);
      if (response.success) {
        setTeams(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  };

  // Filter fixtures
  const filteredFixtures = useMemo(() => {
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
      const matchesType =
        typeFilter === "all" || fixture.matchType === typeFilter;

      let matchesDate = true;
      if (dateFilter !== "all") {
        const today = new Date();
        const fixtureDate = new Date(fixture.scheduledDate);

        if (dateFilter === "today") {
          matchesDate = fixtureDate.toDateString() === today.toDateString();
        } else if (dateFilter === "upcoming") {
          matchesDate =
            fixtureDate > today && fixture.status === FixtureStatus.SCHEDULED;
        } else if (dateFilter === "past") {
          matchesDate = fixtureDate < today;
        }
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [fixtures, searchQuery, statusFilter, typeFilter, dateFilter]);

  // Handlers
  const handleViewDetails = (fixture: FixtureResponse) => {
    setSelectedFixture(fixture);
    setShowDetailsModal(true);
  };

  const handleEditFixture = (fixture: FixtureResponse) => {
    setSelectedFixture(fixture);
    setShowUpdateModal(true);
  };

  const handleManageStats = (fixture: FixtureResponse) => {
    setSelectedFixture(fixture);
    setShowStatsModal(true);
  };

  const handleDeleteFixture = async (fixture: FixtureResponse) => {
    if (!confirm(`Are you sure you want to delete this fixture?`)) return;

    try {
      const response = await footballFixtureApi.delete(fixture.id);
      toast.success(response.message || "Fixture deleted successfully");
      fetchFixtures();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete fixture");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchFixtures();
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    fetchFixtures();
  };

  // Stats
  const globalStats = useMemo(() => {
    const total = fixtures.length;
    const scheduled = fixtures.filter(
      (f) => f.status === FixtureStatus.SCHEDULED,
    ).length;
    const live = fixtures.filter((f) => f.status === FixtureStatus.LIVE).length;
    const completed = fixtures.filter(
      (f) => f.status === FixtureStatus.COMPLETED,
    ).length;
    const postponed = fixtures.filter(
      (f) => f.status === FixtureStatus.POSTPONED,
    ).length;
    const canceled = fixtures.filter(
      (f) => f.status === FixtureStatus.CANCELED,
    ).length;
    const competition = fixtures.filter(
      (f) => f.matchType === FixtureType.COMPETITION,
    ).length;
    const friendly = fixtures.filter(
      (f) => f.matchType === FixtureType.FRIENDLY,
    ).length;

    return {
      total,
      scheduled,
      live,
      completed,
      postponed,
      canceled,
      competition,
      friendly,
    };
  }, [fixtures]);

  const getStatusIcon = (status: FixtureStatus) => {
    const option = STATUS_OPTIONS.find((s) => s.value === status);
    return option?.icon || Clock;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Football Fixtures
          </h1>
          <p className="text-muted-foreground">
            Manage match schedules, results, and statistics
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => toast.info("Export feature coming soon")}
            className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Fixture
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
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
                <Trophy className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-foreground">
                  {globalStats.scheduled}
                </p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live</p>
                <p className="text-2xl font-bold text-foreground">
                  {globalStats.live}
                </p>
              </div>
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Clock className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {globalStats.completed}
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
                <p className="text-sm text-muted-foreground">Postponed</p>
                <p className="text-2xl font-bold text-foreground">
                  {globalStats.postponed}
                </p>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Competition</p>
                <p className="text-2xl font-bold text-foreground">
                  {globalStats.competition}
                </p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Trophy className="h-4 w-4 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Friendly</p>
                <p className="text-2xl font-bold text-foreground">
                  {globalStats.friendly}
                </p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Users className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Canceled</p>
                <p className="text-2xl font-bold text-foreground">
                  {globalStats.canceled}
                </p>
              </div>
              <div className="p-2 bg-gray-500/10 rounded-lg">
                <XCircle className="h-4 w-4 text-gray-500" />
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

              <button
                onClick={fetchFixtures}
                className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                  >
                    <option value="all">All Status</option>
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Match Type
                </label>
                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                  >
                    <option value="all">All Types</option>
                    <option value={FixtureType.COMPETITION}>Competition</option>
                    <option value={FixtureType.FRIENDLY}>Friendly</option>
                  </select>
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Date Range
                </label>
                <div className="relative">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixtures Table */}
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Fixtures
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredFixtures.length} of {total} fixtures
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
                  <option value="100">100 per page</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">
                  Loading fixtures...
                </p>
              </div>
            </div>
          ) : filteredFixtures.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">
                No fixtures found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No fixtures scheduled yet"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create First Fixture
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
                      Date & Time
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Score
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredFixtures.map((fixture) => {
                    const StatusIcon = getStatusIcon(fixture.status);
                    const statusOption = STATUS_OPTIONS.find(
                      (s) => s.value === fixture.status,
                    );

                    return (
                      <tr
                        key={fixture.id}
                        className="hover:bg-accent/50 transition-colors"
                      >
                        {/* Match Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              {fixture.homeTeam?.logo ? (
                                <img
                                  src={fixture.homeTeam.logo}
                                  alt={fixture.homeTeam.name}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs font-bold">
                                    {fixture.homeTeam?.shorthand ||
                                      fixture.temporaryHomeTeamName?.substring(
                                        0,
                                        2,
                                      ) ||
                                      "HT"}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">
                                VS
                              </div>
                            </div>
                            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                              {fixture.awayTeam?.logo ? (
                                <img
                                  src={fixture.awayTeam.logo}
                                  alt={fixture.awayTeam.name}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs font-bold">
                                    {fixture.awayTeam?.shorthand ||
                                      fixture.temporaryAwayTeamName?.substring(
                                        0,
                                        2,
                                      ) ||
                                      "AT"}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground truncate">
                                {fixture.homeTeam?.name ||
                                  fixture.temporaryHomeTeamName ||
                                  "TBD"}
                              </div>
                              <div className="text-sm text-muted-foreground truncate">
                                {fixture.awayTeam?.name ||
                                  fixture.temporaryAwayTeamName ||
                                  "TBD"}
                              </div>
                              {fixture.isDerby && (
                                <div className="mt-1">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs">
                                    <Sparkles className="h-3 w-3" />
                                    Derby
                                  </span>
                                </div>
                              )}
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
                          <div className="text-xs text-muted-foreground capitalize mt-1">
                            {fixture.matchType}
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {format(
                                  new Date(fixture.scheduledDate),
                                  "MMM d, yyyy",
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {format(
                                  new Date(fixture.scheduledDate),
                                  "h:mm a",
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Venue */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">{fixture.stadium}</div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <WatchIcon className="h-3 w-3" />
                              {fixture.referee}
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusOption?.color}/10 text-${statusOption?.color.split("-")[1]}-600`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusOption?.label}
                          </span>
                        </td>

                        {/* Score */}
                        <td className="py-4 px-6">
                          {fixture.status !== FixtureStatus.SCHEDULED ? (
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
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground text-sm">
                              Not started
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(fixture)}
                              className="p-2 hover:bg-accent rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleEditFixture(fixture)}
                              className="p-2 hover:bg-accent rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4 text-blue-500" />
                            </button>
                            <button
                              onClick={() => handleManageStats(fixture)}
                              className="p-2 hover:bg-accent rounded-lg transition-colors"
                              title="Statistics"
                            >
                              <BarChart3 className="h-4 w-4 text-purple-500" />
                            </button>
                            <button
                              onClick={() => handleDeleteFixture(fixture)}
                              className="p-2 hover:bg-accent rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-rose-500" />
                            </button>
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
                {Math.min(page * limit, total)} of {total} fixtures
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
        <CreateFixtureModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
          competitions={competitions}
          teams={teams}
        />
      )}

      {showDetailsModal && selectedFixture && (
        <FixtureDetailsModal
          fixture={selectedFixture}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowUpdateModal(true);
          }}
        />
      )}

      {showUpdateModal && selectedFixture && (
        <UpdateFixtureModal
          fixture={selectedFixture}
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleUpdateSuccess}
          competitions={competitions}
          teams={teams}
        />
      )}

      {showStatsModal && selectedFixture && (
        <FixtureStatisticsModal
          fixture={selectedFixture}
          isOpen={showStatsModal}
          onClose={() => setShowStatsModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
