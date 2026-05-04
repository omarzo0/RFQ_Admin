"use client";

import { useState, useEffect, useCallback } from "react";
import { getRevenueTrends } from "@/features/financial/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { RevenueTrendsResponse } from "@/features/financial/types";

export function useRevenueTrends(period?: string) {
  const [data, setData] = useState<RevenueTrendsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRevenueTrends(period ? { period } : undefined);
      if (response.data?.success) {
        setData(response.data.data as RevenueTrendsResponse);
      } else {
        setError(response.data?.message || "Failed to load revenue trends");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load revenue trends"));
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
