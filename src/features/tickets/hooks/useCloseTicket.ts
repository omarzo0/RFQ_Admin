"use client";

import { useState, useCallback } from "react";
import { closeTicket as api } from "@/features/tickets/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { CloseTicketData, CloseTicketResponse } from "@/features/tickets/types";

export function useCloseTicket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = useCallback(
    async (id: string, data: CloseTicketData): Promise<CloseTicketResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api(id, data);
        if (response.data?.success) {
          return response.data.data as CloseTicketResponse;
        }
        const msg = response.data?.message || "Failed to close ticket";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to close ticket"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { close, loading, error, clearError: () => setError(null) };
}
