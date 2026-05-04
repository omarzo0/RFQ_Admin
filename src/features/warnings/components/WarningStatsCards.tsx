"use client";

import React from "react";
import { Grid, Paper, Box, Typography, alpha } from "@mui/material";
import {
    WarningAmberRounded,
    CheckCircleRounded,
    ReportProblemRounded,
    PollRounded,
} from "@mui/icons-material";
import { WarningStats } from "../types";

interface Props {
    stats: WarningStats | null;
    loading: boolean;
}

export default function WarningStatsCards({ stats, loading }: Props) {
    const statItems = [
        {
            label: "Total Warnings",
            value: stats?.total || 0,
            icon: <PollRounded sx={{ fontSize: 24 }} />,
            color: "#1976d2",
        },
        {
            label: "Active Warnings",
            value: stats?.active || 0,
            icon: <ReportProblemRounded sx={{ fontSize: 24 }} />,
            color: "#d97706",
        },
        {
            label: "Resolved",
            value: stats?.resolved || 0,
            icon: <CheckCircleRounded sx={{ fontSize: 24 }} />,
            color: "#10b981",
        },
        {
            label: "Critical Issues",
            value: stats?.bySeverity?.CRITICAL || 0,
            icon: <WarningAmberRounded sx={{ fontSize: 24 }} />,
            color: "#dc2626",
        },
    ];

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {statItems.map((item, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "grey.200",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: alpha(item.color, 0.1),
                                color: item.color,
                            }}
                        >
                            {item.icon}
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                {item.label}
                            </Typography>
                            <Typography variant="h5" fontWeight={700}>
                                {loading ? "..." : item.value}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
}
