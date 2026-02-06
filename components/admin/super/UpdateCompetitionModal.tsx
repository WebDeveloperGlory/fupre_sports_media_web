"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { CompetitionResponse } from "@/lib/types/v1.response.types";
import { UpdateCompetitionDto } from "@/lib/types/v1.payload.types";
import {
  X,
  Trophy,
  Calendar,
  Users,
  FileText,
  Award,
  Target,
  Upload,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Shield,
} from "lucide-react";
import { CompetitionStatus, CompetitionType } from "@/types/v1.football-competition.types";

interface UpdateCompetitionModalProps {
  competition: CompetitionResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TYPE_OPTIONS = [
  { value: CompetitionType.LEAGUE, label: "League" },
  { value: CompetitionType.KNOCKOUT, label: "Knockout" },
  { value: CompetitionType.HYBRID, label: "Hybrid" },
];

const STATUS_OPTIONS = [
  { value: CompetitionStatus.UPCOMING, label: "Upcoming" },
  { value: CompetitionStatus.ONGOING, label: "Ongoing" },
  { value: CompetitionStatus.COMPLETED, label: "Completed" },
  { value: CompetitionStatus.CANCELLED, label: "Cancelled" },
];

export function UpdateCompetitionModal({
  competition,
  isOpen,
  onClose,
  onSuccess,
}: UpdateCompetitionModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(competition.logo);
  const [coverPreview, setCoverPreview] = useState<string | null>(competition.coverImage);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UpdateCompetitionDto>({
    name: competition.name,
    shorthand: competition.shorthand,
    description: competition.description,
    status: competition.status,
    season: competition.season,
    startDate: new Date(competition.startDate),
    endDate: new Date(competition.endDate),
    currentMatchWeek: competition.currentMatchWeek,
    currentStage: competition.currentStage || "",
    isActive: competition.isActive,
    isFeatured: competition.isFeatured,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.shorthand || !formData.season) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.startDate! > formData.endDate!) {
      toast.error("Start date must be before end date");
      return;
    }

    setLoading(true);
    try {
      const response = await footballCompetitionApi.update(
        competition.id,
        formData
      );
      toast.success(response.message || "Competition updated successfully");

      // Upload logo if selected
      if (logoFile) {
        setUploadingLogo(true);
        await footballCompetitionApi.uploadLogo(competition.id, logoFile);
        setUploadingLogo(false);
      }

      // Upload cover image if selected
      if (coverFile) {
        setUploadingCover(true);
        await footballCompetitionApi.uploadCoverImage(competition.id, coverFile);
        setUploadingCover(false);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update competition");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      if (type === "logo") {
        setLogoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setCoverFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
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
              Update Competition
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Update competition information for {competition.name}
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
          {/* Images Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Competition Logo
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 rounded-lg border-2 border-dashed border-input flex items-center justify-center overflow-hidden bg-accent/50">
                  {logoPreview ? (
                    <div className="relative h-full w-full">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">No logo</p>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={logoInputRef}
                      onChange={(e) => handleFileChange(e, "logo")}
                      accept="image/*"
                      className="hidden"
                      id="logo-upload-update"
                    />
                    <label
                      htmlFor="logo-upload-update"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      {logoFile ? "Change Logo" : "Upload Logo"}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 400x400px, max 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Cover Image
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-24 w-full rounded-lg border-2 border-dashed border-input flex items-center justify-center overflow-hidden bg-accent/50">
                  {coverPreview ? (
                    <div className="relative h-full w-full">
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">No cover</p>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={coverInputRef}
                      onChange={(e) => handleFileChange(e, "cover")}
                      accept="image/*"
                      className="hidden"
                      id="cover-upload-update"
                    />
                    <label
                      htmlFor="cover-upload-update"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      {coverFile ? "Change Cover" : "Upload Cover"}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 16:9 ratio, max 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Competition Name *
                </label>
                <div className="relative">
                  <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Shorthand */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Shorthand *
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.shorthand}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shorthand: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as CompetitionStatus,
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

              {/* Season */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Season *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.season}
                    onChange={(e) =>
                      setFormData({ ...formData, season: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent min-h-24"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Competition Dates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={formData.startDate?.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startDate: new Date(e.target.value),
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={formData.endDate?.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endDate: new Date(e.target.value),
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stage Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Stage Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Match Week */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Match Week
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    min="0"
                    value={formData.currentMatchWeek}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentMatchWeek: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>

              {/* Current Stage */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Stage
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.currentStage || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, currentStage: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="Group Stage, Knockouts, etc."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Settings
            </h3>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded border-input"
                />
                <span className="text-sm">Active Competition</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="rounded border-input"
                />
                <span className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Featured Competition
                </span>
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
              disabled={loading || uploadingLogo || uploadingCover}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
            >
              {loading || uploadingLogo || uploadingCover ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {uploadingLogo ? "Uploading Logo..." : 
                   uploadingCover ? "Uploading Cover..." : "Updating..."}
                </>
              ) : (
                "Update Competition"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}