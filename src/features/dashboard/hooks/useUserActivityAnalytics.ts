"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserActivityAnalytics } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

interface UseUserActivityAnalyticsReturn {
  data: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserActivityAnalytics(days = 30): UseUserActivityAnalyticsReturn {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserActivityAnalytics(days);
      if (response.data?.success) {
        setData(response.data.data);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load user activity analytics"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load user activity analytics"));
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
