"use client";

import React from "react";
import { Box, Typography, Paper, alpha } from "@mui/material";
import { TrendingUpRounded, TrendingDownRounded } from "@mui/icons-material";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  growth?: number;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  growth,
  subtitle,
}) => {
  const isPositive = growth !== undefined && growth >= 0;

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
          boxShadow: `0 4px 20px ${alpha(color, 0.12)}`,
        },
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
        {growth !== undefined && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.25,
              px: 1,
              py: 0.25,
              borderRadius: 1.5,
              backgroundColor: isPositive
                ? alpha("#16a34a", 0.08)
                : alpha("#dc2626", 0.08),
              color: isPositive ? "#16a34a" : "#dc2626",
            }}
          >
            {isPositive ? (
              <TrendingUpRounded sx={{ fontSize: 16 }} />
            ) : (
              <TrendingDownRounded sx={{ fontSize: 16 }} />
            )}
            <Typography variant="caption" fontWeight={600}>
              {Math.abs(growth).toFixed(1)}%
            </Typography>
          </Box>
        )}
      </Box>
      <Typography
        variant="h5"
        fontWeight={700}
        letterSpacing="-0.02em"
        sx={{ mb: 0.25 }}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

export default StatCard;
