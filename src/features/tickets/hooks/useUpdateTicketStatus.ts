"use client";

import { useState, useCallback } from "react";
import { updateTicketStatus as api } from "@/features/tickets/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { UpdateStatusData, UpdateStatusResponse } from "@/features/tickets/types";

export function useUpdateTicketStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (id: string, data: UpdateStatusData): Promise<UpdateStatusResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api(id, data);
        if (response.data?.success) {
          return response.data.data as UpdateStatusResponse;
        }
        const msg = response.data?.message || "Failed to update ticket status";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to update ticket status"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { update, loading, error, clearError: () => setError(null) };
}
