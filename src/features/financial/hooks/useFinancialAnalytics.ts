"use client";

import { useState, useEffect, useCallback } from "react";
import { getAnalytics } from "@/features/financial/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { AnalyticsResponse } from "@/features/financial/types";

export function useFinancialAnalytics(period?: string) {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAnalytics(period ? { period } : undefined);
      if (response.data?.success) {
        setData(response.data.data as AnalyticsResponse);
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
