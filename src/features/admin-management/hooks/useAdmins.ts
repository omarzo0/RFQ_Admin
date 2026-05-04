"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdmins } from "@/features/admin-management/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type {
  Admin,
  AdminPagination,
  AdminsParams,
} from "@/features/admin-management/types";

export function useAdmins(params?: AdminsParams) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const role = params?.role;
  const isActive = params?.isActive;
  const search = params?.search;

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [pagination, setPagination] = useState<AdminPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams: AdminsParams = { page, limit };
      if (role) cleanParams.role = role;
      if (isActive) cleanParams.isActive = isActive;
      if (search) cleanParams.search = search;

      const response = await getAdmins(cleanParams);
      if (response.data?.success) {
        const d = response.data.data;
        setAdmins(d?.admins ?? []);
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
        setError(response.data?.message || "Failed to load admins");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load admins"));
    } finally {
      setLoading(false);
    }
  }, [page, limit, role, isActive, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { admins, pagination, loading, error, refetch: fetch };
}
