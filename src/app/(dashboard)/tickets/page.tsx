"use client";

import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Skeleton,
  Alert,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Pagination,
  alpha,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  ConfirmationNumberRounded,
  RefreshRounded,
  VisibilityRounded,
  SearchRounded,
  EditRounded,
  PersonAddRounded,
  CommentRounded,
  CheckCircleRounded,
  CancelRounded,
  BarChartRounded,
  PriorityHighRounded,
  AccessTimeRounded,
  AssignmentTurnedInRounded,
  CategoryRounded,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  useTickets,
  useTicketDetail,
  useUpdateTicketStatus,
  useAssignTicket,
  useAddComment,
  useResolveTicket,
  useCloseTicket,
  useTicketStatistics,
} from "@/features/tickets/hooks";
import TicketDetailDialog from "@/features/tickets/components/TicketDetailDialog";
import UpdateStatusDialog from "@/features/tickets/components/UpdateStatusDialog";
import AssignTicketDialog from "@/features/tickets/components/AssignTicketDialog";
import AddCommentDialog from "@/features/tickets/components/AddCommentDialog";
import ResolveTicketDialog from "@/features/tickets/components/ResolveTicketDialog";
import CloseTicketDialog from "@/features/tickets/components/CloseTicketDialog";
import toast from "react-hot-toast";

/* ──────────────── Helpers ──────────────── */

const PIE_COLORS = ["#16a34a", "#1976d2", "#f59e0b", "#ef4444", "#7c3aed", "#ec4899", "#0891b2", "#14b8a6"];

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

function formatHours(minutes: number): string {
  if (!minutes && minutes !== 0) return "—";
  const hrs = Number(minutes) / 60;
  if (hrs < 1) return `${Number(minutes).toFixed(0)}m`;
  return `${hrs.toFixed(1)}h`;
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

/* ──────── Skeleton helpers ──────── */

const StatSkeleton = () => (
  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
    <Skeleton variant="rounded" width={44} height={44} sx={{ mb: 2 }} />
    <Skeleton variant="text" width={80} height={36} />
    <Skeleton variant="text" width={120} height={20} />
  </Paper>
);

const ChartSkeleton = () => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
    <Skeleton variant="text" width={140} height={28} sx={{ mb: 2 }} />
    <Skeleton variant="rounded" height={280} />
  </Paper>
);

/* ──────── Stat Card ──────── */

function StatCard({
  title,
  value,
  icon,
  color,
  loading,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
  subtitle?: string;
}) {
  if (loading) return <StatSkeleton />;
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
        height: "100%",
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: `0 4px 20px ${alpha(color, 0.12)}` },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            backgroundColor: alpha(color, 0.08),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.disabled">
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
}

/* ──────── Tab Panel ──────── */

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  if (value !== index) return null;
  return <Box sx={{ pt: 3 }}>{children}</Box>;
}

/* ═══════════════════════════════════════════
   TAB 0 — TICKETS LIST  (API 1–7)
   ═══════════════════════════════════════════ */

function TicketsListTab() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const limit = 20;

  const {
    tickets,
    pagination,
    summary,
    loading,
    error,
    refetch,
  } = useTickets({
    page,
    limit,
    status: status || undefined,
    priority: priority || undefined,
    category: category || undefined,
    search: search || undefined,
  });

  /* Detail */
  const [viewId, setViewId] = useState<string | null>(null);
  const { data: detail, loading: detailLoading, error: detailError, refetch: refetchDetail } = useTicketDetail(viewId);

  /* Update Status */
  const [statusTarget, setStatusTarget] = useState<{ id: string; status: string } | null>(null);
  const { update: updateStatus, loading: updatingStatus } = useUpdateTicketStatus();

  /* Assign */
  const [assignTarget, setAssignTarget] = useState<string | null>(null);
  const { assign, loading: assigning } = useAssignTicket();

  /* Add Comment */
  const [commentTarget, setCommentTarget] = useState<string | null>(null);
  const { add: addComment, loading: addingComment } = useAddComment();

  /* Resolve */
  const [resolveTarget, setResolveTarget] = useState<string | null>(null);
  const { resolve, loading: resolving } = useResolveTicket();

  /* Close */
  const [closeTarget, setCloseTarget] = useState<{ id: string; subject: string } | null>(null);
  const { close, loading: closing } = useCloseTicket();

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleUpdateStatus = useCallback(
    async (data: { status: string; comment?: string }) => {
      if (!statusTarget) return false;
      const result = await updateStatus(statusTarget.id, data);
      if (result) {
        toast.success("Status updated successfully");
        refetch();
        return true;
      }
      toast.error("Failed to update status");
      return false;
    },
    [statusTarget, updateStatus, refetch]
  );

  const handleAssign = useCallback(
    async (data: { assignedTo: string; comment?: string }) => {
      if (!assignTarget) return false;
      const result = await assign(assignTarget, data);
      if (result) {
        toast.success("Ticket assigned successfully");
        refetch();
        return true;
      }
      toast.error("Failed to assign ticket");
      return false;
    },
    [assignTarget, assign, refetch]
  );

  const handleAddComment = useCallback(
    async (data: { content: string; isInternal: boolean }) => {
      if (!commentTarget) return false;
      const result = await addComment(commentTarget, data);
      if (result) {
        toast.success("Comment added successfully");
        refetchDetail();
        return true;
      }
      toast.error("Failed to add comment");
      return false;
    },
    [commentTarget, addComment, refetchDetail]
  );

  const handleResolve = useCallback(
    async (data: { resolution: string; comment?: string }) => {
      if (!resolveTarget) return false;
      const result = await resolve(resolveTarget, data);
      if (result) {
        toast.success("Ticket resolved successfully");
        refetch();
        return true;
      }
      toast.error("Failed to resolve ticket");
      return false;
    },
    [resolveTarget, resolve, refetch]
  );

  const handleClose = useCallback(
    async (data: { comment?: string }) => {
      if (!closeTarget) return false;
      const result = await close(closeTarget.id, data);
      if (result) {
        toast.success("Ticket closed successfully");
        refetch();
        return true;
      }
      toast.error("Failed to close ticket");
      return false;
    },
    [closeTarget, close, refetch]
  );

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, sm: 4, lg: 2.4 }}>
            <StatCard title="Total" value={summary.total} icon={<ConfirmationNumberRounded />} color="#1976d2" loading={loading} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, lg: 2.4 }}>
            <StatCard title="Open" value={summary.open} icon={<ConfirmationNumberRounded />} color="#0288d1" loading={loading} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, lg: 2.4 }}>
            <StatCard title="In Progress" value={summary.inProgress} icon={<AccessTimeRounded />} color="#f59e0b" loading={loading} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, lg: 2.4 }}>
            <StatCard title="Resolved" value={summary.resolved} icon={<CheckCircleRounded />} color="#16a34a" loading={loading} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, lg: 2.4 }}>
            <StatCard title="Closed" value={summary.closed} icon={<CancelRounded />} color="#64748b" loading={loading} />
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid", borderColor: "grey.200", mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search tickets…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            sx={{ minWidth: 220, flex: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ fontSize: 20, color: "text.disabled" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Priority</InputLabel>
            <Select value={priority} label="Priority" onChange={(e) => { setPriority(e.target.value); setPage(1); }}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="technical">Technical</MenuItem>
              <MenuItem value="billing">Billing</MenuItem>
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="feature_request">Feature Request</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={refetch}>
              <RefreshRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Table */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
        {loading ? (
          <Box>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 0.5, borderRadius: 1 }} />
            ))}
          </Box>
        ) : tickets.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
            No tickets found.
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Assigned To</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.8rem" }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map((t) => (
                    <TableRow key={t.id} hover>
                      <TableCell sx={{ fontSize: "0.8125rem", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t.subject}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8125rem" }}>{t.companyName}</TableCell>
                      <TableCell><StatusChip status={t.status} /></TableCell>
                      <TableCell><PriorityChip priority={t.priority} /></TableCell>
                      <TableCell sx={{ fontSize: "0.8125rem", textTransform: "capitalize" }}>
                        {(t.category || "—").replace(/_/g, " ")}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8125rem" }}>
                        {t.assignedAdminName || <Typography variant="caption" color="text.disabled">Unassigned</Typography>}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8125rem" }}>{formatDate(t.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => setViewId(t.id)}>
                              <VisibilityRounded sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Update Status">
                            <IconButton size="small" onClick={() => setStatusTarget({ id: t.id, status: t.status })}>
                              <EditRounded sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Assign">
                            <IconButton size="small" onClick={() => setAssignTarget(t.id)}>
                              <PersonAddRounded sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Add Comment">
                            <IconButton size="small" onClick={() => setCommentTarget(t.id)}>
                              <CommentRounded sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          {t.status !== "resolved" && t.status !== "closed" && (
                            <Tooltip title="Resolve">
                              <IconButton size="small" color="success" onClick={() => setResolveTarget(t.id)}>
                                <CheckCircleRounded sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {t.status !== "closed" && (
                            <Tooltip title="Close">
                              <IconButton size="small" color="error" onClick={() => setCloseTarget({ id: t.id, subject: t.subject })}>
                                <CancelRounded sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {pagination && pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={(_, p) => setPage(p)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Dialogs */}
      <TicketDetailDialog
        open={!!viewId}
        onClose={() => setViewId(null)}
        data={detail}
        loading={detailLoading}
        error={detailError}
      />
      <UpdateStatusDialog
        open={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        onSubmit={handleUpdateStatus}
        loading={updatingStatus}
        currentStatus={statusTarget?.status}
      />
      <AssignTicketDialog
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        onSubmit={handleAssign}
        loading={assigning}
      />
      <AddCommentDialog
        open={!!commentTarget}
        onClose={() => setCommentTarget(null)}
        onSubmit={handleAddComment}
        loading={addingComment}
      />
      <ResolveTicketDialog
        open={!!resolveTarget}
        onClose={() => setResolveTarget(null)}
        onSubmit={handleResolve}
        loading={resolving}
      />
      <CloseTicketDialog
        open={!!closeTarget}
        onClose={() => setCloseTarget(null)}
        onSubmit={handleClose}
        loading={closing}
        ticketSubject={closeTarget?.subject}
      />
    </>
  );
}

/* ═══════════════════════════════════════════
   TAB 1 — STATISTICS  (API 8)
   ═══════════════════════════════════════════ */

function StatisticsTab() {
  const { data, loading, error, refetch } = useTicketStatistics();

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  const overview = data?.overview;
  const responseTime = data?.responseTime;
  const resolutionTime = data?.resolutionTime;
  const byPriority = data?.byPriority ?? [];
  const byCategory = data?.byCategory ?? [];

  return (
    <>
      {/* Overview Cards */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={refetch}>
            <RefreshRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 4, lg: 2.4 }}>
          <StatCard title="Total Tickets" value={overview?.total ?? 0} icon={<ConfirmationNumberRounded />} color="#1976d2" loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2.4 }}>
          <StatCard title="Open" value={overview?.open ?? 0} icon={<ConfirmationNumberRounded />} color="#0288d1" loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2.4 }}>
          <StatCard title="In Progress" value={overview?.inProgress ?? 0} icon={<AccessTimeRounded />} color="#f59e0b" loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2.4 }}>
          <StatCard title="Resolved" value={overview?.resolved ?? 0} icon={<CheckCircleRounded />} color="#16a34a" loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2.4 }}>
          <StatCard title="Closed" value={overview?.closed ?? 0} icon={<CancelRounded />} color="#64748b" loading={loading} />
        </Grid>
      </Grid>

      {/* Time Metrics */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Response Time
              </Typography>
              <Box sx={{ display: "flex", gap: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Average</Typography>
                  <Typography variant="h6" fontWeight={700}>{formatHours(responseTime?.average ?? 0)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Median</Typography>
                  <Typography variant="h6" fontWeight={700}>{formatHours(responseTime?.median ?? 0)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Target</Typography>
                  <Typography variant="h6" fontWeight={700}>{formatHours(responseTime?.target ?? 0)}</Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Resolution Time
              </Typography>
              <Box sx={{ display: "flex", gap: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Average</Typography>
                  <Typography variant="h6" fontWeight={700}>{formatHours(resolutionTime?.average ?? 0)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Median</Typography>
                  <Typography variant="h6" fontWeight={700}>{formatHours(resolutionTime?.median ?? 0)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Target</Typography>
                  <Typography variant="h6" fontWeight={700}>{formatHours(resolutionTime?.target ?? 0)}</Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2.5}>
        {/* By Priority — Bar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Tickets by Priority
              </Typography>
              {byPriority.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  No data
                </Typography>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={byPriority}>
                    <XAxis dataKey="priority" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <RTooltip />
                    <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {/* Table below chart */}
              {byPriority.length > 0 && (
                <TableContainer sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Priority</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }} align="right">Count</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }} align="right">Avg Resolution</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {byPriority.map((p) => (
                        <TableRow key={p.priority}>
                          <TableCell sx={{ fontSize: "0.8rem", textTransform: "capitalize" }}>{p.priority}</TableCell>
                          <TableCell sx={{ fontSize: "0.8rem" }} align="right">{p.count}</TableCell>
                          <TableCell sx={{ fontSize: "0.8rem" }} align="right">{formatHours(p.averageResolutionTime)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          )}
        </Grid>

        {/* By Category — Pie Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Tickets by Category
              </Typography>
              {byCategory.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  No data
                </Typography>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={byCategory}
                        dataKey="count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }: { name?: string; percent?: number }) =>
                          `${(name ?? "").replace(/_/g, " ")} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                      >
                        {byCategory.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend Table */}
                  <TableContainer sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }}>Category</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }} align="right">Count</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem" }} align="right">%</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {byCategory.map((c, i) => (
                          <TableRow key={c.category}>
                            <TableCell sx={{ fontSize: "0.8rem" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                <span style={{ textTransform: "capitalize" }}>{(c.category || "").replace(/_/g, " ")}</span>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ fontSize: "0.8rem" }} align="right">{c.count}</TableCell>
                            <TableCell sx={{ fontSize: "0.8rem" }} align="right">{Number(c.percentage).toFixed(1)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function TicketsPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          Tickets
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage support tickets, assign staff, and track resolution metrics.
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 0,
          "& .MuiTab-root": { fontWeight: 600, textTransform: "none", minHeight: 44 },
        }}
      >
        <Tab icon={<ConfirmationNumberRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Tickets" />
        <Tab icon={<BarChartRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Statistics" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <TicketsListTab />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <StatisticsTab />
      </TabPanel>
    </Box>
  );
}
