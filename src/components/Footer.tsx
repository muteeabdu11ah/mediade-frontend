'use client';

import React from 'react';
import { Box, Container, Typography, Grid, IconButton, Link as MuiLink, Divider } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import Link from 'next/link';

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
                background: 'linear-gradient(180deg, #F0FDFD 0%, #E0F7FA 100%)',
                pt: 8,
                pb: 4,
                mt: 'auto',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Brand */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <LocalHospitalIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Aeyron Medical
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280, mb: 2, lineHeight: 1.8 }}>
                            Modern healthcare management platform. Connecting patients with doctors through seamless appointment booking and clinic management.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'primary.main',
                                    bgcolor: 'rgba(0,188,212,0.08)',
                                    '&:hover': { bgcolor: 'rgba(0,188,212,0.16)' },
                                }}
                            >
                                <TwitterIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'primary.main',
                                    bgcolor: 'rgba(0,188,212,0.08)',
                                    '&:hover': { bgcolor: 'rgba(0,188,212,0.16)' },
                                }}
                            >
                                <LinkedInIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'primary.main',
                                    bgcolor: 'rgba(0,188,212,0.08)',
                                    '&:hover': { bgcolor: 'rgba(0,188,212,0.16)' },
                                }}
                            >
                                <EmailIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <Grid size={{ xs: 6, sm: 4, md: 2 }} key={category}>
                            <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
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
                                        color: 'text.secondary',
                                        mb: 1.5,
                                        fontSize: '0.875rem',
                                        transition: 'color 0.2s',
                                        '&:hover': { color: 'primary.main' },
                                    }}
                                >
                                    {link.label}
                                </MuiLink>
                            ))}
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(0,188,212,0.12)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        © {new Date().getFullYear()} Aeyron Medical. All rights reserved.
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Built with ❤️ for better healthcare
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
