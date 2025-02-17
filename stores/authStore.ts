import { UserProfile } from "@/utils/requestDataTypes";
import { create } from "zustand";

export interface UserStore {
    userProfile: UserProfile | null,
    jwt: string | null,
    setUserProfile: ( userProfile: UserProfile ) => void,
    setJwt: ( jwt: string ) => void,
    clearUserData: () => void,
}

const useAuthStore = create<UserStore>( ( set ) => ({
    userProfile: null,
    jwt: null,
    setUserProfile: ( userProfile: UserProfile ) => set({ userProfile }),
    setJwt: ( jwt: string ) => set({ jwt }),
    clearUserData: () => set({ jwt: null, userProfile: null }),
}));

export default useAuthStore;