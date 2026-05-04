"use client";

import { useState, useCallback } from "react";
import { updateCompanyFinancial as updateApi } from "@/features/financial/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { CompanyFinancialResponse } from "@/features/financial/types";

export function useUpdateCompanyFinancial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (
      companyId: string,
      data: Record<string, unknown>
    ): Promise<CompanyFinancialResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await updateApi(companyId, data);
        if (response.data?.success) {
          return response.data.data as CompanyFinancialResponse;
        }
        const msg =
          response.data?.message || "Failed to update company financial";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to update company financial"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { update, loading, error, clearError: () => setError(null) };
}
