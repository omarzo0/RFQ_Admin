"use client";

import { useState, useCallback } from "react";
import {
  createCompanyUser as createCompanyUserApi,
  updateCompanyUser as updateCompanyUserApi,
  deleteCompanyUser as deleteCompanyUserApi,
} from "@/features/companies/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type {
  CompanyUser,
  CreateCompanyUserPayload,
  UpdateCompanyUserPayload,
} from "@/features/companies/types";

interface UseCompanyUserMutationsReturn {
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  create: (data: CreateCompanyUserPayload) => Promise<CompanyUser | null>;
  update: (userId: string, data: UpdateCompanyUserPayload) => Promise<CompanyUser | null>;
  remove: (userId: string) => Promise<boolean>;
  clearError: () => void;
}

export function useCompanyUserMutations(): UseCompanyUserMutationsReturn {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: CreateCompanyUserPayload): Promise<CompanyUser | null> => {
      setCreating(true);
      setError(null);
      try {
        const response = await createCompanyUserApi(data);
        if (response.data?.success) {
          return response.data.data as CompanyUser;
        }
        const msg =
          response.data?.message ||
          response.data?.error ||
          "Failed to create user";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to create user"));
        return null;
      } finally {
        setCreating(false);
      }
    },
    []
  );

  const update = useCallback(
    async (
      userId: string,
      data: UpdateCompanyUserPayload
    ): Promise<CompanyUser | null> => {
      setUpdating(true);
      setError(null);
      try {
        const response = await updateCompanyUserApi(userId, data);
        if (response.data?.success) {
          return response.data.data as CompanyUser;
        }
        const msg =
          response.data?.message ||
          response.data?.error ||
          "Failed to update user";
        setError(msg);
        return null;
      } catch (err: unknown) {
        setError(extractApiError(err, "Failed to update user"));
        return null;
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  const remove = useCallback(async (userId: string): Promise<boolean> => {
    setDeleting(true);
    setError(null);
    try {
      const response = await deleteCompanyUserApi(userId);
      if (response.data?.success) {
        return true;
      }
      const msg =
        response.data?.message ||
        response.data?.error ||
        "Failed to delete user";
      setError(msg);
      return false;
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to delete user"));
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { creating, updating, deleting, error, create, update, remove, clearError };
}
