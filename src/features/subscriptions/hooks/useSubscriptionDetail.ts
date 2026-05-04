"use client";

import { useState, useEffect, useCallback } from "react";
import { getSubscription } from "@/features/subscriptions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { SubscriptionDetailData } from "@/features/subscriptions/types";

export function useSubscriptionDetail(id: string | null) {
  const [data, setData] = useState<SubscriptionDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getSubscription(id);
      if (response.data?.success) {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const raw: any = response.data.data;
        /* Normalise: API may return flat or nested under "subscription" key */
        const sub = raw?.subscription ?? raw;
        setData({
          ...sub,
          company: raw?.company ?? undefined,
          paymentHistory: raw?.paymentHistory ?? undefined,
        } as SubscriptionDetailData);
      } else {
        setError(response.data?.message || "Failed to load subscription detail");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load subscription detail"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
