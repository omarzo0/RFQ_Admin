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
  Divider,
  Skeleton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  alpha,
} from "@mui/material";
import { CloseRounded, BusinessRounded } from "@mui/icons-material";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { CompanyFinancialResponse } from "@/features/financial/types";

interface CompanyFinancialDialogProps {
  open: boolean;
  onClose: () => void;
  data: CompanyFinancialResponse | null;
  loading: boolean;
  error: string | null;
}

function StatusChip({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  let color: "success" | "warning" | "error" | "info" | "default" = "default";
  if (["active", "succeeded"].includes(s)) color = "success";
  else if (["pending", "trial", "processing"].includes(s)) color = "warning";
  else if (["failed", "error", "cancelled", "inactive"].includes(s))
    color = "error";
  else if (["info", "new"].includes(s)) color = "info";

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
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(d: unknown): string {
  if (!d) return "—";
  try {
    return new Date(d as string).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: "0.8125rem" }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ fontSize: "0.8125rem" }}
        component="div"
      >
        {value}
      </Typography>
    </Box>
  );
}

const CompanyFinancialDialog: React.FC<CompanyFinancialDialogProps> = ({
  open,
  onClose,
  data,
  loading,
  error,
}) => {
  const company = data?.company;
  const fin = data?.financialDetails;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
            <BusinessRounded />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {loading ? (
                <Skeleton width={180} />
              ) : (
                company?.name || "Company Financial Details"
              )}
            </Typography>
            {!loading && company && (
              <Typography variant="caption" color="text.secondary">
                {company.email}
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
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1,
                }}
              >
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
            {/* Company Info */}
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Company
            </Typography>
            <Paper
              variant="outlined"
              sx={{ px: 2, mb: 3, borderRadius: 2 }}
            >
              <InfoRow label="Plan" value={<StatusChip status={company?.subscriptionPlan || ""} />} />
              <InfoRow label="Status" value={<StatusChip status={company?.subscriptionStatus || ""} />} />
            </Paper>

            {/* Financial Info */}
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Financial Overview
            </Typography>
            <Paper
              variant="outlined"
              sx={{ px: 2, mb: 3, borderRadius: 2 }}
            >
              <InfoRow
                label="Total Revenue"
                value={formatCurrency(fin?.totalRevenue ?? 0, fin?.currency)}
              />
              <InfoRow
                label="Monthly Revenue"
                value={formatCurrency(fin?.monthlyRevenue ?? 0, fin?.currency)}
              />
              <InfoRow
                label="Total Transactions"
                value={fin?.totalTransactions ?? 0}
              />
              <InfoRow
                label="Successful"
                value={fin?.successfulTransactions ?? 0}
              />
              <InfoRow
                label="Failed"
                value={fin?.failedTransactions ?? 0}
              />
              <InfoRow
                label="Avg Transaction"
                value={formatCurrency(
                  fin?.averageTransactionValue ?? 0,
                  fin?.currency
                )}
              />
              <InfoRow
                label="Last Payment"
                value={formatDate(fin?.lastPaymentDate)}
              />
            </Paper>

            {/* Revenue Trend Chart */}
            {data.revenueTrend && data.revenueTrend.length > 0 && (
              <>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ mb: 1 }}
                >
                  Revenue Trend
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, mb: 3, borderRadius: 2 }}
                >
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data.revenueTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11 }}
                        stroke="#999"
                      />
                      <YAxis tick={{ fontSize: 11 }} stroke="#999" />
                      <Tooltip
                        formatter={(value) => [formatCurrency(Number(value)), ""]}
                        contentStyle={{
                          borderRadius: 8,
                          border: "1px solid #e0e0e0",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1976d2"
                        fill={alpha("#1976d2", 0.1)}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Paper>
              </>
            )}

            {/* Recent Transactions */}
            {data.transactions && data.transactions.length > 0 && (
              <>
                <Divider sx={{ mb: 2 }} />
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ mb: 1 }}
                >
                  Recent Transactions ({data.transactions.length})
                </Typography>
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                          }}
                        >
                          Description
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                          }}
                        >
                          Amount
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                          }}
                        >
                          Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.transactions.map((tx) => (
                        <TableRow key={tx.id} hover>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>
                            {tx.description}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                            {formatCurrency(tx.amount, tx.currency)}
                          </TableCell>
                          <TableCell>
                            <StatusChip status={tx.status} />
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>
                            {formatDate(tx.createdAt)}
                          </TableCell>
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
    </Dialog>
  );
};

export default CompanyFinancialDialog;
