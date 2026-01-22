"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Camera,
  Bell,
  Settings,
  LogOut,
  User,
  Mail,
  Shield,
  Calendar,
  ArrowLeft,
  Check,
  X,
  Upload,
  Volume2,
  AtSign,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { authApi } from "@/lib/api/v1/auth.api";
import { useAuthStore } from "@/stores/v2/authStore";
import { userApi } from "@/lib/api/v1/user.api";

interface Notification {
  _id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface UserPreferences {
  notifications: {
    inApp: boolean;
    email: boolean;
    fantasyUpdates: boolean;
  };
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  sport: string;
  status: string;
  username?: string;
  lastLogin: Date | null;
  passwordChangedAt: Date | null;
  preferences: UserPreferences;
  isFantasyRegistered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProfilePage() {
  const { setUser, setIsLoggedIn } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "notifications" | "settings"
  >("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    preferences: {
      notifications: {
        inApp: true,
        email: true,
        fantasyUpdates: true,
      },
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await authApi.getCurrentUser();
      if (response.success) {
        const userData = response.data;
        setProfile(userData);
        setFormData({
          name: userData.name,
          username: userData.username || "",
          email: userData.email,
          preferences: userData.preferences,
        });
      } else {
        toast.error(response.message || "Failed to load profile");
        router.push("/new-auth/login");
      }
    } catch (error: any) {
      console.error("Profile fetch error:", error);
      toast.error(error?.message || "Failed to load profile");

      if (error?.statusCode === 401) {
        router.push("/new-auth/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Image size should be less than 15MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      // Using the uploadAvatar method you'll add to authApi
      const response = await authApi.uploadAvatar(file);
      if (response.success) {
        toast.success("Profile picture updated successfully");
        if (profile && response.data) {
          setProfile({
            ...profile,
            avatar: response.data.avatar,
          });
        }
      } else {
        toast.error(response.message || "Failed to upload avatar");
      }
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast.error(error?.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.username && formData.username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if(formData.username && formData.username !== profile?.username) {
      const response = await userApi.checkUsername(formData.username);
      if(response.success) {
        if(response.data) {
          // toast.success(response.message);
        } else {
          toast.error(response.message);
          return;
        }
      } else {
        toast.error(response.message || 'Error performing username check');
        return;
      }
    }

    setSaving(true);
    try {
      if (profile) {
        const response = await userApi.update(profile.id, formData);
        if (response.success) {
          toast.success("Profile updated successfully!");
          setIsEditing(false);

          if (profile) {
            setProfile({
              ...profile,
              name: formData.name,
              username: formData.username,
              preferences: formData.preferences,
            });
          }
        } else {
          toast.error(response.message || "Update failed");
        }
      } else {
        toast.error("No existing profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      authApi.logout();
      toast.success("Logged out successfully!");
      setProfile(null);
      setIsLoggedIn(false);
      setUser(null);
      router.push("/");
    } catch (error) {
      toast.error("Logout failed! Please try again.");
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Never";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        name: profile.name,
        username: profile.username || "",
        email: profile.email,
        preferences: profile.preferences,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">
            No profile data found
          </h3>
          <button
            onClick={() => router.push("/auth/login")}
            className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-10 p-2 bg-card hover:bg-accent text-foreground rounded-full transition-colors shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="inline-flex bg-muted p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === "profile"
                  ? "bg-emerald-500 text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === "notifications"
                  ? "bg-emerald-500 text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === "settings"
                  ? "bg-emerald-500 text-white shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl shadow-lg border border-border overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
                {/* Avatar Section */}
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border-4 border-emerald-500/20 group-hover:border-emerald-500 transition-all duration-300 overflow-hidden shadow-xl">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-800 dark:text-emerald-200 text-5xl font-bold">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <label className="cursor-pointer p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-colors shadow-lg">
                      {uploadingAvatar ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploadingAvatar}
                      />
                    </label>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {profile.name}
                    </h1>
                    <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </p>
                    {profile.username && (
                      <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                        <AtSign className="w-4 h-4" />@{profile.username}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-medium flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      {profile.role}
                    </span>
                    <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                      {profile.sport || "All Sports"}
                    </span>
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${
                        profile.status === "active"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                      }`}
                    >
                      {profile.status === "active" ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      {profile.status}
                    </span>
                    {profile.isFantasyRegistered && (
                      <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                        Fantasy Player
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Choose a username"
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2.5 bg-muted border border-input rounded-lg text-muted-foreground cursor-not-allowed"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full px-4 py-2.5 bg-muted border border-input rounded-lg text-muted-foreground cursor-not-allowed"
                  />
                </div>

                {/* Last Login */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Last Login
                  </label>
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-background border border-input rounded-lg text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(profile.lastLogin)}</span>
                  </div>
                </div>

                {/* Member Since */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-background border border-input rounded-lg text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(profile.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                {isEditing ? (
                  <>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 px-6 py-3 bg-transparent border border-input hover:bg-accent text-foreground font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-transparent border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl shadow-lg border border-border p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Bell className="w-6 h-6 text-emerald-500" />
                Your Notifications
              </h2>
              {notifications.length > 0 && (
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Mark all as read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No notifications yet
                </h3>
                <p className="text-muted-foreground">
                  We'll notify you when there's something new.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 rounded-lg border ${
                      notification.read
                        ? "border-border bg-card"
                        : "border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800"
                    } transition-colors`}
                  >
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-medium ${
                          !notification.read
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-foreground"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <button className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                        Mark as read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl shadow-lg border border-border p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
              <Settings className="w-6 h-6 text-emerald-500" />
              Preferences
            </h2>

            <div className="space-y-8">
              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Notification Settings
                </h3>

                <div className="space-y-4">
                  {/* In-app Notifications */}
                  <div className="flex items-center justify-between p-4 bg-background border border-input rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          In-app Notifications
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications within the app
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.preferences.notifications.inApp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              notifications: {
                                ...formData.preferences.notifications,
                                inApp: e.target.checked,
                              },
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 bg-background border border-input rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          Email Notifications
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.preferences.notifications.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              notifications: {
                                ...formData.preferences.notifications,
                                email: e.target.checked,
                              },
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* Fantasy Updates */}
                  <div className="flex items-center justify-between p-4 bg-background border border-input rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          Fantasy Updates
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Updates about your fantasy teams and leagues
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          formData.preferences.notifications.fantasyUpdates
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              notifications: {
                                ...formData.preferences.notifications,
                                fantasyUpdates: e.target.checked,
                              },
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-6 border-t border-border">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors shadow-md"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
