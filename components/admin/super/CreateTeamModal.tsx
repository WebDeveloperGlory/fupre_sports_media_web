"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  ChevronDown,
  Palette,
  Users,
  Trophy,
} from "lucide-react";
import { toast } from "react-toastify";
import { footballTeamApi } from "@/lib/api/v1/football-team.api";
import type { CreateFootballTeamDto } from "@/lib/types/v1.payload.types";
import type {
  FacultyResponse,
  DepartmentResponse,
} from "@/lib/types/v1.response.types";
import { TeamTypes, CoachRoles } from "@/types/v1.football-team.types";

interface CreateTeamModalProps {
  faculties: FacultyResponse[];
  departments: DepartmentResponse[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CoachForm {
  name: string;
  role: CoachRoles;
}

export default function CreateTeamModal({
  faculties,
  departments,
  isOpen,
  onClose,
  onSuccess,
}: CreateTeamModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    shorthand: "",
    type: TeamTypes.DEPARTMENT_LEVEL,
    facultyId: "",
    departmentId: "",
    academicYear: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
    primaryColor: "#2D5016",
    secondaryColor: "#FFFFFF",
  });

  const [coaches, setCoaches] = useState<CoachForm[]>([
    { name: "", role: CoachRoles.HEAD },
  ]);

  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleCoachChange = (
    index: number,
    field: keyof CoachForm,
    value: string,
  ) => {
    const updatedCoaches = [...coaches];
    updatedCoaches[index] = { ...updatedCoaches[index], [field]: value };
    setCoaches(updatedCoaches);
  };

  const handleAddCoach = () => {
    setCoaches([...coaches, { name: "", role: CoachRoles.ASSISTANT }]);
  };

  const handleRemoveCoach = (index: number) => {
    if (coaches.length > 1) {
      setCoaches(coaches.filter((_, i) => i !== index));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Team name is required");
      return false;
    }

    if (!formData.shorthand.trim()) {
      setError("Team shorthand is required");
      return false;
    }

    if (formData.shorthand.length > 4) {
      setError("Shorthand must be 4 characters or less");
      return false;
    }

    if (coaches.some((coach) => !coach.name.trim())) {
      setError("All coaches must have a name");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const payload: CreateFootballTeamDto = {
        name: formData.name,
        shorthand: formData.shorthand.toUpperCase(),
        type: formData.type,
        faculty: formData.facultyId || undefined,
        department: formData.departmentId || undefined,
        academicYear: formData.academicYear,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
      };

      const response = await footballTeamApi.createTeam(payload);
      toast.success(response.message || "Team created successfully");

      // Reset form
      setFormData({
        name: "",
        shorthand: "",
        type: TeamTypes.DEPARTMENT_LEVEL,
        facultyId: "",
        departmentId: "",
        academicYear: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        primaryColor: "#2D5016",
        secondaryColor: "#FFFFFF",
      });
      setCoaches([{ name: "", role: CoachRoles.HEAD }]);

      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-background rounded-lg shadow-lg">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background p-6 rounded-t-lg">
            <div>
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Create New Team
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Add a new football team to the system
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
          >
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Basic Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-muted-foreground mb-2"
                  >
                    Team Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Engineering Masters"
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="shorthand"
                    className="block text-sm font-medium text-muted-foreground mb-2"
                  >
                    Shorthand *
                  </label>
                  <input
                    id="shorthand"
                    type="text"
                    value={formData.shorthand}
                    onChange={(e) =>
                      handleInputChange(
                        "shorthand",
                        e.target.value.toUpperCase(),
                      )
                    }
                    placeholder="e.g., ENG"
                    maxLength={4}
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent uppercase"
                  />
                </div>
                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-muted-foreground mb-2"
                  >
                    Team Type
                  </label>
                  <div className="relative">
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                    >
                      {Object.values(TeamTypes).map((type) => (
                        <option key={type} value={type}>
                          {type.replace(/-/g, " ").toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="academicYear"
                    className="block text-sm font-medium text-muted-foreground mb-2"
                  >
                    Academic Year
                  </label>
                  <input
                    id="academicYear"
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) =>
                      handleInputChange("academicYear", e.target.value)
                    }
                    placeholder="e.g., 2024/2025"
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Faculty & Department */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="faculty"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  Faculty (Optional)
                </label>
                <div className="relative">
                  <select
                    id="faculty"
                    value={formData.facultyId}
                    onChange={(e) =>
                      handleInputChange("facultyId", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  Department (Optional)
                </label>
                <div className="relative">
                  <select
                    id="department"
                    value={formData.departmentId}
                    onChange={(e) =>
                      handleInputChange("departmentId", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                  >
                    <option value="">Select Department</option>
                    {departments
                      .filter(
                        (dept) =>
                          !formData.facultyId ||
                          dept.faculty === formData.facultyId,
                      )
                      .map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Team Colors */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                Team Colors
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="primaryColor"
                    className="block text-sm font-medium text-muted-foreground mb-2"
                  >
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        handleInputChange("primaryColor", e.target.value)
                      }
                      className="h-10 w-16 cursor-pointer rounded-lg border border-input"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        handleInputChange("primaryColor", e.target.value)
                      }
                      placeholder="#000000"
                      className="flex-1 px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="secondaryColor"
                    className="block text-sm font-medium text-muted-foreground mb-2"
                  >
                    Secondary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) =>
                        handleInputChange("secondaryColor", e.target.value)
                      }
                      className="h-10 w-16 cursor-pointer rounded-lg border border-input"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) =>
                        handleInputChange("secondaryColor", e.target.value)
                      }
                      placeholder="#FFFFFF"
                      className="flex-1 px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Coaching Staff */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Coaching Staff
                </h3>
                <button
                  type="button"
                  onClick={handleAddCoach}
                  className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Coach
                </button>
              </div>
              <div className="space-y-3">
                {coaches.map((coach, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={coach.name}
                        onChange={(e) =>
                          handleCoachChange(index, "name", e.target.value)
                        }
                        placeholder="Coach name"
                        className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                    </div>
                    <div className="relative w-40">
                      <select
                        value={coach.role}
                        onChange={(e) =>
                          handleCoachChange(
                            index,
                            "role",
                            e.target.value as CoachRoles,
                          )
                        }
                        className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                      >
                        {Object.values(CoachRoles).map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {coaches.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCoach(index)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 text-rose-500" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </span>
                ) : (
                  "Create Team"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
