"use client";

import { useState, useEffect, useCallback } from "react";
import { getTransaction } from "@/features/transactions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { TransactionDetail } from "@/features/transactions/types";

export function useTransactionDetail(id: string | null) {
  const [data, setData] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getTransaction(id);
      if (response.data?.success) {
        setData(response.data.data as TransactionDetail);
      } else {
        setError(response.data?.message || "Failed to load transaction");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load transaction"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
