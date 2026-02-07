"use client";

import React, { useState } from "react";
import { X, Upload, Image, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { footballTeamApi } from "@/lib/api/v1/football-team.api";
import type { FootballTeamResponse } from "@/lib/types/v1.response.types";

interface UploadTeamLogoModalProps {
  team: FootballTeamResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadTeamLogoModal({
  team,
  isOpen,
  onClose,
  onSuccess,
}: UploadTeamLogoModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(team.logo || "");
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    try {
      const response = await footballTeamApi.uploadTeamLogo(
        team.id,
        selectedFile,
      );
      toast.success(response.message || "Logo uploaded successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload logo");
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    setPreviewUrl(team.logo || "");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-background rounded-lg shadow-lg">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background p-6 rounded-t-lg">
            <div>
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Upload Team Logo
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {team.name} ({team.shorthand})
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
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Current Logo Preview */}
            {team.logo && !selectedFile && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Current Logo
                </h3>
                <div className="flex justify-center">
                  <img
                    src={team.logo}
                    alt={`${team.name} logo`}
                    className="h-32 w-32 rounded-full border-2 border-border object-cover"
                  />
                </div>
              </div>
            )}

            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Select New Logo
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-input rounded-lg hover:border-primary transition-colors">
                <div className="space-y-2 text-center">
                  {previewUrl ? (
                    <div className="space-y-3">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-32 w-32 rounded-full mx-auto border-2 border-border object-cover"
                      />
                      <div className="flex gap-2 justify-center">
                        <button
                          type="button"
                          onClick={handleRemovePreview}
                          className="px-3 py-1 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                        <label className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 cursor-pointer transition-colors">
                          Change
                          <input
                            type="file"
                            className="hidden"
                            accept=".jpg,.jpeg,.png,.gif,.webp"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="flex text-sm text-muted-foreground">
                        <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept=".jpg,.jpeg,.png,.gif,.webp"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF, WebP up to 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="rounded-lg bg-muted p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Logo Requirements:
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Square image recommended (1:1 aspect ratio)</li>
                <li>• Minimum size: 256x256 pixels</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Supported formats: PNG, JPG, GIF, WebP</li>
                <li>• Transparent background preferred</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                type="submit"
                disabled={loading || !selectedFile}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </span>
                ) : (
                  "Upload Logo"
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
