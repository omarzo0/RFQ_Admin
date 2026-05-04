"use client";

import React from "react";
import {
  Paper,
  Typography,
  Box,
  Skeleton,
  Alert,
  alpha,
} from "@mui/material";

interface ManagementCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  data: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") {
    // If it looks like a percentage (has a decimal or key name suggests it)
    return value.toLocaleString();
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return value || "—";
  if (Array.isArray(value)) return `${value.length} items`;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function formatLabel(key: string): string {
  // camelCase → Title Case with spaces
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

const ManagementCard: React.FC<ManagementCardProps> = ({
  title,
  icon,
  color,
  data,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
          height: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Skeleton variant="rounded" width={36} height={36} />
          <Skeleton variant="text" width={120} height={24} />
        </Box>
        {Array.from({ length: 5 }).map((_, i) => (
          <Box key={i} sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
            <Skeleton variant="text" width={100} height={20} />
            <Skeleton variant="text" width={60} height={20} />
          </Box>
        ))}
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
          height: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              backgroundColor: alpha(color, 0.08),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color,
            }}
          >
            {icon}
          </Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: "0.8125rem" }}>
          {error}
        </Alert>
      </Paper>
    );
  }

  // Extract entries from data, filtering out nested objects/arrays for clean display
  const entries = data
    ? Object.entries(data).filter(
        ([, v]) => typeof v !== "object" || v === null
      )
    : [];

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
        "&:hover": {
          boxShadow: `0 4px 20px ${alpha(color, 0.1)}`,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            backgroundColor: alpha(color, 0.08),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          {icon}
        </Box>
        <Typography variant="subtitle2" fontWeight={600}>
          {title}
        </Typography>
      </Box>

      {/* Data rows */}
      {entries.length === 0 ? (
        <Typography variant="body2" color="text.disabled" sx={{ textAlign: "center", py: 2 }}>
          No data available
        </Typography>
      ) : (
        entries.map(([key, value]) => (
          <Box
            key={key}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 0.85,
              borderBottom: "1px solid",
              borderColor: "grey.100",
              "&:last-child": { borderBottom: 0 },
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>
              {formatLabel(key)}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.8125rem" }}>
              {formatValue(value)}
            </Typography>
          </Box>
        ))
      )}
    </Paper>
  );
};

export default ManagementCard;
