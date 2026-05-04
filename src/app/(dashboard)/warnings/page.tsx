"use client";

import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Grid,
    MenuItem,
    TextField,
    Stack,
    Paper,
} from "@mui/material";
import { AddRounded, RefreshRounded } from "@mui/icons-material";
import WarningsTable from "@/features/warnings/components/WarningsTable";
import CreateWarningModal from "@/features/warnings/components/CreateWarningModal";
import WarningStatsCards from "@/features/warnings/components/WarningStatsCards";
import { useWarnings, useCreateWarning, useWarningActions, useWarningStats } from "@/features/warnings/hooks";
import { toast } from "react-hot-toast";

export default function WarningsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        severity: "",
        category: "",
        isResolved: "",
    });

    const { data, loading, error, refetch: refetchWarnings } = useWarnings(filters);
    const { stats, loading: statsLoading, refetch: refetchStats } = useWarningStats();
    const { create, loading: creating } = useCreateWarning();
    const { resolve, remove, loading: actionLoading } = useWarningActions();

    const handleRefresh = () => {
        refetchWarnings();
        refetchStats();
    };

    const handleCreateWarning = async (payload: any) => {
        try {
            await create(payload);
            toast.success("Warning issued successfully");
            handleRefresh();
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleResolve = async (id: string) => {
        try {
            await resolve(id);
            toast.success("Warning resolved");
            handleRefresh();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this warning? This action cannot be undone.")) return;
        try {
            await remove(id);
            toast.success("Warning deleted");
            handleRefresh();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} gutterBottom>
                        Company Warnings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Issue and manage warnings for companies. Track status, severity, and resolution.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshRounded />}
                        onClick={handleRefresh}
                        disabled={loading || statsLoading}
                        sx={{ borderRadius: 2 }}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddRounded />}
                        onClick={() => setIsModalOpen(true)}
                        sx={{ borderRadius: 2, backgroundColor: "#f59e0b", "&:hover": { backgroundColor: "#d97706" } }}
                    >
                        Issue Warning
                    </Button>
                </Stack>
            </Stack>

            <WarningStatsCards stats={stats} loading={statsLoading} />

            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "grey.200",
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            label="Filter by Severity"
                            value={filters.severity}
                            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                        >
                            <MenuItem value="">All Severities</MenuItem>
                            <MenuItem value="LOW">LOW</MenuItem>
                            <MenuItem value="MODERATE">MODERATE</MenuItem>
                            <MenuItem value="HIGH">HIGH</MenuItem>
                            <MenuItem value="CRITICAL">CRITICAL</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            label="Filter by Status"
                            value={filters.isResolved}
                            onChange={(e) => setFilters({ ...filters, isResolved: e.target.value })}
                        >
                            <MenuItem value="">All Statuses</MenuItem>
                            <MenuItem value="false">ACTIVE</MenuItem>
                            <MenuItem value="true">RESOLVED</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            label="Filter by Category"
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            <MenuItem value="GENERAL">GENERAL</MenuItem>
                            <MenuItem value="PAYMENT">PAYMENT</MenuItem>
                            <MenuItem value="POLICY_VIOLATION">POLICY VIOLATION</MenuItem>
                            <MenuItem value="SECURITY">SECURITY</MenuItem>
                            <MenuItem value="PERFORMANCE">PERFORMANCE</MenuItem>
                            <MenuItem value="COMPLIANCE">COMPLIANCE</MenuItem>
                            <MenuItem value="ABUSE">ABUSE</MenuItem>
                            <MenuItem value="OTHER">OTHER</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            <WarningsTable
                warnings={data?.warnings || []}
                total={data?.pagination?.total || 0}
                loading={loading}
                error={error}
                onResolve={handleResolve}
                onDelete={handleDelete}
            />

            <CreateWarningModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateWarning}
                loading={creating}
            />
        </Box>
    );
}
