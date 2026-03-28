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
import { SoapNoteResponse } from "@/hooks/use-soap-note";

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

const formatPlan = (plan: SoapNoteResponse["plan"]): string =>
  [
    plan.medication_adjustment
      ? `• Medication Adjustments\n\n${plan.medication_adjustment}`
      : "",
    plan.further_tests ? `• Further Tests\n\n${plan.further_tests}` : "",
    plan.lifestyle_modifications
      ? `• Lifestyle Modifications\n\n${plan.lifestyle_modifications}`
      : "",
    plan.follow_up ? `• Follow-up\n\n${plan.follow_up}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

export default function SOAPNotePage() {
  const params = useParams();
  const router = useRouter();
  const consultationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState<any>(null);
  const [summary, setSummary] = useState("");
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [plan, setPlan] = useState("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newDiagnosis, setNewDiagnosis] = useState("");

  // ── Load SOAP data from sessionStorage ───────────────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem(`soap-note-${consultationId}`);
    console.log(raw);
    if (raw) {
      try {
        const soap: SoapNoteResponse = JSON.parse(raw);
        if (soap.summary) setSummary(soap.summary);
        if (soap.diagnosis?.length)
          setDiagnoses(
            soap.diagnosis.map((name) => ({ name, code: "", icon: "" })),
          );
        if (soap.plan) setPlan(formatPlan(soap.plan));
        if (soap.suggested_medications?.length)
          setMedications(
            soap.suggested_medications.map((name) => ({
              name,
              dosage: "Oral",
              frequency: "As directed",
              duration: "As directed",
            })),
          );
        sessionStorage.removeItem(`soap-note-${consultationId}`);
      } catch (e) {
        console.error("Failed to parse soap note", e);
      }
    }
  }, [consultationId]);

  // ── Fetch consultation ────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/onsite-consultations/${consultationId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setConsultation(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [consultationId]);

  const handleAddDiagnosis = () => {
    if (newDiagnosis.trim()) {
      setDiagnoses([...diagnoses, { name: newDiagnosis, code: "", icon: "" }]);
      setNewDiagnosis("");
    }
  };
  const handleRemoveDiagnosis = (i: number) =>
    setDiagnoses(diagnoses.filter((_, idx) => idx !== i));
  const handleRemoveMedication = (i: number) =>
    setMedications(medications.filter((_, idx) => idx !== i));
  const handleSave = () => router.push("/dashboard/doctor/direct-visit");

  if (loading)
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

          {/* Summary */}
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
              placeholder="No summary available."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: BORDER_RADIUS.md,
                  bgcolor: "#F7FCFF",
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Diagnosis */}
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

            {diagnoses.length === 0 ? (
              <Typography
                variant="body2"
                color={COLORS.text.muted}
                sx={{ mb: 2 }}
              >
                No diagnoses recorded.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
                {diagnoses.map((d, i) => (
                  <Chip
                    key={i}
                    label={`${d.icon ? d.icon + " " : ""}${d.name}${d.code ? ` (${d.code})` : ""}`}
                    onDelete={() => handleRemoveDiagnosis(i)}
                    deleteIcon={<RemoveIcon />}
                    sx={{
                      bgcolor: i === 0 ? COLORS.primary.subtle : "#F7FCFF",
                      color:
                        i === 0 ? COLORS.primary.main : COLORS.text.primary,
                      fontWeight: 600,
                      borderRadius: BORDER_RADIUS.md,
                      border: `1px solid ${i === 0 ? COLORS.primary.light : COLORS.border.light}`,
                    }}
                  />
                ))}
              </Box>
            )}

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

          {/* Plan */}
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
              sx={{ bgcolor: "#F7FCFF", p: 3, borderRadius: BORDER_RADIUS.md }}
            >
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-line",
                  lineHeight: 1.8,
                  color: plan ? COLORS.text.primary : COLORS.text.muted,
                }}
              >
                {plan || "No plan recorded."}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Medications */}
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
              {medications.length === 0 && (
                <Typography variant="body2" color={COLORS.text.muted}>
                  No medications suggested.
                </Typography>
              )}
              {medications.map((med, i) => (
                <Paper
                  key={i}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: BORDER_RADIUS.md,
                    border: `1px solid ${i === 0 ? COLORS.primary.light : COLORS.border.light}`,
                    bgcolor:
                      i === 0
                        ? COLORS.primary.subtle
                        : COLORS.background.subtle,
                    minWidth: 280,
                    position: "relative",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveMedication(i)}
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

              {/* Add card */}
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
                  const name = prompt("Medication name:");
                  if (name)
                    setMedications([
                      ...medications,
                      {
                        name,
                        dosage: "Oral",
                        frequency: "3 Times a day",
                        duration: "2 Weeks",
                      },
                    ]);
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

          {/* Save */}
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
                "&:hover": { boxShadow: SHADOWS.large },
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
