"use client";

import { useState, useCallback } from "react";
import { updateProfile as api } from "@/features/settings/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { UpdateProfileData, AdminProfile } from "@/features/settings/types";

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (data: UpdateProfileData): Promise<AdminProfile | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api(data);
        if (response.data?.success) {
          return response.data.data as AdminProfile;
        }
        const msg = response.data?.message || "Failed to update profile";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to update profile"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { update, loading, error, clearError: () => setError(null) };
}
