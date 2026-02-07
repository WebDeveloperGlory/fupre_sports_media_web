"use client";

import React, { useState } from "react";
import {
  X,
  BarChart3,
  Target,
  Trophy,
  Users,
  ChevronDown,
  Download,
} from "lucide-react";
import type {
  FootballTeamResponse,
  PlayerSeasonStatResponse,
} from "@/lib/types/v1.response.types";
import { PlayerSeasonStatType } from "@/types/v1.football-player.types";

interface TeamPlayerStatsModalProps {
  team: FootballTeamResponse;
  stats: PlayerSeasonStatResponse[];
  season: string;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const STAT_TYPE_LABELS: Record<PlayerSeasonStatType, string> = {
  [PlayerSeasonStatType.COMPETITION]: "ComeCOMPETITION",
  [PlayerSeasonStatType.FRIENDLY]: "Friendly",
};

export default function TeamPlayerStatsModal({
  team,
  stats,
  season,
  loading,
  isOpen,
  onClose,
}: TeamPlayerStatsModalProps) {
  const [seasonFilter, setSeasonFilter] = useState(season);
  const [statTypeFilter, setStatTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  // Extract unique seasons from stats
  const uniqueSeasons = Array.from(new Set(stats.map((stat) => stat.season)))
    .sort()
    .reverse();

  // Filter stats
  const filteredStats = stats.filter((stat) => {
    const matchesSeason = !seasonFilter || stat.season === seasonFilter;
    const matchesType =
      statTypeFilter === "all" || stat.type === statTypeFilter;
    const matchesSearch =
      !searchTerm ||
      stat.player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stat.player.department.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesSeason && matchesType && matchesSearch;
  });

  // Calculate team totals
  const calculateTeamTotals = () => {
    if (filteredStats.length === 0) return null;

    const totals = {
      appearances: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0,
      motm: 0,
      minutesPlayed: 0,
    };

    filteredStats.forEach((stat) => {
      totals.appearances += stat.stats.appearances || 0;
      totals.goals += stat.stats.goals || 0;
      totals.assists += stat.stats.assists || 0;
      totals.cleanSheets += stat.stats.cleanSheets || 0;
      totals.yellowCards += stat.stats.yellowCards || 0;
      totals.redCards += stat.stats.redCards || 0;
      totals.motm += stat.stats.MOTM || 0;
      totals.minutesPlayed += stat.stats.minutesPlayed || 0;
    });

    return totals;
  };

  const teamTotals = calculateTeamTotals();

  // Get top performers
  const getTopPerformers = () => {
    const topScorers = [...filteredStats]
      .sort((a, b) => (b.stats.goals || 0) - (a.stats.goals || 0))
      .slice(0, 3);

    const topAssists = [...filteredStats]
      .sort((a, b) => (b.stats.assists || 0) - (a.stats.assists || 0))
      .slice(0, 3);

    const topMOTM = [...filteredStats]
      .sort((a, b) => (b.stats.MOTM || 0) - (a.stats.MOTM || 0))
      .slice(0, 3);

    return { topScorers, topAssists, topMOTM };
  };

  const topPerformers = getTopPerformers();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl bg-background rounded-lg shadow-lg">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background p-6 rounded-t-lg">
            <div>
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                {team.name} - Player Statistics
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredStats.length} player records for{" "}
                {seasonFilter || "all seasons"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">
                    Loading statistics...
                  </p>
                </div>
              </div>
            ) : stats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground">
                  No statistics found
                </h3>
                <p className="text-muted-foreground">
                  This team doesn't have any player statistics yet
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Season
                    </label>
                    <div className="relative">
                      <select
                        value={seasonFilter}
                        onChange={(e) => setSeasonFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                      >
                        <option value="">All Seasons</option>
                        {uniqueSeasons.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Competition Type
                    </label>
                    <div className="relative">
                      <select
                        value={statTypeFilter}
                        onChange={(e) => setStatTypeFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                      >
                        <option value="all">All Types</option>
                        {Object.values(PlayerSeasonStatType).map((type) => (
                          <option key={type} value={type}>
                            {STAT_TYPE_LABELS[type]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Search Player
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by player name..."
                        className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent pl-10"
                      />
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors w-full">
                      <Download className="h-4 w-4" />
                      Export Data
                    </button>
                  </div>
                </div>

                {/* Team Totals */}
                {teamTotals && (
                  <div className="bg-muted rounded-lg p-6">
                    <h3 className="text-lg font-medium text-foreground mb-4">
                      Team Totals
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {teamTotals.appearances}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Appearances
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">
                          {teamTotals.goals}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Goals
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {teamTotals.assists}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Assists
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {teamTotals.cleanSheets}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Clean Sheets
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">
                          {teamTotals.yellowCards}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Yellow Cards
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-rose-600">
                          {teamTotals.redCards}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Red Cards
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {teamTotals.motm}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          MOTM
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {Math.floor(teamTotals.minutesPlayed / 90)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Matches Played
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Performers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Top Scorers */}
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-emerald-500" />
                      Top Scorers
                    </h4>
                    <div className="space-y-2">
                      {topPerformers.topScorers.map((stat, index) => (
                        <div
                          key={stat.id}
                          className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {stat.player.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {stat.player.department.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-emerald-600">
                            {stat.stats.goals || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Assists */}
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      Top Assists
                    </h4>
                    <div className="space-y-2">
                      {topPerformers.topAssists.map((stat, index) => (
                        <div
                          key={stat.id}
                          className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {stat.player.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {stat.player.department.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {stat.stats.assists || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top MOTM */}
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-green-500" />
                      Most MOTM Awards
                    </h4>
                    <div className="space-y-2">
                      {topPerformers.topMOTM.map((stat, index) => (
                        <div
                          key={stat.id}
                          className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {stat.player.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {stat.player.department.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {stat.stats.MOTM || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detailed Stats Table */}
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">
                    Detailed Statistics
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Player
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Season
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Type
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Apps
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Goals
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Assists
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            CS
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            YC/RC
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            MOTM
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Minutes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredStats.map((stat) => (
                          <tr
                            key={stat.id}
                            className="hover:bg-accent/50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="font-medium text-foreground">
                                {stat.player.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {stat.player.department.name}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm">{stat.season}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-600 rounded">
                                {STAT_TYPE_LABELS[stat.type]}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center font-medium">
                              {stat.stats.appearances || 0}
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-emerald-600">
                              {stat.stats.goals || 0}
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-blue-600">
                              {stat.stats.assists || 0}
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-purple-600">
                              {stat.stats.cleanSheets || 0}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-amber-600">
                                {stat.stats.yellowCards || 0}
                              </span>
                              <span className="text-muted-foreground mx-1">
                                /
                              </span>
                              <span className="text-rose-600">
                                {stat.stats.redCards || 0}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-green-600">
                              {stat.stats.MOTM || 0}
                            </td>
                            <td className="py-3 px-4 text-center text-sm">
                              {stat.stats.minutesPlayed || 0}'
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing {filteredStats.length} of {stats.length} records
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
