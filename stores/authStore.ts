import { create } from 'zustand';

interface UserStore {
  jwt: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<UserStore>((set) => ({
  jwt: null,
  login: async (email: string, password: string) => {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      set({ jwt: data.token });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  signup: async (name: string, email: string, password: string) => {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      set({ jwt: data.token });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  logout: () => set({ jwt: null }),
}));

export default useAuthStore;