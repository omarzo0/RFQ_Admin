"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
  loading: boolean;
  planName: string;
}

export default function DeletePlanDialog({
  open,
  onClose,
  onConfirm,
  loading,
  planName,
}: Props) {
  const handleConfirm = async () => {
    const ok = await onConfirm();
    if (ok) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: "error.main" }}>
        Delete Plan
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to delete <strong>{planName}</strong>? This action
          cannot be undone. Plans with active subscribers cannot be deleted.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined" size="small">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          size="small"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          {loading ? "Deleting…" : "Delete Plan"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
