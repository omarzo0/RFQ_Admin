"use client";

import { useState, useCallback } from "react";
import { createPlan } from "@/features/subscription-plans/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { CreatePlanData, SubscriptionPlan } from "@/features/subscription-plans/types";

export function useCreatePlan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: CreatePlanData): Promise<SubscriptionPlan | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await createPlan(data);
      if (response.data?.success) {
        return response.data.data as SubscriptionPlan;
      }
      setError(response.data?.message || response.data?.error || "Failed to create plan");
      return null;
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to create plan"));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}
