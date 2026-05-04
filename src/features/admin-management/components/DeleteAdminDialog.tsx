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
  adminName?: string;
}

export default function DeleteAdminDialog({
  open,
  onClose,
  onConfirm,
  loading,
  adminName,
}: Props) {
  const handleConfirm = async () => {
    const success = await onConfirm();
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
      <DialogTitle sx={{ fontWeight: 700 }}>Delete Admin</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to delete this admin?
          {adminName && (
            <>
              <br />
              <strong>&quot;{adminName}&quot;</strong>
            </>
          )}
          <br />
          <br />
          This action will deactivate the admin account (soft delete).
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          sx={{ borderRadius: 2, minWidth: 100 }}
        >
          {loading ? <CircularProgress size={20} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
