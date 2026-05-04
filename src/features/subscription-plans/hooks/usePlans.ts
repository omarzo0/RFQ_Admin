"use client";

import { useState, useEffect, useCallback } from "react";
import { getPlans } from "@/features/subscription-plans/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type {
  SubscriptionPlan,
  PlanPagination,
  PlansParams,
} from "@/features/subscription-plans/types";

export function usePlans(params?: PlansParams) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const isActive = params?.isActive;
  const search = params?.search;

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [pagination, setPagination] = useState<PlanPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams: PlansParams = { page, limit };
      if (isActive !== undefined) cleanParams.isActive = isActive;
      if (search) cleanParams.search = search;

      const response = await getPlans(cleanParams);
      if (response.data?.success) {
        const d = response.data.data;
        setPlans(d?.subscriptionPlans ?? []);
        setPagination(d?.pagination ?? null);
      } else {
        setError(response.data?.message || response.data?.error || "Failed to load plans");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load plans"));
    } finally {
      setLoading(false);
    }
  }, [page, limit, isActive, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { plans, pagination, loading, error, refetch: fetch };
}
