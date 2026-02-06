"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { CompetitionResponse } from "@/lib/types/v1.response.types";
import { SponsorDto, SponsorRemovalDto } from "@/lib/types/v1.payload.types";
import {
  X,
  Award,
  Plus,
  Trash2,
  Crown,
  Star,
  Users,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { CompetitionSponsor } from "@/types/v1.football-competition.types";

interface ManageSponsorsModalProps {
  competition: CompetitionResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SPONSOR_TIERS = [
  {
    value: CompetitionSponsor.MAIN,
    label: "Main Sponsor",
    icon: Crown,
    color: "text-amber-500",
  },
  {
    value: CompetitionSponsor.OFFICIAL,
    label: "Official Sponsor",
    icon: Star,
    color: "text-blue-500",
  },
  {
    value: CompetitionSponsor.PARTNER,
    label: "Partner Sponsor",
    icon: Users,
    color: "text-green-500",
  },
];

export function ManageSponsorsModal({
  competition,
  isOpen,
  onClose,
  onSuccess,
}: ManageSponsorsModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SponsorDto>({
    name: "",
    tier: CompetitionSponsor.OFFICIAL,
  });

  const handleAddSponsor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter sponsor name");
      return;
    }

    try {
      setLoading(true);
      const response = await footballCompetitionApi.addSponsor(
        competition.id,
        formData,
      );
      toast.success(response.message || "Sponsor added successfully");
      setFormData({ name: "", tier: CompetitionSponsor.OFFICIAL });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to add sponsor");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSponsor = async (sponsorName: string) => {
    if (!confirm(`Are you sure you want to remove ${sponsorName}?`)) return;

    try {
      setLoading(true);
      const payload: SponsorRemovalDto = {
        sponsorName,
      };
      const response = await footballCompetitionApi.removeSponsor(
        competition.id,
        payload,
      );
      toast.success(response.message || "Sponsor removed successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove sponsor");
    } finally {
      setLoading(false);
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
              Manage Sponsors - {competition.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add or remove sponsors from the competition
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add Sponsor Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Sponsor
            </h3>

            <form onSubmit={handleAddSponsor} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sponsor Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Sponsor Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="e.g., University Council"
                    required
                  />
                </div>

                {/* Sponsor Tier */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Sponsor Tier
                  </label>
                  <div className="relative">
                    <select
                      value={formData.tier}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tier: e.target.value as CompetitionSponsor,
                        })
                      }
                      className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                    >
                      {SPONSOR_TIERS.map((tier) => (
                        <option key={tier.value} value={tier.value}>
                          {tier.label}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none rotate-90" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Sponsor
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Current Sponsors */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Current Sponsors ({competition.sponsors.length})
            </h3>

            {competition.sponsors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competition.sponsors.map((sponsor, idx) => {
                  const tier = SPONSOR_TIERS.find(
                    (t) => t.value === sponsor.tier,
                  );
                  return (
                    <div
                      key={idx}
                      className="bg-card border border-border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {sponsor.logo ? (
                            <img
                              src={sponsor.logo}
                              alt={sponsor.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : tier ? (
                            <div className="h-10 w-10 rounded-lg bg-accent/50 flex items-center justify-center">
                              <tier.icon className={`h-5 w-5 ${tier.color}`} />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Award className="h-5 w-5 text-primary" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-foreground">
                              {sponsor.name}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              {tier?.icon && <tier.icon className="h-3 w-3" />}
                              {sponsor.tier}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveSponsor(sponsor.name)}
                          disabled={loading}
                          className="p-2 hover:bg-accent rounded-lg transition-colors text-rose-500 disabled:opacity-50"
                          title="Remove Sponsor"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Sponsors
                </h3>
                <p className="text-muted-foreground">
                  Add sponsors to this competition using the form above
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
