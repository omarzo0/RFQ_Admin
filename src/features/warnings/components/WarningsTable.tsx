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
    WarningAmberRounded,
    InfoRounded,
    DeleteRounded,
    CheckCircleRounded,
} from "@mui/icons-material";
import { CompanyWarning } from "../types";

export interface Column {
    key: keyof CompanyWarning | "actions";
    label: string;
    render?: (value: any, row: CompanyWarning) => React.ReactNode;
}

interface WarningsTableProps {
    warnings: CompanyWarning[];
    total: number;
    loading: boolean;
    error: string | null;
    onResolve?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const WarningsTable: React.FC<WarningsTableProps> = ({
    warnings,
    total,
    loading,
    error,
    onResolve,
    onDelete,
}) => {
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "CRITICAL": return "error";
            case "HIGH": return "warning";
            case "MODERATE": return "info";
            case "LOW": return "success";
            default: return "default";
        }
    };

    const getCategoryLabel = (category: string) => {
        return category.replace(/_/g, " ");
    };

    const columns: Column[] = [
        {
            key: "company",
            label: "Company",
            render: (v) => (
                <Box>
                    <Typography variant="body2" fontWeight={600}>{v?.name || "Unknown"}</Typography>
                    <Typography variant="caption" color="text.secondary">{v?.email || ""}</Typography>
                </Box>
            ),
        },
        {
            key: "title",
            label: "Warning",
            render: (v, row) => (
                <Box>
                    <Typography variant="body2" fontWeight={600}>{v}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: "block" }}>
                        {row.reason}
                    </Typography>
                </Box>
            ),
        },
        {
            key: "severity",
            label: "Severity",
            render: (v) => (
                <Chip
                    label={v}
                    size="small"
                    color={getSeverityColor(v as string) as any}
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                />
            ),
        },
        {
            key: "category",
            label: "Category",
            render: (v) => (
                <Typography variant="caption" fontWeight={500}>
                    {getCategoryLabel(v)}
                </Typography>
            ),
        },
        {
            key: "isResolved",
            label: "Status",
            render: (v) => (
                <Chip
                    label={v ? "RESOLVED" : "ACTIVE"}
                    size="small"
                    color={v ? "success" : "warning"}
                    sx={{ fontWeight: 700, fontSize: "0.65rem" }}
                />
            ),
        },
        {
            key: "issuedAt",
            label: "Issued At",
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
                    {!row.isResolved && (
                        <Tooltip title="Resolve Warning">
                            <IconButton
                                size="small"
                                color="success"
                                onClick={() => onResolve?.(row.id)}
                            >
                                <CheckCircleRounded fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Delete Warning">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete?.(row.id)}
                        >
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
                            backgroundColor: alpha("#f59e0b", 0.08),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#d97706",
                        }}
                    >
                        <WarningAmberRounded />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Company Warnings List
                    </Typography>
                </Box>
                <Chip
                    label={`${total} total`}
                    size="small"
                    sx={{ fontWeight: 600, backgroundColor: alpha("#f59e0b", 0.08), color: "#d97706" }}
                />
            </Box>

            {error && (
                <Box sx={{ p: 2, bgcolor: alpha("#dc2626", 0.04) }}>
                    <Typography variant="body2" color="error">{error}</Typography>
                </Box>
            )}

            {!error && warnings.length === 0 && (
                <Box sx={{ py: 6, textAlign: "center", color: "text.disabled" }}>
                    <InfoRounded sx={{ fontSize: 36, mb: 1, opacity: 0.5 }} />
                    <Typography variant="body2">No warnings found</Typography>
                </Box>
            )}

            {!error && warnings.length > 0 && (
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
                            {warnings.map((row) => (
                                <TableRow key={row.id} hover>
                                    {columns.map((col) => (
                                        <TableCell key={col.key} sx={{ fontSize: "0.8125rem", py: 1.5 }}>
                                            {col.render ? col.render(row[col.key as keyof CompanyWarning], row) : (row[col.key as keyof CompanyWarning] as React.ReactNode) ?? "—"}
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

export default WarningsTable;
