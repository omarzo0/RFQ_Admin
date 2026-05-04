"use client";

import { useState, useCallback } from "react";
import { addTicketComment as api } from "@/features/tickets/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { AddCommentData, AddCommentResponse } from "@/features/tickets/types";

export function useAddComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = useCallback(
    async (id: string, data: AddCommentData): Promise<AddCommentResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api(id, data);
        if (response.data?.success) {
          return response.data.data as AddCommentResponse;
        }
        const msg = response.data?.message || "Failed to add comment";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to add comment"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { add, loading, error, clearError: () => setError(null) };
}
