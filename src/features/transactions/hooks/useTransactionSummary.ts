"use client";

import { useState, useEffect, useCallback } from "react";
import { getTransactionSummary } from "@/features/transactions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { TransactionSummaryResponse } from "@/features/transactions/types";

export function useTransactionSummary(period?: string) {
  const [data, setData] = useState<TransactionSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTransactionSummary(
        period ? { period } : undefined
      );
      if (response.data?.success) {
        setData(response.data.data as TransactionSummaryResponse);
      } else {
        setError(response.data?.message || "Failed to load summary");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load summary"));
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
