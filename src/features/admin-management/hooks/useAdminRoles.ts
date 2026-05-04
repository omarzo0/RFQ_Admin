"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminRoles } from "@/features/admin-management/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { AdminRole } from "@/features/admin-management/types";

export function useAdminRoles() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAdminRoles();
      if (response.data?.success) {
        setRoles(response.data.data?.roles ?? []);
      } else {
        setError(response.data?.message || "Failed to load roles");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load roles"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { roles, loading, error, refetch: fetch };
}
