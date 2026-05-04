import { create, StoreApi } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { User } from "@/shared/types";

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    _hasHydrated: boolean;
    setCredentials: (user: User, token: string, refreshToken?: string) => void;
    logout: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set: StoreApi<AuthState>['setState']) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            _hasHydrated: false,
            setCredentials: (user: User, token: string, refreshToken?: string) => {
                set({ user, token, refreshToken, isAuthenticated: true });

                // Sync with cookies for API request layer (non-react parts)
                if (typeof window !== "undefined") {
                    const cookieOptions = {
                        expires: 7,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax" as const,
                    };
                    Cookies.set("token", token, cookieOptions);
                    if (refreshToken) {
                        Cookies.set("refreshToken", refreshToken, cookieOptions);
                    }
                }
            },
            logout: () => {
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false
                });

                if (typeof window !== "undefined") {
                    Cookies.remove("token");
                    Cookies.remove("refreshToken");
                    localStorage.removeItem("auth-storage");
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("refreshToken");
                }
            },
            setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state: AuthState | undefined) => {
                // This runs after rehydration from localStorage is complete
                state?.setHasHydrated(true);
            },
        }
    )
);
