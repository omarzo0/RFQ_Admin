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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  assignedTo: z.string().min(1, { error: "Admin ID is required" }),
  comment: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<boolean>;
  loading: boolean;
}

export default function AssignTicketDialog({
  open,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { assignedTo: "", comment: "" },
  });

  React.useEffect(() => {
    if (open) {
      reset({ assignedTo: "", comment: "" });
    }
  }, [open, reset]);

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
      <DialogTitle sx={{ fontWeight: 700 }}>Assign Ticket</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            <Controller
              name="assignedTo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Admin ID"
                  placeholder="Enter admin user ID"
                  error={!!errors.assignedTo}
                  helperText={errors.assignedTo?.message}
                  size="small"
                  fullWidth
                />
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
            {loading ? <CircularProgress size={20} /> : "Assign"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
