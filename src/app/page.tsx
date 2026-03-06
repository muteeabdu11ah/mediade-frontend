'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GroupsIcon from '@mui/icons-material/Groups';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/app/globals.css';

const features = [
  {
    icon: <CalendarMonthIcon sx={{ fontSize: 32 }} />,
    title: 'Smart Scheduling',
    description: 'Book appointments with doctors based on their real-time availability. No more phone calls or waiting on hold.',
  },
  {
    icon: <LocalHospitalIcon sx={{ fontSize: 32 }} />,
    title: 'Clinic Management',
    description: 'Complete clinic administration tools for managing staff, schedules, and patient records in one place.',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 32 }} />,
    title: 'Multi-Role Access',
    description: 'Dedicated portals for patients, doctors, receptionists, clinic admins, and super administrators.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 32 }} />,
    title: 'HIPAA Compliant',
    description: 'Enterprise-grade security with encrypted data storage and secure access controls for medical records.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 32 }} />,
    title: 'Real-Time Updates',
    description: 'Instant notifications for appointment confirmations, schedule changes, and important health updates.',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 32 }} />,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to help you with any questions or technical issues.',
  },
];

const steps = [
  { number: '01', title: 'Create Your Account', description: 'Sign up in seconds as a patient or get invited by your clinic administrator.' },
  { number: '02', title: 'Find Your Doctor', description: 'Browse available doctors and view their schedules to find the perfect appointment slot.' },
  { number: '03', title: 'Book Instantly', description: 'Select your preferred time slot and receive instant confirmation for your appointment.' },
];

const stats = [
  { value: '10K+', label: 'Patients Served' },
  { value: '500+', label: 'Healthcare Providers' },
  { value: '50+', label: 'Clinics Onboarded' },
  { value: '99.9%', label: 'Uptime SLA' },
];

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* ───────── HERO SECTION ───────── */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #E0F7FA 0%, #FFFFFF 40%, #F0FDFD 100%)',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
        }}
      >
        {/* Decorative circles */}
        <Box sx={{
          position: 'absolute', top: -120, right: -120, width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,188,212,0.08) 0%, transparent 70%)',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -80, left: -80, width: 300, height: 300,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,150,136,0.06) 0%, transparent 70%)',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="🚀 Modern Healthcare Platform"
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(0,188,212,0.1)',
                  color: 'primary.dark',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  height: 36,
                  borderRadius: 10,
                  border: '1px solid rgba(0,188,212,0.2)',
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  fontWeight: 900,
                  lineHeight: 1.15,
                  mb: 3,
                  color: 'text.primary',
                }}
              >
                Your Health,{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Simplified.
                </Box>
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  mb: 4,
                  maxWidth: 520,
                  fontSize: { xs: '1rem', sm: '1.15rem' },
                }}
              >
                Book appointments with top doctors, manage your health records, and take control of your healthcare journey — all from one seamless platform.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00ACC1 0%, #00897B 100%)',
                    },
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  size="large"
                  sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                >
                  Sign In
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {['No credit card required', 'Free for patients', 'HIPAA compliant'].map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: { xs: 'none', md: 'block' },
                }}
              >
                {/* Decorative card mockup */}
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: 'white',
                    boxShadow: '0 20px 60px rgba(0,188,212,0.15)',
                    border: '1px solid rgba(0,188,212,0.1)',
                    transform: 'rotate(-2deg)',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                      <LocalHospitalIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={700}>Dr. Sarah Johnson</Typography>
                      <Typography variant="body2" color="text.secondary">Cardiologist</Typography>
                    </Box>
                    <Chip label="Available" size="small" color="success" sx={{ ml: 'auto' }} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {['Mon 9AM', 'Tue 2PM', 'Wed 10AM', 'Thu 3PM'].map((slot) => (
                      <Chip
                        key={slot}
                        label={slot}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: 'primary.light',
                          color: 'primary.dark',
                          '&:hover': { bgcolor: 'rgba(0,188,212,0.08)' },
                        }}
                      />
                    ))}
                  </Box>
                  <Button variant="contained" fullWidth>
                    Book Appointment
                  </Button>
                </Box>

                {/* Background card */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    right: -20,
                    bottom: -20,
                    borderRadius: 4,
                    bgcolor: 'rgba(0,188,212,0.06)',
                    border: '1px dashed rgba(0,188,212,0.2)',
                    zIndex: 1,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ───────── STATS BAR ───────── */}
      <Box sx={{ bgcolor: 'primary.main', py: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {stats.map((stat) => (
              <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ───────── FEATURES SECTION ───────── */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="Features"
              sx={{
                mb: 2,
                bgcolor: 'rgba(0,188,212,0.08)',
                color: 'primary.dark',
                fontWeight: 600,
                fontSize: '0.8rem',
              }}
            />
            <Typography variant="h2" fontWeight={800} sx={{ mb: 2 }}>
              Everything You Need for{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                Better Healthcare
              </Box>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              A comprehensive platform designed for every stakeholder in the healthcare ecosystem.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: 'background.paper',
                    cursor: 'default',
                    border: '1px solid rgba(0,188,212,0.06)',
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'rgba(0,188,212,0.08)',
                        color: 'primary.main',
                        mb: 2.5,
                        borderRadius: 3,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ───────── HOW IT WORKS ───────── */}
      <Box id="about" sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(180deg, #F0FDFD 0%, #FFFFFF 100%)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="How It Works"
              sx={{
                mb: 2,
                bgcolor: 'rgba(0,150,136,0.08)',
                color: 'secondary.dark',
                fontWeight: 600,
                fontSize: '0.8rem',
              }}
            />
            <Typography variant="h2" fontWeight={800} sx={{ mb: 2 }}>
              Get Started in{' '}
              <Box component="span" sx={{ color: 'secondary.main' }}>
                3 Simple Steps
              </Box>
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={step.number}>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Typography
                    sx={{
                      fontSize: '5rem',
                      fontWeight: 900,
                      color: 'rgba(0,188,212,0.08)',
                      lineHeight: 1,
                      mb: -2,
                    }}
                  >
                    {step.number}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5, position: 'relative', zIndex: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.8} sx={{ maxWidth: 300, mx: 'auto' }}>
                    {step.description}
                  </Typography>
                  {index < steps.length - 1 && (
                    <Box sx={{
                      display: { xs: 'none', md: 'block' },
                      position: 'absolute', top: '40%', right: -40,
                      color: 'primary.light', fontSize: 30,
                    }}>
                      →
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ───────── CTA SECTION ───────── */}
      <Box
        id="contact"
        sx={{
          py: { xs: 8, md: 10 },
          background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>
            Ready to Transform Your Healthcare?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 4, lineHeight: 1.8 }}>
            Join thousands of patients and healthcare providers already using Aeyron Medical.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                bgcolor: 'white',
                color: 'primary.dark',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
              }}
            >
              Create Free Account
            </Button>
            <Button
              component={Link}
              href="/login"
              variant="outlined"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
