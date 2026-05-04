"use client";

import { useState, useCallback } from "react";
import { createAdmin as api } from "@/features/admin-management/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { CreateAdminData, Admin } from "@/features/admin-management/types";

export function useCreateAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: CreateAdminData): Promise<Admin | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api(data);
        if (response.data?.success) {
          return response.data.data as Admin;
        }
        const msg = response.data?.message || "Failed to create admin";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to create admin"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { create, loading, error, clearError: () => setError(null) };
}
