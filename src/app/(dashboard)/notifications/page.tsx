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
import NotificationsTable from "@/features/notifications/components/NotificationsTable";
import CreateNotificationModal from "@/features/notifications/components/CreateNotificationModal";
import { useNotifications, useCreateNotification } from "@/features/notifications/hooks";
import { toast } from "react-hot-toast";

export default function NotificationsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        audience: "",
        search: "",
    });

    const { data, loading, error, refetch } = useNotifications(filters);
    const { create, loading: creating } = useCreateNotification();

    const handleCreate = async (payload: any) => {
        try {
            await create(payload);
            toast.success("Notification created successfully");
            refetch();
        } catch (err: any) {
            // Error is already handled by toast in the hook or caught here
            console.error(err);
        }
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} gutterBottom>
                        Notifications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage system-wide and targeted notifications for admins and companies.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshRounded />}
                        onClick={() => refetch()}
                        disabled={loading}
                        sx={{ borderRadius: 2 }}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddRounded />}
                        onClick={() => setIsModalOpen(true)}
                        sx={{ borderRadius: 2 }}
                    >
                        Create Notification
                    </Button>
                </Stack>
            </Stack>

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
                            size="small"
                            label="Search notifications..."
                            placeholder="Filter by title or message"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            label="Audience"
                            value={filters.audience}
                            onChange={(e) => setFilters({ ...filters, audience: e.target.value })}
                        >
                            <MenuItem value="">All Audiences</MenuItem>
                            <MenuItem value="ALL">ALL</MenuItem>
                            <MenuItem value="ADMIN_ONLY">ADMIN ONLY</MenuItem>
                            <MenuItem value="COMPANY_ONLY">COMPANY ONLY</MenuItem>
                            <MenuItem value="SPECIFIC_COMPANY">SPECIFIC COMPANY</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            <NotificationsTable
                notifications={data?.notifications || []}
                total={data?.pagination?.total || 0}
                loading={loading}
                error={error}
            />

            <CreateNotificationModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreate}
                loading={creating}
            />
        </Box>
    );
}
