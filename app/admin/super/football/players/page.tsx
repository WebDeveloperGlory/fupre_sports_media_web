// app/admin/super/football/players/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import "react-toastify/dist/ReactToastify.css";
import { uniManagementApi } from "@/lib/api/v1/uni-management.api";
import {
  PlayerPosition,
  PlayerFavoriteFoot,
  PlayerVerificationStatus,
} from "@/types/v1.football-player.types";
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
  User,
  MapPin,
  Trophy,
  Target,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Award,
} from "lucide-react";
import {
  DepartmentResponse,
  FacultyResponse,
  FootballPlayerResponse,
} from "@/lib/types/v1.response.types";
import { footballPlayerApi } from "@/lib/api/v1/football-player.api";
import { toast } from "react-toastify";
import { CreatePlayerModal } from "@/components/admin/super/CreatePlayerModal";
import { UpdatePlayerModal } from "@/components/admin/super/UpdatePlayerModal";
import { PlayerDetailsModal } from "@/components/admin/super/PlayerDetailsModal";
import { AwardPlayerModal } from "@/components/admin/super/AwardPlayerModal";
import { UpdateCareerStatsModal } from "@/components/admin/super/UpdateCareerStatsModal";

// Constants
const POSITION_OPTIONS = [
  { value: PlayerPosition.GK, label: "Goalkeeper", short: "GK" },
  { value: PlayerPosition.CB, label: "Center Back", short: "CB" },
  { value: PlayerPosition.LB, label: "Left Back", short: "LB" },
  { value: PlayerPosition.RB, label: "Right Back", short: "RB" },
  { value: PlayerPosition.CM, label: "Central Midfielder", short: "CM" },
  { value: PlayerPosition.AM, label: "Attacking Midfielder", short: "AM" },
  { value: PlayerPosition.LM, label: "Left Midfielder", short: "LM" },
  { value: PlayerPosition.RM, label: "Right Midfielder", short: "RM" },
  { value: PlayerPosition.LW, label: "Left Winger", short: "LW" },
  { value: PlayerPosition.RW, label: "Right Winger", short: "RW" },
  { value: PlayerPosition.SS, label: "Second Striker", short: "SS" },
  { value: PlayerPosition.CF, label: "Center Forward", short: "CF" },
];

const FOOT_OPTIONS = [
  { value: PlayerFavoriteFoot.LEFT, label: "Left" },
  { value: PlayerFavoriteFoot.RIGHT, label: "Right" },
  { value: PlayerFavoriteFoot.BOTH, label: "Both" },
];

const STATUS_OPTIONS = [
  {
    value: PlayerVerificationStatus.PENDING,
    label: "Pending",
    color: "bg-amber-500",
  },
  {
    value: PlayerVerificationStatus.VERIFIED,
    label: "Verified",
    color: "bg-emerald-500",
  },
  {
    value: PlayerVerificationStatus.REJECTED,
    label: "Rejected",
    color: "bg-rose-500",
  },
];

export default function FootballPlayersPage() {
  // State
  const [players, setPlayers] = useState<FootballPlayerResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [faculties, setFaculties] = useState<FacultyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [facultyFilter, setFacultyFilter] = useState<string>("all");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] =
    useState<FootballPlayerResponse | null>(null);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showCareerStatsModal, setShowCareerStatsModal] = useState(false);

  // Load initial data
  useEffect(() => {
    fetchPlayers();
    fetchDepartments();
    fetchFaculties();
  }, [page, limit]);

  // API calls
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await footballPlayerApi.getAll(page, limit);
      if (response.success) {
        setPlayers(response.data);
        setTotal(response.total);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch players");
    } finally {
      setLoading(false);
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

  // Filter players
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.department.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesPosition =
        positionFilter === "all" || player.naturalPosition === positionFilter;
      const matchesStatus =
        statusFilter === "all" || player.verificationStatus === statusFilter;
      const matchesDepartment =
        departmentFilter === "all" ||
        player.department._id === departmentFilter;

      let matchesFaculty = true;
      if (facultyFilter !== "all") {
        const department = departments.find(
          (d) => d.id === player.department._id,
        );
        matchesFaculty = department?.faculty === facultyFilter;
      }

      return (
        matchesSearch &&
        matchesPosition &&
        matchesStatus &&
        matchesDepartment &&
        matchesFaculty
      );
    });
  }, [
    players,
    searchQuery,
    positionFilter,
    statusFilter,
    departmentFilter,
    facultyFilter,
    departments,
  ]);

  // Handlers
  const handleViewDetails = (player: FootballPlayerResponse) => {
    setSelectedPlayer(player);
    setShowDetailsModal(true);
  };

  const handleEditPlayer = (player: FootballPlayerResponse) => {
    setSelectedPlayer(player);
    setShowUpdateModal(true);
  };

  const handleDeletePlayer = async (player: FootballPlayerResponse) => {
    if (!confirm(`Are you sure you want to delete ${player.name}?`)) return;

    try {
      const response = await footballPlayerApi.deletePlayer(player.id);
      toast.success(response.message || "Player deleted successfully");
      fetchPlayers(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || "Failed to delete player");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchPlayers(); // Refresh list
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    fetchPlayers(); // Refresh list
  };

  const handleAwardSuccess = () => {
    setShowAwardModal(false);
    fetchPlayers(); // Refresh list
  };

  const handleCareerStatsSuccess = () => {
    setShowCareerStatsModal(false);
    fetchPlayers(); // Refresh list
  };

  // Stats
  const stats = useMemo(() => {
    const verified = players.filter(
      (p) => p.verificationStatus === PlayerVerificationStatus.VERIFIED,
    ).length;
    const pending = players.filter(
      (p) => p.verificationStatus === PlayerVerificationStatus.PENDING,
    ).length;
    const totalValue = players.reduce(
      (sum, p) => sum + (p.marketValue || 0),
      0,
    );
    const avgValue = players.length > 0 ? totalValue / players.length : 0;

    return {
      total: players.length,
      verified,
      pending,
      avgValue: Math.round((avgValue / 1000000) * 100) / 100, // Convert to millions
      foreignPlayers: players.filter(
        (p) => p.nationality.toLowerCase() !== "nigerian",
      ).length,
    };
  }, [players]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Football Players
          </h1>
          <p className="text-muted-foreground">
            Manage football players, contracts, and statistics
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Player
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Players */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Players</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            All registered football players
          </p>
        </div>

        {/* Verified Players */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats.verified}
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Verified player accounts
          </p>
        </div>

        {/* Pending Verification */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Awaiting verification
          </p>
        </div>

        {/* Average Market Value */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Market Value</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                ₦{stats.avgValue}M
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Trophy className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Average player value
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
                placeholder="Search by name, nationality, or department..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Position Filter */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Position
            </label>
            <div className="relative">
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
              >
                <option value="all">All Positions</option>
                {POSITION_OPTIONS.map((pos) => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label}
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

          {/* Faculty Filter */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Faculty
            </label>
            <div className="relative">
              <select
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
              >
                <option value="all">All Faculties</option>
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
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
              >
                <option value="all">All Departments</option>
                {departments
                  .filter(
                    (dept) =>
                      facultyFilter === "all" || dept.faculty === facultyFilter,
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
        </div>
      </div>

      {/* Players Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Players</h2>
          <p className="text-sm text-muted-foreground">
            {filteredPlayers.length} of {total} players
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading players...</p>
              </div>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">
                No players found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "No players in the system yet"}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Player
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Position
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Department
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Nationality
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Market Value
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPlayers.map((player) => {
                  const position = POSITION_OPTIONS.find(
                    (p) => p.value === player.naturalPosition,
                  );
                  const status = STATUS_OPTIONS.find(
                    (s) => s.value === player.verificationStatus,
                  );

                  return (
                    <tr
                      key={player.id}
                      className="hover:bg-accent/50 transition-colors"
                    >
                      {/* Player Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {player.photo ? (
                              <img
                                src={player.photo}
                                alt={player.name}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <User className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {player.name}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {player.admissionYear}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Position */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{position?.short}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {position?.label}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-4 px-6">
                        <div className="font-medium text-foreground">
                          {player.department.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {player.department.code}
                        </div>
                      </td>

                      {/* Nationality */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-amber-500" />
                          <span>{player.nationality}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status?.color}/10 text-${status?.color.split("-")[1]}-600`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${status?.color}`}
                          ></div>
                          {status?.label}
                        </span>
                      </td>

                      {/* Market Value */}
                      <td className="py-4 px-6">
                        {player.marketValue ? (
                          <div className="font-medium text-foreground">
                            ₦{(player.marketValue / 1000000).toFixed(1)}M
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(player)}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleEditPlayer(player)}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4 text-blue-500" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPlayer(player);
                              setShowAwardModal(true);
                            }}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            title="Add Award"
                          >
                            <Award className="h-4 w-4 text-amber-500" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPlayer(player);
                              setShowCareerStatsModal(true);
                            }}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            title="Update Stats"
                          >
                            <BarChart3 className="h-4 w-4 text-green-500" />
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(player)}
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
        {!loading && filteredPlayers.length > 0 && (
          <div className="p-6 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} players
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
        <CreatePlayerModal
          departments={departments}
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showDetailsModal && selectedPlayer && (
        <PlayerDetailsModal
          player={selectedPlayer}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowUpdateModal(true);
          }}
        />
      )}

      {showUpdateModal && selectedPlayer && (
        <UpdatePlayerModal
          player={selectedPlayer}
          departments={departments}
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {showAwardModal && selectedPlayer && (
        <AwardPlayerModal
          player={selectedPlayer}
          isOpen={showAwardModal}
          onClose={() => setShowAwardModal(false)}
          onSuccess={handleAwardSuccess}
        />
      )}

      {showCareerStatsModal && selectedPlayer && (
        <UpdateCareerStatsModal
          player={selectedPlayer}
          isOpen={showCareerStatsModal}
          onClose={() => setShowCareerStatsModal(false)}
          onSuccess={handleCareerStatsSuccess}
        />
      )}
    </div>
  );
}
