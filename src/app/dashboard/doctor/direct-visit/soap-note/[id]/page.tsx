"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Role } from "@/lib/types";
import DashboardLayout from "@/components/DashboardLayout";
import {
  COLORS,
  GRADIENTS,
  BORDER_RADIUS,
  SHADOWS,
} from "@/lib/constants/design-tokens";
import axios from "axios";

interface Diagnosis {
  name: string;
  code: string;
  icon?: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export default function SOAPNotePage() {
  const params = useParams();
  const router = useRouter();
  const consultationId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState<any>(null);

  // SOAP Note State
  const [summary, setSummary] = useState(
    "The patient, a 58-year-old male, reports experiencing increasing shortness of breath and fatigue over the past 3 weeks. He states that these symptoms have been especially noticeable during physical exertion. The patient has a history of hypertension and is currently on medication for high blood pressure. He denies any chest pain or dizziness. He is concerned about the recent worsening of symptoms and requests an evaluation.",
  );
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([
    { name: "Essential Hypertension", code: "I10", icon: "✓" },
    { name: "Localized Edema", code: "R60.0", icon: "" },
    { name: "Localized Edema", code: "R60.0", icon: "" },
    { name: "Adverse Effect of ACE Inhibitors", code: "T46.4", icon: "" },
  ]);
  const [plan] = useState(
    `• Medication Adjustments

Increase dosage of the current antihypertensive medication if blood pressure readings remain elevated.
Switch ACE inhibitor to an alternative class of medications (e.g., ARB) if edema persists.

• Further Tests

Order an ECG and echocardiogram to rule out underlying heart conditions such as congestive heart failure.
Recommend a kidney function test to monitor for any adverse effects due to medication.

• Lifestyle Modifications

Advise the patient to reduce salt intake, monitor fluid intake, and gradually increase physical activity as tolerated.

• Follow-up

Schedule a follow-up appointment in 2 weeks to assess response to medication adjustments and symptom improvement.`,
  );
  const [medications, setMedications] = useState<Medication[]>([
    {
      name: "Amlodipine 2.5mg",
      dosage: "Oral",
      frequency: "3 Times a day",
      duration: "2 Weeks",
    },
    {
      name: "Losartan 50mg",
      dosage: "Oral",
      frequency: "3 Times a day",
      duration: "2 Weeks",
    },
    {
      name: "Amlodipine 2.5mg",
      dosage: "Oral",
      frequency: "3 Times a day",
      duration: "2 Weeks",
    },
  ]);

  const [newDiagnosis, setNewDiagnosis] = useState("");

  useEffect(() => {
    // Fetch consultation details
    const fetchConsultation = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/onsite-consultations/${consultationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setConsultation(response.data);
      } catch (error) {
        console.error("Failed to fetch consultation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [consultationId]);

  const handleAddDiagnosis = () => {
    if (newDiagnosis.trim()) {
      setDiagnoses([...diagnoses, { name: newDiagnosis, code: "", icon: "" }]);
      setNewDiagnosis("");
    }
  };

  const handleRemoveDiagnosis = (index: number) => {
    setDiagnoses(diagnoses.filter((_, i) => i !== index));
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // Here you would save the SOAP note to your backend
    console.log("Saving SOAP note...");
    // After saving, redirect back to direct visit page
    router.push("/dashboard/doctor/direct-visit");
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
        <DashboardLayout title="SOAP Note">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
      <DashboardLayout title="SOAP Note">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: BORDER_RADIUS.lg,
            border: `1px solid ${COLORS.border.light}`,
            boxShadow: SHADOWS.small,
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
            <LocalHospitalIcon
              sx={{ color: COLORS.primary.main, fontSize: 32 }}
            />
            <Typography
              variant="h5"
              fontWeight={700}
              color={COLORS.text.primary}
            >
              SOAP Note
            </Typography>
          </Box>

          {/* Summary Section */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                color={COLORS.text.primary}
              >
                Summary
              </Typography>
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: BORDER_RADIUS.md,
                  bgcolor: "#F7FCFF",
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Diagnosis Section */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                color={COLORS.text.primary}
              >
                Diagnosis
              </Typography>
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
              {diagnoses.map((diagnosis, index) => (
                <Chip
                  key={index}
                  label={`${diagnosis.icon ? diagnosis.icon + " " : ""}${diagnosis.name} ${diagnosis.code ? `(${diagnosis.code})` : ""}`}
                  onDelete={() => handleRemoveDiagnosis(index)}
                  deleteIcon={<RemoveIcon />}
                  sx={{
                    bgcolor: index === 0 ? COLORS.primary.subtle : "#F7FCFF",
                    color:
                      index === 0 ? COLORS.primary.main : COLORS.text.primary,
                    fontWeight: 600,
                    borderRadius: BORDER_RADIUS.md,
                    border: `1px solid ${index === 0 ? COLORS.primary.light : COLORS.border.light}`,
                  }}
                />
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                placeholder="Add diagnosis..."
                value={newDiagnosis}
                onChange={(e) => setNewDiagnosis(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddDiagnosis()}
                size="small"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: BORDER_RADIUS.md,
                    borderStyle: "dashed",
                  },
                }}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon fontSize="small" />}
                onClick={handleAddDiagnosis}
                sx={{
                  borderRadius: BORDER_RADIUS.md,
                  borderStyle: "dashed",
                  px: 2,
                  py: 0.75,
                }}
              >
                Add More
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Plan Section */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                color={COLORS.text.primary}
              >
                Plan
              </Typography>
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box
              sx={{
                bgcolor: "#F7FCFF",
                p: 3,
                borderRadius: BORDER_RADIUS.md,
                whiteSpace: "pre-line",
                lineHeight: 1.8,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-line",
                  lineHeight: 1.8,
                  color: COLORS.text.primary,
                }}
              >
                {plan}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Suggested Medications Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              color={COLORS.text.primary}
              sx={{ mb: 3 }}
            >
              Suggested Medications
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
              {medications.map((med, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: BORDER_RADIUS.md,
                    border: `1px solid ${index === 0 ? COLORS.primary.light : COLORS.border.light}`,
                    bgcolor:
                      index === 0
                        ? COLORS.primary.subtle
                        : COLORS.background.subtle,
                    minWidth: 280,
                    position: "relative",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveMedication(index)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: COLORS.error.main,
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color={COLORS.text.primary}
                    sx={{ mb: 1, pr: 4 }}
                  >
                    {med.name}
                  </Typography>
                  <Typography variant="body2" color={COLORS.text.secondary}>
                    {med.dosage} · {med.frequency} · {med.duration}
                  </Typography>
                </Paper>
              ))}

              {/* Add New Medication Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: BORDER_RADIUS.md,
                  border: `1px dashed ${COLORS.border.medium}`,
                  bgcolor: COLORS.background.paper,
                  minWidth: 280,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: COLORS.primary.main,
                    bgcolor: COLORS.primary.subtle,
                  },
                }}
                onClick={() => {
                  // You can open a dialog/modal here to add medication
                  const name = prompt("Medication name:");
                  if (name) {
                    setMedications([
                      ...medications,
                      {
                        name,
                        dosage: "Oral",
                        frequency: "3 Times a day",
                        duration: "2 Weeks",
                      },
                    ]);
                  }
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <AddIcon
                    sx={{ color: COLORS.primary.main, fontSize: 32, mb: 1 }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={COLORS.primary.main}
                  >
                    Add More
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Save Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              sx={{
                borderRadius: BORDER_RADIUS.md,
                px: 6,
                py: 1.5,
                background: GRADIENTS.primary,
                color: "white",
                fontWeight: 700,
                boxShadow: SHADOWS.medium,
                "&:hover": {
                  boxShadow: SHADOWS.large,
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Paper>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
