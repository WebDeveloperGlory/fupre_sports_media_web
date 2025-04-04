import useAuthStore from "@/stores/authStore";

// Role constants
export const ROLES = {
  USER: "user",
  MEDIA_ADMIN: "mediaadmin",
  HEAD_MEDIA_ADMIN: "headmediaadmin",
  TEAM_ADMIN: "team-admin",
  SUPER_ADMIN: "super-admin"
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const { jwt } = useAuthStore.getState();
  return !!jwt;
};

// Check if user has a specific role
export const hasRole = (role: string): boolean => {
  const { userProfile } = useAuthStore.getState();
  return userProfile?.role === role;
};

// Check if user is a media admin (either mediaadmin or headmediaadmin)
export const isMediaAdmin = (): boolean => {
  const { userProfile } = useAuthStore.getState();
  return userProfile?.role === ROLES.MEDIA_ADMIN || userProfile?.role === ROLES.HEAD_MEDIA_ADMIN;
};

// Check if user is the head media admin
export const isHeadMediaAdmin = (): boolean => {
  const { userProfile } = useAuthStore.getState();
  return userProfile?.role === ROLES.HEAD_MEDIA_ADMIN;
};

// Check if user can vote (any authenticated user)
export const canVote = (): boolean => {
  return isAuthenticated();
};

// Check if user can manage TOTS (headmediaadmin only)
export const canManageTOTS = (): boolean => {
  return isHeadMediaAdmin();
};

// Check if user can cast admin votes (any admin role)
export const canCastAdminVote = (): boolean => {
  const { userProfile } = useAuthStore.getState();
  // Allow any admin role to cast votes
  return userProfile?.role === ROLES.MEDIA_ADMIN ||
         userProfile?.role === ROLES.HEAD_MEDIA_ADMIN ||
         userProfile?.role === ROLES.TEAM_ADMIN ||
         userProfile?.role === ROLES.SUPER_ADMIN;
};
