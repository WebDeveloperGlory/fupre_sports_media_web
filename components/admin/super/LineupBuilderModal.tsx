"use client";

import { useState, useRef, useEffect } from "react";
import { FixtureResponse } from "@/lib/types/v1.response.types";
import { PlayerPosition } from "@/types/v1.football-player.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/v1/dialogue";
import { Button } from "@/components/ui/v1/button";
import { Badge } from "@/components/ui/v1/badge";
import {
  Users,
  Shirt,
  Crown,
  Grid,
  ArrowLeft,
  ArrowRight,
  Save,
  X,
  Plus,
  Move,
  Target,
  Shield,
  Zap,
  UserPlus,
  UserMinus,
} from "lucide-react";

interface LineupBuilderModalProps {
  fixture: FixtureResponse;
  team: "home" | "away";
  teamName: string;
  formation: string;
  startingXI: any[];
  substitutes: any[];
  availablePlayers: any[];
  onFormationChange: (formation: string) => void;
  onStartingXIChange: (players: any[]) => void;
  onSubstitutesChange: (players: any[]) => void;
  onAvailablePlayersChange: (players: any[]) => void;
  onClose: () => void;
  onSave: () => void;
}

const FORMATIONS = [
  { value: "4-3-3", label: "4-3-3", defenders: 4, midfielders: 3, forwards: 3 },
  { value: "4-4-2", label: "4-4-2", defenders: 4, midfielders: 4, forwards: 2 },
  {
    value: "4-2-3-1",
    label: "4-2-3-1",
    defenders: 4,
    midfielders: 5,
    forwards: 1,
  },
  { value: "3-5-2", label: "3-5-2", defenders: 3, midfielders: 5, forwards: 2 },
  { value: "3-4-3", label: "3-4-3", defenders: 3, midfielders: 4, forwards: 3 },
  { value: "5-3-2", label: "5-3-2", defenders: 5, midfielders: 3, forwards: 2 },
  {
    value: "4-1-4-1",
    label: "4-1-4-1",
    defenders: 4,
    midfielders: 5,
    forwards: 1,
  },
];

const POSITION_COLORS: Record<string, string> = {
  GK: "bg-purple-500",
  CB: "bg-blue-500",
  RB: "bg-blue-400",
  LB: "bg-blue-400",
  CDM: "bg-green-500",
  CM: "bg-green-400",
  CAM: "bg-green-300",
  RM: "bg-yellow-500",
  LM: "bg-yellow-500",
  RW: "bg-amber-500",
  LW: "bg-amber-500",
  ST: "bg-red-500",
  CF: "bg-red-400",
};

// Define types for formation positions
interface FormationPosition {
  id: string;
  x: number;
  y: number;
  position: PlayerPosition | string;
  required: boolean;
  player: any | null;
}

interface Player {
  id: string;
  name: string;
  position: PlayerPosition | string;
  jerseyNumber?: number;
  photo?: string;
  isCaptain?: boolean;
}

export function LineupBuilderModal({
  fixture,
  team,
  teamName,
  formation,
  startingXI,
  substitutes,
  availablePlayers,
  onFormationChange,
  onStartingXIChange,
  onSubstitutesChange,
  onAvailablePlayersChange,
  onClose,
  onSave,
}: LineupBuilderModalProps) {
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);
  const [formationPositions, setFormationPositions] = useState<
    FormationPosition[]
  >([]);
  const [showPositions, setShowPositions] = useState(false);
  const pitchRef = useRef<HTMLDivElement>(null);

  // Calculate formation positions
  useEffect(() => {
    const positions = calculateFormationPositions(formation);
    setFormationPositions(positions);
  }, [formation, startingXI]);

  const calculateFormationPositions = (
    formation: string,
  ): FormationPosition[] => {
    const [def, mid, fwd] = formation.split("-").map(Number);
    const positions: FormationPosition[] = [];

    // Goalkeeper
    positions.push({
      id: "gk",
      x: 10,
      y: 50,
      position: "GK",
      required: true,
      player: startingXI.find((p: Player) => p.position === "GK"),
    });

    // Defenders
    for (let i = 0; i < def; i++) {
      const x = 25;
      const y = (100 / (def + 1)) * (i + 1);
      positions.push({
        id: `def-${i}`,
        x,
        y,
        position: i === 0 ? "RB" : i === def - 1 ? "LB" : "CB",
        required: true,
        player: null,
      });
    }

    // Midfielders
    for (let i = 0; i < mid; i++) {
      const x = 50;
      const y = (100 / (mid + 1)) * (i + 1);
      positions.push({
        id: `mid-${i}`,
        x,
        y,
        position: getMidfielderPosition(i, mid),
        required: true,
        player: null,
      });
    }

    // Forwards
    for (let i = 0; i < fwd; i++) {
      const x = 75;
      const y = (100 / (fwd + 1)) * (i + 1);
      positions.push({
        id: `fwd-${i}`,
        x,
        y,
        position: getForwardPosition(i, fwd),
        required: true,
        player: null,
      });
    }

    // Map players to positions
    startingXI.forEach((player: Player) => {
      const pos = positions.find(
        (p) => !p.player && p.position === player.position,
      );
      if (pos) {
        pos.player = player;
      }
    });

    return positions;
  };

  const getMidfielderPosition = (index: number, total: number): string => {
    if (total === 1) return "CM";
    if (total === 2) return index === 0 ? "CDM" : "CAM";
    if (total === 3) return index === 1 ? "CM" : index === 0 ? "CDM" : "CAM";
    if (total === 4) return index < 2 ? "CDM" : "CM";
    if (total === 5) {
      if (index === 0) return "RM";
      if (index === 1) return "CDM";
      if (index === 2) return "CM";
      if (index === 3) return "CAM";
      if (index === 4) return "LM";
    }
    return "CM";
  };

  const getForwardPosition = (index: number, total: number): string => {
    if (total === 1) return "ST";
    if (total === 2) return index === 0 ? "RW" : "LW";
    if (total === 3) {
      if (index === 0) return "RW";
      if (index === 1) return "ST";
      if (index === 2) return "LW";
    }
    return "ST";
  };

  const handleDragStart = (e: React.DragEvent, player: Player) => {
    setDraggedPlayer(player);
    e.dataTransfer.setData("text/plain", JSON.stringify(player));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, position: FormationPosition) => {
    e.preventDefault();
    if (!draggedPlayer) return;

    // Remove from available players
    const newAvailable = availablePlayers.filter(
      (p: Player) => p.id !== draggedPlayer.id,
    );
    onAvailablePlayersChange(newAvailable);

    // Remove from substitutes if present
    const newSubstitutes = substitutes.filter(
      (p: Player) => p.id !== draggedPlayer.id,
    );
    onSubstitutesChange(newSubstitutes);

    // Remove from current position if player already in starting XI
    const currentPosition = formationPositions.find(
      (p) => p.player?.id === draggedPlayer.id,
    );
    if (currentPosition) {
      currentPosition.player = null;
    }

    // Add to new position
    position.player = {
      ...draggedPlayer,
      position: position.position as PlayerPosition,
    };

    // Update starting XI
    const newStartingXI = formationPositions
      .filter((p) => p.player)
      .map((p) => p.player);
    onStartingXIChange(newStartingXI);

    // Update formation positions state
    setFormationPositions([...formationPositions]);

    setDraggedPlayer(null);
  };

  const removePlayerFromPosition = (position: FormationPosition) => {
    if (!position.player) return;

    const player = position.player;
    position.player = null;

    // Add back to available players
    onAvailablePlayersChange([...availablePlayers, player]);

    // Update starting XI
    const newStartingXI = formationPositions
      .filter((p) => p.player)
      .map((p) => p.player);
    onStartingXIChange(newStartingXI);

    // Update formation positions state
    setFormationPositions([...formationPositions]);
  };

  const addToSubstitutes = (player: Player) => {
    if (substitutes.length >= 7) return;

    // Remove from available players
    const newAvailable = availablePlayers.filter(
      (p: Player) => p.id !== player.id,
    );
    onAvailablePlayersChange(newAvailable);

    // Remove from starting XI if present
    const position = formationPositions.find((p) => p.player?.id === player.id);
    if (position) {
      position.player = null;
      const newStartingXI = formationPositions
        .filter((p) => p.player)
        .map((p) => p.player);
      onStartingXIChange(newStartingXI);

      // Update formation positions state
      setFormationPositions([...formationPositions]);
    }

    // Add to substitutes
    onSubstitutesChange([...substitutes, player]);
  };

  const removeFromSubstitutes = (player: Player) => {
    const newSubstitutes = substitutes.filter(
      (p: Player) => p.id !== player.id,
    );
    onSubstitutesChange(newSubstitutes);
    onAvailablePlayersChange([...availablePlayers, player]);
  };

  const setCaptain = (playerId: string) => {
    const newStartingXI = startingXI.map((player: Player) => ({
      ...player,
      isCaptain: player.id === playerId,
    }));
    onStartingXIChange(newStartingXI);

    // Update formation positions
    const updatedPositions = formationPositions.map((pos) => {
      if (pos.player?.id === playerId) {
        return { ...pos, player: { ...pos.player, isCaptain: true } };
      } else if (pos.player?.isCaptain) {
        return { ...pos, player: { ...pos.player, isCaptain: false } };
      }
      return pos;
    });
    setFormationPositions(updatedPositions);
  };

  const getPositionRequirements = () => {
    const [def, mid, fwd] = formation.split("-").map(Number);
    return {
      defenders: def,
      midfielders: mid,
      forwards: fwd,
      goalkeeper: 1,
    };
  };

  const requirements = getPositionRequirements();
  const currentCounts = {
    defenders: startingXI.filter((p: Player) =>
      ["CB", "RB", "LB", "SW"].includes(p.position),
    ).length,
    midfielders: startingXI.filter((p: Player) =>
      ["CM", "CDM", "CAM", "RM", "LM", "RW", "LW"].includes(p.position),
    ).length,
    forwards: startingXI.filter((p: Player) =>
      ["ST", "CF", "WF"].includes(p.position),
    ).length,
    goalkeeper: startingXI.filter((p: Player) => p.position === "GK").length,
  };

  const isValidFormation =
    currentCounts.defenders === requirements.defenders &&
    currentCounts.midfielders === requirements.midfielders &&
    currentCounts.forwards === requirements.forwards &&
    currentCounts.goalkeeper === requirements.goalkeeper;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Visual Lineup Builder</DialogTitle>
          <DialogDescription>
            Drag and drop players to build your lineup for {teamName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Grid className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={formation}
                  onChange={(e) => onFormationChange(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                >
                  {FORMATIONS.map((form) => (
                    <option key={form.value} value={form.value}>
                      {form.label}
                    </option>
                  ))}
                </select>
              </div>

              <Badge variant={isValidFormation ? "default" : "outline"}>
                {startingXI.length}/11 Players
              </Badge>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPositions(!showPositions)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {showPositions ? "Hide Positions" : "Show Positions"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onSave} disabled={!isValidFormation}>
                <Save className="h-4 w-4 mr-2" />
                Save Lineup
              </Button>
            </div>
          </div>

          {/* Position Requirements */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className={`p-3 rounded-lg text-center ${
                currentCounts.goalkeeper === requirements.goalkeeper
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-amber-500/10 text-amber-600"
              }`}
            >
              <div className="text-xl font-bold">
                {currentCounts.goalkeeper}
              </div>
              <div className="text-sm">Goalkeeper</div>
              <div className="text-xs text-muted-foreground">
                Required: {requirements.goalkeeper}
              </div>
            </div>
            <div
              className={`p-3 rounded-lg text-center ${
                currentCounts.defenders === requirements.defenders
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-amber-500/10 text-amber-600"
              }`}
            >
              <div className="text-xl font-bold">{currentCounts.defenders}</div>
              <div className="text-sm">Defenders</div>
              <div className="text-xs text-muted-foreground">
                Required: {requirements.defenders}
              </div>
            </div>
            <div
              className={`p-3 rounded-lg text-center ${
                currentCounts.midfielders === requirements.midfielders
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-amber-500/10 text-amber-600"
              }`}
            >
              <div className="text-xl font-bold">
                {currentCounts.midfielders}
              </div>
              <div className="text-sm">Midfielders</div>
              <div className="text-xs text-muted-foreground">
                Required: {requirements.midfielders}
              </div>
            </div>
            <div
              className={`p-3 rounded-lg text-center ${
                currentCounts.forwards === requirements.forwards
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-amber-500/10 text-amber-600"
              }`}
            >
              <div className="text-xl font-bold">{currentCounts.forwards}</div>
              <div className="text-sm">Forwards</div>
              <div className="text-xs text-muted-foreground">
                Required: {requirements.forwards}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Available Players */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border border-border p-4 h-full">
                <h3 className="font-semibold text-foreground mb-4">
                  Available Players ({availablePlayers.length})
                </h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {availablePlayers.map((player: Player) => (
                    <div
                      key={player.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, player)}
                      className="flex items-center gap-3 p-3 rounded-lg border border-input hover:border-primary cursor-move transition-colors"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {player.photo ? (
                          <img
                            src={player.photo}
                            alt={player.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <Shirt className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">
                          {player.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          #{player.jerseyNumber || "?"} • {player.position}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => addToSubstitutes(player)}
                        disabled={substitutes.length >= 7}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Football Pitch */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border border-border p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-foreground text-center mb-2">
                    {teamName} - {formation} Formation
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Drag players onto the pitch or click positions to assign
                  </p>
                </div>

                <div
                  ref={pitchRef}
                  className="relative h-[500px] bg-emerald-50 dark:bg-emerald-950/20 border-4 border-emerald-200 dark:border-emerald-800 rounded-lg overflow-hidden"
                  onDragOver={handleDragOver}
                >
                  {/* Pitch markings */}
                  <div className="absolute inset-0 border-2 border-white dark:border-emerald-700 border-dashed m-4 rounded-lg" />
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white dark:bg-emerald-700" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full border-2 border-white dark:border-emerald-700" />

                  {/* Center circle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border-2 border-white dark:border-emerald-700" />

                  {/* Goal areas */}
                  <div className="absolute top-4 left-4 right-4 h-16 border-2 border-white dark:border-emerald-700 rounded-lg" />
                  <div className="absolute bottom-4 left-4 right-4 h-16 border-2 border-white dark:border-emerald-700 rounded-lg" />

                  {/* Formation positions */}
                  {formationPositions.map((position: FormationPosition) => (
                    <div
                      key={position.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                        position.player ? "cursor-pointer" : "cursor-cell"
                      }`}
                      style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                      }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, position)}
                      onClick={() => {
                        if (showPositions && !position.player) {
                          // Show available players for this position
                        }
                      }}
                    >
                      {position.player ? (
                        <div className="relative group">
                          <div
                            className={`h-16 w-16 rounded-full ${
                              POSITION_COLORS[position.position] ||
                              "bg-gray-500"
                            } flex flex-col items-center justify-center text-white shadow-lg`}
                          >
                            <div className="text-xs font-bold">
                              #{position.player.jerseyNumber || "?"}
                            </div>
                            <div className="text-[10px] truncate px-1">
                              {position.player.name.split(" ")[0]}
                            </div>
                          </div>
                          {position.player.isCaptain && (
                            <div className="absolute -top-1 -right-1">
                              <Crown className="h-4 w-4 text-amber-500" />
                            </div>
                          )}
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            <div className="text-xs font-medium bg-black/70 text-white px-2 py-1 rounded">
                              {position.position}
                            </div>
                          </div>
                          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-6 w-6 p-0 rounded-full"
                              onClick={() => removePlayerFromPosition(position)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-6 w-6 p-0 rounded-full"
                              onClick={() => setCaptain(position.player.id)}
                              title="Set as captain"
                            >
                              <Crown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative group">
                          <div
                            className={`h-12 w-12 rounded-full ${
                              POSITION_COLORS[position.position] ||
                              "bg-gray-500"
                            } border-2 border-dashed border-white flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity`}
                          >
                            <div className="text-xs font-bold text-white">
                              {position.position}
                            </div>
                          </div>
                          {showPositions && (
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                              <div className="text-xs bg-black/70 text-white px-2 py-1 rounded">
                                {position.position}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Formation Legend */}
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                    <span className="text-xs">Goalkeeper</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-xs">Defender</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-xs">Midfielder</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-xs">Forward</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Substitutes */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">
                Substitutes ({substitutes.length}/7)
              </h3>
              <Badge variant="outline">Reserve Players</Badge>
            </div>
            {substitutes.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-border rounded-lg">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No substitutes selected
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag players here or use the "Sub" button
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                {substitutes.map((player: Player) => (
                  <div
                    key={player.id}
                    className="relative group p-3 rounded-lg border border-input hover:border-primary transition-colors"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-2">
                        {player.photo ? (
                          <img
                            src={player.photo}
                            alt={player.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <Shirt className="h-6 w-6 text-secondary" />
                        )}
                      </div>
                      <div className="font-medium text-sm">{player.name}</div>
                      <div className="text-xs text-muted-foreground">
                        #{player.jerseyNumber || "?"} • {player.position}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromSubstitutes(player)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="rounded-lg border border-border p-4 bg-muted/50">
            <h4 className="font-medium text-foreground mb-2">
              How to use the lineup builder:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • Drag players from the "Available Players" section onto the
                pitch positions
              </li>
              <li>
                • Click on a position circle to see available players for that
                position
              </li>
              <li>• Click the crown icon on a player to make them captain</li>
              <li>
                • Click the X icon on a player to remove them from the lineup
              </li>
              <li>• Use the "Sub" button to add players to substitutes</li>
              <li>
                • Make sure all formation positions are filled before saving
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
