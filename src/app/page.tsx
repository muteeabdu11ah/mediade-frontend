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
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatusChip from '@/components/StatusChip';
import '@/app/globals.css';

import { COLORS, GRADIENTS, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '@/lib/constants/design-tokens';
import { FEATURES, STEPS, STATS, HERO_HIGHLIGHTS } from '@/lib/constants/landing-page';

// ─── Sub-Components ─────────────────────────────────────────────────────────

const HeroSection = () => (
  <Box
    sx={{
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(180deg, ${COLORS.background.subtle} 0%, #FFFFFF 100%)`,
      pt: { xs: 10, md: 16 },
      pb: { xs: 12, md: 20 },
    }}
  >
    <Box sx={{
      position: 'absolute', top: -150, right: -150, width: 500, height: 500,
      borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.primary.main}10 0%, transparent 70%)`,
      zIndex: 0
    }} />
    <Box sx={{
      position: 'absolute', bottom: -100, left: -100, width: 400, height: 400,
      borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.primary.light}08 0%, transparent 70%)`,
      zIndex: 0
    }} />

    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid size={{ xs: 12, md: 7 }}>
          <Chip
            label="Healthcare Infrastructure for the Future"
            sx={{
              mb: 4,
              bgcolor: COLORS.primary.subtle,
              color: COLORS.primary.main,
              fontWeight: 600,
              fontSize: TYPOGRAPHY.sizes.overline,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              height: 32,
              borderRadius: BORDER_RADIUS.sm,
              border: `1px solid ${COLORS.primary.main}20`,
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              lineHeight: 1.05,
              mb: 3,
              color: COLORS.text.primary,
              letterSpacing: '-2px'
            }}
          >
            Seamless Care,{' '}
            <Box
              component="span"
              sx={{
                background: GRADIENTS.primary,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Intelligent Platform.
            </Box>
          </Typography>

          <Typography
            variant="h4"
            sx={{
              color: COLORS.text.secondary,
              lineHeight: 1.6,
              mb: 5,
              maxWidth: 580,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            A unified ecosystem for clinics, doctors, and patients. Experience the next generation of healthcare administration and patient engagement.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', mb: 6 }}>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 2,
                borderRadius: BORDER_RADIUS.full,
                boxShadow: SHADOWS.medium
              }}
            >
              Join the Network
            </Button>
            <Button
              component={Link}
              href="/login"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 2,
                borderRadius: BORDER_RADIUS.full,
                borderWidth: 2,
                '&:hover': { borderWidth: 2 }
              }}
            >
              Doctor Sign In
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {HERO_HIGHLIGHTS.map((item) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 20, color: COLORS.success.main }} />
                <Typography variant="body2" sx={{ color: COLORS.text.primary }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ position: 'relative', display: { xs: 'none', md: 'block' } }}>
            <Card
              sx={{
                p: 1.5,
                borderRadius: BORDER_RADIUS.lg,
                boxShadow: SHADOWS.premium,
                border: `1px solid ${COLORS.border.light}`,
                transform: 'perspective(1000px) rotateY(-15deg) rotateX(5deg)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                zIndex: 2,
                transition: 'all 0.5s ease',
                '&:hover': {
                  transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
                }
              }}
            >
              <Box sx={{ p: 3, bgcolor: COLORS.background.subtle, borderRadius: BORDER_RADIUS.md, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ background: GRADIENTS.primary, width: 56, height: 56, boxShadow: SHADOWS.small }}>
                    <LocalHospitalIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ color: COLORS.text.primary, display: 'block' }}>Dr. Elena Rodriguez</Typography>
                    <Typography variant="overline" sx={{ color: COLORS.primary.main }}>Neurologist • 12Y Exp</Typography>
                  </Box>
                  <StatusChip status="active" />
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                  {['9:30 AM', '11:00 AM', '2:45 PM'].map((slot) => (
                    <Box
                      key={slot}
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: BORDER_RADIUS.sm,
                        bgcolor: 'white',
                        border: `1px solid ${COLORS.border.light}`,
                        color: COLORS.text.primary,
                        fontSize: TYPOGRAPHY.sizes.bodySmall,
                        fontWeight: TYPOGRAPHY.weights.bold,
                        boxShadow: SHADOWS.small
                      }}
                    >
                      {slot}
                    </Box>
                  ))}
                </Box>
                <Button variant="contained" fullWidth sx={{ borderRadius: BORDER_RADIUS.md, py: 1.5 }}>
                  Confirm Booking
                </Button>
              </Box>
            </Card>
            <Box
              sx={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: '100%',
                height: '100%',
                borderRadius: BORDER_RADIUS.lg,
                background: GRADIENTS.primary,
                opacity: 0.1,
                zIndex: 1,
                transform: 'perspective(1000px) rotateY(-15deg) rotateX(5deg) translateZ(-50px)',
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const StatsBar = () => (
  <Box sx={{ background: GRADIENTS.primary, py: 6, boxShadow: SHADOWS.large, position: 'relative', zIndex: 10 }}>
    <Container maxWidth="lg">
      <Grid container spacing={4} justifyContent="center">
        {STATS.map((stat) => (
          <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: 'white', mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.8)', display: 'block' }}>
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

const FeaturesSection = () => (
  <Box id="features" sx={{ py: { xs: 12, md: 18 }, bgcolor: COLORS.background.paper }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 10 }}>
        <Typography variant="overline" sx={{ color: COLORS.primary.main, display: 'block' }}>
          Core Capabilities
        </Typography>
        <Typography variant="h3" sx={{ mt: 1, mb: 3, letterSpacing: '-1.5px' }}>
          Advanced Healthcare{' '}
          <Box component="span" sx={{
            background: GRADIENTS.primary,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Operating System
          </Box>
        </Typography>
        <Typography variant="body1" sx={{ color: COLORS.text.secondary, maxWidth: 700, mx: 'auto' }}>
          Purpose-built tools for every stakeholder in the medical journey, from administrative staff to specialist doctors.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {FEATURES.map((feature) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
            <Card
              sx={{
                height: '100%',
                bgcolor: COLORS.background.paper,
                cursor: 'default',
                border: `1px solid ${COLORS.border.light}`,
                boxShadow: SHADOWS.medium,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: SHADOWS.premium,
                  borderColor: COLORS.primary.main,
                  transform: 'translateY(-8px)'
                }
              }}
            >
              <CardContent sx={{ p: 4.5 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    background: GRADIENTS.primary,
                    color: 'white',
                    mb: 4,
                    borderRadius: BORDER_RADIUS.md,
                    boxShadow: SHADOWS.medium,
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Typography variant="h5" sx={{ mb: 2, color: COLORS.text.primary }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: COLORS.text.secondary, lineHeight: 1.8 }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

const HowItWorksSection = () => (
  <Box id="about" sx={{ py: { xs: 12, md: 18 }, bgcolor: COLORS.background.subtle }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 12 }}>
        <Typography variant="overline" sx={{ color: COLORS.primary.main, display: 'block' }}>
          The Journey
        </Typography>
        <Typography variant="h3" sx={{ mt: 1, mb: 2, letterSpacing: '-1.5px' }}>
          Built for{' '}
          <Box component="span" sx={{
            background: GRADIENTS.secondary,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Efficiency
          </Box>
        </Typography>
      </Box>

      <Grid container spacing={6}>
        {STEPS.map((step, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={step.number}>
            <Box sx={{ textAlign: 'center', position: 'relative', p: 4 }}>
              <Typography
                sx={{
                  fontSize: '8rem',
                  background: index === 1 ? GRADIENTS.secondary : GRADIENTS.primary,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  opacity: 0.1,
                  lineHeight: 1,
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 0
                }}
              >
                {step.number}
              </Typography>
              <Typography variant="h4" sx={{ mb: 2, position: 'relative', zIndex: 1, color: COLORS.text.primary }}>
                {step.title}
              </Typography>
              <Typography variant="body1" sx={{ color: COLORS.text.secondary, lineHeight: 1.8, position: 'relative', zIndex: 1, maxWidth: 320, mx: 'auto' }}>
                {step.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

const CallToActionSection = () => (
  <Box
    id="contact"
    sx={{
      py: { xs: 12, md: 16 },
      background: GRADIENTS.primary,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle at 20% 50%, #fff 0%, transparent 40%), radial-gradient(circle at 80% 50%, #fff 0%, transparent 40%)' }} />

    <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
      <Typography variant="h3" sx={{ color: 'white', mb: 3, letterSpacing: '-2px' }}>
        Transform Your Practice Today
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 6, lineHeight: 1.8, maxWidth: 600, mx: 'auto' }}>
        Scale your clinic with intelligent tools designed to reduce overhead and improve patient outcomes.
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          component={Link}
          href="/register"
          variant="contained"
          size="large"
          sx={{
            px: 6,
            py: 2.5,
            bgcolor: 'white',
            color: COLORS.primary.contrast,
            borderRadius: BORDER_RADIUS.full,
            boxShadow: SHADOWS.large,
            '&:hover': {
              bgcolor: '#f8ffff',
              transform: 'translateY(-5px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            },
          }}
        >
          Start Free Pilot
        </Button>
        <Button
          component={Link}
          href="/login"
          variant="outlined"
          size="large"
          sx={{
            px: 6,
            py: 2.5,
            color: 'white',
            borderColor: 'rgba(255,255,255,0.4)',
            borderWidth: 2,
            borderRadius: BORDER_RADIUS.full,
            '&:hover': {
              borderColor: 'white',
              borderWidth: 2,
              bgcolor: 'rgba(255,255,255,0.1)',
              transform: 'translateY(-5px)',
            },
          }}
        >
          Sign In
        </Button>
      </Box>
    </Container>
  </Box>
);

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: COLORS.background.default }}>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorksSection />
      <CallToActionSection />
      <Footer />
    </Box>
  );
}
