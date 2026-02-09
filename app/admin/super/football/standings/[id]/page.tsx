// app/admin/super/football/competitions/[id]/standings/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Trophy,
  Users,
  Calendar,
  Target,
  BarChart3,
  Plus,
  UserPlus,
  ClipboardList,
  Table as TableIcon,
  Network,
  Filter,
  Download,
  ChevronDown,
  Award,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit2,
  Trash2,
  UsersRound,
  ShieldCheck,
  ShieldAlert,
  Search,
} from "lucide-react";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { CompetitionResponse } from "@/lib/types/v1.response.types";
import {
  CompetitionStatus,
  CompetitionType,
  GroupTable,
  LeagueStanding,
  KnockoutRound,
  CompetitionTeamReg,
} from "@/types/v1.football-competition.types";
import { RegisterSquadModal } from "@/components/admin/super/RegisterSquadModal";
import { ManageKnockoutRoundsModal } from "@/components/admin/super/ManageKnockoutRoundsModel";
import { UpdateGroupStageModal } from "@/components/admin/super/UpdateGroupStageModal";
import { UpdateLeagueTableModal } from "@/components/admin/super/UpdateLeaagueTableModel";
import { CompetitionStatsModal } from "@/components/admin/super/CompetitionStatsModal";

export default function CompetitionStandingsPage() {
  const params = useParams();
  const router = useRouter();
  const competitionId = params.id as string;

  const [competition, setCompetition] = useState<CompetitionResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "league" | "groups" | "knockout" | "teams"
  >("league");
  const [showSquadModal, setShowSquadModal] = useState(false);
  const [showKnockoutModal, setShowKnockoutModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<GroupTable | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (competitionId) {
      fetchCompetition();
    }
  }, [competitionId]);

  const fetchCompetition = async () => {
    try {
      setLoading(true);
      const response = await footballCompetitionApi.getById(competitionId);

      if (response.success) {
        setCompetition(response.data);

        // Set initial tab based on competition type
        if (response.data.type === CompetitionType.LEAGUE) {
          setActiveTab("league");
        } else if (response.data.type === CompetitionType.KNOCKOUT) {
          setActiveTab("knockout");
        } else if (response.data.type === CompetitionType.HYBRID) {
          setActiveTab("groups");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch competition data");
      router.push("/admin/super/football/competitions");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSquad = (teamId: string) => {
    setSelectedTeam(teamId);
    setShowSquadModal(true);
  };

  const handleSquadSuccess = () => {
    setShowSquadModal(false);
    setSelectedTeam(null);
    fetchCompetition();
  };

  const handleKnockoutSuccess = () => {
    setShowKnockoutModal(false);
    fetchCompetition();
  };

  const handleGroupSuccess = () => {
    setShowGroupModal(false);
    setSelectedGroup(null);
    fetchCompetition();
  };

  const handleLeagueSuccess = () => {
    setShowLeagueModal(false);
    fetchCompetition();
  };

  const getStatusColor = (status: CompetitionStatus) => {
    switch (status) {
      case CompetitionStatus.ONGOING:
        return "bg-emerald-500";
      case CompetitionStatus.UPCOMING:
        return "bg-blue-500";
      case CompetitionStatus.COMPLETED:
        return "bg-gray-500";
      case CompetitionStatus.CANCELLED:
        return "bg-rose-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: CompetitionStatus) => {
    switch (status) {
      case CompetitionStatus.ONGOING:
        return TrendingUp;
      case CompetitionStatus.UPCOMING:
        return Clock;
      case CompetitionStatus.COMPLETED:
        return CheckCircle;
      case CompetitionStatus.CANCELLED:
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getTabVisibility = () => {
    if (!competition) return {};

    return {
      league: competition.type === CompetitionType.LEAGUE,
      groups: competition.type === CompetitionType.HYBRID,
      knockout:
        competition.type === CompetitionType.KNOCKOUT ||
        competition.type === CompetitionType.HYBRID,
      teams: true,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading competition data...
          </p>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Competition Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          The competition you're looking for doesn't exist.
        </p>
        <button
          onClick={() => router.push("/admin/super/football/competitions")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competitions
        </button>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(competition.status);
  const tabVisibility = getTabVisibility();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/super/football/competitions")}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {competition.name}
                </h1>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    <Trophy className="h-3 w-3" />
                    {competition.shorthand}
                  </span>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(competition.status)}/10 text-${getStatusColor(competition.status).split("-")[1]}-600 text-sm`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {competition.status}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Season: {competition.season}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Type: {competition.type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowStatsModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                View Stats
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Teams</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {competition.teams.length}
                </p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {competition.teamRegistrations.length} registered
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-lg font-bold text-foreground mt-1">
                  {format(new Date(competition.startDate), "MMM d, yyyy")}
                </p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              to {format(new Date(competition.endDate), "MMM d, yyyy")}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Stage</p>
                <p className="text-lg font-bold text-foreground mt-1">
                  {competition.currentStage || "Not started"}
                </p>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Target className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Match Week: {competition.currentMatchWeek}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-6">
          {tabVisibility.league && (
            <button
              onClick={() => setActiveTab("league")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "league" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <div className="flex items-center gap-2">
                <TableIcon className="h-4 w-4" />
                League Table
              </div>
            </button>
          )}

          {tabVisibility.groups && (
            <button
              onClick={() => setActiveTab("groups")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "groups" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <div className="flex items-center gap-2">
                <UsersRound className="h-4 w-4" />
                Groups
              </div>
            </button>
          )}

          {tabVisibility.knockout && (
            <button
              onClick={() => setActiveTab("knockout")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "knockout" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                Knockout
              </div>
            </button>
          )}

          <button
            onClick={() => setActiveTab("teams")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "teams" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teams
              <span className="px-2 py-0.5 text-xs rounded-full bg-muted">
                {competition.teams.length}
              </span>
            </div>
          </button>
        </nav>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "league" && competition.leagueTable && (
            <button
              onClick={() => setShowLeagueModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit Table
            </button>
          )}
          {activeTab === "groups" && competition.groupStage && (
            <button
              onClick={() => setShowGroupModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit Groups
            </button>
          )}
          {activeTab === "knockout" && competition.knockoutRounds && (
            <button
              onClick={() => setShowKnockoutModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit Knockout
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "league" && competition.leagueTable && (
          <LeagueTableView
            standings={competition.leagueTable}
            competitionId={competition.id}
            onManageSquad={handleRegisterSquad}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === "groups" && competition.groupStage && (
          <GroupStageView
            groups={competition.groupStage}
            competitionId={competition.id}
            onManageSquad={handleRegisterSquad}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === "knockout" && competition.knockoutRounds && (
          <KnockoutView
            rounds={competition.knockoutRounds}
            competitionId={competition.id}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === "teams" && (
          <TeamsView
            teams={competition.teams}
            registrations={competition.teamRegistrations}
            onManageSquad={handleRegisterSquad}
            searchQuery={searchQuery}
          />
        )}
      </div>

      {/* Modals */}
      {showSquadModal && selectedTeam && (
        <RegisterSquadModal
          competitionId={competition.id}
          teamId={selectedTeam}
          isOpen={showSquadModal}
          onClose={() => {
            setShowSquadModal(false);
            setSelectedTeam(null);
          }}
          onSuccess={handleSquadSuccess}
        />
      )}

      {showKnockoutModal && competition && competition.knockoutRounds && (
        <ManageKnockoutRoundsModal
          competition={competition}
          isOpen={showKnockoutModal}
          onClose={() => setShowKnockoutModal(false)}
          onSuccess={handleKnockoutSuccess}
        />
      )}

      {showGroupModal && competition && competition.groupStage && (
        <UpdateGroupStageModal
          competition={competition}
          isOpen={showGroupModal}
          onClose={() => setShowGroupModal(false)}
          onSuccess={handleGroupSuccess}
        />
      )}

      {showLeagueModal && competition && competition.leagueTable && (
        <UpdateLeagueTableModal
          competition={competition}
          isOpen={showLeagueModal}
          onClose={() => setShowLeagueModal(false)}
          onSuccess={handleLeagueSuccess}
        />
      )}

      {showStatsModal && competition && (
        <CompetitionStatsModal
          competition={competition}
          isOpen={showStatsModal}
          onClose={() => setShowStatsModal(false)}
        />
      )}
    </div>
  );
}

// League Table Component
function LeagueTableView({
  standings,
  competitionId,
  onManageSquad,
  searchQuery,
}: {
  standings: LeagueStanding[];
  competitionId: string;
  onManageSquad: (teamId: string) => void;
  searchQuery: string;
}) {
  const sortedStandings = [...standings].sort(
    (a, b) => a.position - b.position,
  );

  const filteredStandings = sortedStandings.filter((standing) => {
    if (!searchQuery) return true;

    const teamName =
      typeof standing.team === "string" ? standing.team : standing.team.name;

    return teamName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          League Standings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {filteredStandings.length} of {standings.length} teams
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pos
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Team
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                P
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                W
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                D
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                L
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                GF
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                GA
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                GD
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pts
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Form
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredStandings.map((standing) => {
              const teamName =
                typeof standing.team === "string"
                  ? standing.team
                  : standing.team.name;
              const teamId =
                typeof standing.team === "string"
                  ? standing.team
                  : standing.team.id;
              const teamLogo =
                typeof standing.team === "string" ? null : standing.team.logo;

              return (
                <tr
                  key={standing.id}
                  className="hover:bg-accent/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                          standing.position <= 4
                            ? "bg-emerald-500/10 text-emerald-600"
                            : standing.position === 5
                              ? "bg-blue-500/10 text-blue-600"
                              : standing.position >=
                                  filteredStandings.length - 2
                                ? "bg-rose-500/10 text-rose-600"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {standing.position}
                      </span>
                      <div className="text-muted-foreground">
                        {standing.positionChange > 0 ? (
                          <TrendingUp className="h-3 w-3 text-emerald-500" />
                        ) : standing.positionChange < 0 ? (
                          <TrendingDown className="h-3 w-3 text-rose-500" />
                        ) : (
                          <Minus className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                        {teamLogo ? (
                          <img
                            src={teamLogo}
                            alt={teamName}
                            className="h-8 w-8 object-cover"
                          />
                        ) : (
                          <Users className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {teamName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {standing.previousPosition > 0 &&
                            `Prev: ${standing.previousPosition}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-center">
                    {standing.played}
                  </td>
                  <td className="py-4 px-6 font-medium text-center text-emerald-600">
                    {standing.wins}
                  </td>
                  <td className="py-4 px-6 font-medium text-center text-blue-600">
                    {standing.draws}
                  </td>
                  <td className="py-4 px-6 font-medium text-center text-rose-600">
                    {standing.losses}
                  </td>
                  <td className="py-4 px-6 font-medium text-center">
                    {standing.goalsFor}
                  </td>
                  <td className="py-4 px-6 font-medium text-center">
                    {standing.goalsAgainst}
                  </td>
                  <td className="py-4 px-6 font-medium text-center">
                    <span
                      className={
                        standing.goalDifference > 0
                          ? "text-emerald-600"
                          : standing.goalDifference < 0
                            ? "text-rose-600"
                            : ""
                      }
                    >
                      {standing.goalDifference > 0 ? "+" : ""}
                      {standing.goalDifference}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-bold text-lg text-foreground">
                      {standing.points}
                    </span>
                    {standing.bonusPoints > 0 && (
                      <span className="ml-1 text-xs text-blue-500">
                        +{standing.bonusPoints}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-1 justify-center">
                      {standing.form.slice(-5).map((result, index) => (
                        <span
                          key={index}
                          className={`h-6 w-6 rounded flex items-center justify-center text-xs font-medium ${
                            result === "W"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : result === "D"
                                ? "bg-blue-500/10 text-blue-600"
                                : "bg-rose-500/10 text-rose-600"
                          }`}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => onManageSquad(teamId)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                      title="Register Squad"
                    >
                      <UserPlus className="h-4 w-4 text-blue-500" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredStandings.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No teams found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search query
          </p>
        </div>
      )}
    </div>
  );
}

// Group Stage Component
function GroupStageView({
  groups,
  competitionId,
  onManageSquad,
  searchQuery,
}: {
  groups: GroupTable[];
  competitionId: string;
  onManageSquad: (teamId: string) => void;
  searchQuery: string;
}) {
  const filteredGroups = groups.filter(
    (group) =>
      !searchQuery ||
      group.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Group Stage</h2>
        <p className="text-sm text-muted-foreground">
          {groups.length} groups,{" "}
          {groups.reduce((acc, group) => acc + group.standings.length, 0)} teams
        </p>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <UsersRound className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No groups found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search query
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {group.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {group.matchesPlayed}/{group.totalMatches} matches played
                    {group.completed && " • Completed"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {group.qualificationRules.length > 0 && (
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500">
                      Qualification Rules
                    </span>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                        Pos
                      </th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                        Team
                      </th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                        P
                      </th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                        W
                      </th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                        D
                      </th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                        L
                      </th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                        GF
                      </th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                        GA
                      </th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                        GD
                      </th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">
                        Pts
                      </th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.standings
                      .sort((a, b) => a.position - b.position)
                      .map((standing) => {
                        const teamName =
                          typeof standing.team === "string"
                            ? standing.team
                            : standing.team.name;
                        const teamId =
                          typeof standing.team === "string"
                            ? standing.team
                            : standing.team.id;
                        const isQualified = group.qualifiedTeams?.some(
                          (qt) => qt.team === teamId,
                        );

                        return (
                          <tr
                            key={standing.id}
                            className="border-b border-border last:border-0 hover:bg-accent/50"
                          >
                            <td className="py-2 px-4">
                              <span
                                className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${
                                  standing.position <= 2
                                    ? "bg-emerald-500/10 text-emerald-600"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {standing.position}
                              </span>
                            </td>
                            <td className="py-2 px-4">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                                  <Users className="h-3 w-3 text-primary" />
                                </div>
                                <span className="text-sm font-medium">
                                  {teamName}
                                </span>
                                {isQualified && (
                                  <Crown className="h-3 w-3 text-amber-500" />
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-4 text-sm text-center">
                              {standing.played}
                            </td>
                            <td className="py-2 px-4 text-sm text-center text-emerald-600">
                              {standing.wins}
                            </td>
                            <td className="py-2 px-4 text-sm text-center text-blue-600">
                              {standing.draws}
                            </td>
                            <td className="py-2 px-4 text-sm text-center text-rose-600">
                              {standing.losses}
                            </td>
                            <td className="py-2 px-4 text-sm text-center">
                              {standing.goalsFor}
                            </td>
                            <td className="py-2 px-4 text-sm text-center">
                              {standing.goalsAgainst}
                            </td>
                            <td className="py-2 px-4 text-sm text-center">
                              <span
                                className={
                                  standing.goalDifference > 0
                                    ? "text-emerald-600"
                                    : standing.goalDifference < 0
                                      ? "text-rose-600"
                                      : ""
                                }
                              >
                                {standing.goalDifference > 0 ? "+" : ""}
                                {standing.goalDifference}
                              </span>
                            </td>
                            <td className="py-2 px-4 text-sm text-center font-bold">
                              {standing.points}
                            </td>
                            <td className="py-2 px-4">
                              <button
                                onClick={() => onManageSquad(teamId)}
                                className="p-1 hover:bg-accent rounded transition-colors"
                                title="Register Squad"
                              >
                                <UserPlus className="h-3 w-3 text-blue-500" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {group.qualificationRules.length > 0 && (
                <div className="p-4 border-t border-border bg-muted/30">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">
                    Qualification Rules
                  </h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {group.qualificationRules.map((rule, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            rule.destination === "knockout"
                              ? "bg-emerald-500"
                              : rule.destination === "playoffs"
                                ? "bg-blue-500"
                                : "bg-gray-500"
                          }`}
                        />
                        <span>
                          {rule.position}. {rule.description}
                        </span>
                        {rule.isBestLoserCandidate && (
                          <span className="text-xs text-amber-500">
                            (Best Loser Candidate)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Knockout View Component
function KnockoutView({
  rounds,
  competitionId,
  searchQuery,
}: {
  rounds: KnockoutRound[];
  competitionId: string;
  searchQuery: string;
}) {
  const sortedRounds = [...rounds].sort(
    (a, b) => a.roundNumber - b.roundNumber,
  );
  const filteredRounds = sortedRounds.filter(
    (round) =>
      !searchQuery ||
      round.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Knockout Stages
        </h2>
        <p className="text-sm text-muted-foreground">
          {rounds.length} rounds,{" "}
          {rounds.reduce((acc, round) => acc + round.fixtures.length, 0)}{" "}
          fixtures
        </p>
      </div>

      {filteredRounds.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <Network className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No knockout rounds found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search query
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRounds.map((round) => (
            <div
              key={round.id}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {round.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Round {round.roundNumber} •{" "}
                    {round.completed ? "Completed" : "In Progress"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      round.completed
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-blue-500/10 text-blue-600"
                    }`}
                  >
                    {round.completed ? "Completed" : "Active"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                {round.fixtures.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No fixtures scheduled for this round</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {round.fixtures.map((fixtureId, index) => (
                      <div
                        key={fixtureId}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">
                            Match {index + 1}
                          </div>
                          <div className="font-medium">
                            Fixture #{fixtureId.slice(0, 8)}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button className="p-1 hover:bg-accent rounded transition-colors">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Teams View Component
function TeamsView({
  teams,
  registrations,
  onManageSquad,
  searchQuery,
}: {
  teams: any[];
  registrations: CompetitionTeamReg[];
  onManageSquad: (teamId: string) => void;
  searchQuery: string;
}) {
  const getRegistrationStatus = (teamId: string) => {
    const registration = registrations.find((reg) => reg.team === teamId);
    if (!registration)
      return {
        status: "not-registered",
        icon: ShieldAlert,
        color: "text-rose-500",
      };

    const squadSize = registration.squad.length;
    const hasCaptain = registration.squad.some((player) => player.isCaptain);

    if (squadSize >= 11 && hasCaptain) {
      return {
        status: "complete",
        icon: ShieldCheck,
        color: "text-emerald-500",
      };
    } else {
      return { status: "partial", icon: AlertCircle, color: "text-amber-500" };
    }
  };

  const filteredTeams = teams.filter(
    (team) =>
      !searchQuery ||
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.shorthand.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Registered Teams
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {filteredTeams.length} of {teams.length} teams
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Team
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Registration Status
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Squad Size
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Captain
              </th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredTeams.map((team) => {
              const registration = registrations.find(
                (reg) => reg.team === team.id,
              );
              const regStatus = getRegistrationStatus(team.id);
              const StatusIcon = regStatus.icon;

              return (
                <tr
                  key={team.id}
                  className="hover:bg-accent/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                        {team.logo ? (
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <Users className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {team.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {team.shorthand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                      {team.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-4 w-4 ${regStatus.color}`} />
                      <span className="text-sm font-medium capitalize">
                        {regStatus.status.replace("-", " ")}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {registration ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {registration.squad.length}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          players
                        </span>
                        {registration.squad.length < 11 && (
                          <span className="text-xs text-amber-500">
                            (Min: 11)
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Not registered
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {registration ? (
                      registration.squad.find((p) => p.isCaptain) ? (
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">
                            Player #
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-amber-500">
                          No captain
                        </span>
                      )
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onManageSquad(team.id)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          registration
                            ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                      >
                        {registration ? "Manage Squad" : "Register"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No teams found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search query
          </p>
        </div>
      )}
    </div>
  );
}
