// app/admin/super/football/players/player-details-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { footballPlayerApi } from "@/lib/api/v1/football-player.api";
import { FootballPlayerResponse } from "@/lib/types/v1.response.types";
import {
  PlayerPosition,
  PlayerVerificationStatus,
} from "@/types/v1.football-player.types";
import {
  X,
  User,
  MapPin,
  Calendar,
  Target,
  Footprints,
  Ruler,
  Weight,
  Trophy,
  Shield,
  Award,
  FileText,
  BarChart3,
  ChevronRight,
  Edit2,
  Trash2,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
} from "lucide-react";

interface PlayerDetailsModalProps {
  player: FootballPlayerResponse;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

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

const STATUS_CONFIG = {
  [PlayerVerificationStatus.PENDING]: {
    label: "Pending",
    color: "bg-amber-500",
    icon: Clock,
  },
  [PlayerVerificationStatus.VERIFIED]: {
    label: "Verified",
    color: "bg-emerald-500",
    icon: CheckCircle,
  },
  [PlayerVerificationStatus.REJECTED]: {
    label: "Rejected",
    color: "bg-rose-500",
    icon: XCircle,
  },
};

export function PlayerDetailsModal({
  player,
  isOpen,
  onClose,
  onEdit,
}: PlayerDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [careerStats, setCareerStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchCareerStats();
    }
  }, [isOpen, player.id]);

  const fetchCareerStats = async () => {
    try {
      setLoading(true);
      const response = await footballPlayerApi.getPlayerCareerStats(player.id);
      if (response.success) {
        setCareerStats(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch career stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${player.name}?`)) return;

    try {
      const response = await footballPlayerApi.deletePlayer(player.id);
      toast.success(response.message || "Player deleted successfully");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete player");
    }
  };

  if (!isOpen) return null;

  const position = POSITION_OPTIONS.find(
    (p) => p.value === player.naturalPosition,
  );
  const status = STATUS_CONFIG[player.verificationStatus];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Player Details
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage player information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Player Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              {player.photo ? (
                <img
                  src={player.photo}
                  alt={player.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {player.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      <Target className="h-3 w-3" />
                      {position?.label}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {player.department.name}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onEdit}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 hover:bg-accent rounded-lg transition-colors text-rose-500"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-1 px-6">
            {["overview", "stats", "contracts", "awards"].map((tab) => (
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
            ))}
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
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Nationality
                        </p>
                        <p className="font-medium">{player.nationality}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Admission Year
                        </p>
                        <p className="font-medium">{player.admissionYear}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Natural Position
                        </p>
                        <p className="font-medium">{position?.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Footprints className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Preferred Foot
                        </p>
                        <p className="font-medium">{player.preferredFoot}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Physical Attributes
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Height</p>
                        <p className="font-medium">
                          {player.height ? `${player.height} cm` : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Weight className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="font-medium">
                          {player.weight ? `${player.weight} kg` : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Market Value
                        </p>
                        <p className="font-medium">
                          {player.marketValue
                            ? `₦${(player.marketValue / 1000000).toFixed(1)}M`
                            : "-"}
                        </p>
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
                  </div>
                </div>
              </div>

              {/* Department Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Academic Information
                </h3>
                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Department
                      </p>
                      <p className="font-medium">{player.department.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Department Code
                      </p>
                      <p className="font-medium">{player.department.code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Created Date
                      </p>
                      <p className="font-medium">
                        {format(new Date(player.createdAt), "PPP")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-border">
                <button
                  onClick={() => {
                    /* Open award modal */
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                >
                  <Award className="h-4 w-4" />
                  Add Award
                </button>
                <button
                  onClick={() => {
                    /* Open career stats modal */
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                >
                  <BarChart3 className="h-4 w-4" />
                  Update Stats
                </button>
                <button
                  onClick={() => {
                    /* Open upload photo modal */
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </button>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">
                      Loading statistics...
                    </p>
                  </div>
                </div>
              ) : careerStats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Appearances</p>
                    <p className="text-2xl font-bold mt-1">
                      {careerStats.appearances || 0}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Total Goals</p>
                    <p className="text-2xl font-bold mt-1">
                      {careerStats.totalGoals || 0}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Assists</p>
                    <p className="text-2xl font-bold mt-1">
                      {careerStats.totalAssists || 0}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      Clean Sheets
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {careerStats.totalCleanSheets || 0}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      Yellow Cards
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {careerStats.totalYellowCards || 0}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Red Cards</p>
                    <p className="text-2xl font-bold mt-1">
                      {careerStats.totalRedCards || 0}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">MOTM Awards</p>
                    <p className="text-2xl font-bold mt-1">
                      {careerStats.totalMOTM || 0}
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      Minutes Played
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {careerStats.minutesPlayed || 0}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Statistics Available
                  </h3>
                  <p className="text-muted-foreground">
                    Career statistics will appear here once recorded
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "contracts" && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Contracts Available
                </h3>
                <p className="text-muted-foreground">
                  Player contracts will appear here once signed
                </p>
              </div>
            </div>
          )}

          {activeTab === "awards" && (
            <div className="space-y-4">
              {player.awards && player.awards.length > 0 ? (
                <div className="space-y-3">
                  {player.awards.map((award, index) => (
                    <div
                      key={index}
                      className="bg-card border border-border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Award className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">
                              {award.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Season: {award.season} •{" "}
                              {format(new Date(award.date), "PPP")}
                            </p>
                            {award.description && (
                              <p className="text-sm mt-2">
                                {award.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Awards Yet
                  </h3>
                  <p className="text-muted-foreground">
                    Player awards will appear here once added
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
