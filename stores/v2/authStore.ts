// store/authStore.ts
import { IV2User } from "@/utils/V2Utils/v2requestData.types";
import { create } from "zustand";

interface AuthState {
    user: IV2User | null;
    loading: boolean;
    isLoggedIn: boolean;
    setUser: (user: IV2User | null) => void;
    setLoading: (loading: boolean) => void;
    setIsLoggedIn: (loggedIn: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    isLoggedIn: false,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
    setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
}));