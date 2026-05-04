"use client";

import { useState, useEffect, useCallback } from "react";
import { getCompanyTransactions } from "@/features/transactions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { CompanyTransactionsResponse } from "@/features/transactions/types";

interface UseCompanyTransactionsParams {
  companyId: string | null;
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}

export function useCompanyTransactions(params: UseCompanyTransactionsParams) {
  const { companyId, page = 1, limit = 20, status, type } = params;

  const [data, setData] = useState<CompanyTransactionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!companyId) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const queryParams: Record<string, unknown> = { page, limit };
      if (status) queryParams.status = status;
      if (type) queryParams.type = type;

      const response = await getCompanyTransactions(
        companyId,
        queryParams as { page?: number; limit?: number; status?: string; type?: string }
      );
      if (response.data?.success) {
        setData(response.data.data as CompanyTransactionsResponse);
      } else {
        setError(response.data?.message || "Failed to load company transactions");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load company transactions"));
    } finally {
      setLoading(false);
    }
  }, [companyId, page, limit, status, type]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
