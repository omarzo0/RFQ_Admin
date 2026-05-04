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
  List,
  ListItem,
  ListItemText,
  Pagination,
} from "@mui/material";
import type { AdminDetail, AdminActivity, AdminPagination } from "@/features/admin-management/types";

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

function RoleChip({ role }: { role: string }) {
  const r = (role || "").toLowerCase();
  let color: "error" | "primary" | "info" | "default" = "default";
  if (r === "super_admin") color = "error";
  else if (r === "admin") color = "primary";
  else if (r === "support") color = "info";
  return (
    <Chip
      label={(role || "—").replace(/_/g, " ")}
      size="small"
      color={color}
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: "0.75rem", textTransform: "capitalize" }}
    />
  );
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

/* ──────── Component ──────── */

interface Props {
  open: boolean;
  onClose: () => void;
  data: AdminDetail | null;
  loading: boolean;
  error: string | null;
  /* Activity log */
  activities: AdminActivity[];
  activityPagination: AdminPagination | null;
  activityLoading: boolean;
  activityPage: number;
  onActivityPageChange: (page: number) => void;
}

export default function AdminDetailDialog({
  open,
  onClose,
  data,
  loading,
  error,
  activities,
  activityPagination,
  activityLoading,
  activityPage,
  onActivityPageChange,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Admin Details</DialogTitle>
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
            {/* ─── Admin Info ─── */}
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, mt: 0.5 }}>
              Admin Information
            </Typography>
            <InfoRow label="Name" value={`${data.firstName} ${data.lastName}`} />
            <InfoRow label="Email" value={data.email} />
            <InfoRow label="Role" value={<RoleChip role={data.role} />} />
            <InfoRow
              label="Status"
              value={
                <Chip
                  label={data.isActive ? "Active" : "Inactive"}
                  size="small"
                  color={data.isActive ? "success" : "default"}
                  variant="outlined"
                  sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                />
              }
            />
            <InfoRow label="Last Login" value={formatDate(data.lastLogin)} />
            <InfoRow label="Created" value={formatDate(data.createdAt)} />
            <InfoRow label="Updated" value={formatDate(data.updatedAt)} />

            {/* ─── Permissions ─── */}
            {data.permissions && data.permissions.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Permissions ({data.permissions.length})
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {data.permissions.map((p) => (
                    <Chip
                      key={p}
                      label={p.replace(/_/g, " ")}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.75rem", textTransform: "capitalize" }}
                    />
                  ))}
                </Box>
              </>
            )}

            {/* ─── Activity Log ─── */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Recent Activity
            </Typography>
            {activityLoading ? (
              <Box>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="text" height={40} />
                ))}
              </Box>
            ) : activities.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No activity recorded.
              </Typography>
            ) : (
              <>
                <List disablePadding dense>
                  {activities.map((a) => (
                    <ListItem
                      key={a.id}
                      sx={{
                        px: 1.5,
                        py: 0.75,
                        mb: 0.5,
                        borderRadius: 1.5,
                        border: "1px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Chip
                              label={a.action.replace(/_/g, " ")}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontSize: "0.65rem", height: 20, textTransform: "capitalize" }}
                            />
                            <Typography variant="caption" color="text.disabled">
                              {formatDate(a.timestamp)}
                            </Typography>
                          </Box>
                        }
                        secondary={a.description}
                        secondaryTypographyProps={{ sx: { fontSize: "0.8rem", mt: 0.25 } }}
                      />
                    </ListItem>
                  ))}
                </List>
                {activityPagination && activityPagination.totalPages > 1 && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
                    <Pagination
                      count={activityPagination.totalPages}
                      page={activityPage}
                      onChange={(_, p) => onActivityPageChange(p)}
                      size="small"
                      color="primary"
                      shape="rounded"
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
