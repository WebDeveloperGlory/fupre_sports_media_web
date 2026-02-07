"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { footballFixtureApi } from "@/lib/api/v1/football-fixture.api";
import { UpdateFixtureStatisticsDto } from "@/lib/types/v1.payload.types";
import { FixtureResponse } from "@/lib/types/v1.response.types";
import { FixtureTeamType } from "@/types/v1.football-fixture.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/v1/dialogue";
import { Button } from "@/components/ui/v1/button";
import { Input } from "@/components/ui/v1/input";
import { Label } from "@/components/ui/v1/label";
import {
  Target,
  Shield,
  AlertTriangle,
  Flag,
  CornerUpRight,
  Clock,
  BarChart3,
  Users,
  Trophy,
} from "lucide-react";

interface FixtureStatisticsModalProps {
  fixture: FixtureResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FixtureStatisticsModal({
  fixture,
  isOpen,
  onClose,
  onSuccess,
}: FixtureStatisticsModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "away">("home");
  const [stats, setStats] = useState({
    home: { ...fixture.statistics.home },
    away: { ...fixture.statistics.away },
  });

  const handleStatChange = (
    team: "home" | "away",
    field: keyof typeof stats.home,
    value: number,
  ) => {
    setStats((prev) => ({
      ...prev,
      [team]: {
        ...prev[team],
        [field]: Math.max(0, value),
      },
    }));
  };

  const calculatePossession = () => {
    const total = stats.home.possessionTime + stats.away.possessionTime;
    if (total === 0) return { home: 50, away: 50 };

    const homePercentage = Math.round(
      (stats.home.possessionTime / total) * 100,
    );
    const awayPercentage = 100 - homePercentage;
    return { home: homePercentage, away: awayPercentage };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate possession percentages
      const possession = calculatePossession();
      const finalStats = {
        home: {
          ...stats.home,
          possessionTime: possession.home,
        },
        away: {
          ...stats.away,
          possessionTime: possession.away,
        },
      };

      const payload: UpdateFixtureStatisticsDto = {
        statistics: finalStats,
      };

      const response = await footballFixtureApi.updateStatistics(
        fixture.id,
        payload,
      );
      toast.success(response.message || "Statistics updated successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to update statistics");
    } finally {
      setLoading(false);
    }
  };

  const homeName =
    fixture.homeTeam?.name || fixture.temporaryHomeTeamName || "Home";
  const awayName =
    fixture.awayTeam?.name || fixture.temporaryAwayTeamName || "Away";

  const StatCard = ({
    title,
    icon: Icon,
    homeValue,
    awayValue,
    field,
    type = "number",
  }: {
    title: string;
    icon: React.ElementType;
    homeValue: number;
    awayValue: number;
    field: keyof typeof stats.home;
    type?: "number" | "time";
  }) => (
    <div className="p-4 rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h4 className="font-medium text-sm">{title}</h4>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">{homeName}</Label>
          <Input
            type={type === "time" ? "number" : "number"}
            value={homeValue}
            onChange={(e) =>
              handleStatChange(
                "home",
                field,
                type === "time"
                  ? parseInt(e.target.value) || 0
                  : parseInt(e.target.value) || 0,
              )
            }
            min="0"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">{awayName}</Label>
          <Input
            type={type === "time" ? "number" : "number"}
            value={awayValue}
            onChange={(e) =>
              handleStatChange(
                "away",
                field,
                type === "time"
                  ? parseInt(e.target.value) || 0
                  : parseInt(e.target.value) || 0,
              )
            }
            min="0"
            className="h-8 text-sm"
          />
        </div>
      </div>
      {field === "possessionTime" && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Home: {calculatePossession().home}%</span>
            <span>Away: {calculatePossession().away}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${calculatePossession().home}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Match Statistics</DialogTitle>
          <DialogDescription>
            Update detailed match statistics for {homeName} vs {awayName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Match Summary */}
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    {homeName}
                  </div>
                  <div className="text-2xl font-bold">
                    {fixture.result.homeScore}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    VS
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    Final Score
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    {awayName}
                  </div>
                  <div className="text-2xl font-bold">
                    {fixture.result.awayScore}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Offensive Stats */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Offensive Statistics
                </h3>
                <StatCard
                  title="Shots on Target"
                  icon={Target}
                  homeValue={stats.home.shotsOnTarget}
                  awayValue={stats.away.shotsOnTarget}
                  field="shotsOnTarget"
                />
                <StatCard
                  title="Shots off Target"
                  icon={Target}
                  homeValue={stats.home.shotsOffTarget}
                  awayValue={stats.away.shotsOffTarget}
                  field="shotsOffTarget"
                />
              </div>

              {/* Defensive & Discipline */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Defensive & Discipline
                </h3>
                <StatCard
                  title="Fouls"
                  icon={Flag}
                  homeValue={stats.home.fouls}
                  awayValue={stats.away.fouls}
                  field="fouls"
                />
                <StatCard
                  title="Yellow Cards"
                  icon={AlertTriangle}
                  homeValue={stats.home.yellowCards}
                  awayValue={stats.away.yellowCards}
                  field="yellowCards"
                />
                <StatCard
                  title="Red Cards"
                  icon={AlertTriangle}
                  homeValue={stats.home.redCards}
                  awayValue={stats.away.redCards}
                  field="redCards"
                />
              </div>

              {/* Set Pieces */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <CornerUpRight className="h-4 w-4" />
                  Set Pieces
                </h3>
                <StatCard
                  title="Corners"
                  icon={CornerUpRight}
                  homeValue={stats.home.corners}
                  awayValue={stats.away.corners}
                  field="corners"
                />
                <StatCard
                  title="Offsides"
                  icon={Flag}
                  homeValue={stats.home.offsides}
                  awayValue={stats.away.offsides}
                  field="offsides"
                />
              </div>

              {/* Possession */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Possession & Control
                </h3>
                <StatCard
                  title="Possession Time (minutes)"
                  icon={Clock}
                  homeValue={stats.home.possessionTime}
                  awayValue={stats.away.possessionTime}
                  field="possessionTime"
                  type="time"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-3">
                Statistics Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-blue-500/10">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.home.shotsOnTarget + stats.away.shotsOnTarget}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Shots on Target
                  </div>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-500/10">
                  <div className="text-2xl font-bold text-amber-600">
                    {stats.home.fouls + stats.away.fouls}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Fouls
                  </div>
                </div>
                <div className="text-center p-3 rounded-lg bg-emerald-500/10">
                  <div className="text-2xl font-bold text-emerald-600">
                    {stats.home.corners + stats.away.corners}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Corners
                  </div>
                </div>
                <div className="text-center p-3 rounded-lg bg-purple-500/10">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.home.yellowCards + stats.away.yellowCards}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Yellow Cards
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Statistics"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
