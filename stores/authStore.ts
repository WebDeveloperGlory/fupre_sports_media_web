import { UserProfile } from "@/utils/requestDataTypes";
import { create } from 'zustand';

interface UserStore {
  jwt: string | null,
  setUserProfile: ( userProfile: UserProfile ) => void,
  setJwt: ( jwt: string ) => void,
  clearUserData: () => void,
  logout: () => void;
  userProfile: UserProfile | null,
}

const useAuthStore = create<UserStore>((set) => ({
  jwt: null,
  userProfile: null,
  setUserProfile: ( userProfile: UserProfile ) => set({ userProfile }),
  setJwt: ( jwt: string ) => set({ jwt }),
  clearUserData: () => set({ jwt: null, userProfile: null }),
  logout: () => set({ jwt: null }),
}));

export default useAuthStore;