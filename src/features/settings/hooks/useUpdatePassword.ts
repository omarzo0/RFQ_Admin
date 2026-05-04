"use client";

import { useState, useCallback } from "react";
import { updatePassword as api } from "@/features/settings/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { UpdatePasswordData } from "@/features/settings/types";

export function useUpdatePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (data: UpdatePasswordData): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api(data);
        if (response.data?.success) {
          return true;
        }
        const msg = response.data?.message || "Failed to update password";
        setError(msg);
        return false;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to update password"));
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { update, loading, error, clearError: () => setError(null) };
}
