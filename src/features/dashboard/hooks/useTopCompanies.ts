"use client";

import { useState, useEffect, useCallback } from "react";
import { getTopCompanies } from "@/features/dashboard/api";
import { extractApiError } from "@/shared/utils/extractApiError";

interface UseTopCompaniesReturn {
  data: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTopCompanies(): UseTopCompaniesReturn {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTopCompanies();
      if (response.data?.success) {
        setData(response.data.data);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load top companies"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load top companies"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
