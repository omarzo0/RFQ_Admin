"use client";

import { useState, useCallback } from "react";
import { extendTrial as extendApi } from "@/features/subscriptions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { ExtendTrialResponse } from "@/features/subscriptions/types";

export function useExtendTrial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extend = useCallback(
    async (
      id: string,
      extensionDays: number,
      reason: string
    ): Promise<ExtendTrialResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await extendApi(id, { extensionDays, reason });
        if (response.data?.success) {
          return response.data.data as ExtendTrialResponse;
        }
        const msg = response.data?.message || "Failed to extend trial";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to extend trial"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { extend, loading, error, clearError: () => setError(null) };
}
