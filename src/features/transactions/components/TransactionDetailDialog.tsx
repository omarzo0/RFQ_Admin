"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Skeleton,
  Alert,
  Paper,
  alpha,
  Divider,
} from "@mui/material";
import { CloseRounded, ReceiptRounded } from "@mui/icons-material";
import type { TransactionDetail } from "@/features/transactions/types";

interface TransactionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  data: TransactionDetail | null;
  loading: boolean;
  error: string | null;
}

function StatusChip({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  let color: "success" | "warning" | "error" | "info" | "default" = "default";
  if (["succeeded", "successful"].includes(s)) color = "success";
  else if (["pending", "processing"].includes(s)) color = "warning";
  else if (["failed", "error", "canceled"].includes(s)) color = "error";
  else if (["refunded"].includes(s)) color = "info";
  return (
    <Chip
      label={status || "—"}
      size="small"
      color={color}
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: "0.75rem", textTransform: "capitalize" }}
    />
  );
}

function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100); // amounts in cents
}

function formatDate(d: unknown): string {
  if (!d) return "—";
  try {
    return new Date(d as string).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1,
        borderBottom: "1px solid",
        borderColor: "grey.100",
        "&:last-child": { borderBottom: 0 },
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.8125rem" }} component="div">
        {value}
      </Typography>
    </Box>
  );
}

const TransactionDetailDialog: React.FC<TransactionDetailDialogProps> = ({
  open,
  onClose,
  data,
  loading,
  error,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: alpha("#1976d2", 0.08),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1976d2",
            }}
          >
            <ReceiptRounded />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {loading ? <Skeleton width={180} /> : "Transaction Details"}
            </Typography>
            {!loading && data && (
              <Typography variant="caption" color="text.secondary">
                {data.id}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {loading && (
          <Box>
            {Array.from({ length: 6 }).map((_, i) => (
              <Box key={i} sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                <Skeleton width={120} height={20} />
                <Skeleton width={180} height={20} />
              </Box>
            ))}
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>
            {error}
          </Alert>
        )}

        {!loading && data && (
          <>
            {/* Transaction Info */}
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Transaction
            </Typography>
            <Paper variant="outlined" sx={{ px: 2, mb: 3, borderRadius: 2 }}>
              <InfoRow label="Amount" value={formatCurrency(data.amount, data.currency)} />
              <InfoRow label="Status" value={<StatusChip status={data.status} />} />
              <InfoRow label="Type" value={
                <Chip label={data.type} size="small" variant="outlined" sx={{ fontWeight: 500, fontSize: "0.75rem", textTransform: "capitalize" }} />
              } />
              <InfoRow label="Description" value={data.description || "—"} />
              <InfoRow label="Created" value={formatDate(data.createdAt)} />
              <InfoRow label="Updated" value={formatDate(data.updatedAt)} />
            </Paper>

            {/* Company Info */}
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Company
            </Typography>
            <Paper variant="outlined" sx={{ px: 2, mb: 3, borderRadius: 2 }}>
              <InfoRow label="Name" value={data.companyName} />
              <InfoRow label="Email" value={data.companyEmail} />
              <InfoRow label="Company ID" value={
                <Typography variant="caption" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                  {data.companyId}
                </Typography>
              } />
            </Paper>

            {/* Payment Method */}
            {data.paymentMethod && (
              <>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Payment Method
                </Typography>
                <Paper variant="outlined" sx={{ px: 2, mb: 3, borderRadius: 2 }}>
                  <InfoRow label="Type" value={data.paymentMethod.type} />
                  <InfoRow label="Brand" value={
                    <Typography variant="body2" fontWeight={600} sx={{ textTransform: "capitalize", fontSize: "0.8125rem" }}>
                      {data.paymentMethod.brand}
                    </Typography>
                  } />
                  <InfoRow label="Last 4" value={`•••• ${data.paymentMethod.last4}`} />
                </Paper>
              </>
            )}

            {/* Stripe Data */}
            {data.stripeData && (
              <>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Stripe References
                </Typography>
                <Paper variant="outlined" sx={{ px: 2, borderRadius: 2 }}>
                  <InfoRow label="Payment Intent" value={
                    <Typography variant="caption" sx={{ fontFamily: "monospace", fontSize: "0.7rem" }}>
                      {data.stripeData.paymentIntentId}
                    </Typography>
                  } />
                  <InfoRow label="Charge ID" value={
                    <Typography variant="caption" sx={{ fontFamily: "monospace", fontSize: "0.7rem" }}>
                      {data.stripeData.chargeId}
                    </Typography>
                  } />
                  <InfoRow label="Invoice ID" value={
                    <Typography variant="caption" sx={{ fontFamily: "monospace", fontSize: "0.7rem" }}>
                      {data.stripeData.invoiceId}
                    </Typography>
                  } />
                </Paper>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailDialog;
