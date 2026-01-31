// app/admin/super/general/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { userApi } from "@/lib/api/v1/user.api";
import {
  UserRole,
  UserPermissions,
  SportType,
  UserStatus,
} from "@/types/v1.user.types";
import { CreateAdminDto } from "@/lib/types/v1.payload.types";
import {
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  Zap,
  Building,
  Check,
  X,
  MoreHorizontal,
  ChevronDown,
  Mail,
  User,
  Lock,
  Calendar,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { UserResponse } from "@/lib/types/v1.response.types";

// Permission groups by admin type
const PERMISSION_GROUPS = {
  [UserRole.SUPER_ADMIN]: [
    UserPermissions.LEAGUE_MANAGEMENT,
    UserPermissions.TEAM_MANAGEMENT,
    UserPermissions.PLAYER_MANAGEMENT,
    UserPermissions.MEDIA_PUBLICATION,
    UserPermissions.FIXTURE_MANAGEMENT,
    UserPermissions.LIVE_MANAGEMENT,
    UserPermissions.RESULT_EDITING,
  ],
  [UserRole.LIVE_ADMIN]: [
    UserPermissions.FIXTURE_MANAGEMENT,
    UserPermissions.LIVE_MANAGEMENT,
    UserPermissions.RESULT_EDITING,
  ],
  [UserRole.TENANT_ADMIN]: [
    UserPermissions.LEAGUE_MANAGEMENT,
    UserPermissions.TEAM_MANAGEMENT,
    UserPermissions.PLAYER_MANAGEMENT,
    UserPermissions.MEDIA_PUBLICATION,
  ],
};

const ROLE_DISPLAY = {
  [UserRole.SUPER_ADMIN]: {
    label: "Super Admin",
    icon: Shield,
    color: "bg-red-100 text-red-800 border border-red-200",
  },
  [UserRole.LIVE_ADMIN]: {
    label: "Live Admin",
    icon: Zap,
    color: "bg-green-100 text-green-800 border border-green-200",
  },
  [UserRole.TENANT_ADMIN]: {
    label: "Tenant Admin",
    icon: Building,
    color: "bg-blue-100 text-blue-800 border border-blue-200",
  },
  [UserRole.USER]: {
    label: "User",
    icon: User,
    color: "bg-gray-100 text-gray-800 border border-gray-200",
  },
};

const STATUS_DISPLAY = {
  [UserStatus.ACTIVE]: {
    label: "Active",
    color: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    icon: Check,
  },
  [UserStatus.INACTIVE]: {
    label: "Inactive",
    color: "bg-amber-100 text-amber-800 border border-amber-200",
    icon: X,
  },
  [UserStatus.SUSPENDED]: {
    label: "Suspended",
    color: "bg-rose-100 text-rose-800 border border-rose-200",
    icon: AlertCircle,
  },
};

const SPORT_DISPLAY = {
  [SportType.FOOTBALL]: { label: "Football", icon: "⚽" },
  [SportType.BASKETBALL]: { label: "Basketball", icon: "🏀" },
  [SportType.VOLLEYBALL]: { label: "Volleyball", icon: "🏐" },
  [SportType.ALL]: { label: "All Sports", icon: "🏆" },
};

const PERMISSION_LABELS = {
  [UserPermissions.LEAGUE_MANAGEMENT]: "Manage Leagues",
  [UserPermissions.TEAM_MANAGEMENT]: "Manage Teams",
  [UserPermissions.PLAYER_MANAGEMENT]: "Manage Players",
  [UserPermissions.MEDIA_PUBLICATION]: "Publish Media",
  [UserPermissions.FIXTURE_MANAGEMENT]: "Manage Fixtures",
  [UserPermissions.LIVE_MANAGEMENT]: "Go Live",
  [UserPermissions.RESULT_EDITING]: "Edit Results",
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
export default function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // New admin form state
  const [newAdmin, setNewAdmin] = useState<CreateAdminDto>({
    name: "",
    email: "",
    password: "",
    role: UserRole.TENANT_ADMIN,
    permissions: [],
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAll();
      if (response.success) {
        setUsers(response.data);
        setPagination(response);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle create admin
  const handleCreateAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsCreating(true);
      const response = await userApi.createAdmin(newAdmin);

      if (response.success) {
        toast.success(response.message || "Admin user created successfully");

        // Reset form and close dialog
        setNewAdmin({
          name: "",
          email: "",
          password: "",
          role: UserRole.TENANT_ADMIN,
          permissions: [],
        });
        setShowCreateDialog(false);
        setShowPassword(false);

        // Refresh users list
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create admin user");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await userApi.delete(selectedUser.id);

      if (response.success) {
        toast.success(response.message || "User deleted successfully");

        // Remove from list
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        setShowDeleteDialog(false);
        setSelectedUser(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  // Handle role change (permissions auto-update)
  const handleRoleChange = (role: UserRole) => {
    setNewAdmin((prev) => ({
      ...prev,
      role,
      permissions:
        PERMISSION_GROUPS[role as keyof typeof PERMISSION_GROUPS] || [],
    }));
  };

  // Handle permission toggle for tenant admin
  const togglePermission = (permission: UserPermissions) => {
    if (newAdmin.role !== UserRole.TENANT_ADMIN) return;

    setNewAdmin((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(
    (u) => u.status === UserStatus.ACTIVE,
  ).length;
  const adminUsers = users.filter((u) => u.role !== UserRole.USER).length;
  const suspendedUsers = users.filter(
    (u) => u.status === UserStatus.SUSPENDED,
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="">Manage all users and admin accounts in the system</p>
        </div>

        <button
          onClick={() => setShowCreateDialog(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Create Admin
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold mt-1">{totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            All registered users
          </p>
        </div>

        {/* Active Users */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Active Users</p>
              <p className="text-2xl font-bold mt-1">{activeUsers}</p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Currently active accounts
          </p>
        </div>

        {/* Admins */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium ">Admins</p>
              <p className="text-2xl font-bold mt-1">{adminUsers}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Administrative accounts
          </p>
        </div>

        {/* Suspended */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium ">Suspended</p>
              <p className="text-2xl font-bold mt-1">{suspendedUsers}</p>
            </div>
            <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
              <X className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Suspended accounts
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card rounded-lg border p-6">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-4">
          <div className="col-span-2 md:col-span-8">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users by name, email, or username..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-card focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 col-span-3 md:col-span-4">
            {/* Role Filter */}
            <div className="">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full p-2 border rounded cursor-pointer bg-input"
              >
                <option value="all">All Roles</option>
                {Object.entries(ROLE_DISPLAY).map(([role, config]) => (
                  <option key={role} value={role}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded cursor-pointer bg-input"
              >
                <option value="all">All Status</option>
                {Object.entries(STATUS_DISPLAY).map(([status, config]) => (
                  <option key={status} value={status}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg border w-full max-w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">All Users</h2>
          <p className="">
            Showing {filteredUsers.length} user
            {filteredUsers.length !== 1 ? "s" : ""} out of {pagination.total}{" "}
            found
          </p>
        </div>

        {/* Table */}
        <div className="">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 ">Loading users...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Search className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold">No users found</h3>
              <p className="">
                {searchTerm
                  ? "Try adjusting your search or filters"
                  : "No users in the system yet"}
              </p>
            </div>
          ) : (
            <div className="relative w-full max-w-full overflow-x-auto scrollbar-hide">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Sport
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Created
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {filteredUsers.map((user) => {
                    const RoleIcon = ROLE_DISPLAY[user.role]?.icon || Shield;
                    const StatusIcon =
                      STATUS_DISPLAY[user.status]?.icon || Check;

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-accent transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm  flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${ROLE_DISPLAY[user.role]?.color}`}
                          >
                            <RoleIcon className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {ROLE_DISPLAY[user.role]?.label}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {SPORT_DISPLAY[user.sport]?.icon}
                            </span>
                            <span className="font-medium">
                              {SPORT_DISPLAY[user.sport]?.label}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${STATUS_DISPLAY[user.status]?.color}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              {STATUS_DISPLAY[user.status]?.label}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {user.permissions.slice(0, 3).map((perm) => (
                              <span
                                key={perm}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded border"
                              >
                                {PERMISSION_LABELS[perm]?.split(" ")[1] ||
                                  perm.split("_")[1]}
                              </span>
                            ))}
                            {user.permissions.length > 3 && (
                              <span className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded ">
                                +{user.permissions.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="text-sm ">
                            {user.lastLogin ? (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(
                                  new Date(user.lastLogin),
                                  "MMM d, yyyy",
                                )}
                              </div>
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400">
                                Never
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="text-sm ">
                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="relative">
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-1 w-48 bg-card border rounded-lg shadow-lg z-10 hidden group-hover:block">
                              <div className="py-1">
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                  <Edit className="h-4 w-4" />
                                  Edit User
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowDeleteDialog(true);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete User
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2 justify-end py-4 mr-8">
          <button
            className="px-4 py-2 border border-muted-foreground rounded-lg hover:bg-orange-500 hover:text-secondary font-semibold hover:border-orange-500 disabled:opacity-50 disabled:hover:bg-muted-foreground"
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <div className="px-4 py-2 font-bold">
            {pagination.page}/{pagination.totalPages}
          </div>
          <button
            className="px-4 py-2 border border-muted-foreground rounded-lg hover:bg-orange-500 hover:text-secondary font-semibold hover:border-orange-500 disabled:opacity-50 disabled:hover:bg-muted-foreground"
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Create New Admin</h2>
              <p className=" mt-1">
                Create a new admin user with specific permissions and role.
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={newAdmin.name}
                    onChange={(e) =>
                      setNewAdmin((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-card focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-card focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newAdmin.password}
                    onChange={(e) =>
                      setNewAdmin((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-card focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Admin Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Role *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    UserRole.SUPER_ADMIN,
                    UserRole.TENANT_ADMIN,
                    UserRole.LIVE_ADMIN,
                  ].map((role) => {
                    const Icon = ROLE_DISPLAY[role]?.icon;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleChange(role)}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          newAdmin.role === role
                            ? "border-blue-500 bg-accent"
                            : "border-gray-300 dark:border-gray-600 hover:bg-accent"
                        }`}
                      >
                        {Icon && <Icon className="h-5 w-5 mx-auto mb-2" />}
                        <div className="text-sm font-medium">
                          {ROLE_DISPLAY[role]?.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Permissions Section */}
              {newAdmin.role === UserRole.TENANT_ADMIN && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Permissions
                  </label>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        id="all-permissions"
                        checked={PERMISSION_GROUPS[UserRole.TENANT_ADMIN].every(
                          (p) => newAdmin.permissions.includes(p),
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewAdmin((prev) => ({
                              ...prev,
                              permissions:
                                PERMISSION_GROUPS[UserRole.TENANT_ADMIN],
                            }));
                          } else {
                            setNewAdmin((prev) => ({
                              ...prev,
                              permissions: [],
                            }));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="all-permissions" className="font-medium">
                        Select All Tenant Permissions
                      </label>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pl-6">
                      {PERMISSION_GROUPS[UserRole.TENANT_ADMIN].map(
                        (permission) => (
                          <div
                            key={permission}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              id={`permission-${permission}`}
                              checked={newAdmin.permissions.includes(
                                permission,
                              )}
                              onChange={() => togglePermission(permission)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`permission-${permission}`}
                              className="text-sm"
                            >
                              {PERMISSION_LABELS[permission]}
                            </label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Display permissions for non-tenant roles */}
              {newAdmin.role !== UserRole.TENANT_ADMIN && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assigned Permissions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PERMISSION_GROUPS[
                      newAdmin.role as keyof typeof PERMISSION_GROUPS
                    ]?.map((permission) => (
                      <span
                        key={permission}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-full border"
                      >
                        {PERMISSION_LABELS[permission]}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {newAdmin.role === UserRole.SUPER_ADMIN
                      ? "Super admins automatically get all permissions"
                      : "Live admins get predefined live management permissions"}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateDialog(false);
                  setShowPassword(false);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAdmin}
                disabled={isCreating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {isCreating ? "Creating..." : "Create Admin"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg w-full max-w-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Delete User</h2>
              <p className=" mt-1">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedUser?.name}</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="p-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
