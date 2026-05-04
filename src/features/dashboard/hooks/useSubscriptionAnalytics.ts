"use client";

import { useState, useEffect, useCallback } from "react";
import { getSubscriptionAnalytics } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

interface UseSubscriptionAnalyticsReturn {
  data: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSubscriptionAnalytics(): UseSubscriptionAnalyticsReturn {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSubscriptionAnalytics();
      if (response.data?.success) {
        setData(response.data.data);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load subscription analytics"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load subscription analytics"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
