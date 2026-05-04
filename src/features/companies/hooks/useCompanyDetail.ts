"use client";

import { useState, useEffect, useCallback } from "react";
import { getCompanyById } from "@/features/companies/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { Company } from "@/features/companies/types";

interface UseCompanyDetailReturn {
  company: Company | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCompanyDetail(companyId: string | null): UseCompanyDetailReturn {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getCompanyById(companyId);
      if (response.data?.success) {
        setCompany(response.data.data as Company);
      } else {
        setError(
          response.data?.message ||
            response.data?.error ||
            "Failed to load company details"
        );
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load company details"));
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { company, loading, error, refetch: fetchData };
}
