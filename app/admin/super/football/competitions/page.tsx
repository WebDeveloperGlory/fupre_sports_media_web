"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import {
  CompetitionResponse,
  CompetitionStatsResponse,
} from "@/lib/types/v1.response.types";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Trophy,
  Target,
  CheckCircle,
  Clock,
  BarChart3,
  Award,
  TrendingUp,
  XCircle,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { CompetitionStatus, CompetitionType } from "@/types/v1.football-competition.types";
import { CompetitionDetailsModal } from "@/components/admin/super/CompetitionDetailsModal";
import { UpdateCompetitionModal } from "@/components/admin/super/UpdateCompetitionModal";
import { CreateCompetitionModal } from "@/components/admin/super/CreateCompetitionModal";
import { ManageTeamsModal } from "@/components/admin/super/ManageTeamsModal";
import { ManageSponsorsModal } from "@/components/admin/super/ManageSponsorsModal";
import { ManageRulesModal } from "@/components/admin/super/ManageRulesModal";
import { CompetitionActionsModal } from "@/components/admin/super/CompetitionActionsModal";
import { useRouter } from "next/navigation";

// Constants
const TYPE_OPTIONS = [
  { value: CompetitionType.LEAGUE, label: "League", short: "LGE" },
  { value: CompetitionType.KNOCKOUT, label: "Knockout", short: "KO" },
  { value: CompetitionType.HYBRID, label: "Hybrid", short: "HYB" },
];

const STATUS_OPTIONS = [
  {
    value: CompetitionStatus.UPCOMING,
    label: "Upcoming",
    color: "bg-blue-500",
    icon: Clock,
  },
  {
    value: CompetitionStatus.ONGOING,
    label: "Ongoing",
    color: "bg-emerald-500",
    icon: TrendingUp,
  },
  {
    value: CompetitionStatus.COMPLETED,
    label: "Completed",
    color: "bg-gray-500",
    icon: CheckCircle,
  },
  {
    value: CompetitionStatus.CANCELLED,
    label: "Cancelled",
    color: "bg-rose-500",
    icon: XCircle,
  },
];

export default function FootballCompetitionsPage() {
  const router = useRouter();

  // State
  const [competitions, setCompetitions] = useState<CompetitionResponse[]>([]);
  const [stats, setStats] = useState<CompetitionStatsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [showSponsorsModal, setShowSponsorsModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] =
    useState<CompetitionResponse | null>(null);

  // Load initial data
  useEffect(() => {
    fetchCompetitions();
  }, [page, limit]);

  // API calls
  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const response = await footballCompetitionApi.getAll(page, limit);
      if (response.success) {
        setCompetitions(response.data);
        setTotal(response.total);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch competitions");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompetitionStats = async (id: string) => {
    try {
      const response = await footballCompetitionApi.getStats(id);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch competition stats:", error);
      return null;
    }
  };

  // Filter competitions
  const filteredCompetitions = useMemo(() => {
    return competitions.filter((competition) => {
      const matchesSearch =
        competition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        competition.shorthand
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        competition.season.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        typeFilter === "all" || competition.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || competition.status === statusFilter;
      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && competition.isFeatured) ||
        (featuredFilter === "not-featured" && !competition.isFeatured);

      return matchesSearch && matchesType && matchesStatus && matchesFeatured;
    });
  }, [competitions, searchQuery, typeFilter, statusFilter, featuredFilter]);

  // Handlers
  const handleViewDetails = async (competition: CompetitionResponse) => {
    setSelectedCompetition(competition);
    setShowDetailsModal(true);
  };

  const handleEditCompetition = (competition: CompetitionResponse) => {
    setSelectedCompetition(competition);
    setShowUpdateModal(true);
  };

  const handleManageTeams = (competition: CompetitionResponse) => {
    setSelectedCompetition(competition);
    setShowTeamsModal(true);
  };

  const handleManageSponsors = (competition: CompetitionResponse) => {
    setSelectedCompetition(competition);
    setShowSponsorsModal(true);
  };

  const handleManageRules = (competition: CompetitionResponse) => {
    setSelectedCompetition(competition);
    setShowRulesModal(true);
  };

  const handleShowActions = (competition: CompetitionResponse) => {
    setSelectedCompetition(competition);
    setShowActionsModal(true);
  };

  const handleDeleteCompetition = async (competition: CompetitionResponse) => {
    if (!confirm(`Are you sure you want to delete ${competition.name}?`))
      return;

    try {
      const response = await footballCompetitionApi.delete(competition.id);
      toast.success(response.message || "Competition deleted successfully");
      fetchCompetitions(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || "Failed to delete competition");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchCompetitions(); // Refresh list
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    fetchCompetitions(); // Refresh list
  };

  // Stats
  const globalStats = useMemo(() => {
    const total = competitions.length;
    const active = competitions.filter((c) => c.isActive).length;
    const featured = competitions.filter((c) => c.isFeatured).length;
    const upcoming = competitions.filter(
      (c) => c.status === CompetitionStatus.UPCOMING,
    ).length;
    const ongoing = competitions.filter(
      (c) => c.status === CompetitionStatus.ONGOING,
    ).length;
    const totalTeams = competitions.reduce(
      (sum, comp) => sum + comp.teams.length,
      0,
    );
    const avgTeams = total > 0 ? (totalTeams / total).toFixed(1) : "0";

    return {
      total,
      active,
      featured,
      upcoming,
      ongoing,
      avgTeams,
    };
  }, [competitions]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Football Competitions
          </h1>
          <p className="text-muted-foreground">
            Manage football competitions, teams, fixtures, and statistics
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Competition
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Competitions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Competitions
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {globalStats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Trophy className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            All football competitions
          </p>
        </div>

        {/* Active Competitions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {globalStats.active}
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Currently active competitions
          </p>
        </div>

        {/* Featured Competitions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Featured</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {globalStats.featured}
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Featured competitions
          </p>
        </div>

        {/* Average Teams */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Teams</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {globalStats.avgTeams}
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Average teams per competition
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, shorthand, or season..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors">
              <Filter className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Competition Type
            </label>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
              >
                <option value="all">All Types</option>
                {TYPE_OPTIONS.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

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
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Featured Filter */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Featured Status
            </label>
            <div className="relative">
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
              >
                <option value="all">All</option>
                <option value="featured">Featured Only</option>
                <option value="not-featured">Not Featured</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Competitions Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Competitions
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredCompetitions.length} of {total} competitions
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">
                  Loading competitions...
                </p>
              </div>
            </div>
          ) : filteredCompetitions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">
                No competitions found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "No competitions in the system yet"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create First Competition
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Competition
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Teams
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Season
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCompetitions.map((competition) => {
                  const type = TYPE_OPTIONS.find(
                    (t) => t.value === competition.type,
                  );
                  const status = STATUS_OPTIONS.find(
                    (s) => s.value === competition.status,
                  );

                  return (
                    <tr
                      key={competition.id}
                      className="hover:bg-accent/50 transition-colors"
                    >
                      {/* Competition Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {competition.logo ? (
                              <img
                                src={competition.logo}
                                alt={competition.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <Trophy className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-foreground">
                                {competition.name}
                              </div>
                              {competition.isFeatured && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs">
                                  <Sparkles className="h-3 w-3" />
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {competition.shorthand}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg ${
                              competition.type === CompetitionType.LEAGUE
                                ? "bg-blue-500/10"
                                : competition.type === CompetitionType.KNOCKOUT
                                  ? "bg-rose-500/10"
                                  : "bg-purple-500/10"
                            }`}
                          >
                            <Trophy
                              className={`h-4 w-4 ${
                                competition.type === CompetitionType.LEAGUE
                                  ? "text-blue-500"
                                  : competition.type ===
                                      CompetitionType.KNOCKOUT
                                    ? "text-rose-500"
                                    : "text-purple-500"
                              }`}
                            />
                          </div>
                          <span className="font-medium">{type?.short}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {type?.label}
                        </div>
                      </td>

                      {/* Teams */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {competition.teams.length}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {competition.teamRegistrations.length} registered
                        </div>
                      </td>

                      {/* Season */}
                      <td className="py-4 px-6">
                        <div className="font-medium text-foreground">
                          {competition.season}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Match Week: {competition.currentMatchWeek}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status?.color}/10 text-${status?.color.split("-")[1]}-600`}
                        >
                          {status && <status.icon className="h-3 w-3" />}
                          {status?.label}
                        </span>
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {format(
                              new Date(competition.startDate),
                              "MMM d, yyyy",
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            to{" "}
                            {format(
                              new Date(competition.endDate),
                              "MMM d, yyyy",
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(competition)}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleEditCompetition(competition)}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4 text-blue-500" />
                          </button>
                          <button
                            onClick={() => handleManageTeams(competition)}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            title="Manage Teams"
                          >
                            <Users className="h-4 w-4 text-green-500" />
                          </button>
                          <button
                            onClick={() => handleShowActions(competition)}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            title="Actions"
                          >
                            <BarChart3 className="h-4 w-4 text-purple-500" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/super/football/standings/${competition.id}`)}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            title="Actions"
                          >
                            <Calendar className="h-4 w-4 text-purple-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteCompetition(competition)}
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
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredCompetitions.length > 0 && (
          <div className="p-6 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} competitions
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
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateCompetitionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showDetailsModal && selectedCompetition && (
        <CompetitionDetailsModal
          competition={selectedCompetition}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowUpdateModal(true);
          }}
        />
      )}

      {showUpdateModal && selectedCompetition && (
        <UpdateCompetitionModal
          competition={selectedCompetition}
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {showTeamsModal && selectedCompetition && (
        <ManageTeamsModal
          competition={selectedCompetition}
          isOpen={showTeamsModal}
          onClose={() => setShowTeamsModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {showSponsorsModal && selectedCompetition && (
        <ManageSponsorsModal
          competition={selectedCompetition}
          isOpen={showSponsorsModal}
          onClose={() => setShowSponsorsModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {showRulesModal && selectedCompetition && (
        <ManageRulesModal
          competition={selectedCompetition}
          isOpen={showRulesModal}
          onClose={() => setShowRulesModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {showActionsModal && selectedCompetition && (
        <CompetitionActionsModal
          competition={selectedCompetition}
          isOpen={showActionsModal}
          onClose={() => setShowActionsModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
