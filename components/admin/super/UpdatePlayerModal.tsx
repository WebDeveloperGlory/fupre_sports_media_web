"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { footballPlayerApi } from "@/lib/api/v1/football-player.api";
import {
  FootballPlayerResponse,
  DepartmentResponse,
} from "@/lib/types/v1.response.types";
import {
  PlayerPosition,
  PlayerFavoriteFoot,
} from "@/types/v1.football-player.types";
import { UpdatePlayerDto } from "@/lib/types/v1.payload.types";
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
  Loader2,
  Upload,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

interface UpdatePlayerModalProps {
  player: FootballPlayerResponse;
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

export function UpdatePlayerModal({
  player,
  departments,
  isOpen,
  onClose,
  onSuccess,
}: UpdatePlayerModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(player.photo);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UpdatePlayerDto>({
    name: player.name,
    admissionYear: player.admissionYear.toString(),
    nationality: player.nationality,
    preferredFoot: player.preferredFoot,
    naturalPosition: player.naturalPosition,
    weight: player.weight || undefined,
    height: player.height || undefined,
    marketValue: player.marketValue || undefined,
  });

  // Update photo preview when player changes
  useEffect(() => {
    setPhotoPreview(player.photo);
  }, [player]);

  const handlePhotoUpload = async () => {
    if (!photoFile) return;

    setUploading(true);
    try {
      const response = await footballPlayerApi.uploadTeamLogo(
        player.id,
        photoFile,
      );
      toast.success(response.message || "Photo uploaded successfully");
      setPhotoFile(null);
      // Update preview with the new photo URL if available
      if (response.data.photo) {
        setPhotoPreview(response.data.photo);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.admissionYear || !formData.nationality) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      // Update player data
      const response = await footballPlayerApi.updatePlayer(
        player.id,
        formData,
      );
      toast.success(response.message || "Player updated successfully");

      // Upload photo if selected
      if (photoFile) {
        await handlePhotoUpload();
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update player");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setPhotoFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Update Player
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Update player information for {player.name}
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
          {/* Photo Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Player Photo
            </h3>

            <div className="flex items-center gap-4">
              {/* Photo Preview */}
              <div className="h-32 w-32 rounded-full border-2 border-dashed border-input flex items-center justify-center overflow-hidden bg-accent/50">
                {photoPreview ? (
                  <div className="relative h-full w-full">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No photo</p>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="photo-upload-update"
                  />
                  <label
                    htmlFor="photo-upload-update"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    {photoFile ? "Change Photo" : "Upload Photo"}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Recommended: Square image, max 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>

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
              disabled={loading || uploading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
            >
              {loading || uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {uploading ? "Uploading..." : "Updating..."}
                </>
              ) : (
                "Update Player"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
