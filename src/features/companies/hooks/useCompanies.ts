"use client";

import { useState, useEffect, useCallback } from "react";
import { getCompanies } from "@/features/companies/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { Company, CompanyPagination } from "@/features/companies/types";

interface UseCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface UseCompaniesReturn {
  companies: Company[];
  pagination: CompanyPagination | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCompanies(params?: UseCompaniesParams): UseCompaniesReturn {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<CompanyPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const search = params?.search ?? "";
  const status = params?.status ?? "";

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams: Record<string, string | number | boolean> = { page, limit };
      if (search) queryParams.search = search;
      if (status) queryParams.status = status;

      const response = await getCompanies(queryParams as UseCompaniesParams);
      if (response.data?.success) {
        const d = response.data.data;
        setCompanies(d.companies ?? []);
        setPagination(d.pagination ?? null);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load companies"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load companies"));
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { companies, pagination, loading, error, refetch: fetchData };
}
