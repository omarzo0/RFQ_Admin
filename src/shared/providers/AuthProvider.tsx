"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/shared/store/authStore";
import { getProfile } from "@/features/auth/api/authApi";
import { Box, CircularProgress } from "@mui/material";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user, token, _hasHydrated, setCredentials, logout } = useAuthStore();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            // Only load profile if we have a token but no user, 
            // OR if we want to verify the persisted user is still valid.
            if (_hasHydrated && token && !user) {
                setLoading(true);
                try {
                    const response = await getProfile();
                    if (response.data?.success) {
                        setCredentials(
                            response.data.data,
                            token
                        );
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error("Failed to load profile:", error);
                    logout();
                } finally {
                    setLoading(false);
                }
            }
        };

        loadProfile();
    }, [_hasHydrated, token, user, setCredentials, logout]);

    if (!_hasHydrated || loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return <>{children}</>;
}
