"use client";

import { useState, useCallback } from "react";
import { updatePlan } from "@/features/subscription-plans/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { UpdatePlanData, SubscriptionPlan } from "@/features/subscription-plans/types";

export function useUpdatePlan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: string, data: UpdatePlanData): Promise<SubscriptionPlan | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await updatePlan(id, data);
      if (response.data?.success) {
        return response.data.data as SubscriptionPlan;
      }
      setError(response.data?.message || response.data?.error || "Failed to update plan");
      return null;
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to update plan"));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}
