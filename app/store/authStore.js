import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoggedIn: false,

            // ACTIONS
            setToken: (token) => set({ token }),
            setUser: (user) => set({ user }),
            setIsLoggedIn: (status) => set({ isLoggedIn: status }),

            // LOGOUT ACTION
            logout: () => {
                // 1. We clear the state in memory
                set({ user: null, isLoggedIn: false, token: null });

                // 2. Because of 'persist' wrapper below, Zustand AUTOMATICALLY 
                // updates AsyncStorage. You do NOT need AsyncStorage.removeItem('...').
                // It will overwrite the saved data with these null values.
            },
        }),
        {
            name: "auth-storage", // <--- THIS is the actual key used in AsyncStorage
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useAuthStore;