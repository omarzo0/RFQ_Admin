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
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  comment: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<boolean>;
  loading: boolean;
  ticketSubject?: string;
}

export default function CloseTicketDialog({
  open,
  onClose,
  onSubmit,
  loading,
  ticketSubject,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { comment: "" },
  });

  React.useEffect(() => {
    if (open) {
      reset({ comment: "" });
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
      <DialogTitle sx={{ fontWeight: 700 }}>Close Ticket</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to close this ticket?
            {ticketSubject && (
              <>
                <br />
                <strong>&quot;{ticketSubject}&quot;</strong>
              </>
            )}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Closing comment (optional)"
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
            color="error"
            disabled={loading}
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            {loading ? <CircularProgress size={20} /> : "Close Ticket"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
