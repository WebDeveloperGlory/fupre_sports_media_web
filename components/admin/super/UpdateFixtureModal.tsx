"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { footballFixtureApi } from "@/lib/api/v1/football-fixture.api";
import { UpdateFixtureDto } from "@/lib/types/v1.payload.types";
import { FixtureResponse } from "@/lib/types/v1.response.types";
import {
  FixtureStatus,
} from "@/types/v1.football-fixture.types";
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

interface UpdateFixtureModalProps {
  fixture: FixtureResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  competitions: any[];
  teams: any[];
}

const WEATHER_CONDITIONS = [
  "Clear",
  "Partly Cloudy",
  "Cloudy",
  "Rainy",
  "Stormy",
  "Windy",
  "Foggy",
  "Snowy",
];

export function UpdateFixtureModal({
  fixture,
  isOpen,
  onClose,
  onSuccess,
  competitions,
  teams,
}: UpdateFixtureModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateFixtureDto>({
    scheduledDate: fixture.scheduledDate,
    status: fixture.status,
    stadium: fixture.stadium,
    referee: fixture.referee,
    attendance: fixture.attendance,
    weather: fixture.weather,
    postponedReason: fixture.postponedReason ?? undefined,
    rescheduledDate: fixture.rescheduledDate ?? undefined,
    isDerby: fixture.isDerby,
  });

  const handleInputChange = (field: keyof UpdateFixtureDto, value: any) => {
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
      if (!formData.stadium?.trim()) {
        toast.error("Stadium is required");
        setLoading(false);
        return;
      }

      if (!formData.referee?.trim()) {
        toast.error("Referee is required");
        setLoading(false);
        return;
      }

      if (!formData.scheduledDate) {
        toast.error("Scheduled date is required");
        setLoading(false);
        return;
      }

      const response = await footballFixtureApi.update(fixture.id, formData);
      toast.success(response.message || "Fixture updated successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to update fixture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Fixture</DialogTitle>
          <DialogDescription>
            Update fixture details and match information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Match Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduledDate">Date & Time *</Label>
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

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status || ""}
                onChange={(e) =>
                  handleInputChange("status", e.target.value as FixtureStatus)
                }
                className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value={FixtureStatus.SCHEDULED}>Scheduled</option>
                <option value={FixtureStatus.LIVE}>Live</option>
                <option value={FixtureStatus.COMPLETED}>Completed</option>
                <option value={FixtureStatus.POSTPONED}>Postponed</option>
                <option value={FixtureStatus.CANCELED}>Canceled</option>
              </select>
            </div>

            <div>
              <Label htmlFor="stadium">Stadium *</Label>
              <Input
                id="stadium"
                value={formData.stadium || ""}
                onChange={(e) => handleInputChange("stadium", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="referee">Referee *</Label>
              <Input
                id="referee"
                value={formData.referee || ""}
                onChange={(e) => handleInputChange("referee", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="attendance">Attendance</Label>
              <Input
                id="attendance"
                type="number"
                value={formData.attendance || 0}
                onChange={(e) =>
                  handleInputChange("attendance", parseInt(e.target.value) || 0)
                }
              />
            </div>

            <div>
              <Label htmlFor="weatherCondition">Weather Condition</Label>
              <select
                id="weatherCondition"
                value={formData.weather?.condition || "Clear"}
                onChange={(e) =>
                  handleInputChange("weather", {
                    ...formData.weather,
                    condition: e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                {WEATHER_CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                value={formData.weather?.temperature || 25}
                onChange={(e) =>
                  handleInputChange("weather", {
                    ...formData.weather,
                    temperature: parseInt(e.target.value) || 25,
                  })
                }
              />
            </div>

            {formData.status === FixtureStatus.POSTPONED && (
              <>
                <div>
                  <Label htmlFor="postponedReason">Postponed Reason</Label>
                  <Input
                    id="postponedReason"
                    value={formData.postponedReason || ""}
                    onChange={(e) =>
                      handleInputChange("postponedReason", e.target.value)
                    }
                    placeholder="Reason for postponement"
                  />
                </div>
                <div>
                  <Label htmlFor="rescheduledDate">Rescheduled Date</Label>
                  <Input
                    id="rescheduledDate"
                    type="datetime-local"
                    value={
                      formData.rescheduledDate
                        ? new Date(formData.rescheduledDate)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "rescheduledDate",
                        new Date(e.target.value),
                      )
                    }
                  />
                </div>
              </>
            )}
          </div>

          {/* Derby Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDerby"
              checked={formData.isDerby || false}
              onChange={(e) => handleInputChange("isDerby", e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="isDerby" className="cursor-pointer">
              Mark as Derby Match
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update Fixture"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
