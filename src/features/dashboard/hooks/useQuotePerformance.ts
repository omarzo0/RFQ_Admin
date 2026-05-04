"use client";

import { useState, useEffect, useCallback } from "react";
import { getQuotePerformance } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

interface UseQuotePerformanceReturn {
  data: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useQuotePerformance(months = 12): UseQuotePerformanceReturn {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getQuotePerformance(months);
      if (response.data?.success) {
        setData(response.data.data);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load quote performance"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load quote performance"));
    } finally {
      setLoading(false);
    }
  }, [months]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
