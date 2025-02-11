import { create } from "zustand";

export interface TimerStore {
    time: number;
    isRunning: boolean;
    isPaused: boolean;
    half: string;
    injuryTime: number;
    isPenaltyShootout: boolean;
    startTimer: () => void;
    stopTimer: () => void;
    pauseTimer: () => void;
    setTime: (newTime: number) => void;
    setHalf: (newHalf: string) => void;
    setInjuryTime: (newInjuryTime: number) => void;
    startPenaltyShootout: () => void;
}

const useTimerStore = create<TimerStore>((set) => ({
    time: 0, // Time in seconds
    isRunning: false,
    isPaused: false,
    half: 'First Half', // Current half of the match
    injuryTime: 0, // Injury time in seconds for the current half
    isPenaltyShootout: false, // Indicates if the game is in a penalty shootout

    startTimer: () => set({ isRunning: true, isPaused: false }),

    stopTimer: () => set({
        isRunning: false,
        isPaused: false,
        time: 0,
        half: 'First Half',
        injuryTime: 0,
        isPenaltyShootout: false,
    }),

    pauseTimer: () => set({ isRunning: false, isPaused: true }),

    setTime: (newTime: number) => set({ time: newTime }),

    setHalf: (newHalf: string) => set({ half: newHalf }),

    setInjuryTime: (newInjuryTime: number) => set({ injuryTime: newInjuryTime }),

    startPenaltyShootout: () => set({ isPenaltyShootout: true, isRunning: false, isPaused: false }),
}));

export default useTimerStore;