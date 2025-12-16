import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoggedIn: false,

            setToken: (token) => set({ token }),
            setUser: (user) => set({ user }),
            setIsLoggedIn: (status) => set({ isLoggedIn: status }),

            logout: () => {
                set({ user: null, isLoggedIn: false, token: null });
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useAuthStore;