"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { footballLiveApi } from "@/lib/api/v1/football-live.api";
import { footballFixtureApi } from "@/lib/api/v1/football-fixture.api";
import { footballTeamApi } from "@/lib/api/v1/football-team.api";
import {
  LiveFixtureResponse,
  FixtureResponse,
} from "@/lib/types/v1.response.types";
import {
  FixtureTeamType,
} from "@/types/v1.football-fixture.types";
import {
  Search,
  Save,
  Users,
  Trophy,
  Calendar,
  MapPin,
  Clock,
  Shirt,
  Crown,
  ArrowUpDown,
  UserPlus,
  UserMinus,
  Zap,
  Grid,
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { LineupBuilderModal } from "@/components/admin/super/LineupBuilderModal";

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

const POSITION_GROUPS = {
  GK: ["GK"],
  DEF: ["CB", "RB", "LB", "SW"],
  MID: ["CM", "CDM", "CAM", "RM", "LM", "RW", "LW"],
  FWD: ["ST", "CF", "WF"],
};

export default function FormationsPage() {
  // State
  const [liveFixtures, setLiveFixtures] = useState<LiveFixtureResponse[]>([]);
  const [fixtures, setFixtures] = useState<FixtureResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFixture, setSelectedFixture] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<"home" | "away">("home");
  const [formation, setFormation] = useState("4-3-3");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Lineup state
  const [startingXI, setStartingXI] = useState<any[]>([]);
  const [substitutes, setSubstitutes] = useState<any[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  const [coach, setCoach] = useState("");

  // Modal state
  const [showLineupBuilder, setShowLineupBuilder] = useState(false);

  // Load initial data
  useEffect(() => {
    fetchLiveFixtures();
    fetchFixtures();
  }, [page, limit]);

  const fetchLiveFixtures = async () => {
    try {
      const response = await footballLiveApi.getAll(page, limit);
      if (response.success) {
        setLiveFixtures(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch live fixtures:", error);
    }
  };

  const fetchFixtures = async () => {
    try {
      const response = await footballFixtureApi.getAll(page, limit);
      if (response.success) {
        setFixtures(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch fixtures:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamPlayers = async (teamId: string) => {
    try {
      const response = await footballTeamApi.getTeamPlayersContracts(
        teamId,
        1,
        50,
      );
      if (response.success) {
        const players = response.data.map((contract: any) => ({
          id: contract.player.id,
          name: contract.player.name,
          position: contract.position,
          jerseyNumber: contract.jerseyNumber,
          isActive: contract.isActive,
          photo: contract.player.photo,
          contractId: contract.id,
        }));
        setAvailablePlayers(players.filter((p: any) => p.isActive));
      }
    } catch (error) {
      console.error("Failed to fetch team players:", error);
    }
  };

  // Get all fixtures (live + scheduled)
  const allFixtures = useMemo(() => {
    const liveMap = new Map(liveFixtures.map((f) => [f.fixture, f]));
    return fixtures.map((fixture) => ({
      ...fixture,
      isLive: liveMap.has(fixture.id),
      liveFixture: liveMap.get(fixture.id),
    }));
  }, [liveFixtures, fixtures]);

  // Get current fixture
  const currentFixture = useMemo(() => {
    if (!selectedFixture) return null;
    return allFixtures.find((f) => f.id === selectedFixture);
  }, [selectedFixture, allFixtures]);

  // Get current team
  const currentTeam = useMemo(() => {
    if (!currentFixture) return null;
    return selectedTeam === "home"
      ? currentFixture.homeTeam
      : currentFixture.awayTeam;
  }, [currentFixture, selectedTeam]);

  // Load team players when team changes
  useEffect(() => {
    if (currentTeam?.id) {
      fetchTeamPlayers(currentTeam.id);
      setStartingXI([]);
      setSubstitutes([]);
      setCoach("");
    }
  }, [currentTeam]);

  // Filter players by search
  const filteredPlayers = useMemo(() => {
    return availablePlayers.filter(
      (player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.jerseyNumber?.toString().includes(searchQuery),
    );
  }, [availablePlayers, searchQuery]);

  // Handlers
  const handleSelectFixture = (fixtureId: string) => {
    setSelectedFixture(fixtureId);
    setSelectedTeam("home");
  };

  const addToStartingXI = (player: any) => {
    if (startingXI.length >= 11) {
      toast.error("Maximum 11 players in starting lineup");
      return;
    }

    // Check if player already in lineup
    if (
      startingXI.some((p) => p.id === player.id) ||
      substitutes.some((p) => p.id === player.id)
    ) {
      toast.error("Player already in lineup");
      return;
    }

    setStartingXI([
      ...startingXI,
      { ...player, isCaptain: false, position: player.position },
    ]);
    setAvailablePlayers(availablePlayers.filter((p) => p.id !== player.id));
  };

  const removeFromStartingXI = (playerId: string) => {
    const player = startingXI.find((p) => p.id === playerId);
    if (player) {
      setStartingXI(startingXI.filter((p) => p.id !== playerId));
      setAvailablePlayers([...availablePlayers, player]);
    }
  };

  const addToSubstitutes = (player: any) => {
    if (substitutes.length >= 7) {
      toast.error("Maximum 7 substitutes allowed");
      return;
    }

    // Check if player already in lineup
    if (
      startingXI.some((p) => p.id === player.id) ||
      substitutes.some((p) => p.id === player.id)
    ) {
      toast.error("Player already in lineup");
      return;
    }

    setSubstitutes([...substitutes, player]);
    setAvailablePlayers(availablePlayers.filter((p) => p.id !== player.id));
  };

  const removeFromSubstitutes = (playerId: string) => {
    const player = substitutes.find((p) => p.id === playerId);
    if (player) {
      setSubstitutes(substitutes.filter((p) => p.id !== playerId));
      setAvailablePlayers([...availablePlayers, player]);
    }
  };

  const movePlayer = (
    from: "starting" | "substitutes",
    to: "starting" | "substitutes",
    playerId: string,
  ) => {
    const player =
      from === "starting"
        ? startingXI.find((p) => p.id === playerId)
        : substitutes.find((p) => p.id === playerId);

    if (!player) return;

    if (from === "starting") {
      removeFromStartingXI(playerId);
      addToSubstitutes(player);
    } else {
      if (startingXI.length >= 11) {
        toast.error("Maximum 11 players in starting lineup");
        return;
      }
      removeFromSubstitutes(playerId);
      addToStartingXI(player);
    }
  };

  const setCaptain = (playerId: string) => {
    setStartingXI(
      startingXI.map((player) => ({
        ...player,
        isCaptain: player.id === playerId,
      })),
    );
  };

  const handleSaveLineup = async () => {
    if (!currentFixture || !currentTeam) {
      toast.error("Please select a fixture and team");
      return;
    }

    if (startingXI.length !== 11) {
      toast.error("Please select exactly 11 starting players");
      return;
    }

    if (!coach.trim()) {
      toast.error("Please enter coach name");
      return;
    }

    try {
      // Prepare payload
      const payload = {
        team:
          selectedTeam === "home" ? FixtureTeamType.HOME : FixtureTeamType.AWAY,
        startingXI: startingXI.map((p) => p.id),
        substitutes: substitutes.map((p) => p.id),
        formation,
        coach,
      };

      if (currentFixture.isLive) {
        // Update live fixture lineup
        const response = await footballLiveApi.setTeamLineup(
          currentFixture.id,
          payload,
        );
        toast.success(response.message || "Lineup saved successfully");
      } else {
        // Update regular fixture lineup
        const response = await footballFixtureApi.updateLineup(
          currentFixture.id,
          payload,
        );
        toast.success(response.message || "Lineup saved successfully");
      }

      // Refresh data
      fetchLiveFixtures();
      fetchFixtures();
    } catch (error: any) {
      toast.error(error.message || "Failed to save lineup");
    }
  };

  const handleOpenLineupBuilder = () => {
    if (!currentFixture || !currentTeam) {
      toast.error("Please select a fixture and team");
      return;
    }
    setShowLineupBuilder(true);
  };

  // Position count for current formation
  const formationData = useMemo(() => {
    const selectedFormation = FORMATIONS.find((f) => f.value === formation);
    if (!selectedFormation)
      return { defenders: 0, midfielders: 0, forwards: 0 };

    const positionCounts = {
      GK: startingXI.filter((p) => p.position === "GK").length,
      DEF: startingXI.filter((p) =>
        ["CB", "RB", "LB", "SW"].includes(p.position),
      ).length,
      MID: startingXI.filter((p) =>
        ["CM", "CDM", "CAM", "RM", "LM", "RW", "LW"].includes(p.position),
      ).length,
      FWD: startingXI.filter((p) => ["ST", "CF", "WF"].includes(p.position))
        .length,
    };

    return {
      defenders: positionCounts.DEF,
      midfielders: positionCounts.MID,
      forwards: positionCounts.FWD,
      requiredDefenders: selectedFormation.defenders,
      requiredMidfielders: selectedFormation.midfielders,
      requiredForwards: selectedFormation.forwards,
      isValid:
        positionCounts.GK === 1 &&
        positionCounts.DEF === selectedFormation.defenders &&
        positionCounts.MID === selectedFormation.midfielders &&
        positionCounts.FWD === selectedFormation.forwards,
    };
  }, [formation, startingXI]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Formations & Lineups
          </h1>
          <p className="text-muted-foreground">
            Configure team formations, starting lineups, and substitutes
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleOpenLineupBuilder}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Grid className="h-4 w-4" />
            Visual Builder
          </button>
          <button
            onClick={handleSaveLineup}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Lineup
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Fixture Selection & Team Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Fixture Selection */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Select Fixture
              </h3>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Loading fixtures...
                    </p>
                  </div>
                ) : allFixtures.length === 0 ? (
                  <div className="text-center py-4">
                    <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No fixtures available
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {allFixtures.slice(0, 10).map((fixture) => (
                      <button
                        key={fixture.id}
                        onClick={() => handleSelectFixture(fixture.id)}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          selectedFixture === fixture.id
                            ? "border-primary bg-primary/10"
                            : "border-input hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-foreground">
                              {fixture.homeTeam?.name ||
                                fixture.temporaryHomeTeamName ||
                                "TBD"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              vs
                            </div>
                            <div className="font-medium text-foreground">
                              {fixture.awayTeam?.name ||
                                fixture.temporaryAwayTeamName ||
                                "TBD"}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(fixture.scheduledDate), "MMM d")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(
                                new Date(fixture.scheduledDate),
                                "h:mm a",
                              )}
                            </div>
                            {fixture.isLive && (
                              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 text-xs">
                                <Zap className="h-3 w-3" />
                                LIVE
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {fixture.stadium}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Selected Fixture Info */}
          {currentFixture && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Selected Fixture
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {currentFixture.homeTeam?.name ||
                          currentFixture.temporaryHomeTeamName ||
                          "TBD"}
                      </div>
                      <div className="text-center text-sm text-muted-foreground py-1">
                        VS
                      </div>
                      <div className="font-medium text-foreground">
                        {currentFixture.awayTeam?.name ||
                          currentFixture.temporaryAwayTeamName ||
                          "TBD"}
                      </div>
                    </div>
                    {currentFixture.isLive && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 text-red-600">
                        <Zap className="h-4 w-4" />
                        LIVE
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(
                        new Date(currentFixture.scheduledDate),
                        "EEEE, MMMM d, yyyy",
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(currentFixture.scheduledDate), "h:mm a")}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {currentFixture.stadium}
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      {currentFixture.competition?.name || "Friendly"}
                    </div>
                  </div>

                  {/* Team Selection */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">
                      Select Team to Configure
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedTeam("home")}
                        className={`p-3 rounded-lg border ${
                          selectedTeam === "home"
                            ? "border-primary bg-primary/10"
                            : "border-input hover:bg-accent"
                        }`}
                      >
                        <div className="font-medium">
                          {currentFixture.homeTeam?.name ||
                            currentFixture.temporaryHomeTeamName ||
                            "Home"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {currentFixture.homeTeam?.department?.name || ""}
                        </div>
                      </button>
                      <button
                        onClick={() => setSelectedTeam("away")}
                        className={`p-3 rounded-lg border ${
                          selectedTeam === "away"
                            ? "border-primary bg-primary/10"
                            : "border-input hover:bg-accent"
                        }`}
                      >
                        <div className="font-medium">
                          {currentFixture.awayTeam?.name ||
                            currentFixture.temporaryAwayTeamName ||
                            "Away"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {currentFixture.awayTeam?.department?.name || ""}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Middle Column: Formation & Lineup Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Formation Selection */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-foreground">
                    Formation & Lineup
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentTeam?.name || "Select a team"} - {startingXI.length}
                    /11 players selected
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={formation}
                      onChange={(e) => setFormation(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                    >
                      {FORMATIONS.map((form) => (
                        <option key={form.value} value={form.value}>
                          {form.label}
                        </option>
                      ))}
                    </select>
                    <Grid className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Coach Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Coach Name
                </label>
                <input
                  type="text"
                  value={coach}
                  onChange={(e) => setCoach(e.target.value)}
                  placeholder="Enter coach name"
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              {/* Formation Validation */}
              <div className="mb-6 p-4 rounded-lg bg-muted">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div
                    className={`p-3 rounded-lg ${formationData.defenders === formationData.requiredDefenders ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}
                  >
                    <div className="text-2xl font-bold">
                      {formationData.defenders}
                    </div>
                    <div className="text-sm">Defenders</div>
                    <div className="text-xs text-muted-foreground">
                      Required: {formationData.requiredDefenders}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${formationData.midfielders === formationData.requiredMidfielders ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}
                  >
                    <div className="text-2xl font-bold">
                      {formationData.midfielders}
                    </div>
                    <div className="text-sm">Midfielders</div>
                    <div className="text-xs text-muted-foreground">
                      Required: {formationData.requiredMidfielders}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${formationData.forwards === formationData.requiredForwards ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}
                  >
                    <div className="text-2xl font-bold">
                      {formationData.forwards}
                    </div>
                    <div className="text-sm">Forwards</div>
                    <div className="text-xs text-muted-foreground">
                      Required: {formationData.requiredForwards}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <div
                    className={`text-sm ${formationData.isValid ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    {formationData.isValid
                      ? "✓ Formation is valid"
                      : "⚠ Adjust players to match formation"}
                  </div>
                </div>
              </div>

              {/* Starting XI */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">
                    Starting XI ({startingXI.length}/11)
                  </h4>
                  <span className="text-sm text-muted-foreground">
                    Click to set captain
                  </span>
                </div>
                {startingXI.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No players in starting lineup
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add players from available list
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {startingXI.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
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
                          <div>
                            <div className="font-medium text-foreground">
                              {player.name}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>#{player.jerseyNumber || "?"}</span>
                              <span>•</span>
                              <span>{player.position}</span>
                              {player.isCaptain && (
                                <span className="inline-flex items-center gap-1 text-amber-600">
                                  <Crown className="h-3 w-3" />
                                  Captain
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setCaptain(player.id)}
                            className={`p-1 rounded ${player.isCaptain ? "bg-amber-500 text-white" : "hover:bg-accent"}`}
                            title="Set as captain"
                          >
                            <Crown className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              movePlayer("starting", "substitutes", player.id)
                            }
                            className="p-1 rounded hover:bg-accent"
                            title="Move to substitutes"
                          >
                            <ArrowUpDown className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeFromStartingXI(player.id)}
                            className="p-1 rounded hover:bg-accent"
                            title="Remove"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Substitutes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">
                    Substitutes ({substitutes.length}/7)
                  </h4>
                </div>
                {substitutes.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-border rounded-lg">
                    <UserPlus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No substitutes selected
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {substitutes.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                            {player.photo ? (
                              <img
                                src={player.photo}
                                alt={player.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <Shirt className="h-5 w-5 text-secondary" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {player.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              #{player.jerseyNumber || "?"} • {player.position}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              movePlayer("substitutes", "starting", player.id)
                            }
                            className="p-1 rounded hover:bg-accent"
                            title="Move to starting XI"
                          >
                            <ArrowUpDown className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeFromSubstitutes(player.id)}
                            className="p-1 rounded hover:bg-accent"
                            title="Remove"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Available Players Section */}
      {currentTeam && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-foreground">
                  Available Players ({filteredPlayers.length})
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select players to add to lineup
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>

            {filteredPlayers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "No players match your search"
                    : "No players available"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        {player.photo ? (
                          <img
                            src={player.photo}
                            alt={player.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        ) : (
                          <Shirt className="h-8 w-8 text-primary" />
                        )}
                      </div>
                      <div className="font-medium text-foreground mb-1">
                        {player.name}
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        #{player.jerseyNumber || "?"} • {player.position}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addToStartingXI(player)}
                          disabled={startingXI.length >= 11}
                          className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Start
                        </button>
                        <button
                          onClick={() => addToSubstitutes(player)}
                          disabled={substitutes.length >= 7}
                          className="px-3 py-1 border border-input rounded text-sm hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sub
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lineup Builder Modal */}
      {showLineupBuilder && currentFixture && currentTeam && (
        <LineupBuilderModal
          fixture={currentFixture}
          team={selectedTeam}
          teamName={currentTeam.name}
          formation={formation}
          startingXI={startingXI}
          substitutes={substitutes}
          availablePlayers={availablePlayers}
          onFormationChange={setFormation}
          onStartingXIChange={setStartingXI}
          onSubstitutesChange={setSubstitutes}
          onAvailablePlayersChange={setAvailablePlayers}
          onClose={() => setShowLineupBuilder(false)}
          onSave={handleSaveLineup}
        />
      )}
    </div>
  );
}
