"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  alpha,
  CircularProgress,
} from "@mui/material";
import { ReplayRounded } from "@mui/icons-material";

interface RetryTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  transactionId: string | null;
  companyName: string;
  amount: string;
  onRetry: (id: string, reason: string) => Promise<boolean>;
  loading: boolean;
}

const RetryTransactionDialog: React.FC<RetryTransactionDialogProps> = ({
  open,
  onClose,
  transactionId,
  companyName,
  amount,
  onRetry,
  loading,
}) => {
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!transactionId) return;
    const success = await onRetry(transactionId, reason);
    if (success) {
      setReason("");
      onClose();
    }
  };

  const handleClose = () => {
    if (!loading) {
      setReason("");
      onClose();
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
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: alpha("#f59e0b", 0.08),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f59e0b",
            }}
          >
            <ReplayRounded />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            Retry Transaction
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Retry the failed transaction for <strong>{companyName}</strong> ({amount}).
        </Typography>

        <TextField
          fullWidth
          label="Reason (optional)"
          placeholder="e.g. Payment method updated"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          multiline
          rows={2}
          size="small"
          disabled={loading}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading} size="small">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          size="small"
          startIcon={loading ? <CircularProgress size={16} /> : <ReplayRounded />}
          color="warning"
        >
          {loading ? "Retrying…" : "Retry"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RetryTransactionDialog;
