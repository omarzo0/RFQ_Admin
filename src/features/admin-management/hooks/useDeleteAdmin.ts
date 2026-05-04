"use client";

import { useState, useCallback } from "react";
import { deleteAdmin as api } from "@/features/admin-management/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { DeleteAdminResponse } from "@/features/admin-management/types";

export function useDeleteAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(
    async (id: string): Promise<DeleteAdminResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api(id);
        if (response.data?.success) {
          return response.data.data as DeleteAdminResponse;
        }
        const msg = response.data?.message || "Failed to delete admin";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to delete admin"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { remove, loading, error, clearError: () => setError(null) };
}
