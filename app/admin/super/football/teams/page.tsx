"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Users,
  TrendingUp,
  Target,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Edit2,
  Trash2,
  Upload,
  FileText,
  BarChart3,
  Calendar,
  Shield,
  Users as PlayersIcon,
  ChevronDown,
  UserPlus,
} from "lucide-react";
import { toast } from "react-toastify";

// API
import { footballTeamApi } from "@/lib/api/v1/football-team.api";
import { uniManagementApi } from "@/lib/api/v1/uni-management.api";

// Types
import type {
  FootballTeamResponse,
  PlayerSeasonStatResponse,
  FootballPlayerContractResponse,
} from "@/lib/types/v1.response.types";
import type {
  FacultyResponse,
  DepartmentResponse,
} from "@/lib/types/v1.response.types";
import { TeamTypes } from "@/types/v1.football-team.types";
import TeamContractsModal from "@/components/admin/super/TeamContractsModal";
import CreateTeamModal from "@/components/admin/super/CreateTeamModal";
import TeamDetailsModal from "@/components/admin/super/TeamDetailsModal";
import UpdateTeamModal from "@/components/admin/super/UpdateTeamModal";
import UploadTeamLogoModal from "@/components/admin/super/UploadTeamLogoModal";
import TeamPlayerStatsModal from "@/components/admin/super/TeamPlayerStatsModal";
import SignContractModal from "@/components/admin/super/SignContractModal";

export default function TeamsPage() {
  const [teams, setTeams] = useState<FootballTeamResponse[]>([]);
  const [faculties, setFaculties] = useState<FacultyResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [facultyFilter, setFacultyFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [seasonFilter, setSeasonFilter] = useState<string>("");

  // Modal states
  const [selectedTeam, setSelectedTeam] = useState<FootballTeamResponse | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showUploadLogoModal, setShowUploadLogoModal] = useState(false);
  const [showContractsModal, setShowContractsModal] = useState(false);
  const [showPlayerStatsModal, setShowPlayerStatsModal] = useState(false);
  const [showSignContractModal, setShowSignContractModal] = useState(false);

  // Data for modals
  const [teamContracts, setTeamContracts] = useState<
    FootballPlayerContractResponse[]
  >([]);
  const [teamPlayerStats, setTeamPlayerStats] = useState<
    PlayerSeasonStatResponse[]
  >([]);
  const [contractsLoading, setContractsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Available seasons
  const [availableSeasons] = useState([
    "2023/2024",
    "2024/2025",
    "2025/2026",
    "2026/2027",
  ]);

  // Fetch initial data
  useEffect(() => {
    fetchTeams();
    fetchFaculties();
    fetchDepartments();
  }, [page, limit]);

  // API calls
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await footballTeamApi.getAll(page, limit);
      if (response.success) {
        setTeams(response.data);
        setTotal(response.total);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await uniManagementApi.getAllFaculties(1, 100);
      if (response.success) {
        setFaculties(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch faculties:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await uniManagementApi.getAllDepartments(1, 100);
      if (response.success) {
        setDepartments(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const fetchTeamContracts = async (teamId: string) => {
    try {
      setContractsLoading(true);
      const response = await footballTeamApi.getTeamPlayersContracts(
        teamId,
        1,
        100,
      );
      if (response.success) {
        setTeamContracts(response.data);
        setShowContractsModal(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch team contracts");
    } finally {
      setContractsLoading(false);
    }
  };

  const fetchTeamPlayerStats = async (teamId: string, season?: string) => {
    try {
      setStatsLoading(true);
      const payload = {
        players: [], // Empty array gets all players
        season,
      };
      const response = await footballTeamApi.getTeamPlayerStats(
        teamId,
        payload,
      );
      if (response.success) {
        setTeamPlayerStats(response.data);
        setShowPlayerStatsModal(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch player stats");
    } finally {
      setStatsLoading(false);
    }
  };

  // Filter teams
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchesSearch =
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.shorthand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFaculty =
        facultyFilter === "all" ||
        team.faculty?._id === facultyFilter ||
        (!team.faculty && facultyFilter === "general");

      const matchesDepartment =
        departmentFilter === "all" || team.department?._id === departmentFilter;

      const matchesType = typeFilter === "all" || team.type === typeFilter;

      return (
        matchesSearch && matchesFaculty && matchesDepartment && matchesType
      );
    });
  }, [teams, searchTerm, facultyFilter, departmentFilter, typeFilter]);

  // Handlers
  const handleViewTeam = (team: FootballTeamResponse) => {
    setSelectedTeam(team);
    setShowDetailsModal(true);
  };

  const handleEditTeam = (team: FootballTeamResponse) => {
    setSelectedTeam(team);
    setShowUpdateModal(true);
  };

  const handleUploadLogo = (team: FootballTeamResponse) => {
    setSelectedTeam(team);
    setShowUploadLogoModal(true);
  };

  const handleViewContracts = (team: FootballTeamResponse) => {
    setSelectedTeam(team);
    fetchTeamContracts(team.id);
  };

  const handleViewPlayerStats = (team: FootballTeamResponse) => {
    setSelectedTeam(team);
    fetchTeamPlayerStats(team.id, seasonFilter || undefined);
  };

  const handleDeleteTeam = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this team? This action cannot be undone.",
      )
    )
      return;

    try {
      const response = await footballTeamApi.deleteTeam(id);
      toast.success(response.message || "Team deleted successfully");
      fetchTeams(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || "Failed to delete team");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchTeams();
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    fetchTeams();
  };

  const handleUploadLogoSuccess = () => {
    setShowUploadLogoModal(false);
    fetchTeams();
  };

  const handleSignContract = (team: FootballTeamResponse) => {
    setSelectedTeam(team);
    setShowSignContractModal(true);
  };

  const handleContractSuccess = () => {
    setShowSignContractModal(false);
    // You might want to refresh contracts data here
    if (selectedTeam) {
      fetchTeamContracts(selectedTeam.id);
    }
  };

  // Stats
  const stats = useMemo(() => {
    const totalTeams = teams.length;
    const totalWins = teams.reduce((sum, team) => sum + team.stats.wins, 0);
    const totalDraws = teams.reduce((sum, team) => sum + team.stats.draws, 0);
    const totalLosses = teams.reduce((sum, team) => sum + team.stats.loses, 0);
    const totalGoals = teams.reduce(
      (sum, team) => sum + team.stats.goalsFor,
      0,
    );
    const avgWins = totalTeams > 0 ? (totalWins / totalTeams).toFixed(1) : 0;
    const winPercentage =
      totalTeams > 0
        ? ((totalWins / (totalWins + totalDraws + totalLosses)) * 100).toFixed(
            1,
          )
        : 0;

    return {
      total: totalTeams,
      avgWins,
      winPercentage,
      totalGoals,
      departmentTeams: teams.filter(
        (t) =>
          t.type === TeamTypes.DEPARTMENT_LEVEL ||
          t.type === TeamTypes.DEPARTMENT_GENERAL,
      ).length,
      facultyTeams: teams.filter((t) => t.type === TeamTypes.FACULTY_GENERAL)
        .length,
      cleanSheets: teams.reduce(
        (sum, team) => sum + (team.stats.goalsAgainst === 0 ? 1 : 0),
        0,
      ),
    };
  }, [teams]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Football Teams</h1>
          <p className="text-muted-foreground">
            Manage all football teams, contracts, and statistics
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Team
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Teams */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Teams</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            All registered football teams
          </p>
        </div>

        {/* Win Percentage */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Win Percentage</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats.winPercentage}%
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Average win rate across all teams
          </p>
        </div>

        {/* Total Goals */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Goals</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats.totalGoals}
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <Target className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Goals scored across all teams
          </p>
        </div>

        {/* Clean Sheets */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Clean Sheets</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats.cleanSheets}
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Shield className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Matches without conceding
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
                placeholder="Search by team name or shorthand..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          {/* Export Button */}
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Faculty Filter */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Faculty
            </label>
            <div className="relative">
              <select
                value={facultyFilter}
                onChange={(e) => {
                  setFacultyFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
              >
                <option value="all">All Faculties</option>
                <option value="general">General</option>
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Department
            </label>
            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
              >
                <option value="all">All Departments</option>
                {departments
                  .filter(
                    (dept) =>
                      facultyFilter === "all" ||
                      facultyFilter === "general" ||
                      dept.faculty === facultyFilter,
                  )
                  .map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Team Type Filter */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Team Type
            </label>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
              >
                <option value="all">All Types</option>
                {Object.values(TeamTypes).map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/-/g, " ").toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Season Filter */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Season (Stats)
            </label>
            <div className="relative">
              <select
                value={seasonFilter}
                onChange={(e) => setSeasonFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
              >
                <option value="">All Seasons</option>
                {availableSeasons.map((season) => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Teams</h2>
          <p className="text-sm text-muted-foreground">
            {filteredTeams.length} of {total} teams
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading teams...</p>
            </div>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              No teams found
            </h3>
            <p className="text-muted-foreground">
              {searchTerm ||
              facultyFilter !== "all" ||
              departmentFilter !== "all" ||
              typeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No teams in the system yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Team
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Faculty/Department
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Record
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Goals
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTeams.map((team) => (
                  <tr
                    key={team.id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    {/* Team Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {team.logo ? (
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                              <span className="text-white font-bold">
                                {team.shorthand.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-2">
                            {team.name}
                            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                              {team.shorthand}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {team.academicYear}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Faculty/Department */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-foreground">
                        {team.faculty?.name ||
                          team.department?.name ||
                          "General"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {team.department?.code || team.faculty?.code || "-"}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium">
                        {team.type.replace(/-/g, " ").toUpperCase()}
                      </span>
                    </td>

                    {/* Record */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-foreground">
                        {team.stats.wins}W-{team.stats.draws}D-
                        {team.stats.loses}L
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {team.stats.played} played
                      </div>
                    </td>

                    {/* Goals */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-foreground">
                        {team.stats.goalsFor}:{team.stats.goalsAgainst}
                      </div>
                      <div
                        className={`text-sm ${team.stats.goalsFor - team.stats.goalsAgainst > 0 ? "text-emerald-600" : team.stats.goalsFor - team.stats.goalsAgainst < 0 ? "text-rose-600" : "text-muted-foreground"}`}
                      >
                        GD:{" "}
                        {team.stats.goalsFor - team.stats.goalsAgainst > 0
                          ? "+"
                          : ""}
                        {team.stats.goalsFor - team.stats.goalsAgainst}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewTeam(team)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleEditTeam(team)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="Edit Team"
                        >
                          <Edit2 className="h-4 w-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleUploadLogo(team)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="Upload Logo"
                        >
                          <Upload className="h-4 w-4 text-amber-500" />
                        </button>
                        <button
                          onClick={() => handleViewContracts(team)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="View Contracts"
                        >
                          <FileText className="h-4 w-4 text-purple-500" />
                        </button>
                        <button
                          onClick={() => handleSignContract(team)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="Sign Contract"
                        >
                          <UserPlus className="h-4 w-4 text-green-500" />
                        </button>
                        <button
                          onClick={() => handleViewPlayerStats(team)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="Player Stats"
                        >
                          <BarChart3 className="h-4 w-4 text-green-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team.id)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="Delete Team"
                        >
                          <Trash2 className="h-4 w-4 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredTeams.length > 0 && (
          <div className="p-6 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} teams
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
        <CreateTeamModal
          faculties={faculties}
          departments={departments}
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showDetailsModal && selectedTeam && (
        <TeamDetailsModal
          team={selectedTeam}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false);
            handleEditTeam(selectedTeam);
          }}
          onUploadLogo={() => {
            setShowDetailsModal(false);
            handleUploadLogo(selectedTeam);
          }}
          onViewContracts={() => {
            setShowDetailsModal(false);
            handleViewContracts(selectedTeam);
          }}
          onViewStats={() => {
            setShowDetailsModal(false);
            handleViewPlayerStats(selectedTeam);
          }}
        />
      )}

      {showUpdateModal && selectedTeam && (
        <UpdateTeamModal
          team={selectedTeam}
          faculties={faculties}
          departments={departments}
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {showUploadLogoModal && selectedTeam && (
        <UploadTeamLogoModal
          team={selectedTeam}
          isOpen={showUploadLogoModal}
          onClose={() => setShowUploadLogoModal(false)}
          onSuccess={handleUploadLogoSuccess}
        />
      )}

      {showContractsModal && selectedTeam && (
        <TeamContractsModal
          team={selectedTeam}
          contracts={teamContracts}
          loading={contractsLoading}
          isOpen={showContractsModal}
          onClose={() => setShowContractsModal(false)}
        />
      )}

      {showPlayerStatsModal && selectedTeam && (
        <TeamPlayerStatsModal
          team={selectedTeam}
          stats={teamPlayerStats}
          season={seasonFilter}
          loading={statsLoading}
          isOpen={showPlayerStatsModal}
          onClose={() => setShowPlayerStatsModal(false)}
        />
      )}

      {showSignContractModal && selectedTeam && (
        <SignContractModal
          team={selectedTeam}
          isOpen={showSignContractModal}
          onClose={() => setShowSignContractModal(false)}
          onSuccess={handleContractSuccess}
        />
      )}
    </div>
  );
}
