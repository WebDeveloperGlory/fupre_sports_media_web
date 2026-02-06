// app/admin/super/football/competitions/manage-rules-modal.tsx
"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { footballCompetitionApi } from "@/lib/api/v1/football-competition.api";
import { CompetitionResponse } from "@/lib/types/v1.response.types";
import { ExtraRuleDto, RuleRemovalDto } from "@/lib/types/v1.payload.types";
import { X, FileText, Plus, Trash2, Loader2, ChevronRight } from "lucide-react";

interface ManageRulesModalProps {
  competition: CompetitionResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ManageRulesModal({
  competition,
  isOpen,
  onClose,
  onSuccess,
}: ManageRulesModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ExtraRuleDto>({
    title: "",
    description: "",
  });

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await footballCompetitionApi.addExtraRule(
        competition.id,
        formData,
      );
      toast.success(response.message || "Rule added successfully");
      setFormData({ title: "", description: "" });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to add rule");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRule = async (ruleTitle: string) => {
    if (!confirm(`Are you sure you want to remove this rule?`)) return;

    try {
      setLoading(true);
      const payload: RuleRemovalDto = {
        ruleTitle,
      };
      const response = await footballCompetitionApi.removeExtraRule(
        competition.id,
        payload,
      );
      toast.success(response.message || "Rule removed successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove rule");
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
              Manage Rules - {competition.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add or remove extra rules from the competition
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
          {/* Add Rule Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Rule
            </h3>

            <form onSubmit={handleAddRule} className="space-y-4">
              {/* Rule Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rule Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="e.g., Home Kit Requirement"
                  required
                />
              </div>

              {/* Rule Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rule Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent min-h-32"
                  placeholder="Detailed description of the rule..."
                  required
                />
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
                      Add Rule
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Current Rules */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Current Rules ({competition.extraRules.length})
            </h3>

            {competition.extraRules.length > 0 ? (
              <div className="space-y-4">
                {competition.extraRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">
                              {rule.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {rule.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveRule(rule.title)}
                        disabled={loading}
                        className="p-2 hover:bg-accent rounded-lg transition-colors text-rose-500 ml-4 disabled:opacity-50"
                        title="Remove Rule"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Extra Rules
                </h3>
                <p className="text-muted-foreground">
                  Add extra rules to this competition using the form above
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
