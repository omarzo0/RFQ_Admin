"use client";

import { useState, useCallback } from "react";
import { recalculateCompanyFinancial as recalcApi } from "@/features/financial/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { CompanyFinancialResponse } from "@/features/financial/types";

export function useRecalculateCompanyFinancial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recalculate = useCallback(
    async (companyId: string): Promise<CompanyFinancialResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await recalcApi(companyId);
        if (response.data?.success) {
          return response.data.data as CompanyFinancialResponse;
        }
        const msg =
          response.data?.message || "Failed to recalculate financials";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to recalculate financials"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { recalculate, loading, error, clearError: () => setError(null) };
}
