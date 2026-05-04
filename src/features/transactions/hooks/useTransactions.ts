"use client";

import { useState, useEffect, useCallback } from "react";
import { getTransactions } from "@/features/transactions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type {
  Transaction,
  TransactionPagination,
  TransactionsSummary,
  TransactionsParams,
} from "@/features/transactions/types";

export function useTransactions(params?: TransactionsParams) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const status = params?.status;
  const type = params?.type;
  const companyId = params?.companyId;
  const dateFrom = params?.dateFrom;
  const dateTo = params?.dateTo;
  const search = params?.search;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<TransactionPagination | null>(null);
  const [summary, setSummary] = useState<TransactionsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams: TransactionsParams = { page, limit };
      if (status) cleanParams.status = status;
      if (type) cleanParams.type = type;
      if (companyId) cleanParams.companyId = companyId;
      if (dateFrom) cleanParams.dateFrom = dateFrom;
      if (dateTo) cleanParams.dateTo = dateTo;
      if (search) cleanParams.search = search;

      const response = await getTransactions(cleanParams);
      if (response.data?.success) {
        const d = response.data.data;
        setTransactions(d?.transactions ?? []);
        setPagination(d?.pagination ?? null);
        setSummary(d?.summary ?? null);
      } else {
        setError(response.data?.message || "Failed to load transactions");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load transactions"));
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, type, companyId, dateFrom, dateTo, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { transactions, pagination, summary, loading, error, refetch: fetch };
}
