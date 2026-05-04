"use client";

import { useState, useEffect, useCallback } from "react";
import { getCompanyDashboardStats } from "@/features/companies/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { CompanyDashboardStats } from "@/features/companies/types";

interface UseCompanyDashboardStatsReturn {
  data: CompanyDashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCompanyDashboardStats(): UseCompanyDashboardStatsReturn {
  const [data, setData] = useState<CompanyDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCompanyDashboardStats();
      if (response.data?.success) {
        setData(response.data.data as CompanyDashboardStats);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load dashboard stats"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load dashboard stats"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
