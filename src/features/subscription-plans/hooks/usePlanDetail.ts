"use client";

import { useState, useEffect, useCallback } from "react";
import { getPlan } from "@/features/subscription-plans/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { PlanDetail } from "@/features/subscription-plans/types";

export function usePlanDetail(id: string | null) {
  const [data, setData] = useState<PlanDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getPlan(id);
      if (response.data?.success) {
        setData(response.data.data as PlanDetail);
      } else {
        setError(response.data?.message || response.data?.error || "Failed to load plan");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load plan"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetch();
    else setData(null);
  }, [id, fetch]);

  return { data, loading, error, refetch: fetch };
}
