"use client";

import { useState, useEffect, useCallback } from "react";
import { getDashboard } from "@/features/financial/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { DashboardResponse } from "@/features/financial/types";

export function useFinancialDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDashboard();
      if (response.data?.success) {
        setData(response.data.data as DashboardResponse);
      } else {
        setError(response.data?.message || "Failed to load dashboard");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load dashboard"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
