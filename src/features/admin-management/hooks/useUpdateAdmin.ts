"use client";

import { useState, useCallback } from "react";
import { updateAdmin as api } from "@/features/admin-management/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { UpdateAdminData, UpdateAdminResponse } from "@/features/admin-management/types";

export function useUpdateAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (id: string, data: UpdateAdminData): Promise<UpdateAdminResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api(id, data);
        if (response.data?.success) {
          return response.data.data as UpdateAdminResponse;
        }
        const msg = response.data?.message || "Failed to update admin";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to update admin"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { update, loading, error, clearError: () => setError(null) };
}
