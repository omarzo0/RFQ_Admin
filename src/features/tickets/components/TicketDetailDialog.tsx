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
  ListItemIcon,
  Avatar,
} from "@mui/material";
import {
  CommentRounded,
  AttachFileRounded,
  PersonRounded,
  LockRounded,
} from "@mui/icons-material";
import type { TicketDetail } from "@/features/tickets/types";

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
  const s = (status || "").toLowerCase();
  let color: "success" | "warning" | "error" | "info" | "default" = "default";
  if (s === "open") color = "info";
  else if (s === "in_progress") color = "warning";
  else if (s === "resolved") color = "success";
  else if (s === "closed") color = "default";
  return (
    <Chip
      label={(status || "—").replace(/_/g, " ")}
      size="small"
      color={color}
      variant="outlined"
      sx={{ fontWeight: 500, fontSize: "0.75rem", textTransform: "capitalize" }}
    />
  );
}

function PriorityChip({ priority }: { priority: string }) {
  const p = (priority || "").toLowerCase();
  let color: "error" | "warning" | "info" | "default" = "default";
  if (p === "critical") color = "error";
  else if (p === "high") color = "error";
  else if (p === "medium") color = "warning";
  else if (p === "low") color = "info";
  return (
    <Chip
      label={priority || "—"}
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ──────── Component ──────── */

interface Props {
  open: boolean;
  onClose: () => void;
  data: TicketDetail | null;
  loading: boolean;
  error: string | null;
}

export default function TicketDetailDialog({ open, onClose, data, loading, error }: Props) {
  const ticket = data?.ticket;
  const comments = data?.comments ?? [];
  const attachments = data?.attachments ?? [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>Ticket Details</DialogTitle>
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

        {!loading && !error && ticket && (
          <>
            {/* ─── Ticket Info ─── */}
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, mt: 0.5 }}>
              Ticket Information
            </Typography>
            <InfoRow label="Subject" value={ticket.subject} />
            <InfoRow label="Status" value={<StatusChip status={ticket.status} />} />
            <InfoRow label="Priority" value={<PriorityChip priority={ticket.priority} />} />
            <InfoRow label="Category" value={ticket.category} />
            <InfoRow label="Company" value={ticket.companyName} />
            <InfoRow label="Created By" value={ticket.createdByName} />
            <InfoRow label="Assigned To" value={ticket.assignedAdminName || "Unassigned"} />
            <InfoRow label="Created" value={formatDate(ticket.createdAt)} />
            <InfoRow label="Updated" value={formatDate(ticket.updatedAt)} />
            {ticket.resolvedAt && <InfoRow label="Resolved" value={formatDate(ticket.resolvedAt)} />}

            {/* ─── Description ─── */}
            {ticket.description && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Description
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: "pre-wrap", fontSize: "0.8125rem" }}
                >
                  {ticket.description}
                </Typography>
              </>
            )}

            {/* ─── Comments ─── */}
            {comments.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Comments ({comments.length})
                </Typography>
                <List disablePadding dense>
                  {comments.map((c) => (
                    <ListItem
                      key={c.id}
                      sx={{
                        px: 1.5,
                        py: 1,
                        mb: 0.5,
                        borderRadius: 2,
                        bgcolor: c.isInternal ? "action.hover" : "transparent",
                        border: "1px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {c.isInternal ? (
                          <LockRounded sx={{ fontSize: 18, color: "warning.main" }} />
                        ) : (
                          <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                            {(c.authorName || "?")[0]}
                          </Avatar>
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.8125rem" }}>
                              {c.authorName}
                            </Typography>
                            {c.isInternal && (
                              <Chip label="Internal" size="small" color="warning" variant="outlined" sx={{ fontSize: "0.65rem", height: 18 }} />
                            )}
                            <Typography variant="caption" color="text.disabled">
                              {formatDate(c.createdAt)}
                            </Typography>
                          </Box>
                        }
                        secondary={c.content}
                        secondaryTypographyProps={{ sx: { fontSize: "0.8rem", mt: 0.25 } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {/* ─── Attachments ─── */}
            {attachments.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Attachments ({attachments.length})
                </Typography>
                <List disablePadding dense>
                  {attachments.map((a) => (
                    <ListItem key={a.id} sx={{ px: 1.5, py: 0.75, borderRadius: 1.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <AttachFileRounded sx={{ fontSize: 18, color: "text.secondary" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={a.filename}
                        secondary={`${formatFileSize(a.size)} · ${formatDate(a.uploadedAt)}`}
                        primaryTypographyProps={{ variant: "body2", fontWeight: 500, fontSize: "0.8125rem" }}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                    </ListItem>
                  ))}
                </List>
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
