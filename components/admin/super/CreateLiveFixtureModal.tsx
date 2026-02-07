"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { footballLiveApi } from "@/lib/api/v1/football-live.api";
import { footballFixtureApi } from "@/lib/api/v1/football-fixture.api";
import { CreateLiveFixtureDto } from "@/lib/types/v1.payload.types";
import { FixtureResponse } from "@/lib/types/v1.response.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/v1/dialogue";
import { Button } from "@/components/ui/v1/button";
import { Input } from "@/components/ui/v1/input";
import { Label } from "@/components/ui/v1/label";
import {
  Search,
  Calendar,
  Clock,
  Trophy,
  Users,
  MapPin,
  Radio,
  Zap,
} from "lucide-react";
import { format } from "date-fns";

interface CreateLiveFixtureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateLiveFixtureModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateLiveFixtureModalProps) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fixtures, setFixtures] = useState<FixtureResponse[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<string>("");
  const [formData, setFormData] = useState<CreateLiveFixtureDto>({
    fixture: "",
    kickoffTime: new Date(),
  });

  // Load fixtures
  useEffect(() => {
    if (isOpen) {
      fetchFixtures();
    }
  }, [isOpen]);

  const fetchFixtures = async () => {
    try {
      const response = await footballFixtureApi.getAll(1, 50);
      if (response.success) {
        // Filter for upcoming/scheduled fixtures
        const upcomingFixtures = response.data.filter(
          (fixture) =>
            fixture.status === "scheduled",
        );
        setFixtures(upcomingFixtures);
      }
    } catch (error) {
      console.error("Failed to fetch fixtures:", error);
    }
  };

  const handleInputChange = (field: keyof CreateLiveFixtureDto, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectFixture = (fixtureId: string) => {
    setSelectedFixture(fixtureId);
    const fixture = fixtures.find((f) => f.id === fixtureId);
    if (fixture) {
      setFormData({
        fixture: fixtureId,
        kickoffTime: fixture.scheduledDate,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.fixture) {
        toast.error("Please select a fixture");
        setLoading(false);
        return;
      }

      if (!formData.kickoffTime) {
        toast.error("Kickoff time is required");
        setLoading(false);
        return;
      }

      const response = await footballLiveApi.create(formData);
      toast.success(response.message || "Live fixture created successfully");
      onSuccess();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create live fixture");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFixture("");
    setFormData({
      fixture: "",
      kickoffTime: new Date(),
    });
    setSearchQuery("");
  };

  const filteredFixtures = fixtures.filter((fixture) => {
    const homeName =
      fixture.homeTeam?.name || fixture.temporaryHomeTeamName || "";
    const awayName =
      fixture.awayTeam?.name || fixture.temporaryAwayTeamName || "";
    const competitionName = fixture.competition?.name || "";

    return (
      homeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      awayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitionName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const selectedFixtureData = fixtures.find((f) => f.id === selectedFixture);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Live Fixture</DialogTitle>
          <DialogDescription>
            Select a scheduled fixture to make it live
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fixture Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Search Fixtures</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by teams or competition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Fixtures List */}
            <div className="border rounded-lg">
              <div className="p-4 border-b bg-muted/50">
                <h4 className="font-medium text-foreground">
                  Available Fixtures ({filteredFixtures.length})
                </h4>
                <p className="text-sm text-muted-foreground">
                  Select a scheduled fixture to broadcast live
                </p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredFixtures.length === 0 ? (
                  <div className="p-8 text-center">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {searchQuery
                        ? "No fixtures match your search"
                        : "No scheduled fixtures available"}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredFixtures.map((fixture) => {
                      const homeName =
                        fixture.homeTeam?.name ||
                        fixture.temporaryHomeTeamName ||
                        "TBD";
                      const awayName =
                        fixture.awayTeam?.name ||
                        fixture.temporaryAwayTeamName ||
                        "TBD";
                      const isSelected = selectedFixture === fixture.id;

                      return (
                        <button
                          key={fixture.id}
                          type="button"
                          onClick={() => handleSelectFixture(fixture.id)}
                          className={`w-full text-left p-4 transition-colors ${
                            isSelected
                              ? "bg-primary/10 border-l-4 border-primary"
                              : "hover:bg-accent"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  {fixture.homeTeam?.logo ? (
                                    <img
                                      src={fixture.homeTeam.logo}
                                      alt={homeName}
                                      className="h-8 w-8 rounded object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs font-bold">
                                      {fixture.homeTeam?.shorthand ||
                                        homeName.substring(0, 2)}
                                    </span>
                                  )}
                                </div>
                                <div className="text-center text-sm text-muted-foreground">
                                  VS
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                                  {fixture.awayTeam?.logo ? (
                                    <img
                                      src={fixture.awayTeam.logo}
                                      alt={awayName}
                                      className="h-8 w-8 rounded object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs font-bold">
                                      {fixture.awayTeam?.shorthand ||
                                        awayName.substring(0, 2)}
                                    </span>
                                  )}
                                </div>
                                <div className="ml-3">
                                  <div className="font-medium text-foreground">
                                    {homeName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    vs
                                  </div>
                                  <div className="font-medium text-foreground">
                                    {awayName}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(
                                    new Date(fixture.scheduledDate),
                                    "MMM d, yyyy",
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(
                                    new Date(fixture.scheduledDate),
                                    "h:mm a",
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {fixture.stadium}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="ml-4">
                                <div className="p-2 rounded-full bg-emerald-500/10">
                                  <Radio className="h-4 w-4 text-emerald-500" />
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selected Fixture Preview */}
          {selectedFixtureData && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-red-500" />
                  Selected for Live Broadcast
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFixture("");
                    setFormData({ ...formData, fixture: "" });
                  }}
                >
                  Change
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      {selectedFixtureData.homeTeam?.logo ? (
                        <img
                          src={selectedFixtureData.homeTeam.logo}
                          alt={selectedFixtureData.homeTeam.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-gray-200 flex items-center justify-center">
                          <span className="text-lg font-bold">
                            {selectedFixtureData.homeTeam?.shorthand || "HT"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="font-semibold text-foreground">
                      {selectedFixtureData.homeTeam?.name ||
                        selectedFixtureData.temporaryHomeTeamName ||
                        "Home"}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-muted-foreground">
                      VS
                    </div>
                    <div className="text-lg font-bold text-red-600 mt-2">
                      LIVE
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="h-16 w-16 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-2">
                      {selectedFixtureData.awayTeam?.logo ? (
                        <img
                          src={selectedFixtureData.awayTeam.logo}
                          alt={selectedFixtureData.awayTeam.name}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-gray-200 flex items-center justify-center">
                          <span className="text-lg font-bold">
                            {selectedFixtureData.awayTeam?.shorthand || "AT"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="font-semibold text-foreground">
                      {selectedFixtureData.awayTeam?.name ||
                        selectedFixtureData.temporaryAwayTeamName ||
                        "Away"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Competition
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedFixtureData.competition?.logo && (
                        <img
                          src={selectedFixtureData.competition.logo}
                          alt={selectedFixtureData.competition.name}
                          className="h-4 w-4 rounded"
                        />
                      )}
                      <span className="font-medium">
                        {selectedFixtureData.competition?.name || "Friendly"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Stadium
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">
                        {selectedFixtureData.stadium}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Scheduled Time
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        {format(
                          new Date(selectedFixtureData.scheduledDate),
                          "MMM d, yyyy",
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Referee
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">
                        {selectedFixtureData.referee}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Kickoff Time */}
          <div>
            <Label htmlFor="kickoffTime">Live Kickoff Time *</Label>
            <div className="mt-1">
              <Input
                id="kickoffTime"
                type="datetime-local"
                value={
                  formData.kickoffTime
                    ? new Date(formData.kickoffTime).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("kickoffTime", new Date(e.target.value))
                }
                required
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Set the actual kickoff time for the live broadcast
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || !selectedFixture}
              className="flex-1"
            >
              {loading ? "Creating..." : "Create Live Fixture"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
