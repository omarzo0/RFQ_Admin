"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string, immediately: boolean) => Promise<boolean>;
  loading: boolean;
  companyName: string;
  plan: string;
}

export default function CancelSubscriptionDialog({
  open,
  onClose,
  onConfirm,
  loading,
  companyName,
  plan,
}: Props) {
  const [reason, setReason] = useState("");
  const [immediately, setImmediately] = useState(false);

  const handleClose = () => {
    if (loading) return;
    setReason("");
    setImmediately(false);
    onClose();
  };

  const handleConfirm = async () => {
    const success = await onConfirm(reason, immediately);
    if (success) {
      setReason("");
      setImmediately(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: "error.main" }}>
        Cancel Subscription
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
          You are about to cancel the subscription for{" "}
          <strong>{companyName}</strong> ({plan} plan).
        </Alert>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Cancellation Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={3}
            fullWidth
            size="small"
            placeholder="Enter the reason for cancellation…"
          />

          <FormControlLabel
            control={
              <Switch
                checked={immediately}
                onChange={(e) => setImmediately(e.target.checked)}
                color="error"
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Cancel immediately
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {immediately
                    ? "Subscription will be cancelled right away"
                    : "Subscription will be cancelled at the end of the billing period"}
                </Typography>
              </Box>
            }
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={handleClose} disabled={loading} variant="outlined" size="small">
          Go Back
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          size="small"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          {loading ? "Cancelling…" : "Confirm Cancellation"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
