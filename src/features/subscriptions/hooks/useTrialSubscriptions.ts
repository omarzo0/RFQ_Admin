"use client";

import { useState, useEffect, useCallback } from "react";
import { getSubscriptions } from "@/features/subscriptions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type {
  Subscription,
  SubscriptionPagination,
  SubscriptionsParams,
} from "@/features/subscriptions/types";

export function useTrialSubscriptions(params?: { page?: number; limit?: number }) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pagination, setPagination] = useState<SubscriptionPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams: SubscriptionsParams = { page, limit, plan: "trial" };

      const response = await getSubscriptions(cleanParams);
      if (response.data?.success) {
        const d = response.data.data;
        setSubscriptions(d?.subscriptions ?? []);
        setPagination(d ? {
          page: d.page,
          limit: d.limit,
          total: d.total,
          totalPages: d.totalPages,
        } : null);
      } else {
        setError(response.data?.message || response.data?.error || "Failed to load trial subscriptions");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load trial subscriptions"));
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { subscriptions, pagination, loading, error, refetch: fetch };
}
