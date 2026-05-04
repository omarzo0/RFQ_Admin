"use client";

import { useState, useEffect, useCallback } from "react";
import { getTopCompanies } from "@/features/financial/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { TopCompaniesResponse } from "@/features/financial/types";

export function useTopCompanies(limit?: number) {
  const [data, setData] = useState<TopCompaniesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTopCompanies(limit ? { limit } : undefined);
      if (response.data?.success) {
        setData(response.data.data as TopCompaniesResponse);
      } else {
        setError(response.data?.message || "Failed to load top companies");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load top companies"));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
