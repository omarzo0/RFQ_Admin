"use client";

import React from "react";
import { Paper, Typography, Box, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CompanyGrowthPoint } from "@/features/dashboard/types";

interface CompanyGrowthChartProps {
  data: CompanyGrowthPoint[];
}

const CompanyGrowthChart: React.FC<CompanyGrowthChartProps> = ({ data }) => {
  const theme = useTheme();

  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.month + "-01").toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
  }));

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
        height: "100%",
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2.5 }}>
        Company Growth
      </Typography>
      <Box sx={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => [String(value), "New Companies"]}
            />
            <Bar
              dataKey="newCompanies"
              fill={theme.palette.primary.main}
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default CompanyGrowthChart;
