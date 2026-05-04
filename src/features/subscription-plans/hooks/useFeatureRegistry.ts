"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getFeatureRegistry } from "@/features/subscription-plans/api";
import { extractApiError } from "@/shared/utils/extractApiError";
import type {
  FeatureRegistryItem,
  FeatureRegistryResponse,
} from "@/features/subscription-plans/types";

const EMPTY_FEATURES: FeatureRegistryItem[] = [];
const EMPTY_GROUPED: Record<string, FeatureRegistryItem[]> = {};
const EMPTY_DEFAULTS: Record<string, boolean> = {};

export function useFeatureRegistry() {
  const [data, setData] = useState<FeatureRegistryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFeatureRegistry();
      if (response.data?.success) {
        setData(response.data.data);
      } else {
        setError(response.data?.message || response.data?.error || "Failed to load feature registry");
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load feature registry"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  /** Flat list of all features */
  const features: FeatureRegistryItem[] = data?.features ?? EMPTY_FEATURES;

  /** Features grouped by category */
  const grouped: Record<string, FeatureRegistryItem[]> = data?.grouped ?? EMPTY_GROUPED;

  /** Total feature count */
  const totalFeatures: number = data?.totalFeatures ?? 0;

  /** Build default features map from registry defaults (memoized) */
  const defaultFeaturesMap = useMemo(() => {
    if (!data?.features) return EMPTY_DEFAULTS;
    const map: Record<string, boolean> = {};
    data.features.forEach((f) => {
      map[f.key] = f.defaultValue;
    });
    return map;
  }, [data]);

  return { data, features, grouped, totalFeatures, defaultFeaturesMap, loading, error, refetch: fetch };
}
