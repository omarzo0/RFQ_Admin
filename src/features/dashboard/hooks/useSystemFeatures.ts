"use client";

import { useState, useEffect, useCallback } from "react";
import { getSystemFeatures } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

interface UseSystemFeaturesReturn {
  data: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSystemFeatures(): UseSystemFeaturesReturn {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSystemFeatures();
      if (response.data?.success) {
        setData(response.data.data);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load system features data"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load system features data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
