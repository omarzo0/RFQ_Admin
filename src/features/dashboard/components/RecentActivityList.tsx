"use client";

import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Chip,
  alpha,
} from "@mui/material";
import {
  BusinessRounded,
  PersonAddRounded,
  RequestQuoteRounded,
  InfoRounded,
} from "@mui/icons-material";
import type { RecentActivity } from "@/features/dashboard/types";

const iconMap: Record<string, React.ReactNode> = {
  company_created: <BusinessRounded sx={{ fontSize: 18 }} />,
  user_registered: <PersonAddRounded sx={{ fontSize: 18 }} />,
  rfq_created: <RequestQuoteRounded sx={{ fontSize: 18 }} />,
};

const colorMap: Record<string, string> = {
  company_created: "#1976d2",
  user_registered: "#16a34a",
  rfq_created: "#f59e0b",
};

interface RecentActivityListProps {
  activities: RecentActivity[];
}

const RecentActivityList: React.FC<RecentActivityListProps> = ({
  activities,
}) => {
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Recent Activity
        </Typography>
        <Chip label={`${activities.length} events`} size="small" variant="outlined" />
      </Box>

      {activities.length === 0 ? (
        <Box
          sx={{
            py: 6,
            textAlign: "center",
            color: "text.disabled",
          }}
        >
          <InfoRounded sx={{ fontSize: 36, mb: 1, opacity: 0.5 }} />
          <Typography variant="body2">No recent activity</Typography>
        </Box>
      ) : (
        <List disablePadding>
          {activities.slice(0, 8).map((activity, index) => {
            const color = colorMap[activity.type] || "#6b7280";
            return (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  py: 1,
                  borderBottom:
                    index < activities.length - 1
                      ? "1px solid"
                      : "none",
                  borderColor: "grey.100",
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: 1.5,
                      backgroundColor: alpha(color, 0.08),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color,
                    }}
                  >
                    {iconMap[activity.type] || (
                      <InfoRounded sx={{ fontSize: 18 }} />
                    )}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={activity.message}
                  secondary={new Date(activity.timestamp).toLocaleString()}
                  primaryTypographyProps={{
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{
                    fontSize: "0.75rem",
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default RecentActivityList;
