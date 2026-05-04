"use client";

import { useState, useCallback } from "react";
import { togglePlanStatus } from "@/features/subscription-plans/api";
import { extractApiError } from "@/shared/utils/extractApiError";

export function useTogglePlanStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(async (id: string, isActive: boolean): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await togglePlanStatus(id, { isActive });
      if (response.data?.success) return true;
      setError(response.data?.message || response.data?.error || "Failed to toggle status");
      return false;
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to toggle status"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { toggle, loading, error };
}
