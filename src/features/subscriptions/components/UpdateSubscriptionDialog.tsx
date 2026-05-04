"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  subscriptionPlan: z.string().min(1, "Plan is required"),
  subscriptionStatus: z.string().min(1, "Status is required"),
  trialEndsAt: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const STATUSES = ["ACTIVE", "TRIAL", "CANCELLED", "PAST_DUE", "UNPAID"];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<boolean>;
  loading: boolean;
  plans?: string[];
  initialData?: {
    subscriptionPlan: string;
    subscriptionStatus: string;
    trialEndsAt?: string | null;
  };
}

export default function UpdateSubscriptionDialog({
  open,
  onClose,
  onSubmit,
  loading,
  plans = [],
  initialData,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      subscriptionPlan: initialData?.subscriptionPlan || "",
      subscriptionStatus: initialData?.subscriptionStatus || "",
      trialEndsAt: initialData?.trialEndsAt?.split("T")[0] || "",
    },
  });

  // Reset form when initialData changes
  React.useEffect(() => {
    if (open && initialData) {
      reset({
        subscriptionPlan: initialData.subscriptionPlan || "",
        subscriptionStatus: initialData.subscriptionStatus || "",
        trialEndsAt: initialData.trialEndsAt?.split("T")[0] || "",
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: FormData) => {
    const success = await onSubmit({
      ...data,
      trialEndsAt: data.trialEndsAt
        ? new Date(data.trialEndsAt).toISOString()
        : undefined,
    });
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Update Subscription</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            <Controller
              name="subscriptionPlan"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Plan"
                  fullWidth
                  size="small"
                  error={!!errors.subscriptionPlan}
                  helperText={errors.subscriptionPlan?.message}
                >
                  {plans.map((p) => (
                    <MenuItem key={p} value={p} sx={{ textTransform: "capitalize" }}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="subscriptionStatus"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Status"
                  fullWidth
                  size="small"
                  error={!!errors.subscriptionStatus}
                  helperText={errors.subscriptionStatus?.message}
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="trialEndsAt"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Trial Ends At"
                  fullWidth
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            />
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
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : undefined}
          >
            {loading ? "Saving…" : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
