"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
  Skeleton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import type { SubscriptionDetailData } from "@/features/subscriptions/types";

/* ──────── Helpers ──────── */

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.75 }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ fontSize: "0.8125rem", textAlign: "right", maxWidth: "60%", wordBreak: "break-all" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function StatusChip({ status }: { status: string }) {
  const s = (status || "").toUpperCase();
  let color: "success" | "warning" | "error" | "info" | "default" = "default";
  if (s === "ACTIVE") color = "success";
  else if (["TRIAL", "PAST_DUE"].includes(s)) color = "warning";
  else if (["CANCELLED", "UNPAID"].includes(s)) color = "error";
  return (
    <Chip
      label={status || "—"}
      size="small"
      color={color}
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: "0.75rem" }}
    />
  );
}

function PaymentStatusChip({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  let color: "success" | "warning" | "error" | "default" = "default";
  if (s === "succeeded") color = "success";
  else if (s === "pending") color = "warning";
  else if (["failed", "canceled"].includes(s)) color = "error";
  return (
    <Chip
      label={status || "—"}
      size="small"
      color={color}
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: "0.7rem", textTransform: "capitalize" }}
    />
  );
}

function formatCents(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

function formatDate(d: unknown): string {
  if (!d) return "";
  try {
    return new Date(d as string).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

/* ──────── Component ──────── */

interface Props {
  open: boolean;
  onClose: () => void;
  data: SubscriptionDetailData | null;
  loading: boolean;
  error: string | null;
}

export default function SubscriptionDetailDialog({ open, onClose, data, loading, error }: Props) {
  const company = data?.company;
  const payments = data?.paymentHistory ?? [];
  const counts = data?._count;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Subscription Details</DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="text" height={32} />
            ))}
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && data && (
          <>
            {/* ─── Subscription Info ─── */}
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, mt: 0.5 }}>
              Subscription
            </Typography>
            <InfoRow label="Name" value={data.name} />
            <InfoRow label="Email" value={data.email} />
            <InfoRow
              label="Plan"
              value={
                <Chip
                  label={data.subscriptionPlan}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ textTransform: "capitalize", fontWeight: 600 }}
                />
              }
            />
            <InfoRow label="Status" value={<StatusChip status={data.subscriptionStatus} />} />
            <InfoRow label="Trial Ends" value={formatDate(data.trialEndsAt)} />
            {data.currentPeriodStart && data.currentPeriodEnd && (
              <InfoRow
                label="Current Period"
                value={`${formatDate(data.currentPeriodStart)} — ${formatDate(data.currentPeriodEnd)}`}
              />
            )}
            <InfoRow label="Created" value={formatDate(data.createdAt)} />
            <InfoRow label="Updated" value={formatDate(data.updatedAt)} />

            {/* ─── Usage Counts ─── */}
            {counts && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Usage
                </Typography>
                <Grid container spacing={1.5}>
                  {[
                    { label: "Users", value: counts.users },
                    { label: "RFQs", value: counts.rfqs },
                    { label: "Contacts", value: counts.contacts },
                    { label: "Email Logs", value: counts.emailLogs },
                    { label: "Shipping Lines", value: counts.shippingLines },
                  ].map((item) => (
                    <Grid key={item.label} size={{ xs: 4 }}>
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 1,
                          px: 0.5,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "grey.200",
                        }}
                      >
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                          {item.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {/* ─── Stripe Info (if present) ─── */}
            {(data.stripeSubscriptionId || data.stripeCustomerId) && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Stripe References
                </Typography>
                {data.stripeSubscriptionId && (
                  <InfoRow
                    label="Subscription ID"
                    value={
                      <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                        {data.stripeSubscriptionId}
                      </Typography>
                    }
                  />
                )}
                {data.stripeCustomerId && (
                  <InfoRow
                    label="Customer ID"
                    value={
                      <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                        {data.stripeCustomerId}
                      </Typography>
                    }
                  />
                )}
              </>
            )}

            {/* ─── Company (if nested object present) ─── */}
            {company && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Company
                </Typography>
                <InfoRow label="Name" value={company.name} />
                <InfoRow label="Email" value={company.email} />
                <InfoRow label="Phone" value={company.phone} />
                <InfoRow label="Industry" value={company.industry} />
                <InfoRow label="Size" value={company.size} />
                <InfoRow label="Website" value={company.website} />
                <InfoRow label="Address" value={company.address} />
              </>
            )}

            {/* ─── Payment History (if present) ─── */}
            {payments.length > 0 && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Payment History
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase" }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase" }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase" }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell sx={{ fontSize: "0.8rem" }}>{formatDate(p.createdAt)}</TableCell>
                          <TableCell sx={{ fontSize: "0.8rem", fontWeight: 600 }}>{formatCents(p.amount, p.currency)}</TableCell>
                          <TableCell><PaymentStatusChip status={p.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose} variant="outlined" size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
