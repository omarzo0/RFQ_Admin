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
} from "@mui/material";
import { InfoRounded } from "@mui/icons-material";

export interface Column {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  columns: Column[];
  data: Record<string, unknown>[];
  total: number;
  loading: boolean;
  error: string | null;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  icon,
  color,
  columns,
  data,
  total,
  loading,
  error,
}) => {
  if (loading) {
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
        <Box sx={{ p: 2.5 }}>
          <Skeleton variant="text" width={160} height={28} />
        </Box>
        <Box sx={{ px: 2.5, pb: 2.5 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              height={48}
              sx={{ mb: 0.5, borderRadius: 1 }}
            />
          ))}
        </Box>
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
      {/* Header */}
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
              backgroundColor: alpha(color, 0.08),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color,
            }}
          >
            {icon}
          </Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Chip
          label={`${total} total`}
          size="small"
          sx={{
            fontWeight: 600,
            backgroundColor: alpha(color, 0.08),
            color,
          }}
        />
      </Box>

      {/* Error */}
      {error && (
        <Box sx={{ p: 2, bgcolor: alpha("#dc2626", 0.04) }}>
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </Box>
      )}

      {/* Empty state */}
      {!error && data.length === 0 && (
        <Box sx={{ py: 6, textAlign: "center", color: "text.disabled" }}>
          <InfoRounded sx={{ fontSize: 36, mb: 1, opacity: 0.5 }} />
          <Typography variant="body2">No {title.toLowerCase()} found</Typography>
        </Box>
      )}

      {/* Table */}
      {!error && data.length > 0 && (
        <TableContainer sx={{ maxHeight: 400 }}>
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
                      letterSpacing: "0.05em",
                      bgcolor: "grey.50",
                      borderBottom: "1px solid",
                      borderColor: "grey.200",
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(0, 50).map((row, idx) => (
                <TableRow
                  key={(row._id as string) || (row.id as string) || idx}
                  hover
                  sx={{
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      sx={{ fontSize: "0.8125rem", py: 1.25 }}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : (row[col.key] as React.ReactNode) ?? "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Footer */}
      {data.length > 50 && (
        <Box
          sx={{
            p: 1.5,
            borderTop: "1px solid",
            borderColor: "grey.100",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" color="text.disabled">
            Showing 50 of {total} records
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default DataTable;
