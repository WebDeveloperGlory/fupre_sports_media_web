"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { footballPlayerApi } from "@/lib/api/v1/football-player.api";
import { DepartmentResponse } from "@/lib/types/v1.response.types";
import {
  PlayerPosition,
  PlayerFavoriteFoot,
  PlayerVerificationStatus,
} from "@/types/v1.football-player.types";
import { CreatePlayerDto } from "@/lib/types/v1.payload.types";
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
  Loader2,
} from "lucide-react";

interface CreatePlayerModalProps {
  departments: DepartmentResponse[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const POSITION_OPTIONS = [
  { value: PlayerPosition.GK, label: "Goalkeeper" },
  { value: PlayerPosition.CB, label: "Center Back" },
  { value: PlayerPosition.LB, label: "Left Back" },
  { value: PlayerPosition.RB, label: "Right Back" },
  { value: PlayerPosition.CM, label: "Central Midfielder" },
  { value: PlayerPosition.AM, label: "Attacking Midfielder" },
  { value: PlayerPosition.LM, label: "Left Midfielder" },
  { value: PlayerPosition.RM, label: "Right Midfielder" },
  { value: PlayerPosition.LW, label: "Left Winger" },
  { value: PlayerPosition.RW, label: "Right Winger" },
  { value: PlayerPosition.SS, label: "Second Striker" },
  { value: PlayerPosition.CF, label: "Center Forward" },
];

const FOOT_OPTIONS = [
  { value: PlayerFavoriteFoot.LEFT, label: "Left" },
  { value: PlayerFavoriteFoot.RIGHT, label: "Right" },
  { value: PlayerFavoriteFoot.BOTH, label: "Both" },
];

const STATUS_OPTIONS = [
  { value: PlayerVerificationStatus.PENDING, label: "Pending" },
  { value: PlayerVerificationStatus.VERIFIED, label: "Verified" },
  { value: PlayerVerificationStatus.REJECTED, label: "Rejected" },
];

export function CreatePlayerModal({
  departments,
  isOpen,
  onClose,
  onSuccess,
}: CreatePlayerModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePlayerDto>({
    name: "",
    department: "",
    admissionYear: "",
    nationality: "",
    preferredFoot: PlayerFavoriteFoot.RIGHT,
    naturalPosition: PlayerPosition.CF,
    verificationStatus: PlayerVerificationStatus.PENDING,
    weight: undefined,
    height: undefined,
    marketValue: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.department ||
      !formData.admissionYear ||
      !formData.nationality
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await footballPlayerApi.createPlayer(formData);
      toast.success(response.message || "Player created successfully");
      onSuccess();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create player");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      department: "",
      admissionYear: "",
      nationality: "",
      preferredFoot: PlayerFavoriteFoot.RIGHT,
      naturalPosition: PlayerPosition.CF,
      verificationStatus: PlayerVerificationStatus.PENDING,
      weight: undefined,
      height: undefined,
      marketValue: undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Add New Player
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in the player details below
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nationality *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) =>
                      setFormData({ ...formData, nationality: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="Nigerian"
                    required
                  />
                </div>
              </div>

              {/* Admission Year */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Admission Year *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.admissionYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        admissionYear: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="2020"
                    required
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Department *
                </label>
                <div className="relative">
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <X className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none rotate-45" />
                </div>
              </div>
            </div>
          </div>

          {/* Player Attributes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Player Attributes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Natural Position
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={formData.naturalPosition}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        naturalPosition: e.target.value as PlayerPosition,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                  >
                    {POSITION_OPTIONS.map((pos) => (
                      <option key={pos.value} value={pos.value}>
                        {pos.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferred Foot */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Preferred Foot
                </label>
                <div className="relative">
                  <Footprints className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={formData.preferredFoot}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredFoot: e.target.value as PlayerFavoriteFoot,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                  >
                    {FOOT_OPTIONS.map((foot) => (
                      <option key={foot.value} value={foot.value}>
                        {foot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Height (cm)
                </label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    min="0"
                    value={formData.height || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        height: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="180"
                  />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Weight (kg)
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    min="0"
                    value={formData.weight || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weight: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="75"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Additional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Market Value */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Market Value (₦)
                </label>
                <div className="relative">
                  <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    min="0"
                    value={formData.marketValue || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marketValue: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="2500000"
                  />
                </div>
              </div>

              {/* Verification Status */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Verification Status
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={formData.verificationStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        verificationStatus: e.target
                          .value as PlayerVerificationStatus,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Player"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
