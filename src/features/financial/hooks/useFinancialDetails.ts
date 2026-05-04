"use client";

import { useState, useEffect, useCallback } from "react";
import { getFinancialDetails } from "@/features/financial/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type {
  FinancialDetail,
  FinancialPagination,
  FinancialDetailsSummary,
} from "@/features/financial/types";

interface UseFinancialDetailsParams {
  page?: number;
  limit?: number;
}

export function useFinancialDetails(params?: UseFinancialDetailsParams) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;

  const [details, setDetails] = useState<FinancialDetail[]>([]);
  const [pagination, setPagination] = useState<FinancialPagination | null>(null);
  const [summary, setSummary] = useState<FinancialDetailsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFinancialDetails({ page, limit });
      if (response.data?.success) {
        const d = response.data.data;
        setDetails(d?.financialDetails ?? []);
        setPagination(d?.pagination ?? null);
        setSummary(d?.summary ?? null);
      } else {
        setError(response.data?.message || "Failed to load financial details");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load financial details"));
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { details, pagination, summary, loading, error, refetch: fetch };
}
