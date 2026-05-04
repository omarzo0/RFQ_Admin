"use client";

import { useState, useEffect, useCallback } from "react";
import { getCompanyFinancial } from "@/features/financial/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { CompanyFinancialResponse } from "@/features/financial/types";

export function useCompanyFinancial(companyId: string | null) {
  const [data, setData] = useState<CompanyFinancialResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!companyId) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getCompanyFinancial(companyId);
      if (response.data?.success) {
        setData(response.data.data as CompanyFinancialResponse);
      } else {
        setError(response.data?.message || "Failed to load company financial");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load company financial"));
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
