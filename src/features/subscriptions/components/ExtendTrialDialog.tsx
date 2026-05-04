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
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  extensionDays: z
    .number({ error: "Days must be a number" })
    .min(1, "At least 1 day")
    .max(365, "Maximum 365 days"),
  reason: z.string().min(1, "Reason is required"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (extensionDays: number, reason: string) => Promise<boolean>;
  loading: boolean;
  companyName: string;
  currentTrialEnd: string;
}

export default function ExtendTrialDialog({
  open,
  onClose,
  onSubmit,
  loading,
  companyName,
  currentTrialEnd,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { extensionDays: 14, reason: "" },
  });

  React.useEffect(() => {
    if (open) {
      reset({ extensionDays: 14, reason: "" });
    }
  }, [open, reset]);

  const handleFormSubmit = async (data: FormData) => {
    const success = await onSubmit(data.extensionDays, data.reason);
    if (success) {
      onClose();
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
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
      <DialogTitle sx={{ fontWeight: 700 }}>Extend Trial</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Extend the trial period for <strong>{companyName}</strong>.
            {currentTrialEnd && (
              <>
                {" "}
                Current trial ends on <strong>{formatDate(currentTrialEnd)}</strong>.
              </>
            )}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Controller
              name="extensionDays"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  type="number"
                  label="Extension Days"
                  fullWidth
                  size="small"
                  error={!!errors.extensionDays}
                  helperText={errors.extensionDays?.message}
                  slotProps={{ htmlInput: { min: 1, max: 365 } }}
                />
              )}
            />
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Reason"
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  error={!!errors.reason}
                  helperText={errors.reason?.message}
                  placeholder="Why is the trial being extended?"
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
            {loading ? "Extending…" : "Extend Trial"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
