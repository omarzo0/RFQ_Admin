"use client";

import { useState, useEffect, useCallback } from "react";
import { getProfile } from "@/features/settings/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { AdminProfile } from "@/features/settings/types";

export function useProfile() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProfile();
      if (response.data?.success) {
        setProfile(response.data.data as AdminProfile);
      } else {
        setError(response.data?.message || "Failed to load profile");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load profile"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { profile, loading, error, refetch: fetch };
}
