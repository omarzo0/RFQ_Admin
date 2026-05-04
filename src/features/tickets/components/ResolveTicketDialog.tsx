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
  resolution: z.string().min(1, { error: "Resolution description is required" }),
  comment: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<boolean>;
  loading: boolean;
}

export default function ResolveTicketDialog({
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
    defaultValues: { resolution: "", comment: "" },
  });

  React.useEffect(() => {
    if (open) {
      reset({ resolution: "", comment: "" });
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
      <DialogTitle sx={{ fontWeight: 700 }}>Resolve Ticket</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            <Controller
              name="resolution"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Resolution"
                  multiline
                  rows={4}
                  error={!!errors.resolution}
                  helperText={errors.resolution?.message}
                  size="small"
                  fullWidth
                  placeholder="Describe how the issue was resolved…"
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
                  rows={2}
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
            color="success"
            disabled={loading}
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            {loading ? <CircularProgress size={20} /> : "Resolve"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
