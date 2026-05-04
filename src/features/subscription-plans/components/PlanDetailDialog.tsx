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
  Grid,
  alpha,
} from "@mui/material";
import {
  CheckCircleRounded,
  CancelRounded,
} from "@mui/icons-material";
import type { PlanDetail, ResolvedFeature } from "@/features/subscription-plans/types";

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

const CATEGORY_LABELS: Record<string, string> = {
  core: "Core",
  email: "Email",
  analytics: "Analytics",
  automation: "Automation",
  ai: "AI",
  advanced: "Advanced",
};

const CATEGORY_COLORS: Record<string, string> = {
  core: "#1976d2",
  email: "#0891b2",
  analytics: "#7c3aed",
  automation: "#f59e0b",
  ai: "#ec4899",
  advanced: "#16a34a",
};

interface Props {
  open: boolean;
  onClose: () => void;
  data: PlanDetail | null;
  loading: boolean;
  error: string | null;
}

export default function PlanDetailDialog({ open, onClose, data, loading, error }: Props) {
  const subs = data?.subscribers;

  // Group resolvedFeatures by category
  const grouped = React.useMemo(() => {
    if (!data?.resolvedFeatures) return {};
    const map: Record<string, ResolvedFeature[]> = {};
    data.resolvedFeatures.forEach((f) => {
      if (!map[f.category]) map[f.category] = [];
      map[f.category].push(f);
    });
    return map;
  }, [data?.resolvedFeatures]);

  const categoryOrder = ["core", "email", "analytics", "automation", "ai", "advanced"];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Plan Details</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: "70vh" }}>
        {loading && (
          <Box>
            {Array.from({ length: 6 }).map((_, i) => (
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
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, mt: 0.5 }}>
              Plan Info
            </Typography>
            <InfoRow label="Name" value={data.name} />
            <InfoRow label="Description" value={data.description} />
            <InfoRow
              label="Monthly Price"
              value={formatCents(Number(data.priceMonthly), data.currency)}
            />
            <InfoRow
              label="Yearly Price"
              value={formatCents(Number(data.priceYearly), data.currency)}
            />
            <InfoRow label="Currency" value={data.currency} />
            <InfoRow
              label="Status"
              value={
                <Chip
                  label={data.isActive ? "Active" : "Inactive"}
                  size="small"
                  color={data.isActive ? "success" : "default"}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              }
            />
            {data.isDefault && (
              <InfoRow
                label="Default Plan"
                value={<Chip label="Default" size="small" color="info" variant="outlined" sx={{ fontWeight: 600 }} />}
              />
            )}
            <InfoRow label="Created" value={formatDate(data.createdAt)} />
            <InfoRow label="Updated" value={formatDate(data.updatedAt)} />

            {/* Usage Limits */}
            {(data.maxUsers || data.maxRFQsPerMonth || data.maxContacts || data.maxEmailSendsPerMonth) && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Usage Limits
                </Typography>
                {data.maxUsers != null && <InfoRow label="Max Users" value={data.maxUsers} />}
                {data.maxRFQsPerMonth != null && <InfoRow label="Max RFQs / Month" value={data.maxRFQsPerMonth} />}
                {data.maxContacts != null && <InfoRow label="Max Contacts" value={data.maxContacts} />}
                {data.maxEmailSendsPerMonth != null && <InfoRow label="Max Emails / Month" value={data.maxEmailSendsPerMonth} />}
              </>
            )}

            {/* Resolved Features */}
            {data.resolvedFeatures && data.resolvedFeatures.length > 0 && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Features
                </Typography>
                {categoryOrder
                  .filter((cat) => grouped[cat] && grouped[cat].length > 0)
                  .map((cat) => (
                    <Box key={cat} sx={{ mb: 1.5 }}>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        sx={{
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          color: CATEGORY_COLORS[cat] || "text.secondary",
                          mb: 0.5,
                          display: "block",
                        }}
                      >
                        {CATEGORY_LABELS[cat] || cat}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                        {grouped[cat].map((feat) => (
                          <Chip
                            key={feat.key}
                            icon={
                              feat.enabled ? (
                                <CheckCircleRounded sx={{ fontSize: 16 }} />
                              ) : (
                                <CancelRounded sx={{ fontSize: 16 }} />
                              )
                            }
                            label={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <span>{feat.label}</span>
                                {!feat.explicitlySet && (
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    sx={{ fontSize: "0.6rem", opacity: 0.6 }}
                                  >
                                    (default)
                                  </Typography>
                                )}
                              </Box>
                            }
                            size="small"
                            variant={feat.enabled ? "filled" : "outlined"}
                            color={feat.enabled ? "success" : "default"}
                            sx={{
                              fontSize: "0.75rem",
                              opacity: feat.enabled ? 1 : 0.6,
                              backgroundColor: feat.enabled
                                ? alpha(CATEGORY_COLORS[cat] || "#16a34a", 0.1)
                                : undefined,
                              color: feat.enabled
                                ? CATEGORY_COLORS[cat] || "success.main"
                                : "text.disabled",
                              borderColor: feat.enabled
                                ? alpha(CATEGORY_COLORS[cat] || "#16a34a", 0.3)
                                : undefined,
                              "& .MuiChip-icon": {
                                color: feat.enabled
                                  ? CATEGORY_COLORS[cat] || "success.main"
                                  : "text.disabled",
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
              </>
            )}

            {/* Stripe */}
            {(data.stripePriceId || data.stripeProductId) && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Stripe
                </Typography>
                {data.stripePriceId && (
                  <InfoRow
                    label="Price ID"
                    value={
                      <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                        {data.stripePriceId}
                      </Typography>
                    }
                  />
                )}
                {data.stripeProductId && (
                  <InfoRow
                    label="Product ID"
                    value={
                      <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                        {data.stripeProductId}
                      </Typography>
                    }
                  />
                )}
              </>
            )}

            {/* Subscribers count */}
            {subs && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Subscribers
                </Typography>
                <Grid container spacing={1.5}>
                  {[
                    { label: "Total", value: subs.total, color: "primary.main" },
                    { label: "Active", value: subs.active, color: "success.main" },
                    { label: "Trial", value: subs.trial, color: "warning.main" },
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
                        <Typography variant="h6" fontWeight={700} color={item.color}>
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
