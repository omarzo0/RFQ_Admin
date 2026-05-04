"use client";

import { useState, useEffect, useCallback } from "react";
import { getPlanSubscribers } from "@/features/subscription-plans/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type {
  PlanSubscriber,
  PlanPagination,
  PlanSubscribersSummary,
  PlanSubscribersParams,
} from "@/features/subscription-plans/types";

export function usePlanSubscribers(id: string | null, params?: PlanSubscribersParams) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const status = params?.status;

  const [subscribers, setSubscribers] = useState<PlanSubscriber[]>([]);
  const [pagination, setPagination] = useState<PlanPagination | null>(null);
  const [summary, setSummary] = useState<PlanSubscribersSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const cleanParams: PlanSubscribersParams = { page, limit };
      if (status) cleanParams.status = status;

      const response = await getPlanSubscribers(id, cleanParams);
      if (response.data?.success) {
        const d = response.data.data;
        setSubscribers(d?.subscribers ?? []);
        setPagination(d?.pagination ?? null);
        setSummary(d?.summary ?? null);
      } else {
        setError(response.data?.message || response.data?.error || "Failed to load subscribers");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load subscribers"));
    } finally {
      setLoading(false);
    }
  }, [id, page, limit, status]);

  useEffect(() => {
    if (id) fetch();
    else {
      setSubscribers([]);
      setPagination(null);
      setSummary(null);
    }
  }, [id, fetch]);

  return { subscribers, pagination, summary, loading, error, refetch: fetch };
}
