"use client";

import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Fade,
  alpha,
} from "@mui/material";
import {
  EmailOutlined,
  LockOutlined,
  PinOutlined,
  ArrowBackRounded,
  Visibility,
  VisibilityOff,
  LockResetRounded,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
} from "@/features/auth/api/authApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useAuthStore } from "@/shared/store/authStore";

// --- Schemas ---
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z
  .object({
    otp: z
      .string()
      .length(6, "OTP must be exactly 6 digits")
      .regex(/^\d+$/, "OTP must contain only numbers"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

const steps = ["Enter Email", "Reset Password"];

const inputSx = {
  mb: 2.5,
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    backgroundColor: "grey.50",
    "&:hover": { backgroundColor: "grey.100" },
    "&.Mui-focused": { backgroundColor: "white" },
  },
};

const ForgotPasswordForm: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  // --- Forms ---
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });

  // --- Handlers ---
  const handleEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      const response = await forgotPasswordApi(data);
      if (response.data?.success !== false) {
        setEmail(data.email);
        setActiveStep(1);
        toast.success("OTP sent to your email");
      } else {
        toast.error(response.data?.message || "Failed to send OTP");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to send OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    try {
      const response = await resetPasswordApi({
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      if (response.data?.success !== false) {
        toast.success("Password reset successfully!");
        router.push("/login");
      } else {
        toast.error(response.data?.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to reset password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step Content ---
  const renderEmailStep = () => (
    <Fade in={activeStep === 0}>
      <Box component="form" onSubmit={emailForm.handleSubmit(handleEmailSubmit)} noValidate>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter the email address associated with your account and we&apos;ll
          send you a one-time password.
        </Typography>

        <Controller
          name="email"
          control={emailForm.control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Email"
              placeholder="you@company.com"
              autoComplete="email"
              autoFocus
              error={!!emailForm.formState.errors.email}
              helperText={emailForm.formState.errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ fontSize: 20, color: "text.disabled" }} />
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />
          )}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          disableElevation
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: "0.9375rem",
            textTransform: "none",
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            "&:hover": {
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.dark} 100%)`,
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)",
            },
            transition: "all 0.2s ease",
          }}
        >
          {isLoading ? <CircularProgress size={22} color="inherit" /> : "Send OTP"}
        </Button>
      </Box>
    </Fade>
  );

  const renderResetStep = () => (
    <Fade in={activeStep === 1}>
      <Box component="form" onSubmit={resetForm.handleSubmit(handleResetSubmit)} noValidate>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          We sent a 6-digit code to <strong>{email}</strong>. Enter it below
          along with your new password.
        </Typography>

        {/* OTP Field */}
        <Controller
          name="otp"
          control={resetForm.control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="OTP Code"
              placeholder="000000"
              autoFocus
              error={!!resetForm.formState.errors.otp}
              helperText={resetForm.formState.errors.otp?.message}
              inputProps={{ maxLength: 6, inputMode: "numeric", pattern: "[0-9]*" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PinOutlined sx={{ fontSize: 20, color: "text.disabled" }} />
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />
          )}
        />

        {/* New Password */}
        <Controller
          name="newPassword"
          control={resetForm.control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="New Password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              error={!!resetForm.formState.errors.newPassword}
              helperText={resetForm.formState.errors.newPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ fontSize: 20, color: "text.disabled" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: "text.disabled" }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />
          )}
        />

        {/* Confirm Password */}
        <Controller
          name="confirmPassword"
          control={resetForm.control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Confirm Password"
              placeholder="••••••••"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              error={!!resetForm.formState.errors.confirmPassword}
              helperText={resetForm.formState.errors.confirmPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ fontSize: 20, color: "text.disabled" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: "text.disabled" }}
                    >
                      {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />
          )}
        />

        <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              setActiveStep(0);
              resetForm.reset();
            }}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              minWidth: 100,
            }}
          >
            Back
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            disableElevation
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "0.9375rem",
              textTransform: "none",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              "&:hover": {
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.dark} 100%)`,
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {isLoading ? <CircularProgress size={22} color="inherit" /> : "Reset Password"}
          </Button>
        </Box>
      </Box>
    </Fade>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: (theme) =>
          `linear-gradient(145deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.main, 0.85)} 50%, ${theme.palette.secondary.dark} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        },
      }}
    >
      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1, py: 4 }}>
        {/* Logo / Brand */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "16px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <LockResetRounded sx={{ fontSize: 32, color: "white" }} />
          </Box>
          <Typography
            variant="h5"
            fontWeight={700}
            color="white"
            letterSpacing="-0.02em"
          >
            Reset Password
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.7)", mt: 0.5 }}
          >
            Recover access to your account
          </Typography>
        </Box>

        {/* Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <Box sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Stepper */}
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                mb: 4,
                "& .MuiStepLabel-label": {
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                },
                "& .MuiStepConnector-line": {
                  borderColor: "grey.300",
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step Content */}
            {activeStep === 0 && renderEmailStep()}
            {activeStep === 1 && renderResetStep()}
          </Box>
        </Paper>

        {/* Back to Login */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            component={NextLink}
            href="/login"
            startIcon={<ArrowBackRounded sx={{ fontSize: 18 }} />}
            sx={{
              color: "rgba(255,255,255,0.8)",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              "&:hover": {
                color: "white",
                backgroundColor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            Back to Sign In
          </Button>
        </Box>

        {/* Footer */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 2,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          © {new Date().getFullYear()} RFQ Admin. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default ForgotPasswordForm;
