"use client";

import { useState, useEffect, useCallback } from "react";
import { getHealth } from "@/features/financial/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { FinancialHealthResponse } from "@/features/financial/types";

export function useFinancialHealth() {
  const [data, setData] = useState<FinancialHealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHealth();
      if (response.data?.success) {
        setData(response.data.data as FinancialHealthResponse);
      } else {
        setError(response.data?.message || "Failed to load financial health");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load financial health"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
