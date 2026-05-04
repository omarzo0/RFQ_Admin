"use client";

import { useState, useCallback } from "react";
import { toggleAdminStatus as api } from "@/features/admin-management/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { ToggleStatusResponse } from "@/features/admin-management/types";

export function useToggleAdminStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(
    async (id: string, isActive: boolean): Promise<ToggleStatusResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api(id, { isActive });
        if (response.data?.success) {
          return response.data.data as ToggleStatusResponse;
        }
        const msg = response.data?.message || "Failed to update admin status";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to update admin status"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { toggle, loading, error, clearError: () => setError(null) };
}
