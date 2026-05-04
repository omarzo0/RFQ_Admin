"use client";

import { useState, useCallback } from "react";
import { updateSubscription as updateApi } from "@/features/subscriptions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type {
  UpdateSubscriptionData,
  UpdateSubscriptionResponse,
} from "@/features/subscriptions/types";

export function useUpdateSubscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (
      id: string,
      data: UpdateSubscriptionData
    ): Promise<UpdateSubscriptionResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await updateApi(id, data);
        if (response.data?.success) {
          return response.data.data as UpdateSubscriptionResponse;
        }
        const msg = response.data?.message || "Failed to update subscription";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to update subscription"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { update, loading, error, clearError: () => setError(null) };
}
