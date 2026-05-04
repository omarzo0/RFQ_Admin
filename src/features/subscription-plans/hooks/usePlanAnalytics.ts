"use client";

import { useState, useEffect, useCallback } from "react";
import { getPlanAnalytics } from "@/features/subscription-plans/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { PlanAnalyticsResponse } from "@/features/subscription-plans/types";

export function usePlanAnalytics(id: string | null, period?: string) {
  const [data, setData] = useState<PlanAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const params = period ? { period } : undefined;
      const response = await getPlanAnalytics(id, params);
      if (response.data?.success) {
        setData(response.data.data as PlanAnalyticsResponse);
      } else {
        setError(response.data?.message || response.data?.error || "Failed to load analytics");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load analytics"));
    } finally {
      setLoading(false);
    }
  }, [id, period]);

  useEffect(() => {
    if (id) fetch();
    else setData(null);
  }, [id, fetch]);

  return { data, loading, error, refetch: fetch };
}
