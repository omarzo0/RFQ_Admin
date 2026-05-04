"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  MenuItem,
  Typography,
  Switch,
  FormControlLabel,
  Skeleton,
  Alert,
  alpha,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFeatureRegistry } from "@/features/subscription-plans/hooks";
import type { PlanFeatures } from "@/features/subscription-plans/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  priceMonthly: z.number({ error: "Monthly price is required" }).min(0, "Must be ≥ 0"),
  priceYearly: z.number({ error: "Yearly price is required" }).min(0, "Must be ≥ 0"),
  currency: z.string().min(1, "Currency is required"),
  isActive: z.boolean(),
  maxUsers: z.number().min(0).optional(),
  maxRFQsPerMonth: z.number().min(0).optional(),
  maxContacts: z.number().min(0).optional(),
  maxEmailSendsPerMonth: z.number().min(0).optional(),
});

type FormData = z.infer<typeof schema>;

const CATEGORY_LABELS: Record<string, string> = {
  core: "Core",
  email: "Email",
  analytics: "Analytics",
  automation: "Automation",
  ai: "AI",
  advanced: "Advanced",
};

const CATEGORY_COLORS: Record<string, string> = {
  core: "#1976d2",
  email: "#0891b2",
  analytics: "#7c3aed",
  automation: "#f59e0b",
  ai: "#ec4899",
  advanced: "#16a34a",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData & { features: PlanFeatures }) => Promise<boolean>;
  loading: boolean;
  initialData?: {
    name: string;
    description: string;
    priceMonthly: number;
    priceYearly: number;
    currency: string;
    features: PlanFeatures;
    isActive: boolean;
    maxUsers?: number;
    maxRFQsPerMonth?: number;
    maxContacts?: number;
    maxEmailSendsPerMonth?: number;
  };
  mode: "create" | "edit";
}

export default function PlanFormDialog({
  open,
  onClose,
  onSubmit,
  loading,
  initialData,
  mode,
}: Props) {
  const { grouped, defaultFeaturesMap, loading: registryLoading, error: registryError } = useFeatureRegistry();
  type FeatureItem = { key: string; label: string; description: string; category: string; defaultValue: boolean };

  const [features, setFeatures] = React.useState<PlanFeatures>(
    initialData?.features ?? {}
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      priceMonthly: initialData?.priceMonthly ?? 0,
      priceYearly: initialData?.priceYearly ?? 0,
      currency: initialData?.currency ?? "USD",
      isActive: initialData?.isActive ?? true,
      maxUsers: initialData?.maxUsers ?? 0,
      maxRFQsPerMonth: initialData?.maxRFQsPerMonth ?? 0,
      maxContacts: initialData?.maxContacts ?? 0,
      maxEmailSendsPerMonth: initialData?.maxEmailSendsPerMonth ?? 0,
    },
  });

  // Keep a ref to defaultFeaturesMap so we can use it without causing re-runs
  const defaultsRef = React.useRef(defaultFeaturesMap);
  React.useEffect(() => {
    defaultsRef.current = defaultFeaturesMap;
  }, [defaultFeaturesMap]);

  React.useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? "",
        description: initialData?.description ?? "",
        priceMonthly: initialData?.priceMonthly ?? 0,
        priceYearly: initialData?.priceYearly ?? 0,
        currency: initialData?.currency ?? "USD",
        isActive: initialData?.isActive ?? true,
        maxUsers: initialData?.maxUsers ?? 0,
        maxRFQsPerMonth: initialData?.maxRFQsPerMonth ?? 0,
        maxContacts: initialData?.maxContacts ?? 0,
        maxEmailSendsPerMonth: initialData?.maxEmailSendsPerMonth ?? 0,
      });
      if (initialData?.features && Object.keys(initialData.features).length > 0) {
        setFeatures(initialData.features);
      } else {
        // Pre-fill with registry defaults for create mode
        setFeatures({ ...defaultsRef.current });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData, reset]);

  const toggleFeature = (key: string) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFormSubmit = async (data: FormData) => {
    const success = await onSubmit({ ...data, features });
    if (success) onClose();
  };

  const categoryOrder = ["core", "email", "analytics", "automation", "ai", "advanced"];

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {mode === "create" ? "Create Plan" : "Edit Plan"}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ maxHeight: "70vh" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            {/* Basic Info */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Plan Name"
                  fullWidth
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            {/* Pricing */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="priceMonthly"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                    type="number"
                    label="Monthly Price"
                    fullWidth
                    size="small"
                    error={!!errors.priceMonthly}
                    helperText={errors.priceMonthly?.message}
                  />
                )}
              />
              <Controller
                name="priceYearly"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                    type="number"
                    label="Yearly Price"
                    fullWidth
                    size="small"
                    error={!!errors.priceYearly}
                    helperText={errors.priceYearly?.message}
                  />
                )}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Currency"
                    fullWidth
                    size="small"
                    error={!!errors.currency}
                    helperText={errors.currency?.message}
                  >
                    {["USD", "EUR", "GBP"].map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Active"
                    fullWidth
                    size="small"
                    value={field.value ? "true" : "false"}
                    onChange={(e) => field.onChange(e.target.value === "true")}
                  >
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </TextField>
                )}
              />
            </Box>

            {/* Usage Limits */}
            <Divider />
            <Typography variant="subtitle2" fontWeight={700}>
              Usage Limits
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="maxUsers"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                    type="number"
                    label="Max Users"
                    fullWidth
                    size="small"
                  />
                )}
              />
              <Controller
                name="maxRFQsPerMonth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                    type="number"
                    label="Max RFQs / Month"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="maxContacts"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                    type="number"
                    label="Max Contacts"
                    fullWidth
                    size="small"
                  />
                )}
              />
              <Controller
                name="maxEmailSendsPerMonth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                    type="number"
                    label="Max Emails / Month"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Box>

            {/* Feature Toggles */}
            <Divider />
            <Typography variant="subtitle2" fontWeight={700}>
              Features
            </Typography>

            {registryLoading && (
              <Box>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={40} sx={{ mb: 1, borderRadius: 1 }} />
                ))}
              </Box>
            )}

            {registryError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {registryError}
              </Alert>
            )}

            {!registryLoading && !registryError &&
              categoryOrder
                .filter((cat) => grouped[cat] && grouped[cat].length > 0)
                .map((cat) => (
                  <Box key={cat} sx={{ mb: 1 }}>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      sx={{
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        color: CATEGORY_COLORS[cat] || "text.secondary",
                        mb: 0.5,
                        display: "block",
                      }}
                    >
                      {CATEGORY_LABELS[cat] || cat}
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid",
                        borderColor: "grey.200",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      {(grouped[cat] as FeatureItem[]).map((feat: FeatureItem, idx: number) => (
                        <Box
                          key={feat.key}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: 2,
                            py: 0.75,
                            borderBottom: idx < grouped[cat].length - 1 ? "1px solid" : "none",
                            borderColor: "grey.100",
                            backgroundColor: features[feat.key]
                              ? alpha(CATEGORY_COLORS[cat] || "#1976d2", 0.04)
                              : "transparent",
                            transition: "background-color 0.15s",
                          }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.8125rem" }}>
                              {feat.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                              {feat.description}
                            </Typography>
                          </Box>
                          <FormControlLabel
                            control={
                              <Switch
                                size="small"
                                checked={features[feat.key] ?? feat.defaultValue}
                                onChange={() => toggleFeature(feat.key)}
                                color="primary"
                              />
                            }
                            label=""
                            sx={{ ml: 1, mr: 0 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={onClose} disabled={loading} variant="outlined" size="small">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={loading || registryLoading}
            startIcon={loading ? <CircularProgress size={16} /> : undefined}
          >
            {loading
              ? mode === "create"
                ? "Creating…"
                : "Saving…"
              : mode === "create"
                ? "Create Plan"
                : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
