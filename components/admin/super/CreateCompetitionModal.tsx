"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { CreateCompetitionDto } from "@/lib/types/v1.payload.types";
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
} from "lucide-react";
import { CompetitionType } from "@/types/v1.football-competition.types";

interface CreateCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TYPE_OPTIONS = [
  { value: CompetitionType.LEAGUE, label: "League" },
  { value: CompetitionType.KNOCKOUT, label: "Knockout" },
  { value: CompetitionType.HYBRID, label: "Hybrid" },
];

export function CreateCompetitionModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCompetitionModalProps) {
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateCompetitionDto>({
    name: "",
    shorthand: "",
    type: CompetitionType.LEAGUE,
    description: "",
    season: new Date().getFullYear().toString(),
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    rules: {
      substitutions: {
        allowed: true,
        maximum: 5,
      },
      extraTime: true,
      penalties: true,
      matchDuration: {
        normal: 90,
        extraTime: 30,
      },
      squadSize: {
        min: 11,
        max: 23,
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.shorthand || !formData.season) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.startDate > formData.endDate) {
      toast.error("Start date must be before end date");
      return;
    }

    setLoading(true);
    try {
      const response = await footballCompetitionApi.create(formData);
      toast.success(response.message || "Competition created successfully");

      const competitionId = response.data.id;

      // Upload logo if selected
      if (logoFile && competitionId) {
        await footballCompetitionApi.uploadLogo(competitionId, logoFile);
      }

      // Upload cover image if selected
      if (coverFile && competitionId) {
        await footballCompetitionApi.uploadCoverImage(competitionId, coverFile);
      }

      onSuccess();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create competition");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover",
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

  const resetForm = () => {
    setFormData({
      name: "",
      shorthand: "",
      type: CompetitionType.LEAGUE,
      description: "",
      season: new Date().getFullYear().toString(),
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      rules: {
        substitutions: {
          allowed: true,
          maximum: 5,
        },
        extraTime: true,
        penalties: true,
        matchDuration: {
          normal: 90,
          extraTime: 30,
        },
        squadSize: {
          min: 11,
          max: 23,
        },
      },
    });
    setLogoPreview(null);
    setCoverPreview(null);
    setLogoFile(null);
    setCoverFile(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Create New Competition
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in the competition details below
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
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Logo
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
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Cover
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
                    placeholder="Inter-Faculty Championship"
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
                    placeholder="IFC"
                    required
                  />
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Competition Type
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as CompetitionType,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                  >
                    {TYPE_OPTIONS.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
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
                    placeholder="2024"
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
                  placeholder="Competition description..."
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
                    value={formData.startDate.toISOString().split("T")[0]}
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
                    value={formData.endDate.toISOString().split("T")[0]}
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

          {/* Rules Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Competition Rules
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Substitutions */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Substitutions
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.rules.substitutions.allowed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rules: {
                            ...formData.rules,
                            substitutions: {
                              ...formData.rules.substitutions,
                              allowed: e.target.checked,
                            },
                          },
                        })
                      }
                      className="rounded border-input"
                    />
                    <span className="text-sm">Allowed</span>
                  </div>
                  {formData.rules.substitutions.allowed && (
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Maximum
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={formData.rules.substitutions.maximum}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rules: {
                              ...formData.rules,
                              substitutions: {
                                ...formData.rules.substitutions,
                                maximum: parseInt(e.target.value) || 0,
                              },
                            },
                          })
                        }
                        className="w-20 px-2 py-1 border border-input bg-background rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Extra Time */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Extra Time
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.rules.extraTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rules: {
                          ...formData.rules,
                          extraTime: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-input"
                  />
                  <span className="text-sm">Allowed</span>
                </div>
              </div>

              {/* Penalties */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Penalties
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.rules.penalties}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rules: {
                          ...formData.rules,
                          penalties: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-input"
                  />
                  <span className="text-sm">Allowed</span>
                </div>
              </div>

              {/* Match Duration */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Match Duration (minutes)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={formData.rules.matchDuration.normal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rules: {
                          ...formData.rules,
                          matchDuration: {
                            ...formData.rules.matchDuration,
                            normal: parseInt(e.target.value) || 90,
                          },
                        },
                      })
                    }
                    className="w-24 px-2 py-1 border border-input bg-background rounded"
                    placeholder="90"
                  />
                  <span className="text-sm">Normal</span>
                  {formData.rules.extraTime && (
                    <>
                      <input
                        type="number"
                        min="0"
                        value={formData.rules.matchDuration.extraTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rules: {
                              ...formData.rules,
                              matchDuration: {
                                ...formData.rules.matchDuration,
                                extraTime: parseInt(e.target.value) || 30,
                              },
                            },
                          })
                        }
                        className="w-24 px-2 py-1 border border-input bg-background rounded"
                        placeholder="30"
                      />
                      <span className="text-sm">Extra</span>
                    </>
                  )}
                </div>
              </div>

              {/* Squad Size */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Squad Size
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={formData.rules.squadSize.min}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rules: {
                          ...formData.rules,
                          squadSize: {
                            ...formData.rules.squadSize,
                            min: parseInt(e.target.value) || 11,
                          },
                        },
                      })
                    }
                    className="w-20 px-2 py-1 border border-input bg-background rounded"
                    placeholder="Min"
                  />
                  <span className="text-sm">to</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.rules.squadSize.max}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rules: {
                          ...formData.rules,
                          squadSize: {
                            ...formData.rules.squadSize,
                            max: parseInt(e.target.value) || 23,
                          },
                        },
                      })
                    }
                    className="w-20 px-2 py-1 border border-input bg-background rounded"
                    placeholder="Max"
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
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Competition"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
