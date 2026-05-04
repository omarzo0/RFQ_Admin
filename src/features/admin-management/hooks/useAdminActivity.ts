"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminActivity } from "@/features/admin-management/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type {
  AdminActivity,
  AdminPagination,
  ActivityParams,
} from "@/features/admin-management/types";

export function useAdminActivity(id: string | null, params?: ActivityParams) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const startDate = params?.startDate;
  const endDate = params?.endDate;

  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [pagination, setPagination] = useState<AdminPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const cleanParams: ActivityParams = { page, limit };
      if (startDate) cleanParams.startDate = startDate;
      if (endDate) cleanParams.endDate = endDate;

      const response = await getAdminActivity(id, cleanParams);
      if (response.data?.success) {
        const d = response.data.data;
        setActivities(d?.activities ?? []);
        setPagination(
          d?.pagination
            ? {
                page: d.pagination.page,
                limit: d.pagination.limit,
                total: d.pagination.total,
                totalPages: d.pagination.totalPages,
              }
            : null
        );
      } else {
        setError(response.data?.message || "Failed to load activity log");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load activity log"));
    } finally {
      setLoading(false);
    }
  }, [id, page, limit, startDate, endDate]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { activities, pagination, loading, error, refetch: fetch };
}
