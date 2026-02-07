"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  UserPlus,
  Calendar,
  Target,
  FileText,
  ChevronDown,
  User,
  Clock,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { footballPlayerApi } from "@/lib/api/v1/football-player.api";
import type { FootballTeamResponse } from "@/lib/types/v1.response.types";
import {
  PlayerContractType,
  PlayerPosition,
} from "@/types/v1.football-player.types";
import { CreatePlayerContract } from "@/lib/types/v1.payload.types";

interface SignContractModalProps {
  team: FootballTeamResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Player {
  id: string;
  name: string;
  currentTeam?: string;
  department: {
    name: string;
  };
  naturalPosition: PlayerPosition;
}

export default function SignContractModal({
  team,
  isOpen,
  onClose,
  onSuccess,
}: SignContractModalProps) {
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const [formData, setFormData] = useState({
    contractType: PlayerContractType.PERMANENT,
    position: PlayerPosition.CM,
    jerseyNumber: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: "",
    includeOption: false,
    optionYears: 1,
  });

  const [error, setError] = useState("");

  // Fetch available players
  useEffect(() => {
    if (isOpen) {
      fetchAvailablePlayers();
    }
  }, [isOpen]);

  const fetchAvailablePlayers = async () => {
    try {
      setLoadingPlayers(true);
      const response = await footballPlayerApi.getAll(1, 50);
      if (response.success) {
        setPlayers(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch players:", error);
    } finally {
      setLoadingPlayers(false);
    }
  };

  // Filter players
  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.department.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPosition =
      positionFilter === "all" || player.naturalPosition === positionFilter;

    return matchesSearch && matchesPosition;
  });

  const handleInputChange = (
    field: string,
    value: string | boolean | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setFormData((prev) => ({
      ...prev,
      position: player.naturalPosition,
    }));
  };

  const validateForm = (): boolean => {
    if (!selectedPlayer) {
      setError("Please select a player");
      return false;
    }

    if (!formData.jerseyNumber.trim()) {
      setError("Jersey number is required");
      return false;
    }

    const jerseyNum = parseInt(formData.jerseyNumber);
    if (isNaN(jerseyNum) || jerseyNum < 1 || jerseyNum > 99) {
      setError("Jersey number must be between 1 and 99");
      return false;
    }

    if (!formData.startDate) {
      setError("Start date is required");
      return false;
    }

    if (
      formData.contractType === PlayerContractType.ON_LOAN &&
      !formData.endDate
    ) {
      setError("End date is required for loan contracts");
      return false;
    }

    return true;
  };

  const calculateEndDate = () => {
    if (formData.endDate) return formData.endDate;

    const start = new Date(formData.startDate);
    let endDate = new Date(start);

    switch (formData.contractType) {
      case PlayerContractType.TRIAL:
        endDate.setMonth(start.getMonth() + 3); // 3 months for trial
        break;
      case PlayerContractType.PERMANENT:
        endDate.setFullYear(start.getFullYear() + 3); // 3 years for professional
        break;
      default:
        endDate.setFullYear(start.getFullYear() + 1);
    }

    return format(endDate, "yyyy-MM-dd");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const endDate = formData.endDate || calculateEndDate();

      const payload: CreatePlayerContract = {
        team: team.id,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(endDate) : null,
        contractType: formData.contractType as PlayerContractType,
        position: formData.position as PlayerPosition,
        jerseyNumber: parseInt(formData.jerseyNumber),
      };

      const response = await footballPlayerApi.signContract(selectedPlayer!.id, payload);
      toast.success(response.message || "Contract signed successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to sign contract");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const CONTRACT_TYPE_LABELS: Record<PlayerContractType, string> = {
    [PlayerContractType.PERMANENT]: "Permanent",
    [PlayerContractType.TRIAL]: "Trial",
    [PlayerContractType.ON_LOAN]: "Loan",
  };

  const CONTRACT_TYPE_DESCRIPTIONS: Record<PlayerContractType, string> = {
    [PlayerContractType.PERMANENT]: "Full-time contract with salary",
    [PlayerContractType.TRIAL]: "Short-term trial period",
    [PlayerContractType.ON_LOAN]: "Temporary transfer from another team",
  };

  const POSITION_LABELS: Record<PlayerPosition, string> = {
    [PlayerPosition.GK]: "Goalkeeper",
    [PlayerPosition.CB]: "Center Back",
    [PlayerPosition.LB]: "Left Back",
    [PlayerPosition.RB]: "Right Back",
    [PlayerPosition.CM]: "Central Midfielder",
    [PlayerPosition.AM]: "Attacking Midfielder",
    [PlayerPosition.LM]: "Left Midfielder",
    [PlayerPosition.RM]: "Right Midfielder",
    [PlayerPosition.LW]: "Left Winger",
    [PlayerPosition.RW]: "Right Winger",
    [PlayerPosition.SS]: "Second Striker",
    [PlayerPosition.CF]: "Center Forward",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-background rounded-lg shadow-lg">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background p-6 rounded-t-lg">
            <div>
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Sign New Contract
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {team.name} ({team.shorthand})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
          >
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Player Selection */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Select Player
              </h3>

              {loadingPlayers ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Loading players...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Search and Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search players by name..."
                        className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={positionFilter}
                        onChange={(e) => setPositionFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                      >
                        <option value="all">All Positions</option>
                        {Object.values(PlayerPosition).map((pos) => (
                          <option key={pos} value={pos}>
                            {POSITION_LABELS[pos]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Players Grid */}
                  {filteredPlayers.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-input rounded-lg">
                      <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No available players found
                      </p>
                      {searchTerm || positionFilter !== "all" ? (
                        <p className="text-sm text-muted-foreground mt-1">
                          Try adjusting your search criteria
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          All players may already be contracted
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                      {filteredPlayers.map((player) => (
                        <button
                          key={player.id}
                          type="button"
                          onClick={() => handleSelectPlayer(player)}
                          className={`p-4 border rounded-lg text-left transition-all ${
                            selectedPlayer?.id === player.id
                              ? "border-primary bg-primary/5"
                              : "border-input hover:bg-accent/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground">
                                {player.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {player.department.name}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-600 rounded">
                                {POSITION_LABELS[player.naturalPosition]}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Selected Player Info */}
                  {selectedPlayer && (
                    <div className="mt-4 p-4 border border-primary/20 bg-primary/5 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {selectedPlayer.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {selectedPlayer.department.name} •{" "}
                              {POSITION_LABELS[selectedPlayer.naturalPosition]}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedPlayer(null)}
                          className="px-3 py-1 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Contract Details */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Contract Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contract Type */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Contract Type
                  </label>
                  <div className="space-y-2">
                    {Object.values(PlayerContractType).map((type) => (
                      <label
                        key={type}
                        className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.contractType === type
                            ? "border-primary bg-primary/5"
                            : "border-input hover:bg-accent/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="contractType"
                          value={type}
                          checked={formData.contractType === type}
                          onChange={(e) =>
                            handleInputChange("contractType", e.target.value)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {CONTRACT_TYPE_LABELS[type]}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {CONTRACT_TYPE_DESCRIPTIONS[type]}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Position & Jersey Number */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Position
                    </label>
                    <div className="relative">
                      <select
                        value={formData.position}
                        onChange={(e) =>
                          handleInputChange("position", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                      >
                        {Object.values(PlayerPosition).map((pos) => (
                          <option key={pos} value={pos}>
                            {POSITION_LABELS[pos]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Jersey Number
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={formData.jerseyNumber}
                      onChange={(e) =>
                        handleInputChange("jerseyNumber", e.target.value)
                      }
                      placeholder="e.g., 10"
                      className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Dates */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Contract Dates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    End Date{" "}
                    {formData.contractType === PlayerContractType.ON_LOAN && "*"}
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    min={formData.startDate}
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {!formData.endDate &&
                      `Auto-calculated: ${calculateEndDate()}`}
                    {formData.endDate && "Optional for most contracts"}
                  </p>
                </div>
              </div>

              {/* Auto-calculated Duration */}
              {!formData.endDate && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Contract Duration:
                    </span>
                    <span className="font-medium text-foreground">
                      {(() => {
                        const start = new Date(formData.startDate);
                        const end = new Date(calculateEndDate());
                        const months =
                          (end.getFullYear() - start.getFullYear()) * 12 +
                          (end.getMonth() - start.getMonth());

                        if (months < 12) {
                          return `${months} month${months !== 1 ? "s" : ""}`;
                        } else {
                          const years = Math.floor(months / 12);
                          const remainingMonths = months % 12;
                          return `${years} year${years !== 1 ? "s" : ""}${
                            remainingMonths > 0
                              ? `, ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`
                              : ""
                          }`;
                        }
                      })()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Contract Summary */}
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium text-foreground mb-3">
                Contract Summary
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Player</div>
                  <div className="font-medium text-foreground">
                    {selectedPlayer ? selectedPlayer.name : "Not selected"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Team</div>
                  <div className="font-medium text-foreground">
                    {team.name} ({team.shorthand})
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Contract Type</div>
                  <div className="font-medium text-foreground">
                    {
                      CONTRACT_TYPE_LABELS[
                        formData.contractType as PlayerContractType
                      ]
                    }
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Position</div>
                  <div className="font-medium text-foreground">
                    {POSITION_LABELS[formData.position as PlayerPosition]}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Jersey Number</div>
                  <div className="font-medium text-foreground">
                    {formData.jerseyNumber || "Not set"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Duration</div>
                  <div className="font-medium text-foreground">
                    {formData.startDate
                      ? format(new Date(formData.startDate), "MMM d, yyyy")
                      : "Not set"}{" "}
                    -
                    {formData.endDate || calculateEndDate()
                      ? format(
                          new Date(formData.endDate || calculateEndDate()),
                          "MMM d, yyyy",
                        )
                      : "Open"}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                type="submit"
                disabled={loading || !selectedPlayer}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing Contract...
                  </span>
                ) : (
                  "Sign Contract"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
