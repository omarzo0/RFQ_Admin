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
  status: z.string().min(1, { error: "Status is required" }),
  comment: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const STATUSES = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<boolean>;
  loading: boolean;
  currentStatus?: string;
}

export default function UpdateStatusDialog({
  open,
  onClose,
  onSubmit,
  loading,
  currentStatus,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: currentStatus || "", comment: "" },
  });

  React.useEffect(() => {
    if (open) {
      reset({ status: currentStatus || "", comment: "" });
    }
  }, [open, currentStatus, reset]);

  const handleFormSubmit = async (data: FormData) => {
    const success = await onSubmit(data);
    if (success) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Update Ticket Status</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Status"
                  error={!!errors.status}
                  helperText={errors.status?.message}
                  size="small"
                  fullWidth
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Comment (optional)"
                  multiline
                  rows={3}
                  size="small"
                  fullWidth
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            {loading ? <CircularProgress size={20} /> : "Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
