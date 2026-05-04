"use client";

import React, { useState, useCallback } from "react";
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
  Button,
  Tooltip,
  TablePagination,
} from "@mui/material";
import {
  CloseRounded,
  BusinessRounded,
  PersonRounded,
  AddRounded,
  EditRounded,
  DeleteRounded,
  CheckCircleRounded,
  CancelRounded as CancelIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import type { Company, CompanyUser, CreateCompanyUserPayload, UpdateCompanyUserPayload } from "@/features/companies/types";
import { useCompanyUsers, useCompanyUserMutations } from "@/features/companies/hooks";
import CompanyUserFormDialog from "./CompanyUserFormDialog";
import ConfirmDialog from "./ConfirmDialog";

interface CompanyDetailDialogProps {
  open: boolean;
  onClose: () => void;
  company: Company | null;
  loading: boolean;
  error: string | null;
}

function StatusChip({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  let color: "success" | "warning" | "error" | "info" | "default" = "default";
  if (["active", "healthy"].includes(s)) color = "success";
  else if (["pending", "trial", "processing"].includes(s)) color = "warning";
  else if (["failed", "error", "rejected", "expired", "inactive"].includes(s)) color = "error";
  else if (["info", "new"].includes(s)) color = "info";

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

const CompanyDetailDialog: React.FC<CompanyDetailDialogProps> = ({
  open,
  onClose,
  company,
  loading,
  error,
}) => {
  // User management state
  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState(5);

  const {
    users,
    pagination: userPagination,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useCompanyUsers(
    open && company ? company.id : null,
    userPage + 1,
    userRowsPerPage
  );

  const userMutations = useCompanyUserMutations();

  // User form dialog state
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<CompanyUser | null>(null);

  // User delete confirm state
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<CompanyUser | null>(null);

  const handleAddUser = useCallback(() => {
    setEditingUser(null);
    userMutations.clearError();
    setUserFormOpen(true);
  }, [userMutations]);

  const handleEditUser = useCallback(
    (user: CompanyUser) => {
      setEditingUser(user);
      userMutations.clearError();
      setUserFormOpen(true);
    },
    [userMutations]
  );

  const handleDeleteUser = useCallback((user: CompanyUser) => {
    setDeletingUser(user);
    setDeleteUserOpen(true);
  }, []);

  const handleUserFormSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      if (editingUser) {
        const result = await userMutations.update(editingUser.id, data as UpdateCompanyUserPayload);
        if (result) {
          toast.success("User updated successfully");
          setUserFormOpen(false);
          refetchUsers();
        }
      } else {
        if (!company) return;
        const payload: CreateCompanyUserPayload = {
          ...(data as Omit<CreateCompanyUserPayload, "companyId">),
          companyId: company.id,
        };
        const result = await userMutations.create(payload);
        if (result) {
          toast.success("User created successfully");
          setUserFormOpen(false);
          refetchUsers();
        }
      }
    },
    [editingUser, company, userMutations, refetchUsers]
  );

  const handleConfirmDeleteUser = useCallback(async () => {
    if (!deletingUser) return;
    const ok = await userMutations.remove(deletingUser.id);
    if (ok) {
      toast.success("User deleted successfully");
      setDeleteUserOpen(false);
      setDeletingUser(null);
      refetchUsers();
    }
  }, [deletingUser, userMutations, refetchUsers]);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
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
                {loading ? <Skeleton width={180} /> : company?.name || "Company Details"}
              </Typography>
              {!loading && company && (
                <Typography variant="caption" color="text.secondary">
                  ID: {company.id.slice(-12)}
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
              {Array.from({ length: 8 }).map((_, i) => (
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

          {!loading && company && (
            <>
              {/* Company Info */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Company Information
              </Typography>
              <Paper variant="outlined" sx={{ px: 2, mb: 3, borderRadius: 2 }}>
                <InfoRow label="Name" value={company.name} />
                <InfoRow label="Email" value={company.email} />
                <InfoRow label="Domain" value={company.domain || "—"} />
                <InfoRow label="Phone" value={company.phone || "—"} />
                <InfoRow label="Address" value={company.address || "—"} />
                <InfoRow label="City" value={company.city || "—"} />
                <InfoRow label="Country" value={company.country || "—"} />
                <InfoRow label="Timezone" value={company.timezone || "—"} />
                <InfoRow label="Email Footer" value={company.emailFooter || "—"} />
                <InfoRow label="Default Follow-Up Days" value={company.defaultFollowUpDays ?? "—"} />
                <InfoRow label="Auto Follow-Up" value={company.autoFollowUpEnabled ? "Enabled" : "Disabled"} />
              </Paper>

              {/* Subscription Info */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Subscription
              </Typography>
              <Paper variant="outlined" sx={{ px: 2, mb: 3, borderRadius: 2 }}>
                <InfoRow
                  label="Plan"
                  value={
                    <Chip
                      label={company.subscriptionPlan}
                      size="small"
                      color={company.subscriptionPlan === "trial" ? "warning" : "info"}
                      variant="outlined"
                      sx={{ fontWeight: 500, textTransform: "capitalize" }}
                    />
                  }
                />
                <InfoRow
                  label="Status"
                  value={<StatusChip status={company.subscriptionStatus} />}
                />
                <InfoRow label="Trial Ends" value={company.trialEndsAt ? formatDate(company.trialEndsAt) : "—"} />
                <InfoRow
                  label="Active"
                  value={<StatusChip status={company.isActive ? "Active" : "Inactive"} />}
                />
                <InfoRow label="Created" value={formatDate(company.createdAt)} />
                <InfoRow label="Updated" value={formatDate(company.updatedAt)} />
              </Paper>

              {/* Counts */}
              {company._count && (
                <>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    Related Records
                  </Typography>
                  <Paper variant="outlined" sx={{ px: 2, mb: 3, borderRadius: 2 }}>
                    <InfoRow label="RFQs" value={company._count.rfqs} />
                    <InfoRow label="Contacts" value={company._count.contacts} />
                    <InfoRow label="Shipping Lines" value={company._count.shippingLines} />
                  </Paper>
                </>
              )}

              {/* Quote Stats */}
              {company.quoteStats && (
                <>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    Quote Statistics
                  </Typography>
                  <Paper variant="outlined" sx={{ px: 2, mb: 3, borderRadius: 2 }}>
                    <InfoRow label="Total Quotes" value={company.quoteStats.totalQuotes} />
                    <InfoRow label="Awarded Quotes" value={company.quoteStats.awardedQuotes} />
                    <InfoRow label="Active Quotes" value={company.quoteStats.activeQuotes} />
                  </Paper>
                </>
              )}

              {/* Plan Details */}
              {company.planDetails && (
                <>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    Plan Details — {company.planDetails.name}
                  </Typography>
                  <Paper variant="outlined" sx={{ px: 2, mb: 3, borderRadius: 2 }}>
                    <InfoRow label="Max Users" value={company.planDetails.maxUsers} />
                    <InfoRow label="Max RFQs / Month" value={company.planDetails.maxRFQsPerMonth} />
                    <InfoRow label="Max Contacts" value={company.planDetails.maxContacts} />
                    <InfoRow label="Max Emails / Month" value={company.planDetails.maxEmailSendsPerMonth} />
                  </Paper>
                  {Object.keys(company.planDetails.features).length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 3 }}>
                      {Object.entries(company.planDetails.features).map(([key, enabled]) => (
                        <Chip
                          key={key}
                          icon={
                            enabled ? (
                              <CheckCircleRounded sx={{ fontSize: 14 }} />
                            ) : (
                              <CancelIcon sx={{ fontSize: 14 }} />
                            )
                          }
                          label={key}
                          size="small"
                          variant={enabled ? "filled" : "outlined"}
                          color={enabled ? "success" : "default"}
                          sx={{
                            fontSize: "0.7rem",
                            opacity: enabled ? 1 : 0.5,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </>
              )}

              {/* Users Section */}
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <PersonRounded sx={{ fontSize: 18 }} />
                  Users {userPagination ? `(${userPagination.total})` : ""}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddRounded />}
                  onClick={handleAddUser}
                  sx={{ borderRadius: 2, textTransform: "none", fontSize: "0.8125rem" }}
                >
                  Add User
                </Button>
              </Box>

              {usersError && (
                <Alert severity="error" sx={{ mb: 1.5, borderRadius: 1.5 }}>
                  {usersError}
                </Alert>
              )}

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>
                        Role
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>
                        Status
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usersLoading && (
                      <>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton width={100} /></TableCell>
                            <TableCell><Skeleton width={140} /></TableCell>
                            <TableCell><Skeleton width={60} /></TableCell>
                            <TableCell><Skeleton width={60} /></TableCell>
                            <TableCell align="right"><Skeleton width={60} /></TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                    {!usersLoading && users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: "center", py: 3 }}>
                          <Typography variant="body2" color="text.disabled">
                            No users assigned to this company
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {!usersLoading &&
                      users.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.8125rem" }}>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.role}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontWeight: 500,
                                fontSize: "0.7rem",
                                textTransform: "capitalize",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <StatusChip status={user.isActive ? "Active" : "Inactive"} />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit user">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditUser(user)}
                              >
                                <EditRounded sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete user">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <DeleteRounded sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {userPagination && userPagination.totalPages > 1 && (
                  <TablePagination
                    component="div"
                    count={userPagination.total}
                    page={userPage}
                    onPageChange={(_, p) => setUserPage(p)}
                    rowsPerPage={userRowsPerPage}
                    onRowsPerPageChange={(e) => {
                      setUserRowsPerPage(parseInt(e.target.value, 10));
                      setUserPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                )}
              </TableContainer>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* User Form Dialog */}
      <CompanyUserFormDialog
        open={userFormOpen}
        onClose={() => setUserFormOpen(false)}
        onSubmit={handleUserFormSubmit}
        user={editingUser}
        loading={userMutations.creating || userMutations.updating}
        error={userMutations.error}
      />

      {/* Delete User Confirm Dialog */}
      <ConfirmDialog
        open={deleteUserOpen}
        onClose={() => {
          setDeleteUserOpen(false);
          setDeletingUser(null);
        }}
        onConfirm={handleConfirmDeleteUser}
        title="Delete User"
        message={
          deletingUser
            ? `Are you sure you want to delete "${deletingUser.firstName} ${deletingUser.lastName}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        confirmColor="error"
        loading={userMutations.deleting}
        error={userMutations.error}
      />
    </>
  );
};

export default CompanyDetailDialog;
