"use client";

import React from "react";
import {
    Paper,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Skeleton,
    alpha,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    NotificationsRounded,
    InfoRounded,
    DeleteRounded,
    OpenInNewRounded,
} from "@mui/icons-material";
import { Notification } from "../types";

export interface Column {
    key: keyof Notification | "actions";
    label: string;
    render?: (value: any, row: Notification) => React.ReactNode;
}

interface NotificationsTableProps {
    notifications: Notification[];
    total: number;
    loading: boolean;
    error: string | null;
    onDelete?: (id: string) => void;
}

const NotificationsTable: React.FC<NotificationsTableProps> = ({
    notifications,
    total,
    loading,
    error,
    onDelete,
}) => {
    const getStatusColor = (type: string) => {
        switch (type) {
            case "SUCCESS": return "success";
            case "WARNING": return "warning";
            case "ERROR": return "error";
            default: return "info";
        }
    };

    const getAudienceColor = (audience: string) => {
        switch (audience) {
            case "ADMIN_ONLY": return "secondary";
            case "COMPANY_ONLY": return "info";
            case "SPECIFIC_COMPANY": return "warning";
            default: return "primary";
        }
    };

    const columns: Column[] = [
        {
            key: "title",
            label: "Title",
            render: (v, row) => (
                <Box>
                    <Typography variant="body2" fontWeight={600}>{v}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 300, display: "block" }}>
                        {row.message}
                    </Typography>
                </Box>
            ),
        },
        {
            key: "type",
            label: "Type",
            render: (v) => (
                <Chip
                    label={v}
                    size="small"
                    color={getStatusColor(v as string) as any}
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                />
            ),
        },
        {
            key: "audience",
            label: "Audience",
            render: (v) => (
                <Chip
                    label={v.replace(/_/g, " ")}
                    size="small"
                    color={getAudienceColor(v as string) as any}
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                />
            ),
        },
        {
            key: "priority",
            label: "Priority",
            render: (v) => (
                <Typography variant="caption" fontWeight={500}>
                    {v}
                </Typography>
            ),
        },
        {
            key: "createdAt",
            label: "Created At",
            render: (v) => (
                <Typography variant="caption" color="text.secondary">
                    {new Date(v as string).toLocaleDateString()}
                </Typography>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (_, row) => (
                <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => onDelete?.(row.id)}>
                            <DeleteRounded fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    if (loading) {
        return (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "grey.200" }}>
                <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={52} sx={{ mb: 1 }} />
                ))}
            </Paper>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    p: 2.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid",
                    borderColor: "grey.100",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            backgroundColor: alpha("#1976d2", 0.08),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "primary.main",
                        }}
                    >
                        <NotificationsRounded />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Notifications List
                    </Typography>
                </Box>
                <Chip
                    label={`${total} total`}
                    size="small"
                    sx={{ fontWeight: 600, backgroundColor: alpha("#1976d2", 0.08), color: "primary.main" }}
                />
            </Box>

            {error && (
                <Box sx={{ p: 2, bgcolor: alpha("#dc2626", 0.04) }}>
                    <Typography variant="body2" color="error">{error}</Typography>
                </Box>
            )}

            {!error && notifications.length === 0 && (
                <Box sx={{ py: 6, textAlign: "center", color: "text.disabled" }}>
                    <InfoRounded sx={{ fontSize: 36, mb: 1, opacity: 0.5 }} />
                    <Typography variant="body2">No notifications found</Typography>
                </Box>
            )}

            {!error && notifications.length > 0 && (
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.key}
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: "0.75rem",
                                            color: "text.secondary",
                                            textTransform: "uppercase",
                                            bgcolor: "grey.50",
                                        }}
                                    >
                                        {col.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {notifications.map((row) => (
                                <TableRow key={row.id} hover>
                                    {columns.map((col) => (
                                        <TableCell key={col.key} sx={{ fontSize: "0.8125rem", py: 1.5 }}>
                                            {col.render ? col.render(row[col.key as keyof Notification], row) : (row[col.key as keyof Notification] as React.ReactNode) ?? "—"}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
};

export default NotificationsTable;
