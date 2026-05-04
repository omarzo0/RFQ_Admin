"use client";

import { useState, useEffect, useCallback } from "react";
import { getFailedTransactions } from "@/features/transactions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type {
  FailedTransaction,
  TransactionPagination,
  FailureReason,
} from "@/features/transactions/types";

interface UseFailedTransactionsParams {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}

export function useFailedTransactions(params?: UseFailedTransactionsParams) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const dateFrom = params?.dateFrom;
  const dateTo = params?.dateTo;

  const [transactions, setTransactions] = useState<FailedTransaction[]>([]);
  const [pagination, setPagination] = useState<TransactionPagination | null>(null);
  const [failureReasons, setFailureReasons] = useState<FailureReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams: Record<string, unknown> = { page, limit };
      if (dateFrom) cleanParams.dateFrom = dateFrom;
      if (dateTo) cleanParams.dateTo = dateTo;

      const response = await getFailedTransactions(
        cleanParams as { page?: number; limit?: number; dateFrom?: string; dateTo?: string }
      );
      if (response.data?.success) {
        const d = response.data.data;
        setTransactions(d?.transactions ?? []);
        setPagination(d?.pagination ?? null);
        setFailureReasons(d?.failureReasons ?? []);
      } else {
        setError(response.data?.message || "Failed to load failed transactions");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load failed transactions"));
    } finally {
      setLoading(false);
    }
  }, [page, limit, dateFrom, dateTo]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { transactions, pagination, failureReasons, loading, error, refetch: fetch };
}
