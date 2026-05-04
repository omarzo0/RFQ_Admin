"use client";

import { useState, useEffect, useCallback } from "react";
import { getEmailPerformance } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

interface UseEmailPerformanceReturn {
  data: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEmailPerformance(months = 12): UseEmailPerformanceReturn {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEmailPerformance(months);
      if (response.data?.success) {
        setData(response.data.data);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load email performance"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load email performance"));
    } finally {
      setLoading(false);
    }
  }, [months]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
