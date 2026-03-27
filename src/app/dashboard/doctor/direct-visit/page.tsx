"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Role, OnsiteConsultation } from "@/lib/types";

// Sub-components
import OnsiteConsultationCard from "./components/OnsiteConsultationCard";
import NewOnsiteModal from "./components/NewOnsiteModal";
import CalendarWeekly from "@/components/Calendar/CalendarWeekly";
import CalendarMonthly from "@/components/Calendar/CalendarMonthly";

import {
  useOnsiteConsultations,
  useCreateOnsiteConsultation,
  useDoctorOnsiteStats,
} from "@/hooks/use-onsite-consultations";
import { GRADIENTS } from "@/lib/constants/design-tokens";

type ViewMode = "Weekly" | "Monthly";

export default function OnsiteAppointmentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("Weekly");
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Onsite modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    notes: "",
  });

  // Calculate start/end for stats fetching
  const statsRange = useMemo(() => {
    const start = new Date(selectedDate);
    const end = new Date(selectedDate);

    if (viewMode === "Weekly") {
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      end.setDate(start.getDate() + 6);
    } else {
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    }

    const formatDate = (date: Date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    return { startDate: formatDate(start), endDate: formatDate(end) };
  }, [selectedDate, viewMode]);

  // React Query Hooks
  const { data: stats = {} } = useDoctorOnsiteStats(statsRange);

  const {
    data: onsiteData,
    isLoading: isLoadingOnsite,
    error: onsiteError,
  } = useOnsiteConsultations({
    page,
    limit: 10,
    date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`,
  });

  const createOnsiteMutation = useCreateOnsiteConsultation();

  const onsiteConsultations = onsiteData?.data || [];
  const totalPages = onsiteData?.meta?.totalPages || 1;

  const handleCreateOnsite = async () => {
    try {
      await createOnsiteMutation.mutateAsync(formData);
      setIsModalOpen(false);
      setFormData({ firstName: "", lastName: "", phone: "", notes: "" });
    } catch (err: any) {
      alert(
        err.response?.data?.message || "Failed to create onsite consultation",
      );
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setPage(1);
    if (viewMode === "Monthly") {
      setViewMode("Weekly");
    }
  };

  return (
    <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
      <DashboardLayout title="Direct Visit">
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>View Mode</InputLabel>
            <Select
              value={viewMode}
              label="View Mode"
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              sx={{ borderRadius: 2, bgcolor: "white" }}
            >
              <MenuItem value="Weekly">Weekly View</MenuItem>
              <MenuItem value="Monthly">Monthly View</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disableElevation
            sx={{
              color: GRADIENTS.primary,
              borderRadius: 1,
              "&:hover": { color: GRADIENTS.primary },
            }}
            onClick={() => setIsModalOpen(true)}
          >
            New Consultation
          </Button>
        </Box>

        {onsiteError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {(onsiteError as any)?.message || "Failed to load data"}
          </Alert>
        )}

        {viewMode === "Weekly" ? (
          <CalendarWeekly
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onNavigate={setSelectedDate}
            stats={stats}
          />
        ) : (
          <CalendarMonthly
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onNavigate={setSelectedDate}
            stats={stats}
          />
        )}

        {viewMode === "Weekly" && (
          <Box sx={{ mt: 4 }}>
            {isLoadingOnsite ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  {onsiteConsultations.length === 0 ? (
                    <Grid size={{ xs: 12 }}>
                      <Typography
                        textAlign="center"
                        color="text.secondary"
                        py={4}
                      >
                        No onsite consultations found for this day.
                      </Typography>
                    </Grid>
                  ) : (
                    onsiteConsultations.map((consult: OnsiteConsultation) => (
                      <Grid size={{ xs: 12, md: 6, lg: 4 }} key={consult.id}>
                        <OnsiteConsultationCard consult={consult} />
                      </Grid>
                    ))
                  )}
                </Grid>

                {totalPages > 1 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(_, value) => setPage(value)}
                      color="primary"
                      size="large"
                      shape="rounded"
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        )}

        <NewOnsiteModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateOnsite}
          isSubmitting={createOnsiteMutation.isPending}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
