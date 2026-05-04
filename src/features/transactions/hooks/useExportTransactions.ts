"use client";

import { useState, useCallback } from "react";
import { exportTransactions as exportApi } from "@/features/transactions/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { ExportResponse } from "@/features/transactions/types";

export function useExportTransactions() {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(
    async (params?: {
      format?: string;
      startDate?: string;
      endDate?: string;
      companyId?: string;
      status?: string;
    }): Promise<ExportResponse | null> => {
      setExporting(true);
      setError(null);
      try {
        const response = await exportApi(params);
        if (response.data?.success) {
          return response.data.data as ExportResponse;
        }
        const msg = response.data?.message || "Failed to export transactions";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to export transactions"));
        return null;
      } finally {
        setExporting(false);
      }
    },
    []
  );

  return { exportData, exporting, error };
}
