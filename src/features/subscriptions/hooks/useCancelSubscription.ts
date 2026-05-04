"use client";

import { useState, useCallback } from "react";
import { cancelSubscription as cancelApi } from "@/features/subscriptions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { CancelSubscriptionResponse } from "@/features/subscriptions/types";

export function useCancelSubscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancel = useCallback(
    async (
      id: string,
      reason: string,
      immediately: boolean
    ): Promise<CancelSubscriptionResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await cancelApi(id, { reason, immediately });
        if (response.data?.success) {
          return response.data.data as CancelSubscriptionResponse;
        }
        const msg = response.data?.message || "Failed to cancel subscription";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to cancel subscription"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { cancel, loading, error, clearError: () => setError(null) };
}
