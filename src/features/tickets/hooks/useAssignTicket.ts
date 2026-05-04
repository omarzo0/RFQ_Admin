"use client";

import { useState, useCallback } from "react";
import { assignTicket as api } from "@/features/tickets/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { AssignTicketData, AssignTicketResponse } from "@/features/tickets/types";

export function useAssignTicket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assign = useCallback(
    async (id: string, data: AssignTicketData): Promise<AssignTicketResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api(id, data);
        if (response.data?.success) {
          return response.data.data as AssignTicketResponse;
        }
        const msg = response.data?.message || "Failed to assign ticket";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to assign ticket"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { assign, loading, error, clearError: () => setError(null) };
}
