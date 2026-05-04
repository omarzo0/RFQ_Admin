"use client";

import { useState, useEffect, useCallback } from "react";
import { getTransactionAnalytics } from "@/features/transactions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { TransactionAnalyticsResponse } from "@/features/transactions/types";

export function useTransactionAnalytics(period?: string) {
  const [data, setData] = useState<TransactionAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTransactionAnalytics(
        period ? { period } : undefined
      );
      if (response.data?.success) {
        setData(response.data.data as TransactionAnalyticsResponse);
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
