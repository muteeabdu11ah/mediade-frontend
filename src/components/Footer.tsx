'use client';

import React from 'react';
import { Box, Container, Typography, Grid, IconButton, Link as MuiLink, Divider } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import Link from 'next/link';

import { COLORS, GRADIENTS, BORDER_RADIUS, SHADOWS } from '@/lib/constants/design-tokens';

const footerLinks = {
    Product: [
        { label: 'Features', href: '/#features' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'About', href: '/#about' },
    ],
    Support: [
        { label: 'Help Center', href: '#' },
        { label: 'Contact', href: '/#contact' },
        { label: 'FAQs', href: '#' },
    ],
    Legal: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'HIPAA Compliance', href: '#' },
    ],
};

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                background: COLORS.background.subtle,
                pt: 10,
                pb: 6,
                mt: 'auto',
                borderTop: `1px solid ${COLORS.border.light}`
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={6}>
                    {/* Brand */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <Box sx={{
                                background: GRADIENTS.primary,
                                p: 1,
                                borderRadius: BORDER_RADIUS.sm,
                                display: 'flex',
                                boxShadow: SHADOWS.small
                            }}>
                                <LocalHospitalIcon sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 900,
                                    background: GRADIENTS.primary,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '-1px',
                                    fontSize: '1.4rem',
                                }}
                            >
                                Medaide
                            </Typography>
                        </Box>
                        <Typography variant="body2" color={COLORS.text.secondary} sx={{ maxWidth: 300, mb: 4, lineHeight: 1.8, fontWeight: 500 }}>
                            A complete healthcare ecosystem designed to modernize patient-doctor interactions and streamline clinic operations with state-of-the-art technology.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            {[
                                { icon: <TwitterIcon fontSize="small" />, label: 'Twitter' },
                                { icon: <LinkedInIcon fontSize="small" />, label: 'LinkedIn' },
                                { icon: <EmailIcon fontSize="small" />, label: 'Email' }
                            ].map((social, idx) => (
                                <IconButton
                                    key={idx}
                                    size="small"
                                    sx={{
                                        color: COLORS.primary.main,
                                        bgcolor: COLORS.primary.subtle,
                                        border: `1px solid ${COLORS.border.light}`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: COLORS.primary.main,
                                            color: 'white',
                                            transform: 'translateY(-3px)',
                                            boxShadow: SHADOWS.medium
                                        },
                                    }}
                                >
                                    {social.icon}
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <Grid size={{ xs: 6, sm: 4, md: 2 }} key={category}>
                            <Typography variant="subtitle2" fontWeight={800} color={COLORS.text.primary} sx={{ mb: 3, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {category}
                            </Typography>
                            {links.map((link) => (
                                <MuiLink
                                    key={link.label}
                                    component={Link}
                                    href={link.href}
                                    underline="none"
                                    sx={{
                                        display: 'block',
                                        color: COLORS.text.secondary,
                                        mb: 2,
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            color: COLORS.primary.main,
                                            pl: 0.5
                                        },
                                    }}
                                >
                                    {link.label}
                                </MuiLink>
                            ))}
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ my: 6, opacity: 0.5 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: COLORS.text.muted, fontWeight: 600 }}>
                        © {new Date().getFullYear()} Medaide. All rights reserved.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Typography variant="caption" sx={{ color: COLORS.text.muted, fontWeight: 600 }}>
                            Privacy Policy
                        </Typography>
                        <Typography variant="caption" sx={{ color: COLORS.text.muted, fontWeight: 600 }}>
                            Terms of Service
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
