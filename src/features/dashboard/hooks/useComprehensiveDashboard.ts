"use client";

import { useState, useEffect, useCallback } from "react";
import { getComprehensiveDashboard } from "@/features/dashboard/api";
import type { ComprehensiveDashboardData } from "@/features/dashboard/types";
import { extractApiError } from "@/shared/utils/extractApiError";

interface UseComprehensiveDashboardReturn {
  data: ComprehensiveDashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useComprehensiveDashboard(): UseComprehensiveDashboardReturn {
  const [data, setData] = useState<ComprehensiveDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getComprehensiveDashboard();
      if (response.data?.success) {
        setData(response.data.data);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load comprehensive dashboard data"
        );
      }
    } catch (err: unknown) {
      setError(
        extractApiError(err, "Failed to load comprehensive dashboard data")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
