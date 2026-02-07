"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { footballFixtureApi } from "@/lib/api/v1/football-fixture.api";
import { CreateFixtureDto } from "@/lib/types/v1.payload.types";
import { FixtureType } from "@/types/v1.football-fixture.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/v1/dialogue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/v1/label";

interface CreateFixtureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  competitions: any[];
  teams: any[];
}

export function CreateFixtureModal({
  isOpen,
  onClose,
  onSuccess,
  competitions,
  teams,
}: CreateFixtureModalProps) {
  const [loading, setLoading] = useState(false);
  const [isTemporaryMatch, setIsTemporaryMatch] = useState(false);
  const [formData, setFormData] = useState<CreateFixtureDto>({
    homeTeam: "",
    awayTeam: "",
    isTemporaryMatch: false,
    temporaryHomeTeamName: "",
    temporaryAwayTeamName: "",
    competition: "",
    scheduledDate: new Date(),
    stadium: "",
    matchType: FixtureType.COMPETITION,
    referee: "",
    isDerby: false,
  });

  const handleInputChange = (field: keyof CreateFixtureDto, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!isTemporaryMatch) {
        if (!formData.homeTeam || !formData.awayTeam) {
          toast.error("Please select both teams");
          setLoading(false);
          return;
        }
        if (formData.homeTeam === formData.awayTeam) {
          toast.error("Home and away teams must be different");
          setLoading(false);
          return;
        }
      } else {
        if (
          !formData.temporaryHomeTeamName ||
          !formData.temporaryAwayTeamName
        ) {
          toast.error("Please enter both team names");
          setLoading(false);
          return;
        }
      }

      if (!formData.stadium.trim()) {
        toast.error("Stadium is required");
        setLoading(false);
        return;
      }

      if (!formData.referee.trim()) {
        toast.error("Referee is required");
        setLoading(false);
        return;
      }

      if (!formData.scheduledDate) {
        toast.error("Scheduled date is required");
        setLoading(false);
        return;
      }

      // Prepare payload
      const payload: CreateFixtureDto = {
        ...formData,
        isTemporaryMatch,
        scheduledDate: new Date(formData.scheduledDate),
      };

      // Remove temporary fields if not temporary match
      if (!isTemporaryMatch) {
        delete payload.temporaryHomeTeamName;
        delete payload.temporaryAwayTeamName;
      } else {
        delete payload.homeTeam;
        delete payload.awayTeam;
      }

      const response = await footballFixtureApi.create(payload);
      toast.success(response.message || "Fixture created successfully");
      onSuccess();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create fixture");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      homeTeam: "",
      awayTeam: "",
      isTemporaryMatch: false,
      temporaryHomeTeamName: "",
      temporaryAwayTeamName: "",
      competition: "",
      scheduledDate: new Date(),
      stadium: "",
      matchType: FixtureType.COMPETITION,
      referee: "",
      isDerby: false,
    });
    setIsTemporaryMatch(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Fixture</DialogTitle>
          <DialogDescription>
            Schedule a new football match. Fill in all required fields.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Match Type Toggle */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsTemporaryMatch(false)}
              className={`flex-1 px-4 py-3 rounded-lg border ${
                !isTemporaryMatch
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input hover:bg-accent"
              }`}
            >
              Regular Match
              <p className="text-xs mt-1 opacity-70">
                Select from existing teams
              </p>
            </button>
            <button
              type="button"
              onClick={() => setIsTemporaryMatch(true)}
              className={`flex-1 px-4 py-3 rounded-lg border ${
                isTemporaryMatch
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input hover:bg-accent"
              }`}
            >
              Temporary Match
              <p className="text-xs mt-1 opacity-70">
                Enter team names manually
              </p>
            </button>
          </div>

          {!isTemporaryMatch ? (
            /* Regular Match Form */
            <>
              {/* Teams Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="homeTeam">Home Team *</Label>
                  <select
                    id="homeTeam"
                    value={formData.homeTeam}
                    onChange={(e) =>
                      handleInputChange("homeTeam", e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  >
                    <option value="">Select home team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name} ({team.shorthand})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="awayTeam">Away Team *</Label>
                  <select
                    id="awayTeam"
                    value={formData.awayTeam}
                    onChange={(e) =>
                      handleInputChange("awayTeam", e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  >
                    <option value="">Select away team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name} ({team.shorthand})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            /* Temporary Match Form */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tempHomeTeam">Home Team Name *</Label>
                  <Input
                    id="tempHomeTeam"
                    value={formData.temporaryHomeTeamName || ""}
                    onChange={(e) =>
                      handleInputChange("temporaryHomeTeamName", e.target.value)
                    }
                    placeholder="e.g., Team A"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tempAwayTeam">Away Team Name *</Label>
                  <Input
                    id="tempAwayTeam"
                    value={formData.temporaryAwayTeamName || ""}
                    onChange={(e) =>
                      handleInputChange("temporaryAwayTeamName", e.target.value)
                    }
                    placeholder="e.g., Team B"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Match Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="competition">Competition</Label>
              <select
                id="competition"
                value={formData.competition}
                onChange={(e) =>
                  handleInputChange("competition", e.target.value)
                }
                className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="">Select competition (optional)</option>
                {competitions.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="matchType">Match Type *</Label>
              <select
                id="matchType"
                value={formData.matchType}
                onChange={(e) =>
                  handleInputChange("matchType", e.target.value as FixtureType)
                }
                className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                required
              >
                <option value={FixtureType.COMPETITION}>Competition</option>
                <option value={FixtureType.FRIENDLY}>Friendly</option>
              </select>
            </div>

            <div>
              <Label htmlFor="stadium">Stadium *</Label>
              <Input
                id="stadium"
                value={formData.stadium}
                onChange={(e) => handleInputChange("stadium", e.target.value)}
                placeholder="e.g., FUPRE Main Pitch"
                required
              />
            </div>

            <div>
              <Label htmlFor="referee">Referee *</Label>
              <Input
                id="referee"
                value={formData.referee}
                onChange={(e) => handleInputChange("referee", e.target.value)}
                placeholder="e.g., Ref. John Doe"
                required
              />
            </div>

            <div>
              <Label htmlFor="scheduledDate">Date *</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={
                  formData.scheduledDate
                    ? new Date(formData.scheduledDate)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("scheduledDate", new Date(e.target.value))
                }
                required
              />
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id="isDerby"
                checked={formData.isDerby}
                onChange={(e) => handleInputChange("isDerby", e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="isDerby" className="cursor-pointer">
                Mark as Derby Match
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Fixture"}
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
