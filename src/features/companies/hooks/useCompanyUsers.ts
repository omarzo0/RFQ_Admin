"use client";

import { useState, useEffect, useCallback } from "react";
import { getCompanyUsers } from "@/features/companies/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type {
  CompanyUser,
  CompanyPagination,
} from "@/features/companies/types";

interface UseCompanyUsersReturn {
  users: CompanyUser[];
  pagination: CompanyPagination | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCompanyUsers(
  companyId: string | null,
  page = 1,
  limit = 10
): UseCompanyUsersReturn {
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [pagination, setPagination] = useState<CompanyPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getCompanyUsers(companyId, { page, limit });
      if (response.data?.success) {
        const d = response.data.data;
        setUsers((d?.users ?? d ?? []) as CompanyUser[]);
        if (d?.pagination) {
          setPagination(d.pagination as CompanyPagination);
        }
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load company users"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load company users"));
    } finally {
      setLoading(false);
    }
  }, [companyId, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { users, pagination, loading, error, refetch: fetchData };
}
