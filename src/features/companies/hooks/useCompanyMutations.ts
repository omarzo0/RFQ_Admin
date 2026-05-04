"use client";

import { useState, useCallback } from "react";
import {
  createCompany as createCompanyApi,
  updateCompany as updateCompanyApi,
  deleteCompany as deleteCompanyApi,
  restoreCompany as restoreCompanyApi,
} from "@/features/companies/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type { CreateCompanyPayload, UpdateCompanyPayload, Company } from "@/features/companies/types";

interface UseCompanyMutationsReturn {
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  restoring: boolean;
  error: string | null;
  create: (data: CreateCompanyPayload) => Promise<Company | null>;
  update: (id: string, data: UpdateCompanyPayload) => Promise<Company | null>;
  remove: (id: string) => Promise<boolean>;
  restore: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export function useCompanyMutations(): UseCompanyMutationsReturn {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: CreateCompanyPayload): Promise<Company | null> => {
    setCreating(true);
    setError(null);
    try {
      const response = await createCompanyApi(data);
      if (response.data?.success) {
        return response.data.data as Company;
      }
      const msg = response.data?.message || response.data?.error || "Failed to create company";
      setError(msg);
      return null;
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to create company"));
      return null;
    } finally {
      setCreating(false);
    }
  }, []);

  const update = useCallback(async (id: string, data: UpdateCompanyPayload): Promise<Company | null> => {
    setUpdating(true);
    setError(null);
    try {
      const response = await updateCompanyApi(id, data);
      if (response.data?.success) {
        return response.data.data as Company;
      }
      const msg = response.data?.message || response.data?.error || "Failed to update company";
      setError(msg);
      return null;
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to update company"));
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setDeleting(true);
    setError(null);
    try {
      const response = await deleteCompanyApi(id);
      if (response.data?.success) {
        return true;
      }
      const msg = response.data?.message || response.data?.error || "Failed to delete company";
      setError(msg);
      return false;
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to delete company"));
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  const restore = useCallback(async (id: string): Promise<boolean> => {
    setRestoring(true);
    setError(null);
    try {
      const response = await restoreCompanyApi(id);
      if (response.data?.success) {
        return true;
      }
      const msg = response.data?.message || response.data?.error || "Failed to restore company";
      setError(msg);
      return false;
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to restore company"));
      return false;
    } finally {
      setRestoring(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { creating, updating, deleting, restoring, error, create, update, remove, restore, clearError };
}
