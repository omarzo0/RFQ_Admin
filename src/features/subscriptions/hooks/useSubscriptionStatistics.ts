"use client";

import { useState, useEffect, useCallback } from "react";
import { getSubscriptionAnalytics } from "@/features/subscriptions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { SubscriptionAnalyticsResponse } from "@/features/subscriptions/types";

export function useSubscriptionStatistics() {
  const [data, setData] = useState<SubscriptionAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSubscriptionAnalytics();
      if (response.data?.success) {
        setData(response.data.data as SubscriptionAnalyticsResponse);
      } else {
        setError(response.data?.message || response.data?.error || "Failed to load statistics");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load statistics"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
