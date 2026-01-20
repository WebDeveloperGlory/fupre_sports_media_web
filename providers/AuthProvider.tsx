"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { tokenManager } from "@/lib/config/token-manager";
import { LoginDto } from "@/lib/types/v1.payload.types";
import {
  SportType,
  UserPermissions,
  UserPreference,
  UserRole,
  UserStatus,
} from "@/types/v1.user.types";
import { authApi } from "@/lib/api/v1/auth.api";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: UserPermissions[];
  username?: string;
  sport?: SportType;
  status?: UserStatus;
  lastLogin?: Date | null;
  passwordChangedAt?: Date | null;
  preferences?: UserPreference;
  isFantasyRegistered?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check auth on initial load
  useEffect(() => {
    checkAuth();
  }, []);

  // Protect routes
  useEffect(() => {
    if (!isLoading) {
      const publicRoutes = [
        "/",
        "/matches",
        "/highlights",
        "/news",
        "/new-auth/login",
        "/new-auth/register",
        "/new-auth/forgot-password",
      ];
      const isPublicPage = publicRoutes.some((route) =>
        pathname.startsWith(route),
      );
      const isAuthenticated = !!user;

      if (!isAuthenticated && !isPublicPage) {
        // Redirect to login if not authenticated and not on public page
        router.push("/new-auth/login");
      } else if (isAuthenticated && isPublicPage) {
        // Redirect to dashboard if authenticated and on public page
        router.push("/");
      }
    }
  }, [pathname, user, isLoading, router]);

  const checkAuth = async () => {
    try {
      // Check if user has a valid token
      if (authApi.isAuthenticated()) {
        // Fetch current user data from backend
        const response = await authApi.getCurrentUser();

        if (response.success && response.data) {
          setUser({
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
            role: response.data.role,
            username: response.data.username,
            permissions: response.data.permissions,
          });
        } else {
          // Invalid token, clear it
          tokenManager.removeToken();
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Clear invalid token
      tokenManager.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const payload: LoginDto = { email, password };
      const response = await authApi.login(payload);

      if (response.success && response.data) {
        // Set user data from login response
        setUser({
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
          permissions: response.data.user.permissions,
        });

        // Router will handle redirect based on the useEffect above
        router.push("/");
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear token
      authApi.logout();

      // Clear user state
      setUser(null);

      // Redirect to login
      router.push("/new-auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const refreshUser = async () => {
    try {
      if (authApi.isAuthenticated()) {
        const response = await authApi.getCurrentUser();

        if (response.success && response.data) {
          setUser({
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
            role: response.data.role,
            username: response.data.username,
            permissions: response.data.permissions,
            sport: response.data.sport,
            status: response.data.status,
            lastLogin: response.data.lastLogin,
            passwordChangedAt: response.data.passwordChangedAt,
            preferences: response.data.preferences,
            isFantasyRegistered: response.data.isFantasyRegistered,
            createdAt: response.data.createdAt,
            updatedAt: response.data.updatedAt,
          });
        }
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
