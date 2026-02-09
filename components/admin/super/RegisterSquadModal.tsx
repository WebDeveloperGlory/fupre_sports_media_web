"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  X,
  Search,
  UserPlus,
  UserMinus,
  Crown,
  ShieldAlert,
  ShieldCheck,
  Filter,
  Users,
} from "lucide-react";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { footballPlayerApi } from "@/lib/api/v1/football-player.api";
import { TeamRegistrationDto } from "@/lib/types/v1.payload.types";
import { PlayerPosition } from "@/types/v1.football-player.types";
import { CompetitionTeamReg } from "@/types/v1.football-competition.types";

interface RegisterSquadModalProps {
  competitionId: string;
  teamId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RegisterSquadModal({
  competitionId,
  teamId,
  isOpen,
  onClose,
  onSuccess,
}: RegisterSquadModalProps) {
  const [loading, setLoading] = useState(false);
  const [squad, setSquad] = useState<CompetitionTeamReg["squad"]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<PlayerPosition | "all">(
    "all",
  );

  useEffect(() => {
    if (isOpen) {
      loadSquad();
      loadAvailablePlayers();
    }
  }, [isOpen]);

  const loadSquad = async () => {
    try {
      const response = await footballCompetitionApi.getById(competitionId);
      if (response.success) {
        const competition = response.data;
        const teamRegistration = competition.teamRegistrations.find(
          (reg: CompetitionTeamReg) => reg.team === teamId,
        );
        if (teamRegistration) {
          setSquad(teamRegistration.squad);
        } else {
          setSquad([]);
        }
      }
    } catch (error: any) {
      console.error("Failed to load squad:", error);
    }
  };

  const loadAvailablePlayers = async () => {
    try {
      const response = await footballPlayerApi.getAll(1, 50);
      if (response.success) {
        setAvailablePlayers(response.data);
      }
    } catch (error: any) {
      console.error("Failed to load players:", error);
    }
  };

  const handleAddPlayer = (playerId: string) => {
    if (squad.length >= 30) {
      toast.error("Maximum squad size is 30 players");
      return;
    }

    if (squad.some((p) => p.player === playerId)) {
      toast.warning("Player already in squad");
      return;
    }

    const player = availablePlayers.find((p) => p.id === playerId);
    if (!player) return;

    // Find available jersey number
    let jerseyNumber = 1;
    while (
      squad.some((p) => p.jerseyNumber === jerseyNumber) &&
      jerseyNumber <= 99
    ) {
      jerseyNumber++;
    }

    const newPlayer = {
      player: playerId,
      jerseyNumber,
      isCaptain: squad.length === 0, // First player is captain by default
      position: player.naturalPosition as PlayerPosition,
    };

    setSquad([...squad, newPlayer]);
  };

  const handleRemovePlayer = (playerId: string) => {
    const newSquad = squad.filter((p) => p.player !== playerId);

    // If we removed the captain and there are other players, make the first one captain
    if (
      squad.find((p) => p.player === playerId)?.isCaptain &&
      newSquad.length > 0
    ) {
      newSquad[0].isCaptain = true;
    }

    setSquad(newSquad);
  };

  const handleSetCaptain = (playerId: string) => {
    setSquad(
      squad.map((player) => ({
        ...player,
        isCaptain: player.player === playerId,
      })),
    );
  };

  const handleUpdateJerseyNumber = (playerId: string, number: number) => {
    if (number < 1 || number > 99) {
      toast.error("Jersey number must be between 1 and 99");
      return;
    }

    if (squad.some((p) => p.player !== playerId && p.jerseyNumber === number)) {
      toast.warning("Jersey number already taken");
      return;
    }

    setSquad(
      squad.map((player) =>
        player.player === playerId
          ? { ...player, jerseyNumber: number }
          : player,
      ),
    );
  };

  const handleUpdatePosition = (playerId: string, position: PlayerPosition) => {
    setSquad(
      squad.map((player) =>
        player.player === playerId ? { ...player, position } : player,
      ),
    );
  };

  const handleSaveSquad = async () => {
    // Validate squad
    if (squad.length < 11) {
      toast.error("Minimum squad size is 11 players");
      return;
    }

    if (!squad.some((p) => p.isCaptain)) {
      toast.error("Please select a captain for the team");
      return;
    }

    if (squad.length > 30) {
      toast.error("Maximum squad size is 30 players");
      return;
    }

    // Check for duplicate jersey numbers
    const jerseyNumbers = squad.map((p) => p.jerseyNumber);
    const uniqueJerseyNumbers = new Set(jerseyNumbers);
    if (uniqueJerseyNumbers.size !== jerseyNumbers.length) {
      toast.error("Duplicate jersey numbers found");
      return;
    }

    try {
      setLoading(true);
      const payload: TeamRegistrationDto = {
        team: teamId,
        squad: squad.map((player) => ({
          player: player.player,
          jerseyNumber: player.jerseyNumber,
          isCaptain: player.isCaptain,
          position: player.position,
        })),
      };

      const response = await footballCompetitionApi.registerTeam(
        competitionId,
        payload,
      );
      if (response.success) {
        toast.success("Squad registered successfully");
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to register squad");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredPlayers = availablePlayers.filter((player) => {
    const matchesSearch = player.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPosition =
      positionFilter === "all" || player.naturalPosition === positionFilter;
    const isInSquad = squad.some((p) => p.player === player.id);
    return matchesSearch && matchesPosition && !isInSquad;
  });

  const positionOptions = [
    { value: "all" as PlayerPosition | "all", label: "All Positions" },
    { value: PlayerPosition.GK, label: "Goalkeeper" },
    { value: PlayerPosition.CB, label: "Center Back" },
    { value: PlayerPosition.LB, label: "Left Back" },
    { value: PlayerPosition.RB, label: "Right Back" },
    { value: PlayerPosition.CM, label: "Center Midfield" },
    { value: PlayerPosition.LM, label: "Left Midfield" },
    { value: PlayerPosition.RM, label: "Right Midfield" },
    { value: PlayerPosition.AM, label: "Attacking Midfield" },
    { value: PlayerPosition.CF, label: "Center Forward" },
    { value: PlayerPosition.LW, label: "Left Wing" },
    { value: PlayerPosition.RW, label: "Right Wing" },
    { value: PlayerPosition.SS, label: "Second Striker" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative w-full max-w-6xl bg-card rounded-lg shadow-lg border border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Register Team Squad
              </h2>
              <p className="text-sm text-muted-foreground">
                Add players to the squad, assign jersey numbers and positions
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-6">
            {/* Squad Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Squad Size</p>
                    <p className="text-2xl font-bold text-foreground">
                      {squad.length}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Min: 11 • Max: 30
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Captain</p>
                    <p className="text-lg font-bold text-foreground">
                      {squad.some((p) => p.isCaptain) ? "Selected" : "Not Set"}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Crown className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Required for registration
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p
                      className={`text-lg font-bold ${
                        squad.length >= 11 && squad.some((p) => p.isCaptain)
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      {squad.length >= 11 && squad.some((p) => p.isCaptain)
                        ? "Complete"
                        : "Incomplete"}
                    </p>
                  </div>
                  <div
                    className={`p-2 rounded-lg ${
                      squad.length >= 11 && squad.some((p) => p.isCaptain)
                        ? "bg-emerald-500/10"
                        : "bg-amber-500/10"
                    }`}
                  >
                    {squad.length >= 11 && squad.some((p) => p.isCaptain) ? (
                      <ShieldCheck className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <ShieldAlert className="h-6 w-6 text-amber-500" />
                    )}
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {squad.length >= 11 && squad.some((p) => p.isCaptain)
                    ? "Ready to submit"
                    : "Needs attention"}
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Positions</p>
                    <p className="text-lg font-bold text-foreground">
                      {new Set(squad.map((p) => p.position)).size}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Filter className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Different positions covered
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Squad */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Current Squad ({squad.length})
                </h3>

                {squad.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                    <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No players in squad yet
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add players from the right panel
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {squad.map((player) => {
                      const playerInfo = availablePlayers.find(
                        (p) => p.id === player.player,
                      );
                      return (
                        <div
                          key={player.player}
                          className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <span className="font-bold text-primary">
                                  #{player.jerseyNumber}
                                </span>
                              </div>
                              {player.isCaptain && (
                                <div className="absolute -top-1 -right-1">
                                  <Crown className="h-4 w-4 text-amber-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground truncate">
                                {playerInfo?.name ||
                                  `Player ${player.player.slice(0, 8)}`}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {player.position}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={player.position}
                              onChange={(e) =>
                                handleUpdatePosition(
                                  player.player,
                                  e.target.value as PlayerPosition,
                                )
                              }
                              className="px-2 py-1 text-sm border border-input rounded bg-background"
                            >
                              {Object.values(PlayerPosition).map((pos) => (
                                <option key={pos} value={pos}>
                                  {pos.toUpperCase()}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              min="1"
                              max="99"
                              value={player.jerseyNumber}
                              onChange={(e) =>
                                handleUpdateJerseyNumber(
                                  player.player,
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-16 px-2 py-1 text-sm border border-input rounded bg-background"
                            />
                            <button
                              onClick={() => handleSetCaptain(player.player)}
                              className={`p-1 rounded transition-colors ${
                                player.isCaptain
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "hover:bg-accent text-muted-foreground"
                              }`}
                              title={
                                player.isCaptain ? "Captain" : "Set as Captain"
                              }
                            >
                              <Crown className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemovePlayer(player.player)}
                              className="p-1 hover:bg-accent rounded transition-colors text-rose-500"
                              title="Remove from Squad"
                            >
                              <UserMinus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Available Players */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Available Players
                  </h3>

                  {/* Filters */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search players by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                    </div>

                    <select
                      value={positionFilter}
                      onChange={(e) =>
                        setPositionFilter(
                          e.target.value as PlayerPosition | "all",
                        )
                      }
                      className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    >
                      {positionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Players List */}
                  <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {filteredPlayers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No players found</p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    ) : (
                      filteredPlayers.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground truncate">
                                {player.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {player.naturalPosition} •{" "}
                                {player.department?.name}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddPlayer(player.id)}
                            className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                          >
                            Add to Squad
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {squad.length} players •{" "}
              {squad.some((p) => p.isCaptain)
                ? "Captain selected"
                : "No captain"}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSquad}
                disabled={
                  loading ||
                  squad.length < 11 ||
                  !squad.some((p) => p.isCaptain)
                }
                className={`px-4 py-2 rounded-lg transition-colors ${
                  squad.length >= 11 && squad.some((p) => p.isCaptain)
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2 inline-block"></div>
                    Saving...
                  </>
                ) : (
                  "Register Squad"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
