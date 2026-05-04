"use client";

import { useState, useCallback } from "react";
import { changeAdminPassword as api } from "@/features/admin-management/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { ChangePasswordData, ChangePasswordResponse } from "@/features/admin-management/types";

export function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = useCallback(
    async (id: string, data: ChangePasswordData): Promise<ChangePasswordResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api(id, data);
        if (response.data?.success) {
          return response.data.data as ChangePasswordResponse;
        }
        const msg = response.data?.message || "Failed to change password";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to change password"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { changePassword, loading, error, clearError: () => setError(null) };
}
