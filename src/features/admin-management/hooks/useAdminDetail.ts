"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdmin } from "@/features/admin-management/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { AdminDetail } from "@/features/admin-management/types";

export function useAdminDetail(id: string | null) {
  const [data, setData] = useState<AdminDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getAdmin(id);
      if (response.data?.success) {
        setData(response.data.data as AdminDetail);
      } else {
        setError(response.data?.message || "Failed to load admin detail");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load admin detail"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
