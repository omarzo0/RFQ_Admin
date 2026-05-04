"use client";

import { useState, useCallback } from "react";
import { deletePlan } from "@/features/subscription-plans/api";
import { extractApiError } from "@/shared/utils/extractApiError";

export function useDeletePlan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await deletePlan(id);
      if (response.data?.success) return true;
      setError(response.data?.message || response.data?.error || "Failed to delete plan");
      return false;
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to delete plan"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}
