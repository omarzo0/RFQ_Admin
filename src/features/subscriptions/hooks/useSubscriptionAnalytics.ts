"use client";

import { useState, useEffect, useCallback } from "react";
import { getSubscriptionAnalytics } from "@/features/subscriptions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { SubscriptionAnalyticsResponse } from "@/features/subscriptions/types";

export function useSubscriptionAnalytics(period?: string) {
  const [data, setData] = useState<SubscriptionAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = period ? { period } : undefined;
      const response = await getSubscriptionAnalytics(params);
      if (response.data?.success) {
        setData(response.data.data as SubscriptionAnalyticsResponse);
      } else {
        setError(response.data?.message || "Failed to load analytics");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load analytics"));
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
