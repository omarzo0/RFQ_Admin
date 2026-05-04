"use client";

import { useState, useCallback } from "react";
import { retryTransaction as retryApi } from "@/features/transactions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { RetryResponse } from "@/features/transactions/types";

export function useRetryTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retry = useCallback(
    async (id: string, reason?: string): Promise<RetryResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await retryApi(id, reason ? { reason } : undefined);
        if (response.data?.success) {
          return response.data.data as RetryResponse;
        }
        const msg = response.data?.message || "Failed to retry transaction";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to retry transaction"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { retry, loading, error, clearError: () => setError(null) };
}
